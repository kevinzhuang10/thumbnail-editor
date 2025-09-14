'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from './supabase';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signIn: (email: string) => Promise<{ error: unknown }>;
  signOut: () => Promise<{ error: unknown }>;
  verifyOtp: (email: string, token: string) => Promise<{ error: unknown }>;
  enableDevBypass: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    };

    getSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string) => {
    return await supabase.auth.signInWithOtp({ 
      email,
      options: {
        shouldCreateUser: true,
        data: {}
      }
    });
  };

  const signOut = async () => {
    return await supabase.auth.signOut();
  };

  const verifyOtp = async (email: string, token: string) => {
    return await supabase.auth.verifyOtp({
      email,
      token,
      type: 'email'
    });
  };

  const enableDevBypass = () => {
    // Only work in development
    if (process.env.NODE_ENV !== 'development') {
      console.warn('Dev bypass only works in development mode');
      return;
    }

    // Create a mock user for design review
    const mockUser: User = {
      id: 'dev-user-123',
      email: 'test@designreview.dev',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      aud: 'authenticated',
      role: 'authenticated',
      app_metadata: {},
      user_metadata: { name: 'Design Review User' }
    } as User;

    const mockSession: Session = {
      access_token: 'mock-token',
      refresh_token: 'mock-refresh',
      expires_in: 3600,
      expires_at: Math.floor(Date.now() / 1000) + 3600,
      token_type: 'bearer',
      user: mockUser
    };

    setUser(mockUser);
    setSession(mockSession);
    setLoading(false);
  };

  const value = {
    user,
    session,
    loading,
    signIn,
    signOut,
    verifyOtp,
    enableDevBypass,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}