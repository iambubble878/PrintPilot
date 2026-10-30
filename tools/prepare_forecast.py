"""Import the supplied synthetic files without changing the originals."""
import argparse
import csv
import json
import re
from pathlib import Path


def rows(path):
    with path.open(encoding="utf-8-sig", newline="") as stream:
        return list(csv.DictReader(stream, delimiter=";"))


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--csv-dir", type=Path, required=True)
    parser.add_argument("--forecast", type=Path, required=True)
    parser.add_argument("--html", type=Path, required=True)
    args = parser.parse_args()
    root = Path(__file__).resolve().parents[1]
    forecast = json.loads(args.forecast.read_text(encoding="utf-8-sig"))
    products = rows(args.csv_dir / "Produkte.csv")
    materials = rows(args.csv_dir / "Materialien.csv")
    stocks = rows(args.csv_dir / "Lager.csv")
    end = forecast["source"]["history_end"]
    stocks = {r["material_id"]: r for r in stocks if r["datum"] == end}
    payload = {"forecast": forecast, "products": [], "materials": [], "orders": []}
    for p in products:
        payload["products"].append({"id": p["produkt_id"], "materialId": p["material_id"],
            "name": p["produktname"], "gramsPerUnit": float(p["produktgewicht_g"]), "season": p["saison"]})
    for m in materials:
        s = stocks[m["material_id"]]
        payload["materials"].append({"id": m["material_id"], "type": m["filamenttyp"], "color": m["farbe"],
            "warehouseKg": int(s["lager_ende_g"])/1000, "printerKg": int(s["drucker_ende_g"])/1000,
            "leadDays": int(m["plan_lieferzeit_tage"]), "price": float(m["standardpreis_eur_kg"])})
    for o in rows(args.csv_dir / "Einkauf.csv"):
        if o["status"] == "Offen":
            payload["orders"].append({"id": o["bestellung_id"], "materialId": o["material_id"],
                "date": o["lieferdatum_geplant"], "kg": float(o["bestellmenge_kg"])})
    (root / "app/forecast-data.json").write_text(json.dumps(payload, ensure_ascii=False, indent=2), encoding="utf-8")
    html = args.html.read_text(encoding="utf-8-sig")
    # Replace the old 2025/26 monthly regression, including its additive purchase helper.
    html, count = re.subn(r'<script>\s*\(function\(\)\{\s*const H=window\.printPilotHistory.*?</script>',
                          '<!-- Five-year ML model is embedded by tools/build-presentation.mjs. -->', html, count=1, flags=re.S)
    assert count == 1
    html, count = re.subn(r'<section class="aiForecast" id="aiForecast">.*?</section>', '', html, count=1, flags=re.S)
    assert count == 1
    html = html.replace('<div class="forecasttiles">', '<!-- PRINTPILOT_SIMULATOR --><div class="forecasttiles" hidden>')
    # Keep the original inventory, purchasing and customers as a separate snapshot.
    html = html.replace("const forecast=fc.find(", "const forecast=(window.printPilotForecastRows||[]).find(")
    html = html.replace('4-Wochen-Prognose ', '30-Tage-KI-Basisprognose ')
    html = html.replace('Zusätzlicher prognostizierter Bedarf in den nächsten vier Wochen:', 'KI-Basisbedarf für 30 Tage (enthält ggf. diesen Auftrag):')
    marker = " document.querySelectorAll('#customerOrders tbody tr[data-order-id]').forEach(row=>{analyze(row);"
    html = html.replace(marker, " window.addEventListener('printpilot-model-ready',()=>document.querySelectorAll('#customerOrders tbody tr[data-order-id]').forEach(analyze));\n" + marker)
    html = re.sub(r'<title>.*?</title>', '<title>PrintPilot · KI-Prognose und Szenarien</title>', html, count=1)
    html = re.sub(r"@import url\('https://fonts.googleapis.com/[^\n]+\n", '', html)
    # Repair a missing script closing tag in the supplied customer-status block.
    html = html.replace("\n<script>\n(function(){\n const all=window.printPilotAllProcurementItems", "\n</script><script>\n(function(){\n const all=window.printPilotAllProcurementItems")
    (root / "app/presentation-base.html").write_text(html, encoding="utf-8")
    print(f"Imported {len(forecast['daily_forecasts'])} predictions, {len(products)} products, {len(stocks)} stocks, {len(payload['orders'])} open orders.")


if __name__ == "__main__":
    main()
