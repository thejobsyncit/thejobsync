import React, { useRef } from 'react';

export interface ResumeData {
  name: string;
  email: string;
  phone: string;
  location: string;
  headline: string;
  summary: string;
  skills: string[];
  languages: { language: string; proficiency: string }[];
  education: { degree: string; college: string; year: string; cgpa: string }[];
  experience: { company: string; role: string; from: string; to: string; current: boolean; description?: string }[];
  themeColor?: string;
}

const getProficiencyWidth = (prof: string) => {
  switch (prof?.toLowerCase()) {
    case 'native': case 'native / bilingual': case 'native speaker': return '100%';
    case 'fluent': case 'fluent / advanced': return '80%';
    case 'intermediate': return '50%';
    case 'basic': return '20%';
    default: return '50%';
  }
};

interface Props {
  data: ResumeData;
  onFieldChange?: (field: string, value: any) => void;
  editable?: boolean;
}

/* Inline editable span — click to edit, blur to save */
function EditableField({
  value,
  onChange,
  editable,
  multiline = false,
  style = {},
  placeholder = 'Click to edit...',
}: {
  value: string;
  onChange?: (val: string) => void;
  editable?: boolean;
  multiline?: boolean;
  style?: React.CSSProperties;
  placeholder?: string;
}) {
  const ref = useRef<HTMLSpanElement & HTMLTextAreaElement>(null);

  if (!editable) return <span style={style}>{value}</span>;

  const hoverStyle: React.CSSProperties = {
    outline: 'none',
    borderRadius: 3,
    cursor: 'text',
    minWidth: 40,
    display: 'inline-block',
    ...style,
  };

  return (
    <span
      ref={ref as any}
      contentEditable
      suppressContentEditableWarning
      onBlur={e => onChange?.(e.currentTarget.textContent || '')}
      style={hoverStyle}
      data-placeholder={placeholder}
      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(0,119,182,0.08)'; (e.currentTarget as HTMLElement).style.outline = '1px dashed #0077B6'; }}
      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = ''; (e.currentTarget as HTMLElement).style.outline = 'none'; }}
      onFocus={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(0,119,182,0.12)'; (e.currentTarget as HTMLElement).style.outline = '2px solid #0077B6'; }}
    >
      {value}
    </span>
  );
}

/* Add button shown when editable */
function AddButton({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      style={{
        background: 'none', border: '1px dashed #0077B6', color: '#0077B6',
        fontSize: '9pt', padding: '2px 8px', borderRadius: 4, cursor: 'pointer',
        marginTop: 4, display: 'inline-flex', alignItems: 'center', gap: 4,
      }}
    >
      + {label}
    </button>
  );
}

/* Delete button */
function DelButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      style={{
        background: '#fee2e2', border: 'none', color: '#dc2626',
        fontSize: '9pt', padding: '1px 5px', borderRadius: 4, cursor: 'pointer',
        marginLeft: 6, lineHeight: 1,
      }}
    >✕</button>
  );
}

export default function ClassicTemplate({ data, onFieldChange, editable }: Props) {
  const initials = data.name
    ? data.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()
    : 'CV';

  const updateExp = (idx: number, key: string, val: string) => {
    const updated = data.experience.map((e, i) => i === idx ? { ...e, [key]: val } : e);
    onFieldChange?.('experience', updated);
  };
  const deleteExp = (idx: number) => onFieldChange?.('experience', data.experience.filter((_, i) => i !== idx));
  const addExp = () => onFieldChange?.('experience', [...data.experience, { company: 'Company Name', role: 'Job Title', from: '2023', to: '', current: true, description: 'Describe your responsibilities here.' }]);

  const updateEdu = (idx: number, key: string, val: string) => {
    const updated = data.education.map((e, i) => i === idx ? { ...e, [key]: val } : e);
    onFieldChange?.('education', updated);
  };
  const deleteEdu = (idx: number) => onFieldChange?.('education', data.education.filter((_, i) => i !== idx));
  const addEdu = () => onFieldChange?.('education', [...data.education, { degree: 'Degree / Course', college: 'Institution Name', year: '2024', cgpa: '' }]);

  const updateSkill = (idx: number, val: string) => {
    const updated = data.skills.map((s, i) => i === idx ? val : s);
    onFieldChange?.('skills', updated);
  };
  const deleteSkill = (idx: number) => onFieldChange?.('skills', data.skills.filter((_, i) => i !== idx));
  const addSkill = () => onFieldChange?.('skills', [...data.skills, 'New Skill']);

  const updateLang = (idx: number, key: string, val: string) => {
    const updated = data.languages.map((l, i) => i === idx ? { ...l, [key]: val } : l);
    onFieldChange?.('languages', updated);
  };
  const deleteLang = (idx: number) => onFieldChange?.('languages', data.languages.filter((_, i) => i !== idx));
  const addLang = () => onFieldChange?.('languages', [...data.languages, { language: 'Language', proficiency: 'Intermediate' }]);

  return (
    <div style={{ fontFamily: 'Georgia, serif', color: '#222', lineHeight: 1.5, background: 'white', padding: '10mm' }}>

      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
        <div style={{ width: '60px', height: '60px', borderRadius: '50%', border: '1px solid #333', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 10px', fontSize: '1.5rem', letterSpacing: '2px' }}>
          {initials}
        </div>
        <h1 style={{ margin: '0 0 6px 0', fontSize: '22pt', fontWeight: 'normal', letterSpacing: '4px', textTransform: 'uppercase' }}>
          <EditableField value={data.name} onChange={v => onFieldChange?.('name', v)} editable={editable} placeholder="Your Name" />
        </h1>
        {editable && (
          <div style={{ fontSize: '9pt', color: '#0077B6', marginBottom: 4, fontStyle: 'italic' }}>
            <EditableField value={data.headline} onChange={v => onFieldChange?.('headline', v)} editable={editable} placeholder="Your Professional Title" />
          </div>
        )}
        <div style={{ fontSize: '9pt', color: '#444' }}>
          <EditableField value={data.email} onChange={v => onFieldChange?.('email', v)} editable={editable} placeholder="email@example.com" />
          {' | '}
          <EditableField value={data.phone} onChange={v => onFieldChange?.('phone', v)} editable={editable} placeholder="+91 00000 00000" />
          {data.location && (
            <> {' | '}
              <EditableField value={data.location} onChange={v => onFieldChange?.('location', v)} editable={editable} placeholder="City, State" />
            </>
          )}
        </div>
      </div>

      {/* Summary */}
      <div style={{ marginBottom: '1.2rem' }}>
        <div style={{ borderBottom: '1px solid #ccc', marginBottom: '8px' }}>
          <h2 style={{ fontSize: '11pt', margin: '0 0 4px 0', fontWeight: 'bold', color: '#000' }}>Summary</h2>
        </div>
        <div style={{ fontSize: '10pt', textAlign: 'justify' }}>
          <EditableField
            value={data.summary || (editable ? 'Click here to write your professional summary...' : '')}
            onChange={v => onFieldChange?.('summary', v)}
            editable={editable}
            multiline
            placeholder="Write your professional summary..."
            style={{ display: 'block', width: '100%' }}
          />
        </div>
      </div>

      {/* Experience */}
      <div style={{ marginBottom: '1.2rem' }}>
        <div style={{ borderBottom: '1px solid #ccc', marginBottom: '8px' }}>
          <h2 style={{ fontSize: '11pt', margin: '0 0 4px 0', fontWeight: 'bold', color: '#000' }}>Experience</h2>
        </div>
        {data.experience && data.experience.map((exp, i) => (
          <div key={i} style={{ display: 'flex', marginBottom: '0.9rem', fontSize: '10pt', position: 'relative' }}>
            {editable && <DelButton onClick={() => deleteExp(i)} />}
            <div style={{ width: '30%', paddingRight: '1rem' }}>
              <div style={{ fontWeight: 'bold' }}>
                <EditableField value={exp.company} onChange={v => updateExp(i, 'company', v)} editable={editable} placeholder="Company Name" />
              </div>
              <div style={{ fontStyle: 'italic' }}>
                <EditableField value={exp.role} onChange={v => updateExp(i, 'role', v)} editable={editable} placeholder="Job Title" />
              </div>
              <div style={{ fontSize: '9pt', color: '#555' }}>
                <EditableField value={exp.from} onChange={v => updateExp(i, 'from', v)} editable={editable} placeholder="2020" />
                {' - '}
                {exp.current
                  ? 'Current'
                  : <EditableField value={exp.to} onChange={v => updateExp(i, 'to', v)} editable={editable} placeholder="2023" />
                }
              </div>
            </div>
            <div style={{ width: '70%' }}>
              <EditableField
                value={exp.description || 'Describe your key responsibilities and achievements.'}
                onChange={v => updateExp(i, 'description', v)}
                editable={editable}
                multiline
                style={{ display: 'block', fontSize: '9.5pt' }}
              />
            </div>
          </div>
        ))}
        {editable && <AddButton label="Add Experience" onClick={addExp} />}
      </div>

      {/* Education */}
      <div style={{ marginBottom: '1.2rem' }}>
        <div style={{ borderBottom: '1px solid #ccc', marginBottom: '8px' }}>
          <h2 style={{ fontSize: '11pt', margin: '0 0 4px 0', fontWeight: 'bold', color: '#000' }}>Education and Training</h2>
        </div>
        {data.education && data.education.map((edu, i) => (
          <div key={i} style={{ marginBottom: '0.5rem', fontSize: '10pt', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 4 }}>
              {editable && <DelButton onClick={() => deleteEdu(i)} />}
              <div>
                <div style={{ fontWeight: 'bold' }}>
                  <EditableField value={edu.degree} onChange={v => updateEdu(i, 'degree', v)} editable={editable} placeholder="Degree / Course" />
                </div>
                <div style={{ color: '#444' }}>
                  <EditableField value={edu.college} onChange={v => updateEdu(i, 'college', v)} editable={editable} placeholder="Institution Name" />
                </div>
              </div>
            </div>
            <div style={{ textAlign: 'right', flexShrink: 0 }}>
              <div><EditableField value={edu.year} onChange={v => updateEdu(i, 'year', v)} editable={editable} placeholder="2024" /></div>
              {edu.cgpa && (
                <div style={{ fontSize: '9pt', color: '#555' }}>
                  CGPA: <EditableField value={edu.cgpa} onChange={v => updateEdu(i, 'cgpa', v)} editable={editable} />
                </div>
              )}
            </div>
          </div>
        ))}
        {editable && <AddButton label="Add Education" onClick={addEdu} />}
      </div>

      {/* Skills */}
      {((data.skills && data.skills.length > 0) || editable) && (
        <div style={{ marginBottom: '1.2rem' }}>
          <div style={{ borderBottom: '1px solid #ccc', marginBottom: '8px' }}>
            <h2 style={{ fontSize: '11pt', margin: '0 0 4px 0', fontWeight: 'bold', color: '#000' }}>Skills</h2>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', fontSize: '10pt' }}>
            {data.skills.map((s, i) => (
              <span key={i} style={{ display: 'inline-flex', alignItems: 'center', background: '#f3f4f6', border: '1px solid #e5e7eb', borderRadius: 4, padding: '2px 8px' }}>
                <EditableField value={s} onChange={v => updateSkill(i, v)} editable={editable} placeholder="Skill" />
                {editable && <DelButton onClick={() => deleteSkill(i)} />}
              </span>
            ))}
            {editable && <AddButton label="Add Skill" onClick={addSkill} />}
          </div>
        </div>
      )}

      {/* Languages */}
      {((data.languages && data.languages.length > 0) || editable) && (
        <div style={{ marginBottom: '1rem' }}>
          <div style={{ borderBottom: '1px solid #ccc', marginBottom: '8px' }}>
            <h2 style={{ fontSize: '11pt', margin: '0 0 4px 0', fontWeight: 'bold', color: '#000' }}>Languages</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', fontSize: '10pt' }}>
            {data.languages.map((lang, i) => (
              <div key={i}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px', alignItems: 'center' }}>
                  <span style={{ fontWeight: 'bold' }}>
                    <EditableField value={lang.language} onChange={v => updateLang(i, 'language', v)} editable={editable} placeholder="Language" />
                    {editable && <DelButton onClick={() => deleteLang(i)} />}
                  </span>
                  <span style={{ fontSize: '9pt', color: '#555' }}>
                    <EditableField value={lang.proficiency} onChange={v => updateLang(i, 'proficiency', v)} editable={editable} placeholder="Fluent" />
                  </span>
                </div>
                {!['native speaker', 'native / bilingual', 'native'].includes(lang.proficiency?.toLowerCase()) && (
                  <div style={{ height: '4px', background: '#e5e7eb', width: '100%', borderRadius: '2px' }}>
                    <div style={{ height: '100%', background: '#555', width: getProficiencyWidth(lang.proficiency), borderRadius: '2px' }} />
                  </div>
                )}
              </div>
            ))}
          </div>
          {editable && <AddButton label="Add Language" onClick={addLang} />}
        </div>
      )}
    </div>
  );
}
