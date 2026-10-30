import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { Script } from 'node:vm';

test('index.html lädt lokale klassische Skripte in der richtigen Reihenfolge', async () => {
  const html = await readFile(new URL('../app/index.html', import.meta.url), 'utf8');
  const scripts = [...html.matchAll(/<script\b([^>]*)><\/script>/g)].map(match => match[1]);
  assert.equal(scripts.length, 2);
  assert.match(scripts[0], /src="\.\/model\.js"/);
  assert.match(scripts[1], /src="\.\/app\.js"/);
  assert.ok(scripts.every(attributes => !/\btype="module"/.test(attributes)));
  for (const name of ['model.js', 'app.js']) {
    const source = await readFile(new URL(`../app/${name}`, import.meta.url), 'utf8');
    assert.doesNotThrow(() => new Script(source, { filename: name }));
  }
});
