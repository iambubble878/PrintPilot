(function () {
  'use strict';
  const model = window.PrintPilotForecast, data = window.PrintPilotData;
  const $ = id => document.getElementById(id);
  const fmt = (n, decimals = 0) => Number(n).toLocaleString('de-DE', { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
  const date = value => value ? value.split('-').reverse().join('.') : '—';
  const esc = value => String(value).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const names = { basis: 'Basisplanung', rush: 'Nachfragespitze', delay: 'Lieferverzug', shortage: 'Niedriger Bestand', relief: 'Entspannung', custom: 'Eigenes Szenario' };
  const fields = { horizon: 'kiHorizon', material: 'kiMaterial', demand: 'kiDemand', stock: 'kiStock', delay: 'kiDelay', scrap: 'kiScrap', safety: 'kiSafety' };
  let options = { ...model.defaults }, active = 'basis', result;
  for (const m of data.materials) $('kiMaterial').add(new Option(m.type + ' · ' + m.color + ' (' + m.id + ')', m.id));
  const baseline30 = model.calculate(data);
  // The other pages retain the snapshot and use the fixed 30-day base forecast.
  window.printPilotForecastRows = baseline30.products.map(p => {
    const m = data.materials.find(x => x.id === p.materialId);
    return { id: m.id, type: m.type, color: m.color, grams: p.kg * 1000, unit: p.units };
  });
  window.dispatchEvent(new Event('printpilot-model-ready'));
  function chart(current, base) {
    const svg = $('kiChart'), width = 820, height = 280, left = 61, right = 15, top = 20, bottom = 40;
    const reserve = options.safety * current.materials.length;
    const values = current.daily.concat(base.daily).map(d => d.balanceKg).concat([reserve, 0]);
    const minimum = Math.min(...values), maximum = Math.max(...values), span = Math.max(10, maximum - minimum);
    const low = minimum - span * .08, high = maximum + span * .08;
    const x = i => left + i / (current.daily.length - 1) * (width - left - right);
    const y = v => top + (high - v) / (high - low) * (height - top - bottom);
    let content = '<title id="kiChartTitle">Materialsaldo in Kilogramm</title><desc id="kiChartDesc">Basis und Szenario vom ' + date(current.start) + ' bis ' + date(current.end) + '. Negative Werte sind ungedeckter Bedarf.</desc>';
    for (let i = 0; i <= 4; i++) {
      const value = low + (high - low) * i / 4, line = y(value);
      content += `<line x1="${left}" x2="${width - right}" y1="${line}" y2="${line}" stroke="#e7eee7"/><text x="${left - 8}" y="${line + 4}" text-anchor="end">${fmt(value)}</text>`;
    }
    content += `<text x="${left}" y="12">kg</text><line x1="${left}" x2="${width-right}" y1="${y(0)}" y2="${y(0)}" stroke="#afbfb3"/><line x1="${left}" x2="${width-right}" y1="${y(reserve)}" y2="${y(reserve)}" stroke="#7d9484" stroke-dasharray="5 5"/>`;
    for (const [rows, color] of [[base.daily, '#178478'], [current.daily, '#cb6939']]) {
      content += `<polyline fill="none" stroke="${color}" stroke-width="3" stroke-linejoin="round" points="${rows.map((d, i) => x(i).toFixed(2) + ',' + y(d.balanceKg).toFixed(2)).join(' ')}"/>`;
    }
    current.daily.forEach((d, i) => {
      content += `<circle cx="${x(i)}" cy="${y(d.balanceKg)}" r="4" fill="transparent"><title>${date(d.date)}: ${fmt(d.balanceKg, 2)} kg Saldo, ${fmt(d.kg, 2)} kg Bedarf, ${fmt(d.receiptKg, 1)} kg Zugang</title></circle>`;
      if (i === 0 || i === current.daily.length - 1 || i === Math.floor(current.daily.length / 2)) content += `<text x="${x(i)}" y="${height-14}" text-anchor="${i===0?'start':i===current.daily.length-1?'end':'middle'}">${date(d.date)}</text>`;
    });
    svg.innerHTML = content;
  }
  function render() {
    result = model.calculate(data, options);
    const base = model.calculate(data, { horizon: options.horizon, material: options.material });
    window.printPilotScenario = result;
    document.querySelectorAll('[data-ki-preset]').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.kiPreset === active)));
    for (const key of ['demand', 'stock', 'delay', 'scrap', 'safety']) {
      $(fields[key] + 'Value').textContent = fmt(options[key]) + (key === 'delay' ? ' Tage' : key === 'safety' ? ' kg' : ' %');
    }
    $('kiCase').textContent = names[active];
    $('kiPeriod').textContent = date(result.start) + ' – ' + date(result.end) + ' · ' + options.horizon + ' Tage';
    $('kiUnits').textContent = fmt(result.units) + ' Stk.';
    $('kiUnitsDelta').textContent = (result.units - base.units >= 0 ? '+' : '') + fmt(result.units - base.units) + ' Stück gegenüber Basis';
    $('kiNeed').textContent = fmt(result.needKg, 1) + ' kg';
    $('kiNeedDelta').textContent = (result.needKg - base.needKg >= 0 ? '+' : '') + fmt(result.needKg - base.needKg, 1) + ' kg gegenüber Basis';
    $('kiExtra').textContent = fmt(result.extraKg) + ' kg';
    $('kiCritical').textContent = result.critical + ' / ' + result.materials.length;
    $('kiBreach').textContent = result.firstBreach ? 'Erste Reservewarnung: ' + date(result.firstBreach) : 'Reserve im Zeitraum gedeckt';
    $('kiChartHint').textContent = options.material === 'all' ? 'Summe aller Materialien. Einzelne Engpässe stehen in der Tabelle.' : result.materials[0].type + ' · ' + result.materials[0].color;
    chart(result, base);
    const urgent = result.materials.filter(m => m.urgent).length;
    $('kiInsight').innerHTML = '<strong>' + (result.extraKg ? fmt(result.extraKg) + ' kg zusätzliche Versorgung prüfen.' : 'Keine Zusatzmenge für die gewählten Annahmen nötig.') + '</strong>' +
      (urgent ? urgent + ' Materialposition(en) benötigen eine Klärung vor dem regulär möglichen Liefertermin. Expresslieferung oder Umplanung prüfen. ' : 'Die berechnete Zusatzmenge setzt eine rechtzeitige Lieferung voraus. ') +
      'Zum Simulationsstart sind ' + fmt(result.overdueKg, 1) + ' kg überfällig. Diese Menge ist nicht als sicherer Zugang angesetzt.';
    $('kiMaterials').innerHTML = result.materials.map(m => '<tr><td><button type="button" data-ki-material="' + m.id + '">' + esc(m.type + ' · ' + m.color) + '</button><small>' + m.id + '</small></td><td>' + fmt(m.startingKg, 1) + '</td><td>' + fmt(m.needKg, 1) + '</td><td>' + fmt(m.scheduledKg, 1) + '</td><td>' + date(m.shortage) + '</td><td class="' + (m.minKg < 0 ? 'kiNegative' : '') + '">' + fmt(m.minKg, 1) + '</td><td><b>' + fmt(m.extraKg) + '</b></td><td>' + (m.extraKg ? (m.urgent ? '<span class="kiUrgent">Reguläre Lieferung zu spät</span><br>' : 'Bestellen bis ') + date(m.orderBy) : 'Kein Zusatzbedarf') + '</td></tr>').join('');
    $('kiProducts').innerHTML = result.products.map(p => {
      const m = result.materials.find(m => m.id === p.materialId);
      return '<tr><td><b>' + esc(p.name) + '</b><small>' + p.id + ' · ' + esc(p.season) + '</small></td><td>' + esc(m.type + ' · ' + m.color) + '</td><td>' + fmt(p.gramsPerUnit) + '</td><td>' + fmt(p.baseUnits) + '</td><td>' + fmt(p.units) + '</td><td>' + fmt(p.kg, 1) + '</td></tr>';
    }).join('');
    $('kiReviewState').textContent = 'Noch nicht vorgemerkt';
    $('kiReview').textContent = 'Szenario zur Prüfung vormerken';
  }
  function applyPreset(name) {
    options = { ...model.presets[name] }; active = name;
    for (const [key, id] of Object.entries(fields)) $(id).value = String(options[key]);
    render();
  }
  for (const [key, id] of Object.entries(fields)) $(id).addEventListener(key === 'material' || key === 'horizon' ? 'change' : 'input', () => {
    options[key] = key === 'material' ? $(id).value : Number($(id).value); active = 'custom'; render();
  });
  document.querySelectorAll('[data-ki-preset]').forEach(button => button.addEventListener('click', () => applyPreset(button.dataset.kiPreset)));
  $('kiReset').addEventListener('click', () => applyPreset('basis'));
  $('kiMaterials').addEventListener('click', event => {
    const button = event.target.closest('[data-ki-material]');
    if (button) { options.material = button.dataset.kiMaterial; $('kiMaterial').value = options.material; active = 'custom'; render(); }
  });
  $('kiReview').addEventListener('click', () => {
    $('kiReviewState').textContent = names[active] + ': ' + fmt(result.extraKg) + ' kg zur Prüfung vorgemerkt · keine Bestellung';
    $('kiReview').textContent = 'Erneut vormerken';
  });
  $('kiExport').addEventListener('click', () => {
    const header = ['Szenario','Von','Bis','Nachfrage_Prozent','Bestand_Prozent','Verzug_Tage','Aufschlag_Prozent','Reserve_kg_je_Material','Material_ID','Filament','Farbe','Start_kg','Bedarf_kg','Geplanter_Zugang_kg','Ueberfaellig_nicht_eingerechnet_kg','Tiefster_Saldo_kg','Zusatzmenge_kg','Erste_Fehlmenge','Bestellen_bis','Regulaer_zu_spaet'];
    const decimal = n => n.toFixed(3).replace('.', ',');
    const lines = result.materials.map(m => [names[active], result.start, result.end, options.demand, options.stock, options.delay, options.scrap, options.safety, m.id, m.type, m.color, decimal(m.startingKg), decimal(m.needKg), m.scheduledKg, m.overdueKg, decimal(m.minKg), m.extraKg, m.shortage || '', m.orderBy || '', m.urgent ? 'ja' : 'nein']);
    const quote = v => '"' + String(v).replace(/"/g, '""') + '"';
    const blob = new Blob(['\uFEFF' + [header, ...lines].map(row => row.map(quote).join(';')).join('\r\n')], { type: 'text/csv;charset=utf-8' });
    const link = document.createElement('a'), url = URL.createObjectURL(blob);
    link.href = url; link.download = 'PrintPilot_Szenario_' + options.horizon + 'T.csv'; link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  });
  const test = data.forecast.backtest.test, metric = test.model['90_days'], reference = test.same_weekday_baseline['90_days'];
  $('kiModelEvidence').innerHTML = '<p><b>Trainiertes Modell:</b> Histogram Gradient Boosting mit Poisson-Ziel. Es nutzt Nachfrage von vor 1, 7, 14 und 28 Tagen, gleitende Mittelwerte sowie Kalendermerkmale. Ziel ist die simulierte Nachfrage einschließlich nicht bedienter Stücke.</p><div class="kiEvidence"><div><small>90-Tage-Test · WAPE Modell</small><strong>' + fmt(metric.wape_percent, 2) + ' %</strong><small>Nachfragefehler; kleiner ist besser</small></div><div><small>Wochenvergleich · WAPE</small><strong>' + fmt(reference.wape_percent, 2) + ' %</strong><small>Gleicher Wochentag, rekursiv</small></div><div><small>Relativer Fehlervorteil</small><strong>' + fmt((1 - metric.wape_percent / reference.wape_percent) * 100, 1) + ' %</strong><small>gegenüber dem Wochenvergleich</small></div></div><p>Unabhängiger Test: ' + date(test.from) + ' – ' + date(test.to) + '. Das Modell wurde nur mit Daten davor trainiert; spätere Tage nutzen eigene Vorhersagen. Kennzahlen stammen aus der mitgelieferten JSON und wurden hier nicht neu trainiert. WAPE ist keine Prognosesicherheit. Der 90-Tage-WAPE von 21,81 % überschreitet die im Konzept vorgeschlagene Grenze von 20 %.</p><p><b>Datenstand:</b> ' + fmt(data.forecast.source.days) + ' Tage, 12 Artikel. Der Prognosezeitraum beginnt am 22.10.2026. Dies ist ein eingefrorener Vorführstand und keine tagesaktuelle Planung.</p>';
  const launch = document.createElement('div'); launch.className = 'kiLaunch';
  launch.innerHTML = '<div><strong>KI-Prognose. Fünf Szenarien. Direkt vorführen.</strong>Nachfrage, Bestand und Lieferverzug ändern und die Materialfolgen sehen.</div><button type="button">KI-Szenario starten →</button>';
  document.querySelector('#overview .head').after(launch);
  launch.querySelector('button').addEventListener('click', () => { document.querySelector('[data-page="forecast"]').click(); $('kiSimulator').scrollIntoView({ block: 'start' }); });
  const scope = document.createElement('p'); scope.className = 'kiScope'; scope.textContent = 'Ausgangsstand der bisherigen Planung. Die interaktiven Szenario-Annahmen gelten in der Bedarfsprognose.';
  document.querySelector('#purchasing .head').after(scope);
  render();
})();
