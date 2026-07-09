import React from 'react';

export default function PrintableEnrollmentForm({ candidate }: { candidate: any }) {
  if (!candidate) return null;

  const skills = (() => {
    try {
      return typeof candidate.skills === 'string' ? JSON.parse(candidate.skills) : candidate.skills || [];
    } catch {
      return [];
    }
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
            .print-header { border-bottom: 2px solid #0ea5e9; padding-bottom: 15px; margin-bottom: 30px; }
            h1, h2, h3 { margin: 0 0 10px 0; color: #0f172a; }
            p { margin: 5px 0; font-size: 14px; line-height: 1.5; }
            .label { font-weight: bold; color: #475569; width: 150px; display: inline-block; }
            .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
            .tag { display: inline-block; background: #e2e8f0; padding: 4px 10px; border-radius: 12px; font-size: 12px; margin: 4px 4px 0 0; }
          }
        `}
      </style>
      
      <div className="print-header">
        <h1>Candidate Enrollment Profile</h1>
        <p>Generated on: {new Date().toLocaleDateString()}</p>
      </div>

      <div className="print-section grid">
        <div>
          <h2>Personal Details</h2>
          <p><span className="label">Name:</span> {candidate.name}</p>
          <p><span className="label">Email:</span> {candidate.email}</p>
          <p><span className="label">Phone:</span> {candidate.phone}</p>
          <p><span className="label">Location:</span> {candidate.location || 'Not specified'}</p>
        </div>
        <div>
          <h2>Professional Summary</h2>
          <p><span className="label">Headline:</span> {candidate.headline || 'Not specified'}</p>
          <p><span className="label">Expected Salary:</span> {candidate.expectedSalary || 'Not specified'}</p>
          <p><span className="label">Preferred Roles:</span> {candidate.preferredRoles || 'Not specified'}</p>
        </div>
      </div>

      {(candidate.currentCompany || candidate.currentRole || candidate.experience) && (
        <div className="print-section">
          <h2>Experience Details</h2>
          {candidate.currentCompany && <p><span className="label">Current Company:</span> {candidate.currentCompany}</p>}
          {candidate.currentRole && <p><span className="label">Current Role:</span> {candidate.currentRole}</p>}
          {candidate.experience && <p><span className="label">Experience Notes:</span> {candidate.experience}</p>}
        </div>
      )}

      {candidate.education && (
        <div className="print-section">
          <h2>Education Details</h2>
          <p>{candidate.education}</p>
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
      )}

      {candidate.summary && (
        <div className="print-section">
          <h2>About Me</h2>
          <p>{candidate.summary}</p>
        </div>
      )}
    </div>
  );
}
