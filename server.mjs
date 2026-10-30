import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, extname, join, normalize, sep } from 'node:path';

const root = dirname(fileURLToPath(import.meta.url));
const appRoot = join(root, 'app');
const port = Number(process.env.PORT || 4173);
const types = { '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript', '.json': 'application/json', '.svg': 'image/svg+xml' };

createServer(async (request, response) => {
  const path = decodeURIComponent(new URL(request.url, 'http://localhost').pathname);
  // Serve only presentation files; project notes and tools stay outside the web root.
  if (path !== '/' && path !== '/index.html' && path !== '/prognosen.json' && !path.startsWith('/app/')) {
    response.writeHead(404).end('Not found');
    return;
  }
  const file = normalize(join(root, path === '/' ? 'index.html' : path.slice(1)));
  const allowed = path === '/' || path === '/index.html' || path === '/prognosen.json'
    ? file === join(root, path === '/prognosen.json' ? 'prognosen.json' : 'index.html')
    : file.startsWith(appRoot + sep);
  if (!allowed) {
    response.writeHead(403).end('Forbidden');
    return;
  }
  try {
    const body = await readFile(file);
    response.writeHead(200, { 'Content-Type': `${types[extname(file)] || 'application/octet-stream'}; charset=utf-8`, 'Cache-Control': 'no-store' }).end(body);
  } catch {
    response.writeHead(404).end('Not found');
  }
}).listen(port, '127.0.0.1', () => {
  console.log(`PrintPilot läuft auf http://127.0.0.1:${port}`);
});
