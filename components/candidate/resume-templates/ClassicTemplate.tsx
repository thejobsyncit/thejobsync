import React from 'react';

export interface ResumeData {
  name: string;
  email: string;
  phone: string;
  location: string;
  headline: string;
  summary: string;
  skills: string[];
  languages: { language: string, proficiency: string }[];
  education: { degree: string, college: string, year: string, cgpa: string }[];
  experience: { company: string, role: string, from: string, to: string, current: boolean }[];
  themeColor?: string;
}

const getProficiencyWidth = (prof: string) => {
  switch (prof.toLowerCase()) {
    case 'native': case 'native / bilingual': case 'native speaker': return '100%';
    case 'fluent': case 'fluent / advanced': return '80%';
    case 'intermediate': return '50%';
    case 'basic': return '20%';
    default: return '50%';
  }
};

export default function ClassicTemplate({ data }: { data: ResumeData }) {
  const initials = data.name ? data.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() : 'CV';

  return (
    <div style={{ fontFamily: 'Georgia, serif', color: '#222', lineHeight: 1.5, background: 'white', padding: '10mm', height: '100%' }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
        <div style={{ width: '60px', height: '60px', borderRadius: '50%', border: '1px solid #333', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 10px', fontSize: '1.5rem', letterSpacing: '2px' }}>
          {initials}
        </div>
        <h1 style={{ margin: '0 0 10px 0', fontSize: '24pt', fontWeight: 'normal', letterSpacing: '4px', textTransform: 'uppercase' }}>
          {data.name}
        </h1>
        <div style={{ fontSize: '9pt', color: '#444' }}>
          {data.email} | {data.phone} {data.location ? `| ${data.location}` : ''}
        </div>
      </div>

      {/* Summary */}
      {data.summary && (
        <div style={{ marginBottom: '1.2rem' }}>
          <div style={{ borderBottom: '1px solid #ccc', marginBottom: '10px' }}>
            <h2 style={{ fontSize: '11pt', margin: '0 0 5px 0', fontWeight: 'bold', color: '#000' }}>Summary</h2>
          </div>
          <p style={{ margin: 0, fontSize: '10pt', textAlign: 'justify' }}>{data.summary}</p>
        </div>
      )}

      {/* Skills */}
      {data.skills && data.skills.length > 0 && (
        <div style={{ marginBottom: '1.2rem' }}>
          <div style={{ borderBottom: '1px solid #ccc', marginBottom: '10px' }}>
            <h2 style={{ fontSize: '11pt', margin: '0 0 5px 0', fontWeight: 'bold', color: '#000' }}>Skills</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', fontSize: '10pt' }}>
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
        <div style={{ marginBottom: '1.2rem' }}>
          <div style={{ borderBottom: '1px solid #ccc', marginBottom: '10px' }}>
            <h2 style={{ fontSize: '11pt', margin: '0 0 5px 0', fontWeight: 'bold', color: '#000' }}>Experience</h2>
          </div>
          {data.experience.map((exp, i) => (
            <div key={i} style={{ display: 'flex', marginBottom: '1rem', fontSize: '10pt' }}>
              <div style={{ width: '30%', paddingRight: '1rem' }}>
                <div style={{ fontWeight: 'bold' }}>{exp.company}</div>
                <div style={{ fontStyle: 'italic' }}>{exp.role}</div>
                <div style={{ fontSize: '9pt', color: '#555' }}>{exp.from} - {exp.current ? 'Current' : exp.to}</div>
              </div>
              <div style={{ width: '70%' }}>
                <ul style={{ margin: 0, paddingLeft: '1rem' }}>
                  <li>Demonstrated strong performance and achieved notable results in this position.</li>
                  <li>Worked closely with cross-functional teams to meet project deliverables.</li>
                </ul>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Education */}
      {data.education && data.education.length > 0 && (
        <div style={{ marginBottom: '1.2rem' }}>
          <div style={{ borderBottom: '1px solid #ccc', marginBottom: '10px' }}>
            <h2 style={{ fontSize: '11pt', margin: '0 0 5px 0', fontWeight: 'bold', color: '#000' }}>Education and Training</h2>
          </div>
          {data.education.map((edu, i) => (
            <div key={i} style={{ marginBottom: '0.5rem', fontSize: '10pt', display: 'flex', justifyContent: 'space-between' }}>
              <div>
                <div style={{ fontWeight: 'bold' }}>{edu.degree}</div>
                <div style={{ color: '#444' }}>{edu.college}</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div>{edu.year}</div>
                {edu.cgpa && <div style={{ fontSize: '9pt', color: '#555' }}>CGPA: {edu.cgpa}</div>}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Languages */}
      {data.languages && data.languages.length > 0 && (
        <div>
          <div style={{ borderBottom: '1px solid #ccc', marginBottom: '10px' }}>
            <h2 style={{ fontSize: '11pt', margin: '0 0 5px 0', fontWeight: 'bold', color: '#000' }}>Languages</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', fontSize: '10pt' }}>
            {data.languages.map((lang, i) => (
              <div key={i}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <span style={{ fontWeight: 'bold' }}>{lang.language}:</span>
                  <span style={{ fontSize: '9pt', color: '#555' }}>{lang.proficiency}</span>
                </div>
                {lang.proficiency.toLowerCase() !== 'native speaker' && lang.proficiency.toLowerCase() !== 'native / bilingual' && lang.proficiency.toLowerCase() !== 'native' && (
                  <div style={{ height: '4px', background: '#e5e7eb', width: '100%', borderRadius: '2px' }}>
                    <div style={{ height: '100%', background: '#555', width: getProficiencyWidth(lang.proficiency), borderRadius: '2px' }}></div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
