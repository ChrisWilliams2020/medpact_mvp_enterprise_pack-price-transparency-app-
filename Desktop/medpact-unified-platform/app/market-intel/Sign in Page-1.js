// app/auth/signin/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter, useSearchParams } from 'next/navigation';

export default function SignInPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  
  const { signIn } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const message = searchParams.get('message');
    if (message === 'check-email') {
      setError(null);
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { error } = await signIn(email, password);
      
      if (error) {
        setError(error.message);
      } else {
        router.push('/dashboard');
      }
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async () => {
    setEmail('demo@medpact.com');
    setPassword('demo123456');
    
    // Auto-submit after setting demo credentials
    setTimeout(() => {
      handleSubmit(new Event('submit') as any);
    }, 100);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <div className="mx-auto h-12 w-12 flex items-center justify-center bg-blue-100 rounded-full">
            <span className="text-2xl">🏥</span>
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Sign in to MedPact
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Healthcare Intelligence Platform
          </p>
        </div>
        
        {searchParams.get('message') === 'check-email' && (
          <div className="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded-lg text-sm">
            <div className="flex items-center">
              <span className="mr-2">📧</span>
              Please check your email for a verification link before signing in.
            </div>
          </div>
        )}
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              <div className="flex items-center">
                <span className="mr-2">⚠️</span>
                {error}
              </div>
            </div>
          )}
          
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Enter your email"
              />
            </div>
            
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="appearance-none relative block w-full px-3 py-2 pr-10 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  <span className="text-gray-400 hover:text-gray-600">
                    {showPassword ? '🙈' : '👁️'}
                  </span>
                </button>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                Remember me
              </label>
            </div>

            <div className="text-sm">
              <a href="/auth/forgot-password" className="font-medium text-blue-600 hover:text-blue-500">
                Forgot your password?
              </a>
            </div>
          </div>

          <div className="space-y-3">
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Signing in...
                </div>
              ) : (
                'Sign in'
              )}
            </button>

            <button
              type="button"
              onClick={handleDemoLogin}
              className="w-full flex justify-center py-2 px-4 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            >
              <span className="mr-2">🚀</span>
              Try Demo Account
            </button>
          </div>

          <div className="text-center">
            <span className="text-sm text-gray-600">
              Don't have an account?{' '}
              <a href="/auth/signup" className="font-medium text-blue-600 hover:text-blue-500">
                Sign up here
              </a>
            </span>
          </div>
        </form>

        {/* Demo Credentials Info */}
        <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <h4 className="text-sm font-medium text-blue-900 mb-2 flex items-center">
            <span className="mr-2">🧪</span>
            Demo Credentials
          </h4>
          <div className="text-xs text-blue-700 space-y-1">
            <div>📧 Email: demo@medpact.com</div>
            <div>🔑 Password: demo123456</div>
            <div className="text-blue-600 mt-2">Click "Try Demo Account" for instant access</div>
          </div>
        </div>
      </div>
    </div>
  );
}