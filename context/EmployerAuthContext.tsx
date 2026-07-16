'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface Employer {
  id: string;
  companyName: string;
  email: string;
  industry: string;
  contactPerson: string;
  contactPhone: string;
  address: string;
  about: string;
  gstNumber: string;
  logoUrl?: string;
  website?: string;
  isVerified: boolean;
  subscriptions?: any[];
}

interface EmployerAuthContextType {
  employer: Employer | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  refresh: () => Promise<void>;
}

const EmployerAuthContext = createContext<EmployerAuthContextType | null>(null);

export function EmployerAuthProvider({ children }: { children: ReactNode }) {
  const [employer, setEmployer] = useState<Employer | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchMe = async () => {
    try {
      const res = await fetch('/api/employer/me');
      if (res.ok) {
        const data = await res.json();
        setEmployer(data.employer);
      } else {
        setEmployer(null);
      }
    } catch {
      setEmployer(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMe();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const res = await fetch('/api/employer/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) return { success: false, error: data.error };
      setEmployer(data.employer);
      return { success: true };
    } catch {
      return { success: false, error: 'Network error. Please try again.' };
    }
  };

  const logout = async () => {
    await fetch('/api/employer/me', { method: 'DELETE' });
    setEmployer(null);
  };

  const refresh = async () => {
    await fetchMe();
  };

  return (
    <EmployerAuthContext.Provider value={{ employer, isLoading, login, logout, refresh }}>
      {children}
    </EmployerAuthContext.Provider>
  );
}

export function useEmployerAuth() {
  const ctx = useContext(EmployerAuthContext);
  if (!ctx) throw new Error('useEmployerAuth must be used within EmployerAuthProvider');
  return ctx;
}
