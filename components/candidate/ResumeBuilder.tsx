'use client';
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { Download, FileText, X, ChevronLeft, ChevronRight } from 'lucide-react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import ClassicTemplate from './resume-templates/ClassicTemplate';
import ModernTemplate from './resume-templates/ModernTemplate';
import MinimalistTemplate from './resume-templates/MinimalistTemplate';
import ProfessionalTemplate from './resume-templates/ProfessionalTemplate';

const A4_HEIGHT_PX = 1122; // 297mm at 96dpi

export default function ResumeBuilder({ candidate, plan, onClose, onUpgrade }: {
  candidate: any;
  plan: string;
  onClose: () => void;
  onUpgrade?: () => void;
}) {
  const [template, setTemplate] = useState('classic');
  const [themeColor, setThemeColor] = useState('#0077B6');
  const [downloading, setDownloading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const contentRef = useRef<HTMLDivElement>(null);

  const canAccessModern = plan === 'JS Pro Resume' || plan === 'JS Company Reference' || plan === 'JS Company Assistance';

  // Editable resume data state
  const [editableData, setEditableData] = useState(() => ({
    name: candidate.name || '',
    email: candidate.email || '',
    phone: candidate.phone || '',
    location: candidate.locCity && candidate.locState
      ? `${candidate.locCity}, ${candidate.locState}`
      : (candidate.location || ''),
    headline: candidate.headline || '',
    summary: candidate.summary || '',
    skills: candidate.skillsArr || [],
    languages: candidate.languages || [],
    education: candidate.educations || [],
    experience: candidate.experiences || [],
    themeColor: themeColor,
  }));

  useEffect(() => {
    setEditableData(prev => ({ ...prev, themeColor }));
  }, [themeColor]);

  useEffect(() => { setMounted(true); }, []);

  // Detect content height and calculate pages
  useEffect(() => {
    const el = contentRef.current;
    if (!el) return;
    const observer = new ResizeObserver(() => {
      const h = el.scrollHeight;
      setTotalPages(Math.max(1, Math.ceil(h / A4_HEIGHT_PX)));
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, [editableData, template]);

  const onFieldChange = useCallback((field: string, value: any) => {
    setEditableData(prev => ({ ...prev, [field]: value }));
  }, []);

  const handleDownload = async () => {
    setDownloading(true);
    try {
      const element = contentRef.current;
      if (!element) return;

      const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeightMm = pdf.internal.pageSize.getHeight();
      const scale = 2;

      // Render full content
      const canvas = await html2canvas(element, { scale, useCORS: true, logging: false });
      const totalCanvasHeight = canvas.height;
      const pageHeightPx = (canvas.width / pdfWidth) * pdfHeightMm * scale;

      let yOffset = 0;
      let pageIndex = 0;
      while (yOffset < totalCanvasHeight) {
        const sliceHeight = Math.min(pageHeightPx, totalCanvasHeight - yOffset);
        const pageCanvas = document.createElement('canvas');
        pageCanvas.width = canvas.width;
        pageCanvas.height = sliceHeight;
        const ctx = pageCanvas.getContext('2d')!;
        ctx.drawImage(canvas, 0, -yOffset);
        const imgData = pageCanvas.toDataURL('image/png');
        if (pageIndex > 0) pdf.addPage();
        const imgHeightMm = (sliceHeight / canvas.width) * pdfWidth;
        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, imgHeightMm);
        yOffset += sliceHeight;
        pageIndex++;
      }

      pdf.save(`${editableData.name || 'Candidate'}_Resume.pdf`);
    } catch (error) {
      console.error('Error generating PDF', error);
      alert('Error generating PDF. Please try again.');
    } finally {
      setDownloading(false);
    }
  };

  if (!mounted) return null;

  const templateProps = { data: editableData, onFieldChange, editable: true };

  const builderContent = (
    <div style={{ position: 'fixed', inset: 0, zIndex: 9999, background: '#0f172a', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <div style={{ padding: '0.75rem 2rem', background: 'rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.1)', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <FileText color="#00B4D8" />
          <h2 style={{ color: 'white', margin: 0, fontSize: '1.1rem' }}>ATS Resume Builder</h2>
          <span style={{ background: 'rgba(0,180,216,0.15)', color: '#00B4D8', fontSize: '0.7rem', padding: '2px 8px', borderRadius: 999, border: '1px solid rgba(0,180,216,0.3)', fontWeight: 600 }}>
            ✏️ Click any field to edit
          </span>
        </div>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          {/* Page Navigation */}
          {totalPages > 1 && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'white', fontSize: '0.85rem' }}>
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                style={{ background: 'rgba(255,255,255,0.1)', border: 'none', color: 'white', padding: '4px 8px', borderRadius: 6, cursor: 'pointer', opacity: currentPage === 1 ? 0.4 : 1 }}
              ><ChevronLeft size={14} /></button>
              <span>Page {currentPage} / {totalPages}</span>
              <button
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                style={{ background: 'rgba(255,255,255,0.1)', border: 'none', color: 'white', padding: '4px 8px', borderRadius: 6, cursor: 'pointer', opacity: currentPage === totalPages ? 0.4 : 1 }}
              ><ChevronRight size={14} /></button>
            </div>
          )}
          <button
            onClick={handleDownload}
            disabled={downloading}
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: '#0077B6', color: 'white', border: 'none', padding: '0.5rem 1rem', borderRadius: '8px', cursor: downloading ? 'wait' : 'pointer', fontWeight: 600, fontSize: '0.9rem' }}
          >
            <Download size={16} /> {downloading ? 'Generating PDF...' : 'Download PDF'}
          </button>
          <button onClick={onClose} style={{ background: 'rgba(255,255,255,0.1)', border: 'none', color: 'white', padding: '0.5rem', borderRadius: '8px', cursor: 'pointer' }}>
            <X size={20} />
          </button>
        </div>
      </div>

      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        {/* Sidebar */}
        <div style={{ width: 240, background: 'rgba(0,0,0,0.2)', borderRight: '1px solid rgba(255,255,255,0.05)', padding: '1.5rem', overflowY: 'auto', flexShrink: 0 }}>
          <h3 style={{ color: '#94a3b8', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '1rem', margin: '0 0 1rem 0' }}>Select Template</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {[
              { key: 'classic', label: 'Classic Template', desc: 'Standard ATS-friendly format', pro: false },
              { key: 'modern', label: 'Modern Template', desc: 'Clean, two-column layout', pro: true },
              { key: 'minimalist', label: 'Minimalist Template', desc: 'Sleek and typography-focused', pro: true },
              { key: 'professional', label: 'Professional Template', desc: 'Clean and formal ATS design', pro: true },
            ].map(t => (
              <button
                key={t.key}
                onClick={() => (t.pro && !canAccessModern) ? onUpgrade?.() : setTemplate(t.key)}
                style={{
                  background: template === t.key ? 'rgba(0,119,182,0.2)' : 'rgba(255,255,255,0.05)',
                  border: `1px solid ${template === t.key ? '#0077B6' : 'rgba(255,255,255,0.1)'}`,
                  padding: '0.75rem', borderRadius: '10px', color: 'white', textAlign: 'left',
                  cursor: (t.pro && !canAccessModern) ? 'not-allowed' : 'pointer',
                  opacity: (t.pro && !canAccessModern) ? 0.5 : 1, position: 'relative'
                }}
              >
                {t.pro && !canAccessModern && (
                  <div style={{ position: 'absolute', top: 8, right: 8, background: '#ef4444', color: 'white', fontSize: '0.6rem', padding: '1px 5px', borderRadius: 8, fontWeight: 'bold' }}>PRO</div>
                )}
                <strong style={{ fontSize: '0.85rem' }}>{t.label}</strong>
                <div style={{ fontSize: '0.72rem', color: '#94a3b8', marginTop: 2 }}>{t.desc}</div>
              </button>
            ))}
          </div>

          {/* Theme Color */}
          {(template === 'modern' || template === 'minimalist' || template === 'professional') && (
            <div style={{ marginTop: '1.5rem' }}>
              <h3 style={{ color: '#94a3b8', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '0.75rem', margin: '0 0 0.75rem 0' }}>Theme Color</h3>
              <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                {['#0077B6', '#ea580c', '#16a34a', '#dc2626', '#9333ea', '#eab308', '#2563eb', '#111827'].map(color => (
                  <button
                    key={color}
                    onClick={() => setThemeColor(color)}
                    style={{ width: '28px', height: '28px', borderRadius: '50%', background: color, border: themeColor === color ? '3px solid white' : '2px solid transparent', cursor: 'pointer' }}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Page Info */}
          <div style={{ marginTop: '1.5rem', padding: '0.75rem', background: 'rgba(0,180,216,0.1)', borderRadius: 8, border: '1px solid rgba(0,180,216,0.2)' }}>
            <div style={{ color: '#00B4D8', fontSize: '0.7rem', fontWeight: 700, marginBottom: 4 }}>📄 PAGES</div>
            <div style={{ color: 'white', fontSize: '1.5rem', fontWeight: 800 }}>{totalPages}</div>
            <div style={{ color: '#94a3b8', fontSize: '0.7rem' }}>
              {totalPages === 1 ? 'Fits in one page ✅' : `Content spans ${totalPages} pages`}
            </div>
          </div>
        </div>

        {/* Preview Area */}
        <div style={{ flex: 1, padding: '1.5rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', alignItems: 'center', background: '#cbd5e1', gap: '1.5rem' }}>
          {/* Scrollable full content (for editing) */}
          <div
            ref={contentRef}
            id="resume-preview-container"
            style={{ width: '210mm', background: 'white', boxShadow: '0 10px 40px rgba(0,0,0,0.25)', position: 'relative' }}
          >
            {template === 'classic' && <ClassicTemplate data={editableData} onFieldChange={onFieldChange} editable />}
            {template === 'modern' && <ModernTemplate data={editableData} onFieldChange={onFieldChange} editable />}
            {template === 'minimalist' && <MinimalistTemplate data={editableData} onFieldChange={onFieldChange} editable />}
            {template === 'professional' && <ProfessionalTemplate data={editableData} onFieldChange={onFieldChange} editable />}

            {/* Page break markers */}
            {totalPages > 1 && Array.from({ length: totalPages - 1 }).map((_, i) => (
              <div
                key={i}
                style={{
                  position: 'absolute',
                  top: `${(i + 1) * A4_HEIGHT_PX}px`,
                  left: 0, right: 0,
                  height: '2px',
                  background: 'repeating-linear-gradient(90deg, #ef4444 0, #ef4444 8px, transparent 8px, transparent 16px)',
                  zIndex: 10,
                  pointerEvents: 'none',
                }}
              />
            ))}
          </div>

          {totalPages > 1 && (
            <div style={{ color: '#64748b', fontSize: '0.8rem', textAlign: 'center', background: 'rgba(255,255,255,0.7)', padding: '6px 16px', borderRadius: 8 }}>
              🔴 Red dashed line = page break. Content will print on {totalPages} pages.
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return createPortal(builderContent, document.body);
}
