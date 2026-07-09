'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Briefcase, Building2, Zap, ArrowRight, Sun, Moon } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Register() {
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');

  useEffect(() => {
    const savedTheme = localStorage.getItem('portal_theme') as 'light' | 'dark';
    if (savedTheme) {
      setTheme(savedTheme);
    }
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    localStorage.setItem('portal_theme', nextTheme);
  };

  const isDark = theme === 'dark';

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: isDark ? '#0f172a' : '#f8fafc', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center', 
      fontFamily: 'var(--font-inter, Inter, sans-serif)', 
      padding: '1rem',
      position: 'relative',
      transition: 'background 0.3s ease'
    }}>

      {/* Floating Theme Toggle */}
      <button 
        onClick={toggleTheme}
        style={{
          position: 'absolute',
          top: '1.5rem',
          right: '1.5rem',
          background: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)',
          border: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)'}`,
          borderRadius: '50%',
          width: 44,
          height: 44,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: isDark ? '#f59e0b' : '#6366f1',
          cursor: 'pointer',
          boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
          zIndex: 100,
          transition: 'all 0.3s ease'
        }}
      >
        {isDark ? <Sun size={20} /> : <Moon size={20} />}
      </button>

      {/* Background Glow Elements */}
      {isDark && (
        <>
          <div style={{ position: 'absolute', width: 500, height: 500, background: 'radial-gradient(circle, rgba(56,189,248,0.1) 0%, rgba(0,0,0,0) 70%)', top: '10%', left: '10%', borderRadius: '50%', pointerEvents: 'none' }} />
          <div style={{ position: 'absolute', width: 500, height: 500, background: 'radial-gradient(circle, rgba(99,102,241,0.1) 0%, rgba(0,0,0,0) 70%)', bottom: '10%', right: '10%', borderRadius: '50%', pointerEvents: 'none' }} />
        </>
      )}

      <div 
        className="welcome-card animate-fade-in"
        style={{ 
          background: isDark ? 'rgba(30,41,59,0.7)' : 'rgba(255, 255, 255, 0.85)', 
          backdropFilter: 'blur(16px)', 
          border: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)'}`, 
          boxShadow: isDark ? '0 25px 50px -12px rgba(0,0,0,0.5)' : '0 20px 40px -12px rgba(0,0,0,0.08)', 
          zIndex: 10, 
          transition: 'all 0.3s ease'
        }}
      >

        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '2rem' }}>
          <img 
            src="/logooo.jpeg" 
            alt="JobSync Logo" 
            style={{ 
              height: 96, 
              width: 96, 
              objectFit: 'contain', 
              borderRadius: '50%', 
              boxShadow: '0 10px 25px rgba(0,0,0,0.15)',
              border: `2px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)'}`
            }} 
          />
        </div>

        <h1 className="welcome-title" style={{ 
          color: isDark ? 'white' : '#0f172a', 
        }}>Welcome to Our Portal</h1>
        <p className="welcome-subtitle" style={{ 
          color: isDark ? '#94a3b8' : '#475569', 
        }}>Please select your portal to continue</p>

        <div className="welcome-grid">

          {/* Candidate Card */}
          <Link href="/careers/register" className="portal-card-link">
            <div className={`portal-card-inner candidate-card ${isDark ? 'dark' : 'light'}`}>
              <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'rgba(56,189,248,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#38bdf8' }}>
                <Briefcase size={28} />
              </div>
              <div>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: isDark ? 'white' : '#1e293b', marginBottom: 8, transition: 'color 0.3s ease' }}>The JobSync Candidate</h2>
                <p style={{ fontSize: '0.9rem', color: isDark ? '#64748b' : '#64748b', lineHeight: 1.5 }}>Browse open positions, track applications, and manage your profile.</p>
              </div>
              <div style={{ marginTop: 'auto', paddingTop: '1.5rem', display: 'flex', alignItems: 'center', gap: 6, color: '#38bdf8', fontWeight: 700, fontSize: '0.9rem' }}>
                Register as Candidate <ArrowRight size={16} />
              </div>
            </div>
          </Link>

          {/* CRM Card */}
          <Link href="/login" className="portal-card-link">
            <div className={`portal-card-inner crm-card ${isDark ? 'dark' : 'light'}`}>
              <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'rgba(99,102,241,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#818cf8' }}>
                <Building2 size={28} />
              </div>
              <div>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: isDark ? 'white' : '#1e293b', marginBottom: 8, transition: 'color 0.3s ease' }}>CRM Employee</h2>
                <p style={{ fontSize: '0.9rem', color: isDark ? '#64748b' : '#64748b', lineHeight: 1.5 }}>Access the internal dashboard to manage jobs, candidates, and hiring.</p>
              </div>
              <div style={{ marginTop: 'auto', paddingTop: '1.5rem', display: 'flex', alignItems: 'center', gap: 6, color: '#818cf8', fontWeight: 700, fontSize: '0.9rem' }}>
                Internal Login <ArrowRight size={16} />
              </div>
            </div>
          </Link>

        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(15px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fadeIn 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .portal-card-link {
          text-decoration: none;
          display: block;
          height: 100%;
        }
        .portal-card-inner {
          border-radius: 20px;
          padding: 2rem;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1rem;
          cursor: pointer;
          height: 100%;
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .portal-card-inner.dark {
          background: rgba(0, 0, 0, 0.2);
          border: 1px solid rgba(255, 255, 255, 0.08);
          box-shadow: none;
        }
        .portal-card-inner.light {
          background: rgba(255, 255, 255, 0.85);
          border: 1px solid rgba(0, 0, 0, 0.06);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.02);
        }
        
        /* Hover effects */
        .portal-card-inner:hover {
          transform: translateY(-5px);
        }
        .portal-card-inner.dark.candidate-card:hover {
          border-color: rgba(56, 189, 248, 0.5);
          background: rgba(56, 189, 248, 0.05);
        }
        .portal-card-inner.light.candidate-card:hover {
          border-color: rgba(14, 165, 233, 0.4);
          background: rgba(14, 165, 233, 0.02);
        }
        .portal-card-inner.dark.crm-card:hover {
          border-color: rgba(99, 102, 241, 0.5);
          background: rgba(99, 102, 241, 0.05);
        }
        .portal-card-inner.light.crm-card:hover {
          border-color: rgba(99, 102, 241, 0.4);
          background: rgba(99, 102, 241, 0.02);
        }

        .welcome-card {
          padding: 3rem;
          border-radius: 24px;
          width: 100%;
          max-width: 700px;
          text-align: center;
          transition: all 0.3s ease;
        }
        .welcome-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 1.5rem;
        }
        .welcome-title {
          font-size: 2.5rem;
          font-weight: 900;
          margin-bottom: 1rem;
          letter-spacing: -1px;
          transition: color 0.3s ease;
        }
        .welcome-subtitle {
          font-size: 1.1rem;
          margin-bottom: 3rem;
          transition: color 0.3s ease;
        }
        @media (max-width: 640px) {
          .welcome-card {
            padding: 1.5rem 1rem !important;
            border-radius: 16px !important;
          }
          .welcome-grid {
            grid-template-columns: 1fr !important;
            gap: 1rem !important;
          }
          .welcome-title {
            font-size: 1.75rem !important;
          }
          .welcome-subtitle {
            font-size: 0.95rem !important;
            margin-bottom: 2rem !important;
          }
        }
      `}</style>
    </div>
  );
}
