// components/PDFExportButton.tsx
'use client';      }    } catch (error) {      console.error('PDF export failed:', error);      alert('Failed to generate PDF. Please try again.');    } finally {      setIsExporting(false);    }  };  const getButtonStyles = () => {    const baseStyles = "inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors";        if (variant === 'primary') {      return `${baseStyles} text-white bg-blue-600 hover:bg-blue-700 focus:ring-blue-500 disabled:bg-blue-400`;    } else {      return `${baseStyles} text-blue-700 bg-blue-100 hover:bg-blue-200 focus:ring-blue-500 disabled:bg-blue-50`;    }  };  const getLabel = () => {    if (label) return label;        switch (type) {      case 'market-intelligence':        return 'Export Market Report';      case 'negotiation-playbook':        return 'Generate Playbook PDF';      case 'practice-dashboard':        return 'Export Dashboard';      default:        return 'Export PDF';    }  };  return (    <button      onClick={handleExport}      disabled={isExporting}      className={getButtonStyles()}    >      {isExporting ? (        <>          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>          Generating PDF...        </>      ) : (        <>          <span className="mr-2">📄</span>          {getLabel()}        </>      )}    </button>  );}

import { useState } from 'react';
import { exportMarketIntelligenceReport, exportNegotiationPlaybook, MarketIntelligenceReport } from '@/lib/pdf-export';

interface PDFExportButtonProps {
  type: 'market-intelligence' | 'negotiation-playbook' | 'practice-dashboard';
  data: any;
  label?: string;
  variant?: 'primary' | 'secondary';
}

export default function PDFExportButton({ 
  type, 
  data, 
  label,
  variant = 'primary' 
}: PDFExportButtonProps) {
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async () => {
    setIsExporting(true);
    
    try {
      switch (type) {
        case 'market-intelligence':
          await exportMarketIntelligenceReport(data as MarketIntelligenceReport);
          break;
        case 'negotiation-playbook':
          await exportNegotiationPlaybook(
            data.payerName,
            data.practiceData,
            data.marketData,
            data.strategies
          );
          break;
        case 'practice-dashboard':
          // Implementation for practice dashboard export
          break;
      }
    } catch (error) {
      console.error('PDF export failed:', error);
      alert('Failed to generate PDF. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  const getButtonStyles = () => {
    const baseStyles = "inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors";
    
    if (variant === 'primary') {
      return `${baseStyles} text-white bg-blue-600 hover:bg-blue-700 focus:ring-blue-500 disabled:bg-blue-400`;
    } else {
      return `${baseStyles} text-blue-700 bg-blue-100 hover:bg-blue-200 focus:ring-blue-500 disabled:bg-blue-50`;
    }
  };

  const getLabel = () => {
    if (label) return label;
    
    switch (type) {
      case 'market-intelligence':
        return 'Export Market Report';
      case 'negotiation-playbook':
        return 'Generate Playbook PDF';
      case 'practice-dashboard':
        return 'Export Dashboard';
      default:
        return 'Export PDF';
    }
  };

  return (
    <button
      onClick={handleExport}
      disabled={isExporting}
      className={getButtonStyles()}
    >
      {isExporting ? (
        <>
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
          Generating PDF...
        </>
      ) : (
        <>
          <span className="mr-2">📄</span>
          {getLabel()}
        </>
      )}
    </button>
  );
}