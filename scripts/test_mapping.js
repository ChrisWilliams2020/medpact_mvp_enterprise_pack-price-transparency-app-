const fs = require('fs');

async function run() {
  const base = process.env.BASE_URL || 'http://127.0.0.1:3001';
  const key = 'mapping-test-' + Date.now();
  const url = '/media/test-mapping.png';
  const res = await fetch(`${base}/api/mapping/set`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ key, url }) });
  console.log('status', res.status, await res.text());
  const map = JSON.parse(fs.readFileSync('public/media/mapping.json','utf8'));
  console.log('mapping has key?', !!map[key]);
}

run().catch(e=>{ console.error(e); process.exit(1); });
