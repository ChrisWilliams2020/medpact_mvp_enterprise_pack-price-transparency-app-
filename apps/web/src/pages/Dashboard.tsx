import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import DashboardMetrics from '../components/dashboard/DashboardMetrics';
import DashboardPriceTransparency from '../components/dashboard/DashboardPriceTransparency';
import DashboardTools from '../components/dashboard/DashboardTools';
import DashboardMedTech from '../components/dashboard/DashboardMedTech';

export default function Dashboard() {
  const navigate = useNavigate();
  const [practiceName, setPracticeName] = useState('');
  const [activeSection, setActiveSection] = useState('overview');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  useEffect(() => {
    const name = localStorage.getItem('practice_name');
    if (name) setPracticeName(name);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('practice_id');
    localStorage.removeItem('practice_name');
    navigate('/');
  };

  const quickMetrics = {
    todayCollections: 12847,
    pendingClaims: 47,
    monthRevenue: 187432,
    monthTarget: 204000,
    denialRate: 6.2,
    avgDaysAR: 28,
    patientsSeen: 24,
  };

  const navigationItems = [
    { id: 'overview', label: 'Overview', icon: '📊', section: 'main' },
    { id: 'private-practice', label: 'Private Practice (9)', icon: '🏥', section: 'metrics' },
    { id: 'pe-practice', label: 'PE Practice (10+25)', icon: '📈', section: 'metrics' },
    { id: 'private-asc', label: 'Private ASC', icon: '🔬', section: 'metrics' },
    { id: 'pe-asc', label: 'PE ASC', icon: '🏢', section: 'metrics' },
    { id: 'retina', label: 'Retina (12)', icon: '👁️', section: 'metrics' },
    { id: 'price-transparency', label: 'Price Transparency', icon: '💲', section: 'analytics' },
    { id: 'competitors', label: 'Competitors', icon: '🎯', section: 'analytics' },
    { id: 'heat-map', label: 'Heat Map', icon: '🗺️', section: 'analytics' },
    { id: 'forecasting', label: 'Forecasting', icon: '📉', section: 'analytics' },
    { id: 'profile', label: 'Profile', icon: '👤', section: 'tools' },
    { id: 'data-upload', label: 'Data Upload', icon: '📤', section: 'tools' },
    { id: 'staff', label: 'Staff', icon: '👥', section: 'tools' },
    { id: 'consultant', label: 'Consultant', icon: '💼', section: 'tools' },
    { id: 'kcn-chat', label: 'KCN Chat', icon: '💬', section: 'tools' },
    { id: 'quality', label: 'Quality', icon: '✅', section: 'tools' },
    { id: 'survey', label: 'Survey', icon: '📝', section: 'tools' },
    { id: 'marketing', label: 'Marketing', icon: '📣', section: 'tools' },
    { id: 'medtech-overview', label: 'MedTech Overview', icon: '💊', section: 'medtech' },
    { id: 'medtech-profile', label: 'Company Profile', icon: '🏭', section: 'medtech' },
    { id: 'medtech-territory', label: 'Territory Map', icon: '🗺️', section: 'medtech' },
    { id: 'medtech-sales-team', label: 'Sales Team', icon: '👔', section: 'medtech' },
    { id: 'medtech-physicians', label: 'Physician Targets', icon: '🩺', section: 'medtech' },
    { id: 'medtech-pricing', label: 'Pricing Data', icon: '💲', section: 'medtech' },
    { id: 'medtech-competitors', label: 'Competitor Intel', icon: '🎯', section: 'medtech' },
    { id: 'medtech-forecasting', label: 'Sales Forecasting', icon: '📈', section: 'medtech' },
    { id: 'medtech-chat', label: 'Sales AI Assistant', icon: '🤖', section: 'medtech' },
    { id: 'medtech-quality', label: 'Rep Performance', icon: '⭐', section: 'medtech' },
    { id: 'medtech-survey', label: 'HCP Surveys', icon: '📋', section: 'medtech' },
    { id: 'medtech-marketing', label: 'Product Marketing', icon: '📣', section: 'medtech' },
  ];

  const groupedNav = {
    main: navigationItems.filter(i => i.section === 'main'),
    metrics: navigationItems.filter(i => i.section === 'metrics'),
    analytics: navigationItems.filter(i => i.section === 'analytics'),
    tools: navigationItems.filter(i => i.section === 'tools'),
    medtech: navigationItems.filter(i => i.section === 'medtech'),
  };

  const renderContent = () => {
    if (['private-practice', 'pe-practice', 'private-asc', 'pe-asc', 'retina'].includes(activeSection)) {
      return <DashboardMetrics view={activeSection} />;
    }
    if (['price-transparency', 'competitors', 'heat-map', 'forecasting'].includes(activeSection)) {
      return <DashboardPriceTransparency view={activeSection} />;
    }
    if (['profile', 'data-upload', 'staff', 'consultant', 'kcn-chat', 'quality', 'survey', 'marketing'].includes(activeSection)) {
      return <DashboardTools view={activeSection} />;
    }
    if (activeSection.startsWith('medtech-')) {
      return <DashboardMedTech view={activeSection} />;
    }
    return renderOverview();
  };

  const renderOverview = () => (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-xl p-4">
        <div className="flex items-center gap-4">
          <span className="text-3xl">🧠</span>
          <div className="flex-1">
            <div className="font-medium text-amber-900">AI Insights Available</div>
            <div className="text-sm text-amber-700">3 actionable recommendations for your practice</div>
          </div>
          <button onClick={() => setActiveSection('kcn-chat')} className="px-4 py-2 bg-amber-500 text-white rounded-lg text-sm font-medium hover:bg-amber-600">View All</button>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <button onClick={() => setActiveSection('private-practice')} className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-5 text-white hover:from-blue-600 hover:to-blue-700 transition-all text-left">
          <div className="text-2xl mb-2">🏥</div>
          <div className="text-lg font-bold">Private Practice</div>
          <div className="text-blue-100 text-sm">9 Key Metrics</div>
        </button>
        <button onClick={() => setActiveSection('pe-practice')} className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-5 text-white hover:from-purple-600 hover:to-purple-700 transition-all text-left">
          <div className="text-2xl mb-2">📈</div>
          <div className="text-lg font-bold">PE Practice</div>
          <div className="text-purple-100 text-sm">10 Metrics + 25 KPIs</div>
        </button>
        <button onClick={() => setActiveSection('price-transparency')} className="bg-gradient-to-br from-teal-500 to-teal-600 rounded-xl p-5 text-white hover:from-teal-600 hover:to-teal-700 transition-all text-left">
          <div className="text-2xl mb-2">💲</div>
          <div className="text-lg font-bold">Price Transparency</div>
          <div className="text-teal-100 text-sm">MRF / Turquoise Data</div>
        </button>
        <button onClick={() => setActiveSection('medtech-overview')} className="bg-gradient-to-br from-rose-500 to-rose-600 rounded-xl p-5 text-white hover:from-rose-600 hover:to-rose-700 transition-all text-left">
          <div className="text-2xl mb-2">💊</div>
          <div className="text-lg font-bold">Medical Tech</div>
          <div className="text-rose-100 text-sm">Pharma & Device Sales</div>
        </button>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="p-4 border-b border-gray-100 flex items-center justify-between">
            <h2 className="font-semibold text-gray-900">Recent Claims</h2>
            <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">View All</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left py-2 px-4 text-xs font-medium text-gray-500">ID</th>
                  <th className="text-left py-2 px-4 text-xs font-medium text-gray-500">Patient</th>
                  <th className="text-left py-2 px-4 text-xs font-medium text-gray-500">CPT</th>
                  <th className="text-left py-2 px-4 text-xs font-medium text-gray-500">Payer</th>
                  <th className="text-right py-2 px-4 text-xs font-medium text-gray-500">Amount</th>
                  <th className="text-left py-2 px-4 text-xs font-medium text-gray-500">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {[
                  { id: 'CLM-2847', patient: 'Johnson, M.', cpt: '92014', amount: 145, status: 'Paid', payer: 'Medicare' },
                  { id: 'CLM-2846', patient: 'Smith, A.', cpt: '92134', amount: 75, status: 'Pending', payer: 'VSP' },
                  { id: 'CLM-2845', patient: 'Williams, R.', cpt: '92004', amount: 195, status: 'Paid', payer: 'EyeMed' },
                  { id: 'CLM-2844', patient: 'Brown, L.', cpt: '92083', amount: 85, status: 'Denied', payer: 'Aetna' },
                  { id: 'CLM-2843', patient: 'Davis, K.', cpt: '92014', amount: 145, status: 'Paid', payer: 'BCBS' },
                ].map((claim) => (
                  <tr key={claim.id} className="hover:bg-gray-50">
                    <td className="py-2 px-4 text-sm font-mono text-blue-600">{claim.id}</td>
                    <td className="py-2 px-4 text-sm">{claim.patient}</td>
                    <td className="py-2 px-4 text-sm font-mono">{claim.cpt}</td>
                    <td className="py-2 px-4 text-sm">{claim.payer}</td>
                    <td className="py-2 px-4 text-sm text-right">${claim.amount}</td>
                    <td className="py-2 px-4">
                      <span className={`text-xs px-2 py-1 rounded-full ${claim.status === 'Paid' ? 'bg-green-50 text-green-700' : claim.status === 'Pending' ? 'bg-yellow-50 text-yellow-700' : 'bg-red-50 text-red-700'}`}>{claim.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="p-4 border-b border-gray-100">
            <h2 className="font-semibold text-gray-900">🧠 AI Insights</h2>
          </div>
          <div className="p-4 space-y-3">
            {[
              { icon: '💰', title: 'Underpayment Detected', message: 'VSP paid $12 below contracted rate on 92134.', priority: 'high' },
              { icon: '📋', title: 'Coding Opportunity', message: 'Consider 92083 add-on for glaucoma suspects.', priority: 'medium' },
              { icon: '⏱️', title: 'Schedule Gap', message: 'Thursday 2-4pm consistently underbooked.', priority: 'low' },
            ].map((insight, i) => (
              <div key={i} className={`p-3 rounded-lg border ${insight.priority === 'high' ? 'bg-red-50 border-red-200' : insight.priority === 'medium' ? 'bg-amber-50 border-amber-200' : 'bg-blue-50 border-blue-200'}`}>
                <div className="flex items-start gap-2">
                  <span>{insight.icon}</span>
                  <div>
                    <div className="font-medium text-sm">{insight.title}</div>
                    <div className="text-xs text-gray-600 mt-1">{insight.message}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <aside className={`${sidebarCollapsed ? 'w-16' : 'w-64'} bg-white border-r border-gray-200 flex flex-col transition-all duration-300 fixed h-full z-40`}>
        <div className="p-4 border-b border-gray-100 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold">M</span>
            </div>
            {!sidebarCollapsed && <span className="font-bold text-gray-900">MedPact</span>}
          </Link>
          <button onClick={() => setSidebarCollapsed(!sidebarCollapsed)} className="p-1 hover:bg-gray-100 rounded">
            <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={sidebarCollapsed ? "M13 5l7 7-7 7M5 5l7 7-7 7" : "M11 19l-7-7 7-7m8 14l-7-7 7-7"} />
            </svg>
          </button>
        </div>
        <nav className="flex-1 overflow-y-auto p-2">
          {Object.entries(groupedNav).map(([section, items]) => (
            <div key={section} className="mb-4">
              {!sidebarCollapsed && (
                <div className={`px-3 py-2 text-xs font-semibold uppercase ${section === 'medtech' ? 'text-rose-400' : 'text-gray-400'}`}>
                  {section === 'medtech' ? 'Medical Tech' : section.charAt(0).toUpperCase() + section.slice(1)}
                </div>
              )}
              {items.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveSection(item.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                    activeSection === item.id
                      ? section === 'medtech' ? 'bg-rose-50 text-rose-700 font-medium' : 'bg-blue-50 text-blue-700 font-medium'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <span>{item.icon}</span>
                  {!sidebarCollapsed && <span>{item.label}</span>}
                </button>
              ))}
            </div>
          ))}
        </nav>
        <div className="p-4 border-t border-gray-100">
          <button onClick={handleLogout} className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-gray-600 hover:bg-gray-50 ${sidebarCollapsed ? 'justify-center' : ''}`}>
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            {!sidebarCollapsed && <span>Sign Out</span>}
          </button>
        </div>
      </aside>
      <div className={`flex-1 ${sidebarCollapsed ? 'ml-16' : 'ml-64'} transition-all duration-300`}>
        <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
          <div className="px-6 py-4 flex items-center justify-between">
            <div>
              <h1 className="text-xl font-semibold text-gray-900">{navigationItems.find(i => i.id === activeSection)?.label || 'Dashboard'}</h1>
              <p className="text-sm text-gray-500">{practiceName || 'Practice Intelligence'}</p>
            </div>
            <div className="flex items-center gap-4">
              <button className="p-2 text-gray-400 hover:text-gray-600 relative">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
              <Link to="/settings" className="p-2 text-gray-400 hover:text-gray-600">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </Link>
            </div>
          </div>
          <div className="px-6 py-3 bg-gray-50 border-t border-gray-100 flex items-center gap-6 overflow-x-auto">
            <div className="flex items-center gap-2"><span className="text-xs text-gray-500">Today:</span><span className="text-sm font-semibold text-green-600">${quickMetrics.todayCollections.toLocaleString()}</span></div>
            <div className="flex items-center gap-2"><span className="text-xs text-gray-500">Pending:</span><span className="text-sm font-semibold text-blue-600">{quickMetrics.pendingClaims}</span></div>
            <div className="flex items-center gap-2"><span className="text-xs text-gray-500">MTD:</span><span className="text-sm font-semibold text-purple-600">${quickMetrics.monthRevenue.toLocaleString()}</span></div>
            <div className="flex items-center gap-2"><span className="text-xs text-gray-500">Denial:</span><span className="text-sm font-semibold text-amber-600">{quickMetrics.denialRate}%</span></div>
            <div className="flex items-center gap-2"><span className="text-xs text-gray-500">A/R Days:</span><span className="text-sm font-semibold text-gray-600">{quickMetrics.avgDaysAR}</span></div>
            <div className="flex items-center gap-2"><span className="text-xs text-gray-500">Patients:</span><span className="text-sm font-semibold text-indigo-600">{quickMetrics.patientsSeen}</span></div>
          </div>
        </header>
        <main className="p-6">{renderContent()}</main>
      </div>
    </div>
  );
}