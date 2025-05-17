'use client';

import AuthProvider from './SessionProvider';

export function Providers({ children }) {
  return (
    <AuthProvider>
      {children}
    </AuthProvider>
  );
} 