```typescript
import { useCallback, useState } from 'react';

export type AlertSeverity = 'critical' | 'high' | 'medium' | 'low' | 'info';

export type AlertRow = {
  id: string;
  alertType: string;
  cpt?: string;
  payer?: string;
  account?: string;
  severity: AlertSeverity | string;
  variancePct?: number;
  estLoss?: number;
  detected?: string;
  claims?: number;
};

export type CPTRow = {
  cpt: string;
  description: string;
  claims: number;
  avgPaid: number;
  nationalAvg?: number;
};

export type TaskRow = {
  id: string;
  title: string;
  assigned?: string;
  due?: string;
  status?: string;
  alertId?: string;
};

export default function useAlerts() {
  const [alerts, setAlerts] = useState<AlertRow[]>([
    { id: 'A-001', alertType: 'Underpaid CPT', cpt: '92014', payer: 'VSP', account: 'MedPact HQ', severity: 'Critical', variancePct: -12.3, estLoss: 1440, detected: '2026-07-08', claims: 120 },
    { id: 'A-002', alertType: 'Volume Drop', cpt: '67028', payer: 'All', account: 'Westside Eye', severity: 'High', variancePct: -45.1, estLoss: 5200, detected: '2026-07-07', claims: 45 },
  ]);

  const [cpts, setCpts] = useState<CPTRow[]>([
    { cpt: '92014', description: 'Comprehensive eye exam', claims: 412, avgPaid: 95, nationalAvg: 110 },
    { cpt: '67028', description: 'Intravitreal injection', claims: 220, avgPaid: 114, nationalAvg: 130 },
  ]);

  const [tasks, setTasks] = useState<TaskRow[]>([
    { id: 'T-101', title: 'Review VSP underpayments for 92014', assigned: 'James Ortega', due: '2026-07-15', status: 'Assigned', alertId: 'A-001' },
    { id: 'T-102', title: 'Open contract discussion with Aetna', assigned: 'Dr. Chris Williams', due: '2026-07-20', status: 'New', alertId: 'A-003' },
  ]);

  const refresh = useCallback(async () => {
    // TODO: replace with API fetch: const res = await fetch('/api/alerts')
    setAlerts(prev => [...prev]);
    setCpts(prev => [...prev]);
    setTasks(prev => [...prev]);
  }, []);

  const addTask = useCallback((task: TaskRow) => {
    setTasks(prev => [task, ...prev]);
  }, []);

  return { alerts, cpts, tasks, refresh, addTask, setAlerts, setCpts, setTasks };
}
```