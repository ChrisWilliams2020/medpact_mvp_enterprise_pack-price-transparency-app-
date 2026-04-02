import { useState } from 'react';

interface DashboardPriceTransparencyProps {
  view: string;
}

export default function DashboardPriceTransparency({ view }: DashboardPriceTransparencyProps) {
  const [selectedCBSA, setSelectedCBSA] = useState('37980');

  // Competitors View
  if (view === 'competitors') {
    return (
      <div className="space-y-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-red-50 to-orange-50">
            <h3 className="font-semibold text-gray-900">🎯 Competitor Analysis</h3>
            <p className="text-xs text-gray-500 mt-1">Compare your practice against local competitors</p>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div className="text-sm text-blue-600">Your Market Position</div>
                <div className="text-2xl font-bold text-blue-700">#3 of 12</div>
                <div className="text-xs text-blue-600 mt-1">In Philadelphia Metro</div>
              </div>
              <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                <div className="text-sm text-green-600">Price Competitiveness</div>
                <div className="text-2xl font-bold text-green-700">92<span className="text-lg">/100</span></div>
                <div className="text-xs text-green-600 mt-1">Above average</div>
              </div>
              <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                <div className="text-sm text-purple-600">Patient Volume Rank</div>
                <div className="text-2xl font-bold text-purple-700">#2</div>
                <div className="text-xs text-purple-600 mt-1">Est. 450 patients/mo</div>
              </div>
            </div>
            <h4 className="font-medium text-gray-900 mb-3">Nearby Competitors</h4>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-left py-2 px-4 text-xs font-medium text-gray-500">Practice</th>
                    <th className="text-left py-2 px-4 text-xs font-medium text-gray-500">Distance</th>
                    <th className="text-left py-2 px-4 text-xs font-medium text-gray-500">Specialty Focus</th>
                    <th className="text-right py-2 px-4 text-xs font-medium text-gray-500">92014 Rate</th>
                    <th className="text-right py-2 px-4 text-xs font-medium text-gray-500">Est. Volume</th>
                    <th className="text-left py-2 px-4 text-xs font-medium text-gray-500">Rating</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {[
                    { name: 'Wills Eye Hospital', distance: '2.1 mi', focus: 'Full Service', rate: '$185', volume: '2,500+', rating: '4.8' },
                    { name: 'Kremer Eye Center', distance: '3.4 mi', focus: 'LASIK/Cataract', rate: '$165', volume: '800', rating: '4.6' },
                    { name: 'Your Practice', distance: '-', focus: 'Comprehensive', rate: '$145', volume: '450', rating: '4.7', highlight: true },
                    { name: 'Eye Associates of Phila', distance: '4.2 mi', focus: 'Comprehensive', rate: '$155', volume: '350', rating: '4.4' },
                    { name: 'Philadelphia Eye Care', distance: '5.1 mi', focus: 'Optometry/MD', rate: '$125', volume: '600', rating: '4.3' },
                  ].map((comp) => (
                    <tr key={comp.name} className={comp.highlight ? 'bg-blue-50' : 'hover:bg-gray-50'}>
                      <td className="py-3 px-4 text-sm font-medium">{comp.name}</td>
                      <td className="py-3 px-4 text-sm text-gray-500">{comp.distance}</td>
                      <td className="py-3 px-4 text-sm">{comp.focus}</td>
                      <td className="py-3 px-4 text-sm text-right font-mono">{comp.rate}</td>
                      <td className="py-3 px-4 text-sm text-right">{comp.volume}</td>
                      <td className="py-3 px-4 text-sm">⭐ {comp.rating}</td>
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

  // Heat Map View
  if (view === 'heat-map') {
    return (
      <div className="space-y-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-cyan-50 to-blue-50">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-gray-900">🗺️ Geographic Heat Map</h3>
                <p className="text-xs text-gray-500 mt-1">Visualize patient distribution and market opportunities</p>
              </div>
              <select className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm">
                <option>Patient Volume</option>
                <option>Revenue Density</option>
                <option>Referral Sources</option>
                <option>Market Penetration</option>
              </select>
            </div>
          </div>
          <div className="p-6">
            <div className="aspect-video bg-gradient-to-br from-blue-100 via-blue-50 to-cyan-100 rounded-lg relative overflow-hidden mb-6">
              {/* Simulated heat map overlay */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-32 h-32 bg-red-500/30 rounded-full absolute top-1/4 left-1/3 blur-xl"></div>
                  <div className="w-24 h-24 bg-orange-500/30 rounded-full absolute top-1/2 left-1/2 blur-xl"></div>
                  <div className="w-20 h-20 bg-yellow-500/30 rounded-full absolute bottom-1/4 right-1/3 blur-xl"></div>
                  <div className="relative z-10">
                    <div className="text-6xl mb-4">📍</div>
                    <p className="text-gray-600 font-medium">Philadelphia Metro Area</p>
                    <p className="text-sm text-gray-500">CBSA 37980</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {[
                { zip: '19103', patients: 187, revenue: '$89,400', growth: '+12%' },
                { zip: '19107', patients: 156, revenue: '$74,200', growth: '+8%' },
                { zip: '19102', patients: 134, revenue: '$63,800', growth: '+15%' },
                { zip: '19106', patients: 98, revenue: '$46,500', growth: '+5%' },
              ].map((area) => (
                <div key={area.zip} className="p-3 bg-gray-50 rounded-lg">
                  <div className="font-mono text-sm font-medium text-gray-900">{area.zip}</div>
                  <div className="text-xs text-gray-500 mt-1">{area.patients} patients</div>
                  <div className="text-xs text-gray-500">{area.revenue} revenue</div>
                  <div className="text-xs text-green-600 mt-1">{area.growth} YoY</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Forecasting View
  if (view === 'forecasting') {
    return (
      <div className="space-y-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-violet-50 to-purple-50">
            <h3 className="font-semibold text-gray-900">📉 Revenue Forecasting</h3>
            <p className="text-xs text-gray-500 mt-1">AI-powered predictions based on historical data and market trends</p>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                <div className="text-sm text-green-600">Q2 2026 Forecast</div>
                <div className="text-2xl font-bold text-green-700">$612,000</div>
                <div className="text-xs text-green-600 mt-1">↑ 8% vs Q1</div>
              </div>
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div className="text-sm text-blue-600">2026 Annual Forecast</div>
                <div className="text-2xl font-bold text-blue-700">$2.45M</div>
                <div className="text-xs text-blue-600 mt-1">↑ 12% vs 2025</div>
              </div>
              <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                <div className="text-sm text-purple-600">Growth Opportunity</div>
                <div className="text-2xl font-bold text-purple-700">$180K</div>
                <div className="text-xs text-purple-600 mt-1">Achievable with optimization</div>
              </div>
              <div className="p-4 bg-amber-50 rounded-lg border border-amber-200">
                <div className="text-sm text-amber-600">Confidence Level</div>
                <div className="text-2xl font-bold text-amber-700">87%</div>
                <div className="text-xs text-amber-600 mt-1">Based on 24mo data</div>
              </div>
            </div>
            <div className="mb-6">
              <h4 className="font-medium text-gray-900 mb-3">Monthly Forecast</h4>
              <div className="grid grid-cols-6 gap-2">
                {[
                  { month: 'Apr', actual: null, forecast: 195000 },
                  { month: 'May', actual: null, forecast: 205000 },
                  { month: 'Jun', actual: null, forecast: 212000 },
                  { month: 'Jul', actual: null, forecast: 198000 },
                  { month: 'Aug', actual: null, forecast: 208000 },
                  { month: 'Sep', actual: null, forecast: 215000 },
                ].map((m) => (
                  <div key={m.month} className="text-center">
                    <div className="text-xs text-gray-500 mb-2">{m.month}</div>
                    <div className="h-24 bg-gray-100 rounded relative">
                      <div 
                        className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-purple-500 to-purple-400 rounded-b"
                        style={{ height: `${(m.forecast / 220000) * 100}%` }}
                      ></div>
                    </div>
                    <div className="text-xs font-medium mt-2">${(m.forecast / 1000).toFixed(0)}K</div>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-3">Revenue Drivers</h4>
              <div className="space-y-3">
                {[
                  { driver: 'Cataract Surgery Volume', impact: '+$45K', confidence: '92%', trend: 'up' },
                  { driver: 'Premium IOL Upgrades', impact: '+$28K', confidence: '85%', trend: 'up' },
                  { driver: 'New Patient Acquisition', impact: '+$22K', confidence: '78%', trend: 'up' },
                  { driver: 'Retina Injection Volume', impact: '+$18K', confidence: '90%', trend: 'stable' },
                ].map((item) => (
                  <div key={item.driver} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <span className={`text-lg ${item.trend === 'up' ? 'text-green-500' : 'text-gray-400'}`}>
                        {item.trend === 'up' ? '📈' : '➡️'}
                      </span>
                      <span className="text-sm">{item.driver}</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-sm font-medium text-green-600">{item.impact}</span>
                      <span className="text-xs text-gray-500">{item.confidence} conf.</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Price Transparency (default)
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-teal-50 to-cyan-50">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-gray-900">💲 Price Transparency Analytics</h3>
              <p className="text-xs text-gray-500 mt-1">Source: CMS MRF / Turquoise Health</p>
            </div>
            <select 
              value={selectedCBSA} 
              onChange={(e) => setSelectedCBSA(e.target.value)}
              className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm"
            >
              <option value="37980">Philadelphia (37980)</option>
              <option value="35620">New York (35620)</option>
              <option value="31080">Los Angeles (31080)</option>
              <option value="16980">Chicago (16980)</option>
            </select>
          </div>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="p-4 bg-teal-50 rounded-lg border border-teal-200">
              <div className="text-sm text-teal-600">Your Avg Rate (92014)</div>
              <div className="text-2xl font-bold text-teal-700">$145</div>
              <div className="text-xs text-teal-600 mt-1">vs Market: $158 avg</div>
            </div>
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="text-sm text-blue-600">Price Position</div>
              <div className="text-2xl font-bold text-blue-700">25th %ile</div>
              <div className="text-xs text-blue-600 mt-1">Below market average</div>
            </div>
            <div className="p-4 bg-amber-50 rounded-lg border border-amber-200">
              <div className="text-sm text-amber-600">Revenue Opportunity</div>
              <div className="text-2xl font-bold text-amber-700">$52K/yr</div>
              <div className="text-xs text-amber-600 mt-1">If priced at 50th %ile</div>
            </div>
          </div>
          <h4 className="font-medium text-gray-900 mb-3">CPT Code Analysis - CBSA {selectedCBSA}</h4>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left py-2 px-4 text-xs font-medium text-gray-500">CPT</th>
                  <th className="text-left py-2 px-4 text-xs font-medium text-gray-500">Description</th>
                  <th className="text-right py-2 px-4 text-xs font-medium text-gray-500">Your Rate</th>
                  <th className="text-right py-2 px-4 text-xs font-medium text-gray-500">Market 25th</th>
                  <th className="text-right py-2 px-4 text-xs font-medium text-gray-500">Market 50th</th>
                  <th className="text-right py-2 px-4 text-xs font-medium text-gray-500">Market 75th</th>
                  <th className="text-left py-2 px-4 text-xs font-medium text-gray-500">Position</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {[
                  { cpt: '92014', desc: 'Eye exam, established', yours: 145, p25: 138, p50: 158, p75: 185 },
                  { cpt: '92004', desc: 'Eye exam, new patient', yours: 195, p25: 185, p50: 215, p75: 245 },
                  { cpt: '92134', desc: 'OCT retina scan', yours: 75, p25: 68, p50: 82, p75: 95 },
                  { cpt: '92083', desc: 'Visual field test', yours: 85, p25: 78, p50: 92, p75: 110 },
                  { cpt: '66984', desc: 'Cataract surgery', yours: 2850, p25: 2650, p50: 3100, p75: 3450 },
                ].map((row) => (
                  <tr key={row.cpt} className="hover:bg-gray-50">
                    <td className="py-2 px-4 text-sm font-mono">{row.cpt}</td>
                    <td className="py-2 px-4 text-sm">{row.desc}</td>
                    <td className="py-2 px-4 text-sm text-right font-medium">${row.yours}</td>
                    <td className="py-2 px-4 text-sm text-right text-gray-500">${row.p25}</td>
                    <td className="py-2 px-4 text-sm text-right text-gray-500">${row.p50}</td>
                    <td className="py-2 px-4 text-sm text-right text-gray-500">${row.p75}</td>
                    <td className="py-2 px-4">
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        row.yours < row.p25 ? 'bg-red-50 text-red-700' :
                        row.yours < row.p50 ? 'bg-yellow-50 text-yellow-700' :
                        'bg-green-50 text-green-700'
                      }`}>
                        {row.yours < row.p25 ? 'Below 25th' : row.yours < row.p50 ? '25th-50th' : 'Above 50th'}
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