'use client';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useCandidateAuth } from '@/context/CandidateAuthContext';
import { Send, MessageSquare, Check, CheckCheck } from 'lucide-react';
import DashboardLayout from '../DashboardLayout';
import { motion } from 'framer-motion';
import { usePortalTheme } from '@/context/PortalThemeContext';

export default function MessagesPage() {
  const { isDark } = usePortalTheme();
  const { candidate, isAuthenticated, isLoading } = useCandidateAuth();
  const router = useRouter();
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) router.push('/careers/login');
  }, [isAuthenticated, isLoading, router]);

  useEffect(() => {
    if (!candidate) return;
    const fetchMsgs = () => {
      fetch(`/api/candidate-auth/messages?candidateAccountId=${candidate.id}&markRead=true`)
        .then(r => r.json())
        .then(data => { setMessages(Array.isArray(data) ? data : []); setLoading(false); })
        .catch(() => setLoading(false));
    };
    fetchMsgs();
    const int = setInterval(fetchMsgs, 3000); // aggressive polling for instant feeling
    return () => clearInterval(int);
  }, [candidate]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !candidate) return;
    setSending(true);
    try {
      const res = await fetch('/api/candidate-auth/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: input, candidateAccountId: candidate.id })
      });
      if (res.ok) {
        const newMsg = await res.json();
        setMessages([...messages, newMsg]);
        setInput('');
      }
    } finally {
      setSending(false);
    }
  };

  if (!candidate) return null;

  return (
    <DashboardLayout>
      <div style={{ marginBottom: '2.5rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 900, color: isDark ? 'white' : '#0f172a', marginBottom: 8, letterSpacing: '-0.5px', display: 'flex', alignItems: 'center', gap: 12 }}>
          <MessageSquare size={28} color="#38bdf8" /> Messages
        </h1>
        <p style={{ color: isDark ? '#94a3b8' : '#475569', fontSize: '1rem' }}>Chat directly with recruiters and hiring managers.</p>
      </div>

      <div style={{ background: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)', border: `1px solid ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)'}`, borderRadius: 24, overflow: 'hidden', display: 'flex', flexDirection: 'column', height: '600px' }}>
        
        <div style={{ padding: '1.5rem', borderBottom: `1px solid ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)'}`, background: isDark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.01)' }}>
          <div style={{ fontWeight: 800, color: isDark ? 'white' : '#0f172a', fontSize: '1.1rem' }}>HR & Support Team</div>
          <div style={{ fontSize: '0.85rem', color: '#34d399', display: 'flex', alignItems: 'center', gap: 6 }}>
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#34d399' }} /> Online
          </div>
        </div>

        <div style={{ flex: 1, padding: '1.5rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {loading ? (
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ width: 30, height: 30, border: `3px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`, borderTopColor: '#00B4D8', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
            </div>
          ) : messages.length === 0 ? (
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#64748b', textAlign: 'center' }}>
              <MessageSquare size={48} style={{ opacity: 0.2, marginBottom: 16 }} />
              <p>No messages yet. Send a message to start the conversation.</p>
            </div>
          ) : (
            messages.map((msg, i) => {
              const isMe = msg.sender === 'candidate';
              return (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} key={msg.id || i} style={{ alignSelf: isMe ? 'flex-end' : 'flex-start', maxWidth: '75%' }}>
                  <div style={{ 
                    background: isMe ? 'linear-gradient(135deg,#0ea5e9,#0077B6)' : (isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)'), 
                    color: isMe ? 'white' : (isDark ? 'white' : '#0f172a'), padding: '0.875rem 1.25rem', borderRadius: 16, 
                    borderBottomRightRadius: isMe ? 4 : 16, borderBottomLeftRadius: !isMe ? 4 : 16,
                    fontSize: '0.95rem', lineHeight: 1.5
                  }}>
                    {msg.message}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: 6, display: 'flex', alignItems: 'center', justifyContent: isMe ? 'flex-end' : 'flex-start', gap: 4 }}>
                    {new Date(msg.sentAt || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    {isMe && (
                      msg.isRead ? <CheckCheck size={14} color="#38bdf8" /> : <CheckCheck size={14} color="#94a3b8" />
                    )}
                  </div>
                </motion.div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>

        <div style={{ padding: '1.25rem', borderTop: `1px solid ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)'}`, background: isDark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.01)' }}>
          <form onSubmit={handleSend} style={{ display: 'flex', gap: '0.75rem' }}>
            <input 
              value={input} onChange={e => setInput(e.target.value)} 
              placeholder="Type your message..." 
              style={{ flex: 1, background: isDark ? 'rgba(0,0,0,0.3)' : 'white', border: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`, borderRadius: 12, padding: '1rem', color: isDark ? 'white' : '#0f172a', outline: 'none', fontSize: '0.95rem' }} 
              className="focus:border-[#0077B6] transition-colors"
            />
            <button type="submit" disabled={sending || !input.trim()} style={{ background: 'linear-gradient(135deg,#0ea5e9,#0077B6)', color: 'white', border: 'none', borderRadius: 12, padding: '0 1.5rem', cursor: (sending || !input.trim()) ? 'default' : 'pointer', opacity: (sending || !input.trim()) ? 0.6 : 1, transition: 'transform 0.2s' }} className={(sending || !input.trim()) ? '' : 'hover:scale-105'}>
              <Send size={20} />
            </button>
          </form>
        </div>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </DashboardLayout>
  );
}
