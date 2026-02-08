'use client';
export const dynamic = 'force-dynamic';

import { useEffect, useState } from 'react';
import Link from 'next/link';

  const [stats, setStats] = useState({
    contracts: 0,
    payorNetworks: 0,
    opportunities: 0,
    totalRevenue: 0,
  });
  const [loading, setLoading] = useState(true);
  const [aiInsights, setAiInsights] = useState<string[]>([]);
  const [aiLoading, setAiLoading] = useState(false);

  // AI Assistant: fetch insights
  const fetchAiInsights = async () => {
    setAiLoading(true);
    // Simulate AI call (replace with real API)
    setTimeout(() => {
      setAiInsights([
        "Your contract renewal rate is above average this quarter.",
        "Revenue opportunities are trending up 12% month-over-month.",
        "Payor network expansion is recommended in your region.",
        "Consider reviewing contracts with low performance scores.",
        "AI detected a spike in patient satisfaction scores.",
      ]);
      setAiLoading(false);
    }, 1200);
  };

  useEffect(() => {
    async function fetchStats() {
      try {
        const [contractsRes, networksRes, opportunitiesRes] = await Promise.all([
          fetch('/api/contracts'),
          fetch('/api/payor-networks'),
          fetch('/api/revenue-opportunities'),
        ]);

        const contractsData = await contractsRes.json();
        const networksData = await networksRes.json();
        const opportunitiesData = await opportunitiesRes.json();

        const totalRevenue = opportunitiesData.opportunities?.reduce(
          (sum: number, opp: any) => sum + (parseFloat(opp.estimated_revenue) || 0),
          0
        ) || 0;

        setStats({
          contracts: contractsData.contracts?.length || 0,
          payorNetworks: networksData.networks?.length || 0,
          opportunities: opportunitiesData.opportunities?.length || 0,
          totalRevenue,
        });
      } catch (error) {
        console.error('Failed to fetch stats:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchStats();
  }, []);

  const statCards = [
    {
      title: 'Active Contracts',
      value: stats.contracts,
      icon: '📋',
      gradient: 'from-blue-500 via-blue-600 to-indigo-600',
      iconBg: 'bg-blue-100',
      iconColor: 'text-blue-600',
    },
    {
      title: 'Payor Networks',
      value: stats.payorNetworks,
      icon: '💳',
      gradient: 'from-purple-500 via-purple-600 to-pink-600',
      iconBg: 'bg-purple-100',
      iconColor: 'text-purple-600',
    },
    {
      title: 'Opportunities',
      value: stats.opportunities,
      icon: '💰',
      gradient: 'from-green-500 via-emerald-600 to-teal-600',
      iconBg: 'bg-green-100',
      iconColor: 'text-green-600',
    },
    {
      title: 'Potential Revenue',
      value: `$${stats.totalRevenue.toLocaleString()}`,
      icon: '📈',
      gradient: 'from-orange-500 via-red-500 to-pink-600',
      iconBg: 'bg-orange-100',
      iconColor: 'text-orange-600',
    },
  ];

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* AI Assistant Sidebar */}
      <aside className="w-72 min-h-screen bg-gray-50 border-r p-6 flex flex-col">
        <h2 className="text-lg font-bold mb-4 text-purple-700">AI Dashboard Assistant</h2>
        <button
          className="mb-4 px-3 py-1 bg-purple-600 text-white rounded"
          onClick={fetchAiInsights}
          disabled={aiLoading}
        >
          {aiLoading ? "Loading..." : "Get AI Insights"}
        </button>
        <ul className="mb-4">
          {aiInsights.map((s, idx) => (
            <li key={idx} className="mb-2 text-gray-700">{s}</li>
          ))}
        </ul>
        <div className="text-xs text-gray-500">AI can surface trends, risks, and opportunities for your practice.</div>
      </aside>
      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto p-6">
        {/* Hero Section */}
        <div className="mb-8">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-3">
            Welcome back! 👋
          </h1>
          <p className="text-xl text-gray-600">
            Here's what's happening with your payor contracts today
          </p>
        </div>

        {/* Colorful Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statCards.map((stat, index) => (
            <div
              key={index}
              className={`bg-gradient-to-br ${stat.gradient} rounded-2xl shadow-lg p-6 text-white transform hover:scale-105 transition-transform duration-200`}
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`w-14 h-14 ${stat.iconBg} rounded-xl flex items-center justify-center text-3xl shadow-md`}>
                  {stat.icon}
                </div>
              </div>
              <p className="text-sm font-medium text-white/80 mb-1">{stat.title}</p>
              <p className="text-4xl font-bold">
                {loading ? '...' : stat.value}
              </p>
            </div>
          ))}
        </div>

        {/* Quick Actions with Color */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8 mb-8">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-6">
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Link
              href="/market-intel/landscape"
              className="group relative overflow-hidden p-6 border-2 border-blue-200 rounded-2xl hover:border-blue-500 bg-gradient-to-br from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100 transition-all transform hover:scale-105"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full -mr-16 -mt-16"></div>
              <div className="relative">
                <div className="text-5xl mb-3">🗺️</div>
                <h3 className="font-bold text-blue-900 text-xl mb-2">
                  Market Analysis
                </h3>
                <p className="text-sm text-blue-700">
                  Search and analyze competitors in your market
                </p>
              </div>
            </Link>

            <Link
              href="/contracts"
              className="group relative overflow-hidden p-6 border-2 border-purple-200 rounded-2xl hover:border-purple-500 bg-gradient-to-br from-purple-50 to-pink-50 hover:from-purple-100 hover:to-pink-100 transition-all transform hover:scale-105"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full -mr-16 -mt-16"></div>
              <div className="relative">
                <div className="text-5xl mb-3">📋</div>
                <h3 className="font-bold text-purple-900 text-xl mb-2">
                  Manage Contracts
                </h3>
                <p className="text-sm text-purple-700">
                  Track and optimize your payor contracts
                </p>
              </div>
            </Link>

            <Link
              href="/payor-intelligence"
              className="group relative overflow-hidden p-6 border-2 border-green-200 rounded-2xl hover:border-green-500 bg-gradient-to-br from-green-50 to-emerald-50 hover:from-green-100 hover:to-emerald-100 transition-all transform hover:scale-105"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/10 rounded-full -mr-16 -mt-16"></div>
              <div className="relative">
                <div className="text-5xl mb-3">💳</div>
                <h3 className="font-bold text-green-900 text-xl mb-2">
                  Payor Intelligence
                </h3>
                <p className="text-sm text-green-700">
                  View network data and revenue opportunities
                </p>
              </div>
            </Link>
          </div>
        </div>

        {/* Recent Activity with Color */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-6">
            Recent Activity
          </h2>
          <div className="space-y-4">
            <div className="flex items-center gap-4 p-5 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border-l-4 border-blue-500 transform hover:scale-102 transition-transform">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white text-xl shadow-lg">
                📋
              </div>
              <div className="flex-1">
                <p className="font-bold text-gray-900">Contract Management System</p>
                <p className="text-sm text-gray-600">Track your payor agreements</p>
              </div>
              <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full">Active</span>
            </div>
            <div className="flex items-center gap-4 p-5 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border-l-4 border-green-500 transform hover:scale-102 transition-transform">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center text-white text-xl shadow-lg">
                💰
              </div>
              <div className="flex-1">
                <p className="font-bold text-gray-900">Revenue Opportunities</p>
                <p className="text-sm text-gray-600">Identify growth potential</p>
              </div>
              <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full">Active</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}