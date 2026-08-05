'use client';

import React, { useState, useEffect } from 'react';
import {
  Users,
  Search,
  Filter,
  ArrowUpDown,
  Download,
  FileText,
  Printer,
  Eye,
  CheckCircle,
  XCircle,
  Award,
  Sparkles,
  RefreshCw,
  BarChart2
} from 'lucide-react';
import DashboardLayout from '@/app/careers/DashboardLayout';
import AssessmentReportView from '@/app/careers/mock-interview/components/AssessmentReportView';
import { exportReportToPDF, exportReportToExcel, printAssessmentReport, ReportData } from '@/app/careers/mock-interview/utils/exportReport';

export default function AdminAssessmentsPage() {
  const [assessments, setAssessments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('All Roles');
  const [statusFilter, setStatusFilter] = useState('All Status');

  // Selected Assessment Modal View
  const [selectedReport, setSelectedReport] = useState<ReportData | null>(null);

  const fetchAssessments = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (searchQuery) params.append('search', searchQuery);
      if (roleFilter && roleFilter !== 'All Roles') params.append('role', roleFilter);
      if (statusFilter && statusFilter !== 'All Status') params.append('status', statusFilter);

      const res = await fetch(`/api/assessments/list?${params.toString()}`);
      const data = await res.json();
      if (data.success) {
        setAssessments(data.results || []);
      }
    } catch (err) {
      console.error('Failed to fetch assessments:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssessments();
  }, [searchQuery, roleFilter, statusFilter]);

  // Transform Database Record into ReportData object
  const formatRecordToReport = (rec: any): ReportData => {
    return {
      id: rec.id,
      candidateName: rec.candidateName,
      candidateId: rec.candidateId || rec.id,
      email: rec.email,
      jobRole: rec.jobRole,
      assessmentName: rec.assessmentName,
      difficulty: rec.difficulty,
      duration: rec.duration,
      totalQuestions: rec.totalQuestions,
      attemptedQuestions: rec.attemptedQuestions,
      unansweredQuestions: rec.unansweredQuestions,
      finalScore: rec.finalScore,
      percentage: rec.percentage,
      overallResult: rec.overallResult,
      performanceLevel: rec.performanceLevel,
      hiringRecommendation: rec.hiringRecommendation,
      recommendationReason: rec.recommendationReason,
      sectionScores: rec.sectionScoresJson ? JSON.parse(rec.sectionScoresJson) : {},
      codingDetails: rec.codingDetailsJson ? JSON.parse(rec.codingDetailsJson) : [],
      skillAnalysis: rec.skillAnalysisJson ? JSON.parse(rec.skillAnalysisJson) : [],
      questionReview: rec.questionReviewJson ? JSON.parse(rec.questionReviewJson) : [],
      strengths: rec.strengthsJson ? JSON.parse(rec.strengthsJson) : [],
      improvements: rec.improvementsJson ? JSON.parse(rec.improvementsJson) : [],
      scoreFormula: rec.scoreFormulaJson ? JSON.parse(rec.scoreFormulaJson) : {},
      createdAt: rec.createdAt
    };
  };

  // Stat Counters
  const totalCount = assessments.length;
  const passedCount = assessments.filter(a => a.overallResult === 'Pass').length;
  const recommendedCount = assessments.filter(a => a.hiringRecommendation === 'Highly Recommended').length;
  const avgScore = totalCount > 0 ? Math.round(assessments.reduce((sum, a) => sum + (a.finalScore || 0), 0) / totalCount) : 0;

  return (
    <DashboardLayout>
      <div style={{ maxWidth: 1300, margin: '0 auto', padding: '1.5rem 1rem' }}>
        
        {/* If viewing full report view */}
        {selectedReport ? (
          <AssessmentReportView
            data={selectedReport}
            isDark={true}
            onBack={() => setSelectedReport(null)}
          />
        ) : (
          <div>
            {/* Header Title Banner */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16, marginBottom: '2rem' }}>
              <div>
                <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#00B4D8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Recruiter & Hiring Manager Dashboard
                </div>
                <h1 style={{ fontSize: '1.75rem', fontWeight: 900, color: '#ffffff', margin: '4px 0 0 0' }}>
                  Candidate Assessment Reports
                </h1>
                <p style={{ margin: '4px 0 0 0', fontSize: '0.875rem', color: '#94a3b8' }}>
                  View, filter, export, and evaluate verified technical & coding assessment reports sorted by highest score.
                </p>
              </div>

              <button
                onClick={fetchAssessments}
                style={{
                  padding: '0.65rem 1.2rem',
                  borderRadius: 12,
                  background: 'rgba(56, 189, 248, 0.12)',
                  color: '#38bdf8',
                  border: '1px solid rgba(56, 189, 248, 0.3)',
                  fontWeight: 700,
                  fontSize: '0.875rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8
                }}
              >
                <RefreshCw size={16} /> Refresh Dashboard
              </button>
            </div>

            {/* Stat Counters Row */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem', marginBottom: '2rem' }}>
              <div style={{ padding: '1.25rem', borderRadius: 18, background: 'rgba(30, 41, 59, 0.6)', border: '1px solid rgba(255,255,255,0.08)' }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase' }}>Total Assessments</div>
                <div style={{ fontSize: '1.75rem', fontWeight: 900, color: '#ffffff', marginTop: 4 }}>{totalCount}</div>
              </div>

              <div style={{ padding: '1.25rem', borderRadius: 18, background: 'rgba(34, 197, 94, 0.08)', border: '1px solid rgba(34, 197, 94, 0.2)' }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#22c55e', textTransform: 'uppercase' }}>Passed Candidates</div>
                <div style={{ fontSize: '1.75rem', fontWeight: 900, color: '#22c55e', marginTop: 4 }}>{passedCount}</div>
              </div>

              <div style={{ padding: '1.25rem', borderRadius: 18, background: 'rgba(56, 189, 248, 0.08)', border: '1px solid rgba(56, 189, 248, 0.2)' }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#38bdf8', textTransform: 'uppercase' }}>Average Score</div>
                <div style={{ fontSize: '1.75rem', fontWeight: 900, color: '#38bdf8', marginTop: 4 }}>{avgScore}%</div>
              </div>

              <div style={{ padding: '1.25rem', borderRadius: 18, background: 'rgba(234, 179, 8, 0.08)', border: '1px solid rgba(234, 179, 8, 0.2)' }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#eab308', textTransform: 'uppercase' }}>Highly Recommended</div>
                <div style={{ fontSize: '1.75rem', fontWeight: 900, color: '#eab308', marginTop: 4 }}>{recommendedCount}</div>
              </div>
            </div>

            {/* Filter & Search Toolbar */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '1rem',
              marginBottom: '1.5rem',
              padding: '1.25rem',
              borderRadius: 20,
              background: 'rgba(30, 41, 59, 0.7)',
              border: '1px solid rgba(255, 255, 255, 0.1)'
            }}>
              {/* Search Box */}
              <div style={{ position: 'relative', flex: '1 1 300px' }}>
                <Search size={18} color="#94a3b8" style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  type="text"
                  placeholder="Search candidate by name, email, or role..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.7rem 1rem 0.7rem 2.6rem',
                    borderRadius: 12,
                    background: 'rgba(15, 23, 42, 0.6)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    color: '#ffffff',
                    fontSize: '0.875rem',
                    outline: 'none'
                  }}
                />
              </div>

              {/* Filters */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
                <select
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value)}
                  style={{
                    padding: '0.7rem 1rem',
                    borderRadius: 12,
                    background: '#0f172a',
                    border: '1px solid rgba(255,255,255,0.1)',
                    color: '#ffffff',
                    fontWeight: 600,
                    fontSize: '0.85rem',
                    outline: 'none'
                  }}
                >
                  <option value="All Roles">All Roles</option>
                  <option value="Full Stack Developer">Full Stack Developer</option>
                  <option value="Frontend Developer">Frontend Developer</option>
                  <option value="Backend Developer">Backend Developer</option>
                  <option value="Data Scientist">Data Scientist</option>
                  <option value="DevOps Engineer">DevOps Engineer</option>
                  <option value="QA / Software Testing">QA / Software Testing</option>
                </select>

                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  style={{
                    padding: '0.7rem 1rem',
                    borderRadius: 12,
                    background: '#0f172a',
                    border: '1px solid rgba(255,255,255,0.1)',
                    color: '#ffffff',
                    fontWeight: 600,
                    fontSize: '0.85rem',
                    outline: 'none'
                  }}
                >
                  <option value="All Status">All Results</option>
                  <option value="Pass">Pass Only</option>
                  <option value="Fail">Fail Only</option>
                  <option value="Highly Recommended">Highly Recommended</option>
                  <option value="Recommended with Training">Recommended with Training</option>
                  <option value="Not Recommended">Not Recommended</option>
                </select>
              </div>
            </div>

            {/* Candidates Table (Sorted by Highest Score First) */}
            <div style={{
              background: 'rgba(15, 23, 42, 0.7)',
              borderRadius: 20,
              border: '1px solid rgba(255, 255, 255, 0.08)',
              overflow: 'hidden'
            }}>
              <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontWeight: 800, fontSize: '1rem', color: '#ffffff', display: 'flex', alignItems: 'center', gap: 8 }}>
                  <ArrowUpDown size={18} color="#00B4D8" /> Candidates Ranked by Highest Score First
                </span>
                <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
                  Showing {assessments.length} candidate reports
                </span>
              </div>

              {loading ? (
                <div style={{ padding: '3rem', textAlign: 'center', color: '#94a3b8' }}>
                  Loading assessment reports...
                </div>
              ) : assessments.length === 0 ? (
                <div style={{ padding: '3rem', textAlign: 'center', color: '#94a3b8' }}>
                  No candidate assessment reports found. Submit an assessment to view reports here!
                </div>
              ) : (
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
                    <thead>
                      <tr style={{ background: 'rgba(30, 41, 59, 0.6)', borderBottom: '1px solid rgba(255,255,255,0.08)', color: '#94a3b8', textTransform: 'uppercase', fontSize: '0.725rem' }}>
                        <th style={{ padding: '1rem 1.25rem' }}>Candidate</th>
                        <th style={{ padding: '1rem 1.25rem' }}>Role Applied</th>
                        <th style={{ padding: '1rem 1.25rem' }}>Overall Score</th>
                        <th style={{ padding: '1rem 1.25rem' }}>Coding Score</th>
                        <th style={{ padding: '1rem 1.25rem' }}>MCQ Score</th>
                        <th style={{ padding: '1rem 1.25rem' }}>Result</th>
                        <th style={{ padding: '1rem 1.25rem' }}>AI Recommendation</th>
                        <th style={{ padding: '1rem 1.25rem' }}>Date</th>
                        <th style={{ padding: '1rem 1.25rem', textAlign: 'right' }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {assessments.map((a: any, idx: number) => {
                        const reportObj = formatRecordToReport(a);
                        const isPass = a.overallResult === 'Pass';

                        let recColor = '#22c55e';
                        if (a.hiringRecommendation === 'Recommended with Training') recColor = '#eab308';
                        else if (a.hiringRecommendation === 'Not Recommended') recColor = '#ef4444';

                        return (
                          <tr key={a.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', transition: 'background 0.2s' }}>
                            {/* Candidate */}
                            <td style={{ padding: '1rem 1.25rem' }}>
                              <div style={{ fontWeight: 800, color: '#ffffff' }}>{a.candidateName}</div>
                              <div style={{ fontSize: '0.775rem', color: '#64748b' }}>{a.email}</div>
                            </td>

                            {/* Role */}
                            <td style={{ padding: '1rem 1.25rem', color: '#cbd5e1', fontWeight: 600 }}>
                              {a.jobRole}
                            </td>

                            {/* Overall Score */}
                            <td style={{ padding: '1rem 1.25rem' }}>
                              <span style={{
                                fontWeight: 900,
                                fontSize: '1.05rem',
                                color: isPass ? '#22c55e' : '#ef4444'
                              }}>
                                {a.finalScore}%
                              </span>
                            </td>

                            {/* Coding Score */}
                            <td style={{ padding: '1rem 1.25rem', color: '#38bdf8', fontWeight: 700 }}>
                              {a.codingScore ? `${a.codingScore}%` : 'N/A'}
                            </td>

                            {/* MCQ Score */}
                            <td style={{ padding: '1rem 1.25rem', color: '#e2e8f0', fontWeight: 600 }}>
                              {a.mcqScore ? `${a.mcqScore}%` : 'N/A'}
                            </td>

                            {/* Result */}
                            <td style={{ padding: '1rem 1.25rem' }}>
                              <span style={{
                                padding: '0.25rem 0.65rem',
                                borderRadius: 8,
                                fontWeight: 800,
                                fontSize: '0.75rem',
                                background: isPass ? 'rgba(34, 197, 94, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                                color: isPass ? '#22c55e' : '#ef4444'
                              }}>
                                {a.overallResult}
                              </span>
                            </td>

                            {/* Recommendation */}
                            <td style={{ padding: '1rem 1.25rem' }}>
                              <span style={{
                                padding: '0.25rem 0.65rem',
                                borderRadius: 8,
                                fontWeight: 800,
                                fontSize: '0.75rem',
                                background: `rgba(255,255,255,0.05)`,
                                color: recColor,
                                border: `1px solid ${recColor}`
                              }}>
                                {a.hiringRecommendation}
                              </span>
                            </td>

                            {/* Date */}
                            <td style={{ padding: '1rem 1.25rem', color: '#94a3b8', fontSize: '0.8rem' }}>
                              {new Date(a.createdAt).toLocaleDateString()}
                            </td>

                            {/* Actions */}
                            <td style={{ padding: '1rem 1.25rem', textAlign: 'right' }}>
                              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 6 }}>
                                <button
                                  onClick={() => setSelectedReport(reportObj)}
                                  title="View Full Report"
                                  style={{
                                    padding: '0.45rem 0.75rem',
                                    borderRadius: 8,
                                    background: 'rgba(56, 189, 248, 0.15)',
                                    color: '#38bdf8',
                                    border: 'none',
                                    fontWeight: 700,
                                    fontSize: '0.775rem',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 4
                                  }}
                                >
                                  <Eye size={14} /> Report
                                </button>

                                <button
                                  onClick={() => exportReportToPDF(reportObj)}
                                  title="Download PDF"
                                  style={{
                                    padding: '0.45rem 0.65rem',
                                    borderRadius: 8,
                                    background: 'rgba(255,255,255,0.08)',
                                    color: '#ffffff',
                                    border: 'none',
                                    cursor: 'pointer'
                                  }}
                                >
                                  <Download size={14} />
                                </button>

                                <button
                                  onClick={() => exportReportToExcel(reportObj)}
                                  title="Export Excel"
                                  style={{
                                    padding: '0.45rem 0.65rem',
                                    borderRadius: 8,
                                    background: 'rgba(16, 185, 129, 0.15)',
                                    color: '#10b981',
                                    border: 'none',
                                    cursor: 'pointer'
                                  }}
                                >
                                  <FileText size={14} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

      </div>
    </DashboardLayout>
  );
}
