import React from 'react';
import { ResumeData } from './ClassicTemplate';

export default function ProfessionalTemplate({ data }: { data: ResumeData }) {
  return (
    <div style={{ fontFamily: 'Arial, sans-serif', color: '#1f2937', lineHeight: 1.6, background: 'white', padding: '12mm', height: '100%', boxSizing: 'border-box' }}>
      
      {/* Header Area */}
      <div style={{ textAlign: 'center', marginBottom: '20px' }}>
        <h1 style={{ fontSize: '26pt', fontWeight: 'bold', margin: '0 0 8px 0', textTransform: 'uppercase', color: data.themeColor || '#111827' }}>
          {data.name}
        </h1>
        <div style={{ fontSize: '10pt', color: '#4b5563', display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '8px' }}>
          {data.location && <span>{data.location} &bull;</span>}
          {data.phone && <span>{data.phone} &bull;</span>}
          {data.email && <span>{data.email}</span>}
        </div>
      </div>

      {/* Professional Summary */}
      {data.summary && (
        <div style={{ marginBottom: '18px' }}>
          <h2 style={{ fontSize: '12pt', fontWeight: 'bold', color: data.themeColor || '#111827', margin: '0 0 8px 0', borderBottom: `2px solid ${data.themeColor || '#111827'}`, paddingBottom: '4px', textTransform: 'uppercase' }}>
            Professional Summary
          </h2>
          <p style={{ margin: 0, fontSize: '10pt', textAlign: 'justify' }}>
            {data.summary}
          </p>
        </div>
      )}

      {/* Core Competencies / Skills */}
      {data.skills && data.skills.length > 0 && (
        <div style={{ marginBottom: '18px' }}>
          <h2 style={{ fontSize: '12pt', fontWeight: 'bold', color: data.themeColor || '#111827', margin: '0 0 8px 0', borderBottom: `2px solid ${data.themeColor || '#111827'}`, paddingBottom: '4px', textTransform: 'uppercase' }}>
            Core Competencies
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '6px', fontSize: '10pt' }}>
            {data.skills.map((s, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ color: data.themeColor || '#111827', fontSize: '14pt', lineHeight: 1 }}>&bull;</span> {s}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Professional Experience */}
      {data.experience && data.experience.length > 0 && (
        <div style={{ marginBottom: '18px' }}>
          <h2 style={{ fontSize: '12pt', fontWeight: 'bold', color: data.themeColor || '#111827', margin: '0 0 8px 0', borderBottom: `2px solid ${data.themeColor || '#111827'}`, paddingBottom: '4px', textTransform: 'uppercase' }}>
            Professional Experience
          </h2>
          {data.experience.map((exp, i) => (
            <div key={i} style={{ marginBottom: '14px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                <div style={{ fontSize: '11pt', fontWeight: 'bold', color: '#111827' }}>{exp.role}</div>
                <div style={{ fontSize: '10pt', fontWeight: 'bold', color: '#4b5563' }}>{exp.from} &ndash; {exp.current ? 'Present' : exp.to}</div>
              </div>
              <div style={{ fontSize: '10.5pt', fontStyle: 'italic', color: '#374151', marginBottom: '6px' }}>{exp.company}</div>
              <ul style={{ margin: 0, paddingLeft: '18px', fontSize: '10pt', color: '#374151' }}>
                <li>Managed daily operations and coordinated with cross-functional teams to ensure efficiency.</li>
                <li>Maintained high standards of quality and met strict KPIs through disciplined processes.</li>
              </ul>
            </div>
          ))}
        </div>
      )}

      {/* Education */}
      {data.education && data.education.length > 0 && (
        <div style={{ marginBottom: '18px' }}>
          <h2 style={{ fontSize: '12pt', fontWeight: 'bold', color: data.themeColor || '#111827', margin: '0 0 8px 0', borderBottom: `2px solid ${data.themeColor || '#111827'}`, paddingBottom: '4px', textTransform: 'uppercase' }}>
            Education
          </h2>
          {data.education.map((edu, i) => (
            <div key={i} style={{ marginBottom: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
              <div>
                <div style={{ fontSize: '11pt', fontWeight: 'bold', color: '#111827' }}>{edu.degree}</div>
                <div style={{ fontSize: '10pt', color: '#374151' }}>{edu.college}</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '10pt', fontWeight: 'bold', color: '#4b5563' }}>{edu.year}</div>
                {edu.cgpa && <div style={{ fontSize: '9.5pt', color: '#6b7280' }}>CGPA / % : {edu.cgpa}</div>}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Languages */}
      {data.languages && data.languages.length > 0 && (
        <div>
          <h2 style={{ fontSize: '12pt', fontWeight: 'bold', color: data.themeColor || '#111827', margin: '0 0 8px 0', borderBottom: `2px solid ${data.themeColor || '#111827'}`, paddingBottom: '4px', textTransform: 'uppercase' }}>
            Languages
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px', fontSize: '10pt', color: '#374151' }}>
            {data.languages.map((lang, i) => (
              <div key={i}>
                <strong>{lang.language}</strong> <br />
                <span style={{ fontSize: '9pt', color: '#6b7280' }}>{lang.proficiency}</span>
              </div>
            ))}
          </div>
        </div>
      )}
      
    </div>
  );
}
