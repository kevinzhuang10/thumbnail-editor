#!/bin/bash

# Supabase Auth Setup Script
# Run this script to quickly set up Supabase authentication in a Next.js project

set -e

echo "🚀 Setting up Supabase Authentication..."

# Check if we're in a Next.js project
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. Run this script from your project root."
    exit 1
fi

# Install Supabase client
echo "📦 Installing @supabase/supabase-js..."
npm install @supabase/supabase-js

# Create lib directory if it doesn't exist
mkdir -p src/lib

# Create Supabase client utility
echo "🔧 Creating Supabase client utility..."
cat > src/lib/supabase.ts << 'EOF'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
EOF

# Create auth context
echo "🔧 Creating authentication context..."
cat > src/lib/auth-context.tsx << 'EOF'
'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from './supabase';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signIn: (email: string) => Promise<{ error: any }>;
  signOut: () => Promise<{ error: any }>;
  verifyOtp: (email: string, token: string) => Promise<{ error: any }>;
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
    return await supabase.auth.signInWithOtp({ email });
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

  const value = {
    user,
    session,
    loading,
    signIn,
    signOut,
    verifyOtp,
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
EOF

# Create components directory if it doesn't exist
mkdir -p src/components

# Create AuthForm component
echo "🔧 Creating OTP authentication form..."
cat > src/components/AuthForm.tsx << 'EOF'
'use client';

import { useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { Mail, ArrowRight, Loader2, Check } from 'lucide-react';

export default function AuthForm() {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState<'email' | 'otp'>('email');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const { signIn, verifyOtp } = useAuth();

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim()) {
      setError('Please enter your email address');
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    const { error } = await signIn(email);

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      setSuccess('Check your email for the verification code!');
      setStep('otp');
      setLoading(false);
    }
  };

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!otp.trim()) {
      setError('Please enter the verification code');
      return;
    }

    setLoading(true);
    setError(null);

    const { error } = await verifyOtp(email, otp);

    if (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  const handleBackToEmail = () => {
    setStep('email');
    setOtp('');
    setError(null);
    setSuccess(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome
          </h1>
          <p className="text-gray-600">
            Sign in to access your app
          </p>
        </div>

        {step === 'email' ? (
          <form onSubmit={handleEmailSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-900 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  disabled={loading}
                  required
                />
              </div>
            </div>

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                {error}
              </div>
            )}

            {success && (
              <div className="p-3 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm flex items-center">
                <Check className="w-4 h-4 mr-2" />
                {success}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-medium"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Sending...</span>
                </>
              ) : (
                <>
                  <span>Send Magic Link</span>
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>
        ) : (
          <form onSubmit={handleOtpSubmit} className="space-y-6">
            <div>
              <label htmlFor="otp" className="block text-sm font-medium text-gray-900 mb-2">
                Verification Code
              </label>
              <input
                type="text"
                id="otp"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="Enter 6-digit code"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-center text-2xl font-mono tracking-widest"
                disabled={loading}
                maxLength={6}
                required
              />
              <p className="text-sm text-gray-500 mt-2">
                Check your email <strong>{email}</strong> for the verification code
              </p>
            </div>

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                {error}
              </div>
            )}

            <div className="space-y-3">
              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-medium"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Verifying...</span>
                  </>
                ) : (
                  <>
                    <span>Verify Code</span>
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={handleBackToEmail}
                disabled={loading}
                className="w-full px-4 py-2 text-sm text-gray-600 hover:text-gray-800 transition-colors"
              >
                Back to email
              </button>
            </div>
          </form>
        )}

        <div className="mt-8 pt-6 border-t border-gray-200 text-center">
          <p className="text-xs text-gray-500">
            We'll send you a secure code to verify your email address
          </p>
        </div>
      </div>
    </div>
  );
}
EOF

# Add environment variables to .env.local if it doesn't exist
if [ ! -f ".env.local" ]; then
    echo "📝 Creating .env.local with Supabase variables..."
    cat > .env.local << 'EOF'
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
EOF
else
    echo "📝 Adding Supabase variables to existing .env.local..."
    if ! grep -q "NEXT_PUBLIC_SUPABASE_URL" .env.local; then
        echo "" >> .env.local
        echo "# Supabase Configuration" >> .env.local
        echo "NEXT_PUBLIC_SUPABASE_URL=your_supabase_url_here" >> .env.local
        echo "NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here" >> .env.local
    fi
fi

echo ""
echo "✅ Supabase authentication setup complete!"
echo ""
echo "📋 Next steps:"
echo "1. Create a Supabase project at https://supabase.com"
echo "2. Update your .env.local with your actual Supabase credentials"
echo "3. Wrap your app with AuthProvider in your layout.tsx"
echo "4. Use useAuth() hook in your components"
echo ""
echo "🔧 Quick commands:"
echo "  npx supabase login                    # Login to Supabase"
echo "  npx supabase projects list            # List your projects"
echo "  npx supabase projects create my-app   # Create new project"
echo ""
echo "Happy coding! 🚀"