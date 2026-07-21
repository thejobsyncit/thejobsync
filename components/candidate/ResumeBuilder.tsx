'use client';
import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Download, FileText, X } from 'lucide-react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import ClassicTemplate from './resume-templates/ClassicTemplate';
import ModernTemplate from './resume-templates/ModernTemplate';
import MinimalistTemplate from './resume-templates/MinimalistTemplate';

export default function ResumeBuilder({ candidate, plan, onClose }: { candidate: any, plan: string, onClose: () => void }) {
  const [template, setTemplate] = useState('classic');
  const [themeColor, setThemeColor] = useState('#0077B6'); // Default theme color
  const [downloading, setDownloading] = useState(false);

  const canAccessModern = plan === 'JS Pro Resume' || plan === 'JS Company Reference' || plan === 'JS Company Assistance';
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const UpgradeModal = () => (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 99999,
      background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem'
    }}>
      <div style={{
        background: 'linear-gradient(135deg, #0f172a, #1e293b)',
        border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: '24px', padding: '2.5rem', maxWidth: 520, width: '100%',
        boxShadow: '0 25px 60px rgba(0,0,0,0.5)'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ fontSize: '3rem', marginBottom: '0.75rem' }}>🔒</div>
          <h2 style={{ color: 'white', fontSize: '1.5rem', fontWeight: 800, marginBottom: '0.5rem' }}>Pro Template</h2>
          <p style={{ color: '#94a3b8', fontSize: '0.95rem', lineHeight: 1.6 }}>
            This template is available only on <strong style={{ color: '#00B4D8' }}>JS Pro Resume</strong> and above plans.
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '2rem' }}>
          {[
            { name: 'JS Basic Resume', price: '₹1', color: '#0077B6', desc: '1 Classic ATS Template · Download PDF · Valid 30 days' },
            { name: 'JS Pro Resume', price: '₹49', color: '#9333ea', desc: '3 ATS Templates + Dynamic resume builder · Valid 30 days', highlight: true },
            { name: 'JS Company Reference', price: '₹495', color: '#16a34a', desc: 'Up to 5 company contact details matched to your profile' },
            { name: 'JS Company Assistance', price: '₹990', color: '#f59e0b', desc: 'Up to 10 company contacts + Assistant profile matching' },
          ].map(p => (
            <div key={p.name} onClick={() => { setShowUpgradeModal(false); onClose(); window.location.href = '/careers/pricing'; }}
              style={{
                background: p.highlight ? 'rgba(147,51,234,0.15)' : 'rgba(255,255,255,0.05)',
                border: `1px solid ${p.highlight ? '#9333ea' : 'rgba(255,255,255,0.08)'}`,
                borderRadius: '14px', padding: '0.875rem 1.25rem', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                transition: 'all 0.2s'
              }}
            >
              <div>
                {p.highlight && <div style={{ fontSize: '0.65rem', background: '#9333ea', color: 'white', padding: '2px 8px', borderRadius: 10, fontWeight: 700, display: 'inline-block', marginBottom: 4 }}>RECOMMENDED</div>}
                <div style={{ color: 'white', fontWeight: 700, fontSize: '0.95rem' }}>{p.name}</div>
                <div style={{ color: '#94a3b8', fontSize: '0.78rem', marginTop: 2 }}>{p.desc}</div>
              </div>
              <div style={{ color: p.color, fontWeight: 800, fontSize: '1.1rem', whiteSpace: 'nowrap', marginLeft: '1rem' }}>{p.price}</div>
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', gap: '1rem' }}>
          <button
            onClick={() => setShowUpgradeModal(false)}
            style={{
              flex: 1, padding: '0.875rem', borderRadius: '12px',
              background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.1)',
              color: 'white', fontWeight: 700, cursor: 'pointer', fontSize: '0.95rem'
            }}
          >
            ← Go Back
          </button>
          <button
            onClick={() => { setShowUpgradeModal(false); onClose(); window.location.href = '/careers/pricing'; }}
            style={{
              flex: 2, padding: '0.875rem', borderRadius: '12px',
              background: 'linear-gradient(135deg, #9333ea, #7c3aed)', border: 'none',
              color: 'white', fontWeight: 700, cursor: 'pointer', fontSize: '0.95rem',
              boxShadow: '0 4px 15px rgba(147,51,234,0.4)'
            }}
          >
            View Plans →
          </button>
        </div>
      </div>
    </div>
  );
  
  const handleDownload = async () => {
    setDownloading(true);
    try {
      const element = document.getElementById('resume-preview-container');
      if (!element) return;
      
      const canvas = await html2canvas(element, { scale: 2 });
      const imgData = canvas.toDataURL('image/png');
      
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });
      
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`${candidate.name || 'Candidate'}_Resume.pdf`);
    } catch (error) {
      console.error('Error generating PDF', error);
      alert('Error generating PDF. Please try again.');
    } finally {
      setDownloading(false);
    }
  };

  const parsedData = {
    name: candidate.name || '',
    email: candidate.email || '',
    phone: candidate.phone || '',
    location: candidate.locCity && candidate.locState ? `${candidate.locCity}, ${candidate.locState}` : (candidate.location || ''),
    headline: candidate.headline || '',
    summary: candidate.summary || '',
    skills: candidate.skillsArr || [],
    languages: candidate.languages || [],
    education: candidate.educations || [],
    experience: candidate.experiences || [],
    themeColor: themeColor
  };

  const builderContent = (
    <div style={{ position: 'fixed', inset: 0, zIndex: 9999, background: '#0f172a', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <div style={{ padding: '1rem 2rem', background: 'rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <FileText color="#00B4D8" />
          <h2 style={{ color: 'white', margin: 0, fontSize: '1.25rem' }}>ATS Resume Builder</h2>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button 
            onClick={handleDownload}
            disabled={downloading}
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: '#0077B6', color: 'white', border: 'none', padding: '0.5rem 1rem', borderRadius: '8px', cursor: downloading ? 'wait' : 'pointer', fontWeight: 600 }}
          >
            <Download size={18} /> {downloading ? 'Generating PDF...' : 'Download PDF'}
          </button>
          <button onClick={onClose} style={{ background: 'rgba(255,255,255,0.1)', border: 'none', color: 'white', padding: '0.5rem', borderRadius: '8px', cursor: 'pointer' }}>
            <X size={20} />
          </button>
        </div>
      </div>
      
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        {/* Sidebar */}
        <div style={{ width: 300, background: 'rgba(0,0,0,0.2)', borderRight: '1px solid rgba(255,255,255,0.05)', padding: '2rem', overflowY: 'auto' }}>
          <h3 style={{ color: '#94a3b8', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '1rem' }}>Select Template</h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <button 
              onClick={() => setTemplate('classic')}
              style={{ background: template === 'classic' ? 'rgba(0,119,182,0.2)' : 'rgba(255,255,255,0.05)', border: `1px solid ${template === 'classic' ? '#0077B6' : 'rgba(255,255,255,0.1)'}`, padding: '1rem', borderRadius: '12px', color: 'white', textAlign: 'left', cursor: 'pointer' }}
            >
              <strong>Classic Template</strong>
              <div style={{ fontSize: '0.8rem', color: '#94a3b8', marginTop: 4 }}>Standard ATS-friendly format</div>
            </button>

            <button 
              onClick={() => canAccessModern ? setTemplate('modern') : setShowUpgradeModal(true)}
              style={{ background: template === 'modern' ? 'rgba(0,119,182,0.2)' : 'rgba(255,255,255,0.05)', border: `1px solid ${template === 'modern' ? '#0077B6' : 'rgba(255,255,255,0.1)'}`, padding: '1rem', borderRadius: '12px', color: 'white', textAlign: 'left', cursor: canAccessModern ? 'pointer' : 'not-allowed', opacity: canAccessModern ? 1 : 0.5, position: 'relative' }}
            >
              {!canAccessModern && <div style={{ position: 'absolute', top: 10, right: 10, background: '#ef4444', color: 'white', fontSize: '0.65rem', padding: '2px 6px', borderRadius: 10, fontWeight: 'bold' }}>PRO</div>}
              <strong>Modern Template</strong>
              <div style={{ fontSize: '0.8rem', color: '#94a3b8', marginTop: 4 }}>Clean, two-column layout</div>
            </button>
            
            <button 
              onClick={() => canAccessModern ? setTemplate('minimalist') : setShowUpgradeModal(true)}
              style={{ background: template === 'minimalist' ? 'rgba(0,119,182,0.2)' : 'rgba(255,255,255,0.05)', border: `1px solid ${template === 'minimalist' ? '#0077B6' : 'rgba(255,255,255,0.1)'}`, padding: '1rem', borderRadius: '12px', color: 'white', textAlign: 'left', cursor: canAccessModern ? 'pointer' : 'not-allowed', opacity: canAccessModern ? 1 : 0.5, position: 'relative' }}
            >
              {!canAccessModern && <div style={{ position: 'absolute', top: 10, right: 10, background: '#ef4444', color: 'white', fontSize: '0.65rem', padding: '2px 6px', borderRadius: 10, fontWeight: 'bold' }}>PRO</div>}
              <strong>Minimalist Template</strong>
              <div style={{ fontSize: '0.8rem', color: '#94a3b8', marginTop: 4 }}>Sleek and typography-focused</div>
            </button>
          </div>

          {(template === 'modern' || template === 'minimalist') && (
            <div style={{ marginTop: '2rem' }}>
              <h3 style={{ color: '#94a3b8', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '1rem' }}>Theme Color</h3>
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                {['#0077B6', '#ea580c', '#16a34a', '#dc2626', '#9333ea', '#eab308', '#2563eb', '#111827'].map(color => (
                  <button
                    key={color}
                    onClick={() => setThemeColor(color)}
                    style={{ width: '32px', height: '32px', borderRadius: '50%', background: color, border: themeColor === color ? '3px solid white' : '2px solid transparent', cursor: 'pointer' }}
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Preview Area */}
        <div style={{ flex: 1, padding: '2rem', overflowY: 'auto', display: 'flex', justifyContent: 'center', background: '#e2e8f0' }}>
           <div id="resume-preview-container" style={{ width: '210mm', minHeight: '297mm', background: 'white', boxShadow: '0 10px 25px rgba(0,0,0,0.2)' }}>
              
              {template === 'classic' && <ClassicTemplate data={parsedData} />}
              {template === 'modern' && <ModernTemplate data={parsedData} />}
              {template === 'minimalist' && <MinimalistTemplate data={parsedData} />}
              
           </div>
        </div>
      </div>
    </div>
  );

  return createPortal(
    <>
      {showUpgradeModal && <UpgradeModal />}
      {builderContent}
    </>, 
    document.body
  );
}
