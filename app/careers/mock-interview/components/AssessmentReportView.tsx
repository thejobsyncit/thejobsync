import React from 'react';
import CodingQuestionReviewCard from './CodingReviewCard';
import {
  FileText,
  Download,
  Printer,
  CheckCircle,
  XCircle,
  Code,
  ShieldCheck
} from 'lucide-react';
import { exportReportToPDF, exportReportToExcel, printAssessmentReport, ReportData } from '../utils/exportReport';

interface AssessmentReportViewProps {
  data: ReportData;
  isDark?: boolean;
  onBack?: () => void;
}

export default function AssessmentReportView({ data, isDark = true, onBack }: AssessmentReportViewProps) {
  const sectionScores = data.sectionScores || {};
  const codingDetails = data.codingDetails || [];
  const questionReview = data.questionReview || [];

  const overallScorePct = (data as any).overallScore !== undefined ? (data as any).overallScore : ((data as any).score || 0);
  const isPassed = data.overallResult ? data.overallResult.toLowerCase() === 'pass' : overallScorePct >= 60;

  return (
    <div style={{
      width: '100%',
      maxWidth: 1200,
      margin: '0 auto',
      padding: '1.5rem 1rem 4rem 1rem',
      fontFamily: 'Inter, system-ui, -apple-system, sans-serif'
    }}>
      {/* TOP NAV BAR & ACTIONS */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1rem',
        marginBottom: '2rem',
        padding: '1.25rem 1.5rem',
        borderRadius: 20,
        background: isDark ? 'rgba(30, 41, 59, 0.7)' : '#ffffff',
        border: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'}`,
        backdropFilter: 'blur(12px)'
      }}>
        <div>
          <div style={{ fontSize: '0.775rem', fontWeight: 800, textTransform: 'uppercase', color: '#00B4D8', letterSpacing: '0.05em' }}>
            Official Candidate Verification
          </div>
          <h1 style={{ fontSize: '1.4rem', fontWeight: 900, color: isDark ? '#ffffff' : '#0f172a', margin: '4px 0 0 0' }}>
            Interview Assessment Report
          </h1>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
          {onBack && (
            <button
              onClick={onBack}
              style={{
                padding: '0.6rem 1.1rem',
                borderRadius: 12,
                background: isDark ? 'rgba(255,255,255,0.08)' : '#e2e8f0',
                color: isDark ? '#f8fafc' : '#334155',
                border: 'none',
                fontWeight: 700,
                fontSize: '0.85rem',
                cursor: 'pointer'
              }}
            >
              ← Back
            </button>
          )}

          <button
            onClick={() => exportReportToPDF(data)}
            style={{
              padding: '0.6rem 1.18rem',
              borderRadius: 12,
              background: 'linear-gradient(135deg, #0077B6 0%, #00B4D8 100%)',
              color: '#ffffff',
              border: 'none',
              fontWeight: 800,
              fontSize: '0.85rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              boxShadow: '0 4px 12px rgba(0, 180, 216, 0.25)'
            }}
          >
            <Download size={16} /> Download PDF
          </button>

          <button
            onClick={() => exportReportToExcel(data)}
            style={{
              padding: '0.6rem 1.18rem',
              borderRadius: 12,
              background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
              color: '#ffffff',
              border: 'none',
              fontWeight: 800,
              fontSize: '0.85rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              boxShadow: '0 4px 12px rgba(16, 185, 129, 0.25)'
            }}
          >
            <FileText size={16} /> Export Excel
          </button>

          <button
            onClick={printAssessmentReport}
            style={{
              padding: '0.6rem 1.18rem',
              borderRadius: 12,
              background: isDark ? '#1e293b' : '#f1f5f9',
              color: isDark ? '#ffffff' : '#0f172a',
              border: `1px solid ${isDark ? 'rgba(255,255,255,0.15)' : '#cbd5e1'}`,
              fontWeight: 800,
              fontSize: '0.85rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 8
            }}
          >
            <Printer size={16} /> Print
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 1. OVERALL CANDIDATE SUMMARY */}
      {/* ========================================================================= */}
      <div style={{
        background: isDark ? 'rgba(15, 23, 42, 0.8)' : '#ffffff',
        border: `1.5px solid ${isDark ? 'rgba(255, 255, 255, 0.1)' : '#e2e8f0'}`,
        borderRadius: 24,
        padding: '2rem',
        marginBottom: '2rem',
        boxShadow: isDark ? '0 10px 30px rgba(0,0,0,0.5)' : '0 10px 30px rgba(0,0,0,0.05)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16, marginBottom: '1.5rem', paddingBottom: '1rem', borderBottom: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : '#f1f5f9'}` }}>
          <div>
            <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#00B4D8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Candidate Evaluation</span>
            <h2 style={{ fontSize: '1.6rem', fontWeight: 900, color: isDark ? '#ffffff' : '#0f172a', margin: '2px 0 0 0' }}>
              {data.candidateName}
            </h2>
            <div style={{ fontSize: '0.875rem', color: isDark ? '#94a3b8' : '#64748b', marginTop: 4 }}>
              {data.email}
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{
              padding: '0.5rem 1.25rem',
              borderRadius: 14,
              fontWeight: 900,
              fontSize: '1rem',
              background: isPassed ? 'rgba(34, 197, 94, 0.15)' : 'rgba(239, 68, 68, 0.15)',
              color: isPassed ? '#22c55e' : '#ef4444',
              border: `1.5px solid ${isPassed ? '#22c55e' : '#ef4444'}`,
              display: 'flex',
              alignItems: 'center',
              gap: 8
            }}>
              {isPassed ? <CheckCircle size={20} /> : <XCircle size={20} />}
              RESULT: {data.overallResult?.toUpperCase() || 'PASS'}
            </span>

            <span style={{
              padding: '0.5rem 1.25rem',
              borderRadius: 14,
              fontWeight: 800,
              fontSize: '0.9rem',
              background: 'rgba(56, 189, 248, 0.12)',
              color: '#38bdf8',
              border: '1px solid rgba(56, 189, 248, 0.3)'
            }}>
              Level: {data.performanceLevel || 'Good'}
            </span>
          </div>
        </div>

        {/* Info Cards Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
          <div style={{ padding: '1rem 1.15rem', borderRadius: 16, background: isDark ? 'rgba(30, 41, 59, 0.5)' : '#f8fafc', border: `1px solid ${isDark ? 'rgba(255,255,255,0.05)' : '#e2e8f0'}` }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: isDark ? '#94a3b8' : '#64748b', textTransform: 'uppercase' }}>Job Role & Experience</div>
            <div style={{ fontSize: '1.05rem', fontWeight: 800, color: isDark ? '#f8fafc' : '#0f172a', marginTop: 4 }}>
              {data.jobRole} <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#38bdf8' }}>({data.experienceLevel === 'Intern' ? '🎓 Intern' : (data.experienceLevel === 'Experienced' ? '🚀 Experienced' : '💼 Fresher')})</span>
            </div>
          </div>

          <div style={{ padding: '1rem 1.15rem', borderRadius: 16, background: isDark ? 'rgba(30, 41, 59, 0.5)' : '#f8fafc', border: `1px solid ${isDark ? 'rgba(255,255,255,0.05)' : '#e2e8f0'}` }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: isDark ? '#94a3b8' : '#64748b', textTransform: 'uppercase' }}>Assessment</div>
            <div style={{ fontSize: '1.05rem', fontWeight: 800, color: isDark ? '#f8fafc' : '#0f172a', marginTop: 4 }}>{data.assessmentName} ({data.difficulty})</div>
          </div>

          <div style={{ padding: '1rem 1.15rem', borderRadius: 16, background: isDark ? 'rgba(30, 41, 59, 0.5)' : '#f8fafc', border: `1px solid ${isDark ? 'rgba(255,255,255,0.05)' : '#e2e8f0'}` }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: isDark ? '#94a3b8' : '#64748b', textTransform: 'uppercase' }}>Duration & Date</div>
            <div style={{ fontSize: '1.05rem', fontWeight: 800, color: isDark ? '#f8fafc' : '#0f172a', marginTop: 4 }}>{data.duration} &bull; {data.createdAt ? new Date(data.createdAt).toLocaleDateString() : new Date().toLocaleDateString()}</div>
          </div>

          <div style={{ padding: '1rem 1.15rem', borderRadius: 16, background: isDark ? 'rgba(30, 41, 59, 0.5)' : '#f8fafc', border: `1px solid ${isDark ? 'rgba(255,255,255,0.05)' : '#e2e8f0'}` }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: isDark ? '#94a3b8' : '#64748b', textTransform: 'uppercase' }}>Questions Breakdown</div>
            <div style={{ fontSize: '1.05rem', fontWeight: 800, color: isDark ? '#f8fafc' : '#0f172a', marginTop: 4 }}>
              Total: {data.totalQuestions} (Att: {data.attemptedQuestions}, Unatt: {data.unansweredQuestions})
            </div>
          </div>

          <div style={{ padding: '1rem 1.15rem', borderRadius: 16, background: isDark ? 'rgba(56, 189, 248, 0.1)' : 'rgba(0, 180, 216, 0.08)', border: '1px solid rgba(56, 189, 248, 0.3)', gridColumn: 'span 2' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#38bdf8', textTransform: 'uppercase' }}>Final Score & Percentage</div>
            <div style={{ fontSize: '1.75rem', fontWeight: 900, color: isPassed ? '#22c55e' : '#ef4444', marginTop: 2 }}>
              {data.finalScore} / 100 <span style={{ fontSize: '1.1rem', fontWeight: 700 }}>({data.percentage}%)</span>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* LIVE CODING EVALUATION BREAKDOWN */}
      {/* ========================================================================= */}
      {codingDetails.length > 0 && (
        <div style={{ marginBottom: '2.5rem' }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: isDark ? '#ffffff' : '#0f172a', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: 8 }}>
            <Code color="#38bdf8" size={20} /> Live Coding Evaluation Breakdown
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {codingDetails.map((c: any, idx: number) => (
              <CodingQuestionReviewCard key={idx} c={c} index={idx} isDark={isDark} />
            ))}
          </div>
        </div>
      )}
      {/* Complete Itemized Question Review */}
      {questionReview.length > 0 && (
        <div style={{ marginTop: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', flexWrap: 'wrap', gap: 10 }}>
            <h3 style={{ fontSize: '1.3rem', fontWeight: 900, color: isDark ? '#ffffff' : '#0f172a', margin: 0, display: 'flex', alignItems: 'center', gap: 10 }}>
              <Code color="#38bdf8" size={24} /> Complete Itemized Question Review
            </h3>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: isDark ? '#94a3b8' : '#64748b', background: isDark ? '#1e293b' : '#f1f5f9', padding: '0.35rem 0.75rem', borderRadius: 8, border: `1px solid ${isDark ? '#334155' : '#cbd5e1'}` }}>
              LeetCode & HackerRank Assessment IDE View
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {questionReview.map((q: any, idx: number) => {
              const isCorrect = q.result === 'Correct' || q.result?.includes('Passed') || q.result?.includes('100%');
              const isPartial = !isCorrect && (q.result?.includes('50%') || q.result?.includes('Partial'));

              // Fallback candidate code resolution from codingDetails if q.candidateAnswer is missing or empty
              const matchingCodingDetail = codingDetails.find((cd: any) => cd.questionName === q.questionName || cd.questionName === q.question) || codingDetails[idx];
              const resolvedCandidateAnswer = (q.candidateAnswer && typeof q.candidateAnswer === 'string' && q.candidateAnswer.trim().length > 0 && q.candidateAnswer !== '// No code submitted by candidate')
                ? q.candidateAnswer
                : (matchingCodingDetail?.candidateAnswer || matchingCodingDetail?.userCode || q.candidateAnswer);

              return (
                <CodingQuestionReviewCard
                  key={idx}
                  c={{
                    questionName: q.questionName || q.question,
                    question: q.question,
                    description: q.description || q.question,
                    constraints: q.constraints || [],
                    examples: q.examples || [],
                    options: q.options,
                    candidateAnswer: resolvedCandidateAnswer,
                    correctAnswer: q.correctAnswer,
                    explanation: q.explanation,
                    feedback: q.feedback || matchingCodingDetail?.feedback,
                    result: q.result,
                    marks: q.marks || (isCorrect ? '10 Marks' : (isPartial ? '5 Marks' : '0 Marks')),
                    difficulty: q.difficulty || (q.question?.includes('[Hard]') ? 'Hard' : (q.question?.includes('[Medium]') ? 'Medium' : 'Easy')),
                    language: q.language || matchingCodingDetail?.language || 'JavaScript',
                    score: isCorrect ? 100 : (isPartial ? 50 : 0)
                  }}
                  index={idx}
                  isDark={isDark}
                />
              );
            })}
          </div>
        </div>
      )}

    </div>
  );
}
