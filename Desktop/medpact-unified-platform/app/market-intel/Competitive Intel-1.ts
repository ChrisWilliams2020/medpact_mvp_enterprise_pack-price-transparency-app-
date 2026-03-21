// Add to components/analytics/AnalyticsDashboard.tsx - After market analysis tab
{/* Competitive Intelligence Tab */}
{activeTab === 'competitive' && (
  <div className="space-y-6">
    {/* Competitive Overview */}
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">Competitive Landscape</h3>
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Practice</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Market Share</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Physicians</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Patient Volume</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Growth Rate</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Threat Level</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {competitiveData.map((practice, index) => (
              <tr key={index} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{practice.practice}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {practice.marketShare}%
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {practice.physicianCount}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {practice.patientVolume.toLocaleString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`text-sm ${practice.growthRate >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {practice.growthRate >= 0 ? '+' : ''}{practice.growthRate}%
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    practice.threat_level === 'High' ? 'bg-red-100 text-red-800' :
                    practice.threat_level === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {practice.threat_level}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>

    {/* Market Share Visualization */}
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">Market Share Distribution</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={competitiveData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="practice" angle={-45} textAnchor="end" height={100} fontSize={12} />
          <YAxis fontSize={12} />
          <Tooltip />
          <Bar dataKey="marketShare" fill="#3b82f6" />
        </BarChart>
      </ResponsiveContainer>
    </div>

    {/* Competitive Insights */}
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center mb-4">
          <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
            <AlertTriangle className="w-5 h-5 text-red-600" />
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-gray-700">High Threat</h3>
            <p className="text-2xl font-bold text-red-600">
              {competitiveData.filter(p => p.threat_level === 'High').length}
            </p>
          </div>
        </div>
        <p className="text-sm text-gray-600">Practices requiring immediate attention</p>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center mb-4">
          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
            <TrendingUp className="w-5 h-5 text-blue-600" />
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-gray-700">Avg Growth</h3>
            <p className="text-2xl font-bold text-blue-600">
              {(competitiveData.reduce((sum, p) => sum + p.growthRate, 0) / competitiveData.length).toFixed(1)}%
            </p>
          </div>
        </div>
        <p className="text-sm text-gray-600">Market average growth rate</p>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center mb-4">
          <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
            <Users className="w-5 h-5 text-green-600" />
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-gray-700">Total Physicians</h3>
            <p className="text-2xl font-bold text-green-600">
              {competitiveData.reduce((sum, p) => sum + p.physicianCount, 0)}
            </p>
          </div>
        </div>
        <p className="text-sm text-gray-600">Across all competitors</p>
      </div>
    </div>
  </div>
)}