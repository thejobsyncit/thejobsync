'use client';
import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Download, FileText, X } from 'lucide-react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

export default function ResumeBuilder({ candidate, plan, onClose }: { candidate: any, plan: string, onClose: () => void }) {
  const [template, setTemplate] = useState('classic');
  const [downloading, setDownloading] = useState(false);

  const canAccessModern = plan === 'JS Pro Resume' || plan === 'JS Company Reference' || plan === 'JS Company Assistance';
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;
  
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
              onClick={() => canAccessModern ? setTemplate('modern') : alert('Upgrade to JS Pro Resume to access this template.')}
              style={{ background: template === 'modern' ? 'rgba(0,119,182,0.2)' : 'rgba(255,255,255,0.05)', border: `1px solid ${template === 'modern' ? '#0077B6' : 'rgba(255,255,255,0.1)'}`, padding: '1rem', borderRadius: '12px', color: 'white', textAlign: 'left', cursor: canAccessModern ? 'pointer' : 'not-allowed', opacity: canAccessModern ? 1 : 0.5, position: 'relative' }}
            >
              {!canAccessModern && <div style={{ position: 'absolute', top: 10, right: 10, background: '#ef4444', color: 'white', fontSize: '0.65rem', padding: '2px 6px', borderRadius: 10, fontWeight: 'bold' }}>PRO</div>}
              <strong>Modern Template</strong>
              <div style={{ fontSize: '0.8rem', color: '#94a3b8', marginTop: 4 }}>Clean, two-column layout</div>
            </button>
            
            <button 
              onClick={() => canAccessModern ? setTemplate('minimalist') : alert('Upgrade to JS Pro Resume to access this template.')}
              style={{ background: template === 'minimalist' ? 'rgba(0,119,182,0.2)' : 'rgba(255,255,255,0.05)', border: `1px solid ${template === 'minimalist' ? '#0077B6' : 'rgba(255,255,255,0.1)'}`, padding: '1rem', borderRadius: '12px', color: 'white', textAlign: 'left', cursor: canAccessModern ? 'pointer' : 'not-allowed', opacity: canAccessModern ? 1 : 0.5, position: 'relative' }}
            >
              {!canAccessModern && <div style={{ position: 'absolute', top: 10, right: 10, background: '#ef4444', color: 'white', fontSize: '0.65rem', padding: '2px 6px', borderRadius: 10, fontWeight: 'bold' }}>PRO</div>}
              <strong>Minimalist Template</strong>
              <div style={{ fontSize: '0.8rem', color: '#94a3b8', marginTop: 4 }}>Sleek and typography-focused</div>
            </button>
          </div>
        </div>

        {/* Preview Area */}
        <div style={{ flex: 1, padding: '2rem', overflowY: 'auto', display: 'flex', justifyContent: 'center', background: '#e2e8f0' }}>
           <div id="resume-preview-container" style={{ width: '210mm', minHeight: '297mm', background: 'white', boxShadow: '0 10px 25px rgba(0,0,0,0.2)', padding: '2rem', boxSizing: 'border-box' }}>
              {/* Simple inline rendering for now, can be extracted to separate components later */}
              
              {template === 'classic' && (
                <div style={{ fontFamily: 'Arial, sans-serif', color: '#333' }}>
                  <div style={{ textAlign: 'center', borderBottom: '2px solid #333', paddingBottom: '1rem', marginBottom: '1.5rem' }}>
                    <h1 style={{ margin: '0 0 0.5rem 0', fontSize: '2.5rem', color: '#000' }}>{candidate.name}</h1>
                    <div style={{ fontSize: '1rem', color: '#555' }}>
                      {candidate.email} | {candidate.phone} {candidate.location && `| ${candidate.location}`}
                    </div>
                  </div>
                  
                  {candidate.summary && (
                    <div style={{ marginBottom: '1.5rem' }}>
                      <h2 style={{ fontSize: '1.25rem', borderBottom: '1px solid #ccc', textTransform: 'uppercase', paddingBottom: '0.25rem', marginBottom: '0.5rem', color: '#000' }}>Summary</h2>
                      <p style={{ margin: 0, lineHeight: 1.6 }}>{candidate.summary}</p>
                    </div>
                  )}

                  {candidate.skills && (
                    <div style={{ marginBottom: '1.5rem' }}>
                      <h2 style={{ fontSize: '1.25rem', borderBottom: '1px solid #ccc', textTransform: 'uppercase', paddingBottom: '0.25rem', marginBottom: '0.5rem', color: '#000' }}>Skills</h2>
                      <p style={{ margin: 0, lineHeight: 1.6 }}>
                        {Array.isArray(candidate.skills) ? candidate.skills.join(', ') : candidate.skills}
                      </p>
                    </div>
                  )}

                  <div style={{ marginBottom: '1.5rem' }}>
                    <h2 style={{ fontSize: '1.25rem', borderBottom: '1px solid #ccc', textTransform: 'uppercase', paddingBottom: '0.25rem', marginBottom: '0.5rem', color: '#000' }}>Experience</h2>
                    {/* Add map for experience here */}
                    {candidate.experience ? (
                      <div style={{ marginBottom: '1rem' }}>
                         <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold' }}>
                            <span>{candidate.currentRole || 'Role'}</span>
                            <span>Present</span>
                         </div>
                         <div style={{ fontStyle: 'italic', marginBottom: '0.5rem' }}>{candidate.currentCompany || 'Company'}</div>
                      </div>
                    ) : <p>No experience listed.</p>}
                  </div>

                  <div style={{ marginBottom: '1.5rem' }}>
                    <h2 style={{ fontSize: '1.25rem', borderBottom: '1px solid #ccc', textTransform: 'uppercase', paddingBottom: '0.25rem', marginBottom: '0.5rem', color: '#000' }}>Education</h2>
                    {/* Add map for education here */}
                     {candidate.education ? (
                      <div style={{ marginBottom: '1rem' }}>
                         <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold' }}>
                            <span>Degree / Details</span>
                         </div>
                         <div style={{ fontStyle: 'italic', marginBottom: '0.5rem' }}>Institution Name</div>
                      </div>
                    ) : <p>No education listed.</p>}
                  </div>
                </div>
              )}

              {template === 'modern' && (
                <div style={{ fontFamily: '"Helvetica Neue", Helvetica, sans-serif', color: '#444' }}>
                  <div style={{ display: 'flex', background: '#0077B6', color: 'white', padding: '2rem', margin: '-2rem -2rem 2rem -2rem' }}>
                     <div style={{ flex: 1 }}>
                        <h1 style={{ margin: '0 0 0.5rem 0', fontSize: '3rem', fontWeight: 300 }}>{candidate.name}</h1>
                        <h2 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 400, opacity: 0.9 }}>{candidate.headline || candidate.currentRole || 'Professional'}</h2>
                     </div>
                     <div style={{ textAlign: 'right', fontSize: '0.9rem', opacity: 0.9, display: 'flex', flexDirection: 'column', gap: '0.25rem', justifyContent: 'flex-end' }}>
                        <div>{candidate.email}</div>
                        <div>{candidate.phone}</div>
                        {candidate.location && <div>{candidate.location}</div>}
                     </div>
                  </div>
                  
                  {/* Rest of modern template body */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '2rem' }}>
                     {/* Left Column */}
                     <div>
                        {candidate.skills && (
                          <div style={{ marginBottom: '2rem' }}>
                            <h3 style={{ color: '#0077B6', textTransform: 'uppercase', borderBottom: '2px solid #0077B6', paddingBottom: '0.5rem', marginBottom: '1rem' }}>Expertise</h3>
                            <ul style={{ paddingLeft: '1.2rem', margin: 0, lineHeight: 1.8 }}>
                               {(Array.isArray(candidate.skills) ? candidate.skills : [candidate.skills]).map((s:any, i:number) => (
                                 <li key={i}>{s}</li>
                               ))}
                            </ul>
                          </div>
                        )}
                        <div style={{ marginBottom: '2rem' }}>
                            <h3 style={{ color: '#0077B6', textTransform: 'uppercase', borderBottom: '2px solid #0077B6', paddingBottom: '0.5rem', marginBottom: '1rem' }}>Education</h3>
                            <div style={{ fontWeight: 'bold' }}>Degree Name</div>
                            <div style={{ fontSize: '0.9rem', color: '#666' }}>Institution Name</div>
                        </div>
                     </div>
                     {/* Right Column */}
                     <div>
                        {candidate.summary && (
                          <div style={{ marginBottom: '2rem' }}>
                            <h3 style={{ color: '#0077B6', textTransform: 'uppercase', borderBottom: '2px solid #0077B6', paddingBottom: '0.5rem', marginBottom: '1rem' }}>Profile</h3>
                            <p style={{ margin: 0, lineHeight: 1.6 }}>{candidate.summary}</p>
                          </div>
                        )}
                        <div style={{ marginBottom: '2rem' }}>
                            <h3 style={{ color: '#0077B6', textTransform: 'uppercase', borderBottom: '2px solid #0077B6', paddingBottom: '0.5rem', marginBottom: '1rem' }}>Experience</h3>
                            <div style={{ marginBottom: '1.5rem' }}>
                               <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '0.25rem' }}>
                                  <strong style={{ fontSize: '1.1rem' }}>{candidate.currentRole || 'Role Name'}</strong>
                                  <span style={{ fontSize: '0.85rem', color: '#666', fontWeight: 600 }}>Present</span>
                               </div>
                               <div style={{ color: '#0077B6', fontWeight: 500, marginBottom: '0.5rem' }}>{candidate.currentCompany || 'Company Name'}</div>
                               <p style={{ margin: 0, fontSize: '0.95rem', lineHeight: 1.6 }}>Detailed description of responsibilities and achievements in this role will go here. Pulled from candidate database.</p>
                            </div>
                        </div>
                     </div>
                  </div>
                </div>
              )}

              {template === 'minimalist' && (
                <div style={{ fontFamily: 'Georgia, serif', color: '#222' }}>
                  <div style={{ textAlign: 'left', marginBottom: '2rem' }}>
                    <h1 style={{ margin: '0 0 0.25rem 0', fontSize: '2.5rem', letterSpacing: '1px' }}>{candidate.name}</h1>
                    <div style={{ fontSize: '0.9rem', color: '#666', letterSpacing: '0.5px' }}>
                      {candidate.email} &nbsp; | &nbsp; {candidate.phone}
                    </div>
                  </div>
                  
                  {candidate.summary && (
                    <div style={{ marginBottom: '2rem' }}>
                      <p style={{ margin: 0, lineHeight: 1.8, fontSize: '1rem' }}>{candidate.summary}</p>
                    </div>
                  )}

                  <div style={{ marginBottom: '2rem' }}>
                    <h2 style={{ fontSize: '1.1rem', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '1rem', color: '#000' }}>Experience</h2>
                    <div style={{ marginBottom: '1.5rem' }}>
                       <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                          <strong style={{ fontSize: '1.05rem' }}>{candidate.currentRole || 'Role Name'}, {candidate.currentCompany || 'Company'}</strong>
                          <span style={{ fontSize: '0.9rem', color: '#666' }}>Present</span>
                       </div>
                       <p style={{ margin: 0, fontSize: '0.95rem', lineHeight: 1.6, color: '#444' }}>Key achievements and tasks for this specific role. The minimalist template focuses heavily on typography and clean spacing over colors and borders.</p>
                    </div>
                  </div>
                  
                  {candidate.skills && (
                    <div style={{ marginBottom: '2rem' }}>
                      <h2 style={{ fontSize: '1.1rem', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '1rem', color: '#000' }}>Skills</h2>
                      <p style={{ margin: 0, lineHeight: 1.8, fontSize: '0.95rem' }}>
                        {Array.isArray(candidate.skills) ? candidate.skills.join(' • ') : candidate.skills}
                      </p>
                    </div>
                  )}
                </div>
              )}
           </div>
        </div>
      </div>
    </div>
  );

  return createPortal(builderContent, document.body);
}
