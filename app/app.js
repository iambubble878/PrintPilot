(function () {
const { AFFECTED_MACHINES, MACHINE_GROUPS, SCENARIOS, SAFETY_STOCK, DEMO_SALES_HISTORY, parseSalesCsv, salesCsv, calculateForecast, planImpact } = globalThis.PrintPilotModel;

const icons = {
  grid: '<rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/>',
  chart: '<path d="M3 19h18M5 15l5-5 4 3 5-7"/><path d="M16 6h3v3"/>',
  calendar: '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M7 3v4M17 3v4M3 10h18M8 15h3M14 15h3"/>',
  play: '<circle cx="12" cy="12" r="9"/><path d="m10 8 6 4-6 4V8Z"/>',
  printer: '<rect x="5" y="3" width="14" height="6" rx="1"/><rect x="3" y="9" width="18" height="9" rx="2"/><path d="M7 15h10v6H7zM17 12h.01"/>',
  alert: '<path d="m10.4 3.8-8 14A2 2 0 0 0 4.1 21h15.8a2 2 0 0 0 1.7-3.2l-8-14a2 2 0 0 0-3.2 0Z"/><path d="M12 9v5m0 3h.01"/>',
  layers: '<path d="m12 3 9 5-9 5-9-5 9-5Zm-9 9 9 5 9-5M3 16l9 5 9-5"/>',
  target: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1"/>',
  bulb: '<path d="M9 18h6M10 21h4M8 15a7 7 0 1 1 8 0c-.7.7-1 1.5-1 3H9c0-1.5-.3-2.3-1-3Z"/>',
  user: '<circle cx="12" cy="8" r="4"/><path d="M4 21c1-4 4-6 8-6s7 2 8 6"/>',
  info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v6m0-10h.01"/>',
  sparkles: '<path d="m12 3 1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8L12 3ZM19 17l.7 1.3L21 19l-1.3.7L19 21l-.7-1.3L17 19l1.3-.7L19 17Z"/>',
  sliders: '<path d="M4 7h16M4 17h16"/><circle cx="9" cy="7" r="2" fill="white"/><circle cx="16" cy="17" r="2" fill="white"/>',
  clipboard: '<rect x="5" y="4" width="14" height="17" rx="2"/><path d="M9 4.5V3h6v1.5M9 10h6m-6 4h6"/>',
  shield: '<path d="M12 2 4 5v6c0 5 3 8 8 11 5-3 8-6 8-11V5l-8-3Z"/><path d="m9 12 2 2 4-4"/>',
  route: '<circle cx="5" cy="5" r="2"/><circle cx="19" cy="19" r="2"/><path d="M5 7v7a4 4 0 0 0 4 4h8M11 6h7v7m-4-4 4 4 4-4"/>',
};

document.querySelectorAll('[data-icon]').forEach(el => {
  const content = icons[el.dataset.icon];
  if (content) el.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${content}</svg>`;
});

const state = { scenario: 'basis', demand: 100, stock: 18, deliveryDay: 10, history: DEMO_SALES_HISTORY, historySource: 'demo', approved: { move: false, sequence: false }, review: false };
const $ = id => document.getElementById(id);
const kg = value => `${new Intl.NumberFormat('de-DE', { maximumFractionDigits: 1, minimumFractionDigits: Number.isInteger(value) ? 0 : 1 }).format(value)} kg`;
let toastTimer;

function toast(message) {
  const el = $('toast');
  el.textContent = message;
  el.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove('show'), 3400);
}

function navigate(page) {
  document.querySelectorAll('.page').forEach(el => el.classList.toggle('active', el.id === `page-${page}`));
  document.querySelectorAll('.nav-item').forEach(el => el.classList.toggle('active', el.dataset.page === page));
  $('breadcrumb-page').textContent = { dashboard: 'Dashboard', forecast: 'Materialprognose', planning: 'Produktionsplanung' }[page];
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function markCustomScenario() {
  state.scenario = 'custom';
  document.querySelectorAll('.scenario-button').forEach(el => el.classList.remove('active'));
}

function resetApprovals() {
  state.approved.move = false;
  state.approved.sequence = false;
  state.review = false;
  $('review-button').innerHTML = 'Zur Prüfung markieren <span>→</span>';
}

function chartSvg(forecast, suffix) {
  const w = 720, h = 285, left = 40, right = 18, top = 20, bottom = 32;
  const plotW = w - left - right, plotH = h - top - bottom;
  const low = Math.min(-5, Math.floor((forecast.minimumStock - 4) / 10) * 10);
  const high = Math.max(40, Math.ceil((Math.max(...forecast.series.map(p => p.stock)) + 4) / 10) * 10);
  const x = d => left + plotW * d / 14;
  const y = v => top + plotH * (high - v) / (high - low);
  const points = forecast.series.map(p => `${x(p.day).toFixed(1)},${y(p.stock).toFixed(1)}`).join(' ');
  const area = `${left},${y(low)} ${points} ${x(14)},${y(low)}`;
  const ticks = [low, 0, 12, 24, 36, high].filter((v, i, a) => v >= low && v <= high && a.indexOf(v) === i).sort((a,b) => a-b);
  const grid = ticks.map(v => `<line x1="${left}" x2="${w-right}" y1="${y(v)}" y2="${y(v)}" stroke="#eeeef2" stroke-dasharray="${v === SAFETY_STOCK ? '0' : '3 4'}"/><text x="${left-11}" y="${y(v)+3}" text-anchor="end" fill="#aaaab6" font-size="10">${v}</text>`).join('');
  const labels = [0,2,4,6,8,10,12,14].map(d => `<text x="${x(d)}" y="${h-5}" text-anchor="middle" fill="#aaaab6" font-size="10">${d === 0 ? 'Heute' : `Tag ${d}`}</text>`).join('');
  const safety = `<line x1="${left}" x2="${w-right}" y1="${y(SAFETY_STOCK)}" y2="${y(SAFETY_STOCK)}" stroke="#eca96d" stroke-width="1.8" stroke-dasharray="5 5"/>`;
  const deliveryX = x(state.deliveryDay);
  const delivery = `<line x1="${deliveryX}" x2="${deliveryX}" y1="${top}" y2="${h-bottom}" stroke="#d6c4fa" stroke-width="1.5" stroke-dasharray="3 4"/><rect x="${Math.min(deliveryX-35,w-92)}" y="2" width="70" height="18" rx="5" fill="#f2edfb"/><text x="${Math.min(deliveryX,w-57)}" y="14" text-anchor="middle" fill="#987cce" font-size="9" font-weight="700">+18 kg</text>`;
  const last = forecast.series[14];
  return `<svg viewBox="0 0 ${w} ${h}" role="img" aria-label="Simulierter Materialsaldo PETG Rot über 14 Tage, Endsaldo ${kg(last.stock)}"><defs><linearGradient id="fill-${suffix}" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#8c65e9" stop-opacity=".23"/><stop offset="100%" stop-color="#8c65e9" stop-opacity="0"/></linearGradient></defs>${grid}${safety}${delivery}<polygon points="${area}" fill="url(#fill-${suffix})"/><polyline points="${points}" fill="none" stroke="#7950df" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/><circle cx="${x(14)}" cy="${y(last.stock)}" r="5" fill="#7950df" stroke="white" stroke-width="2"/>${labels}</svg>`;
}

function historyChartSvg(history) {
  const width = 700, height = 154, left = 35, right = 9, top = 12, bottom = 27;
  const plotHeight = height - top - bottom;
  const max = Math.ceil(Math.max(...history.map(row => row.units)) / 50) * 50;
  const step = (width - left - right) / history.length;
  const bars = history.map((row, index) => {
    const barHeight = plotHeight * row.units / max;
    const x = left + index * step + 1;
    return `<rect x="${x.toFixed(1)}" y="${(top + plotHeight - barHeight).toFixed(1)}" width="${Math.max(3, step - 3).toFixed(1)}" height="${barHeight.toFixed(1)}" rx="2" fill="${index >= 48 ? '#7650df' : '#c9b9f3'}"/>`;
  }).join('');
  const labels = [0, 12, 24, 36, 48, 59].map(index => `<text x="${(left + index * step + step / 2).toFixed(1)}" y="${height - 5}" text-anchor="middle" fill="#a5a1b2" font-size="9">${history[index].month.slice(0, 4)}</text>`).join('');
  return `<svg viewBox="0 0 ${width} ${height}" role="img" aria-label="Verkaufte Teile pro Monat über fünf Jahre"><line x1="${left}" x2="${width - right}" y1="${top + plotHeight}" y2="${top + plotHeight}" stroke="#e9e6ef"/><text x="${left - 7}" y="${top + 9}" text-anchor="end" fill="#aaa6b4" font-size="9">${max}</text>${bars}${labels}</svg>`;
}

function renderHistory(forecast) {
  const history = state.history;
  const projection = forecast.projection;
  const units = history.reduce((sum, row) => sum + row.units, 0);
  $('history-description').textContent = `${history.length} vollständige Monate · ${projection.firstMonth} bis ${projection.lastMonth}`;
  $('history-source').textContent = state.historySource === 'demo' ? 'FIKTIVE DATEN' : 'LOKAL GELADENE CSV';
  $('history-source').classList.toggle('uploaded', state.historySource !== 'demo');
  $('history-chart').innerHTML = historyChartSvg(history);
  $('history-units').textContent = new Intl.NumberFormat('de-DE').format(units);
  $('history-factor').textContent = `${new Intl.NumberFormat('de-DE', { minimumFractionDigits: 3, maximumFractionDigits: 3 }).format(projection.kgPerUnit)} kg`;
  $('history-need').textContent = kg(forecast.demand14);
  const staleNote = projection.lastMonth < '2026-09' ? ' Hinweis: Die geladene Historie endet vor dem letzten vollständigen Demomonat.' : '';
  $('history-explain').textContent = 'Modellregel: Verkaufsdurchschnitt der letzten 12 Monate × Saisonfaktor aus 60 Monaten × gedämpfter Vorjahrestrend. Die Materialmenge je Teil kommt aus den letzten 12 Monaten; der Nachfrage-Regler wirkt danach. CSV-Spalten: monat;verkaufte_teile;petg_rot_kg. Die Datei bleibt lokal. Das ist ein transparentes Demo-Modell, keine trainierte oder validierte KI.' + staleNote;
}

function renderForecast() {
  const f = calculateForecast(state);
  renderHistory(f);
  $('formula-copy').textContent = `Rechnung: Startbestand − tageweise abgeleiteter Bedarf aus fünf Jahren Verkäufen + 18 kg ab Liefertag. Bei aktueller Nachfrage rund ${kg(f.daily)} pro Tag. Sicherheitsbestand = 12 kg. Negative Salden zeigen ungedeckten Bedarf.`;
  $('demand-value').textContent = `${state.demand} %`;
  $('stock-value').textContent = kg(state.stock);
  $('dashboard-demand').innerHTML = `${new Intl.NumberFormat('de-DE', { minimumFractionDigits: 1, maximumFractionDigits: 1 }).format(f.demand14)} <small>kg</small>`;
  $('dashboard-chart').innerHTML = chartSvg(f, 'small');
  $('forecast-chart').innerHTML = chartSvg(f, 'large');
  $('end-stock').textContent = kg(f.endStock);
  $('need-stat').textContent = kg(f.demand14);
  $('warning-stat').textContent = f.firstBelowSafety === null ? 'Keine' : `Tag ${f.firstBelowSafety}`;
  $('minimum-stat').textContent = kg(f.minimumStock);
  $('route-day').textContent = state.deliveryDay;
  if (f.reorderKg > 0) {
    $('recommend-title').textContent = `${f.reorderKg} kg PETG Rot zusätzlich prüfen`;
    $('recommend-copy').textContent = `Der aus Verkaufshistorie abgeleitete Materialsaldo fällt erstmals an Tag ${f.firstBelowSafety} unter 12 kg. Ein zusätzlicher Zugang vor diesem Tag könnte die Sicherheitsreserve absichern.`;
    $('order-title').textContent = `${f.reorderKg} kg PETG Rot zusätzlich prüfen`;
    $('order-copy').textContent = `Die Rechnung zeigt einen tiefsten Materialsaldo von ${kg(f.minimumStock)} und eine Lücke von ${kg(f.gapKg)} zur Sicherheitsreserve. Der gerundete Vorschlag setzt rechtzeitige Verfügbarkeit voraus. Preis, Lieferzeit und Bedarf prüft der Einkauf.`;
  } else {
    $('recommend-title').textContent = 'Bestand im Sicherheitsbereich';
    $('recommend-copy').textContent = 'Unter den aktuellen Annahmen bleibt der Bestand über der Reserve. Nachfrage und Liefertermin weiter beobachten.';
    $('order-title').textContent = 'Aktuell kein Zusatzbedarf berechnet';
    $('order-copy').textContent = 'Die simulierte Bestandskurve bleibt oberhalb der 12-kg-Reserve. Der Einkauf kann die Annahmen und den geplanten Zugang dennoch prüfen.';
  }
}

function renderPlan() {
  const impact = planImpact(state.approved);
  $('after-count').textContent = impact.affectedAfter;
  $('after-bar-label').textContent = `${impact.affectedAfter} von 100`;
  $('after-bar').style.width = `${impact.affectedAfter / 6 * 100}%`;
  $('comparison-outcome').textContent = impact.affectedAfter === 6
    ? 'Gib Vorschläge frei, um die Demo-Planung zu verändern.'
    : `${6 - impact.affectedAfter} Beispielaufträge umgeplant. ${impact.affectedAfter} bleiben im PETG-Rot-Szenario gefährdet. Bedingungen müssen real geprüft werden.`;
  for (const key of ['move', 'sequence']) {
    const card = $(`${key}-card`);
    card.classList.toggle('approved', state.approved[key]);
    const button = card.querySelector('.approve-button');
    button.textContent = state.approved[key] ? 'Demo-Freigabe zurücknehmen' : 'Demo-Umplanung freigeben';
    button.setAttribute('aria-pressed', String(state.approved[key]));
  }
  const resolved = new Set([
    ...(state.approved.move ? ['STD-014', 'GF-003'] : []),
    ...(state.approved.sequence ? ['STD-026', 'GF-011'] : []),
  ]);
  $('machine-grid').innerHTML = AFFECTED_MACHINES.map(machine => `<article class="machine-card"><div class="machine-top"><span class="machine-id">${machine.id}</span><span class="machine-status ${resolved.has(machine.id) ? 'resolved' : ''}">${resolved.has(machine.id) ? 'UMGEPLANT' : 'GEFÄHRDET'}</span></div><div class="machine-meta">${machine.group} · ${state.approved.move && ['STD-014','GF-003'].includes(machine.id) ? 'PETG Schwarz (Demo)' : machine.material}</div><div class="machine-job">${machine.job}</div><div class="machine-bottom"><span>Termin ${machine.deadline}</span><span>${machine.impact === 'hoch' ? 'Hohe' : 'Mittlere'} Priorität</span></div></article>`).join('');
}

function renderFleet() {
  $('fleet-list').innerHTML = MACHINE_GROUPS.map(group => `<div class="fleet-row"><div class="fleet-row-top"><span>${group.label}</span><span>${group.count} Drucker</span></div><div class="fleet-track"><span style="width:${group.count}%;background:${group.color}"></span></div></div>`).join('');
}

function update() { renderForecast(); renderPlan(); }

document.querySelectorAll('[data-page]').forEach(el => el.addEventListener('click', () => navigate(el.dataset.page)));
document.querySelectorAll('[data-go]').forEach(el => el.addEventListener('click', () => navigate(el.dataset.go)));
$('hero-plan').addEventListener('click', () => navigate('planning'));
$('sidebar-demo').addEventListener('click', () => navigate('forecast'));
$('tour-button').addEventListener('click', () => {
  applyScenario('rush');
  navigate('forecast');
  toast('Pitch-Szenario „Nachfragespitze“ ist aktiv.');
});

function applyScenario(name) {
  const scenario = SCENARIOS[name];
  state.scenario = name;
  state.demand = scenario.demand;
  state.stock = scenario.stock;
  state.deliveryDay = scenario.deliveryDay;
  $('demand-range').value = state.demand;
  $('stock-range').value = state.stock;
  $('delivery-select').value = state.deliveryDay;
  document.querySelectorAll('.scenario-button').forEach(el => el.classList.toggle('active', el.dataset.scenario === name));
  resetApprovals();
  update();
}

document.querySelectorAll('[data-scenario]').forEach(el => el.addEventListener('click', () => { applyScenario(el.dataset.scenario); toast(`Szenario „${SCENARIOS[el.dataset.scenario].label}“ geladen.`); }));
for (const [id, key] of [['demand-range', 'demand'], ['stock-range', 'stock'], ['delivery-select', 'deliveryDay']]) {
  $(id).addEventListener(id === 'delivery-select' ? 'change' : 'input', event => {
    state[key] = Number(event.target.value);
    markCustomScenario();
    resetApprovals();
    update();
  });
}
document.querySelectorAll('[data-approval]').forEach(el => el.addEventListener('click', () => {
  const key = el.dataset.approval;
  state.approved[key] = !state.approved[key];
  renderPlan();
  toast(state.approved[key] ? 'Vorschlag nur in der Demo-Planung freigegeben.' : 'Demo-Freigabe zurückgenommen.');
}));
$('review-button').addEventListener('click', () => {
  state.review = !state.review;
  $('review-button').innerHTML = state.review ? 'Markierung entfernen <span>↩</span>' : 'Zur Prüfung markieren <span>→</span>';
  toast(state.review ? 'Bestellvorschlag in der lokalen Demo zur Prüfung markiert.' : 'Markierung entfernt.');
});

$('import-sales').addEventListener('click', () => $('sales-file').click());
$('sales-file').addEventListener('change', async event => {
  const file = event.target.files?.[0];
  if (!file) return;
  try {
    if (file.size > 2_000_000) throw new Error('Die CSV ist für 60 Monatswerte zu groß.');
    const history = parseSalesCsv(await file.text());
    state.history = history;
    state.historySource = 'csv';
    resetApprovals();
    update();
    $('history-message').textContent = `${file.name}: 60 Monatswerte lokal geladen. Es wurden keine Daten hochgeladen.`;
    $('history-message').classList.remove('error');
    toast('Verkaufshistorie geladen und Bedarf neu berechnet.');
  } catch (error) {
    $('history-message').textContent = error.message;
    $('history-message').classList.add('error');
  } finally {
    event.target.value = '';
  }
});
$('reset-sales').addEventListener('click', () => {
  state.history = DEMO_SALES_HISTORY;
  state.historySource = 'demo';
  resetApprovals();
  update();
  $('history-message').textContent = 'Fiktive Fünf-Jahres-Daten wiederhergestellt.';
  $('history-message').classList.remove('error');
});
$('download-sales').addEventListener('click', () => {
  const url = URL.createObjectURL(new Blob([salesCsv(DEMO_SALES_HISTORY)], { type: 'text/csv;charset=utf-8' }));
  const link = document.createElement('a');
  link.href = url;
  link.download = 'printpilot-beispiel-verkaufshistorie.csv';
  link.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
});

$('today-label').textContent = new Intl.DateTimeFormat('de-DE', { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date());
renderFleet();
update();
})();
