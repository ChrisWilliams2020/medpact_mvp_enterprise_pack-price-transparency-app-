#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

async function run() {
  const days = parseInt(process.argv[2] || '30', 10);
  const cutoff = Date.now() - days * 24 * 60 * 60 * 1000;
  const mediaDir = path.join(process.cwd(), 'public', 'media');
  await fs.promises.mkdir(mediaDir, { recursive: true });
  const files = await fs.promises.readdir(mediaDir, { withFileTypes: true });
  const removed = [];
  for (const f of files) {
    if (!f.isFile()) continue;
    const fp = path.join(mediaDir, f.name);
    const stat = await fs.promises.stat(fp);
    if (stat.mtimeMs < cutoff) {
      await fs.promises.unlink(fp).catch(() => {});
      removed.push(f.name);
    }
  }
  try {
    const mapFile = path.join(mediaDir, 'mapping.json');
    let map = {};
    try { map = JSON.parse(await fs.promises.readFile(mapFile,'utf8')); } catch (e) {}
    for (const k of Object.keys(map)) {
      if (removed.includes(map[k])) delete map[k];
    }
    await fs.promises.writeFile(mapFile, JSON.stringify(map, null, 2));
  } catch (e) {}
  console.log('removed', removed.length, 'files');
}

run().catch(e => { console.error(e); process.exit(1); });
