import React from 'react';
import { ResumeData } from './ClassicTemplate';

const getProficiencyWidth = (prof: string) => {
  switch (prof.toLowerCase()) {
    case 'native': case 'native / bilingual': case 'native speaker': return '100%';
    case 'fluent': case 'fluent / advanced': return '80%';
    case 'intermediate': return '50%';
    case 'basic': return '20%';
    default: return '50%';
  }
};

export default function ModernTemplate({ data }: { data: ResumeData }) {
  const theme = data.themeColor || '#d97706'; // Default orange/amber
  
  const nameParts = data.name ? data.name.split(' ') : ['Name'];
  const firstName = nameParts[0];
  const lastName = nameParts.length > 1 ? nameParts.slice(1).join(' ') : '';

  return (
    <div style={{ fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif', color: '#333', lineHeight: 1.5, background: 'white', height: '100%' }}>
      {/* Top Color Bar */}
      <div style={{ height: '24px', width: '100%', background: theme, marginBottom: '20px' }}></div>
      
      <div style={{ padding: '0 10mm 10mm 10mm' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h1 style={{ margin: '0 0 10px 0', fontSize: '28pt', fontWeight: 'bold', letterSpacing: '2px', textTransform: 'uppercase' }}>
            <span style={{ color: '#666' }}>{firstName}</span> <span style={{ color: theme }}>{lastName}</span>
          </h1>
          <div style={{ fontSize: '9pt', color: '#444' }}>
            {data.location && <>{data.location} &nbsp;|&nbsp; </>}
            {data.phone} &nbsp;|&nbsp; {data.email}
          </div>
        </div>

        {/* Summary */}
        {data.summary && (
          <div style={{ marginBottom: '1.5rem', display: 'flex' }}>
            <div style={{ width: '120px', flexShrink: 0 }}>
              <h2 style={{ fontSize: '12pt', margin: 0, fontWeight: 'bold', color: theme }}>Summary</h2>
            </div>
            <div style={{ flex: 1, fontSize: '10pt', textAlign: 'justify' }}>
              {data.summary}
            </div>
          </div>
        )}

        {/* Skills */}
        {data.skills && data.skills.length > 0 && (
          <div style={{ marginBottom: '1.5rem', display: 'flex' }}>
            <div style={{ width: '120px', flexShrink: 0 }}>
              <h2 style={{ fontSize: '12pt', margin: 0, fontWeight: 'bold', color: theme }}>Skills</h2>
            </div>
            <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', fontSize: '10pt' }}>
              <ul style={{ margin: 0, paddingLeft: '1.2rem' }}>
                {data.skills.slice(0, Math.ceil(data.skills.length / 2)).map((s, i) => (
                  <li key={i}>{s}</li>
                ))}
              </ul>
              <ul style={{ margin: 0, paddingLeft: '1.2rem' }}>
                {data.skills.slice(Math.ceil(data.skills.length / 2)).map((s, i) => (
                  <li key={i}>{s}</li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* Experience */}
        {data.experience && data.experience.length > 0 && (
          <div style={{ marginBottom: '1.5rem', display: 'flex' }}>
            <div style={{ width: '120px', flexShrink: 0 }}>
              <h2 style={{ fontSize: '12pt', margin: 0, fontWeight: 'bold', color: theme }}>Experience</h2>
            </div>
            <div style={{ flex: 1 }}>
              {data.experience.map((exp, i) => (
                <div key={i} style={{ marginBottom: '1rem', fontSize: '10pt' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '4px' }}>
                    <div>
                      <span style={{ fontWeight: 'bold' }}>{exp.role}</span>
                      <br/>
                      <span style={{ fontWeight: '600' }}>{exp.company}</span>
                    </div>
                    <div style={{ fontSize: '9pt', color: '#555', textAlign: 'right' }}>
                      {exp.from} - {exp.current ? 'Current' : exp.to}
                    </div>
                  </div>
                  <ul style={{ margin: 0, paddingLeft: '1rem', marginTop: '6px' }}>
                    <li>Successfully handled day-to-day operations and management.</li>
                    <li>Collaborated with team members to ensure maximum productivity.</li>
                  </ul>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Education */}
        {data.education && data.education.length > 0 && (
          <div style={{ marginBottom: '1.5rem', display: 'flex' }}>
            <div style={{ width: '120px', flexShrink: 0 }}>
              <h2 style={{ fontSize: '12pt', margin: 0, fontWeight: 'bold', color: theme }}>Education and Training</h2>
            </div>
            <div style={{ flex: 1 }}>
              {data.education.map((edu, i) => (
                <div key={i} style={{ marginBottom: '0.5rem', fontSize: '10pt', display: 'flex', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ fontWeight: 'bold' }}>{edu.degree}</div>
                    <div>{edu.college}</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div>{edu.year}</div>
                    {edu.cgpa && <div style={{ fontSize: '9pt', color: '#555' }}>CGPA: {edu.cgpa}</div>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Languages */}
        {data.languages && data.languages.length > 0 && (
          <div style={{ marginBottom: '1.5rem', display: 'flex' }}>
            <div style={{ width: '120px', flexShrink: 0 }}>
              <h2 style={{ fontSize: '12pt', margin: 0, fontWeight: 'bold', color: theme }}>Languages</h2>
            </div>
            <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', fontSize: '10pt' }}>
              {data.languages.map((lang, i) => (
                <div key={i}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <span style={{ fontWeight: 'bold' }}>{lang.language}:</span>
                    <span style={{ fontSize: '9pt', color: '#555' }}>{lang.proficiency}</span>
                  </div>
                  {lang.proficiency.toLowerCase() !== 'native speaker' && lang.proficiency.toLowerCase() !== 'native / bilingual' && lang.proficiency.toLowerCase() !== 'native' && (
                    <div style={{ height: '4px', background: '#e5e7eb', width: '100%', borderRadius: '2px' }}>
                      <div style={{ height: '100%', background: theme, width: getProficiencyWidth(lang.proficiency), borderRadius: '2px' }}></div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
