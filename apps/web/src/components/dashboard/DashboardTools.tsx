import { useState } from 'react';

interface DashboardToolsProps {
  view: string;
}

export default function DashboardTools({ view }: DashboardToolsProps) {
  const [chatMessages, setChatMessages] = useState<Array<{role: string; content: string}>>([
    { role: 'assistant', content: 'Hello! I\'m your KCN Practice Intelligence Assistant. I can help you with coding questions, payer analysis, benchmarking, and practice optimization. What would you like to know?' }
  ]);
  const [chatInput, setChatInput] = useState('');

  // Profile View
  if (view === 'profile') {
    return (
      <div className="space-y-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-indigo-50">
            <h3 className="font-semibold text-gray-900">👤 Practice Profile</h3>
            <p className="text-xs text-gray-500 mt-1">Manage your practice information and settings</p>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h4 className="font-medium text-gray-900">Practice Information</h4>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Practice Name</label>
                    <input type="text" defaultValue="Premier Eye Associates" className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">NPI Number</label>
                    <input type="text" defaultValue="1234567890" className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Tax ID</label>
                    <input type="text" defaultValue="XX-XXXXXXX" className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Specialty</label>
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-lg">
                      <option>Ophthalmology - Comprehensive</option>
                      <option>Ophthalmology - Retina</option>
                      <option>Ophthalmology - Glaucoma</option>
                      <option>Ophthalmology - Cornea</option>
                      <option>Optometry</option>
                    </select>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <h4 className="font-medium text-gray-900">Location</h4>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                    <input type="text" defaultValue="123 Medical Plaza Dr" className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                      <input type="text" defaultValue="Philadelphia" className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                      <input type="text" defaultValue="PA" className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">CBSA Code</label>
                    <input type="text" defaultValue="37980 - Philadelphia-Camden-Wilmington" className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-6 pt-6 border-t border-gray-100">
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Save Changes</button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Data Upload View
  if (view === 'data-upload') {
    return (
      <div className="space-y-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-orange-50 to-amber-50">
            <h3 className="font-semibold text-gray-900">📤 Data Upload</h3>
            <p className="text-xs text-gray-500 mt-1">Upload claims, financial, and operational data</p>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              {[
                { type: 'Claims Data', icon: '📋', format: 'CSV, X12 837', desc: 'Upload claim submissions and remittances' },
                { type: 'Financial Reports', icon: '💰', format: 'CSV, Excel', desc: 'P&L, balance sheets, revenue reports' },
                { type: 'Schedule Data', icon: '📅', format: 'CSV, iCal', desc: 'Patient appointments and provider schedules' },
              ].map((item) => (
                <div key={item.type} className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-blue-400 hover:bg-blue-50 transition-colors cursor-pointer">
                  <div className="text-4xl mb-3">{item.icon}</div>
                  <div className="font-medium text-gray-900">{item.type}</div>
                  <div className="text-xs text-gray-500 mt-1">{item.format}</div>
                  <div className="text-xs text-gray-400 mt-2">{item.desc}</div>
                </div>
              ))}
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-3">Recent Uploads</h4>
              <div className="space-y-2">
                {[
                  { name: 'claims_march_2026.csv', date: 'Mar 28, 2026', status: 'Processed', rows: '2,847' },
                  { name: 'financial_q1_2026.xlsx', date: 'Mar 25, 2026', status: 'Processed', rows: '156' },
                  { name: 'schedule_export.csv', date: 'Mar 20, 2026', status: 'Processed', rows: '1,203' },
                ].map((file) => (
                  <div key={file.name} className="flex items-center justify-between bg-white p-3 rounded-lg border border-gray-200">
                    <div className="flex items-center gap-3">
                      <span className="text-xl">📄</span>
                      <div>
                        <div className="text-sm font-medium">{file.name}</div>
                        <div className="text-xs text-gray-500">{file.date} • {file.rows} rows</div>
                      </div>
                    </div>
                    <span className="text-xs px-2 py-1 bg-green-50 text-green-700 rounded-full">{file.status}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Staff View
  if (view === 'staff') {
    return (
      <div className="space-y-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-violet-50 to-purple-50">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-gray-900">👥 Staff Management</h3>
                <p className="text-xs text-gray-500 mt-1">Manage team members and permissions</p>
              </div>
              <button className="px-4 py-2 bg-violet-600 text-white rounded-lg text-sm hover:bg-violet-700">+ Add Staff</button>
            </div>
          </div>
          <div className="p-6">
            <div className="space-y-3">
              {[
                { name: 'Dr. Sarah Chen', role: 'Physician', email: 'schen@premierye.com', access: 'Full Access', status: 'Active' },
                { name: 'Dr. Michael Roberts', role: 'Physician', email: 'mroberts@premiereye.com', access: 'Full Access', status: 'Active' },
                { name: 'Jennifer Walsh', role: 'Practice Manager', email: 'jwalsh@premiereye.com', access: 'Admin', status: 'Active' },
                { name: 'Amanda Torres', role: 'Billing Manager', email: 'atorres@premiereye.com', access: 'Billing', status: 'Active' },
                { name: 'Kevin Liu', role: 'Technician', email: 'kliu@premiereye.com', access: 'Limited', status: 'Active' },
              ].map((staff) => (
                <div key={staff.email} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-violet-100 rounded-full flex items-center justify-center text-violet-600 font-medium">
                      {staff.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">{staff.name}</div>
                      <div className="text-sm text-gray-500">{staff.role} • {staff.email}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs px-2 py-1 bg-blue-50 text-blue-700 rounded-full">{staff.access}</span>
                    <span className="text-xs px-2 py-1 bg-green-50 text-green-700 rounded-full">{staff.status}</span>
                    <button className="text-gray-400 hover:text-gray-600">⋮</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Consultant View
  if (view === 'consultant') {
    return (
      <div className="space-y-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-emerald-50 to-teal-50">
            <h3 className="font-semibold text-gray-900">💼 Consultant Portal</h3>
            <p className="text-xs text-gray-500 mt-1">Connect with practice management consultants</p>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h4 className="font-medium text-gray-900">Your Consultant</h4>
                <div className="p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center text-2xl">👨‍💼</div>
                    <div>
                      <div className="font-medium text-gray-900">John Pinto</div>
                      <div className="text-sm text-gray-500">Practice Management Consultant</div>
                      <div className="text-xs text-emerald-600">Specializing in Ophthalmology</div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button className="flex-1 px-3 py-2 bg-emerald-600 text-white rounded-lg text-sm hover:bg-emerald-700">Schedule Call</button>
                    <button className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50">Send Message</button>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <h4 className="font-medium text-gray-900">Recent Reports</h4>
                <div className="space-y-2">
                  {[
                    { title: 'Q1 2026 Practice Analysis', date: 'Mar 15, 2026' },
                    { title: 'Revenue Optimization Plan', date: 'Feb 28, 2026' },
                    { title: 'Staffing Efficiency Review', date: 'Feb 10, 2026' },
                  ].map((report) => (
                    <div key={report.title} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <span className="text-xl">📊</span>
                        <div>
                          <div className="text-sm font-medium">{report.title}</div>
                          <div className="text-xs text-gray-500">{report.date}</div>
                        </div>
                      </div>
                      <button className="text-blue-600 hover:text-blue-700 text-sm">View</button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // KCN Chat View
  if (view === 'kcn-chat') {
    const handleSendMessage = () => {
      if (!chatInput.trim()) return;
      setChatMessages([...chatMessages, 
        { role: 'user', content: chatInput },
        { role: 'assistant', content: 'I\'m analyzing your question about "' + chatInput + '". Based on your practice data, here are my insights...\n\n• Your collection rate of 97.2% is above the benchmark of 95%\n• Consider reviewing the denied claims from Aetna - pattern suggests modifier issues\n• Revenue opportunity: Add-on 92083 codes for glaucoma suspects\n\nWould you like me to drill down into any of these areas?' }
      ]);
      setChatInput('');
    };

    return (
      <div className="space-y-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden h-[calc(100vh-280px)] flex flex-col">
          <div className="px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-indigo-50 to-blue-50">
            <h3 className="font-semibold text-gray-900">💬 KCN Practice Intelligence Chat</h3>
            <p className="text-xs text-gray-500 mt-1">AI-powered assistant for coding, billing, and practice optimization</p>
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
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Ask about coding, billing, benchmarks, or practice optimization..."
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <button onClick={handleSendMessage} className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Send</button>
            </div>
            <div className="flex gap-2 mt-3">
              {['Coding question', 'Benchmark comparison', 'Denial analysis', 'Revenue opportunities'].map((prompt) => (
                <button key={prompt} onClick={() => setChatInput(prompt)} className="text-xs px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-full text-gray-600">{prompt}</button>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Quality View
  if (view === 'quality') {
    return (
      <div className="space-y-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-green-50 to-emerald-50">
            <h3 className="font-semibold text-gray-900">✅ Quality Metrics & MIPS</h3>
            <p className="text-xs text-gray-500 mt-1">Track quality measures and MIPS performance</p>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              {[
                { label: 'MIPS Score', value: '92', max: '100', color: 'green' },
                { label: 'Quality', value: '45', max: '45', color: 'green' },
                { label: 'Cost', value: '15', max: '30', color: 'yellow' },
                { label: 'Improvement', value: '32', max: '25', color: 'green' },
              ].map((metric) => (
                <div key={metric.label} className="p-4 bg-gray-50 rounded-lg">
                  <div className="text-sm text-gray-500">{metric.label}</div>
                  <div className="text-2xl font-bold text-gray-900">{metric.value}<span className="text-sm font-normal text-gray-400">/{metric.max}</span></div>
                  <div className="mt-2 h-2 bg-gray-200 rounded-full">
                    <div className={`h-full rounded-full ${metric.color === 'green' ? 'bg-green-500' : 'bg-yellow-500'}`} style={{ width: `${(parseInt(metric.value) / parseInt(metric.max)) * 100}%` }}></div>
                  </div>
                </div>
              ))}
            </div>
            <h4 className="font-medium text-gray-900 mb-3">Quality Measures</h4>
            <div className="space-y-2">
              {[
                { id: '117', name: 'Diabetes: Eye Exam', performance: '94%', benchmark: '75%', status: 'Met' },
                { id: '130', name: 'Documentation of Current Meds', performance: '98%', benchmark: '80%', status: 'Met' },
                { id: '141', name: 'Primary Open-Angle Glaucoma: Optic Nerve Evaluation', performance: '89%', benchmark: '85%', status: 'Met' },
                { id: '226', name: 'Preventive Care: Tobacco Screening', performance: '72%', benchmark: '80%', status: 'Not Met' },
              ].map((measure) => (
                <div key={measure.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-4">
                    <div className="text-xs font-mono text-gray-500">#{measure.id}</div>
                    <div className="text-sm">{measure.name}</div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-sm font-medium">{measure.performance}</div>
                    <div className="text-xs text-gray-500">Benchmark: {measure.benchmark}</div>
                    <span className={`text-xs px-2 py-1 rounded-full ${measure.status === 'Met' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>{measure.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Survey View
  if (view === 'survey') {
    return (
      <div className="space-y-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-pink-50 to-rose-50">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-gray-900">📝 Patient Surveys</h3>
                <p className="text-xs text-gray-500 mt-1">Create and manage patient satisfaction surveys</p>
              </div>
              <button className="px-4 py-2 bg-rose-600 text-white rounded-lg text-sm hover:bg-rose-700">+ New Survey</button>
            </div>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                <div className="text-sm text-green-600">Overall Satisfaction</div>
                <div className="text-3xl font-bold text-green-700">4.7<span className="text-lg">/5</span></div>
                <div className="text-xs text-green-600 mt-1">↑ 0.2 from last month</div>
              </div>
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div className="text-sm text-blue-600">Response Rate</div>
                <div className="text-3xl font-bold text-blue-700">34%</div>
                <div className="text-xs text-blue-600 mt-1">847 responses this month</div>
              </div>
              <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                <div className="text-sm text-purple-600">Net Promoter Score</div>
                <div className="text-3xl font-bold text-purple-700">72</div>
                <div className="text-xs text-purple-600 mt-1">Excellent (&gt;50)</div>
              </div>
            </div>
            <h4 className="font-medium text-gray-900 mb-3">Active Surveys</h4>
            <div className="space-y-3">
              {[
                { name: 'Post-Visit Satisfaction', responses: 847, status: 'Active', lastResponse: '2 hours ago' },
                { name: 'Cataract Surgery Follow-up', responses: 124, status: 'Active', lastResponse: '1 day ago' },
                { name: 'New Patient Experience', responses: 203, status: 'Paused', lastResponse: '5 days ago' },
              ].map((survey) => (
                <div key={survey.name} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <div className="font-medium">{survey.name}</div>
                    <div className="text-sm text-gray-500">{survey.responses} responses • Last: {survey.lastResponse}</div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`text-xs px-2 py-1 rounded-full ${survey.status === 'Active' ? 'bg-green-50 text-green-700' : 'bg-gray-200 text-gray-600'}`}>{survey.status}</span>
                    <button className="text-blue-600 hover:text-blue-700 text-sm">View Results</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Marketing View
  if (view === 'marketing') {
    return (
      <div className="space-y-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-amber-50 to-orange-50">
            <h3 className="font-semibold text-gray-900">📣 Marketing Tools</h3>
            <p className="text-xs text-gray-500 mt-1">Patient outreach, campaigns, and marketing analytics</p>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              {[
                { label: 'Email Campaigns', value: '12', sublabel: 'Active', icon: '✉️' },
                { label: 'Recall Patients', value: '342', sublabel: 'Due this month', icon: '📞' },
                { label: 'Reviews Generated', value: '47', sublabel: 'This month', icon: '⭐' },
                { label: 'Referral Sources', value: '28', sublabel: 'Active', icon: '🤝' },
              ].map((stat) => (
                <div key={stat.label} className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <span>{stat.icon}</span>
                    {stat.label}
                  </div>
                  <div className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</div>
                  <div className="text-xs text-gray-500">{stat.sublabel}</div>
                </div>
              ))}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Quick Actions</h4>
                <div className="space-y-2">
                  {[
                    { label: 'Send Recall Reminders', icon: '📱', desc: '342 patients due' },
                    { label: 'Request Reviews', icon: '⭐', desc: 'From recent visits' },
                    { label: 'Create Email Campaign', icon: '✉️', desc: 'Seasonal promotions' },
                    { label: 'Update Website', icon: '🌐', desc: 'Services & hours' },
                  ].map((action) => (
                    <button key={action.label} className="w-full flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100">
                      <div className="flex items-center gap-3">
                        <span className="text-xl">{action.icon}</span>
                        <div className="text-left">
                          <div className="text-sm font-medium">{action.label}</div>
                          <div className="text-xs text-gray-500">{action.desc}</div>
                        </div>
                      </div>
                      <span className="text-gray-400">→</span>
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Recent Campaign Performance</h4>
                <div className="space-y-3">
                  {[
                    { name: 'Spring Eye Exam Reminder', sent: 1250, opened: '42%', clicked: '12%' },
                    { name: 'Dry Eye Awareness', sent: 890, opened: '38%', clicked: '8%' },
                    { name: 'Premium IOL Education', sent: 425, opened: '51%', clicked: '22%' },
                  ].map((campaign) => (
                    <div key={campaign.name} className="p-3 border border-gray-200 rounded-lg">
                      <div className="font-medium text-sm">{campaign.name}</div>
                      <div className="flex gap-4 mt-2 text-xs text-gray-500">
                        <span>Sent: {campaign.sent}</span>
                        <span>Opened: {campaign.opened}</span>
                        <span>Clicked: {campaign.clicked}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Default fallback
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <p className="text-gray-500">Select a tool from the menu</p>
    </div>
  );
}