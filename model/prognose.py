"""PrintPilot: kostenlose tägliche Nachfrageprognose aus Verkaeufe.csv.

Aufruf: python prognose.py --csv Verkaeufe.csv --output printpilot_prognose.json
Benötigt: pandas, numpy, scikit-learn (siehe requirements.txt).
"""

from __future__ import annotations

import argparse
import json
from datetime import datetime, timezone
from pathlib import Path

import numpy as np
import pandas as pd
try:
    from sklearn.ensemble import HistGradientBoostingRegressor
except ModuleNotFoundError as exc:
    raise SystemExit("scikit-learn fehlt. Im Projektordner zuerst 'python -m pip install -r requirements.txt' ausführen.") from exc


LAGS = (1, 7, 14, 28)
MAX_LAG = max(LAGS)
HORIZONS = (30, 60, 90)
def read_history(path: Path) -> tuple[pd.DatetimeIndex, list[str], dict[str, str], np.ndarray]:
    required = {
        "datum", "produkt_id", "material_id", "verkauft_stueck", "nachfrage_sim_stueck",
        "nicht_bedient_stueck", "preis_netto_eur", "umsatz_netto_eur", "aktion_0_1",
    }
    df = pd.read_csv(path, sep=";", decimal=",", encoding="utf-8-sig")
    missing = required - set(df.columns)
    if missing:
        raise ValueError(f"Fehlende CSV-Spalten: {', '.join(sorted(missing))}")
    if df[list(required)].isna().any().any():
        raise ValueError("In einer benötigten CSV-Spalte fehlt mindestens ein Wert.")
    df["datum"] = pd.to_datetime(df["datum"], format="%Y-%m-%d", errors="coerce")
    if df["datum"].isna().any():
        raise ValueError("Mindestens ein Datum ist ungültig (erwartet: JJJJ-MM-TT).")
    if df.duplicated(["datum", "produkt_id"]).any():
        raise ValueError("Doppelte Kombination aus Datum und Produkt-ID gefunden.")
    for col in ("verkauft_stueck", "nachfrage_sim_stueck", "nicht_bedient_stueck"):
        if (df[col] < 0).any() or (df[col] % 1 != 0).any():
            raise ValueError(f"{col} muss eine nichtnegative ganze Zahl sein.")
    if not (df["nachfrage_sim_stueck"] == df["verkauft_stueck"] + df["nicht_bedient_stueck"]).all():
        raise ValueError("Nachfrage stimmt nicht mit Verkäufen plus nicht bedienter Menge überein.")
    if (df["preis_netto_eur"] <= 0).any() or (df["umsatz_netto_eur"] < 0).any():
        raise ValueError("Preis muss positiv und Umsatz nichtnegativ sein.")
    if not df["aktion_0_1"].isin([0, 1]).all():
        raise ValueError("aktion_0_1 darf nur 0 oder 1 enthalten.")
    if ((df["verkauft_stueck"] * df["preis_netto_eur"] - df["umsatz_netto_eur"]).abs() > 0.011).any():
        raise ValueError("Umsatz stimmt nicht mit Verkaufsmenge mal Preis überein.")

    days = pd.date_range(df["datum"].min(), df["datum"].max(), freq="D")
    products = sorted(df["produkt_id"].astype(str).unique().tolist())
    if (df.groupby("produkt_id")["material_id"].nunique() != 1).any():
        raise ValueError("Mindestens einem Produkt sind mehrere Material-IDs zugeordnet.")
    material_by_product = df.drop_duplicates("produkt_id").set_index("produkt_id")["material_id"].astype(str).to_dict()
    expected = len(days) * len(products)
    if len(df) != expected:
        raise ValueError("Mindestens ein Tag oder eine Produkt-Zeile fehlt. Fehlende Werte nicht als 0 auffüllen.")
    table = df.pivot(index="datum", columns="produkt_id", values="nachfrage_sim_stueck")
    table = table.reindex(index=days, columns=products)
    if table.isna().any().any():
        raise ValueError("Mindestens ein Tag oder ein Produkt fehlt.")
    if len(days) < 365:
        raise ValueError("Für diesen 90-Tage-Rückblick werden mindestens 365 vollständige Tage benötigt.")
    return days, products, material_by_product, table.to_numpy(dtype=float)


def feature_row(history: list[float] | np.ndarray, day: pd.Timestamp,
                product_index: int, number_of_products: int) -> list[float]:
    if len(history) < MAX_LAG:
        raise ValueError("Für die Merkmale fehlen mindestens 28 historische Tage.")
    doy_angle = 2 * np.pi * (day.dayofyear - 1) / 365.25
    row = [float(history[-lag]) for lag in LAGS]
    row += [float(np.mean(history[-7:])), float(np.mean(history[-28:]))]
    row += [float(day.dayofweek), float(day.month), float(np.sin(doy_angle)), float(np.cos(doy_angle))]
    row += [float(i == product_index) for i in range(number_of_products)]
    return row


def training_examples(days: pd.DatetimeIndex, products: list[str], demand: np.ndarray,
                      end_index: int) -> tuple[np.ndarray, np.ndarray]:
    x, y = [], []
    for day_index in range(MAX_LAG, end_index):
        for product_index in range(len(products)):
            x.append(feature_row(demand[:day_index, product_index], days[day_index],
                                 product_index, len(products)))
            y.append(demand[day_index, product_index])
    return np.asarray(x, dtype=float), np.asarray(y, dtype=float)


def fit_model(days: pd.DatetimeIndex, products: list[str], demand: np.ndarray,
              end_index: int) -> HistGradientBoostingRegressor:
    x, y = training_examples(days, products, demand, end_index)
    model = HistGradientBoostingRegressor(
        loss="poisson", max_iter=120, max_leaf_nodes=15,
        min_samples_leaf=30, l2_regularization=5.0,
        early_stopping=False, categorical_features=None, random_state=42,
    )
    model.fit(x, y)
    return model


def predict_days(model: HistGradientBoostingRegressor, days: pd.DatetimeIndex,
                 products: list[str], known_demand: np.ndarray,
                 start_index: int, horizon: int = 90) -> np.ndarray:
    history = [known_demand[:start_index, j].tolist() for j in range(len(products))]
    result = np.empty((horizon, len(products)), dtype=int)
    for step in range(horizon):
        day = days[start_index + step] if start_index + step < len(days) else days[-1] + pd.Timedelta(days=start_index + step - len(days) + 1)
        features = np.asarray([
            feature_row(history[j], day, j, len(products)) for j in range(len(products))
        ], dtype=float)
        predictions = np.rint(np.maximum(0, model.predict(features))).astype(int)
        result[step] = predictions
        for j, value in enumerate(predictions):
            history[j].append(float(value))
    return result


def seasonal_baseline(known_demand: np.ndarray, start_index: int, horizon: int = 90) -> np.ndarray:
    history = [known_demand[:start_index, j].tolist() for j in range(known_demand.shape[1])]
    result = np.empty((horizon, known_demand.shape[1]), dtype=int)
    for step in range(horizon):
        for j in range(known_demand.shape[1]):
            value = int(round(history[j][-7]))
            result[step, j] = value
            history[j].append(float(value))
    return result


def metrics(actual: np.ndarray, predicted: np.ndarray) -> dict[str, dict[str, float]]:
    result = {}
    for horizon in HORIZONS:
        truth = actual[:horizon]
        guess = predicted[:horizon]
        error = np.abs(truth - guess)
        result[f"{horizon}_days"] = {
            "mae_demand_units_per_product_day": round(float(error.mean()), 3),
            "wape_percent": round(float(100 * error.sum() / truth.sum()), 2),
            "actual_demand_units": int(truth.sum()),
            "predicted_demand_units": int(guess.sum()),
        }
    return result


def backtest(days: pd.DatetimeIndex, products: list[str], demand: np.ndarray,
             start_index: int) -> dict:
    model = fit_model(days, products, demand, start_index)
    forecast = predict_days(model, days, products, demand, start_index)
    baseline = seasonal_baseline(demand, start_index)
    actual = demand[start_index:start_index + 90]
    return {
        "from": days[start_index].date().isoformat(),
        "to": days[start_index + 89].date().isoformat(),
        "model": metrics(actual, forecast),
        "same_weekday_baseline": metrics(actual, baseline),
    }


def export_payload(days: pd.DatetimeIndex, products: list[str],
                   material_by_product: dict[str, str], forecast: np.ndarray,
                   validation: dict, test: dict) -> dict:
    last_day = days[-1]
    daily = []
    for offset in range(90):
        date = (last_day + pd.Timedelta(days=offset + 1)).date().isoformat()
        for j, product in enumerate(products):
            daily.append({"date": date, "product_id": product,
                          "material_id": material_by_product[product],
                          "predicted_demand_units": int(forecast[offset, j])})
    totals = {}
    for horizon in HORIZONS:
        by_product = {product: int(forecast[:horizon, j].sum())
                      for j, product in enumerate(products)}
        by_material_product_units: dict[str, int] = {}
        for product, units in by_product.items():
            material = material_by_product[product]
            by_material_product_units[material] = by_material_product_units.get(material, 0) + units
        totals[f"{horizon}_days"] = {
            "from": (last_day + pd.Timedelta(days=1)).date().isoformat(),
            "to": (last_day + pd.Timedelta(days=horizon)).date().isoformat(),
            "predicted_demand_units_total": int(sum(by_product.values())),
            "by_product": by_product,
            "by_material_product_units": by_material_product_units,
        }
    return {
        "schema_version": 2,
        "generated_at_utc": datetime.now(timezone.utc).isoformat(),
        "source": {"history_start": days[0].date().isoformat(),
                   "history_end": last_day.date().isoformat(),
                   "days": len(days), "products": products,
                   "material_by_product": material_by_product},
        "model": {"type": "scikit-learn HistGradientBoostingRegressor",
                  "target": "nachfrage_sim_stueck", "unit": "nachgefragte Stück pro Produkt und Tag",
                  "method": "recursive_daily_90_days",
                  "uses_future_price_or_promotions": False},
        "backtest": {"validation": validation, "test": test},
        "daily_forecasts": daily,
        "totals": totals,
    }


def main() -> None:
    parser = argparse.ArgumentParser(description="PrintPilot Nachfrageprognose aus historischer CSV")
    parser.add_argument("--csv", type=Path, default=Path(__file__).with_name("Verkaeufe.csv"))
    parser.add_argument("--output", type=Path, default=Path(__file__).with_name("printpilot_prognose.json"))
    args = parser.parse_args()
    days, products, material_by_product, demand = read_history(args.csv)
    if len(days) < 365:
        raise ValueError("Für Training, Validierung und Test werden mindestens 365 Tage benötigt.")
    validation_start = len(days) - 180
    test_start = len(days) - 90
    validation = backtest(days, products, demand, validation_start)
    test = backtest(days, products, demand, test_start)
    model = fit_model(days, products, demand, len(days))
    future = predict_days(model, days, products, demand, len(days))
    payload = export_payload(days, products, material_by_product, future, validation, test)
    args.output.parent.mkdir(parents=True, exist_ok=True)
    args.output.write_text(json.dumps(payload, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"Gespeichert: {args.output}")
    print(f"Historie: {days[0].date()} bis {days[-1].date()}; {len(products)} Produkte")
    print(f"Unabhängiger Test, 90 Tage: Modell-WAPE {test['model']['90_days']['wape_percent']} %, "
          f"Wochen-Baseline {test['same_weekday_baseline']['90_days']['wape_percent']} %")
    for horizon in HORIZONS:
        print(f"Nachfrageprognose {horizon} Tage: "
              f"{payload['totals'][f'{horizon}_days']['predicted_demand_units_total']} Stück")


if __name__ == "__main__":
    main()
