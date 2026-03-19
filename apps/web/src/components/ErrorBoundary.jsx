import React from 'react';
import PropTypes from 'prop-types';

// =============================================
// ERROR BOUNDARY COMPONENT
// Catches JavaScript errors anywhere in child component tree
// Prevents entire app from crashing due to component errors
// =============================================

const COLORS = {
  primary: '#059669',
  danger: '#EF4444',
  text: '#1E293B',
  textSecondary: '#64748B',
  border: '#E2E8F0',
  background: '#F8FAFC',
  white: '#FFFFFF',
};

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      hasError: false, 
      error: null, 
      errorInfo: null 
    };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render shows the fallback UI
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // Log the error to console for debugging
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    this.setState({ errorInfo });
    
    // In production, you would log to an error reporting service
    // e.g., Sentry, LogRocket, etc.
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  render() {
    if (this.state.hasError) {
      const { fallback, componentName } = this.props;
      
      // If a custom fallback is provided, use it
      if (fallback) {
        return fallback;
      }

      // Default error UI
      return (
        <div style={{
          padding: '40px',
          textAlign: 'center',
          background: COLORS.white,
          borderRadius: '16px',
          border: `1px solid ${COLORS.border}`,
          margin: '20px',
        }}>
          <div style={{
            width: '60px',
            height: '60px',
            background: '#FEE2E2',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 20px auto',
            fontSize: '28px',
          }}>
            ⚠️
          </div>
          
          <h2 style={{
            fontSize: '20px',
            fontWeight: '600',
            color: COLORS.text,
            margin: '0 0 8px 0',
          }}>
            {componentName ? `Error in ${componentName}` : 'Something went wrong'}
          </h2>
          
          <p style={{
            fontSize: '14px',
            color: COLORS.textSecondary,
            margin: '0 0 20px 0',
            maxWidth: '400px',
            marginLeft: 'auto',
            marginRight: 'auto',
          }}>
            An unexpected error occurred. Please try again or contact support if the problem persists.
          </p>

          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
            <button
              onClick={this.handleRetry}
              style={{
                padding: '10px 24px',
                background: COLORS.primary,
                color: COLORS.white,
                border: 'none',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
              onMouseOver={(e) => e.target.style.opacity = '0.9'}
              onMouseOut={(e) => e.target.style.opacity = '1'}
            >
              Try Again
            </button>
            
            <button
              onClick={() => window.location.reload()}
              style={{
                padding: '10px 24px',
                background: 'transparent',
                color: COLORS.text,
                border: `1px solid ${COLORS.border}`,
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: '500',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
              onMouseOver={(e) => e.target.style.background = COLORS.background}
              onMouseOut={(e) => e.target.style.background = 'transparent'}
            >
              Reload Page
            </button>
          </div>

          {/* Show error details in development */}
          {process.env.NODE_ENV === 'development' && this.state.error && (
            <details style={{
              marginTop: '24px',
              padding: '16px',
              background: '#FEF2F2',
              borderRadius: '8px',
              textAlign: 'left',
              maxWidth: '600px',
              marginLeft: 'auto',
              marginRight: 'auto',
            }}>
              <summary style={{
                cursor: 'pointer',
                fontSize: '13px',
                fontWeight: '600',
                color: COLORS.danger,
                marginBottom: '8px',
              }}>
                Error Details (Development Only)
              </summary>
              <pre style={{
                fontSize: '12px',
                color: '#991B1B',
                overflow: 'auto',
                margin: 0,
                padding: '12px',
                background: '#FEE2E2',
                borderRadius: '4px',
              }}>
                {this.state.error.toString()}
                {this.state.errorInfo && this.state.errorInfo.componentStack}
              </pre>
            </details>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}

ErrorBoundary.propTypes = {
  children: PropTypes.node.isRequired,
  fallback: PropTypes.node,
  componentName: PropTypes.string,
};

ErrorBoundary.defaultProps = {
  fallback: null,
  componentName: '',
};

export default ErrorBoundary;
