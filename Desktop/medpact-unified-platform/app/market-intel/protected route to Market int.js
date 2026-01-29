// app/market-intel/page.tsx - Add authentication wrapper
'use client';

import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { useAuth } from '@/contexts/AuthContext';
// ... your existing market intelligence code

function MarketIntelContent() {
  // ... your existing component code
}

export default function MarketIntelPage() {
  return (
    <ProtectedRoute 
      requiredPermission={{ permission: 'view_market_data' }}
    >
      <MarketIntelContent />
    </ProtectedRoute>
  );
}