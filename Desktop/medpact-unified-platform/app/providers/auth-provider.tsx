'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/lib/db/supabase';
import { BiometricAuth } from '@/lib/auth/biometric';
import { User } from '@supabase/supabase-js';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signInWithBiometric: () => Promise<void>;
  signOut: () => Promise<void>;
  enableBiometric: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
  };

  const signInWithBiometric = async () => {
    if (!user) {
      // Check for saved user ID in localStorage
      const savedUserId = localStorage.getItem('medpact_user_id');
      if (!savedUserId) throw new Error('No biometric credentials found');

      const authenticated = await BiometricAuth.authenticate(savedUserId);
      if (!authenticated) throw new Error('Biometric authentication failed');

      // Refresh session
      const { error } = await supabase.auth.refreshSession();
      if (error) throw error;
    } else {
      const authenticated = await BiometricAuth.authenticate(user.id);
      if (!authenticated) throw new Error('Biometric authentication failed');
    }
  };

  const enableBiometric = async (): Promise<boolean> => {
    if (!user) return false;
    const success = await BiometricAuth.register(user.id, user.email!);
    if (success) {
      localStorage.setItem('medpact_user_id', user.id);
      await supabase
        .from('users')
        .update({ biometric_enabled: true })
        .eq('id', user.id);
    }
    return success;
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    localStorage.removeItem('medpact_user_id');
  };

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      signIn,
      signInWithBiometric,
      signOut,
      enableBiometric
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};