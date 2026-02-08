"use client";
import React, { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar, Legend } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { TrendingUp, BarChart3, PieChart, Activity } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default function AnalyticsPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchAnalytics() {
      setLoading(true);
      try {
        const res = await fetch('/api/analytics/dashboard');
        const json = await res.json();
        setData(json);
        setError(null);
      } catch (err: any) {
        setError('Failed to load analytics');
      } finally {
        setLoading(false);
      }
    }
    fetchAnalytics();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6 flex">
      {/* AI Assistant Sidebar */}
      <aside className="w-72 min-h-screen bg-white border-r p-6 flex flex-col mr-8">
        <h2 className="text-lg font-bold mb-4 text-blue-700">AI Analytics Assistant</h2>
        <button className="mb-4 px-3 py-1 bg-blue-600 text-white rounded">Get Smart Insights</button>
        <ul className="mb-4">
          <li className="mb-2 text-gray-700">Identify top revenue sources</li>
          <li className="mb-2 text-gray-700">Spot patient volume trends</li>
          <li className="mb-2 text-gray-700">Optimize visit value</li>
          <li className="mb-2 text-gray-700">Monitor satisfaction scores</li>
        </ul>
        <div className="text-xs text-gray-500">AI can help you interpret analytics, forecast trends, and recommend actions.</div>
      </aside>
      {/* Main Analytics Dashboard */}
      <div className="container mx-auto max-w-7xl flex-1">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            📊 Analytics Dashboard
          </h1>
          <p className="text-gray-600">
            Comprehensive analytics and insights for your practice
          </p>
        </div>

        {loading ? (
          <div className="text-lg text-gray-500">Loading analytics...</div>
        ) : error ? (
          <div className="text-lg text-red-500">{error}</div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {/* Trend Charts */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              {/* Searches by Day Line Chart */}
              <div className="bg-white rounded-xl shadow p-6">
                <h2 className="text-lg font-bold mb-4">Searches by Day</h2>
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={data?.searchesByDay || []}>
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="count" stroke="#3b82f6" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              {/* Practices by Specialty Bar Chart */}
              <div className="bg-white rounded-xl shadow p-6">
                <h2 className="text-lg font-bold mb-4">Practices by Specialty</h2>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={data?.practicesBySpecialty || []}>
                    <XAxis dataKey="specialty" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="count" fill="#10b981" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Total Searches</CardTitle>
                  <TrendingUp className="h-4 w-4 text-green-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{data?.totalSearches ?? 0}</div>
                  <p className="text-xs text-green-600">Avg. Radius: {data?.avgRadius ?? 0} mi</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Top Specialty</CardTitle>
                  <Activity className="h-4 w-4 text-blue-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{data?.topSpecialty ?? 'N/A'}</div>
                  <p className="text-xs text-blue-600">Avg. Practices Found: {data?.avgPracticesFound ?? 0}</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Searches by Day</CardTitle>
                  <BarChart3 className="h-4 w-4 text-purple-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{data?.searchesByDay?.length ?? 0}</div>
                  <p className="text-xs text-purple-600">Recent: {data?.searchesByDay?.[0]?.date ?? 'N/A'}</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Top Locations</CardTitle>
                  <PieChart className="h-4 w-4 text-orange-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{data?.topLocations?.length ?? 0}</div>
                  <p className="text-xs text-orange-600">Most: {data?.topLocations?.[0]?.lat ?? 'N/A'}, {data?.topLocations?.[0]?.lng ?? 'N/A'}</p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Coming Soon</CardTitle>
                <CardDescription>Advanced analytics features in development</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Full analytics dashboard with detailed charts, trends, and insights is being built.
                </p>
                <Button>View Basic Reports</Button>
              </CardContent>
            </Card>

            <div className="mt-8">
              <button className="px-3 py-1 bg-green-600 text-white rounded">Export Analytics (CSV)</button>
              <div className="mt-2 text-sm text-gray-600">Drill-down by provider, patient, or department. Export for further analysis.</div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
