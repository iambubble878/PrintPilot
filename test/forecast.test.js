import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { Script, runInNewContext } from 'node:vm';

const data = JSON.parse(await readFile(new URL('../app/forecast-data.json', import.meta.url), 'utf8'));
const context = {};
runInNewContext(await readFile(new URL('../app/forecast-model.js', import.meta.url), 'utf8'), context);
const { calculate, addDays, presets } = context.PrintPilotForecast;
const close = (a, b) => assert.ok(Math.abs(a - b) < 1e-7, `${a} != ${b}`);

test('Random-Forest-Tageswerte sind vollständig und stimmen mit den Horizontsummen überein', () => {
  assert.equal(data.forecast.model.type, 'scikit-learn RandomForestRegressor');
  const rows = data.forecast.daily_forecasts;
  assert.equal(rows.length, 90 * 12);
  assert.equal(new Set(rows.map(r => r.date + r.product_id)).size, rows.length);
  for (let i = 0; i < 90; i++) {
    const date = addDays('2026-10-22', i);
    assert.equal(rows.filter(r => r.date === date).length, 12);
  }
  for (const horizon of [28, 30, 60, 90]) {
    const result = calculate(data, { horizon });
    const reference = data.forecast.totals[horizon + '_days'];
    assert.equal(result.units, reference.predicted_demand_units_total);
    for (const product of result.products) assert.equal(product.units, reference.by_product[product.id]);
  }
});

test('Vier Wochen zeigen genau 28 Tage ab dem fiktiven Datenstand', () => {
  const result = calculate(data);
  assert.equal(result.options.horizon, 28);
  assert.equal(result.start, '2026-10-22');
  assert.equal(result.end, '2026-11-18');
  assert.equal(result.daily.length, 28);
  const expected = data.forecast.daily_forecasts.filter(row => row.date <= result.end)
    .reduce((sum, row) => sum + row.predicted_demand_units, 0);
  assert.equal(result.units, expected);
  assert.equal(result.units, data.forecast.totals['28_days'].predicted_demand_units_total);
  assert.equal(calculate(data, { horizon: 30 }).units, data.forecast.totals['30_days'].predicted_demand_units_total);
});

test('Grammfaktoren, Ausgangsbestand und Materialsalden rechnen unabhängig nach', () => {
  const result = calculate(data, { horizon: 60, scrap: 12, stock: 75, demand: 135 });
  for (const m of result.materials) {
    const units = data.forecast.daily_forecasts.filter(r => r.material_id === m.id && r.date <= result.end)
      .reduce((sum, r) => sum + Math.round(r.predicted_demand_units * 1.35), 0);
    const p = data.products.find(p => p.materialId === m.id);
    close(m.needKg, units * p.gramsPerUnit * 1.12 / 1000);
    close(m.startingKg, (m.warehouseKg + m.printerKg) * .75);
    close(m.endKg, m.startingKg + m.scheduledKg - m.needKg);
    assert.equal(m.extraKg, Math.max(0, Math.ceil(3 - m.minKg - 1e-9)));
  }
  close(result.needKg, result.products.reduce((sum, p) => sum + p.kg, 0));
  assert.equal(result.units, result.products.reduce((sum, p) => sum + p.units, 0));
});

test('Einzelmaterialfilter entspricht exakt dem jeweiligen Teil der Gesamtrechnung', () => {
  const all = calculate(data, { horizon: 90, delay: 14 });
  for (const m of all.materials) {
    const single = calculate(data, { horizon: 90, delay: 14, material: m.id });
    assert.equal(single.materials.length, 1);
    close(single.needKg, m.needKg);
    assert.equal(single.extraKg, m.extraKg);
    close(single.daily.at(-1).balanceKg, m.endKg);
  }
});

test('Szenarien reagieren sinnvoll und verändern die Quelldaten nicht', () => {
  const before = JSON.stringify(data), base = calculate(data), rush = calculate(data, presets.rush);
  const delay = calculate(data, presets.delay), shortage = calculate(data, presets.shortage);
  assert.ok(rush.needKg > base.needKg);
  assert.ok(rush.extraKg >= base.extraKg);
  assert.ok(delay.extraKg >= base.extraKg);
  assert.ok(shortage.extraKg >= base.extraKg);
  assert.ok(calculate(data, { scrap: 20 }).needKg > base.needKg);
  assert.ok(calculate(data, { safety: 20 }).extraKg >= base.extraKg);
  assert.equal(JSON.stringify(data), before);
});

test('Überfällige Mengen bleiben draußen; spätere Zugänge verstecken frühere Fehlmengen nicht', () => {
  const fixture = {
    forecast: { source: { history_end: '2026-10-21' }, daily_forecasts: Array.from({ length: 90 }, (_, i) => ({
      date: addDays('2026-10-22', i), product_id: 'P', material_id: 'M', predicted_demand_units: 1
    })) },
    products: [{ id: 'P', materialId: 'M', gramsPerUnit: 1000 }],
    materials: [{ id: 'M', warehouseKg: 0, printerKg: 0, leadDays: 10 }],
    orders: [{ materialId: 'M', date: '2026-10-20', kg: 999 }, { materialId: 'M', date: '2026-11-01', kg: 100 }]
  };
  const result = calculate(fixture, { horizon: 30, scrap: 0, safety: 0 });
  const m = result.materials[0];
  assert.equal(m.overdueKg, 999);
  assert.equal(m.minKg, -10);
  assert.equal(m.extraKg, 10);
  assert.equal(m.shortage, '2026-10-22');
  assert.equal(m.orderBy, '2026-10-12');
  assert.equal(m.urgent, true);
  assert.equal(m.endKg, 70);
  assert.equal(calculate(fixture, { horizon: 30, scrap: 0, safety: 0, delay: 14 }).extraKg, 24);
  assert.equal(calculate(fixture, { horizon: 30, demand: 0, safety: 0 }).extraKg, 0);
});

test('Unzulässige Annahmen werden abgewiesen', () => {
  for (const options of [{ horizon: 29 }, { demand: NaN }, { stock: -1 }, { delay: Infinity }, { material: 'unknown' }]) {
    assert.throws(() => calculate(data, options));
  }
});

test('Einzeldatei enthält lauffähige klassische Skripte, KI-Daten und sämtliche Szenariosteuerungen', async () => {
  const html = await readFile(new URL('../index.html', import.meta.url), 'utf8');
  let count = 0;
  for (const [, attributes, source] of html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/g)) {
    assert.doesNotMatch(attributes, /src=|type="module"/);
    assert.doesNotThrow(() => new Script(source, { filename: `index-script-${++count}` }));
  }
  assert.ok(count > 10);
  assert.doesNotMatch(html, /PRINTPILOT_SIMULATOR|fonts.googleapis.com|function fitPredict/);
  assert.match(html, /window.PrintPilotData=/);
  assert.match(html, /Random Forest für die Vorführung/);
  assert.doesNotMatch(html, /Histogram Gradient Boosting/);
  for (const id of ['kiHorizon', 'kiMaterial', 'kiDemand', 'kiStock', 'kiDelay', 'kiScrap', 'kiSafety', 'kiChart', 'kiMaterials', 'kiExport', 'kiReview']) {
    assert.equal([...html.matchAll(new RegExp(`id="${id}"`, 'g'))].length, 1, id);
  }
});
