import React from 'react';

export default function PrintableEnrollmentForm({ candidate }: { candidate: any }) {
  if (!candidate) return null;

  const skills = candidate.skillsArr || (() => {
    try {
      return typeof candidate.skills === 'string' ? JSON.parse(candidate.skills) : candidate.skills || [];
    } catch {
      return [];
    }
  })();

  const educations = candidate.educations || (() => {
    try {
      return typeof candidate.education === 'string' ? JSON.parse(candidate.education) : [];
    } catch { return []; }
  })();

  const experiences = candidate.experiences || (() => {
    try {
      return typeof candidate.experience === 'string' ? JSON.parse(candidate.experience) : [];
    } catch { return []; }
  })();

  return (
    <div id="printable-enrollment-form" style={{ display: 'none' }}>
      <style>
        {`
          @media print {
            body * { visibility: hidden; }
            #printable-enrollment-form, #printable-enrollment-form * { visibility: visible; }
            #printable-enrollment-form { 
              display: block !important; 
              position: absolute; 
              left: 0; 
              top: 0; 
              width: 100%; 
              padding: 40px; 
              font-family: Arial, sans-serif;
              color: #000;
              background: white;
            }
            .print-section { margin-bottom: 30px; }
            .print-header { border-bottom: 2px solid #0ea5e9; padding-bottom: 15px; margin-bottom: 30px; display: flex; justify-content: space-between; alignItems: center; }
            h1 { margin: 0 0 5px 0; color: #0f172a; font-size: 28px; }
            h2 { margin: 0 0 15px 0; color: #0f172a; font-size: 18px; border-bottom: 1px solid #ccc; padding-bottom: 5px; }
            p { margin: 6px 0; font-size: 14px; line-height: 1.5; }
            .label { font-weight: bold; color: #475569; width: 140px; display: inline-block; }
            .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
            .tag { display: inline-block; background: #e2e8f0; padding: 6px 12px; border-radius: 6px; font-size: 13px; margin: 0 6px 6px 0; border: 1px solid #cbd5e1; }
            .item-block { margin-bottom: 15px; padding-bottom: 15px; border-bottom: 1px dashed #e2e8f0; }
            .item-block:last-child { border-bottom: none; margin-bottom: 0; padding-bottom: 0; }
          }
        `}
      </style>

      <div className="print-header">
        <div>
          <h1>Candidate Enrollment Profile</h1>
          <p style={{ color: '#64748b' }}>Generated on: {new Date().toLocaleDateString()}</p>
        </div>
        {candidate.photoUrl && (
          <img src={candidate.photoUrl} alt="Photo" style={{ width: 100, height: 130, objectFit: 'cover', border: '2px solid #0ea5e9', borderRadius: 8 }} />
        )}
      </div>

      <div className="print-section grid">
        <div>
          <h2>Personal Details</h2>
          <p><span className="label">Name:</span> {candidate.name || 'Not specified'}</p>
          <p><span className="label">Email:</span> {candidate.email || 'Not specified'}</p>
          <p><span className="label">Phone:</span> {candidate.phone || 'Not specified'}</p>
          <p><span className="label">Location:</span> {(() => {
            if (!candidate.location) return 'Not specified';
            try {
              if (candidate.location.startsWith('{')) {
                const loc = JSON.parse(candidate.location);
                return [loc.address, loc.city, loc.district, loc.state].filter(Boolean).join(', ');
              }
              return candidate.location;
            } catch {
              return candidate.location;
            }
          })()}</p>
        </div>
        <div>
          <h2>Professional Summary</h2>
          <p><span className="label">Headline:</span> {candidate.headline || 'Not specified'}</p>
          <p><span className="label">Expected Salary:</span> {candidate.expectedSalary || 'Not specified'}</p>
          <p><span className="label">Preferred Roles:</span> {candidate.preferredRoles || 'Not specified'}</p>
        </div>
      </div>

      {educations.length > 0 && educations[0].degree && (
        <div className="print-section">
          <h2>Education Details</h2>
          {educations.map((edu: any, i: number) => (
            <div key={i} className="item-block">
              <p style={{ fontSize: '16px', fontWeight: 'bold' }}>{edu.degree}</p>
              <p>{edu.college}</p>
              <p style={{ color: '#475569', fontSize: '13px' }}>Year: {edu.year || 'N/A'} | CGPA/Percentage: {edu.cgpa || 'N/A'}</p>
            </div>
          ))}
        </div>
      )}

      {(experiences.length > 0 && experiences[0].role) && (
        <div className="print-section">
          <h2>Experience Details</h2>
          {experiences.map((exp: any, i: number) => (
            <div key={i} className="item-block">
              <p style={{ fontSize: '16px', fontWeight: 'bold' }}>{exp.role} <span style={{ fontWeight: 'normal', color: '#475569' }}>at</span> {exp.company}</p>
              <p style={{ color: '#475569', fontSize: '13px' }}>Duration: {exp.from} - {exp.current ? 'Present' : exp.to}</p>
            </div>
          ))}
        </div>
      )}

      {skills.length > 0 && (
        <div className="print-section">
          <h2>Key Skills</h2>
          <div>
            {skills.map((skill: string) => (
              <span key={skill} className="tag">{skill}</span>
            ))}
          </div>
        </div>
      )}\n\n      {(() => {
        const langs = (() => {
          try {
            const l = candidate.languages || candidate.languagesArr;
            if (!l) return [];
            if (Array.isArray(l)) return l;
            const parsed = JSON.parse(l);
            return Array.isArray(parsed) ? parsed : [];
          } catch { return []; }
        })();
        if (langs.length === 0) return null;
        return (
          <div className="print-section">
            <h2>Languages</h2>
            <div>
              {langs.map((l: any, i: number) => (
                <span key={i} className="tag">{l.language} - {l.proficiency}</span>
              ))}
            </div>
          </div>
        );
      })()}

      {candidate.summary && (
        <div className="print-section">
          <h2>About Me</h2>
          <p style={{ whiteSpace: 'pre-wrap' }}>{candidate.summary}</p>
        </div>
      )}
    </div>
  );
}
