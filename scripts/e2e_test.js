const fs = require('fs');

async function run() {
  // login
  const base = process.env.BASE_URL || 'http://127.0.0.1:3001';
  const loginRes = await fetch(`${base}/api/admin/login`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ password: process.env.ADMIN_PASS || 'admin' }) });
  const setCookie = loginRes.headers.get('set-cookie');
  console.log('login status', loginRes.status, 'set-cookie', setCookie);

  // prepare file
  const data = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8Xw8AAlEB9ZDx5wAAAABJRU5ErkJggg==', 'base64');
  fs.writeFileSync('/tmp/e2e_tiny.png', data);

  // upload via formdata (formdata-node)
  const { FormData } = require('formdata-node');
  const { fileFromPath } = require('formdata-node/file-from-path');
  const form = new FormData();
  form.set('file', await fileFromPath('/tmp/e2e_tiny.png'));
  form.set('key', 'e2e-slug');

  const headers = Object.assign({}, form.headers || {});
  if (setCookie) headers['Cookie'] = setCookie.split(';')[0];

  // Use curl for multipart upload to avoid FormData incompatibilities in this Node environment
  const cp = require('child_process');
  const cookieHeader = setCookie ? setCookie.split(';')[0] : '';
  try {
    const curlCmd = [
      'curl', '-s', '-X', 'POST', `${base}/api/upload-photo`,
      '-H', `Cookie: ${cookieHeader}`,
      '-F', `file=@/tmp/e2e_tiny.png`,
      '-F', `key=e2e-slug`
    ];
    const out = cp.execFileSync(curlCmd[0], curlCmd.slice(1), { encoding: 'utf8' });
    console.log('upload response', out);
  } catch (e) {
    console.error('upload failed', e.stdout || e.message);
  }

  console.log('mapping.json:');
  console.log(fs.readFileSync('public/media/mapping.json','utf8'));
}

run().catch(e=>{ console.error(e); process.exit(1); });
