'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCandidateAuth } from '@/context/CandidateAuthContext';
import { usePortalTheme } from '@/context/PortalThemeContext';
import DashboardLayout from '../DashboardLayout';
import { motion } from 'framer-motion';
import { Mic, Search, ChevronDown, CheckCircle2, Circle, Sparkles, Clock, MessageSquare, Volume2, ShieldAlert, Award } from 'lucide-react';

const ROLES = [
  'Software Engineer',
  'Frontend Developer',
  'Backend Developer',
  'Full Stack Developer',
  'Python Developer',
  'Java Developer',
  'HR Executive',
  'Recruiter',
  'Business Analyst',
  'Data Analyst',
  'Accountant',
  'Sales Executive',
  'Digital Marketing',
  'Mechanical Engineer',
  'Civil Engineer',
  'Warehouse Manager',
  'Procurement Manager',
  'Logistics Coordinator',
  'Custom Role',
];

export default function AIMockInterviewPage() {
  const { isDark } = usePortalTheme();
  const { candidate, isAuthenticated, isLoading } = useCandidateAuth();
  const router = useRouter();

  const [selectedRole, setSelectedRole] = useState('Software Engineer');
  const [customRoleText, setCustomRoleText] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const [difficulty, setDifficulty] = useState<'Easy' | 'Medium' | 'Hard'>('Medium');
  const [duration, setDuration] = useState<'10 Minutes' | '20 Minutes' | '30 Minutes'>('20 Minutes');
  const [answerMode, setAnswerMode] = useState<'Text' | 'Speech'>('Speech');

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/careers/login');
    }
  }, [isAuthenticated, isLoading, router]);

  if (!candidate) return null;

  const filteredRoles = ROLES.filter(role =>
    role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleStartInterview = () => {
    const finalRole = selectedRole === 'Custom Role' ? (customRoleText.trim() || 'Custom Role') : selectedRole;
    alert(`Starting ${difficulty} AI Mock Interview for ${finalRole} (${duration}${difficulty !== 'Easy' ? `, ${answerMode} Mode` : ''})!`);
  };

  return (
    <DashboardLayout>
      <div style={{ maxWidth: 860, margin: '0 auto', paddingBottom: '3rem' }}>
        
        {/* Header */}
        <div style={{ marginBottom: '2.5rem' }}>
          <h1 style={{
            fontSize: '2.25rem',
            fontWeight: 900,
            color: isDark ? '#ffffff' : '#0f172a',
            marginBottom: 8,
            letterSpacing: '-0.5px',
            display: 'flex',
            alignItems: 'center',
            gap: 12
          }}>
            <div style={{
              width: 48,
              height: 48,
              borderRadius: 14,
              background: 'linear-gradient(135deg, rgba(56,189,248,0.2) 0%, rgba(14,165,233,0.1) 100%)',
              border: '1px solid rgba(56,189,248,0.3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#38bdf8'
            }}>
              <Mic size={26} />
            </div>
            AI Mock Interview
          </h1>
          <p style={{ color: isDark ? '#94a3b8' : '#475569', fontSize: '1.05rem', lineHeight: 1.5 }}>
            Practice interviews powered by AI. Choose your role and difficulty level to begin.
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          
          {/* SECTION 1: Select Role */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            style={{
              background: isDark ? 'rgba(30, 41, 59, 0.7)' : 'rgba(255, 255, 255, 0.9)',
              border: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.08)'}`,
              borderRadius: 20,
              padding: '1.75rem',
              backdropFilter: 'blur(12px)',
              boxShadow: isDark ? '0 10px 30px -10px rgba(0,0,0,0.5)' : '0 10px 30px -10px rgba(0,0,0,0.05)'
            }}
          >
            <label style={{
              display: 'block',
              fontWeight: 800,
              fontSize: '1.15rem',
              color: isDark ? '#f8fafc' : '#0f172a',
              marginBottom: '1rem'
            }}>
              Select Role
            </label>

            {/* Custom Searchable Dropdown */}
            <div style={{ position: 'relative', marginBottom: '1.25rem' }}>
              <div
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                style={{
                  width: '100%',
                  padding: '0.9rem 1.25rem',
                  borderRadius: 14,
                  background: isDark ? 'rgba(15, 23, 42, 0.6)' : 'rgba(241, 245, 249, 0.8)',
                  border: `1.5px solid ${isDropdownOpen ? '#00B4D8' : (isDark ? 'rgba(255, 255, 255, 0.12)' : 'rgba(0, 0, 0, 0.12)')}`,
                  color: isDark ? '#ffffff' : '#0f172a',
                  fontWeight: 600,
                  fontSize: '1rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  transition: 'all 0.2s ease',
                  boxShadow: isDropdownOpen ? '0 0 0 3px rgba(0, 180, 216, 0.2)' : 'none'
                }}
              >
                <span>{selectedRole === 'Custom Role' && customRoleText ? `Custom Role: "${customRoleText}"` : selectedRole}</span>
                <ChevronDown size={20} style={{ transform: isDropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s', color: isDark ? '#94a3b8' : '#64748b' }} />
              </div>

              {/* Dropdown Menu */}
              {isDropdownOpen && (
                <div style={{
                  position: 'absolute',
                  top: 'calc(100% + 6px)',
                  left: 0,
                  right: 0,
                  maxHeight: 280,
                  background: isDark ? '#1e293b' : '#ffffff',
                  border: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.15)' : 'rgba(0, 0, 0, 0.15)'}`,
                  borderRadius: 16,
                  zIndex: 100,
                  overflowY: 'auto',
                  boxShadow: '0 20px 40px -10px rgba(0,0,0,0.3)',
                  padding: '0.5rem'
                }}>
                  {/* Search box inside dropdown */}
                  <div style={{ position: 'sticky', top: 0, background: isDark ? '#1e293b' : '#ffffff', padding: '0.25rem 0.25rem 0.5rem 0.25rem', zIndex: 2 }}>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8,
                      padding: '0.6rem 0.9rem',
                      background: isDark ? 'rgba(15, 23, 42, 0.8)' : 'rgba(241, 245, 249, 1)',
                      borderRadius: 10,
                      border: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`
                    }}>
                      <Search size={16} style={{ color: isDark ? '#94a3b8' : '#64748b' }} />
                      <input
                        type="text"
                        placeholder="Search role..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onClick={(e) => e.stopPropagation()}
                        style={{
                          background: 'none',
                          border: 'none',
                          outline: 'none',
                          color: isDark ? '#ffffff' : '#0f172a',
                          width: '100%',
                          fontSize: '0.9rem'
                        }}
                      />
                    </div>
                  </div>

                  {filteredRoles.map(role => (
                    <div
                      key={role}
                      onClick={() => {
                        setSelectedRole(role);
                        setIsDropdownOpen(false);
                      }}
                      style={{
                        padding: '0.75rem 1rem',
                        borderRadius: 10,
                        cursor: 'pointer',
                        background: selectedRole === role ? 'rgba(56, 189, 248, 0.15)' : 'transparent',
                        color: selectedRole === role ? '#00B4D8' : (isDark ? '#e2e8f0' : '#334155'),
                        fontWeight: selectedRole === role ? 700 : 500,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        transition: 'all 0.15s ease'
                      }}
                      className="hover:bg-sky-500/10"
                    >
                      <span>{role}</span>
                      {selectedRole === role && <CheckCircle2 size={18} color="#00B4D8" />}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Custom Role Input if selected */}
            {selectedRole === 'Custom Role' && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                style={{ marginTop: '0.75rem', marginBottom: '1.25rem' }}
              >
                <input
                  type="text"
                  placeholder="Enter your custom job role..."
                  value={customRoleText}
                  onChange={(e) => setCustomRoleText(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.85rem 1.25rem',
                    borderRadius: 14,
                    background: isDark ? 'rgba(15, 23, 42, 0.6)' : 'rgba(241, 245, 249, 0.8)',
                    border: `1.5px solid ${isDark ? 'rgba(56, 189, 248, 0.4)' : '#00B4D8'}`,
                    color: isDark ? '#ffffff' : '#0f172a',
                    fontWeight: 500,
                    fontSize: '0.95rem',
                    outline: 'none'
                  }}
                />
              </motion.div>
            )}

            {/* Popular Role Chips */}
            <div>
              <span style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: isDark ? '#64748b' : '#64748b', marginBottom: '0.75rem' }}>
                Popular Examples:
              </span>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {ROLES.slice(0, 8).map(role => {
                  const active = selectedRole === role;
                  return (
                    <button
                      key={role}
                      type="button"
                      onClick={() => { setSelectedRole(role); setIsDropdownOpen(false); }}
                      style={{
                        padding: '0.4rem 0.85rem',
                        borderRadius: 20,
                        fontSize: '0.825rem',
                        fontWeight: active ? 700 : 500,
                        background: active ? 'rgba(56, 189, 248, 0.2)' : (isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.04)'),
                        color: active ? '#00B4D8' : (isDark ? '#cbd5e1' : '#475569'),
                        border: `1px solid ${active ? 'rgba(56, 189, 248, 0.4)' : (isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.08)')}`,
                        cursor: 'pointer',
                        transition: 'all 0.2s ease'
                      }}
                    >
                      {role}
                    </button>
                  );
                })}
              </div>
            </div>
          </motion.div>

          {/* SECTION 2: Select Difficulty */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
            style={{
              background: isDark ? 'rgba(30, 41, 59, 0.7)' : 'rgba(255, 255, 255, 0.9)',
              border: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.08)'}`,
              borderRadius: 20,
              padding: '1.75rem',
              backdropFilter: 'blur(12px)',
              boxShadow: isDark ? '0 10px 30px -10px rgba(0,0,0,0.5)' : '0 10px 30px -10px rgba(0,0,0,0.05)'
            }}
          >
            <label style={{
              display: 'block',
              fontWeight: 800,
              fontSize: '1.15rem',
              color: isDark ? '#f8fafc' : '#0f172a',
              marginBottom: '1.25rem'
            }}>
              Select Difficulty
            </label>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
              
              {/* Easy Card */}
              <div
                onClick={() => setDifficulty('Easy')}
                style={{
                  padding: '1.25rem',
                  borderRadius: 16,
                  cursor: 'pointer',
                  background: difficulty === 'Easy' ? 'rgba(56, 189, 248, 0.12)' : (isDark ? 'rgba(15, 23, 42, 0.4)' : 'rgba(248, 250, 252, 0.8)'),
                  border: `2px solid ${difficulty === 'Easy' ? '#00B4D8' : (isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.08)')}`,
                  transition: 'all 0.2s ease',
                  position: 'relative'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    {difficulty === 'Easy' ? (
                      <CheckCircle2 size={22} color="#00B4D8" />
                    ) : (
                      <Circle size={22} color={isDark ? '#64748b' : '#94a3b8'} />
                    )}
                    <span style={{ fontWeight: 800, fontSize: '1.1rem', color: difficulty === 'Easy' ? '#00B4D8' : (isDark ? '#f8fafc' : '#0f172a') }}>
                      Easy
                    </span>
                  </div>
                  <span style={{ fontSize: '0.75rem', padding: '0.2rem 0.6rem', borderRadius: 8, background: 'rgba(34,197,94,0.15)', color: '#22c55e', fontWeight: 700 }}>
                    Beginner
                  </span>
                </div>
                <div style={{ fontSize: '0.9rem', color: isDark ? '#94a3b8' : '#64748b', lineHeight: 1.5 }}>
                  <strong style={{ display: 'block', color: isDark ? '#cbd5e1' : '#334155', marginBottom: 2 }}>Description:</strong>
                  MCQ-based interview.
                </div>
              </div>

              {/* Medium Card */}
              <div
                onClick={() => setDifficulty('Medium')}
                style={{
                  padding: '1.25rem',
                  borderRadius: 16,
                  cursor: 'pointer',
                  background: difficulty === 'Medium' ? 'rgba(56, 189, 248, 0.12)' : (isDark ? 'rgba(15, 23, 42, 0.4)' : 'rgba(248, 250, 252, 0.8)'),
                  border: `2px solid ${difficulty === 'Medium' ? '#00B4D8' : (isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.08)')}`,
                  transition: 'all 0.2s ease',
                  position: 'relative'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    {difficulty === 'Medium' ? (
                      <CheckCircle2 size={22} color="#00B4D8" />
                    ) : (
                      <Circle size={22} color={isDark ? '#64748b' : '#94a3b8'} />
                    )}
                    <span style={{ fontWeight: 800, fontSize: '1.1rem', color: difficulty === 'Medium' ? '#00B4D8' : (isDark ? '#f8fafc' : '#0f172a') }}>
                      Medium
                    </span>
                  </div>
                  <span style={{ fontSize: '0.75rem', padding: '0.2rem 0.6rem', borderRadius: 8, background: 'rgba(234,179,8,0.15)', color: '#eab308', fontWeight: 700 }}>
                    Intermediate
                  </span>
                </div>
                <div style={{ fontSize: '0.9rem', color: isDark ? '#94a3b8' : '#64748b', lineHeight: 1.5 }}>
                  <strong style={{ display: 'block', color: isDark ? '#cbd5e1' : '#334155', marginBottom: 2 }}>Description:</strong>
                  AI asks descriptive interview questions. Candidate answers using text or speech.
                </div>
              </div>

              {/* Hard Card */}
              <div
                onClick={() => setDifficulty('Hard')}
                style={{
                  padding: '1.25rem',
                  borderRadius: 16,
                  cursor: 'pointer',
                  background: difficulty === 'Hard' ? 'rgba(56, 189, 248, 0.12)' : (isDark ? 'rgba(15, 23, 42, 0.4)' : 'rgba(248, 250, 252, 0.8)'),
                  border: `2px solid ${difficulty === 'Hard' ? '#00B4D8' : (isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.08)')}`,
                  transition: 'all 0.2s ease',
                  position: 'relative'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    {difficulty === 'Hard' ? (
                      <CheckCircle2 size={22} color="#00B4D8" />
                    ) : (
                      <Circle size={22} color={isDark ? '#64748b' : '#94a3b8'} />
                    )}
                    <span style={{ fontWeight: 800, fontSize: '1.1rem', color: difficulty === 'Hard' ? '#00B4D8' : (isDark ? '#f8fafc' : '#0f172a') }}>
                      Hard
                    </span>
                  </div>
                  <span style={{ fontSize: '0.75rem', padding: '0.2rem 0.6rem', borderRadius: 8, background: 'rgba(239,68,68,0.15)', color: '#ef4444', fontWeight: 700 }}>
                    Advanced
                  </span>
                </div>
                <div style={{ fontSize: '0.85rem', color: isDark ? '#94a3b8' : '#64748b', lineHeight: 1.5 }}>
                  <strong style={{ display: 'block', color: isDark ? '#cbd5e1' : '#334155', marginBottom: 4 }}>Description:</strong>
                  <div style={{ marginBottom: 4 }}>
                    <span style={{ color: '#00B4D8', fontWeight: 600 }}>For IT roles:</span> Coding and technical problem-solving.
                  </div>
                  <div>
                    <span style={{ color: '#00B4D8', fontWeight: 600 }}>For Non-IT roles:</span> Scenario-based case study interview.
                  </div>
                </div>
              </div>

            </div>
          </motion.div>

          {/* SECTION 3: Interview Duration */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            style={{
              background: isDark ? 'rgba(30, 41, 59, 0.7)' : 'rgba(255, 255, 255, 0.9)',
              border: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.08)'}`,
              borderRadius: 20,
              padding: '1.75rem',
              backdropFilter: 'blur(12px)',
              boxShadow: isDark ? '0 10px 30px -10px rgba(0,0,0,0.5)' : '0 10px 30px -10px rgba(0,0,0,0.05)'
            }}
          >
            <label style={{
              display: 'block',
              fontWeight: 800,
              fontSize: '1.15rem',
              color: isDark ? '#f8fafc' : '#0f172a',
              marginBottom: '1.25rem'
            }}>
              Interview Duration
            </label>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
              {(['10 Minutes', '20 Minutes', '30 Minutes'] as const).map(time => {
                const active = duration === time;
                return (
                  <div
                    key={time}
                    onClick={() => setDuration(time)}
                    style={{
                      padding: '1.1rem',
                      borderRadius: 14,
                      cursor: 'pointer',
                      background: active ? 'rgba(56, 189, 248, 0.12)' : (isDark ? 'rgba(15, 23, 42, 0.4)' : 'rgba(248, 250, 252, 0.8)'),
                      border: `2px solid ${active ? '#00B4D8' : (isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.08)')}`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 10,
                      transition: 'all 0.2s ease'
                    }}
                  >
                    {active ? <CheckCircle2 size={20} color="#00B4D8" /> : <Circle size={20} color={isDark ? '#64748b' : '#94a3b8'} />}
                    <Clock size={18} style={{ color: active ? '#00B4D8' : (isDark ? '#94a3b8' : '#64748b') }} />
                    <span style={{ fontWeight: 700, fontSize: '0.95rem', color: active ? '#00B4D8' : (isDark ? '#e2e8f0' : '#334155') }}>
                      {time}
                    </span>
                  </div>
                );
              })}
            </div>
          </motion.div>

          {/* SECTION 4: Answer Mode (Hidden when Easy difficulty is selected) */}
          {difficulty !== 'Easy' && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              style={{
                background: isDark ? 'rgba(30, 41, 59, 0.7)' : 'rgba(255, 255, 255, 0.9)',
                border: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.08)'}`,
                borderRadius: 20,
                padding: '1.75rem',
                backdropFilter: 'blur(12px)',
                boxShadow: isDark ? '0 10px 30px -10px rgba(0,0,0,0.5)' : '0 10px 30px -10px rgba(0,0,0,0.05)'
              }}
            >
              <label style={{
                display: 'block',
                fontWeight: 800,
                fontSize: '1.15rem',
                color: isDark ? '#f8fafc' : '#0f172a',
                marginBottom: '1.25rem'
              }}>
                Answer Mode
              </label>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
                {/* Text Mode */}
                <div
                  onClick={() => setAnswerMode('Text')}
                  style={{
                    padding: '1.1rem',
                    borderRadius: 14,
                    cursor: 'pointer',
                    background: answerMode === 'Text' ? 'rgba(56, 189, 248, 0.12)' : (isDark ? 'rgba(15, 23, 42, 0.4)' : 'rgba(248, 250, 252, 0.8)'),
                    border: `2px solid ${answerMode === 'Text' ? '#00B4D8' : (isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.08)')}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 10,
                    transition: 'all 0.2s ease'
                  }}
                >
                  {answerMode === 'Text' ? <CheckCircle2 size={20} color="#00B4D8" /> : <Circle size={20} color={isDark ? '#64748b' : '#94a3b8'} />}
                  <MessageSquare size={18} style={{ color: answerMode === 'Text' ? '#00B4D8' : (isDark ? '#94a3b8' : '#64748b') }} />
                  <span style={{ fontWeight: 700, fontSize: '0.95rem', color: answerMode === 'Text' ? '#00B4D8' : (isDark ? '#e2e8f0' : '#334155') }}>
                    Text
                  </span>
                </div>

                {/* Speech Mode */}
                <div
                  onClick={() => setAnswerMode('Speech')}
                  style={{
                    padding: '1.1rem',
                    borderRadius: 14,
                    cursor: 'pointer',
                    background: answerMode === 'Speech' ? 'rgba(56, 189, 248, 0.12)' : (isDark ? 'rgba(15, 23, 42, 0.4)' : 'rgba(248, 250, 252, 0.8)'),
                    border: `2px solid ${answerMode === 'Speech' ? '#00B4D8' : (isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.08)')}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 10,
                    transition: 'all 0.2s ease'
                  }}
                >
                  {answerMode === 'Speech' ? <CheckCircle2 size={20} color="#00B4D8" /> : <Circle size={20} color={isDark ? '#64748b' : '#94a3b8'} />}
                  <Volume2 size={18} style={{ color: answerMode === 'Speech' ? '#00B4D8' : (isDark ? '#94a3b8' : '#64748b') }} />
                  <span style={{ fontWeight: 700, fontSize: '0.95rem', color: answerMode === 'Speech' ? '#00B4D8' : (isDark ? '#e2e8f0' : '#334155') }}>
                    Speech
                  </span>
                </div>
              </div>
            </motion.div>
          )}

          {/* Start AI Interview Button */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
            style={{ marginTop: '0.5rem' }}
          >
            <button
              onClick={handleStartInterview}
              style={{
                width: '100%',
                padding: '1.15rem 2rem',
                borderRadius: 16,
                background: 'linear-gradient(135deg, #00B4D8 0%, #0077B6 100%)',
                color: '#ffffff',
                border: 'none',
                fontWeight: 800,
                fontSize: '1.1rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 12,
                boxShadow: '0 10px 25px -5px rgba(0, 180, 216, 0.4)',
                transition: 'all 0.2s ease'
              }}
              className="hover:opacity-95 hover:scale-[1.01] active:scale-[0.99]"
            >
              <Sparkles size={22} />
              Start AI Interview
            </button>
          </motion.div>

        </div>

      </div>
    </DashboardLayout>
  );
}
