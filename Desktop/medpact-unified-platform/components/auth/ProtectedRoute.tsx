'use client';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredPermission?: any;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  return <>{children}</>;
}
