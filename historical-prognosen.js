(function () {
  'use strict';

  const product = document.getElementById('historicalProduct');
  const fileInput = document.getElementById('historicalFile');
  const status = document.getElementById('historicalStatus');
  const results = document.getElementById('historicalResults');
  if (!product || !fileInput || !status || !results) return;

  const number = new Intl.NumberFormat('de-DE', { maximumFractionDigits: 2 });
  const decimal = new Intl.NumberFormat('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  let records = [];

  function cell(row, value) {
    const td = document.createElement('td');
    td.textContent = value;
    row.appendChild(td);
  }

  function dateText(value) {
    const [year, month, day] = value.split('-');
    return `${day}.${month}.${year}`;
  }

  function difference(value) {
    return `${value > 0 ? '+' : ''}${number.format(value)}`;
  }

  function validate(data) {
    if (data?.prognose_start !== '2026-01-01' || data?.prognose_ende !== '2026-03-31' ||
        data?.trainingsende !== '2025-12-31' || !Array.isArray(data.prognosen)) {
      throw new Error('Die Datei enthält nicht den erwarteten Rücktest für Januar bis März 2026.');
    }
    const seen = new Set();
    const valid = data.prognosen.map((entry) => {
      const date = entry?.datum;
      const id = entry?.produkt_id;
      const predicted = entry?.prognose_stueck;
      const actual = entry?.tatsaechlich_stueck;
      const key = `${date}|${id}`;
      if (typeof date !== 'string' || !/^2026-(01|02|03)-\d{2}$/.test(date) ||
          date < data.prognose_start || date > data.prognose_ende ||
          typeof id !== 'string' || !/^ART-\d{3}$/.test(id) || seen.has(key) ||
          typeof predicted !== 'number' || !Number.isFinite(predicted) || predicted < 0 ||
          typeof actual !== 'number' || !Number.isInteger(actual) || actual < 0) {
        throw new Error('Die Prognose enthält ungültige oder doppelte Tageswerte.');
      }
      seen.add(key);
      return { date, id, predicted, actual };
    });
    const dates = new Set(valid.map((entry) => entry.date));
    const products = new Set(valid.map((entry) => entry.id));
    if (valid.length !== 1080 || dates.size !== 90 || products.size !== 12) {
      throw new Error('Erwartet werden 90 Tage mit je 12 Produkten (1.080 Werte).');
    }
    return valid.sort((a, b) => a.date.localeCompare(b.date) || a.id.localeCompare(b.id));
  }

  function render() {
    const selected = product.value;
    const visible = selected === 'all' ? records : records.filter((entry) => entry.id === selected);
    const predicted = visible.reduce((sum, entry) => sum + entry.predicted, 0);
    const actual = visible.reduce((sum, entry) => sum + entry.actual, 0);
    const mae = visible.reduce((sum, entry) => sum + Math.abs(entry.predicted - entry.actual), 0) / visible.length;
    document.getElementById('historicalPredicted').textContent = number.format(predicted);
    document.getElementById('historicalActual').textContent = number.format(actual);
    document.getElementById('historicalMae').textContent = `${decimal.format(mae)} Stück / Produkt-Tag`;
    document.getElementById('historicalRange').textContent = `${number.format(visible.length)} Produkt-Tage, 01.01.–31.03.2026. Abweichung = Prognose minus Ist.`;

    const months = new Map();
    visible.forEach((entry) => {
      const month = entry.date.slice(0, 7);
      if (!months.has(month)) months.set(month, { predicted: 0, actual: 0 });
      const values = months.get(month);
      values.predicted += entry.predicted;
      values.actual += entry.actual;
    });
    const monthBody = document.getElementById('historicalMonths');
    monthBody.replaceChildren();
    months.forEach((values, month) => {
      const row = document.createElement('tr');
      const label = new Intl.DateTimeFormat('de-DE', { month: 'long', year: 'numeric', timeZone: 'UTC' })
        .format(new Date(`${month}-01T00:00:00Z`));
      [label, number.format(values.predicted), number.format(values.actual), difference(values.predicted - values.actual)]
        .forEach((value) => cell(row, value));
      monthBody.appendChild(row);
    });

    const dayBody = document.getElementById('historicalDays');
    const rows = document.createDocumentFragment();
    visible.forEach((entry) => {
      const row = document.createElement('tr');
      [dateText(entry.date), entry.id, number.format(entry.predicted), number.format(entry.actual),
        difference(entry.predicted - entry.actual)].forEach((value) => cell(row, value));
      rows.appendChild(row);
    });
    dayBody.replaceChildren(rows);
    results.hidden = false;
  }

  function useData(data) {
    records = validate(data);
    product.replaceChildren(new Option('Alle 12 Produkte', 'all'));
    [...new Set(records.map((entry) => entry.id))].sort()
      .forEach((id) => product.add(new Option(id, id)));
    render();
    status.textContent = 'Historische Prognosen und Ist-Werte geladen. Die Ist-Werte dienen nur dem Vergleich.';
  }

  product.addEventListener('change', render);
  fileInput.addEventListener('change', async () => {
    const file = fileInput.files?.[0];
    if (!file) return;
    try {
      useData(JSON.parse(await file.text()));
    } catch (error) {
      results.hidden = true;
      status.textContent = `Datei konnte nicht geladen werden: ${error.message}`;
    }
  });

  fetch('prognosen.json')
    .then((response) => {
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return response.json();
    })
    .then(useData)
    .catch(() => {
      status.textContent = location.protocol === 'file:'
        ? 'Beim direkten Öffnen der HTML-Datei bitte oben prognosen.json auswählen.'
        : 'prognosen.json konnte nicht geladen werden. Bitte Seite neu laden oder die JSON-Datei oben auswählen.';
    });
}());
