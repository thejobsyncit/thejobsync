'use client';

import React, { useState } from 'react';
import {
  Code,
  Check,
  Copy,
  Terminal,
  Cpu,
  Clock,
  HardDrive,
  Lightbulb,
  CheckCircle2,
  AlertTriangle,
  FileCode,
  Sparkles,
  Zap,
  BookOpen,
  Award,
  XCircle,
  AlertCircle,
  GitPullRequest,
  CheckSquare
} from 'lucide-react';
import { lookupQuestionDetails } from '../questionBank';

interface CodingReviewCardProps {
  c: {
    questionName?: string;
    question?: string;
    description?: string;
    constraints?: string[];
    examples?: { input: string; output: string; explanation?: string }[];
    options?: string[];
    language?: string;
    compilationStatus?: string;
    passedTestCases?: string;
    failedTestCases?: string;
    executionTime?: string;
    memory?: string;
    score?: string | number;
    feedback?: string;
    candidateAnswer?: string;
    correctAnswer?: string;
    starterCode?: string;
    approach?: string;
    timeComplexity?: string;
    spaceComplexity?: string;
    keyConcepts?: string[] | string;
    whyItWorks?: string;
    commonMistakes?: string[] | string;
    strengths?: string[] | string;
    explanation?: string;
    difficulty?: string;
    marks?: string;
    result?: string;
  };
  index: number;
  isDark?: boolean;
}

// Code Auto-Formatter Utility to ensure code is formatted with line breaks
function formatCodeString(rawCode: string | undefined): string {
  if (!rawCode || typeof rawCode !== 'string') return '// No submission recorded.';

  let code = rawCode.trim();
  if (!code) return '// Empty answer.';

  // If code already contains line breaks, return cleaned code
  if (code.includes('\n')) {
    return code;
  }

  // If code contains braces/semicolons/function/SELECT keywords, auto-format with line breaks
  if (code.includes('{') || code.includes(';') || code.includes('function') || code.includes('def ') || code.includes('SELECT')) {
    let formatted = '';
    let indent = 0;
    let inString = false;
    let stringChar = '';

    for (let i = 0; i < code.length; i++) {
      const char = code[i];

      if ((char === '"' || char === "'" || char === '`') && code[i - 1] !== '\\') {
        if (!inString) {
          inString = true;
          stringChar = char;
        } else if (stringChar === char) {
          inString = false;
        }
      }

      if (!inString) {
        if (char === '{') {
          indent += 2;
          formatted += char + '\n' + ' '.repeat(indent);
          continue;
        } else if (char === '}') {
          indent = Math.max(0, indent - 2);
          formatted += '\n' + ' '.repeat(indent) + char + '\n' + ' '.repeat(indent);
          continue;
        } else if (char === ';') {
          formatted += char + '\n' + ' '.repeat(indent);
          continue;
        }
      }

      formatted += char;
    }

    return formatted.replace(/\n\s*\n/g, '\n').trim();
  }

  return code;
}

// Tokenizing Syntax Highlighting Helper
function renderSyntaxHighlightedTokens(lineText: string, isDark: boolean) {
  if (!lineText) return <span style={{ color: '#64748b' }}>&nbsp;</span>;

  // Comment Check
  if (lineText.trim().startsWith('//') || lineText.trim().startsWith('#') || lineText.trim().startsWith('/*')) {
    return <span style={{ color: '#6e7681', fontStyle: 'italic' }}>{lineText}</span>;
  }

  const keywordRegex = /\b(function|def|class|const|let|var|return|if|else|for|while|import|from|export|public|private|void|int|string|boolean|bool|double|float|struct|SELECT|FROM|WHERE|JOIN|GROUP|ORDER|BY|HAVING|INSERT|UPDATE|DELETE|CREATE|TABLE|async|await|try|catch|new|true|false|null|undefined)\b/g;
  const numberRegex = /\b(\d+)\b/g;
  const stringRegex = /("[^"]*"|'[^']*'|`[^`]*`)/g;

  const tokens: { index: number; length: number; type: 'keyword' | 'number' | 'string'; val: string }[] = [];

  let match;
  while ((match = stringRegex.exec(lineText)) !== null) {
    tokens.push({ index: match.index, length: match[0].length, type: 'string', val: match[0] });
  }

  const keywordMatches = lineText.matchAll(keywordRegex);
  for (const m of keywordMatches) {
    if (m.index !== undefined && !tokens.some(t => m.index >= t.index && m.index < t.index + t.length)) {
      tokens.push({ index: m.index, length: m[0].length, type: 'keyword', val: m[0] });
    }
  }

  const numberMatches = lineText.matchAll(numberRegex);
  for (const m of numberMatches) {
    if (m.index !== undefined && !tokens.some(t => m.index >= t.index && m.index < t.index + t.length)) {
      tokens.push({ index: m.index, length: m[0].length, type: 'number', val: m[0] });
    }
  }

  tokens.sort((a, b) => a.index - b.index);

  let lastIdx = 0;
  const elements: React.ReactNode[] = [];

  tokens.forEach((t, i) => {
    if (t.index > lastIdx) {
      elements.push(<span key={`txt-${i}`}>{lineText.substring(lastIdx, t.index)}</span>);
    }

    let color = '#79c0ff'; // keyword default (cyan/blue)
    if (t.type === 'keyword') color = '#ff7b72'; // rose/coral keyword in GitHub dark
    else if (t.type === 'string') color = '#a5d6ff'; // light blue string
    else if (t.type === 'number') color = '#79c0ff'; // cyan number

    elements.push(
      <span key={`tok-${i}`} style={{ color, fontWeight: t.type === 'keyword' ? 700 : 500 }}>
        {t.val}
      </span>
    );
    lastIdx = t.index + t.length;
  });

  if (lastIdx < lineText.length) {
    elements.push(<span key="txt-end">{lineText.substring(lastIdx)}</span>);
  }

  return <>{elements}</>;
}

// Sub-Component: VS Code / IDE Style Code Block Editor
function VSCodeEditor({
  code,
  language = 'JavaScript',
  title,
  isCandidate = false
}: {
  code: string;
  language?: string;
  title: string;
  isCandidate?: boolean;
}) {
  const [copied, setCopied] = useState(false);
  const formattedCode = formatCodeString(code);
  const lines = formattedCode.split('\n');

  const handleCopy = () => {
    navigator.clipboard.writeText(formattedCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div style={{
      borderRadius: 14,
      overflow: 'hidden',
      border: `1.5px solid ${isCandidate ? 'rgba(56, 189, 248, 0.35)' : 'rgba(34, 197, 94, 0.35)'}`,
      background: '#0d1117',
      boxShadow: '0 8px 24px rgba(0,0,0,0.25)',
      display: 'flex',
      flexDirection: 'column'
    }}>
      {/* VS Code Editor Header Bar */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0.65rem 1rem',
        background: '#161b22',
        borderBottom: '1px solid #30363d'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          {/* macOS / VS Code Traffic Dots */}
          <div style={{ display: 'flex', gap: 6 }}>
            <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#ff5f56' }} />
            <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#ffbd2e' }} />
            <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#27c93f' }} />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#f0f6fc', fontWeight: 700, fontSize: '0.85rem' }}>
            <FileCode size={16} color={isCandidate ? '#38bdf8' : '#22c55e'} />
            {title}
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>

          <button
            onClick={handleCopy}
            style={{
              padding: '0.35rem 0.75rem',
              borderRadius: 6,
              background: copied ? 'rgba(34, 197, 94, 0.25)' : 'rgba(255, 255, 255, 0.08)',
              color: copied ? '#3fb950' : '#c9d1d9',
              border: `1px solid ${copied ? 'rgba(34, 197, 94, 0.4)' : '#30363d'}`,
              fontSize: '0.75rem',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 5,
              transition: 'all 0.2s ease'
            }}
          >
            {copied ? <Check size={14} /> : <Copy size={14} />}
            {copied ? 'Copied!' : 'Copy Code'}
          </button>
        </div>
      </div>

      {/* Editor Body with Gutter Line Numbers */}
      <div style={{
        padding: '0.85rem 0',
        overflowX: 'auto',
        maxHeight: '380px',
        overflowY: 'auto',
        fontFamily: 'Consolas, Monaco, "Fira Code", "JetBrains Mono", monospace',
        fontSize: '0.85rem',
        lineHeight: 1.6,
        color: '#c9d1d9',
        background: '#0d1117'
      }}>
        <table style={{ borderCollapse: 'collapse', width: '100%' }}>
          <tbody>
            {lines.map((line, idx) => (
              <tr key={idx} style={{ background: 'transparent' }}>
                {/* Gutter Line Number */}
                <td style={{
                  width: 42,
                  minWidth: 42,
                  paddingRight: 12,
                  textAlign: 'right',
                  userSelect: 'none',
                  color: '#6e7681',
                  fontWeight: 600,
                  fontSize: '0.75rem',
                  borderRight: '1px solid #21262d'
                }}>
                  {idx + 1}
                </td>
                {/* Code Tokens */}
                <td style={{ paddingLeft: 14, paddingRight: 14, whiteSpace: 'pre', fontFamily: 'inherit' }}>
                  {renderSyntaxHighlightedTokens(line, true)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// Main Component: LeetCode / HackerRank / GitHub PR IDE Question Review Card
export default function CodingQuestionReviewCard({ c, index, isDark = true }: CodingReviewCardProps) {
  // Automatic Lookup from Question Bank if details in report JSON are incomplete
  const fetched = lookupQuestionDetails(c.questionName || c.question || c.description);

  // Score parsing
  const scoreNum = typeof c.score === 'number' ? c.score : parseInt(String(c.score || '0').replace('%', ''), 10);
  const isPassed = c.result === 'Correct' || c.result?.includes('Passed') || scoreNum === 100;
  const isPartial = !isPassed && (scoreNum > 0 || c.result?.includes('Partial') || c.result?.includes('50%'));

  const questionTitle = c.questionName || fetched.title || (c.question && c.question.length <= 60 ? c.question : `Question #${index + 1}`);
  const descriptionText = (c.description && c.description.trim().length > 0 && c.description !== c.questionName)
    ? c.description
    : (fetched.description || c.question || `Question #${index + 1}`);

  const constraintsList = (c.constraints && c.constraints.length > 0) ? c.constraints : (fetched.constraints || []);
  const examplesList = (c.examples && c.examples.length > 0) ? c.examples : (fetched.examples || []);
  const optionsList = (c.options && c.options.length > 0) ? c.options : (fetched.options || []);

  const language = c.language || 'JavaScript';
  const difficulty = c.difficulty || (descriptionText.toLowerCase().includes('hard') ? 'Hard' : descriptionText.toLowerCase().includes('medium') ? 'Medium' : 'Easy');
  const marks = c.marks || (isPassed ? '10 Marks' : (isPartial ? '5 Marks' : '0 Marks'));

  // Candidate Code vs Correct Solution
  let candidateCode = '// No code submitted by candidate';
  if (c.candidateAnswer && typeof c.candidateAnswer === 'string' && c.candidateAnswer.trim().length > 0) {
    candidateCode = c.candidateAnswer;
  } else if (c.starterCode) {
    if (typeof c.starterCode === 'string' && c.starterCode.trim().length > 0) {
      candidateCode = c.starterCode;
    } else if (typeof c.starterCode === 'object') {
      candidateCode = (c.starterCode as any)[language] || Object.values(c.starterCode)[0] || '// No code submitted by candidate';
    }
  }

  // Resolve actual code string for reference solution
  let correctSolution = '';
  if (c.correctAnswer && typeof c.correctAnswer === 'string' && (c.correctAnswer.includes('function') || c.correctAnswer.includes('def') || c.correctAnswer.includes('class') || c.correctAnswer.includes('SELECT') || c.correctAnswer.includes('return') || c.correctAnswer.includes('{'))) {
    correctSolution = c.correctAnswer;
  } else if (fetched && fetched.referenceSolution) {
    const refObj = fetched.referenceSolution as any;
    correctSolution = refObj[language] || refObj.JavaScript || refObj.Python || refObj.Java || refObj['C++'] || c.correctAnswer || '// Optimal Reference Solution available';
  } else {
    correctSolution = c.correctAnswer || c.explanation || '// Optimal Reference Solution available';
  }

  // Parse Explanation into structured bullet steps for "Why this solution works" panel
  const rawExplanation = c.explanation || c.whyItWorks || c.approach || 'Solution applies optimal algorithmic data structures to satisfy problem constraints with efficient execution.';
  const explanationBullets = rawExplanation
    .split(/(?<=\.|\n)\s+/)
    .map(s => s.trim())
    .filter(s => s.length > 5);

  return (
    <div style={{
      padding: '1.75rem',
      borderRadius: 20,
      background: isDark ? '#161b22' : '#ffffff',
      border: `1.5px solid ${isDark ? '#30363d' : '#e2e8f0'}`,
      boxShadow: isDark ? '0 10px 30px rgba(0,0,0,0.3)' : '0 10px 30px rgba(0,0,0,0.05)',
      marginBottom: '1.5rem',
      transition: 'transform 200ms ease, box-shadow 200ms ease'
    }}>
      
      {/* 1. QUESTION HEADER BAR */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: 12,
        paddingBottom: '1.1rem',
        marginBottom: '1.25rem',
        borderBottom: `1px solid ${isDark ? '#30363d' : '#f1f5f9'}`
      }}>
        {/* Left: Q Number & Title */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
          <span style={{
            fontSize: '0.85rem',
            fontWeight: 900,
            padding: '0.3rem 0.75rem',
            borderRadius: 8,
            background: 'rgba(56, 189, 248, 0.15)',
            color: '#38bdf8',
            border: '1px solid rgba(56, 189, 248, 0.3)',
            fontFamily: 'monospace'
          }}>
            Q{index + 1}
          </span>

          <h3 style={{ fontSize: '1.25rem', fontWeight: 900, color: isDark ? '#f0f6fc' : '#0f172a', margin: 0 }}>
            {questionTitle}
          </h3>
        </div>

        {/* Right: Badges (Difficulty, Language, Marks, Status) */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
          {/* Difficulty Badge */}
          <span style={{
            fontSize: '0.775rem',
            fontWeight: 800,
            padding: '0.25rem 0.65rem',
            borderRadius: 8,
            background: difficulty === 'Hard' ? 'rgba(239, 68, 68, 0.15)' : (difficulty === 'Medium' ? 'rgba(245, 158, 11, 0.15)' : 'rgba(34, 197, 94, 0.15)'),
            color: difficulty === 'Hard' ? '#ef4444' : (difficulty === 'Medium' ? '#f59e0b' : '#22c55e'),
            border: `1px solid ${difficulty === 'Hard' ? 'rgba(239, 68, 68, 0.3)' : (difficulty === 'Medium' ? 'rgba(245, 158, 11, 0.3)' : 'rgba(34, 197, 94, 0.3)')}`
          }}>
            {difficulty}
          </span>



          {/* Marks Badge */}
          <span style={{
            fontSize: '0.775rem',
            fontWeight: 800,
            padding: '0.25rem 0.65rem',
            borderRadius: 8,
            background: 'rgba(168, 85, 247, 0.15)',
            color: '#a855f7',
            border: '1px solid rgba(168, 85, 247, 0.3)'
          }}>
            {marks}
          </span>


        </div>
      </div>

      {/* 2. PROBLEM STATEMENT & QUESTION PROMPT BOX */}
      <div style={{
        padding: '1.25rem 1.5rem',
        borderRadius: 14,
        background: isDark ? '#0d1117' : '#f8fafc',
        border: `1.5px solid ${isDark ? '#30363d' : '#cbd5e1'}`,
        marginBottom: '1.25rem'
      }}>
        <div style={{
          fontSize: '0.75rem',
          fontWeight: 800,
          color: '#38bdf8',
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
          marginBottom: 8,
          display: 'flex',
          alignItems: 'center',
          gap: 6
        }}>
          <BookOpen size={16} color="#38bdf8" />
          Problem Statement & Question Prompt
        </div>

        {/* Description / Main Question Text */}
        <div style={{
          fontSize: '0.95rem',
          fontWeight: 600,
          color: isDark ? '#f0f6fc' : '#0f172a',
          lineHeight: 1.6,
          whiteSpace: 'pre-wrap'
        }}>
          {descriptionText}
        </div>

        {/* Constraints Section */}
        {constraintsList.length > 0 && (
          <div style={{ marginTop: '1rem' }}>
            <strong style={{
              fontSize: '0.8rem',
              fontWeight: 800,
              color: isDark ? '#94a3b8' : '#64748b',
              textTransform: 'uppercase',
              letterSpacing: '0.04em',
              display: 'block',
              marginBottom: 6
            }}>
              Constraints:
            </strong>
            <ul style={{ margin: 0, paddingLeft: '1.25rem', fontSize: '0.85rem', color: isDark ? '#c9d1d9' : '#334155' }}>
              {constraintsList.map((cons: string, consIdx: number) => (
                <li key={consIdx} style={{ marginBottom: 3 }}>
                  <code style={{ background: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.05)', padding: '2px 6px', borderRadius: 4 }}>
                    {cons}
                  </code>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Sample Examples Section */}
        {examplesList.length > 0 && (
          <div style={{ marginTop: '1rem' }}>
            <strong style={{
              fontSize: '0.8rem',
              fontWeight: 800,
              color: isDark ? '#94a3b8' : '#64748b',
              textTransform: 'uppercase',
              letterSpacing: '0.04em',
              display: 'block',
              marginBottom: 8
            }}>
              Sample Examples:
            </strong>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {examplesList.map((ex: any, exIdx: number) => (
                <div key={exIdx} style={{
                  padding: '0.75rem 1rem',
                  borderRadius: 10,
                  background: isDark ? '#161b22' : '#f1f5f9',
                  border: `1px solid ${isDark ? '#30363d' : '#e2e8f0'}`,
                  fontSize: '0.85rem',
                  fontFamily: 'Consolas, Monaco, monospace'
                }}>
                  <div style={{ color: isDark ? '#f0f6fc' : '#0f172a' }}>
                    <strong style={{ color: '#38bdf8' }}>Input:</strong> {ex.input}
                  </div>
                  <div style={{ color: isDark ? '#f0f6fc' : '#0f172a', marginTop: 3 }}>
                    <strong style={{ color: '#22c55e' }}>Output:</strong> {ex.output}
                  </div>
                  {ex.explanation && (
                    <div style={{ color: isDark ? '#8b949e' : '#64748b', marginTop: 4, fontStyle: 'italic', fontFamily: 'sans-serif', fontSize: '0.825rem' }}>
                      Explanation: {ex.explanation}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* MCQ Options Section */}
        {optionsList.length > 0 && (
          <div style={{ marginTop: 12, display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 8 }}>
            {optionsList.map((opt: string, optIdx: number) => {
              const isSelected = c.candidateAnswer === opt;
              const isRight = c.correctAnswer === opt;
              return (
                <div key={optIdx} style={{
                  padding: '0.55rem 0.85rem',
                  borderRadius: 8,
                  fontSize: '0.825rem',
                  fontWeight: 600,
                  background: isRight
                    ? 'rgba(34, 197, 94, 0.15)'
                    : (isSelected ? 'rgba(239, 68, 68, 0.15)' : (isDark ? '#161b22' : '#ffffff')),
                  color: isRight
                    ? '#22c55e'
                    : (isSelected ? '#ef4444' : (isDark ? '#c9d1d9' : '#334155')),
                  border: `1px solid ${isRight ? 'rgba(34, 197, 94, 0.35)' : (isSelected ? 'rgba(239, 68, 68, 0.35)' : (isDark ? '#30363d' : '#cbd5e1'))}`
                }}>
                  <span style={{ fontWeight: 800, marginRight: 6 }}>{String.fromCharCode(65 + optIdx)}.</span> {opt}
                  {isRight && <span style={{ marginLeft: 6, fontWeight: 800 }}>✔ (Correct)</span>}
                  {isSelected && !isRight && <span style={{ marginLeft: 6, fontWeight: 800 }}>✖ (Selected)</span>}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* 3. SIDE-BY-SIDE VS CODE EDITORS */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
        gap: '1rem',
        marginBottom: '1.5rem'
      }}>
        {/* Left: Candidate Solution */}
        <VSCodeEditor
          code={candidateCode}
          language={language}
          title="Candidate Solution"
          isCandidate={true}
        />

        {/* Right: Expected Solution */}
        <VSCodeEditor
          code={correctSolution}
          language={language}
          title="Expected Solution"
          isCandidate={false}
        />
      </div>

      {/* 3. EXPLANATION PANEL: 💡 Why this solution works */}
      {/* 3. EXPLANATION & INDEPENDENT ALGORITHM EVALUATION PANEL */}
      <div style={{
        padding: '1.25rem 1.5rem',
        borderRadius: 14,
        background: isDark ? '#0d1117' : '#f0f9ff',
        border: `1.5px solid ${isDark ? 'rgba(56, 189, 248, 0.3)' : 'rgba(56, 189, 248, 0.4)'}`
      }}>
        <div style={{
          fontSize: '1rem',
          fontWeight: 800,
          color: isDark ? '#38bdf8' : '#0284c7',
          marginBottom: '0.75rem',
          display: 'flex',
          alignItems: 'center',
          gap: 8
        }}>
          <Lightbulb size={20} color="#38bdf8" />
          💡 Independent Algorithm Evaluation & Logic Analysis
        </div>

        {c.feedback && (
          <div style={{
            padding: '0.85rem 1.1rem',
            borderRadius: 10,
            background: isDark ? 'rgba(56, 189, 248, 0.1)' : '#e0f2fe',
            border: '1px solid rgba(56, 189, 248, 0.25)',
            color: isDark ? '#e0f2fe' : '#0369a1',
            fontSize: '0.875rem',
            fontWeight: 600,
            marginBottom: '1rem',
            lineHeight: 1.55
          }}>
            {c.feedback}
          </div>
        )}

        <ul style={{ margin: 0, paddingLeft: '1.25rem', display: 'flex', flexDirection: 'column', gap: 6 }}>
          {explanationBullets.map((bullet, bIdx) => (
            <li key={bIdx} style={{ fontSize: '0.9rem', color: isDark ? '#c9d1d9' : '#334155', lineHeight: 1.5 }}>
              {bullet}
            </li>
          ))}
        </ul>
      </div>

    </div>
  );
}

