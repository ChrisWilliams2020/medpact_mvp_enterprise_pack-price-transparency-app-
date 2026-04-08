"use client";

import * as React from "react";
import Link from "next/link";
import { Button, Container } from "@/components/ui";

// Tooltip component with hover instructions
function Tooltip({ children, text }: { children: React.ReactNode; text: string }) {
  return (
    <div className="relative group inline-block">
      {children}
      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-50 max-w-xs text-center shadow-lg">
        {text}
        <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-900" />
      </div>
    </div>
  );
}

// Info icon for inline help
function InfoTip({ text }: { text: string }) {
  return (
    <Tooltip text={text}>
      <span className="inline-flex items-center justify-center w-4 h-4 ml-1 text-xs bg-gray-200 text-gray-600 rounded-full cursor-help hover:bg-blue-100 hover:text-blue-600">?</span>
    </Tooltip>
  );
}

// SMS Notification Status Component
function SmsNotificationStatus() {
  const [smsStatus, setSmsStatus] = React.useState<{ configured: boolean; notifyPhone: string | null } | null>(null);
  const [testing, setTesting] = React.useState(false);
  const [testResult, setTestResult] = React.useState<string>('');

  React.useEffect(() => {
    fetch('/api/notify/sms')
      .then(res => res.json())
      .then(data => setSmsStatus(data))
      .catch(() => setSmsStatus({ configured: false, notifyPhone: null }));
  }, []);

  async function sendTestSms() {
    setTesting(true);
    setTestResult('');
    try {
      const res = await fetch('/api/notify/sms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: 'Test User',
          email: 'test@medpact.com',
          organization: 'MedPACT Admin Test',
          type: 'Test Notification',
        }),
      });
      const data = await res.json();
      if (data.success && data.configured) {
        setTestResult('✓ Test SMS sent successfully!');
      } else if (data.success && !data.configured) {
        setTestResult('⚠️ Twilio not configured - check env vars');
      } else {
        setTestResult('✗ Failed to send SMS');
      }
    } catch {
      setTestResult('✗ Error sending test SMS');
    }
    setTesting(false);
  }

  return (
    <div className="bg-green-50 rounded-xl p-6 border border-green-200">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-semibold text-lg text-green-900">📱 SMS Notifications</h2>
        {smsStatus?.configured ? (
          <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">✓ Active</span>
        ) : (
          <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full">Not Configured</span>
        )}
      </div>
      
      <p className="text-sm text-green-800 mb-4">
        When someone submits the contact form, the Communications Director receives an instant text message notification.
      </p>
      
      <div className="space-y-3 text-sm">
        <div className="flex justify-between py-2 border-b border-green-200">
          <span className="text-green-700">Status</span>
          <span className={smsStatus?.configured ? 'text-green-600 font-medium' : 'text-yellow-600 font-medium'}>
            {smsStatus?.configured ? '✓ Enabled' : '⚠️ Needs Setup'}
          </span>
        </div>
        <div className="flex justify-between py-2 border-b border-green-200">
          <span className="text-green-700">Notify Phone</span>
          <span className="text-green-800 font-mono">
            {smsStatus?.notifyPhone || 'Not set'}
          </span>
        </div>
        <div className="flex items-center justify-between py-2">
          <span className="text-green-700">Test Notification</span>
          <button
            onClick={sendTestSms}
            disabled={testing}
            className="px-3 py-1 bg-green-600 text-white text-xs rounded-lg hover:bg-green-700 disabled:opacity-50"
          >
            {testing ? 'Sending...' : 'Send Test SMS'}
          </button>
        </div>
        {testResult && (
          <div className={`py-2 px-3 rounded-lg text-sm ${
            testResult.includes('✓') ? 'bg-green-100 text-green-700' : 
            testResult.includes('⚠️') ? 'bg-yellow-100 text-yellow-700' : 
            'bg-red-100 text-red-700'
          }`}>
            {testResult}
          </div>
        )}
      </div>
    </div>
  );
}

export default function AdminPage() {
  const [member, setMember] = React.useState('');
  const [file, setFile] = React.useState<File | null>(null);
  const [status, setStatus] = React.useState('');
  const [files, setFiles] = React.useState<{ name: string; url: string }[]>([]);
  const [activeTab, setActiveTab] = React.useState<'dashboard' | 'team' | 'advisory' | 'media' | 'crm' | 'chat'>('dashboard');
  const [crmSubmissions, setCrmSubmissions] = React.useState<any[]>([]);
  const [chatSessions, setChatSessions] = React.useState<any[]>([]);
  const [teamVisibility, setTeamVisibility] = React.useState<Record<string, boolean>>({});

  async function refreshFiles() {
    try {
      const res = await fetch('/api/media');
      const json = await res.json();
      setFiles(json?.files || []);
    } catch (e) {}
  }

  async function loadTeamVisibility() {
    try {
      const res = await fetch('/api/team/visibility');
      const data = await res.json();
      setTeamVisibility(data);
    } catch (e) {}
  }

  async function toggleTeamMember(slug: string, visible: boolean) {
    try {
      await fetch('/api/team/visibility', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug, visible }),
      });
      setTeamVisibility(prev => ({ ...prev, [slug]: visible }));
    } catch (e) {
      console.error('Failed to toggle team member:', e);
    }
  }

  React.useEffect(() => { 
    refreshFiles();
    loadTeamVisibility();
    // Load CRM submissions from localStorage (demo)
    const saved = localStorage.getItem('medpact_crm_submissions');
    if (saved) setCrmSubmissions(JSON.parse(saved));
    // Load chat sessions
    const sessions = localStorage.getItem('medpact_chat_sessions');
    if (sessions) setChatSessions(JSON.parse(sessions));
  }, []);

  async function uploadAsMultipart(filenamePrefix = '') {
    if (!file) return setStatus('No file selected');
    setStatus('Uploading...');
    try {
      const presignRes = await fetch('/api/s3/presign', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ filename: (filenamePrefix ? `${filenamePrefix}-${file.name}` : file.name) }) });
      if (presignRes.ok) {
        const presign = await presignRes.json();
        const uploadUrl = presign?.url;
        const publicUrl = presign?.publicUrl || uploadUrl;
        if (uploadUrl) {
          await fetch(uploadUrl, { method: 'PUT', headers: { 'Content-Type': file.type || 'application/octet-stream' }, body: file });
          if (filenamePrefix) await fetch('/api/mapping/set', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ key: filenamePrefix, url: publicUrl }) });
          setStatus(`Uploaded: ${publicUrl}`);
          await refreshFiles();
          return;
        }
      }
      const fd = new FormData();
      fd.append('file', file);
      if (filenamePrefix) fd.append('key', filenamePrefix);
      const res = await fetch('/api/upload-photo', { method: 'POST', body: fd });
      const json = await res.json();
      if (json?.url) setStatus(`Uploaded: ${json.url}`);
      await refreshFiles();
    } catch (e: any) {
      setStatus(String(e));
    }
  }

  async function deleteFile(name: string) {
    setStatus('Deleting...');
    const res = await fetch('/api/media', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name }) });
    if (res.ok) {
      setStatus('Deleted');
      await refreshFiles();
    } else setStatus('Delete failed');
  }

  async function setActivePlatform(url: string) {
    setStatus('Setting active...');
    const res = await fetch('/api/platform/active', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ url }) });
    if (res.ok) setStatus('Active platform video updated'); else setStatus('Failed to set active');
  }

  function logout() {
    document.cookie = 'admin=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT';
    window.location.href = '/admin/login';
  }

  const tabs = [
    { id: 'dashboard', label: '📊 Dashboard', tip: 'Overview of site stats and quick actions' },
    { id: 'team', label: '👥 Team', tip: 'Manage team member visibility on the website' },
    { id: 'advisory', label: '🎓 Advisory Boards', tip: 'Manage advisory board members' },
    { id: 'media', label: '🖼️ Media', tip: 'Upload and manage images, videos, and files' },
    { id: 'crm', label: '📧 CRM Leads', tip: 'View contact form submissions' },
    { id: 'chat', label: '💬 Chat History', tip: 'Review KCN Chat conversations' },
  ] as const;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <Container className="py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-bold text-gray-900">MedPACT Admin</h1>
            <Tooltip text="This admin panel is password-protected. Only team members can access it.">
              <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full cursor-help">Team Only</span>
            </Tooltip>
          </div>
          <div className="flex items-center gap-3">
            <Tooltip text="Return to the public website">
              <Link href="/" className="text-sm text-gray-600 hover:text-gray-900">← Back to Site</Link>
            </Tooltip>
            <Tooltip text="Sign out of admin panel">
              <Button variant="ghost" onClick={logout}>Logout</Button>
            </Tooltip>
            <Button variant="ghost" onClick={logout}>Logout</Button>
          </div>
        </Container>
      </div>

      <Container className="py-8">
        {/* Tab Navigation */}
        <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
          {tabs.map(tab => (
            <Tooltip key={tab.id} text={tab.tip}>
              <button
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                  activeTab === tab.id 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                }`}
              >
                {tab.label}
              </button>
            </Tooltip>
          ))}
        </div>

        {/* Dashboard Tab */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white rounded-xl p-5 border border-gray-200">
                <div className="text-2xl font-bold text-blue-600">{files.length}</div>
                <div className="text-sm text-gray-500">Media Files</div>
              </div>
              <div className="bg-white rounded-xl p-5 border border-gray-200">
                <div className="text-2xl font-bold text-green-600">{crmSubmissions.length}</div>
                <div className="text-sm text-gray-500">CRM Leads</div>
              </div>
              <div className="bg-white rounded-xl p-5 border border-gray-200">
                <div className="text-2xl font-bold text-purple-600">{chatSessions.length}</div>
                <div className="text-sm text-gray-500">Chat Sessions</div>
              </div>
              <div className="bg-white rounded-xl p-5 border border-gray-200">
                <div className="text-2xl font-bold text-orange-600">21</div>
                <div className="text-sm text-gray-500">Network Locations</div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <h2 className="font-semibold text-lg mb-4">Quick Actions</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <Tooltip text="Add, edit, or remove practice locations shown on the interactive US map">
                  <Link href="/admin/network" className="block">
                    <Button variant="secondary" className="w-full justify-center">🗺️ Manage Network Map</Button>
                  </Link>
                </Tooltip>
                <Tooltip text="Upload team photos, videos, or other media files to Cloudflare R2 storage">
                  <button onClick={() => setActiveTab('media')} className="w-full px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium">
                    🖼️ Upload Media
                  </button>
                </Tooltip>
                <Tooltip text="Review contact form submissions and potential leads">
                  <button onClick={() => setActiveTab('crm')} className="w-full px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium">
                    📧 View Leads
                  </button>
                </Tooltip>
                <Tooltip text="Open the contact form to test that submissions work correctly">
                  <Link href="/contact" className="block">
                    <button className="w-full px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium">
                      📝 Test Contact Form
                    </button>
                  </Link>
                </Tooltip>
              </div>
            </div>

            {/* Site Links */}
            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <h2 className="font-semibold text-lg mb-4">Site Pages</h2>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                {[
                  { name: 'Home', href: '/' },
                  { name: 'Platform', href: '/platform' },
                  { name: 'Team', href: '/team' },
                  { name: 'Category', href: '/category' },
                  { name: 'Manifesto', href: '/manifesto' },
                  { name: 'Resources', href: '/resources' },
                  { name: 'Contact', href: '/contact' },
                  { name: 'Network Map', href: '/network' },
                  { name: 'KCN Chat', href: '/kcn-chat' },
                  { name: 'Demo', href: '/demo' },
                ].map(page => (
                  <Link key={page.href} href={page.href} target="_blank" className="px-3 py-2 bg-gray-50 hover:bg-gray-100 rounded-lg text-sm text-center border border-gray-200">
                    {page.name}
                  </Link>
                ))}
              </div>
            </div>

            {/* Environment Status */}
            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <h2 className="font-semibold text-lg mb-4">Environment Status</h2>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-500">Deployment</span>
                  <span className="text-green-600 font-medium">✓ Live on Vercel</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-500">Production URL</span>
                  <a href="https://medpact-site-vscode-packet-v3.vercel.app" target="_blank" className="text-blue-600 hover:underline">medpact-site-vscode-packet-v3.vercel.app</a>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-500">Media Storage</span>
                  <span className="text-yellow-600 font-medium">Configure R2/S3</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-500">AI Chat Backend</span>
                  <span className="text-yellow-600 font-medium">Needs API Key</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-500">SMS Notifications</span>
                  <span className="text-yellow-600 font-medium">Configure Twilio</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-gray-500">Admin Auth</span>
                  <span className="text-green-600 font-medium">✓ HMAC Signed</span>
                </div>
              </div>
            </div>

            {/* Setup Guide */}
            <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
              <h2 className="font-semibold text-lg mb-3 text-blue-900">⚙️ Setup Guide</h2>
              <div className="text-sm text-blue-800 space-y-3">
                <div>
                  <strong>🌐 Custom Domain:</strong>
                  <ul className="mt-1 ml-4 list-disc text-blue-700">
                    <li>Go to Vercel → Project Settings → Domains</li>
                    <li>Add your domain (e.g., medpact.com or medpact.health)</li>
                    <li>Update DNS records as instructed by Vercel</li>
                  </ul>
                </div>
                <div>
                  <strong>Cloudflare R2 (Recommended):</strong>
                  <ul className="mt-1 ml-4 list-disc text-blue-700">
                    <li>R2_ACCOUNT_ID - Your Cloudflare account ID</li>
                    <li>R2_ACCESS_KEY_ID - R2 API token access key</li>
                    <li>R2_SECRET_ACCESS_KEY - R2 API token secret</li>
                    <li>R2_BUCKET - Your bucket name</li>
                    <li>R2_PUBLIC_URL - Public URL (optional)</li>
                  </ul>
                </div>
                <div>
                  <strong>AI Chat:</strong>
                  <ul className="mt-1 ml-4 list-disc text-blue-700">
                    <li>OPENAI_API_KEY or ANTHROPIC_API_KEY</li>
                  </ul>
                </div>
                <div>
                  <strong>📱 SMS Notifications (Twilio):</strong>
                  <ul className="mt-1 ml-4 list-disc text-blue-700">
                    <li>TWILIO_ACCOUNT_SID - Your Twilio account SID</li>
                    <li>TWILIO_AUTH_TOKEN - Your Twilio auth token</li>
                    <li>TWILIO_PHONE_NUMBER - Your Twilio phone number</li>
                    <li>NOTIFY_PHONE_NUMBER - Comms Director's cell (e.g., +15551234567)</li>
                  </ul>
                </div>
                <div>
                  <strong>📧 Email Notifications (SendGrid/Resend):</strong>
                  <ul className="mt-1 ml-4 list-disc text-blue-700">
                    <li>SENDGRID_API_KEY - SendGrid API key (primary)</li>
                    <li>RESEND_API_KEY - Resend API key (backup)</li>
                    <li>NOTIFY_EMAIL - Email to receive notifications</li>
                    <li>FROM_EMAIL - Sender email (default: noreply@medpact.com)</li>
                  </ul>
                </div>
                <div>
                  <strong>📊 Analytics & Tracking:</strong>
                  <ul className="mt-1 ml-4 list-disc text-blue-700">
                    <li>NEXT_PUBLIC_GA_ID - Google Analytics 4 ID (G-XXXXXXX)</li>
                    <li>NEXT_PUBLIC_LINKEDIN_PARTNER_ID - LinkedIn Insight Tag ID</li>
                  </ul>
                </div>
                <div>
                  <strong>📅 Calendly Integration:</strong>
                  <ul className="mt-1 ml-4 list-disc text-blue-700">
                    <li>NEXT_PUBLIC_CALENDLY_URL - Your Calendly scheduling link</li>
                    <li>Example: https://calendly.com/medpact/executive-briefing</li>
                  </ul>
                </div>
                <div>
                  <strong>Admin Password:</strong>
                  <ul className="mt-1 ml-4 list-disc text-blue-700">
                    <li>ADMIN_PASS - Set a secure password</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* SMS Notification Settings */}
            <SmsNotificationStatus />
          </div>
        )}

        {/* Team Tab */}
        {activeTab === 'team' && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="font-semibold text-lg">Team Member Visibility</h2>
                  <p className="text-sm text-gray-500 mt-1">Toggle which team members appear on the public Team page.</p>
                </div>
                <Link href="/team" target="_blank" className="text-sm text-blue-600 hover:underline">
                  View Team Page →
                </Link>
              </div>
              
              <div className="grid gap-3">
                {[
                  { slug: 'christopher-williams-md', name: 'Christopher Williams, MD', title: 'Founder & CEO' },
                  { slug: 'jason-bacharach-md', name: 'Jason Bacharach, MD', title: 'Medical Director' },
                  { slug: 'cathleen-mccabe-md', name: 'Cathleen McCabe, MD', title: 'Chief Officer of Operational Logistics' },
                  { slug: 'richard-lindstrom-md', name: 'Richard Lindstrom, MD', title: 'Senior Advisor' },
                  { slug: 'terrence-duckette', name: 'Terrence Duckette', title: 'Chief Strategy & Sales Leadership' },
                  { slug: 'brian-murphey', name: 'Brian Murphey', title: 'Chief Commercialization Officer' },
                  { slug: 'rob-ostoich', name: 'Rob Ostoich', title: 'President of Sales' },
                  { slug: 'bill-williams', name: 'Bill Williams', title: 'Corporate Governance & Contracts' },
                  { slug: 'dave-davis', name: 'Dave Davis', title: 'Operations & Business Planning' },
                  { slug: 'anita-galiano', name: 'Anita Galiano', title: 'Human Resources & Organizational Infrastructure' },
                  { slug: 'diana-banks', name: 'Diana Banks', title: 'Board Relations | Operations' },
                  { slug: 'lindsay-saddic', name: 'Lindsay Saddic', title: 'Communications | Research | CRM' },
                  { slug: 'chuck-yardley-advisor', name: 'Chuck Yardley', title: 'Software Design | Compliance' },
                  { slug: 'robel-tadele', name: 'Robel Tadele', title: 'IT | Software Development' },
                  { slug: 'chris-louis', name: 'Chris Louis', title: 'Product Testing | QA' },
                ].map((member) => (
                  <div 
                    key={member.slug}
                    className={`flex items-center justify-between p-4 rounded-lg border ${
                      teamVisibility[member.slug] !== false 
                        ? 'bg-green-50 border-green-200' 
                        : 'bg-gray-50 border-gray-200'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full ${
                        teamVisibility[member.slug] !== false ? 'bg-green-500' : 'bg-gray-300'
                      }`} />
                      <div>
                        <div className="font-medium text-sm">{member.name}</div>
                        <div className="text-xs text-gray-500">{member.title}</div>
                      </div>
                    </div>
                    <button
                      onClick={() => toggleTeamMember(member.slug, teamVisibility[member.slug] === false)}
                      className={`px-4 py-2 text-xs font-medium rounded-lg transition-colors ${
                        teamVisibility[member.slug] !== false
                          ? 'bg-red-100 text-red-700 hover:bg-red-200'
                          : 'bg-green-100 text-green-700 hover:bg-green-200'
                      }`}
                    >
                      {teamVisibility[member.slug] !== false ? '👁️ Hide' : '👁️‍🗨️ Show'}
                    </button>
                  </div>
                ))}
              </div>

              <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-sm text-blue-800">
                  <strong>Note:</strong> Changes take effect immediately. Hidden team members won't appear on the public Team page.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Advisory Boards Tab */}
        {activeTab === 'advisory' && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="font-semibold text-lg">Advisory Boards Management</h2>
                  <p className="text-sm text-gray-500 mt-1">Manage members of your Medical, Technology, Practice Manager, and Consultant Advisory Boards.</p>
                </div>
                <Link href="/advisory" target="_blank" className="text-sm text-blue-600 hover:underline">
                  View Advisory Page →
                </Link>
              </div>
              
              <div className="p-6 bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl border border-purple-100">
                <p className="text-gray-700 mb-4">
                  The Advisory Boards page allows you to directly edit board members. Click the button below to manage all four advisory boards:
                </p>
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="p-4 bg-white rounded-lg border">
                    <h3 className="font-semibold text-sm text-purple-800">🏥 Medical Advisory Board</h3>
                    <p className="text-xs text-gray-500 mt-1">Expert physicians guiding clinical strategy</p>
                  </div>
                  <div className="p-4 bg-white rounded-lg border">
                    <h3 className="font-semibold text-sm text-blue-800">💻 Technology Advisory Board</h3>
                    <p className="text-xs text-gray-500 mt-1">Tech leaders driving innovation</p>
                  </div>
                  <div className="p-4 bg-white rounded-lg border">
                    <h3 className="font-semibold text-sm text-green-800">📋 Practice Manager Advisory Board</h3>
                    <p className="text-xs text-gray-500 mt-1">Operations experts optimizing workflows</p>
                  </div>
                  <div className="p-4 bg-white rounded-lg border">
                    <h3 className="font-semibold text-sm text-orange-800">🎯 Consultant Advisory Board</h3>
                    <p className="text-xs text-gray-500 mt-1">Strategic consultants providing guidance</p>
                  </div>
                </div>
                <Link 
                  href="/advisory"
                  target="_blank"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium"
                >
                  <span>🎓</span>
                  Open Advisory Boards Editor
                </Link>
              </div>

              <div className="mt-6 p-4 bg-amber-50 rounded-lg border border-amber-200">
                <p className="text-sm text-amber-800">
                  <strong>Tip:</strong> Use the "Edit" button on the Advisory page to add, remove, or modify board members. Changes are saved automatically.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Media Tab */}
        {activeTab === 'media' && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <div className="flex items-center gap-2 mb-4">
                <h2 className="font-semibold text-lg">Upload Media</h2>
                <InfoTip text="Upload images, videos, or documents. They'll be stored in cloud storage for permanent access." />
              </div>
              <p className="text-sm text-gray-500 mb-4">Files are stored in Cloudflare R2 (or S3) for permanent, portable storage.</p>
              <div className="space-y-3">
                <div className="relative">
                  <input 
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" 
                    placeholder="File key (optional, e.g. jane-doe for team photo)" 
                    value={member} 
                    onChange={(e) => setMember(e.target.value)} 
                  />
                  <InfoTip text="Optional: Enter a key like 'chris-williams' to link this file to a team member. Leave blank for general uploads." />
                </div>
                <input 
                  type="file" 
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" 
                  onChange={(e) => setFile(e.target.files?.[0] ?? null)} 
                />
                <div className="flex gap-2">
                  <Tooltip text="Upload the selected file to cloud storage">
                    <Button onClick={() => uploadAsMultipart(member)}>Upload</Button>
                  </Tooltip>
                </div>
              </div>
              {status && <div className="mt-3 text-sm text-gray-600 bg-gray-50 p-2 rounded">{status}</div>}
            </div>

            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <div className="flex items-center gap-2 mb-4">
                <h2 className="font-semibold text-lg">Media Gallery ({files.length} files)</h2>
                <InfoTip text="All uploaded files appear here. Click 'Set Active' to use a video on the platform page, or 'Delete' to remove." />
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {files.map(f => (
                  <div key={f.name} className="border border-gray-200 rounded-xl p-3 bg-gray-50">
                    <div className="truncate text-xs text-gray-500 mb-2">{f.name}</div>
                    <div>
                      {/(png|jpg|jpeg|webp)$/i.test(f.name) 
                        ? <img src={f.url} alt={f.name} className="h-24 w-full object-cover rounded-lg" /> 
                        : <div className="h-24 w-full bg-gray-200 flex items-center justify-center text-xs rounded-lg">{f.name.split('.').pop()?.toUpperCase()}</div>
                      }
                    </div>
                    <div className="mt-3 flex gap-2">
                      <Tooltip text="Set this as the active video shown on the Platform page">
                        <button onClick={() => setActivePlatform(f.url)} className="flex-1 px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs hover:bg-blue-200">Set Active</button>
                      </Tooltip>
                      <Tooltip text="Permanently delete this file from storage">
                        <button onClick={() => deleteFile(f.name)} className="px-2 py-1 bg-red-100 text-red-700 rounded text-xs hover:bg-red-200">Delete</button>
                      </Tooltip>
                    </div>
                  </div>
                ))}
                {files.length === 0 && (
                  <div className="col-span-full text-center py-8 text-gray-400">
                    No media files uploaded yet
                    <p className="text-xs mt-1">Configure R2 storage in Vercel env vars to enable uploads</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* CRM Tab */}
        {activeTab === 'crm' && (
          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <div className="flex items-center gap-2 mb-4">
              <h2 className="font-semibold text-lg">CRM Submissions</h2>
              <InfoTip text="Contact form submissions. Configure a CRM webhook in Vercel env vars to sync with HubSpot, Salesforce, etc." />
            </div>
            <p className="text-sm text-gray-500 mb-4">Contact form submissions are sent to your configured CRM. Below shows local demo data.</p>
            
            {crmSubmissions.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-2 px-3">Name</th>
                      <th className="text-left py-2 px-3">Email</th>
                      <th className="text-left py-2 px-3">Organization</th>
                      <th className="text-left py-2 px-3">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {crmSubmissions.map((sub, i) => (
                      <tr key={i} className="border-b border-gray-100">
                        <td className="py-2 px-3">{sub.name}</td>
                        <td className="py-2 px-3">{sub.email}</td>
                        <td className="py-2 px-3">{sub.organization}</td>
                        <td className="py-2 px-3 text-gray-500">{new Date(sub.date).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-400">
                <p>No submissions yet.</p>
                <p className="text-xs mt-2">To see CRM data, configure a CRM integration (HubSpot, Salesforce, etc.)</p>
              </div>
            )}
          </div>
        )}

        {/* Chat History Tab */}
        {activeTab === 'chat' && (
          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <div className="flex items-center gap-2 mb-4">
              <h2 className="font-semibold text-lg">KCN Chat Sessions</h2>
              <InfoTip text="View conversations from the KCN Chat feature. Sessions are stored in users' browsers by default." />
            </div>
            <p className="text-sm text-gray-500 mb-4">Chat sessions are stored locally in users' browsers. Server-side chat logging requires additional configuration.</p>
            
            {chatSessions.length > 0 ? (
              <div className="space-y-3">
                {chatSessions.map((session, i) => (
                  <div key={i} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-xs text-gray-500">Session {session.id?.slice(0, 8)}...</span>
                      <span className="text-xs text-gray-400">{session.messages?.length || 0} messages</span>
                    </div>
                    <div className="text-sm text-gray-600">
                      {session.messages?.[0]?.content?.slice(0, 100)}...
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-400">
                <p>No chat sessions recorded.</p>
                <p className="text-xs mt-2">Chat sessions will appear here when users interact with KCN Chat.</p>
                <p className="text-xs mt-1">💡 Tip: Add OPENAI_API_KEY to enable AI-powered responses</p>
              </div>
            )}
          </div>
        )}
      </Container>
    </div>
  );
}
