import React from 'react';
import { ResumeData } from './ClassicTemplate';
import { Phone, Mail, MapPin, Globe } from 'lucide-react';

const getProficiencyWidth = (prof: string) => {
  switch (prof.toLowerCase()) {
    case 'native': case 'native / bilingual': case 'native speaker': return '100%';
    case 'fluent': case 'fluent / advanced': return '80%';
    case 'intermediate': return '50%';
    case 'basic': return '20%';
    default: return '50%';
  }
};

export default function MinimalistTemplate({ data }: { data: ResumeData }) {
  const theme = data.themeColor || '#eab308'; // Default yellow
  
  return (
    <div style={{ fontFamily: '"Inter", "Segoe UI", sans-serif', color: '#111', background: 'white', height: '100%' }}>
      {/* Top Header Block */}
      <div style={{ background: '#f3f4f6', padding: '15mm', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ margin: '0 0 5px 0', fontSize: '28pt', fontWeight: 'bold', letterSpacing: '4px', textTransform: 'uppercase', lineHeight: 1.1 }}>
            {data.name}
          </h1>
          <div style={{ fontSize: '11pt', letterSpacing: '2px', textTransform: 'uppercase', fontWeight: '600', color: '#555' }}>
            {data.headline || 'Professional'}
          </div>
        </div>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '8pt', color: '#444' }}>
          {data.phone && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ background: theme, padding: '4px', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '20px', height: '20px' }}>
                <Phone size={12} color="white" />
              </div>
              <span style={{ borderBottom: '1px solid #ccc', paddingBottom: '2px', flex: 1 }}>{data.phone}</span>
            </div>
          )}
          {data.email && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ background: theme, padding: '4px', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '20px', height: '20px' }}>
                <Mail size={12} color="white" />
              </div>
              <span style={{ borderBottom: '1px solid #ccc', paddingBottom: '2px', flex: 1 }}>{data.email}</span>
            </div>
          )}
          {data.location && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ background: theme, padding: '4px', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '20px', height: '20px' }}>
                <MapPin size={12} color="white" />
              </div>
              <span style={{ borderBottom: '1px solid #ccc', paddingBottom: '2px', flex: 1 }}>{data.location}</span>
            </div>
          )}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '2rem', padding: '10mm 15mm' }}>
        {/* Left Column */}
        <div>
          {/* About Me */}
          {data.summary && (
            <div style={{ marginBottom: '2rem' }}>
              <h2 style={{ fontSize: '11pt', textTransform: 'uppercase', letterSpacing: '2px', borderBottom: '2px solid #000', paddingBottom: '6px', marginBottom: '1rem', fontWeight: 'bold' }}>About Me</h2>
              <p style={{ margin: 0, fontSize: '9pt', lineHeight: 1.6, color: '#555', textAlign: 'justify' }}>{data.summary}</p>
            </div>
          )}

          {/* Experience */}
          {data.experience && data.experience.length > 0 && (
            <div style={{ marginBottom: '2rem' }}>
              <h2 style={{ fontSize: '11pt', textTransform: 'uppercase', letterSpacing: '2px', borderBottom: '2px solid #000', paddingBottom: '6px', marginBottom: '1.5rem', fontWeight: 'bold' }}>Experience</h2>
              
              <div style={{ position: 'relative' }}>
                {/* Timeline line */}
                <div style={{ position: 'absolute', left: '4px', top: '5px', bottom: '0', width: '1px', background: '#ccc' }}></div>
                
                {data.experience.map((exp, i) => (
                  <div key={i} style={{ position: 'relative', paddingLeft: '20px', marginBottom: '1.5rem' }}>
                    <div style={{ position: 'absolute', left: '0', top: '5px', width: '9px', height: '9px', borderRadius: '50%', background: '#000' }}></div>
                    <div style={{ fontSize: '8pt', color: '#666', fontWeight: 'bold', marginBottom: '4px' }}>{exp.from} - {exp.current ? 'Present' : exp.to}</div>
                    <div style={{ fontSize: '10pt', fontWeight: 'bold', textTransform: 'uppercase' }}>{exp.role}</div>
                    <div style={{ fontSize: '9pt', color: '#555', fontStyle: 'italic', marginBottom: '8px' }}>{exp.company}</div>
                    <ul style={{ margin: 0, paddingLeft: '1.2rem', fontSize: '9pt', color: '#555', lineHeight: 1.5 }}>
                      <li>Successfully accomplished key project deliverables and goals.</li>
                      <li>Maintained high standards of work and communication.</li>
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column */}
        <div>
          {/* Education */}
          {data.education && data.education.length > 0 && (
            <div style={{ marginBottom: '2rem' }}>
              <h2 style={{ fontSize: '11pt', textTransform: 'uppercase', letterSpacing: '2px', borderBottom: '2px solid #000', paddingBottom: '6px', marginBottom: '1rem', fontWeight: 'bold' }}>Education</h2>
              {data.education.map((edu, i) => (
                <div key={i} style={{ marginBottom: '1rem' }}>
                  <div style={{ fontSize: '9pt', fontWeight: 'bold', textTransform: 'uppercase' }}>{edu.degree}</div>
                  <div style={{ fontSize: '8pt', color: '#555' }}>{edu.college}</div>
                  <div style={{ fontSize: '8pt', color: '#888', marginTop: '2px' }}>{edu.year} {edu.cgpa && `| CGPA: ${edu.cgpa}`}</div>
                </div>
              ))}
            </div>
          )}

          {/* Skills */}
          {data.skills && data.skills.length > 0 && (
            <div style={{ marginBottom: '2rem' }}>
              <h2 style={{ fontSize: '11pt', textTransform: 'uppercase', letterSpacing: '2px', borderBottom: '2px solid #000', paddingBottom: '6px', marginBottom: '1rem', fontWeight: 'bold' }}>Skills</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {data.skills.map((skill, i) => (
                  <div key={i}>
                    <div style={{ fontSize: '8.5pt', marginBottom: '4px' }}>{skill}</div>
                    <div style={{ height: '3px', background: '#eee', width: '100%' }}>
                      <div style={{ height: '100%', background: '#000', width: `${60 + (i % 3) * 15}%` }}></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Languages */}
          {data.languages && data.languages.length > 0 && (
            <div style={{ marginBottom: '2rem' }}>
              <h2 style={{ fontSize: '11pt', textTransform: 'uppercase', letterSpacing: '2px', borderBottom: '2px solid #000', paddingBottom: '6px', marginBottom: '1rem', fontWeight: 'bold' }}>Languages</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {data.languages.map((lang, i) => (
                  <div key={i}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '8.5pt', marginBottom: '4px' }}>
                      <span>{lang.language}</span>
                      <span style={{ color: '#666' }}>{lang.proficiency}</span>
                    </div>
                    {lang.proficiency.toLowerCase() !== 'native speaker' && lang.proficiency.toLowerCase() !== 'native / bilingual' && lang.proficiency.toLowerCase() !== 'native' && (
                      <div style={{ height: '3px', background: '#eee', width: '100%' }}>
                        <div style={{ height: '100%', background: '#000', width: getProficiencyWidth(lang.proficiency) }}></div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
