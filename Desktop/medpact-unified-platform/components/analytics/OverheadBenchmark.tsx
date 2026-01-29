'use client';

import { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function OverheadBenchmark() {
  const [benchmarkData, setBenchmarkData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBenchmark();
  }, []);

  const fetchBenchmark = async () => {
    try {
      const response = await fetch('/api/analytics/projections', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'overhead',
          totalRevenue: 1200000,
          staffCosts: 480000,
          facilityRent: 120000,
          supplies: 60000,
          other: 144000,
        }),
      });
      const data = await response.json();
      setBenchmarkData(data);
    } catch (error) {
      console.error('Error fetching benchmark:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-center text-gray-500">Loading overhead benchmarks...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Overhead Benchmarking</CardTitle>
        <CardDescription>Compare your overhead costs against industry benchmarks</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-80 mb-6">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={benchmarkData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="category" />
              <YAxis label={{ value: 'Percentage of Revenue', angle: -90, position: 'insideLeft' }} />
              <Tooltip />
              <Legend />
              <Bar dataKey="percentage" name="Your Overhead %" fill="#3b82f6">
                {benchmarkData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={entry.variance > 5 ? '#ef4444' : entry.variance < -5 ? '#10b981' : '#3b82f6'} 
                  />
                ))}
              </Bar>
              <Bar dataKey="benchmark" name="Industry Benchmark %" fill="#9ca3af" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="space-y-3">
          {benchmarkData.map((item, index) => (
            <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded">
              <div>
                <p className="font-medium capitalize">{item.category.replace(/([A-Z])/g, ' $1').trim()}</p>
                <p className="text-sm text-gray-500">
                  ${item.amount.toLocaleString()} ({item.percentage.toFixed(1)}% of revenue)
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500">Benchmark: {item.benchmark.toFixed(1)}%</p>
                <p className={`font-semibold ${
                  item.variance > 5 ? 'text-red-600' : 
                  item.variance < -5 ? 'text-green-600' : 
                  'text-gray-600'
                }`}>
                  {item.variance > 0 ? '+' : ''}{item.variance.toFixed(1)}% variance
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
