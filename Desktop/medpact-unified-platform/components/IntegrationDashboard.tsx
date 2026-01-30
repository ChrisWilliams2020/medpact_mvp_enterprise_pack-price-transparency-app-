'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Link2, 
  CheckCircle, 
  AlertCircle, 
  Clock,
  Settings,
  TrendingUp,
  Database,
  Cloud,
  Zap
} from 'lucide-react';
import { useRouter } from 'next/navigation';

interface Integration {
  id: string;
  name: string;
  description: string;
  status: 'connected' | 'disconnected' | 'pending';
  icon: any;
  category: string;
  color: string;
}

export function IntegrationDashboard() {
  const router = useRouter();

  const integrations: Integration[] = [
    {
      id: 'ehr',
      name: 'EHR System',
      description: 'Electronic Health Records integration',
      status: 'connected',
      icon: Database,
      category: 'Clinical',
      color: 'from-blue-500 to-blue-600'
    },
    {
      id: 'billing',
      name: 'Billing System',
      description: 'Practice management and billing',
      status: 'connected',
      icon: TrendingUp,
      category: 'Financial',
      color: 'from-green-500 to-green-600'
    },
    {
      id: 'analytics',
      name: 'Analytics Platform',
      description: 'Business intelligence and reporting',
      status: 'connected',
      icon: Zap,
      category: 'Analytics',
      color: 'from-purple-500 to-purple-600'
    },
    {
      id: 'cloud',
      name: 'Cloud Storage',
      description: 'Secure document storage',
      status: 'pending',
      icon: Cloud,
      category: 'Storage',
      color: 'from-orange-500 to-orange-600'
    }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'connected':
        return <Badge variant="success" className="flex items-center gap-1">
          <CheckCircle className="w-3 h-3" /> Connected
        </Badge>;
      case 'disconnected':
        return <Badge variant="destructive" className="flex items-center gap-1">
          <AlertCircle className="w-3 h-3" /> Disconnected
        </Badge>;
      case 'pending':
        return <Badge variant="warning" className="flex items-center gap-1">
          <Clock className="w-3 h-3" /> Pending
        </Badge>;
      default:
        return null;
    }
  };

  const connectedCount = integrations.filter(i => i.status === 'connected').length;
  const totalCount = integrations.length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Integrations</h2>
          <p className="text-gray-600 dark:text-gray-400">
            {connectedCount} of {totalCount} integrations active
          </p>
        </div>
        <Button onClick={() => router.push('/integrations')}>
          <Settings className="w-4 h-4 mr-2" />
          Manage All
        </Button>
      </div>

      {/* Integration Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {integrations.map((integration) => {
          const Icon = integration.icon;
          return (
            <Card key={integration.id} className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className={`p-3 rounded-lg bg-gradient-to-br ${integration.color}`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  {getStatusBadge(integration.status)}
                </div>
                <CardTitle className="text-lg mt-4">{integration.name}</CardTitle>
                <CardDescription>{integration.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">{integration.category}</span>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => router.push(`/integrations/${integration.id}`)}
                  >
                    <Link2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Common integration tasks</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm">
              Add Integration
            </Button>
            <Button variant="outline" size="sm">
              Sync All
            </Button>
            <Button variant="outline" size="sm">
              View Logs
            </Button>
            <Button variant="outline" size="sm">
              API Documentation
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
