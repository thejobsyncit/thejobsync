'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCandidateAuth } from '@/context/CandidateAuthContext';
import { usePortalTheme } from '@/context/PortalThemeContext';
import CandidateDashboardLayout from '../DashboardLayout';
import AssessmentReportView from '../mock-interview/components/AssessmentReportView';
import { exportReportToPDF, exportReportToExcel, printAssessmentReport, ReportData } from '../mock-interview/utils/exportReport';
import { Award, Calendar, CheckCircle, XCircle, Download, FileText, Printer, Eye, Mic, ArrowRight, RefreshCw, BarChart2 } from 'lucide-react';

export default function CandidateAssessmentReportsPage() {
  const { candidate, isLoading } = useCandidateAuth();
  const { isDark } = usePortalTheme();
  const router = useRouter();

  const [reports, setReports] = useState<ReportData[]>([]);
  const [loadingReports, setLoadingReports] = useState(true);
  const [selectedReport, setSelectedReport] = useState<ReportData | null>(null);

  const fetchCandidateReports = async () => {
    setLoadingReports(true);
    let apiReports: ReportData[] = [];

    if (candidate?.email) {
      try {
        const res = await fetch(`/api/assessments/list?candidateEmail=${encodeURIComponent(candidate.email)}`);
        const data = await res.json();
        if (data.success && Array.isArray(data.results)) {
          apiReports = data.results.map((rec: any) => ({
            id: rec.id,
            candidateName: rec.candidateName,
            candidateId: rec.candidateId || rec.id,
            email: rec.email,
            jobRole: rec.jobRole,
            experienceLevel: rec.experienceLevel || 'Fresher',
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
            sectionScores: rec.sectionScoresJson ? parseJson(rec.sectionScoresJson, {}) : {},
            codingDetails: rec.codingDetailsJson ? parseJson(rec.codingDetailsJson, []) : [],
            skillAnalysis: rec.skillAnalysisJson ? parseJson(rec.skillAnalysisJson, []) : [],
            questionReview: rec.questionReviewJson ? parseJson(rec.questionReviewJson, []) : [],
            strengths: rec.strengthsJson ? parseJson(rec.strengthsJson, []) : [],
            improvements: rec.improvementsJson ? parseJson(rec.improvementsJson, []) : [],
            scoreFormula: rec.scoreFormulaJson ? parseJson(rec.scoreFormulaJson, {}) : {},
            createdAt: rec.createdAt
          }));
        }
      } catch (err) {
        console.error('Failed to fetch candidate reports from API:', err);
      }
    }

    // Read local reports from localStorage
    let localReports: ReportData[] = [];
    if (typeof window !== 'undefined') {
      try {
        const savedStr = localStorage.getItem('candidate_assessment_reports');
        if (savedStr) {
          localReports = JSON.parse(savedStr);
        }
      } catch (e) {}
    }

    // Merge and deduplicate by ID
    const mergedMap = new Map<string, ReportData>();
    [...apiReports, ...localReports].forEach(rep => {
      if (rep && rep.id) {
        mergedMap.set(String(rep.id), rep);
      }
    });

    const finalReports = Array.from(mergedMap.values()).sort((a, b) => {
      const timeA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const timeB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return timeB - timeA;
    });

    setReports(finalReports);
    setLoadingReports(false);
  };

  const parseJson = (val: any, fallback: any) => {
    if (!val) return fallback;
    if (typeof val === 'object') return val;
    try { return JSON.parse(val); } catch { return fallback; }
  };

  useEffect(() => {
    if (candidate?.email) {
      fetchCandidateReports();
    }
  }, [candidate?.email]);

  if (isLoading) return null;

  // Stat calculations
  const totalAssessments = reports.length;
  const passedAssessments = reports.filter(r => r.overallResult?.toLowerCase() === 'pass').length;
  const avgScore = totalAssessments > 0 ? Math.round(reports.reduce((sum, r) => sum + r.finalScore, 0) / totalAssessments) : 0;
  const highestScore = totalAssessments > 0 ? Math.max(...reports.map(r => r.finalScore)) : 0;

  return (
    <CandidateDashboardLayout>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>

        {/* Selected Report Interactive View */}
        {selectedReport ? (
          <AssessmentReportView
            data={selectedReport}
            isDark={isDark}
            onBack={() => setSelectedReport(null)}
          />
        ) : (
          <div>
            {/* Unified Header Card Container */}
            <div style={{
              padding: '1.75rem 2rem',
              borderRadius: 24,
              background: isDark ? 'rgba(30, 41, 59, 0.7)' : '#ffffff',
              border: `1.5px solid ${isDark ? 'rgba(255, 255, 255, 0.1)' : '#e2e8f0'}`,
              boxShadow: isDark ? '0 10px 30px rgba(0,0,0,0.3)' : '0 10px 30px rgba(0,0,0,0.04)',
              marginBottom: '2rem',
              backdropFilter: 'blur(12px)'
            }}>
              {/* Header Title & Actions */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: 16,
                paddingBottom: '1.5rem',
                borderBottom: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.1)' : '#f1f5f9'}`
              }}>
                <div>
                  <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#00B4D8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Candidate Performance Analytics
                  </span>
                  <h1 style={{ fontSize: '1.75rem', fontWeight: 900, color: isDark ? '#ffffff' : '#0f172a', margin: '4px 0 0 0' }}>
                    My Assessment Score Reports
                  </h1>
                  <p style={{ margin: '4px 0 0 0', fontSize: '0.9rem', color: isDark ? '#94a3b8' : '#64748b' }}>
                    Analyze your historical technical & coding assessment results anytime to track your interview readiness.
                  </p>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <button
                    onClick={fetchCandidateReports}
                    style={{
                      padding: '0.65rem 1rem',
                      borderRadius: 12,
                      background: isDark ? 'rgba(255,255,255,0.08)' : '#f1f5f9',
                      color: isDark ? '#ffffff' : '#0f172a',
                      border: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : '#cbd5e1'}`,
                      fontWeight: 700,
                      fontSize: '0.85rem',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 6
                    }}
                  >
                    <RefreshCw size={16} /> Refresh
                  </button>

                  <button
                    onClick={() => router.push('/careers/mock-interview')}
                    style={{
                      padding: '0.65rem 1.25rem',
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
                    <Mic size={16} /> Take New Assessment
                  </button>
                </div>
              </div>

              {/* Integrated Stat Counters inside Header Box */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '1.25rem',
                paddingTop: '1.5rem'
              }}>
                <div style={{
                  padding: '1.1rem 1.25rem',
                  borderRadius: 16,
                  background: isDark ? 'rgba(15, 23, 42, 0.5)' : '#f8fafc',
                  border: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.05)' : '#e2e8f0'}`
                }}>
                  <div style={{ fontSize: '0.725rem', fontWeight: 700, color: isDark ? '#94a3b8' : '#64748b', textTransform: 'uppercase', letterSpacing: '0.03em' }}>
                    Completed Assessments
                  </div>
                  <div style={{ fontSize: '1.8rem', fontWeight: 900, color: isDark ? '#ffffff' : '#0f172a', marginTop: 4 }}>
                    {totalAssessments}
                  </div>
                </div>

                <div style={{
                  padding: '1.1rem 1.25rem',
                  borderRadius: 16,
                  background: isDark ? 'rgba(34, 197, 94, 0.1)' : 'rgba(34, 197, 94, 0.06)',
                  border: `1px solid ${isDark ? 'rgba(34, 197, 94, 0.25)' : 'rgba(34, 197, 94, 0.2)'}`
                }}>
                  <div style={{ fontSize: '0.725rem', fontWeight: 700, color: '#22c55e', textTransform: 'uppercase', letterSpacing: '0.03em' }}>
                    Passed Assessments
                  </div>
                  <div style={{ fontSize: '1.8rem', fontWeight: 900, color: '#22c55e', marginTop: 4 }}>
                    {passedAssessments}
                  </div>
                </div>

                <div style={{
                  padding: '1.1rem 1.25rem',
                  borderRadius: 16,
                  background: isDark ? 'rgba(56, 189, 248, 0.1)' : 'rgba(0, 180, 216, 0.06)',
                  border: `1px solid ${isDark ? 'rgba(56, 189, 248, 0.25)' : 'rgba(0, 180, 216, 0.2)'}`
                }}>
                  <div style={{ fontSize: '0.725rem', fontWeight: 700, color: '#00B4D8', textTransform: 'uppercase', letterSpacing: '0.03em' }}>
                    Average Score
                  </div>
                  <div style={{ fontSize: '1.8rem', fontWeight: 900, color: '#00B4D8', marginTop: 4 }}>
                    {avgScore}%
                  </div>
                </div>

                <div style={{
                  padding: '1.1rem 1.25rem',
                  borderRadius: 16,
                  background: isDark ? 'rgba(234, 179, 8, 0.1)' : 'rgba(234, 179, 8, 0.06)',
                  border: `1px solid ${isDark ? 'rgba(234, 179, 8, 0.25)' : 'rgba(234, 179, 8, 0.2)'}`
                }}>
                  <div style={{ fontSize: '0.725rem', fontWeight: 700, color: '#eab308', textTransform: 'uppercase', letterSpacing: '0.03em' }}>
                    Highest Score Achieved
                  </div>
                  <div style={{ fontSize: '1.8rem', fontWeight: 900, color: '#eab308', marginTop: 4 }}>
                    {highestScore}%
                  </div>
                </div>
              </div>
            </div>

            {/* Reports List */}
            {loadingReports ? (
              <div style={{ padding: '4rem', textAlign: 'center', color: isDark ? '#94a3b8' : '#64748b' }}>
                Loading your score reports...
              </div>
            ) : reports.length === 0 ? (
              <div style={{
                padding: '3.5rem 2rem',
                borderRadius: 24,
                background: isDark ? 'rgba(30, 41, 59, 0.5)' : '#ffffff',
                border: `1.5px solid ${isDark ? 'rgba(255, 255, 255, 0.08)' : '#e2e8f0'}`,
                textAlign: 'center'
              }}>
                <Award size={48} color="#00B4D8" style={{ margin: '0 auto 1rem auto' }} />
                <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: isDark ? '#ffffff' : '#0f172a', marginBottom: 6 }}>
                  No Assessment Reports Found Yet
                </h3>
                <p style={{ color: isDark ? '#94a3b8' : '#64748b', fontSize: '0.95rem', maxWidth: 500, margin: '0 auto 1.5rem auto' }}>
                  Take an AI Mock Interview or Coding Assessment to generate your verified performance score report!
                </p>
                <button
                  onClick={() => router.push('/careers/mock-interview')}
                  style={{
                    padding: '0.85rem 1.75rem',
                    borderRadius: 14,
                    background: 'linear-gradient(135deg, #0077B6 0%, #00B4D8 100%)',
                    color: '#ffffff',
                    border: 'none',
                    fontWeight: 800,
                    fontSize: '0.95rem',
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 8
                  }}
                >
                  Start Assessment Now <ArrowRight size={18} />
                </button>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                {reports.map((report, idx) => {
                  const isPass = report.overallResult?.toLowerCase() === 'pass';
                  const dateStr = report.createdAt ? new Date(report.createdAt).toLocaleDateString() : new Date().toLocaleDateString();

                  return (
                    <div key={report.id || idx} style={{
                      padding: '1.5rem',
                      borderRadius: 20,
                      background: isDark ? 'rgba(15, 23, 42, 0.7)' : '#ffffff',
                      border: `1.5px solid ${isPass ? 'rgba(34, 197, 94, 0.3)' : (isDark ? 'rgba(255, 255, 255, 0.08)' : '#e2e8f0')}`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      flexWrap: 'wrap',
                      gap: 16
                    }}>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
                          <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#00B4D8', textTransform: 'uppercase' }}>
                            {report.difficulty} Assessment
                          </span>
                          <span style={{ fontSize: '0.75rem', color: isDark ? '#94a3b8' : '#64748b' }}>
                            &bull; {dateStr}
                          </span>
                        </div>
                        <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: isDark ? '#ffffff' : '#0f172a', margin: 0 }}>
                          {report.jobRole}
                        </h3>
                        <div style={{ fontSize: '0.85rem', color: isDark ? '#94a3b8' : '#64748b', marginTop: 4 }}>
                          Duration: {report.duration} &bull; Questions: {report.totalQuestions}
                        </div>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
                        {/* Score Badge */}
                        <div style={{ textAlign: 'center' }}>
                          <div style={{ fontSize: '0.7rem', fontWeight: 700, color: isDark ? '#94a3b8' : '#64748b', textTransform: 'uppercase' }}>Score</div>
                          <div style={{ fontSize: '1.6rem', fontWeight: 900, color: isPass ? '#22c55e' : '#ef4444' }}>
                            {report.finalScore}%
                          </div>
                        </div>

                        {/* Result Badge */}
                        <span style={{
                          padding: '0.45rem 1rem',
                          borderRadius: 12,
                          fontWeight: 800,
                          fontSize: '0.85rem',
                          background: isPass ? 'rgba(34, 197, 94, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                          color: isPass ? '#22c55e' : '#ef4444',
                          border: `1px solid ${isPass ? 'rgba(34, 197, 94, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`
                        }}>
                          {report.overallResult?.toUpperCase() || 'PASS'}
                        </span>

                        {/* Actions */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <button
                            onClick={() => setSelectedReport(report)}
                            style={{
                              padding: '0.6rem 1.1rem',
                              borderRadius: 12,
                              background: 'linear-gradient(135deg, #0077B6 0%, #00B4D8 100%)',
                              color: '#ffffff',
                              border: 'none',
                              fontWeight: 800,
                              fontSize: '0.85rem',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              gap: 6
                            }}
                          >
                            <Eye size={16} /> View Score Report
                          </button>

                          <button
                            onClick={() => exportReportToPDF(report)}
                            title="Download PDF"
                            style={{
                              padding: '0.6rem',
                              borderRadius: 12,
                              background: isDark ? 'rgba(255,255,255,0.08)' : '#e2e8f0',
                              color: isDark ? '#ffffff' : '#0f172a',
                              border: 'none',
                              cursor: 'pointer'
                            }}
                          >
                            <Download size={16} />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

      </div>
    </CandidateDashboardLayout>
  );
}
