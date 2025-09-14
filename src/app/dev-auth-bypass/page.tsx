'use client';

import { useEffect } from 'react';
import { useAuth } from '@/lib/auth-context';
import { useRouter } from 'next/navigation';

export default function DevAuthBypass() {
  const { enableDevBypass } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Only work in development
    if (process.env.NODE_ENV !== 'development') {
      router.push('/');
      return;
    }

    // Enable development bypass and redirect
    setTimeout(() => {
      enableDevBypass();
      router.push('/');
    }, 1000);
  }, [enableDevBypass, router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-8 text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          Development Auth Bypass
        </h1>
        <p className="text-gray-600 mb-4">
          Setting up test authentication for design review...
        </p>
        <div className="animate-pulse">
          <div className="h-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded"></div>
        </div>
        <p className="text-xs text-gray-500 mt-4">
          This page only works in development mode
        </p>
      </div>
    </div>
  );
}