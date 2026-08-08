'use client';

import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Send, User, MessageSquare, Clock, ArrowLeft, Check, CheckCheck } from 'lucide-react';

function timeAgo(dateInput: string | Date) {
  const date = new Date(dateInput);
  const now = new Date();
  const seconds = Math.round((now.getTime() - date.getTime()) / 1000);
  if (seconds < 60) return 'just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  const months = Math.floor(days / 30);
  if (months < 12) return `${months}mo ago`;
  return `${Math.floor(months / 12)}y ago`;
}

export default function CandidateMessagesPage() {
  const { user } = useAuth();
  const [conversations, setConversations] = useState<any[]>([]);
  const [selectedCandidate, setSelectedCandidate] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [inputText, setInputText] = useState('');
  const [sending, setSending] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchConversations();
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (selectedCandidate) {
      fetchMessages(selectedCandidate.candidateAccountId);
      interval = setInterval(() => {
        fetchMessages(selectedCandidate.candidateAccountId, false);
      }, 3000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [selectedCandidate]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const fetchConversations = async () => {
    try {
      const res = await fetch('/api/admin/candidate-messages');
      const data = await res.json();
      setConversations(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async (candidateId: string, showLoading = true) => {
    if (showLoading) setLoadingMessages(true);
    try {
      const res = await fetch(`/api/admin/candidate-messages/${candidateId}`);
      const data = await res.json();
      setMessages(data.messages || []);
      
      // Update unread count in conversations list to 0 locally
      setConversations(prev => prev.map(c => 
        c.candidateAccountId === candidateId ? { ...c, unreadCount: 0 } : c
      ));
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingMessages(false);
    }
  };

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !selectedCandidate) return;

    setSending(true);
    try {
      const res = await fetch(`/api/admin/candidate-messages/${selectedCandidate.candidateAccountId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: inputText })
      });
      const newMessage = await res.json();
      
      setMessages(prev => [...prev, newMessage]);
      setInputText('');
      
      // Update latest message in conversations list locally
      setConversations(prev => prev.map(c => 
        c.candidateAccountId === selectedCandidate.candidateAccountId 
          ? { ...c, latestMessage: { message: newMessage.message, sentAt: newMessage.sentAt, sender: 'hr' } } 
          : c
      ));
    } catch (e) {
      console.error(e);
    } finally {
      setSending(false);
    }
  };

  return (
    <div style={{ height: 'calc(100vh - 120px)', display: 'flex', background: 'white', borderRadius: 16, overflow: 'hidden', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}>
      
      {/* LEFT SIDEBAR - Conversations */}
      <div style={{ width: selectedCandidate ? '35%' : '100%', minWidth: 300, borderRight: '1px solid #e2e8f0', flexDirection: 'column', transition: 'width 0.2s', display: window.innerWidth < 768 && selectedCandidate ? 'none' : 'flex' }}>
        <div style={{ padding: '1.5rem', borderBottom: '1px solid #e2e8f0', background: '#f8fafc' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#0f172a', margin: 0, display: 'flex', alignItems: 'center', gap: 8 }}>
            <MessageSquare size={20} className="text-sky-500" /> Candidate Messages
          </h2>
          <p style={{ margin: 0, marginTop: 4, fontSize: '0.875rem', color: '#64748b' }}>Chat directly with portal candidates</p>
        </div>

        <div style={{ flex: 1, overflowY: 'auto' }}>
          {loading ? (
            <div style={{ padding: '2rem', textAlign: 'center', color: '#64748b' }}>Loading conversations...</div>
          ) : conversations.length === 0 ? (
            <div style={{ padding: '2rem', textAlign: 'center', color: '#64748b' }}>No messages found.</div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {conversations.map((conv, idx) => (
                <div 
                  key={conv.candidateAccountId} 
                  onClick={() => setSelectedCandidate(conv)}
                  style={{ 
                    padding: '1rem 1.5rem', 
                    borderBottom: '1px solid #f1f5f9', 
                    cursor: 'pointer',
                    background: selectedCandidate?.candidateAccountId === conv.candidateAccountId ? '#f0f9ff' : 'white',
                    transition: 'all 0.2s',
                    display: 'flex', alignItems: 'flex-start', gap: 12
                  }}
                  className="hover:bg-slate-50"
                >
                  <div style={{ width: 44, height: 44, borderRadius: '50%', background: '#e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, overflow: 'hidden' }}>
                    {conv.candidatePhoto ? (
                      <img src={conv.candidatePhoto} alt={conv.candidateName} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      <User size={20} color="#64748b" />
                    )}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                      <h4 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 600, color: '#0f172a', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {conv.candidateName}
                      </h4>
                      {conv.latestMessage && (
                        <span style={{ fontSize: '0.75rem', color: '#94a3b8', whiteSpace: 'nowrap' }}>
                          {timeAgo(conv.latestMessage.sentAt)}
                        </span>
                      )}
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <p style={{ margin: 0, fontSize: '0.875rem', color: conv.unreadCount > 0 ? '#334155' : '#64748b', fontWeight: conv.unreadCount > 0 ? 600 : 400, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', paddingRight: 10 }}>
                        {conv.latestMessage?.sender === 'hr' ? 'You: ' : ''}
                        {conv.latestMessage?.message || 'No messages yet'}
                      </p>
                      {conv.unreadCount > 0 && (
                        <div style={{ background: '#ef4444', color: 'white', fontSize: '0.7rem', fontWeight: 700, padding: '2px 6px', borderRadius: 10 }}>
                          {conv.unreadCount}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* RIGHT SIDEBAR - Chat View */}
      {selectedCandidate ? (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: '#f8fafc', width: window.innerWidth < 768 ? '100%' : 'auto' }}>
          {/* Chat Header */}
          <div style={{ padding: '1rem 1.5rem', background: 'white', borderBottom: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: 12 }}>
            <button 
              onClick={() => setSelectedCandidate(null)}
              style={{ display: window.innerWidth >= 768 ? 'none' : 'flex', background: 'none', border: 'none', color: '#64748b', cursor: 'pointer' }}
            >
              <ArrowLeft size={20} />
            </button>
            <div style={{ width: 40, height: 40, borderRadius: '50%', background: '#e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
              {selectedCandidate.candidatePhoto ? (
                <img src={selectedCandidate.candidatePhoto} alt={selectedCandidate.candidateName} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                <User size={20} color="#64748b" />
              )}
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 600, color: '#0f172a' }}>{selectedCandidate.candidateName}</h3>
              <p style={{ margin: 0, fontSize: '0.8rem', color: '#64748b' }}>{selectedCandidate.candidateEmail}</p>
            </div>
          </div>

          {/* Chat Messages List */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '1.5rem' }}>
            {loadingMessages ? (
              <div style={{ textAlign: 'center', color: '#64748b', padding: '2rem' }}>Loading messages...</div>
            ) : messages.length === 0 ? (
              <div style={{ textAlign: 'center', color: '#64748b', padding: '2rem' }}>No messages in this conversation yet.</div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {messages.map((msg, i) => {
                  const isHr = msg.sender === 'hr';
                  return (
                    <div key={msg.id || i} style={{ display: 'flex', justifyContent: isHr ? 'flex-end' : 'flex-start' }}>
                      <div style={{ 
                        maxWidth: '75%', 
                        background: isHr ? '#0ea5e9' : 'white', 
                        color: isHr ? 'white' : '#1e293b', 
                        padding: '0.75rem 1rem', 
                        borderRadius: '16px', 
                        borderTopRightRadius: isHr ? 4 : 16,
                        borderTopLeftRadius: !isHr ? 4 : 16,
                        boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
                        border: isHr ? 'none' : '1px solid #e2e8f0'
                      }}>
                        <div style={{ fontSize: '0.95rem', lineHeight: '1.4' }}>
                          {msg.message}
                        </div>
                        <div style={{ fontSize: '0.65rem', marginTop: 6, color: isHr ? 'rgba(255,255,255,0.7)' : '#94a3b8', display: 'flex', alignItems: 'center', gap: 4, justifyContent: isHr ? 'flex-end' : 'flex-start' }}>
                          <Clock size={10} />
                          {new Date(msg.sentAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          {isHr && (
                            msg.isRead ? <CheckCheck size={14} color="#38bdf8" /> : <CheckCheck size={14} color="rgba(255,255,255,0.7)" />
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>
            )}
          </div>

          {/* Chat Input */}
          <div style={{ padding: '1rem 1.5rem', background: 'white', borderTop: '1px solid #e2e8f0' }}>
            <form onSubmit={sendMessage} style={{ display: 'flex', gap: 12 }}>
              <input 
                type="text" 
                value={inputText}
                onChange={e => setInputText(e.target.value)}
                placeholder={`Reply to ${selectedCandidate.candidateName}...`}
                style={{ 
                  flex: 1, padding: '0.75rem 1rem', borderRadius: '24px', border: '1px solid #cbd5e1', 
                  fontSize: '0.95rem', outline: 'none'
                }}
                className="focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
              />
              <button 
                type="submit" 
                disabled={!inputText.trim() || sending}
                style={{ 
                  width: 44, height: 44, borderRadius: '50%', background: inputText.trim() && !sending ? '#0ea5e9' : '#cbd5e1', 
                  color: 'white', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', 
                  cursor: inputText.trim() && !sending ? 'pointer' : 'default',
                  transition: 'background 0.2s'
                }}
              >
                <Send size={18} style={{ marginLeft: -2, marginTop: 2 }} />
              </button>
            </form>
          </div>
        </div>
      ) : (
        <div style={{ flex: 1, flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#f8fafc', color: '#94a3b8', display: window.innerWidth < 768 ? 'none' : 'flex' }}>
          <MessageSquare size={48} style={{ marginBottom: 16, opacity: 0.5 }} />
          <h3 style={{ fontSize: '1.25rem', fontWeight: 600, color: '#64748b', margin: 0 }}>Select a Conversation</h3>
          <p style={{ marginTop: 8 }}>Choose a candidate from the left to start messaging</p>
        </div>
      )}
    </div>
  );
}
