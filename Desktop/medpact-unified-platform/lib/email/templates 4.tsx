import * as React from 'react';

interface ContractRenewalEmailProps {
  payorName: string;
  expirationDate: string;
  daysRemaining: number;
  practiceName: string;
}

export const ContractRenewalEmail: React.FC<ContractRenewalEmailProps> = ({
  payorName,
  expirationDate,
  daysRemaining,
  practiceName,
}) => (
  <div style={{ fontFamily: 'Arial, sans-serif', maxWidth: '600px', margin: '0 auto' }}>
    <div style={{ backgroundColor: '#f59e0b', padding: '20px', textAlign: 'center' }}>
      <h1 style={{ color: 'white', margin: 0 }}>⚠️ Contract Renewal Alert</h1>
    </div>
    
    <div style={{ padding: '30px', backgroundColor: '#fff9ed', border: '2px solid #fbbf24' }}>
      <h2 style={{ color: '#92400e', marginTop: 0 }}>Action Required: Contract Expiring Soon</h2>
      
      <p style={{ fontSize: '16px', lineHeight: '1.6', color: '#333' }}>
        Dear {practiceName} Team,
      </p>
      
      <p style={{ fontSize: '16px', lineHeight: '1.6', color: '#333' }}>
        This is an automated reminder that your contract with <strong>{payorName}</strong> is 
        expiring in <strong style={{ color: '#dc2626' }}>{daysRemaining} days</strong>.
      </p>
      
      <div style={{ 
        backgroundColor: '#fef3c7', 
        padding: '20px', 
        borderRadius: '8px', 
        margin: '20px 0',
        border: '1px solid #fbbf24'
      }}>
        <p style={{ margin: '0 0 10px 0', fontSize: '14px', color: '#92400e' }}>
          <strong>Payor:</strong> {payorName}
        </p>
        <p style={{ margin: '0 0 10px 0', fontSize: '14px', color: '#92400e' }}>
          <strong>Expiration Date:</strong> {expirationDate}
        </p>
        <p style={{ margin: '0', fontSize: '14px', color: '#dc2626' }}>
          <strong>Days Remaining:</strong> {daysRemaining}
        </p>
      </div>
      
      <h3 style={{ color: '#92400e' }}>Recommended Actions:</h3>
      <ol style={{ lineHeight: '1.8', color: '#333' }}>
        <li>Review current contract terms and performance metrics</li>
        <li>Gather market rate comparisons for negotiation</li>
        <li>Schedule renewal discussion with payor representative</li>
        <li>Prepare documentation of quality metrics and patient outcomes</li>
      </ol>
      
      <div style={{ textAlign: 'center', margin: '30px 0' }}>
        <a 
          href="http://localhost:3000/contracts/renewals" 
          style={{
            backgroundColor: '#3b82f6',
            color: 'white',
            padding: '14px 28px',
            textDecoration: 'none',
            borderRadius: '6px',
            fontWeight: 'bold',
            display: 'inline-block'
          }}
        >
          View Contract Details →
        </a>
      </div>
    </div>
  </div>
);

interface PerformanceAlertEmailProps {
  metricName: string;
  currentValue: number;
  threshold: number;
  trend: 'improving' | 'declining';
  practiceName: string;
}

export const PerformanceAlertEmail: React.FC<PerformanceAlertEmailProps> = ({
  metricName,
  currentValue,
  threshold,
  trend,
  practiceName,
}) => (
  <div style={{ fontFamily: 'Arial, sans-serif', maxWidth: '600px', margin: '0 auto' }}>
    <div style={{ 
      backgroundColor: trend === 'declining' ? '#dc2626' : '#10b981', 
      padding: '20px', 
      textAlign: 'center' 
    }}>
      <h1 style={{ color: 'white', margin: 0 }}>
        {trend === 'declining' ? '📉' : '📈'} Performance Alert
      </h1>
    </div>
    
    <div style={{ padding: '30px', backgroundColor: '#fff' }}>
      <h2 style={{ color: '#1f2937', marginTop: 0 }}>
        {metricName} Update
      </h2>
      
      <p style={{ fontSize: '16px', lineHeight: '1.6', color: '#333' }}>
        Dear {practiceName} Team,
      </p>
      
      <p style={{ fontSize: '16px', lineHeight: '1.6', color: '#333' }}>
        Your <strong>{metricName}</strong> is currently at <strong>{currentValue}%</strong>, 
        which is {trend === 'declining' ? 'below' : 'above'} the target threshold of {threshold}%.
      </p>
      
      <div style={{ 
        backgroundColor: trend === 'declining' ? '#fee2e2' : '#d1fae5',
        padding: '20px',
        borderRadius: '8px',
        margin: '20px 0',
        border: `2px solid ${trend === 'declining' ? '#fca5a5' : '#6ee7b7'}`
      }}>
        <p style={{ margin: '0 0 10px 0', fontSize: '18px', fontWeight: 'bold' }}>
          Current: {currentValue}%
        </p>
        <p style={{ margin: '0', fontSize: '14px' }}>
          Target: {threshold}%
        </p>
      </div>
      
      <div style={{ textAlign: 'center', margin: '30px 0' }}>
        <a 
          href="http://localhost:3000/performance/dashboard" 
          style={{
            backgroundColor: '#3b82f6',
            color: 'white',
            padding: '14px 28px',
            textDecoration: 'none',
            borderRadius: '6px',
            fontWeight: 'bold',
            display: 'inline-block'
          }}
        >
          View Performance Dashboard →
        </a>
      </div>
    </div>
  </div>
);
