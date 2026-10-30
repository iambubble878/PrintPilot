import { readFile, writeFile } from 'node:fs/promises';
const root = new URL('../', import.meta.url);
const read = path => readFile(new URL(path, root), 'utf8');
const [base, data, model, ui, css, simulator, historical] = await Promise.all([
  'app/presentation-base.html', 'app/forecast-data.json', 'app/forecast-model.js',
  'app/forecast-ui.js', 'app/forecast.css', 'app/forecast-panel.html', 'historical-prognosen.js'
].map(read));
const safe = JSON.stringify(JSON.parse(data)).replace(/</g, '\\u003c');
const html = base.replace('<!-- PRINTPILOT_SIMULATOR -->', simulator)
  .replace('</head>', `<style>${css}</style></head>`)
  .replace('</body>', `<script>window.PrintPilotData=${safe};</script>\n<script>${model}</script>\n<script>${ui}</script>\n<script>${historical}</script>\n</body>`);
await writeFile(new URL('index.html', root), html);
console.log('index.html built with embedded data, model and scenario controls.');
