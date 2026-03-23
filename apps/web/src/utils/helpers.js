// Helper Functions

import { KCN_KNOWLEDGE } from '../data/registration';

export const formatCurrency = (v) => v >= 1000000 ? `$${(v/1000000).toFixed(1)}M` : v >= 1000 ? `$${(v/1000).toFixed(0)}K` : `$${v}`;

export const formatValue = (v, u) => u === 'USD' ? formatCurrency(v) : u === '%' ? `${v}%` : `${v} ${u}`;

export const getScoreColor = (s) => s >= 90 ? '#10b981' : s >= 70 ? '#f59e0b' : '#ef4444';

export const calculateScore = (v, b) => v && b ? Math.min(100, Math.round((v/b)*100)) : null;

export const getProfitColor = (index) => index >= 90 ? '#10b981' : index >= 80 ? '#3b82f6' : index >= 70 ? '#f59e0b' : '#ef4444';

export const getTypeIcon = (type) => type === 'ophthalmology' ? '🔬' : type === 'optometry' ? '👓' : '🏥';

export const getTypeColor = (type) => type === 'ophthalmology' ? '#8b5cf6' : type === 'optometry' ? '#3b82f6' : '#10b981';

export const searchKCN = (query) => {
  const q = query.toLowerCase();
  for (const category of Object.values(KCN_KNOWLEDGE)) {
    for (const [key, value] of Object.entries(category)) {
      if (q.includes(key) || key.split(' ').some(word => q.includes(word))) {
        return value;
      }
    }
  }
  return "I can help with metrics (collection rate, EBITDA, denial rate), CPT codes (cataract, injection, glaucoma), innovations (LAL, Faricimab, iStent), competitors, and heat map analysis. What would you like to know?";
};

export const exportToCSV = (data, filename) => {
  if (!data || data.length === 0) return;
  const headers = Object.keys(data[0]);
  const csv = [
    headers.join(','),
    ...data.map(row => headers.map(h => JSON.stringify(row[h] || '')).join(','))
  ].join('\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
};