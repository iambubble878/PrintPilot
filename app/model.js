(function () {
const MACHINE_GROUPS = [
  { id: 'standard', label: 'Standard', count: 60, active: 51, color: '#7049e8' },
  { id: 'technical', label: 'Technisch', count: 20, active: 17, color: '#21a7a2' },
  { id: 'large', label: 'Großformat', count: 20, active: 16, color: '#f2ae57' },
];

const AFFECTED_MACHINES = [
  { id: 'STD-014', group: 'Standard', job: 'Gehäuse Serie A', deadline: '28. Okt', material: 'PETG Rot', impact: 'hoch' },
  { id: 'STD-026', group: 'Standard', job: 'Sensorgehäuse', deadline: '29. Okt', material: 'PETG Rot', impact: 'mittel' },
  { id: 'STD-041', group: 'Standard', job: 'Halterungen B2', deadline: '30. Okt', material: 'PETG Rot', impact: 'mittel' },
  { id: 'GF-003', group: 'Großformat', job: 'Displayträger', deadline: '29. Okt', material: 'PETG Rot', impact: 'hoch' },
  { id: 'GF-011', group: 'Großformat', job: 'Montageplatte', deadline: '31. Okt', material: 'PETG Rot', impact: 'mittel' },
  { id: 'GF-018', group: 'Großformat', job: 'Schutzabdeckung', deadline: '01. Nov', material: 'PETG Rot', impact: 'mittel' },
];

const SCENARIOS = {
  basis: { label: 'Basisplanung', demand: 100, stock: 18, deliveryDay: 10 },
  rush: { label: 'Nachfragespitze', demand: 130, stock: 18, deliveryDay: 10 },
  delay: { label: 'Lieferverzug', demand: 100, stock: 18, deliveryDay: 13 },
};

const HORIZON = 14;
const SAFETY_STOCK = 12;
const INCOMING_KG = 18;
const FORECAST_START = new Date(Date.UTC(2026, 9, 27));
const SEASON = [0.91, 0.90, 0.99, 1.01, 1.05, 1.04, 0.92, 0.96, 1.07, 1.12, 1.15, 0.98];

function createDemoSalesHistory() {
  return Array.from({ length: 60 }, (_, index) => {
    const date = new Date(Date.UTC(2021, 9 + index, 1));
    const month = date.toISOString().slice(0, 7);
    const units = Math.round((177 + index * 0.48) * SEASON[date.getUTCMonth()] * (1 + 0.022 * Math.sin(index * 1.7)));
    const petgKg = Math.round(units * (0.315 + 0.007 * Math.cos(index * 0.65)) * 10) / 10;
    return { month, units, petgKg };
  });
}

const DEMO_SALES_HISTORY = createDemoSalesHistory();

function parseSalesCsv(text) {
  const lines = text.replace(/^\uFEFF/, '').trim().split(/\r?\n/).filter(Boolean);
  if (lines.length < 61) throw new Error('Die CSV benötigt eine Kopfzeile und mindestens 60 Monatswerte.');
  const delimiter = lines[0].includes(';') ? ';' : ',';
  const header = lines.shift().split(delimiter).map(value => value.trim().toLowerCase());
  if (header.join('|') !== 'monat|verkaufte_teile|petg_rot_kg') {
    throw new Error('Erwartete Spalten: monat;verkaufte_teile;petg_rot_kg.');
  }
  const rows = lines.map((line, index) => {
    const fields = line.split(delimiter).map(value => value.trim());
    if (fields.length !== 3 || !/^\d{4}-(0[1-9]|1[0-2])$/.test(fields[0])) {
      throw new Error(`Ungültiger Monat oder Spaltenzahl in Datenzeile ${index + 1}.`);
    }
    const units = Number(fields[1]);
    const petgKg = Number(fields[2].replace(',', '.'));
    if (!Number.isInteger(units) || units < 0 || !Number.isFinite(petgKg) || petgKg < 0) {
      throw new Error(`Ungültige Verkaufs- oder Materialmenge in Datenzeile ${index + 1}.`);
    }
    return { month: fields[0], units, petgKg };
  });
  const recent = rows.slice(-60);
  for (let index = 1; index < recent.length; index++) {
    const previous = Number(recent[index - 1].month.slice(0, 4)) * 12 + Number(recent[index - 1].month.slice(5));
    const current = Number(recent[index].month.slice(0, 4)) * 12 + Number(recent[index].month.slice(5));
    if (current !== previous + 1) throw new Error('Die letzten 60 Monate müssen lückenlos und chronologisch sortiert sein.');
  }
  if (recent.slice(-12).reduce((sum, row) => sum + row.units, 0) === 0) {
    throw new Error('In den letzten zwölf Monaten fehlen verkaufte Teile für die Materialumrechnung.');
  }
  if (recent.slice(-24, -12).reduce((sum, row) => sum + row.units, 0) === 0) {
    throw new Error('Für den Vorjahrestrend fehlen Verkaufsdaten im davorliegenden Jahr.');
  }
  if (recent.at(-1).month > '2026-09') {
    throw new Error('Für diese Demo dürfen die Daten nur bis zum letzten vollen Monat September 2026 reichen.');
  }
  return recent;
}

function salesCsv(history) {
  return '\uFEFFmonat;verkaufte_teile;petg_rot_kg\r\n' + history.map(row =>
    `${row.month};${row.units};${String(row.petgKg).replace('.', ',')}`
  ).join('\r\n');
}

function projectSales(history, start = FORECAST_START) {
  const average = values => values.reduce((sum, value) => sum + value, 0) / values.length;
  const overall = average(history.map(row => row.units));
  const season = Array.from({ length: 12 }, (_, month) =>
    average(history.filter(row => Number(row.month.slice(5)) === month + 1).map(row => row.units)) / overall
  );
  const recent = history.slice(-12);
  const previous = history.slice(-24, -12);
  const recentAvg = average(recent.map(row => row.units));
  const priorAvg = average(previous.map(row => row.units));
  const trend = Math.max(-0.10, Math.min(0.10, (recentAvg / priorAvg - 1) * 0.5));
  const kgPerUnit = recent.reduce((sum, row) => sum + row.petgKg, 0) / recent.reduce((sum, row) => sum + row.units, 0);
  const dailyKg = Array.from({ length: HORIZON }, (_, offset) => {
    const date = new Date(Date.UTC(start.getUTCFullYear(), start.getUTCMonth(), start.getUTCDate() + offset));
    const month = date.getUTCMonth();
    const daysInMonth = new Date(Date.UTC(date.getUTCFullYear(), month + 1, 0)).getUTCDate();
    return recentAvg * season[month] * (1 + trend) * kgPerUnit / daysInMonth;
  });
  return { dailyKg, kgPerUnit, recentAvg, trend, firstMonth: history[0].month, lastMonth: history.at(-1).month };
}

function calculateForecast({ demand = 100, stock = 18, deliveryDay = 10, history = DEMO_SALES_HISTORY }) {
  const projection = projectSales(history);
  const dailyDemand = projection.dailyKg.map(value => value * demand / 100);
  let consumed = 0;
  const series = Array.from({ length: HORIZON + 1 }, (_, day) => {
    if (day > 0) consumed += dailyDemand[day - 1];
    const incoming = day >= deliveryDay ? INCOMING_KG : 0;
    return { day, stock: Math.round((stock - consumed + incoming) * 10) / 10 };
  });
  const firstBelowSafety = series.find(point => point.stock < SAFETY_STOCK)?.day ?? null;
  const firstEmpty = series.find(point => point.stock <= 0)?.day ?? null;
  const endStock = series[HORIZON].stock;
  const demand14 = Math.round(consumed * 10) / 10;
  const daily = Math.round(consumed / HORIZON * 100) / 100;
  const minimumStock = Math.min(...series.map(point => point.stock));
  const reorderKg = Math.max(0, Math.ceil((SAFETY_STOCK - minimumStock) / 5) * 5);
  return { series, daily, demand14, endStock, minimumStock, firstBelowSafety, firstEmpty, reorderKg, gapKg: Math.max(0, Math.round((SAFETY_STOCK - minimumStock) * 10) / 10), projection };
}

function planImpact(approved) {
  const moved = approved.move ? 2 : 0;
  const sequenced = approved.sequence ? 2 : 0;
  return { affectedBefore: 6, affectedAfter: 6 - moved - sequenced, moved, sequenced };
}

globalThis.PrintPilotModel = { MACHINE_GROUPS, AFFECTED_MACHINES, SCENARIOS, SAFETY_STOCK, DEMO_SALES_HISTORY, parseSalesCsv, salesCsv, projectSales, calculateForecast, planImpact };
})();
