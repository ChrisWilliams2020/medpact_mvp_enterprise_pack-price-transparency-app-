'use client';

import { useState, useEffect } from 'react';
import { MainNav } from '@/components/layout/MainNav';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import toast from 'react-hot-toast';

export default function PayorIntelligencePage() {
  const [networks, setNetworks] = useState<any[]>([]);
  const [opportunities, setOpportunities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [networksRes, opportunitiesRes] = await Promise.all([
        fetch('/api/payor-networks'),
        fetch('/api/revenue-opportunities'),
      ]);

      const networksData = await networksRes.json();
      const opportunitiesData = await opportunitiesRes.json();

      setNetworks(networksData.networks || []);
      setOpportunities(opportunitiesData.opportunities || []);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to load payor intelligence data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <MainNav />
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <MainNav />

      <main className="max-w-7xl mx-auto p-6">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Payor Intelligence
          </h1>
          <p className="text-lg text-gray-600">
            Track competitor networks and identify revenue opportunities
          </p>
        </div>

        {/* Network Matrix */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Payor Network Matrix</h2>
          {networks.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">💳</div>
              <p className="text-gray-600 mb-4">No payor network data yet</p>
              <p className="text-sm text-gray-500">Add competitor payor data to see the matrix</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b-2 border-gray-200">
                    <th className="text-left py-3 px-4 font-semibold text-gray-900">Competitor</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-900">Payor</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-900">Network Status</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-900">Estimated Rate</th>
                  </tr>
                </thead>
                <tbody>
                  {networks.map((network, index) => (
                    <tr key={network.id || index} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-4 px-4 text-gray-900">{network.competitor_name}</td>
                      <td className="py-4 px-4 text-gray-900">{network.payor_name}</td>
                      <td className="py-4 px-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          network.in_network ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {network.in_network ? 'In Network' : 'Out of Network'}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-gray-900">
                        {network.estimated_rate ? `$${network.estimated_rate}` : 'N/A'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Revenue Opportunities */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Revenue Opportunities</h2>
          {opportunities.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">💰</div>
              <p className="text-gray-600 mb-4">No revenue opportunities identified yet</p>
              <p className="text-sm text-gray-500">Add payor data to identify potential revenue</p>
            </div>
          ) : (
            <div className="space-y-4">
              {opportunities.map((opp, index) => (
                <div key={opp.id || index} className="p-6 border-2 border-gray-200 rounded-xl hover:border-blue-500 transition-all">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-bold text-lg text-gray-900 mb-2">{opp.payor_name}</h3>
                      <p className="text-gray-600 mb-3">{opp.opportunity_type}</p>
                      <div className="flex items-center gap-4">
                        <div>
                          <span className="text-sm text-gray-500">Estimated Revenue</span>
                          <p className="text-2xl font-bold text-green-600">
                            ${parseFloat(opp.estimated_revenue || 0).toLocaleString()}
                          </p>
                        </div>
                        <div>
                          <span className="text-sm text-gray-500">Priority</span>
                          <p className={`text-sm font-medium ${
                            opp.priority === 'high' ? 'text-red-600' :
                            opp.priority === 'medium' ? 'text-orange-600' : 'text-gray-600'
                          }`}>
                            {opp.priority?.toUpperCase() || 'MEDIUM'}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  {opp.notes && (
                    <p className="mt-4 text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                      {opp.notes}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
