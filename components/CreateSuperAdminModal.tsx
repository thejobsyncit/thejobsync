import { useState } from 'react';
import { X, Mail, Lock, User as UserIcon } from 'lucide-react';

interface CreateSuperAdminModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CreateSuperAdminModal({ isOpen, onClose }: CreateSuperAdminModalProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    setMessage('');

    try {
      const res = await fetch('/api/auth/register-superadmin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setStatus('success');
        setMessage('Super Admin account created successfully! You can now log in.');
        setTimeout(() => {
          onClose();
          setStatus('idle');
          setMessage('');
          setName('');
          setEmail('');
          setPassword('');
        }, 3000);
      } else {
        setStatus('error');
        setMessage(data.error || 'Failed to create account.');
      }
    } catch (error) {
      setStatus('error');
      setMessage('An error occurred. Please try again.');
    }
  };

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.5)', backdropFilter: 'blur(4px)'
    }}>
      <div className="glass animate-scale-in" style={{
        width: '100%', maxWidth: 440, padding: '2rem', position: 'relative', margin: '1rem',
        backgroundColor: 'var(--card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)'
      }}>
        <button
          onClick={onClose}
          style={{
            position: 'absolute', right: '1rem', top: '1rem', background: 'none', border: 'none',
            color: 'var(--muted)', cursor: 'pointer', padding: '0.25rem'
          }}
        >
          <X size={20} />
        </button>

        <h2 style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--foreground)', marginBottom: '0.5rem' }}>
          Create Super Admin
        </h2>
        <p style={{ fontSize: '0.875rem', color: 'var(--muted-foreground)', marginBottom: '1.5rem' }}>
          Initialize the system by creating the first Super Admin account.
        </p>

        {status === 'success' ? (
          <div style={{
            padding: '1rem', background: 'rgba(34, 197, 94, 0.1)', border: '1px solid rgba(34, 197, 94, 0.2)',
            borderRadius: 'var(--radius-md)', color: '#22c55e', fontSize: '0.875rem', textAlign: 'center'
          }}>
            {message}
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '1rem' }}>
              <label className="label">Full Name</label>
              <div style={{ position: 'relative' }}>
                <UserIcon size={16} style={{
                  position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--muted)'
                }} />
                <input
                  type="text"
                  className="input"
                  style={{ paddingLeft: '2.5rem' }}
                  placeholder="Enter full name"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  required
                />
              </div>
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <label className="label">Email Address</label>
              <div style={{ position: 'relative' }}>
                <Mail size={16} style={{
                  position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--muted)'
                }} />
                <input
                  type="email"
                  className="input"
                  style={{ paddingLeft: '2.5rem' }}
                  placeholder="admin@example.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <label className="label">Password</label>
              <div style={{ position: 'relative' }}>
                <Lock size={16} style={{
                  position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--muted)'
                }} />
                <input
                  type="password"
                  className="input"
                  style={{ paddingLeft: '2.5rem' }}
                  placeholder="Enter password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            {status === 'error' && (
              <div style={{
                padding: '0.75rem', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)',
                borderRadius: 'var(--radius-md)', color: '#f87171', fontSize: '0.875rem', marginBottom: '1rem'
              }}>
                {message}
              </div>
            )}

            <button
              type="submit"
              className="btn btn-primary"
              disabled={status === 'loading'}
              style={{ width: '100%', height: 44 }}
            >
              {status === 'loading' ? (
                <div className="spinner" style={{ width: 18, height: 18, borderColor: 'rgba(255,255,255,0.3)', borderTopColor: 'white' }} />
              ) : (
                'Create Account'
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
