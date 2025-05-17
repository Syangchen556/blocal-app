'use client';

import { SessionProvider } from 'next-auth/react';

export function AuthProvider({ children }) {
  return <SessionProvider>{children}</SessionProvider>;
}

export function Providers({ children }) {
  return (
    <AuthProvider>
      {children}
    </AuthProvider>
  );
} 