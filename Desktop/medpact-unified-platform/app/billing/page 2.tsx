'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PLANS } from '@/lib/payments/stripe';
import { useAuth } from '@/app/providers/auth-provider';
import { useState } from 'react';
import Link from 'next/link';

export default function BillingPage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState<string | null>(null);

  const handleSubscribe = async (priceId: string, planName: string) => {
    setLoading(planName);
    try {
      const response = await fetch('/api/stripe/create-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ priceId }),
      });
      const { url } = await response.json();
      window.location.href = url;
    } catch (error) {
      console.error('Subscription error:', error);
      setLoading(null);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-6">
      <div className="container mx-auto max-w-6xl space-y-6">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              💳 Subscription Plans
            </h1>
            <p className="text-gray-600">
              Choose the perfect plan for your organization
            </p>
          </div>
          <Link href="/dashboard/advanced">
            <Button variant="outline">← Dashboard</Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {Object.entries(PLANS).map(([key, plan]) => (
            <Card key={key} className={`${key === 'professional' ? 'border-purple-500 border-2 shadow-lg' : ''}`}>
              <CardHeader>
                {key === 'professional' && (
                  <div className="mb-2">
                    <span className="bg-purple-600 text-white px-3 py-1 rounded-full text-xs font-semibold">
                      MOST POPULAR
                    </span>
                  </div>
                )}
                <CardTitle className="text-2xl">{plan.name}</CardTitle>
                <CardDescription>
                  <span className="text-4xl font-bold text-gray-900">${plan.price}</span>
                  <span className="text-gray-600">/month</span>
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  {plan.features.map((feature, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <span className="text-green-600">✓</span>
                      <span className="text-sm">{feature}</span>
                    </div>
                  ))}
                </div>
                <Button
                  className="w-full"
                  onClick={() => handleSubscribe(plan.priceId, key)}
                  disabled={loading === key}
                  variant={key === 'professional' ? 'default' : 'outline'}
                >
                  {loading === key ? 'Processing...' : `Subscribe to ${plan.name}`}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card>
          <CardHeader>
            <CardTitle>🔒 Secure Payment Processing</CardTitle>
            <CardDescription>Your payment information is encrypted and secure</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4 items-center">
              <span className="text-sm text-gray-600">Powered by</span>
              <span className="font-bold text-purple-600 text-xl">Stripe</span>
              <span className="text-sm text-gray-600">• PCI DSS Compliant • 256-bit SSL Encryption</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}