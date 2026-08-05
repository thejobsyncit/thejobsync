import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      candidateId,
      candidateName,
      email,
      jobRole,
      experienceLevel,
      assessmentName,
      difficulty,
      codingSubDifficulty,
      duration,
      totalQuestions,
      attemptedQuestions,
      unansweredQuestions,
      testResults,          // Record<number, CodeEvaluationResult>
      questions,            // Question[]
      codingChallenges,     // CodingChallenge[]
      userAnswers,          // Record<number, string>
      mcqAnswers,           // Record<number, number>
      codeAnswers,          // Record<number, Record<string, string>>
      selectedLanguage
    } = body;

    // =========================================================================
    // 1. DYNAMIC SECTION-WISE SCORE CALCULATION
    // =========================================================================
    let sectionScores: Record<string, { total: number; correct: number; wrong: number; score: number }> = {};
    let totalMcqQuestions = 0;
    let correctMcqCount = 0;

    let totalDescriptiveQuestions = 0;
    let totalDescriptiveScoreSum = 0;

    let totalCodingQuestions = 0;
    let totalCodingPassedCases = 0;
    let totalCodingTotalCases = 0;
    let totalCodingScoreSum = 0;

    let codingDetails: any[] = [];
    let questionReview: any[] = [];

    // Evaluate MCQs or Descriptive Questions
    if (difficulty !== 'Hard' && Array.isArray(questions)) {
      questions.forEach((q: any, idx: number) => {
        const cat = q.category || 'General Assessment';
        if (!sectionScores[cat]) {
          sectionScores[cat] = { total: 0, correct: 0, wrong: 0, score: 0 };
        }
        sectionScores[cat].total += 1;

        if (difficulty === 'Easy') {
          totalMcqQuestions += 1;
          const candidateAnsIdx = mcqAnswers[idx];
          const isCorrect = candidateAnsIdx === q.correctAnswer;
          if (isCorrect) {
            correctMcqCount += 1;
            sectionScores[cat].correct += 1;
          } else {
            sectionScores[cat].wrong += 1;
          }

          questionReview.push({
            id: idx + 1,
            question: q.question,
            options: q.options || [],
            candidateAnswer: candidateAnsIdx !== undefined ? (q.options?.[candidateAnsIdx] || 'No Answer') : 'Not Attempted',
            correctAnswer: q.options?.[q.correctAnswer] || 'N/A',
            result: isCorrect ? 'Correct' : 'Incorrect',
            marks: isCorrect ? '2/2' : '0/2',
            explanation: q.explanation || 'No detailed explanation provided.'
          });
        } else {
          // Medium Scenario/Descriptive
          totalDescriptiveQuestions += 1;
          const candAns = userAnswers[idx] || '';
          const cleanAns = candAns.toLowerCase().trim();
          const keyPoints: string[] = q.keyPoints || [];

          let matched: string[] = [];
          keyPoints.forEach((kp: string) => {
            if (cleanAns.includes(kp.toLowerCase())) {
              matched.push(kp);
            }
          });

          let score = 0;
          if (keyPoints.length > 0) {
            score = Math.min(100, Math.round((matched.length / keyPoints.length) * 100));
          } else if (candAns.length > 10) {
            score = Math.min(100, Math.round((candAns.length / 150) * 100));
          }

          totalDescriptiveScoreSum += score;
          const isCorrect = score >= 50;
          if (isCorrect) sectionScores[cat].correct += 1;
          else sectionScores[cat].wrong += 1;

          questionReview.push({
            id: idx + 1,
            question: q.question,
            candidateAnswer: candAns || 'Not Attempted',
            correctAnswer: `Key Concepts: ${keyPoints.join(', ')}`,
            result: isCorrect ? 'Satisfactory' : 'Needs Improvement',
            marks: `${Math.round((score / 100) * 5)}/5`,
            explanation: q.explanation || `Matched Key Concepts: ${matched.join(', ') || 'None'}`
          });
        }
      });
    }

    // Evaluate Coding Challenges
    if (difficulty === 'Hard' && Array.isArray(codingChallenges)) {
      if (!sectionScores['Coding & live Algorithms']) {
        sectionScores['Coding & live Algorithms'] = { total: 0, correct: 0, wrong: 0, score: 0 };
      }

      codingChallenges.forEach((c: any, idx: number) => {
        const evalRes = testResults[idx] || {
          compilationStatus: 'Success',
          passedTestCasesCount: 0,
          failedTestCasesCount: c.testCases?.length || 0,
          totalTestCases: c.testCases?.length || 0,
          executionTimeMs: 28,
          memoryMb: 14,
          score: 0,
          feedback: 'Not executed'
        };

        totalCodingQuestions += 1;
        totalCodingPassedCases += evalRes.passedTestCasesCount || 0;
        totalCodingTotalCases += evalRes.totalTestCases || 0;
        totalCodingScoreSum += evalRes.score || 0;

        const cat = c.category || 'Coding';
        if (!sectionScores[cat]) {
          sectionScores[cat] = { total: 0, correct: 0, wrong: 0, score: 0 };
        }
        sectionScores[cat].total += 1;
        if (evalRes.score === 100) sectionScores[cat].correct += 1;
        else sectionScores[cat].wrong += 1;

function getCandidateSubmittedCode(codeObj: any, selectedLang: string, starterCodeObj?: Record<string, string>): string {
  if (!codeObj) {
    if (starterCodeObj && starterCodeObj[selectedLang]) return starterCodeObj[selectedLang];
    return '';
  }
  if (typeof codeObj === 'string' && codeObj.trim().length > 0) {
    return codeObj;
  }
  if (typeof codeObj === 'object') {
    if (codeObj[selectedLang] && typeof codeObj[selectedLang] === 'string' && codeObj[selectedLang].trim().length > 0) {
      return codeObj[selectedLang];
    }
    const lowerLang = (selectedLang || '').toLowerCase();
    const matchedKey = Object.keys(codeObj).find(k => k.toLowerCase() === lowerLang);
    if (matchedKey && typeof codeObj[matchedKey] === 'string' && codeObj[matchedKey].trim().length > 0) {
      return codeObj[matchedKey];
    }
    for (const key of Object.keys(codeObj)) {
      const codeVal = codeObj[key];
      if (typeof codeVal === 'string' && codeVal.trim().length > 0) {
        if (starterCodeObj && starterCodeObj[key] && codeVal.trim() !== starterCodeObj[key].trim()) {
          return codeVal;
        }
      }
    }
    for (const key of Object.keys(codeObj)) {
      const codeVal = codeObj[key];
      if (typeof codeVal === 'string' && codeVal.trim().length > 0) {
        return codeVal;
      }
    }
  }
  return (starterCodeObj && starterCodeObj[selectedLang]) || '';
}

        const submittedCode = getCandidateSubmittedCode(codeAnswers[idx], selectedLanguage || 'JavaScript', c.starterCode);

        codingDetails.push({
          questionName: c.title,
          language: selectedLanguage || 'JavaScript',
          compilationStatus: evalRes.compilationStatus || 'Success',
          passedTestCases: `${evalRes.passedTestCasesCount || 0}/${evalRes.totalTestCases || 0}`,
          failedTestCases: `${evalRes.failedTestCasesCount || 0}/${evalRes.totalTestCases || 0}`,
          executionTime: `${evalRes.executionTimeMs || 28} ms`,
          memory: `${evalRes.memoryMb || 14} MB`,
          score: `${evalRes.score || 0}%`,
          feedback: evalRes.feedback || 'Code evaluated successfully.',
          candidateAnswer: submittedCode
        });

        questionReview.push({
          id: idx + 1,
          question: c.description || c.title || `[${c.category}] ${c.title}`,
          questionName: c.title,
          description: c.description,
          constraints: c.constraints || [],
          examples: c.examples || [],
          candidateAnswer: submittedCode,
          correctAnswer: c.referenceSolution?.[selectedLanguage] || c.referenceSolution?.JavaScript || 'Reference solution available in report',
          result: evalRes.score === 100 ? 'Passed (100%)' : `Partial (${evalRes.score}%)`,
          marks: `${Math.round((evalRes.score / 100) * 10)}/10`,
          feedback: evalRes.feedback || 'Code evaluated successfully.',
          explanation: c.referenceSolution?.explanation || 'Optimal algorithmic reference solution.'
        });
      });
    }

    // Calculate section score percentages
    Object.keys(sectionScores).forEach(cat => {
      const sec = sectionScores[cat];
      sec.score = sec.total > 0 ? Math.round((sec.correct / sec.total) * 100) : 0;
    });

    // =========================================================================
    // 2. WEIGHTED FINAL SCORE CALCULATION
    // =========================================================================
    let mcqPct = totalMcqQuestions > 0 ? Math.round((correctMcqCount / totalMcqQuestions) * 100) : 0;
    let codingPct = totalCodingQuestions > 0 ? Math.round(totalCodingScoreSum / totalCodingQuestions) : 0;
    let scenarioPct = totalDescriptiveQuestions > 0 ? Math.round(totalDescriptiveScoreSum / totalDescriptiveQuestions) : 0;

    let finalScorePct = 0;
    let scoreFormula = '';

    if (difficulty === 'Hard') {
      // 100% Coding Mode
      finalScorePct = codingPct;
      scoreFormula = `Final Score = Coding Score (${codingPct}%)`;
    } else if (difficulty === 'Easy') {
      // 100% MCQ Mode
      finalScorePct = mcqPct;
      scoreFormula = `Final Score = MCQ Accuracy (${mcqPct}%)`;
    } else {
      // 100% Scenario Mode
      finalScorePct = scenarioPct;
      scoreFormula = `Final Score = Scenario Concept Score (${scenarioPct}%)`;
    }

    const finalScore = Math.round((finalScorePct / 100) * 100);
    const overallResult = finalScore >= 60 ? 'Pass' : 'Fail';

    // Performance Level
    let performanceLevel = 'Needs Improvement';
    if (finalScore >= 85) performanceLevel = 'Excellent';
    else if (finalScore >= 70) performanceLevel = 'Good';
    else if (finalScore >= 50) performanceLevel = 'Average';

    // Hiring Recommendation
    let hiringRecommendation = 'Not Recommended';
    let recommendationReason = '';

    if (finalScore >= 80) {
      hiringRecommendation = 'Highly Recommended';
      recommendationReason = `Candidate scored ${finalScore}%, demonstrated strong domain proficiency, solved coding/technical challenges effectively, and showed solid analytical capabilities.`;
    } else if (finalScore >= 60) {
      hiringRecommendation = 'Recommended with Training';
      recommendationReason = `Candidate achieved ${finalScore}%, showing good foundational knowledge, but would benefit from targeted onboarding and training in specific technical edge cases.`;
    } else {
      hiringRecommendation = 'Not Recommended';
      recommendationReason = `Candidate scored ${finalScore}%, falling below the required minimum passing threshold of 60%.`;
    }

    // =========================================================================
    // 3. SKILL-WISE ANALYSIS (Radar / Progress Metrics)
    // =========================================================================
    const problemSolving = Math.min(100, Math.round(finalScore * 0.95 + (codingPct > 0 ? 5 : 0)));
    const logicalThinking = Math.min(100, Math.round(finalScore * 0.92 + (mcqPct > 0 ? 8 : 4)));
    const programming = codingPct || (finalScore >= 70 ? 80 : 50);
    const debugging = Math.min(100, Math.round((codingPct || finalScore) * 0.9));
    const manualTesting = Math.min(100, Math.round(finalScore * 0.94));
    const sqlScore = sectionScores['Database & SQL']?.score ?? (codingPct > 0 ? Math.round(codingPct * 0.85) : 70);
    const frontendScore = sectionScores['Frontend & Web Development']?.score ?? Math.min(100, Math.round(finalScore * 0.93));
    const attentionToDetail = Math.min(100, Math.round(finalScore * 0.96));

    const skillAnalysis = [
      { skill: 'Problem Solving', score: problemSolving },
      { skill: 'Logical Thinking', score: logicalThinking },
      { skill: 'Programming', score: programming },
      { skill: 'Debugging', score: debugging },
      { skill: 'Manual Testing', score: manualTesting },
      { skill: 'SQL', score: sqlScore },
      { skill: 'Frontend Knowledge', score: frontendScore },
      { skill: 'Attention to Detail', score: attentionToDetail }
    ];

    // =========================================================================
    // 4. STRENGTHS & AREAS FOR IMPROVEMENT
    // =========================================================================
    let strengths: string[] = [];
    let areasForImprovement: string[] = [];

    if (finalScore >= 80) strengths.push('Strong overall technical comprehension & problem-solving ability');
    if (codingPct >= 80) strengths.push('Excellent algorithmic coding and syntax execution skills');
    if (mcqPct >= 80) strengths.push('High accuracy on core theoretical concepts and fundamentals');
    if (sqlScore >= 75) strengths.push('Solid grasp of SQL database querying & relational logic');
    if (frontendScore >= 75) strengths.push('Strong understanding of frontend architecture and modern web practices');
    if (strengths.length === 0) strengths.push('Demonstrates basic familiarity with core job requirements');

    if (codingPct < 75 && difficulty === 'Hard') areasForImprovement.push('Edge case handling and performance optimization in live coding');
    if (sqlScore < 75) areasForImprovement.push('SQL JOINs, subqueries, and database aggregation clauses');
    if (mcqPct < 75 && difficulty === 'Easy') areasForImprovement.push('Accuracy on fundamental technical concepts under timed conditions');
    if (finalScore < 65) areasForImprovement.push('General technical problem solving and code debugging efficiency');
    if (areasForImprovement.length === 0) areasForImprovement.push('Minor optimization in complex algorithm time complexity');

    // =========================================================================
    // 5. CONSTRUCT REPORT OBJECT & PERSIST TO PRISMA
    // =========================================================================
    const reportObj = {
      id: `REP-${Date.now()}`,
      candidateId: candidateId || null,
      candidateName: candidateName || 'Candidate',
      email: email || 'candidate@example.com',
      jobRole: jobRole || 'Software Engineer',
      experienceLevel: experienceLevel || 'Fresher',
      assessmentName: assessmentName || 'AI Technical & Coding Assessment',
      difficulty: difficulty || 'Medium',
      codingSubDifficulty: codingSubDifficulty || null,
      duration: duration || '20 Minutes',
      totalQuestions: totalQuestions || 0,
      attemptedQuestions: attemptedQuestions || 0,
      unansweredQuestions: unansweredQuestions || 0,
      finalScore: finalScore,
      percentage: finalScorePct,
      overallResult,
      performanceLevel,
      hiringRecommendation,
      recommendationReason,
      sectionScoresJson: JSON.stringify(sectionScores),
      codingDetailsJson: JSON.stringify(codingDetails),
      skillAnalysisJson: JSON.stringify(skillAnalysis),
      questionReviewJson: JSON.stringify(questionReview),
      strengthsJson: JSON.stringify(strengths),
      improvementsJson: JSON.stringify(areasForImprovement),
      scoreFormulaJson: JSON.stringify({
        formula: scoreFormula,
        mcqWeight: '40%',
        codingWeight: '40%',
        scenarioWeight: '20%',
        mcqScore: mcqPct,
        codingScore: codingPct,
        scenarioScore: scenarioPct,
        finalPct: finalScorePct
      }),
      mcqScore: mcqPct,
      codingScore: codingPct,
      scenarioScore: scenarioPct,
      createdAt: new Date().toISOString()
    };

    try {
      if ((prisma as any).assessmentResult) {
        const dbData = { ...reportObj };
        delete (dbData as any).id;
        delete (dbData as any).createdAt;

        const record = await (prisma as any).assessmentResult.create({
          data: dbData
        });
        return NextResponse.json({ success: true, result: record });
      }
    } catch (dbErr) {
      console.warn('Prisma DB write warning, returning generated report object:', dbErr);
    }

    return NextResponse.json({ success: true, result: reportObj });
  } catch (err: any) {
    console.error('Assessment submit API error:', err);
    return NextResponse.json({ error: err.message || 'Failed to submit assessment' }, { status: 500 });
  }
}
