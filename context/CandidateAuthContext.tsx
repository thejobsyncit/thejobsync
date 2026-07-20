'use client';

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import CompleteProfileModal from '@/components/careers/CompleteProfileModal';

interface CandidateUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  headline?: string;
  skills: string;
  experience?: string;
  education?: string;
  languages?: string;
  location?: string;
  currentRole?: string;
  currentCompany?: string;
  expectedSalary?: string;
}

interface CandidateAuthContextType {
  candidate: CandidateUser | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  updateProfile: (data: Partial<CandidateUser>) => void;
  isAuthenticated: boolean;
  appliedJobs: Set<string>;
  applyToJob: (jobId: string) => Promise<boolean>;
  requireCompleteProfile: (onComplete: () => void) => void;
}

const CandidateAuthContext = createContext<CandidateAuthContextType | undefined>(undefined);

export function CandidateAuthProvider({ children }: { children: ReactNode }) {
  const [candidate, setCandidate] = useState<CandidateUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [appliedJobs, setAppliedJobs] = useState<Set<string>>(new Set());
  
  const [showCompleteProfileModal, setShowCompleteProfileModal] = useState(false);
  const [onProfileCompleteCb, setOnProfileCompleteCb] = useState<(() => void) | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem('candidate_user');
    if (stored) {
      try { 
        const parsed = JSON.parse(stored);
        setCandidate(parsed);
        // Fetch latest profile from DB to ensure it's up to date
        fetch(`/api/candidate-auth/profile?id=${parsed.id}`)
          .then(res => res.json())
          .then(data => {
            if (!data.error) {
              setCandidate(data);
              try {
                localStorage.setItem('candidate_user', JSON.stringify(data));
              } catch (e) {
                try {
                  const slim = { ...data, photoUrl: '', resumeUrl: '' };
                  localStorage.setItem('candidate_user', JSON.stringify(slim));
                } catch(e2) {}
              }
            } else {
              setCandidate(null);
              localStorage.removeItem('candidate_user');
            }
          })
          .catch(() => {
             setCandidate(null);
             localStorage.removeItem('candidate_user');
          });
      } catch { 
        localStorage.removeItem('candidate_user'); 
      }
    }
    setIsLoading(false);
  }, []);

  const refreshApplications = useCallback(async (candId: string) => {
    try {
      const res = await fetch(`/api/candidate-auth/applications?candidateAccountId=${candId}`);
      if (res.ok) {
        const data = await res.json();
        const ids = new Set<string>(data.map((app: any) => app.requirementId));
        setAppliedJobs(ids);
      }
    } catch {}
  }, []);

  useEffect(() => {
    if (candidate) refreshApplications(candidate.id);
    else setAppliedJobs(new Set());
  }, [candidate, refreshApplications]);

  const login = useCallback(async (email: string, password: string) => {
    try {
      const res = await fetch('/api/candidate-auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) return { success: false, error: data.error || 'Login failed' };
      setCandidate(data);
      try {
        localStorage.setItem('candidate_user', JSON.stringify(data));
      } catch (e) {
        try {
          const slim = { ...data, photoUrl: '', resumeUrl: '' };
          localStorage.setItem('candidate_user', JSON.stringify(slim));
        } catch(e2) {}
      }
      refreshApplications(data.id);
      return { success: true };
    } catch {
      return { success: false, error: 'Network error. Please try again.' };
    }
  }, [refreshApplications]);

  const logout = useCallback(() => {
    setCandidate(null);
    setAppliedJobs(new Set());
    localStorage.removeItem('candidate_user');
  }, []);

  const updateProfile = useCallback((data: Partial<CandidateUser>) => {
    setCandidate(prev => {
      if (!prev) return prev;
      const updated = { ...prev, ...data };
      try {
        localStorage.setItem('candidate_user', JSON.stringify(updated));
      } catch (e) {
        // Handle localStorage quota limits
        try {
          const slim = { ...updated, photoUrl: '', resumeUrl: '' };
          localStorage.setItem('candidate_user', JSON.stringify(slim));
        } catch(e2) {}
      }
      return updated;
    });
  }, []);

  const applyToJob = useCallback(async (jobId: string) => {
    if (!candidate) return false;
    try {
      const res = await fetch('/api/candidate-auth/applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ candidateAccountId: candidate.id, requirementId: jobId })
      });
      if (res.ok || res.status === 409) {
        setAppliedJobs(prev => {
          const next = new Set(prev);
          next.add(jobId);
          return next;
        });
        return true;
      }
      return false;
    } catch { return false; }
  }, [candidate]);

  const requireCompleteProfile = useCallback((onComplete: () => void) => {
    if (!candidate) return;
    
    const hasLocation = !!candidate.location;
    const hasSkills = candidate.skills && candidate.skills !== '[]' && candidate.skills.length > 2;
    const hasExperience = !!candidate.experience && candidate.experience !== '[]';
    
    if (hasLocation && hasSkills && hasExperience) {
      onComplete();
    } else {
      setOnProfileCompleteCb(() => onComplete);
      setShowCompleteProfileModal(true);
    }
  }, [candidate]);

  return (
    <CandidateAuthContext.Provider value={{ candidate, isLoading, login, logout, updateProfile, isAuthenticated: !!candidate, appliedJobs, applyToJob, requireCompleteProfile }}>
      {children}
      {showCompleteProfileModal && (
        <CompleteProfileModal
          isOpen={showCompleteProfileModal}
          onClose={() => setShowCompleteProfileModal(false)}
          candidate={candidate}
          onSuccess={(updated) => {
            updateProfile(updated);
            setShowCompleteProfileModal(false);
            if (onProfileCompleteCb) onProfileCompleteCb();
          }}
        />
      )}
    </CandidateAuthContext.Provider>
  );
}

export function useCandidateAuth() {
  const ctx = useContext(CandidateAuthContext);
  if (!ctx) throw new Error('useCandidateAuth must be used within CandidateAuthProvider');
  return ctx;
}
