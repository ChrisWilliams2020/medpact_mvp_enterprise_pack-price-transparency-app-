import React, { createContext, useContext, useState, useEffect } from 'react';

/**
 * Authentication Context for MedPact
 * 
 * Supports two modes:
 * 1. Development: Uses a configurable practice ID (no authentication)
 * 2. Production: Uses Auth0 session from backend
 */

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authConfig, setAuthConfig] = useState({ enabled: false });

  useEffect(() => {
    // Fetch auth configuration and current user on mount
    async function init() {
      try {
        // Get auth config
        const configRes = await fetch('/auth/config');
        if (configRes.ok) {
          const config = await configRes.json();
          setAuthConfig(config);

          // If auth is enabled, try to get current user
          if (config.enabled) {
            const userRes = await fetch('/auth/me');
            if (userRes.ok) {
              const userData = await userRes.json();
              setUser(userData);
            }
          }
        }
      } catch (err) {
        console.warn('Auth init failed:', err);
      } finally {
        setLoading(false);
      }
    }
    init();
  }, []);

  const login = () => {
    // Redirect to backend login endpoint
    window.location.href = '/auth/login';
  };

  const logout = () => {
    // Redirect to backend logout endpoint
    window.location.href = '/auth/logout';
  };

  // Get practice ID for API calls
  const getPracticeId = () => {
    if (user?.practice_id) {
      return user.practice_id;
    }
    // Development fallback - read from localStorage or use default
    return localStorage.getItem('dev_practice_id') || 'practice-001';
  };

  // Set practice ID for development mode
  const setDevPracticeId = (practiceId) => {
    localStorage.setItem('dev_practice_id', practiceId);
  };

  const value = {
    user,
    loading,
    authEnabled: authConfig.enabled,
    login,
    logout,
    getPracticeId,
    setDevPracticeId,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}

/**
 * Hook to get headers for authenticated API requests
 */
export function useAuthHeaders() {
  const { user, getPracticeId } = useAuth();
  
  return {
    'X-Practice-Id': getPracticeId(),
    // Add Authorization header if we have a token (for API-to-API calls)
    ...(user?.token ? { Authorization: `Bearer ${user.token}` } : {}),
  };
}

export default AuthContext;
