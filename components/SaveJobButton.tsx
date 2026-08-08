'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCandidateAuth } from '@/context/CandidateAuthContext';
import { Save, Bookmark } from 'lucide-react';

export default function SaveJobButton({ jobId }: { jobId: string }) {
  const router = useRouter();
  const { candidate } = useCandidateAuth();
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (candidate) {
      fetch(`/api/candidate-auth/saved-jobs?candidateAccountId=${candidate.id}`)
        .then(res => res.json())
        .then(data => {
          if (Array.isArray(data)) {
            setSaved(data.some((job: any) => job.requirementId === jobId));
          }
        })
        .catch(console.error);
    }
  }, [candidate, jobId]);

  const handleSave = async () => {
    if (!candidate) { router.push('/careers/login'); return; }
    setSaving(true);
    try {
      if (saved) {
        const res = await fetch(`/api/candidate-auth/saved-jobs?jobId=${jobId}&candidateAccountId=${candidate.id}`, {
          method: 'DELETE'
        });
        if (res.ok) {
          setSaved(false);
        } else {
          const data = await res.json().catch(() => ({}));
          alert(`Failed to remove saved job: ${data.error || res.statusText}`);
        }
      } else {
        const res = await fetch('/api/candidate-auth/saved-jobs', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ jobId, candidateAccountId: candidate.id })
        });
        if (res.ok || res.status === 409) {
          setSaved(true);
        } else {
          const data = await res.json().catch(() => ({}));
          alert(`Failed to save job: ${data.error || res.statusText}`);
        }
      }
    } catch (e: any) {
      alert(`Error saving job: ${e.message}`);
    } finally {
      setSaving(false);
    }
  };

  return (
    <button
      onClick={handleSave}
      disabled={saving}
      style={{
        background: saved ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.02)',
        color: saved ? '#00B4D8' : '#cbd5e1',
        border: `1px solid ${saved ? 'rgba(56,189,248,0.4)' : 'rgba(255,255,255,0.1)'}`,
        borderRadius: 12, padding: '1rem',
        fontWeight: 600, fontSize: '1rem', cursor: saving ? 'default' : 'pointer',
        transition: 'all 0.2s', display: 'flex', alignItems: 'center', gap: 8
      }}
      className={!saved && !saving ? "hover:bg-white/5 hover:border-white/20" : "hover:opacity-80"}
    >
      <Bookmark size={20} fill={saved ? '#00B4D8' : 'none'} color={saved ? '#00B4D8' : '#cbd5e1'} />
      {saved ? 'Saved' : saving ? 'Saving...' : 'Save Job'}
    </button>
  );
}
