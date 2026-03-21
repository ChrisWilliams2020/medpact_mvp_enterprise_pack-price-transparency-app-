// Automated API smoke test for MedPact Platinum
// Run with: npx ts-node scripts/api-smoke-test.js

const fetch = require('node-fetch');

const endpoints = [
  { name: 'Notifications', url: 'http://localhost:3000/api/notifications', method: 'GET' },
  { name: 'Scheduling', url: 'http://localhost:3000/api/scheduling', method: 'GET' },
  { name: 'Survey Templates', url: 'http://localhost:3000/api/surveys/templates', method: 'GET' },
  { name: 'Bulk Actions', url: 'http://localhost:3000/api/bulk-actions', method: 'GET' },
  { name: 'Analytics', url: 'http://localhost:3000/api/analytics', method: 'GET' },
  { name: 'Messaging', url: 'http://localhost:3000/api/messaging/enhanced', method: 'GET' },
  { name: 'Quality Automation', url: 'http://localhost:3000/api/quality/automation', method: 'GET' },
  { name: 'Patient Portal', url: 'http://localhost:3000/api/patient-portal/enhanced', method: 'GET' },
];

(async () => {
  for (const ep of endpoints) {
    try {
      const res = await fetch(ep.url, { method: ep.method });
      const ok = res.ok;
      const status = res.status;
      const body = await res.text();
      console.log(`[${ep.name}] ${ep.method} ${ep.url} => ${status} ${ok ? 'OK' : 'FAIL'}`);
      if (!ok) {
        console.log('  Response:', body);
      }
    } catch (err) {
      console.error(`[${ep.name}] ERROR:`, err.message);
    }
  }
})();
