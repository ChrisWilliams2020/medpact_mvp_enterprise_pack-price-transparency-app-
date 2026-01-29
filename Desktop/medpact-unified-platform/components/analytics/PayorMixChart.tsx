'use client';

import { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

export default function PayorMixChart() {
  const [payorData, setPayorData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPayorMix();
  }, []);

  const fetchPayorMix = async () => {
    try {
      const response = await fetch('/api/analytics/projections', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'payorMix',
          totalPatients: 5000,
          payorDistribution: {
            'Medicare': 30,
            'Commercial': 40,
            'Medicaid': 15,
            'Self-Pay': 10,
            'Other': 5,
          },
          averageReimbursements: {
            'Medicare': 120,
            'Commercial': 180,
            'Medicaid': 90,
            'Self-Pay': 150,
            'Other': 100,
          },
        }),
      });
      const data = await response.json();
      setPayorData(data);
    } catch (error) {
      console.error('Error fetching payor mix:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(value);
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-center text-gray-500">Loading payor mix data...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Payor Mix Distribution</CardTitle>
          <CardDescription>Patient volume by insurance type</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={payorData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ payorName, percentage }) => `${payorName} ${percentage.toFixed(1)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="percentage"
                >
                  {payorData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Revenue by Payor</CardTitle>
          <CardDescription>Annual revenue contribution by insurance type</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={payorData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="payorName" />
                <YAxis tickFormatter={formatCurrency} />
                <Tooltip formatter={(value: any) => formatCurrency(value)} />
                <Bar dataKey="annualRevenue" fill="#3b82f6">
                  {payorData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-4 space-y-2">
            {payorData.map((payor, index) => (
              <div key={index} className="flex justify-between items-center text-sm">
                <div className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded" 
                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                  />
                  <span className="font-medium">{payor.payorName}</span>
                </div>
                <div className="text-right">
                  <span className="font-semibold">{formatCurrency(payor.annualRevenue)}</span>
                  <span className="text-gray-500 ml-2">({payor.patientCount} pts)</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
