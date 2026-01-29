// app/analytics/page.tsx
'use client';

import ProtectedRoute from '@/components/auth/ProtectedRoute';
import AnalyticsDashboard from '@/components/analytics/AnalyticsDashboard';

export default function AnalyticsPage() {
  return (
    <ProtectedRoute requiredPermission={{ permission: 'view_analytics' }}>
      <AnalyticsDashboard />
    </ProtectedRoute>
  );
}