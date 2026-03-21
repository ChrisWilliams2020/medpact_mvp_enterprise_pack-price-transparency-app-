'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/db/supabase';

export default function ReferralNetworkPage() {
  const [referrals, setReferrals] = useState<any[]>([]);
  const [networkStats, setNetworkStats] = useState({
    totalReferrals: 0,
    successRate: 0,
    topSpecialties: [] as string[],
    activePartners: 0
  });

  useEffect(() => {
    loadReferralNetwork();
  }, []);

  const loadReferralNetwork = async () => {
    const { data } = await supabase
      .from('referral_network')
      .select(`
        *,
        from_practice:practices!from_practice_id(*),
        to_practice:practices!to_practice_id(*)
      `)
      .order('referral_count', { ascending: false });

    if (data) {
      setReferrals(data);
      
      // Calculate stats
      const total = data.reduce((sum, r) => sum + r.referral_count, 0);
      const avgSuccess = data.reduce((sum, r) => sum + r.success_rate, 0) / data.length;
      const specialties = [...new Set(data.map(r => r.specialty))];
      
      setNetworkStats({
        totalReferrals: total,
        successRate: avgSuccess,
        topSpecialties: specialties.slice(0, 5),
        activePartners: new Set(data.flatMap(r => [r.from_practice_id, r.to_practice_id])).size
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-6">
      <div className="container mx-auto max-w-6xl space-y-6">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              🤝 Referral Network
            </h1>
            <p className="text-gray-600">
              Build and manage your practice referral partnerships
            </p>
          </div>
          <div className="flex gap-3">
            <Button>➕ Add Referral Partner</Button>
            <Link href="/dashboard/advanced">
              <Button variant="outline">← Dashboard</Button>
            </Link>
          </div>
        </div>

        {/* Network Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Total Referrals</CardDescription>
              <CardTitle className="text-3xl text-blue-600">{networkStats.totalReferrals}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">All-time network referrals</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Success Rate</CardDescription>
              <CardTitle className="text-3xl text-green-600">{networkStats.successRate.toFixed(1)}%</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">Patient follow-through</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Active Partners</CardDescription>
              <CardTitle className="text-3xl text-purple-600">{networkStats.activePartners}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">In your network</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Top Specialties</CardDescription>
              <CardTitle className="text-xl text-orange-600">{networkStats.topSpecialties[0] || 'N/A'}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">Most referred</p>
            </CardContent>
          </Card>
        </div>

        {/* Referral Partnerships */}
        <Card>
          <CardHeader>
            <CardTitle>Your Referral Partnerships</CardTitle>
            <CardDescription>Track and manage your professional referral network</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {referrals.map((referral) => (
                <div key={referral.id} className="border rounded-lg p-4 hover:bg-gray-50">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-2xl">
                        →
                      </div>
                      <div>
                        <p className="font-semibold">{referral.from_practice?.name}</p>
                        <p className="text-sm text-gray-600">→ {referral.to_practice?.name}</p>
                        <p className="text-xs text-gray-500 mt-1">{referral.specialty}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-600">Success Rate</p>
                      <p className="text-2xl font-bold text-green-600">{referral.success_rate}%</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t">
                    <div>
                      <p className="text-xs text-gray-600">Total Referrals</p>
                      <p className="font-bold">{referral.referral_count}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600">This Month</p>
                      <p className="font-bold">24</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600">Revenue Generated</p>
                      <p className="font-bold text-green-600">$12,500</p>
                    </div>
                  </div>

                  <div className="flex gap-2 mt-4">
                    <Button size="sm" variant="outline">View Details</Button>
                    <Button size="sm" variant="outline">Send Referral</Button>
                    <Button size="sm">Manage</Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Network Map */}
        <Card>
          <CardHeader>
            <CardTitle>🗺️ Network Visualization</CardTitle>
            <CardDescription>Visual representation of your referral network</CardDescription>
          </CardHeader>
          <CardContent className="h-96 flex items-center justify-center bg-gray-50 rounded-lg">
            <div className="text-center">
              <p className="text-4xl mb-4">🌐</p>
              <p className="text-gray-600">Network graph visualization coming soon</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}