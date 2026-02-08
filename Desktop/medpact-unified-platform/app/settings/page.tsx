'use client';
export const dynamic = 'force-dynamic';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { 
  Settings as SettingsIcon, 
  User, 
  Building2, 
  Bell, 
  Shield, 
  Save,
  Loader2,
  CheckCircle2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface UserProfile {
  name: string;
  email: string;
  role: string;
}

interface OrganizationSettings {
  organizationName: string;
  industryVertical: string;
  missionStatement: string;
  purposeOfUse: string;
  primaryGoal: string;
}

interface NotificationSettings {
  emailNotifications: boolean;
  smsNotifications: boolean;
  alertsEnabled: boolean;
  weeklyReports: boolean;
}

export default function SettingsPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('profile');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const [userProfile, setUserProfile] = useState<UserProfile>({
    name: '',
    email: '',
    role: ''
  });

  const [orgSettings, setOrgSettings] = useState<OrganizationSettings>({
    organizationName: '',
    industryVertical: 'MEDICAL',
    missionStatement: '',
    purposeOfUse: 'STRATEGIC_PLANNING',
    primaryGoal: ''
  });

  const [notifications, setNotifications] = useState<NotificationSettings>({
    emailNotifications: true,
    smsNotifications: false,
    alertsEnabled: true,
    weeklyReports: true
  });

  useEffect(() => {
    if (session?.user) {
      setUserProfile({
        name: session.user.name || '',
        email: session.user.email || '',
        role: (session.user as any).role || 'USER'
      });
      loadOrganizationSettings();
    }
  }, [session]);

  const loadOrganizationSettings = async () => {
    try {
      const response = await fetch('/api/organization/profile');
      if (response.ok) {
        const data = await response.json();
        setOrgSettings({
          organizationName: data.organization?.name || '',
          industryVertical: data.organization?.industryVertical || 'MEDICAL',
          missionStatement: data.missionStatement || '',
          purposeOfUse: data.purposeOfUse || 'STRATEGIC_PLANNING',
          primaryGoal: data.primaryGoal || ''
        });
      }
    } catch (error) {
      console.error('Error loading organization settings:', error);
    }
  };

  const handleSaveOrganization = async () => {
    setSaving(true);
    try {
      const response = await fetch('/api/organization/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          missionStatement: orgSettings.missionStatement,
          purposeOfUse: orgSettings.purposeOfUse,
          primaryGoal: orgSettings.primaryGoal
        })
      });

      if (response.ok) {
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      }
    } catch (error) {
      console.error('Error saving organization settings:', error);
    } finally {
      setSaving(false);
    }
  };

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'organization', label: 'Organization', icon: Building2 },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'employees', label: 'Employee Management', icon: User },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <SettingsIcon className="w-10 h-10 text-blue-600" />
            <h1 className="text-4xl font-bold text-gray-900">Settings</h1>
          </div>
          <p className="text-lg text-gray-600">
            Manage your account, organization, and preferences
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <Card className="p-4">
              <nav className="space-y-2">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                        activeTab === tab.id
                          ? 'bg-blue-100 text-blue-700 font-semibold'
                          : 'text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      {tab.label}
                    </button>
                  );
                })}
              </nav>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">

            <Card className="p-8">
              {/* Employee Management Tab */}
              {activeTab === 'employees' && (
                <div className="flex gap-8">
                  {/* AI Assistant Sidebar */}
                  <aside className="w-72 min-h-full bg-white border-r p-6 flex flex-col mr-8">
                    <h2 className="text-lg font-bold mb-4 text-blue-700">AI Employee Assistant</h2>
                    <button className="mb-4 px-3 py-1 bg-blue-600 text-white rounded">Get Smart Suggestions</button>
                    <ul className="mb-4">
                      <li className="mb-2 text-gray-700">Bulk onboard new employees</li>
                      <li className="mb-2 text-gray-700">Smart scheduling for shifts</li>
                      <li className="mb-2 text-gray-700">Track compliance and credentials</li>
                      <li className="mb-2 text-gray-700">Automate reminders for renewals</li>
                    </ul>
                    <div className="text-xs text-gray-500">AI can help you manage staff, optimize schedules, and ensure compliance.</div>
                  </aside>
                  {/* Main Employee Management Content */}
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Employee Management</h2>
                    <p className="text-gray-600 mb-6">Onboard, schedule, and track employees with smart automation.</p>
                    {/* Bulk Upload Placeholder */}
                    <div className="bg-blue-50 rounded-xl shadow p-6 mb-4">
                      <div className="font-semibold mb-2">Bulk Onboarding (integrated with Bulk Actions)</div>
                      <div className="h-24 bg-white rounded flex items-center justify-center text-gray-400">Upload employee roster, auto-detect format, and map fields</div>
                    </div>
                    {/* Smart Scheduling Placeholder */}
                    <div className="bg-blue-50 rounded-xl shadow p-6 mb-4">
                      <div className="font-semibold mb-2">Smart Scheduling</div>
                      <div className="h-24 bg-white rounded flex items-center justify-center text-gray-400">AI-driven shift and task scheduling UI</div>
                    </div>
                    {/* Compliance Tracking Placeholder */}
                    <div className="bg-blue-50 rounded-xl shadow p-6 mb-4">
                      <div className="font-semibold mb-2">Compliance & Credential Tracking</div>
                      <div className="h-24 bg-white rounded flex items-center justify-center text-gray-400">Track licenses, certifications, and send renewal reminders</div>
                    </div>
                  </div>
                </div>
              )}
              {/* Profile Tab */}
              {activeTab === 'profile' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={userProfile.name}
                      onChange={(e) => setUserProfile({ ...userProfile, name: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={userProfile.email}
                      disabled
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-600"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Email cannot be changed
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Role
                    </label>
                    <Badge variant="outline" className="text-sm">
                      {userProfile.role}
                    </Badge>
                  </div>
                  <div className="pt-4">
                    <Button className="bg-blue-600 hover:bg-blue-700">
                      <Save className="w-4 h-4 mr-2" />
                      Save Profile
                    </Button>
                  </div>
                </div>
              )}

              {/* Organization Tab */}
              {activeTab === 'organization' && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Organization Settings</h2>
                    <p className="text-gray-600 mb-6">
                      Configure your organization's mission, purpose, and goals
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Organization Name
                      </label>
                      <input
                        type="text"
                        value={orgSettings.organizationName}
                        disabled
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-600"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Industry Vertical
                      </label>
                      <Badge variant="outline" className="text-sm">
                        {orgSettings.industryVertical}
                      </Badge>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Mission Statement
                      </label>
                      <textarea
                        value={orgSettings.missionStatement}
                        onChange={(e) => setOrgSettings({ ...orgSettings, missionStatement: e.target.value })}
                        rows={4}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter your organization's mission statement..."
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        This will be saved to the database and displayed across your dashboard
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Purpose of Use
                      </label>
                      <select
                        value={orgSettings.purposeOfUse}
                        onChange={(e) => setOrgSettings({ ...orgSettings, purposeOfUse: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="NEEDS_ASSESSMENT">Needs Assessment</option>
                        <option value="PERFORMANCE_REVIEW">Performance Review</option>
                        <option value="MARKET_RESEARCH">Market Research</option>
                        <option value="COMPLIANCE_AUDIT">Compliance Audit</option>
                        <option value="STRATEGIC_PLANNING">Strategic Planning</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Primary Goal
                      </label>
                      <textarea
                        value={orgSettings.primaryGoal}
                        onChange={(e) => setOrgSettings({ ...orgSettings, primaryGoal: e.target.value })}
                        rows={3}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="What is your primary organizational goal?"
                      />
                    </div>
                  </div>

                  <div className="pt-4 flex items-center gap-3">
                    <Button
                      onClick={handleSaveOrganization}
                      disabled={saving}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      {saving ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save className="w-4 h-4 mr-2" />
                          Save Organization Settings
                        </>
                      )}
                    </Button>
                    {saved && (
                      <div className="flex items-center gap-2 text-green-600">
                        <CheckCircle2 className="w-5 h-5" />
                        <span className="font-semibold">Saved successfully!</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Notifications Tab */}
              {activeTab === 'notifications' && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Notification Preferences</h2>
                    <p className="text-gray-600 mb-6">
                      Choose how you want to receive updates and alerts
                    </p>
                  </div>

                  <div className="space-y-4">
                    {[
                      { key: 'emailNotifications', label: 'Email Notifications', description: 'Receive updates via email' },
                      { key: 'smsNotifications', label: 'SMS Notifications', description: 'Receive text message alerts' },
                      { key: 'alertsEnabled', label: 'System Alerts', description: 'Show in-app notifications' },
                      { key: 'weeklyReports', label: 'Weekly Reports', description: 'Get weekly summary reports' }
                    ].map((item) => (
                      <div key={item.key} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div>
                          <p className="font-semibold text-gray-900">{item.label}</p>
                          <p className="text-sm text-gray-600">{item.description}</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={notifications[item.key as keyof NotificationSettings]}
                            onChange={(e) => setNotifications({ ...notifications, [item.key]: e.target.checked })}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                      </div>
                    ))}
                  </div>

                  <div className="pt-4">
                    <Button className="bg-blue-600 hover:bg-blue-700">
                      <Save className="w-4 h-4 mr-2" />
                      Save Preferences
                    </Button>
                  </div>
                </div>
              )}

              {/* Security Tab */}
              {activeTab === 'security' && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Security Settings</h2>
                    <p className="text-gray-600 mb-6">
                      Manage your password and security preferences
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                      <h3 className="font-semibold text-blue-900 mb-2">Change Password</h3>
                      <p className="text-sm text-blue-700 mb-4">
                        Update your password to keep your account secure
                      </p>
                      <Button variant="outline" className="border-blue-600 text-blue-600 hover:bg-blue-50">
                        Change Password
                      </Button>
                    </div>

                    <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                      <h3 className="font-semibold text-green-900 mb-2">Two-Factor Authentication</h3>
                      <p className="text-sm text-green-700 mb-4">
                        Add an extra layer of security to your account
                      </p>
                      <Button variant="outline" className="border-green-600 text-green-600 hover:bg-green-50">
                        Enable 2FA
                      </Button>
                    </div>

                    <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                      <h3 className="font-semibold text-purple-900 mb-2">Biometric Authentication</h3>
                      <p className="text-sm text-purple-700 mb-4">
                        Use fingerprint or face recognition to sign in
                      </p>
                      <Badge className="bg-purple-600">
                        {session?.user && (session.user as any).biometricEnabled ? 'Enabled' : 'Available'}
                      </Badge>
                    </div>

                    <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                      <h3 className="font-semibold text-gray-900 mb-2">Active Sessions</h3>
                      <p className="text-sm text-gray-700 mb-4">
                        Manage devices where you're currently signed in
                      </p>
                      <Button variant="outline">
                        View Sessions
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
