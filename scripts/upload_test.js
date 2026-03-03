const fs = require('fs');
const { FormData, File } = require('formdata-node');
const { fileFromPath } = require('formdata-node/file-from-path');

async function run() {
  const form = new FormData();
  const f = await fileFromPath('/tmp/tiny.png');
  form.set('file', f);
  form.set('key', 'test-slug');
  const cookie = process.argv[2];
  const headers = Object.assign({}, form.headers || {}, { Cookie: `admin=${cookie}` });
  const res = await fetch('http://127.0.0.1:3001/api/upload-photo', { method: 'POST', body: form, headers });
  const text = await res.text();
  console.log('STATUS', res.status);
  console.log('BODY', text);
}

run().catch((e)=>{ console.error(e); process.exit(1)});
