import test from 'node:test';
import assert from 'node:assert/strict';
import '../app/model.js';

const { AFFECTED_MACHINES, MACHINE_GROUPS, DEMO_SALES_HISTORY, parseSalesCsv, salesCsv, calculateForecast, planImpact } = globalThis.PrintPilotModel;

test('Flotte und PETG-Rot-Szenario bleiben konsistent', () => {
  assert.equal(MACHINE_GROUPS.reduce((sum, group) => sum + group.count, 0), 100);
  assert.equal(AFFECTED_MACHINES.length, 6);
  assert.equal(AFFECTED_MACHINES.filter(machine => machine.group === 'Standard').length, 3);
  assert.equal(AFFECTED_MACHINES.filter(machine => machine.group === 'Großformat').length, 3);
});

test('Basisrechnung und rechtzeitige Zusatzmenge', () => {
  const forecast = calculateForecast({ demand: 100, stock: 18, deliveryDay: 10 });
  assert.equal(forecast.demand14, 33.9);
  assert.equal(forecast.firstBelowSafety, 3);
  assert.equal(forecast.minimumStock, -3.5);
  assert.equal(forecast.reorderKg, 20);
  assert.ok(forecast.minimumStock + forecast.reorderKg >= 12);
});

test('Fünf Jahre Verkäufe speisen die Prognose', () => {
  assert.equal(DEMO_SALES_HISTORY.length, 60);
  assert.equal(DEMO_SALES_HISTORY[0].month, '2021-10');
  assert.equal(DEMO_SALES_HISTORY.at(-1).month, '2026-09');
  const base = calculateForecast({ history: DEMO_SALES_HISTORY });
  const higherConsumption = DEMO_SALES_HISTORY.map(row => ({ ...row, petgKg: row.petgKg * 1.5 }));
  const changed = calculateForecast({ history: higherConsumption });
  assert.ok(changed.demand14 > base.demand14 * 1.4);
});

test('Lokale CSV kann importiert werden und weist Lücken zurück', () => {
  assert.deepEqual(parseSalesCsv(salesCsv(DEMO_SALES_HISTORY)), DEMO_SALES_HISTORY);
  const broken = DEMO_SALES_HISTORY.filter(row => row.month !== '2024-06');
  assert.throws(() => parseSalesCsv(salesCsv(broken)), /lückenlos|mindestens 60/);
});

test('Mehr Nachfrage und spätere Lieferung verschlechtern den Tiefststand', () => {
  const base = calculateForecast({ demand: 100, stock: 18, deliveryDay: 10 });
  const rush = calculateForecast({ demand: 130, stock: 18, deliveryDay: 10 });
  const delay = calculateForecast({ demand: 100, stock: 18, deliveryDay: 13 });
  assert.ok(rush.minimumStock < base.minimumStock);
  assert.ok(delay.minimumStock < base.minimumStock);
});

test('Hoher Bestand benötigt keinen Zusatzvorschlag', () => {
  const forecast = calculateForecast({ demand: 70, stock: 48, deliveryDay: 7 });
  assert.equal(forecast.firstBelowSafety, null);
  assert.equal(forecast.reorderKg, 0);
});

test('Demo-Freigaben reduzieren die gefährdeten Aufträge einzeln', () => {
  assert.equal(planImpact({ move: false, sequence: false }).affectedAfter, 6);
  assert.equal(planImpact({ move: true, sequence: false }).affectedAfter, 4);
  assert.equal(planImpact({ move: true, sequence: true }).affectedAfter, 2);
});
