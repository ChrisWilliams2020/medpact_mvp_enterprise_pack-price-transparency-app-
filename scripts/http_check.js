const http = require('http');

async function run() {
  try {
    const resp = await fetch('http://127.0.0.1:3001/api/admin/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ password: 'admin' }) });
    const text = await resp.text();
    console.log('STATUS', resp.status);
    console.log('HEADERS', Object.fromEntries(resp.headers));
    console.log('BODY', text);
  } catch (e) {
    console.error(e);
  }
}

run();
