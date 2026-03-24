export const formatValue = (value, unit) => {
  if (value === null || value === undefined || value === '') return 'N/A';
  
  switch (unit) {
    case 'currency':
      return '$' + Number(value).toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 2 });
    case 'percent':
      return value + '%';
    case 'number':
      return Number(value).toLocaleString('en-US');
    case 'days':
      return value + ' days';
    case 'ratio':
      return value + ':1';
    default:
      return String(value);
  }
};

export const getScoreColor = (score) => {
  if (score === null || score === undefined) return '#64748b';
  if (score >= 90) return '#10b981'; // Green
  if (score >= 70) return '#f59e0b'; // Yellow
  return '#ef4444'; // Red
};

export const calculateScore = (value, benchmark) => {
  if (value === null || value === undefined || value === '') return null;
  if (benchmark === null || benchmark === undefined || benchmark === 0) return null;
  return Math.round((value / benchmark) * 100);
};

export const getProfitColor = (profitIndex) => {
  if (profitIndex === null || profitIndex === undefined) return '#64748b';
  if (profitIndex >= 80) return '#10b981'; // Green - high profit
  if (profitIndex >= 60) return '#f59e0b'; // Yellow - medium profit
  return '#ef4444'; // Red - low profit
};

export const getTypeIcon = (type) => {
  const icons = {
    ophthalmology: '👁️',
    optometry: '👓',
    general: '🏥',
    retina: '🔬',
    glaucoma: '💧',
    pediatric: '👶',
  };
  return icons[type?.toLowerCase()] || '🏥';
};

export const getTypeColor = (type) => {
  const colors = {
    ophthalmology: '#6366f1',
    optometry: '#8b5cf6',
    general: '#64748b',
    retina: '#10b981',
    glaucoma: '#3b82f6',
    pediatric: '#f59e0b',
  };
  return colors[type?.toLowerCase()] || '#64748b';
};

export const searchKCN = (query) => {
  if (!query || typeof query !== 'string') {
    return "Please enter a valid search query.";
  }
  
  const q = query.toLowerCase().trim();
  
  if (q === '') {
    return "Please enter a valid search query.";
  }
  
  const responses = {
    benchmark: "Benchmarks help you compare your practice metrics against industry standards. Key metrics include collection rate (benchmark: 98%), denial rate (benchmark: <5%), and days in A/R (benchmark: 30 days).",
    revenue: "Revenue optimization opportunities include: Premium IOL conversion (can add $145K/year), A/R recovery (up to $89K), and optical capture improvement (up to $67K/year).",
    competitor: "Competitive intelligence helps you understand local market positioning. Track ratings, services, and marketing strategies of nearby practices.",
    cpt: "CPT codes determine reimbursement rates. Common ophthalmology codes include 66984 (cataract surgery), 92014 (comprehensive eye exam), and 67028 (intravitreal injection).",
    staffing: "Optimal staffing ratios: 1 surgical coordinator per 2.5 surgeons, 2 techs per provider, 1 billing specialist per $1M revenue.",
    marketing: "Digital marketing benchmarks: Google Ads CPC $2.85, Facebook CPC $1.72, Instagram CPC $1.28. Target 3-5% conversion rate.",
    patient: "Patient satisfaction benchmark: 92%. Key drivers include wait time (<15 min), staff friendliness, and clear communication.",
    ar: "A/R management: Target <30 days in A/R, <12% over 90 days. Work claims within 48 hours of denial.",
    denial: "Denial rate benchmark: <5%. Common causes: coding errors, eligibility issues, missing authorizations.",
    collection: "Collection rate benchmark: 98%. Improve with point-of-service collection and clear payment policies.",
  };

  for (const [keyword, response] of Object.entries(responses)) {
    if (q.includes(keyword)) {
      return response;
    }
  }

  return "I can help you with benchmarks, revenue optimization, competitors, CPT codes, staffing, marketing, patient satisfaction, A/R management, denials, and collections. What would you like to know?";
};

export const exportToCSV = (data, filename) => {
  if (!data || !Array.isArray(data) || data.length === 0) {
    console.error('No data to export');
    return;
  }

  try {
    const headers = Object.keys(data[0]);
    const csvContent = [
      headers.join(','),
      ...data.map(row => 
        headers.map(header => {
          const value = row[header];
          if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
            return `"${value.replace(/"/g, '""')}"`;
          }
          return value ?? '';
        }).join(',')
      )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', filename || 'export.csv');
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Error exporting CSV:', error);
  }
};
