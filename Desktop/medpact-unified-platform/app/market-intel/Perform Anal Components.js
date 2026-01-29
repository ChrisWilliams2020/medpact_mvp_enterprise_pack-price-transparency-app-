// components/analytics/PerformanceAnalytics.tsx
'use client';

import { useState, useEffect } from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { DollarSign, Users, Clock, TrendingUp, Activity, Star } from 'lucide-react';

export default function PerformanceAnalytics() {
  const [loading, setLoading] = useState(true);

  // Mock data for demo
  const physicianData = [
    { name: 'Dr. Sarah Chen', specialty: 'Retina', patientVolume: 1250, surgicalCases: 420, patientSatisfaction: 4.9, revenue: 980000, efficiency: 94 },
    { name: 'Dr. Michael Rodriguez', specialty: 'Cornea', patientVolume: 1100, surgicalCases: 380, patientSatisfaction: 4.7, revenue: 850000, efficiency: 91 },
    { name: 'Dr. Emily Johnson', specialty: 'Glaucoma', patientVolume: 980, surgicalCases: 180, patientSatisfaction: 4.8, revenue: 720000, efficiency: 89 }
  ];

  const financials = {
    totalRevenue: 15800000,
    operatingMargin: 24.5,
    collectionRate: 96.2,
    payerMix: [
      { payer: 'Commercial Insurance', percentage: 45, reimbursement: 1450 },
      { payer: 'Medicare', percentage: 35, reimbursement: 980 },
      { payer: 'Medicaid', percentage: 12, reimbursement: 750 },
      { payer: 'Self Pay', percentage: 8, reimbursement: 1800 }
    ]
  };

  const patientFlow = {
    averageWaitTime: 12.5,
    appointmentUtilization: 87.3,
    noShowRate: 8.2,
    patientThroughput: 45.7,
    bottlenecks: [
      'Pre-surgical consultation scheduling',
      'Insurance authorization delays',
      'Diagnostic equipment availability'
    ]
  };

  useEffect(() => {
    // Simulate loading
    setTimeout(() => setLoading(false), 1000);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Financial KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-green-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-700">Total Revenue</h3>
              <p className="text-2xl font-bold text-gray-900">
                ${(financials.totalRevenue / 1000000).toFixed(1)}M
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-blue-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-700">Operating Margin</h3>
              <p className="text-2xl font-bold text-gray-900">{financials.operatingMargin}%</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <Activity className="w-5 h-5 text-purple-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-700">Collection Rate</h3>
              <p className="text-2xl font-bold text-gray-900">{financials.collectionRate}%</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
              <Clock className="w-5 h-5 text-yellow-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-700">Avg Wait Time</h3>
              <p className="text-2xl font-bold text-gray-900">{patientFlow.averageWaitTime} min</p>
            </div>
          </div>
        </div>
      </div>

      {/* Physician Performance */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Physician Performance</h3>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Physician</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Specialty</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Patient Volume</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Surgical Cases</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Satisfaction</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Revenue</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Efficiency</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {physicianData.map((physician, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {physician.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {physician.specialty}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {physician.patientVolume.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {physician.surgicalCases}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <Star className="w-4 h-4 text-yellow-400 mr-1" />
                      <span className="text-sm text-gray-900">{physician.patientSatisfaction}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ${(physician.revenue / 1000).toFixed(0)}K
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      physician.efficiency >= 90 ? 'bg-green-100 text-green-800' :
                      physician.efficiency >= 80 ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {physician.efficiency}%
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}