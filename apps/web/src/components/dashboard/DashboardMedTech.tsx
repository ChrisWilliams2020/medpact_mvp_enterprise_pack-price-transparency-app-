import { useState } from 'react';

interface DashboardMedTechProps {
  view: string;
}

export default function DashboardMedTech({ view }: DashboardMedTechProps) {
  const [chatMessages, setChatMessages] = useState<Array<{role: string; content: string}>>([
    { role: 'assistant', content: 'Hello! I\'m your MedTech Sales AI Assistant. I can help you with territory analysis, physician targeting, competitive intelligence, and sales optimization. What would you like to know?' }
  ]);
  const [chatInput, setChatInput] = useState('');

  // MedTech Overview / Sales Dashboard
  if (view === 'medtech-overview' || view === 'overview') {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[
            { label: 'Q1 Revenue', value: '$4.2M', change: '+12%', icon: '💰', color: 'green' },
            { label: 'Units Sold', value: '1,847', change: '+8%', icon: '📦', color: 'blue' },
            { label: 'Active Accounts', value: '342', change: '+15', icon: '🏥', color: 'purple' },
            { label: 'Pipeline Value', value: '$8.5M', change: '+22%', icon: '📈', color: 'amber' },
          ].map((stat) => (
            <div key={stat.label} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center justify-between">
                <span className="text-2xl">{stat.icon}</span>
                <span className={`text-xs px-2 py-1 rounded-full bg-${stat.color}-50 text-${stat.color}-600`}>{stat.change}</span>
              </div>
              <div className="mt-4">
                <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                <div className="text-sm text-gray-500">{stat.label}</div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-indigo-50">
              <h3 className="font-semibold text-gray-900">📊 Sales by Product Line</h3>
            </div>
            <div className="p-6 space-y-4">
              {[
                { product: 'Premium IOLs', revenue: '$1.8M', units: 425, pct: 43 },
                { product: 'Phaco Systems', revenue: '$1.2M', units: 28, pct: 29 },
                { product: 'Diagnostic Equipment', revenue: '$680K', units: 156, pct: 16 },
                { product: 'Surgical Consumables', revenue: '$520K', units: 1238, pct: 12 },
              ].map((item) => (
                <div key={item.product}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="font-medium">{item.product}</span>
                    <span className="text-gray-500">{item.revenue} ({item.units} units)</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full">
                    <div className="h-full bg-blue-500 rounded-full" style={{ width: `${item.pct}%` }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-green-50 to-emerald-50">
              <h3 className="font-semibold text-gray-900">🎯 Top Performing Reps</h3>
            </div>
            <div className="p-6 space-y-3">
              {[
                { name: 'Sarah Mitchell', territory: 'Northeast', quota: 115, revenue: '$892K' },
                { name: 'James Chen', territory: 'West Coast', quota: 108, revenue: '$756K' },
                { name: 'Maria Rodriguez', territory: 'Southeast', quota: 102, revenue: '$698K' },
                { name: 'David Kim', territory: 'Midwest', quota: 95, revenue: '$624K' },
              ].map((rep, i) => (
                <div key={rep.name} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold ${i === 0 ? 'bg-yellow-500' : i === 1 ? 'bg-gray-400' : i === 2 ? 'bg-amber-600' : 'bg-gray-300'}`}>
                      {i + 1}
                    </div>
                    <div>
                      <div className="font-medium text-sm">{rep.name}</div>
                      <div className="text-xs text-gray-500">{rep.territory}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium text-sm">{rep.revenue}</div>
                    <div className={`text-xs ${rep.quota >= 100 ? 'text-green-600' : 'text-amber-600'}`}>{rep.quota}% of quota</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Company Profile
  if (view === 'company-profile') {
    return (
      <div className="space-y-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-indigo-50 to-purple-50">
            <h3 className="font-semibold text-gray-900">🏢 Company Profile</h3>
            <p className="text-xs text-gray-500 mt-1">Manufacturer information and settings</p>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h4 className="font-medium text-gray-900">Company Information</h4>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Company Name</label>
                    <input type="text" defaultValue="VisionTech Medical" className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Industry Segment</label>
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-lg">
                      <option>Ophthalmology - IOLs & Implants</option>
                      <option>Ophthalmology - Diagnostics</option>
                      <option>Ophthalmology - Surgical Equipment</option>
                      <option>Ophthalmology - Pharmaceuticals</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Headquarters</label>
                    <input type="text" defaultValue="San Francisco, CA" className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <h4 className="font-medium text-gray-900">Sales Organization</h4>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Sales Regions</label>
                    <input type="text" defaultValue="4 (Northeast, Southeast, Midwest, West)" className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Total Sales Reps</label>
                    <input type="text" defaultValue="24" className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Target Accounts</label>
                    <input type="text" defaultValue="850 Ophthalmology Practices" className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-6 pt-6 border-t border-gray-100">
              <h4 className="font-medium text-gray-900 mb-3">Product Portfolio</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {['Premium IOLs', 'Toric IOLs', 'EDOF Lenses', 'Phaco Systems', 'OCT Devices', 'Surgical Packs', 'Viscoelastics', 'Instruments'].map((product) => (
                  <div key={product} className="p-3 bg-gray-50 rounded-lg text-center text-sm">{product}</div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Territory Map
  if (view === 'territory-map') {
    return (
      <div className="space-y-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-cyan-50 to-blue-50">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-gray-900">🗺️ Territory Map</h3>
                <p className="text-xs text-gray-500 mt-1">Sales geography and account distribution</p>
              </div>
              <select className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm">
                <option>All Territories</option>
                <option>Northeast</option>
                <option>Southeast</option>
                <option>Midwest</option>
                <option>West Coast</option>
              </select>
            </div>
          </div>
          <div className="p-6">
            <div className="aspect-video bg-gradient-to-br from-blue-100 via-blue-50 to-cyan-100 rounded-lg relative overflow-hidden mb-6">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-40 h-40 bg-blue-500/20 rounded-full absolute top-1/4 left-1/4 blur-xl"></div>
                <div className="w-32 h-32 bg-green-500/20 rounded-full absolute top-1/3 right-1/4 blur-xl"></div>
                <div className="w-36 h-36 bg-purple-500/20 rounded-full absolute bottom-1/4 left-1/3 blur-xl"></div>
                <div className="w-28 h-28 bg-amber-500/20 rounded-full absolute bottom-1/3 right-1/3 blur-xl"></div>
                <div className="relative z-10 text-center">
                  <div className="text-6xl mb-4">🇺🇸</div>
                  <p className="text-gray-600 font-medium">United States Coverage</p>
                  <p className="text-sm text-gray-500">342 Active Accounts</p>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {[
                { region: 'Northeast', accounts: 98, revenue: '$1.2M', rep: 'Sarah Mitchell', color: 'blue' },
                { region: 'Southeast', accounts: 87, revenue: '$980K', rep: 'Maria Rodriguez', color: 'green' },
                { region: 'Midwest', accounts: 72, revenue: '$820K', rep: 'David Kim', color: 'purple' },
                { region: 'West Coast', accounts: 85, revenue: '$1.1M', rep: 'James Chen', color: 'amber' },
              ].map((territory) => (
                <div key={territory.region} className={`p-4 bg-${territory.color}-50 rounded-lg border border-${territory.color}-200`}>
                  <div className="font-medium text-gray-900">{territory.region}</div>
                  <div className="text-2xl font-bold text-gray-900 mt-1">{territory.accounts}</div>
                  <div className="text-xs text-gray-500">accounts</div>
                  <div className="mt-2 pt-2 border-t border-gray-200">
                    <div className="text-sm font-medium">{territory.revenue}</div>
                    <div className="text-xs text-gray-500">{territory.rep}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Sales Team
  if (view === 'sales-team') {
    return (
      <div className="space-y-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-violet-50 to-purple-50">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-gray-900">👥 Sales Team Management</h3>
                <p className="text-xs text-gray-500 mt-1">Manage reps, territories, and quotas</p>
              </div>
              <button className="px-4 py-2 bg-violet-600 text-white rounded-lg text-sm hover:bg-violet-700">+ Add Rep</button>
            </div>
          </div>
          <div className="p-6">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-left py-3 px-4 text-xs font-medium text-gray-500">Rep</th>
                    <th className="text-left py-3 px-4 text-xs font-medium text-gray-500">Territory</th>
                    <th className="text-right py-3 px-4 text-xs font-medium text-gray-500">Quota</th>
                    <th className="text-right py-3 px-4 text-xs font-medium text-gray-500">YTD Sales</th>
                    <th className="text-right py-3 px-4 text-xs font-medium text-gray-500">% to Quota</th>
                    <th className="text-left py-3 px-4 text-xs font-medium text-gray-500">Status</th>
                    <th className="text-left py-3 px-4 text-xs font-medium text-gray-500">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {[
                    { name: 'Sarah Mitchell', territory: 'Northeast', quota: 775000, ytd: 892000, accounts: 98 },
                    { name: 'James Chen', territory: 'West Coast', quota: 700000, ytd: 756000, accounts: 85 },
                    { name: 'Maria Rodriguez', territory: 'Southeast', quota: 680000, ytd: 698000, accounts: 87 },
                    { name: 'David Kim', territory: 'Midwest', quota: 650000, ytd: 624000, accounts: 72 },
                    { name: 'Emily Watson', territory: 'Southwest', quota: 620000, ytd: 558000, accounts: 64 },
                    { name: 'Michael Brown', territory: 'Mid-Atlantic', quota: 590000, ytd: 472000, accounts: 58 },
                  ].map((rep) => {
                    const pctQuota = Math.round((rep.ytd / rep.quota) * 100);
                    return (
                      <tr key={rep.name} className="hover:bg-gray-50">
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-violet-100 rounded-full flex items-center justify-center text-violet-600 text-xs font-medium">
                              {rep.name.split(' ').map(n => n[0]).join('')}
                            </div>
                            <div className="font-medium text-sm">{rep.name}</div>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-sm">{rep.territory}</td>
                        <td className="py-3 px-4 text-sm text-right">${(rep.quota / 1000).toFixed(0)}K</td>
                        <td className="py-3 px-4 text-sm text-right font-medium">${(rep.ytd / 1000).toFixed(0)}K</td>
                        <td className="py-3 px-4 text-right">
                          <span className={`text-sm font-medium ${pctQuota >= 100 ? 'text-green-600' : pctQuota >= 80 ? 'text-amber-600' : 'text-red-600'}`}>
                            {pctQuota}%
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <span className={`text-xs px-2 py-1 rounded-full ${pctQuota >= 100 ? 'bg-green-50 text-green-700' : pctQuota >= 80 ? 'bg-amber-50 text-amber-700' : 'bg-red-50 text-red-700'}`}>
                            {pctQuota >= 100 ? 'Exceeding' : pctQuota >= 80 ? 'On Track' : 'Behind'}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <button className="text-blue-600 hover:text-blue-700 text-sm">View</button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Physician Targets / HCP Targeting
  if (view === 'physician-targets') {
    return (
      <div className="space-y-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-rose-50 to-pink-50">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-gray-900">🎯 Physician Targeting</h3>
                <p className="text-xs text-gray-500 mt-1">HCP segmentation and opportunity scoring</p>
              </div>
              <div className="flex gap-2">
                <select className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm">
                  <option>All Specialties</option>
                  <option>Cataract Surgeons</option>
                  <option>Retina Specialists</option>
                  <option>Glaucoma Specialists</option>
                </select>
                <button className="px-4 py-2 bg-rose-600 text-white rounded-lg text-sm hover:bg-rose-700">Export List</button>
              </div>
            </div>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              {[
                { label: 'Total HCPs', value: '2,847', icon: '👨‍⚕️' },
                { label: 'High Value Targets', value: '342', icon: '⭐' },
                { label: 'Active Customers', value: '187', icon: '✅' },
                { label: 'Conversion Rate', value: '24%', icon: '📈' },
              ].map((stat) => (
                <div key={stat.label} className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <span>{stat.icon}</span>{stat.label}
                  </div>
                  <div className="text-2xl font-bold mt-1">{stat.value}</div>
                </div>
              ))}
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-left py-3 px-4 text-xs font-medium text-gray-500">Physician</th>
                    <th className="text-left py-3 px-4 text-xs font-medium text-gray-500">Practice</th>
                    <th className="text-left py-3 px-4 text-xs font-medium text-gray-500">Specialty</th>
                    <th className="text-right py-3 px-4 text-xs font-medium text-gray-500">Case Volume</th>
                    <th className="text-left py-3 px-4 text-xs font-medium text-gray-500">Score</th>
                    <th className="text-left py-3 px-4 text-xs font-medium text-gray-500">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {[
                    { name: 'Dr. Robert Chen', practice: 'Pacific Eye Institute', specialty: 'Cataract/Refractive', volume: 1850, score: 95, status: 'Customer' },
                    { name: 'Dr. Lisa Martinez', practice: 'Coastal Vision Center', specialty: 'Cataract', volume: 1420, score: 92, status: 'Prospect' },
                    { name: 'Dr. James Wilson', practice: 'Eye Surgery Associates', specialty: 'Cataract/Glaucoma', volume: 1380, score: 88, status: 'Prospect' },
                    { name: 'Dr. Sarah Thompson', practice: 'Premier Eye Care', specialty: 'Cataract', volume: 1250, score: 85, status: 'Customer' },
                    { name: 'Dr. Michael Lee', practice: 'Vision Specialists', specialty: 'Retina', volume: 980, score: 78, status: 'Lead' },
                  ].map((hcp) => (
                    <tr key={hcp.name} className="hover:bg-gray-50">
                      <td className="py-3 px-4 font-medium text-sm">{hcp.name}</td>
                      <td className="py-3 px-4 text-sm text-gray-600">{hcp.practice}</td>
                      <td className="py-3 px-4 text-sm">{hcp.specialty}</td>
                      <td className="py-3 px-4 text-sm text-right">{hcp.volume.toLocaleString()}/yr</td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <div className="w-16 h-2 bg-gray-200 rounded-full">
                            <div className={`h-full rounded-full ${hcp.score >= 90 ? 'bg-green-500' : hcp.score >= 80 ? 'bg-blue-500' : 'bg-amber-500'}`} style={{ width: `${hcp.score}%` }}></div>
                          </div>
                          <span className="text-xs">{hcp.score}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`text-xs px-2 py-1 rounded-full ${hcp.status === 'Customer' ? 'bg-green-50 text-green-700' : hcp.status === 'Prospect' ? 'bg-blue-50 text-blue-700' : 'bg-gray-100 text-gray-600'}`}>
                          {hcp.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Pricing Data
  if (view === 'pricing-data') {
    return (
      <div className="space-y-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-emerald-50 to-teal-50">
            <h3 className="font-semibold text-gray-900">💲 Product Pricing</h3>
            <p className="text-xs text-gray-500 mt-1">List prices, contract pricing, and competitive analysis</p>
          </div>
          <div className="p-6">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-left py-3 px-4 text-xs font-medium text-gray-500">Product</th>
                    <th className="text-left py-3 px-4 text-xs font-medium text-gray-500">Category</th>
                    <th className="text-right py-3 px-4 text-xs font-medium text-gray-500">List Price</th>
                    <th className="text-right py-3 px-4 text-xs font-medium text-gray-500">Contract Low</th>
                    <th className="text-right py-3 px-4 text-xs font-medium text-gray-500">Contract High</th>
                    <th className="text-right py-3 px-4 text-xs font-medium text-gray-500">Competitor Avg</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {[
                    { product: 'VisionTech Trifocal IOL', category: 'Premium IOL', list: 2850, low: 2100, high: 2500, comp: 2650 },
                    { product: 'VisionTech Toric IOL', category: 'Premium IOL', list: 1950, low: 1400, high: 1700, comp: 1850 },
                    { product: 'VisionTech EDOF', category: 'Premium IOL', list: 2200, low: 1650, high: 1950, comp: 2100 },
                    { product: 'PhacoPro 5000 System', category: 'Equipment', list: 185000, low: 145000, high: 165000, comp: 175000 },
                    { product: 'OcuScan HD OCT', category: 'Diagnostics', list: 95000, low: 72000, high: 85000, comp: 88000 },
                  ].map((item) => (
                    <tr key={item.product} className="hover:bg-gray-50">
                      <td className="py-3 px-4 font-medium text-sm">{item.product}</td>
                      <td className="py-3 px-4 text-sm text-gray-500">{item.category}</td>
                      <td className="py-3 px-4 text-sm text-right">${item.list.toLocaleString()}</td>
                      <td className="py-3 px-4 text-sm text-right text-green-600">${item.low.toLocaleString()}</td>
                      <td className="py-3 px-4 text-sm text-right">${item.high.toLocaleString()}</td>
                      <td className="py-3 px-4 text-sm text-right text-gray-500">${item.comp.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Competitor Intel
  if (view === 'competitor-intel') {
    return (
      <div className="space-y-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-red-50 to-orange-50">
            <h3 className="font-semibold text-gray-900">🔍 Competitor Intelligence</h3>
            <p className="text-xs text-gray-500 mt-1">Market analysis and competitive positioning</p>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div className="text-sm text-blue-600">Your Market Share</div>
                <div className="text-3xl font-bold text-blue-700">18.5%</div>
                <div className="text-xs text-blue-600 mt-1">↑ 2.3% vs last year</div>
              </div>
              <div className="p-4 bg-amber-50 rounded-lg border border-amber-200">
                <div className="text-sm text-amber-600">Win Rate vs Competition</div>
                <div className="text-3xl font-bold text-amber-700">62%</div>
                <div className="text-xs text-amber-600 mt-1">Last 6 months</div>
              </div>
              <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                <div className="text-sm text-green-600">Competitive Deals Won</div>
                <div className="text-3xl font-bold text-green-700">47</div>
                <div className="text-xs text-green-600 mt-1">This quarter</div>
              </div>
            </div>
            <h4 className="font-medium text-gray-900 mb-3">Competitor Comparison</h4>
            <div className="space-y-3">
              {[
                { name: 'Alcon', share: 32, strength: 'Brand recognition, full portfolio', weakness: 'Premium pricing' },
                { name: 'Johnson & Johnson Vision', share: 24, strength: 'R&D pipeline, marketing', weakness: 'Limited equipment' },
                { name: 'VisionTech (You)', share: 18.5, strength: 'Innovation, service', weakness: 'Brand awareness', highlight: true },
                { name: 'Bausch + Lomb', share: 15, strength: 'Value pricing, legacy', weakness: 'Aging portfolio' },
                { name: 'ZEISS', share: 10.5, strength: 'Precision, diagnostics', weakness: 'Narrow focus' },
              ].map((comp) => (
                <div key={comp.name} className={`p-4 rounded-lg border ${comp.highlight ? 'bg-blue-50 border-blue-200' : 'bg-gray-50 border-gray-200'}`}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="font-medium">{comp.name}</div>
                    <div className="text-lg font-bold">{comp.share}%</div>
                  </div>
                  <div className="flex gap-4 text-xs">
                    <div><span className="text-green-600">✓</span> {comp.strength}</div>
                    <div><span className="text-red-600">✗</span> {comp.weakness}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Sales Forecasting
  if (view === 'sales-forecasting') {
    return (
      <div className="space-y-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-violet-50 to-purple-50">
            <h3 className="font-semibold text-gray-900">📈 Sales Forecasting</h3>
            <p className="text-xs text-gray-500 mt-1">AI-powered revenue predictions</p>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                <div className="text-sm text-green-600">Q2 Forecast</div>
                <div className="text-2xl font-bold text-green-700">$4.8M</div>
                <div className="text-xs text-green-600 mt-1">↑ 14% vs Q1</div>
              </div>
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div className="text-sm text-blue-600">Annual Forecast</div>
                <div className="text-2xl font-bold text-blue-700">$18.2M</div>
                <div className="text-xs text-blue-600 mt-1">↑ 18% vs 2025</div>
              </div>
              <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                <div className="text-sm text-purple-600">Pipeline Value</div>
                <div className="text-2xl font-bold text-purple-700">$8.5M</div>
                <div className="text-xs text-purple-600 mt-1">142 opportunities</div>
              </div>
              <div className="p-4 bg-amber-50 rounded-lg border border-amber-200">
                <div className="text-sm text-amber-600">Confidence</div>
                <div className="text-2xl font-bold text-amber-700">84%</div>
                <div className="text-xs text-amber-600 mt-1">Based on pipeline</div>
              </div>
            </div>
            <h4 className="font-medium text-gray-900 mb-3">Monthly Forecast</h4>
            <div className="grid grid-cols-6 gap-2">
              {[
                { month: 'Apr', forecast: 1580000 },
                { month: 'May', forecast: 1650000 },
                { month: 'Jun', forecast: 1720000 },
                { month: 'Jul', forecast: 1450000 },
                { month: 'Aug', forecast: 1580000 },
                { month: 'Sep', forecast: 1780000 },
              ].map((m) => (
                <div key={m.month} className="text-center">
                  <div className="text-xs text-gray-500 mb-2">{m.month}</div>
                  <div className="h-24 bg-gray-100 rounded relative">
                    <div 
                      className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-violet-500 to-violet-400 rounded-b"
                      style={{ height: `${(m.forecast / 1800000) * 100}%` }}
                    ></div>
                  </div>
                  <div className="text-xs font-medium mt-2">${(m.forecast / 1000000).toFixed(1)}M</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Sales AI Assistant
  if (view === 'sales-ai') {
    const handleSend = () => {
      if (!chatInput.trim()) return;
      setChatMessages([...chatMessages, 
        { role: 'user', content: chatInput },
        { role: 'assistant', content: `Based on your question about "${chatInput}", here's my analysis:\n\n• Dr. Chen at Pacific Eye Institute has high conversion potential (95 score)\n• Recommend scheduling a demo of the new Trifocal IOL\n• Competitor Alcon has been visiting - suggest expedited pricing approval\n\nWould you like me to prepare talking points for this account?` }
      ]);
      setChatInput('');
    };

    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden h-[calc(100vh-280px)] flex flex-col">
        <div className="px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-indigo-50 to-blue-50">
          <h3 className="font-semibold text-gray-900">🤖 Sales AI Assistant</h3>
          <p className="text-xs text-gray-500 mt-1">AI-powered sales intelligence and recommendations</p>
        </div>
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {chatMessages.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[80%] p-4 rounded-xl ${msg.role === 'user' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-900'}`}>
                <div className="whitespace-pre-wrap text-sm">{msg.content}</div>
              </div>
            </div>
          ))}
        </div>
        <div className="p-4 border-t border-gray-100">
          <div className="flex gap-3">
            <input 
              type="text" 
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Ask about accounts, competitors, pricing strategies..."
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
            <button onClick={handleSend} className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Send</button>
          </div>
          <div className="flex gap-2 mt-3">
            {['Account analysis', 'Competitor intel', 'Pricing strategy', 'Territory insights'].map((prompt) => (
              <button key={prompt} onClick={() => setChatInput(prompt)} className="text-xs px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-full text-gray-600">{prompt}</button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Rep Performance / Quality Metrics
  if (view === 'rep-performance') {
    return (
      <div className="space-y-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-green-50 to-emerald-50">
            <h3 className="font-semibold text-gray-900">📊 Rep Performance Metrics</h3>
            <p className="text-xs text-gray-500 mt-1">Activity tracking and performance analytics</p>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              {[
                { label: 'Avg Calls/Rep/Week', value: '42', benchmark: '40+', icon: '📞' },
                { label: 'Demo Conversion', value: '34%', benchmark: '30%+', icon: '🎯' },
                { label: 'Proposal Win Rate', value: '62%', benchmark: '55%+', icon: '📝' },
                { label: 'Customer Retention', value: '94%', benchmark: '90%+', icon: '🔄' },
              ].map((metric) => (
                <div key={metric.label} className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <span>{metric.icon}</span>{metric.label}
                  </div>
                  <div className="text-2xl font-bold mt-1">{metric.value}</div>
                  <div className="text-xs text-green-600">Benchmark: {metric.benchmark}</div>
                </div>
              ))}
            </div>
            <h4 className="font-medium text-gray-900 mb-3">Individual Rep Metrics</h4>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-left py-3 px-4 text-xs font-medium text-gray-500">Rep</th>
                    <th className="text-right py-3 px-4 text-xs font-medium text-gray-500">Calls/Week</th>
                    <th className="text-right py-3 px-4 text-xs font-medium text-gray-500">Demos</th>
                    <th className="text-right py-3 px-4 text-xs font-medium text-gray-500">Proposals</th>
                    <th className="text-right py-3 px-4 text-xs font-medium text-gray-500">Win Rate</th>
                    <th className="text-right py-3 px-4 text-xs font-medium text-gray-500">Avg Deal Size</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {[
                    { name: 'Sarah Mitchell', calls: 48, demos: 12, proposals: 8, winRate: 75, dealSize: 28500 },
                    { name: 'James Chen', calls: 45, demos: 10, proposals: 7, winRate: 71, dealSize: 32000 },
                    { name: 'Maria Rodriguez', calls: 42, demos: 9, proposals: 6, winRate: 67, dealSize: 26800 },
                    { name: 'David Kim', calls: 38, demos: 8, proposals: 5, winRate: 60, dealSize: 24500 },
                  ].map((rep) => (
                    <tr key={rep.name} className="hover:bg-gray-50">
                      <td className="py-3 px-4 font-medium text-sm">{rep.name}</td>
                      <td className="py-3 px-4 text-sm text-right">{rep.calls}</td>
                      <td className="py-3 px-4 text-sm text-right">{rep.demos}</td>
                      <td className="py-3 px-4 text-sm text-right">{rep.proposals}</td>
                      <td className="py-3 px-4 text-sm text-right">{rep.winRate}%</td>
                      <td className="py-3 px-4 text-sm text-right">${rep.dealSize.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // HCP Surveys
  if (view === 'hcp-surveys') {
    return (
      <div className="space-y-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-pink-50 to-rose-50">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-gray-900">📋 HCP Surveys & Feedback</h3>
                <p className="text-xs text-gray-500 mt-1">Physician satisfaction and product feedback</p>
              </div>
              <button className="px-4 py-2 bg-rose-600 text-white rounded-lg text-sm hover:bg-rose-700">+ New Survey</button>
            </div>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                <div className="text-sm text-green-600">Product Satisfaction</div>
                <div className="text-3xl font-bold text-green-700">4.6<span className="text-lg">/5</span></div>
                <div className="text-xs text-green-600 mt-1">Based on 342 responses</div>
              </div>
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div className="text-sm text-blue-600">Rep Satisfaction</div>
                <div className="text-3xl font-bold text-blue-700">4.8<span className="text-lg">/5</span></div>
                <div className="text-xs text-blue-600 mt-1">Based on 287 responses</div>
              </div>
              <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                <div className="text-sm text-purple-600">Would Recommend</div>
                <div className="text-3xl font-bold text-purple-700">89%</div>
                <div className="text-xs text-purple-600 mt-1">NPS equivalent: 72</div>
              </div>
            </div>
            <h4 className="font-medium text-gray-900 mb-3">Recent Survey Responses</h4>
            <div className="space-y-3">
              {[
                { physician: 'Dr. Robert Chen', product: 'Trifocal IOL', rating: 5, comment: 'Excellent visual outcomes, patients very satisfied' },
                { physician: 'Dr. Lisa Martinez', product: 'PhacoPro 5000', rating: 4, comment: 'Great fluidics, would like improved UI' },
                { physician: 'Dr. James Wilson', product: 'Toric IOL', rating: 5, comment: 'Consistent rotational stability' },
              ].map((response, i) => (
                <div key={i} className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <div className="font-medium text-sm">{response.physician}</div>
                    <div className="flex items-center gap-1">
                      {[1,2,3,4,5].map((star) => (
                        <span key={star} className={star <= response.rating ? 'text-yellow-400' : 'text-gray-300'}>★</span>
                      ))}
                    </div>
                  </div>
                  <div className="text-xs text-gray-500 mb-1">{response.product}</div>
                  <div className="text-sm text-gray-700">"{response.comment}"</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Product Marketing
  if (view === 'product-marketing') {
    return (
      <div className="space-y-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-amber-50 to-orange-50">
            <h3 className="font-semibold text-gray-900">📣 Product Marketing</h3>
            <p className="text-xs text-gray-500 mt-1">Campaigns, collateral, and marketing analytics</p>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              {[
                { label: 'Active Campaigns', value: '8', icon: '🎯' },
                { label: 'Email Open Rate', value: '32%', icon: '✉️' },
                { label: 'Webinar Registrations', value: '847', icon: '🎥' },
                { label: 'Sample Requests', value: '124', icon: '📦' },
              ].map((stat) => (
                <div key={stat.label} className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <span>{stat.icon}</span>{stat.label}
                  </div>
                  <div className="text-2xl font-bold mt-1">{stat.value}</div>
                </div>
              ))}
            </div>
            <h4 className="font-medium text-gray-900 mb-3">Active Campaigns</h4>
            <div className="space-y-3">
              {[
                { name: 'Trifocal IOL Launch', type: 'Product Launch', status: 'Active', reach: '2,847 HCPs', performance: 'Above target' },
                { name: 'Q2 Premium IOL Promo', type: 'Promotion', status: 'Active', reach: '1,250 HCPs', performance: 'On target' },
                { name: 'Wet Lab Series - East', type: 'Event', status: 'Upcoming', reach: '180 registered', performance: 'N/A' },
                { name: 'ASCRS 2026 Booth', type: 'Trade Show', status: 'Planning', reach: 'Est. 5,000', performance: 'N/A' },
              ].map((campaign) => (
                <div key={campaign.name} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <div className="font-medium">{campaign.name}</div>
                    <div className="text-sm text-gray-500">{campaign.type} • {campaign.reach}</div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      campaign.status === 'Active' ? 'bg-green-50 text-green-700' :
                      campaign.status === 'Upcoming' ? 'bg-blue-50 text-blue-700' :
                      'bg-gray-200 text-gray-600'
                    }`}>{campaign.status}</span>
                    <button className="text-blue-600 hover:text-blue-700 text-sm">View</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Default fallback
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <p className="text-gray-500">Select a MedTech tool from the menu. Current view: {view}</p>
    </div>
  );
}