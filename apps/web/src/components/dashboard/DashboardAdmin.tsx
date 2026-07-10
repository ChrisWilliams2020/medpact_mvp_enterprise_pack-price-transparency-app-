import { useState } from 'react';
import useAlerts, { AlertRow, CPTRow, TaskRow } from '../../hooks/useAlerts';

interface DashboardAdminProps {
  view: string;
}

export default function DashboardAdmin({ view }: DashboardAdminProps) {

  // local CSV fallback (keeps working if external CSVCreator not available)
  function fallbackCSV(filename: string, rows: Record<string, any>[]) {
    if (!rows || rows.length === 0) return;
    const keys = Object.keys(rows[0]);
    const csv = [
      keys.join(','),
      ...rows.map(r => keys.map(k => `"${(r[k] ?? '').toString().replace(/"/g, '""')}"`).join(','))
    ].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  }

  // printable window fallback
  function fallbackPDF(title: string, html: string) {
    const win = window.open('', '_blank');
    if (!win) return;
    win.document.write(`
      <html>
        <head><title>${title}</title>
          <style>body{font-family:system-ui, -apple-system, sans-serif;padding:20px}</style>
        </head>
        <body>${html}</body>
      </html>
    `);
    win.document.close();
    setTimeout(() => { win.print(); }, 300);
  }

  // Wire to hook
  const { alerts, cpts, tasks, refresh, addTask } = useAlerts();

  // Export handlers attempt to use existing shared helpers; fallback otherwise
  async function handleExportCSV(filename: string, rows: Record<string, any>[]) {
    // try to use components/CSVCreator if present
    try {
      const mod = await import('../../components/CSVCreator');
      // support default export function or named createCSV
      if (mod && typeof mod.default === 'function') {
        mod.default(filename, rows);
        return;
      }
      if (mod && typeof mod.createCSV === 'function') {
        mod.createCSV(filename, rows);
        return;
      }
    } catch (e) {
      // ignore, fallback below
    }
    fallbackCSV(filename, rows);
  }

  async function handleExportPDF(title: string, rowsOrHtml: any) {
    // Replace dynamic import attempt with a stable client-side printable fallback.
    // If you later add a server-side or library PDF generator, call it here.
    try {
      const html = typeof rowsOrHtml === 'string'
        ? rowsOrHtml
        : `<h1>${title}</h1><pre>${JSON.stringify(rowsOrHtml, null, 2)}</pre>`;
      // Use printable window fallback for MVP
      fallbackPDF(title, html);
    } catch (err) {
      // final fallback: open a simple printable view
      const html = `<h1>${title}</h1><pre>${JSON.stringify(rowsOrHtml, null, 2)}</pre>`;
      fallbackPDF(title, html);
    }
  }

  // ── Admin Alerts view ───────────────────────────────────────
  if (view === 'admin-alerts') {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold text-gray-900">CPT Payment Alerts</h2>
          <div className="flex items-center gap-2">
            <button onClick={() => handleExportCSV('medpact-alerts.csv', alerts)} className="px-3 py-1 bg-indigo-600 text-white rounded text-xs">Export CSV</button>
            <button onClick={() => handleExportPDF('Alerts', alerts)} className="px-3 py-1 bg-white border rounded text-xs">Export PDF</button>
            <button onClick={refresh} className="px-3 py-1 bg-gray-50 border rounded text-xs">Refresh</button>
          </div>
        </div>

        <div className="bg-white rounded-xl border p-4">
          {alerts.length === 0 ? (
            <div className="text-gray-500">No alerts.</div>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="text-left text-xs text-gray-500">
                  <th>Alert</th><th>CPT</th><th>Payer</th><th>Severity</th><th>Claims</th><th>Variance</th><th>Est Loss</th><th>Action</th>
                </tr>
              </thead>
              <tbody>
                {alerts.map(a => (
                  <tr key={a.id} className="border-t hover:bg-gray-50">
                    <td className="py-2 text-sm">{a.alertType}</td>
                    <td className="py-2 text-sm font-mono">{a.cpt}</td>
                    <td className="py-2 text-sm">{a.payer}</td>
                    <td className="py-2 text-sm">{a.severity}</td>
                    <td className="py-2 text-sm">{a.claims ?? '-'}</td>
                    <td className="py-2 text-sm">{a.variancePct ?? 0}%</td>
                    <td className="py-2 text-sm">${a.estLoss ?? 0}</td>
                    <td className="py-2">
                      <button
                        className="text-indigo-600 text-xs"
                        onClick={() => addTask({ id: `T-${Date.now()}`, title: `Investigate ${a.cpt || a.alertType}`, assigned: '', due: '', status: 'New', alertId: a.id })}
                      >
                        Create Task
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    );
  }

  // ── CPT Center view ────────────────────────────────────────
  if (view === 'admin-cpt') {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold text-gray-900">High-Volume CPTs</h2>
          <div className="flex items-center gap-2">
            <button onClick={() => handleExportCSV('medpact-cpts.csv', cpts)} className="px-3 py-1 bg-indigo-600 text-white rounded text-xs">Export CSV</button>
            <button onClick={() => handleExportPDF('CPT Center', cpts)} className="px-3 py-1 bg-white border rounded text-xs">Export PDF</button>
          </div>
        </div>

        <div className="bg-white rounded-xl border p-4">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr className="text-left text-xs text-gray-500">
                <th>CPT</th><th>Description</th><th>Claims</th><th>Avg Paid</th><th>Bench</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {cpts.map(c => (
                <tr key={c.cpt} className="hover:bg-gray-50">
                  <td className="py-2 font-mono text-sm">{c.cpt}</td>
                  <td className="py-2 text-sm">{c.description}</td>
                  <td className="py-2 text-sm">{c.claims}</td>
                  <td className="py-2 text-sm">${c.avgPaid}</td>
                  <td className="py-2 text-sm">${c.nationalAvg ?? '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  // ── Tasks view ──────────────────────────────────────────────
  if (view === 'admin-tasks') {
    const [items, setItems] = useState<TaskRow[]>(tasks);
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold text-gray-900">Assigned Tasks</h2>
          <div className="flex items-center gap-2">
            <button onClick={() => handleExportCSV('medpact-tasks.csv', items)} className="px-3 py-1 bg-indigo-600 text-white rounded text-xs">Export CSV</button>
            <button onClick={() => handleExportPDF('Tasks', items)} className="px-3 py-1 bg-white border rounded text-xs">Export PDF</button>
          </div>
        </div>

        <div className="bg-white rounded-xl border p-4">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr className="text-left text-xs text-gray-500">
                <th>Task</th><th>Assigned</th><th>Due</th><th>Status</th><th>Alert</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {items.map(t => (
                <tr key={t.id} className="hover:bg-gray-50">
                  <td className="py-2 text-sm">{t.title}</td>
                  <td className="py-2 text-sm">{t.assigned}</td>
                  <td className="py-2 text-sm">{t.due}</td>
                  <td className="py-2 text-sm">{t.status}</td>
                  <td className="py-2 text-sm">{t.alertId}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  // ── Admin Overview ──────────────────────────────────────────
  if (view === 'admin-overview') {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: 'Total Users', value: '24', icon: '👤', sub: '3 pending invites', color: 'blue' },
            { label: 'Active Tenants', value: '3', icon: '🏢', sub: 'All healthy', color: 'green' },
            { label: 'Roles Defined', value: '5', icon: '🔐', sub: 'Last updated today', color: 'purple' },
            { label: 'System Uptime', value: '99.9%', icon: '✅', sub: 'Last 30 days', color: 'teal' },
          ].map((stat, i) => (
            <div key={i} className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
              <div className="flex items-center justify-between mb-3">
                <span className="text-2xl">{stat.icon}</span>
                <span className="text-xs text-gray-400 bg-gray-50 px-2 py-1 rounded-full">Live</span>
              </div>
              <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
              <div className="text-sm font-medium text-gray-700 mt-1">{stat.label}</div>
              <div className="text-xs text-gray-400 mt-1">{stat.sub}</div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Activity */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="p-4 border-b border-gray-100 flex items-center justify-between">
              <h2 className="font-semibold text-gray-900">Recent Activity</h2>
              <span className="text-xs text-indigo-600 font-medium cursor-pointer hover:underline">View All</span>
            </div>
            <div className="divide-y divide-gray-50">
              {[
                { action: 'User invited', detail: 'dr.patel@medpact.local', time: '2m ago', icon: '➕' },
                { action: 'Role updated', detail: 'Billing Manager permissions changed', time: '1h ago', icon: '🔐' },
                { action: 'Tenant created', detail: 'Westside Eye Group onboarded', time: '3h ago', icon: '🏢' },
                { action: 'Integration synced', detail: 'EHR sync completed successfully', time: '5h ago', icon: '🔗' },
                { action: 'Settings changed', detail: 'MFA enforced for all admins', time: 'Yesterday', icon: '⚙️' },
              ].map((item, i) => (
                <div key={i} className="px-4 py-3 flex items-start gap-3 hover:bg-gray-50">
                  <span className="text-lg mt-0.5">{item.icon}</span>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-gray-800">{item.action}</div>
                    <div className="text-xs text-gray-500 truncate">{item.detail}</div>
                  </div>
                  <span className="text-xs text-gray-400 whitespace-nowrap">{item.time}</span>
                </div>
              ))}
            </div>
          </div>

          {/* System Alerts */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="p-4 border-b border-gray-100">
              <h2 className="font-semibold text-gray-900">System Alerts</h2>
            </div>
            <div className="p-4 space-y-3">
              {[
                { title: 'MFA Not Enabled', msg: '4 users have not enabled multi-factor authentication.', level: 'high' },
                { title: 'API Rate Limit Approaching', msg: 'Turquoise Health API at 78% of monthly quota.', level: 'medium' },
                { title: 'Scheduled Maintenance', msg: 'Database backup window: Sunday 2:00–3:00 AM EST.', level: 'low' },
              ].map((alert, i) => (
                <div key={i} className={`p-3 rounded-lg border ${
                  alert.level === 'high' ? 'bg-red-50 border-red-200' :
                  alert.level === 'medium' ? 'bg-amber-50 border-amber-200' :
                  'bg-blue-50 border-blue-200'
                }`}>
                  <div className="font-medium text-sm">{alert.title}</div>
                  <div className="text-xs text-gray-600 mt-1">{alert.msg}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── User Management ──────────────────────────────────────────
  if (view === 'admin-users') {
    const [search, setSearch] = useState('');
    const users = [
      { name: 'Dr. Chris Williams', email: 'admin@medpact.local', role: 'Super Admin', tenant: 'MedPact HQ', status: 'Active', mfa: true },
      { name: 'Dr. Priya Patel', email: 'ppatel@westside.local', role: 'Practice Admin', tenant: 'Westside Eye', status: 'Active', mfa: true },
      { name: 'James Ortega', email: 'jortega@medpact.local', role: 'Billing Manager', tenant: 'MedPact HQ', status: 'Active', mfa: false },
      { name: 'Sarah Kim', email: 'skim@retina.local', role: 'Viewer', tenant: 'Retina Group', status: 'Pending', mfa: false },
      { name: 'Marcus Lee', email: 'mlee@medpact.local', role: 'MedTech Sales', tenant: 'MedPact HQ', status: 'Active', mfa: true },
    ];
    const filtered = users.filter(u =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
    );
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <input
            type="text"
            placeholder="Search users..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="border border-gray-200 rounded-lg px-3 py-2 text-sm w-64 focus:outline-none focus:ring-2 focus:ring-indigo-300"
          />
          <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700">
            + Invite User
          </button>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                {['Name', 'Email', 'Role', 'Tenant', 'MFA', 'Status', ''].map(h => (
                  <th key={h} className="text-left py-3 px-4 text-xs font-medium text-gray-500">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map((u, i) => (
                <tr key={i} className="hover:bg-gray-50">
                  <td className="py-3 px-4 text-sm font-medium text-gray-900">{u.name}</td>
                  <td className="py-3 px-4 text-sm text-gray-500">{u.email}</td>
                  <td className="py-3 px-4 text-sm">
                    <span className="px-2 py-1 bg-indigo-50 text-indigo-700 rounded-full text-xs font-medium">{u.role}</span>
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-500">{u.tenant}</td>
                  <td className="py-3 px-4 text-sm">
                    <span className={`text-xs font-medium ${u.mfa ? 'text-green-600' : 'text-red-500'}`}>{u.mfa ? '✅ On' : '⚠️ Off'}</span>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`text-xs px-2 py-1 rounded-full ${u.status === 'Active' ? 'bg-green-50 text-green-700' : 'bg-yellow-50 text-yellow-700'}`}>{u.status}</span>
                  </td>
                  <td className="py-3 px-4">
                    <button className="text-xs text-indigo-600 hover:underline">Edit</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  // ── Roles & Permissions ──────────────────────────────────────
  if (view === 'admin-roles') {
    const roles = [
      { name: 'Super Admin', users: 1, color: 'red', perms: ['All permissions', 'Tenant management', 'Billing access', 'User management', 'System settings'] },
      { name: 'Practice Admin', users: 3, color: 'blue', perms: ['Dashboard access', 'User management', 'Data upload', 'Reports'] },
      { name: 'Billing Manager', users: 2, color: 'green', perms: ['Billing dashboard', 'Claims view', 'Price transparency', 'Reports'] },
      { name: 'MedTech Sales', users: 5, color: 'rose', perms: ['MedTech dashboard', 'Territory map', 'Physician targets', 'Sales forecasting'] },
      { name: 'Viewer', users: 13, color: 'gray', perms: ['Read-only dashboard', 'Reports view'] },
    ];
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {roles.map((role, i) => (
          <div key={i} className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-gray-900">{role.name}</h3>
              <span className="text-xs text-gray-500">{role.users} user{role.users !== 1 ? 's' : ''}</span>
            </div>
            <ul className="space-y-1 mb-4">
              {role.perms.map((p, j) => (
                <li key={j} className="text-xs text-gray-600 flex items-center gap-2">
                  <span className="text-green-500">✓</span>{p}
                </li>
              ))}
            </ul>
            <button className="text-xs text-indigo-600 hover:underline font-medium">Edit Role</button>
          </div>
        ))}
        <div className="bg-white rounded-xl shadow-sm border border-dashed border-gray-200 p-5 flex flex-col items-center justify-center text-gray-400 hover:border-indigo-300 hover:text-indigo-500 cursor-pointer transition-colors">
          <span className="text-3xl mb-2">+</span>
          <span className="text-sm font-medium">Create New Role</span>
        </div>
      </div>
    );
  }

  // ── Tenant Management ────────────────────────────────────────
  if (view === 'admin-tenants') {
    return (
      <div className="space-y-4">
        <div className="flex justify-end">
          <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700">
            + Add Tenant
          </button>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                {['Tenant Name', 'Slug', 'Plan', 'Users', 'Created', 'Status', ''].map(h => (
                  <th key={h} className="text-left py-3 px-4 text-xs font-medium text-gray-500">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {[
                { name: 'MedPact HQ', slug: 'medpact-hq', plan: 'Enterprise', users: 8, created: 'Jan 2025', status: 'Active' },
                { name: 'Westside Eye Group', slug: 'westside-eye', plan: 'Professional', users: 12, created: 'Mar 2025', status: 'Active' },
                { name: 'Retina Specialists', slug: 'retina-specialists', plan: 'Professional', users: 4, created: 'Jun 2025', status: 'Trial' },
              ].map((t, i) => (
                <tr key={i} className="hover:bg-gray-50">
                  <td className="py-3 px-4 text-sm font-medium text-gray-900">{t.name}</td>
                  <td className="py-3 px-4 text-sm font-mono text-gray-500">{t.slug}</td>
                  <td className="py-3 px-4 text-sm">
                    <span className="px-2 py-1 bg-indigo-50 text-indigo-700 rounded-full text-xs">{t.plan}</span>
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-600">{t.users}</td>
                  <td className="py-3 px-4 text-sm text-gray-500">{t.created}</td>
                  <td className="py-3 px-4">
                    <span className={`text-xs px-2 py-1 rounded-full ${t.status === 'Active' ? 'bg-green-50 text-green-700' : 'bg-yellow-50 text-yellow-700'}`}>{t.status}</span>
                  </td>
                  <td className="py-3 px-4">
                    <button className="text-xs text-indigo-600 hover:underline">Manage</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  // ── Billing ──────────────────────────────────────────────────
  if (view === 'admin-billing') {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { label: 'Monthly Revenue', value: '$4,287', icon: '💳', sub: '+12% vs last month' },
            { label: 'Active Subscriptions', value: '3', icon: '📄', sub: '1 trial expiring soon' },
            { label: 'Next Invoice', value: 'Aug 1, 2026', icon: '🗓️', sub: 'Est. $4,500' },
          ].map((s, i) => (
            <div key={i} className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
              <div className="text-2xl mb-2">{s.icon}</div>
              <div className="text-xl font-bold text-gray-900">{s.value}</div>
              <div className="text-sm text-gray-600">{s.label}</div>
              <div className="text-xs text-gray-400 mt-1">{s.sub}</div>
            </div>
          ))}
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="p-4 border-b border-gray-100">
            <h2 className="font-semibold text-gray-900">Invoice History</h2>
          </div>
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                {['Invoice', 'Tenant', 'Amount', 'Date', 'Status', ''].map(h => (
                  <th key={h} className="text-left py-3 px-4 text-xs font-medium text-gray-500">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {[
                { id: 'INV-0024', tenant: 'MedPact HQ', amount: '$1,800', date: 'Jul 1, 2026', status: 'Paid' },
                { id: 'INV-0023', tenant: 'Westside Eye Group', amount: '$1,200', date: 'Jul 1, 2026', status: 'Paid' },
                { id: 'INV-0022', tenant: 'Retina Specialists', amount: '$0', date: 'Jul 1, 2026', status: 'Trial' },
                { id: 'INV-0021', tenant: 'MedPact HQ', amount: '$1,800', date: 'Jun 1, 2026', status: 'Paid' },
              ].map((inv, i) => (
                <tr key={i} className="hover:bg-gray-50">
                  <td className="py-3 px-4 text-sm font-mono text-indigo-600">{inv.id}</td>
                  <td className="py-3 px-4 text-sm text-gray-700">{inv.tenant}</td>
                  <td className="py-3 px-4 text-sm font-semibold">{inv.amount}</td>
                  <td className="py-3 px-4 text-sm text-gray-500">{inv.date}</td>
                  <td className="py-3 px-4">
                    <span className={`text-xs px-2 py-1 rounded-full ${inv.status === 'Paid' ? 'bg-green-50 text-green-700' : 'bg-yellow-50 text-yellow-700'}`}>{inv.status}</span>
                  </td>
                  <td className="py-3 px-4">
                    <button className="text-xs text-indigo-600 hover:underline">Download</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  // ── Integrations ─────────────────────────────────────────────
  if (view === 'admin-integrations') {
    const integrations = [
      { name: 'Turquoise Health', desc: 'Price transparency MRF data', icon: '💲', status: 'Connected', color: 'teal' },
      { name: 'EHR Connector', desc: 'Epic / Athena / Kareo sync', icon: '🏥', status: 'Connected', color: 'blue' },
      { name: 'Stripe Billing', desc: 'Subscription & invoice management', icon: '💳', status: 'Connected', color: 'purple' },
      { name: 'SendGrid', desc: 'Transactional email delivery', icon: '📧', status: 'Connected', color: 'green' },
      { name: 'Salesforce CRM', desc: 'MedTech sales pipeline sync', icon: '☁️', status: 'Disconnected', color: 'gray' },
      { name: 'Twilio SMS', desc: 'Patient & staff notifications', icon: '📱', status: 'Disconnected', color: 'gray' },
    ];
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {integrations.map((int, i) => (
          <div key={i} className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-2xl">{int.icon}</span>
              <span className={`text-xs px-2 py-1 rounded-full font-medium ${int.status === 'Connected' ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-500'}`}>{int.status}</span>
            </div>
            <div className="font-semibold text-gray-900">{int.name}</div>
            <div className="text-xs text-gray-500 mt-1 mb-4">{int.desc}</div>
            <button className={`text-xs font-medium ${int.status === 'Connected' ? 'text-red-500 hover:underline' : 'text-indigo-600 hover:underline'}`}>
              {int.status === 'Connected' ? 'Disconnect' : 'Connect'}
            </button>
          </div>
        ))}
      </div>
    );
  }

  // ── Audit Logs ───────────────────────────────────────────────
  if (view === 'admin-audit') {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="font-semibold text-gray-900">Audit Logs</h2>
          <button className="text-xs text-indigo-600 hover:underline font-medium">Export CSV</button>
        </div>
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              {['Timestamp', 'User', 'Action', 'Resource', 'IP Address', 'Result'].map(h => (
                <th key={h} className="text-left py-3 px-4 text-xs font-medium text-gray-500">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {[
              { time: '2026-07-09 09:14', user: 'admin@medpact.local', action: 'LOGIN', resource: 'Auth', ip: '192.168.1.10', result: 'Success' },
              { time: '2026-07-09 09:10', user: 'admin@medpact.local', action: 'UPDATE_ROLE', resource: 'Roles', ip: '192.168.1.10', result: 'Success' },
              { time: '2026-07-09 08:55', user: 'jortega@medpact.local', action: 'VIEW_BILLING', resource: 'Billing', ip: '10.0.0.4', result: 'Success' },
              { time: '2026-07-09 08:30', user: 'unknown', action: 'LOGIN', resource: 'Auth', ip: '45.33.32.156', result: 'Failed' },
              { time: '2026-07-09 08:15', user: 'ppatel@westside.local', action: 'DATA_UPLOAD', resource: 'Files', ip: '10.0.0.8', result: 'Success' },
              { time: '2026-07-08 17:45', user: 'admin@medpact.local', action: 'CREATE_TENANT', resource: 'Tenants', ip: '192.168.1.10', result: 'Success' },
            ].map((log, i) => (
              <tr key={i} className="hover:bg-gray-50">
                <td className="py-3 px-4 text-xs font-mono text-gray-500">{log.time}</td>
                <td className="py-3 px-4 text-xs text-gray-700">{log.user}</td>
                <td className="py-3 px-4 text-xs font-mono font-medium text-indigo-600">{log.action}</td>
                <td className="py-3 px-4 text-xs text-gray-600">{log.resource}</td>
                <td className="py-3 px-4 text-xs font-mono text-gray-500">{log.ip}</td>
                <td className="py-3 px-4">
                  <span className={`text-xs px-2 py-1 rounded-full ${log.result === 'Success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>{log.result}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  // ── System Settings ──────────────────────────────────────────
  if (view === 'admin-settings') {
    return (
      <div className="space-y-6 max-w-2xl">
        {[
          {
            title: 'Security',
            fields: [
              { label: 'Enforce MFA for all admins', type: 'toggle', value: true },
              { label: 'Session timeout (minutes)', type: 'number', value: '60' },
              { label: 'Max failed login attempts', type: 'number', value: '5' },
            ],
          },
          {
            title: 'Notifications',
            fields: [
              { label: 'Email alerts on failed logins', type: 'toggle', value: true },
              { label: 'Weekly system health report', type: 'toggle', value: true },
              { label: 'Alert email address', type: 'text', value: 'admin@medpact.local' },
            ],
          },
          {
            title: 'Data & Privacy',
            fields: [
              { label: 'Audit log retention (days)', type: 'number', value: '90' },
              { label: 'Auto-purge inactive users after (days)', type: 'number', value: '365' },
            ],
          },
        ].map((section, i) => (
          <div key={i} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="font-semibold text-gray-900 mb-4">{section.title}</h3>
            <div className="space-y-4">
              {section.fields.map((field, j) => (
                <div key={j} className="flex items-center justify-between">
                  <label className="text-sm text-gray-700">{field.label}</label>
                  {field.type === 'toggle' ? (
                    <div className={`w-10 h-6 rounded-full flex items-center px-1 cursor-pointer transition-colors ${field.value ? 'bg-indigo-500' : 'bg-gray-300'}`}>
                      <div className={`w-4 h-4 bg-white rounded-full shadow transition-transform ${field.value ? 'translate-x-4' : ''}`} />
                    </div>
                  ) : (
                    <input
                      type={field.type}
                      defaultValue={field.value as string}
                      className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm w-48 focus:outline-none focus:ring-2 focus:ring-indigo-300"
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
        <button className="px-6 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700">
          Save Settings
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <p className="text-gray-500">Select an option from the Admin Manager menu</p>
    </div>
  );
}