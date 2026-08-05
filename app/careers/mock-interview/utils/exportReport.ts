import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';

export interface ReportData {
  id?: string;
  candidateName: string;
  candidateId?: string;
  email: string;
  jobRole: string;
  experienceLevel?: string;
  assessmentName: string;
  difficulty: string;
  duration: string;
  totalQuestions: number;
  attemptedQuestions: number;
  unansweredQuestions: number;
  finalScore: number;
  percentage: number;
  overallResult: string;
  performanceLevel: string;
  hiringRecommendation: string;
  recommendationReason: string;
  sectionScores?: Record<string, { total: number; correct: number; wrong: number; score: number }>;
  codingDetails?: any[];
  skillAnalysis?: Array<{ skill: string; score: number }>;
  questionReview?: any[];
  strengths?: string[];
  improvements?: string[];
  scoreFormula?: any;
  createdAt?: string | Date;
}

// =============================================================================
// 1. PDF EXPORT GENERATOR
// =============================================================================
export function exportReportToPDF(data: ReportData) {
  const doc = new jsPDF();
  const dateStr = data.createdAt ? new Date(data.createdAt).toLocaleDateString() : new Date().toLocaleDateString();

  // Primary Header Banner
  doc.setFillColor(15, 23, 42); // Deep Navy Slate
  doc.rect(0, 0, 210, 36, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.text('OFFICIAL INTERVIEW ASSESSMENT REPORT', 14, 18);

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(56, 189, 248);
  doc.text('TheJobSync AI Talent & Coding Verification Platform', 14, 26);

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(9);
  doc.text(`Date: ${dateStr}`, 160, 26);

  // Overall Summary Table
  doc.setTextColor(15, 23, 42);
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('1. OVERALL CANDIDATE SUMMARY', 14, 46);

  const summaryRows = [
    ['Candidate Name', data.candidateName, 'Candidate ID', data.candidateId || data.id || 'CAND-8891'],
    ['Email', data.email, 'Job Role', `${data.jobRole} (${data.experienceLevel || 'Fresher'})`],
    ['Experience Level', data.experienceLevel || 'Fresher', 'Assessment Level', data.difficulty],
    ['Assessment Name', data.assessmentName, 'Duration', data.duration],
    ['Duration', data.duration, 'Total Questions', `${data.totalQuestions} (Attempted: ${data.attemptedQuestions}, Unanswered: ${data.unansweredQuestions})`],
    ['Final Score', `${data.finalScore} / 100 (${data.percentage}%)`, 'Overall Result', `${data.overallResult.toUpperCase()} (${data.performanceLevel})`],
    ['Recommendation', data.hiringRecommendation, 'Reason', data.recommendationReason]
  ];

  autoTable(doc, {
    startY: 50,
    head: [],
    body: summaryRows,
    theme: 'grid',
    styles: { fontSize: 8.5, cellPadding: 3 },
    columnStyles: {
      0: { fontStyle: 'bold', fillColor: [241, 245, 249], cellWidth: 35 },
      1: { cellWidth: 65 },
      2: { fontStyle: 'bold', fillColor: [241, 245, 249], cellWidth: 35 },
      3: { cellWidth: 45 }
    }
  });

  let currentY = (doc as any).lastAutoTable.finalY + 12;

  // Section-wise Scores
  if (data.sectionScores && Object.keys(data.sectionScores).length > 0) {
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('2. SECTION-WISE BREAKDOWN', 14, currentY);

    const sectionHead = [['Section / Category', 'Total Questions', 'Correct', 'Wrong', 'Score %']];
    const sectionBody = Object.entries(data.sectionScores).map(([cat, res]) => [
      cat,
      res.total,
      res.correct,
      res.wrong,
      `${res.score}%`
    ]);

    autoTable(doc, {
      startY: currentY + 4,
      head: sectionHead,
      body: sectionBody,
      theme: 'striped',
      headStyles: { fillColor: [0, 119, 182] },
      styles: { fontSize: 8.5, cellPadding: 2.5 }
    });

    currentY = (doc as any).lastAutoTable.finalY + 12;
  }

  // Coding Evaluation Details
  if (data.codingDetails && data.codingDetails.length > 0) {
    if (currentY > 230) {
      doc.addPage();
      currentY = 20;
    }

    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('3. CODING EVALUATION BREAKDOWN', 14, currentY);

    const codingHead = [['Question', 'Lang', 'Status', 'Passed', 'Failed', 'Time', 'Memory', 'Score']];
    const codingBody = data.codingDetails.map(c => [
      c.questionName,
      c.language,
      c.compilationStatus,
      c.passedTestCases,
      c.failedTestCases,
      c.executionTime,
      c.memory,
      c.score
    ]);

    autoTable(doc, {
      startY: currentY + 4,
      head: codingHead,
      body: codingBody,
      theme: 'grid',
      headStyles: { fillColor: [15, 23, 42] },
      styles: { fontSize: 8, cellPadding: 2.5 }
    });

    currentY = (doc as any).lastAutoTable.finalY + 12;
  }

  // Skill Analysis
  if (data.skillAnalysis && data.skillAnalysis.length > 0) {
    if (currentY > 230) {
      doc.addPage();
      currentY = 20;
    }

    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('4. SKILL-WISE ANALYSIS (OUT OF 100%)', 14, currentY);

    const skillHead = [['Skill Competency Domain', 'Proficiency Score']];
    const skillBody = data.skillAnalysis.map(s => [s.skill, `${s.score}%`]);

    autoTable(doc, {
      startY: currentY + 4,
      head: skillHead,
      body: skillBody,
      theme: 'plain',
      styles: { fontSize: 8.5, cellPadding: 2 },
      columnStyles: { 0: { fontStyle: 'bold' } }
    });

    currentY = (doc as any).lastAutoTable.finalY + 12;
  }

  // Save File
  const filename = `${data.candidateName.replace(/\s+/g, '_')}_Interview_Report.pdf`;
  doc.save(filename);
}

// =============================================================================
// 2. EXCEL WORKBOOK EXPORT GENERATOR
// =============================================================================
export function exportReportToExcel(data: ReportData) {
  const wb = XLSX.utils.book_new();

  // Sheet 1: Summary & Metrics
  const summarySheetData = [
    { Field: 'Candidate Name', Value: data.candidateName },
    { Field: 'Candidate ID', Value: data.candidateId || data.id || 'CAND-8891' },
    { Field: 'Email', Value: data.email },
    { Field: 'Job Role', Value: data.jobRole },
    { Field: 'Experience Level', Value: data.experienceLevel || 'Fresher' },
    { Field: 'Assessment Name', Value: data.assessmentName },
    { Field: 'Difficulty Level', Value: data.difficulty },
    { Field: 'Duration', Value: data.duration },
    { Field: 'Total Questions', Value: data.totalQuestions },
    { Field: 'Attempted Questions', Value: data.attemptedQuestions },
    { Field: 'Unanswered Questions', Value: data.unansweredQuestions },
    { Field: 'Final Score', Value: `${data.finalScore} / 100` },
    { Field: 'Percentage', Value: `${data.percentage}%` },
    { Field: 'Overall Result', Value: data.overallResult },
    { Field: 'Performance Level', Value: data.performanceLevel },
    { Field: 'Hiring Recommendation', Value: data.hiringRecommendation },
    { Field: 'Recommendation Reason', Value: data.recommendationReason }
  ];

  const wsSummary = XLSX.utils.json_to_sheet(summarySheetData);
  XLSX.utils.book_append_sheet(wb, wsSummary, 'Overall Summary');

  // Sheet 2: Coding Breakdown
  if (data.codingDetails && data.codingDetails.length > 0) {
    const wsCoding = XLSX.utils.json_to_sheet(data.codingDetails);
    XLSX.utils.book_append_sheet(wb, wsCoding, 'Coding Evaluation');
  }

  // Sheet 3: Skill Analysis
  if (data.skillAnalysis && data.skillAnalysis.length > 0) {
    const wsSkills = XLSX.utils.json_to_sheet(data.skillAnalysis);
    XLSX.utils.book_append_sheet(wb, wsSkills, 'Skill Analysis');
  }

  // Sheet 4: Question Review
  if (data.questionReview && data.questionReview.length > 0) {
    const wsQuestions = XLSX.utils.json_to_sheet(data.questionReview);
    XLSX.utils.book_append_sheet(wb, wsQuestions, 'Question Review');
  }

  const filename = `${data.candidateName.replace(/\s+/g, '_')}_Assessment_Report.xlsx`;
  XLSX.writeFile(wb, filename);
}

// =============================================================================
// 3. PRINT REPORT UTILITY
// =============================================================================
export function printAssessmentReport() {
  if (typeof window !== 'undefined') {
    window.print();
  }
}
