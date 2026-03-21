/**
 * Reusable Metric Card Component
 */

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: string;
  color?: 'blue' | 'green' | 'purple' | 'orange';
}

export function MetricCard({ 
  title, 
  value, 
  subtitle, 
  icon, 
  color = 'blue' 
}: MetricCardProps) {
  const colorClasses = {
    blue: 'from-blue-500 to-blue-600',
    green: 'from-green-500 to-green-600',
    purple: 'from-purple-500 to-purple-600',
    orange: 'from-orange-500 to-orange-600'
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-gray-600">
          {title}
        </CardTitle>
        {icon && <span className="text-2xl">{icon}</span>}
      </CardHeader>
      <CardContent>
        <div className={`text-3xl font-bold bg-gradient-to-r ${colorClasses[color]} bg-clip-text text-transparent`}>
          {value}
        </div>
        {subtitle && (
          <p className="text-xs text-gray-500 mt-1">{subtitle}</p>
        )}
      </CardContent>
    </Card>
  );
}
