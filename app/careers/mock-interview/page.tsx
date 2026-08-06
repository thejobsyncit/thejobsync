'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useCandidateAuth } from '@/context/CandidateAuthContext';
import { usePortalTheme } from '@/context/PortalThemeContext';
import DashboardLayout from '../DashboardLayout';
import { motion } from 'framer-motion';
import {
  Mic, MicOff, CheckCircle2, Circle, Sparkles,
  Clock, MessageSquare, Volume2, VolumeX, Award, ArrowRight,
  RotateCcw, Briefcase, XCircle, Check, ArrowLeft, Code, Play, CheckCircle
} from 'lucide-react';
import {
  getQuestionsForInterview,
  MCQQuestion,
  DescriptiveQuestion,
  Question,
  CODING_CHALLENGES,
  getCodingChallenges,
  CodingChallenge,
  EXPERIENCE_LEVELS
} from './questionBank';
import AssessmentReportView from './components/AssessmentReportView';
import { ReportData } from './utils/exportReport';

type CodingLanguage = 'Python' | 'Java' | 'C++' | 'C' | 'JavaScript' | 'TypeScript' | 'SQL';

export default function AIMockInterviewPage() {
  const { isDark } = usePortalTheme();
  const { candidate, isAuthenticated, isLoading } = useCandidateAuth();
  const router = useRouter();

  // Setup Form State
  const [selectedRole, setSelectedRole] = useState('Full Stack Developer');
  const [customRoleText, setCustomRoleText] = useState('');
  const [experienceLevel, setExperienceLevel] = useState<'Intern' | 'Fresher' | 'Experienced'>('Fresher');

  const [difficulty, setDifficulty] = useState<'Easy' | 'Medium' | 'Hard'>('Medium');
  const [codingSubDifficulty, setCodingSubDifficulty] = useState<'Easy' | 'Medium' | 'Hard'>('Easy');
  const [duration, setDuration] = useState<'10 Minutes' | '20 Minutes' | '30 Minutes'>('20 Minutes');
  const [answerMode, setAnswerMode] = useState<'Text' | 'Speech'>('Text');

  // Interview Session State
  const [step, setStep] = useState<'setup' | 'interview' | 'results'>('setup');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [codingChallenges, setCodingChallenges] = useState<CodingChallenge[]>([]);
  const [selectedLanguage, setSelectedLanguage] = useState<CodingLanguage>('JavaScript');
  const [codeAnswers, setCodeAnswers] = useState<Record<number, Record<string, string>>>({});
  
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<number, string>>({});
  const [mcqAnswers, setMcqAnswers] = useState<Record<number, number>>({});
  
  // Code Execution Output State
  const [testResults, setTestResults] = useState<Record<number, any>>({});
  const [isExecuting, setIsExecuting] = useState(false);
  const [customInputParams, setCustomInputParams] = useState('');
  const [customInputResult, setCustomInputResult] = useState<{ output?: string, error?: string, isRunning?: boolean } | null>(null);
  const [submittedReport, setSubmittedReport] = useState<ReportData | null>(null);
  const [isSubmittingReport, setIsSubmittingReport] = useState(false);

  // Candidate Portfolio State for Tailored Questions
  const [portfolioData, setPortfolioData] = useState<any>(null);

  // Fetch Candidate Portfolio Links from API
  useEffect(() => {
    if (candidate?.email) {
      fetch(`/api/candidate-portfolio?email=${encodeURIComponent(candidate.email)}`)
        .then(res => res.json())
        .then(data => {
          if (data.success && data.portfolio) {
            setPortfolioData(data.portfolio);
          }
        })
        .catch(err => console.error('Failed to fetch portfolio for interview:', err));
    }
  }, [candidate?.email]);

  // Speech & Audio State
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const recognitionRef = useRef<any>(null);

  // Timer State
  const [initialSeconds, setInitialSeconds] = useState(1200); // default 20 mins
  const [timeLeft, setTimeLeft] = useState(1200);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Auth Guard
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/careers/login');
    }
  }, [isAuthenticated, isLoading, router]);

  // Handle Browser Back Button (popstate) to keep candidate inside AI Mock Interview Setup
  useEffect(() => {
    if (step === 'interview' || step === 'results') {
      window.history.pushState({ step }, '', window.location.href);

      const handlePopState = () => {
        if (step === 'interview') {
          const confirmExit = confirm('Are you sure you want to exit the active interview and return to setup?');
          if (confirmExit) {
            setStep('setup');
          } else {
            window.history.pushState({ step }, '', window.location.href);
          }
        } else if (step === 'results') {
          setStep('setup');
        }
      };

      window.addEventListener('popstate', handlePopState);
      return () => {
        window.removeEventListener('popstate', handlePopState);
      };
    }
  }, [step]);

  // Timer Effect
  useEffect(() => {
    if (step === 'interview' && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(timerRef.current as NodeJS.Timeout);
            handleFinishInterview();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [step]);

  // Speech Recognition Setup
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = 'en-US';

        recognition.onresult = (event: any) => {
          let currentTranscript = '';
          for (let i = event.resultIndex; i < event.results.length; i++) {
            currentTranscript += event.results[i][0].transcript;
          }
          setUserAnswers(prev => ({
            ...prev,
            [currentIndex]: (prev[currentIndex] ? prev[currentIndex] + ' ' : '') + currentTranscript
          }));
        };

        recognition.onerror = () => setIsListening(false);
        recognition.onend = () => setIsListening(false);

        recognitionRef.current = recognition;
      }
    }
  }, [currentIndex]);

  // Auto-switch language to SQL when a Database & SQL challenge is active
  useEffect(() => {
    if (difficulty === 'Hard' && codingChallenges[currentIndex]) {
      const current = codingChallenges[currentIndex];
      if (current.category === 'Database & SQL') {
        setSelectedLanguage('SQL');
      }
    }
  }, [currentIndex, codingChallenges, difficulty]);

  if (!candidate) return null;

  const roleName = selectedRole === 'Custom Role' ? (customRoleText.trim() || 'Custom Role') : selectedRole;

  // Parse candidate resume skills cleanly
  const parsedSkills: string[] = candidate?.skills
    ? (typeof candidate.skills === 'string'
        ? (candidate.skills.startsWith('[') ? (JSON.parse(candidate.skills) as string[]) : candidate.skills.split(',').map(s => s.trim()).filter(Boolean))
        : (Array.isArray(candidate.skills) ? candidate.skills : []))
    : [];

  // Start Interview Action
  const handleStartInterview = () => {
    const candidateContext = {
      skills: parsedSkills,
      experience: candidate?.experience || undefined,
      headline: candidate?.headline || undefined,
      summary: (candidate as any)?.summary || undefined,
      currentRole: candidate?.currentRole || undefined,
      experienceLevel: experienceLevel,
      portfolioUrl: portfolioData?.portfolioUrl,
      githubUrl: portfolioData?.githubUrl,
      linkedinUrl: portfolioData?.linkedinUrl,
      leetcodeUrl: portfolioData?.leetcodeUrl,
      hackerrankUrl: portfolioData?.hackerrankUrl
    };

    if (difficulty === 'Hard') {
      // Coding Assessment Mode
      const cList = getCodingChallenges(roleName, codingSubDifficulty);
      const targetChallenges = cList.length > 0 ? cList : CODING_CHALLENGES;
      setCodingChallenges(targetChallenges);
      
      // Initialize code answers with starter templates
      const initialCodeMap: Record<number, Record<string, string>> = {};
      targetChallenges.forEach((c, idx) => {
        initialCodeMap[idx] = { ...c.starterCode };
      });
      setCodeAnswers(initialCodeMap);
    } else {
      const targetCount = difficulty === 'Easy' ? 50 : 25;
      const qList = getQuestionsForInterview(roleName, difficulty, targetCount, candidateContext);
      setQuestions(qList);
    }

    setCurrentIndex(0);
    setUserAnswers({});
    setMcqAnswers({});
    setTestResults({});
    
    const totalSecs = duration === '10 Minutes' ? 600 : duration === '20 Minutes' ? 1200 : 1800;
    setInitialSeconds(totalSecs);
    setTimeLeft(totalSecs);
    setStep('interview');
  };

  // Run & Test Code Execution Action calling Server Evaluation Engine
  const handleRunCode = async () => {
    const currentChallenge = codingChallenges[currentIndex];
    if (!currentChallenge) return;

    const currentCode = codeAnswers[currentIndex]?.[selectedLanguage] || currentChallenge.starterCode[selectedLanguage] || '';

    setIsExecuting(true);
    try {
      const res = await fetch('/api/assessments/evaluate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          challengeId: currentChallenge.id,
          userCode: currentCode,
          language: selectedLanguage
        })
      });

      const data = await res.json();
      setTestResults(prev => ({
        ...prev,
        [currentIndex]: data
      }));
    } catch (err: any) {
      console.error('Code evaluation error:', err);
      setTestResults(prev => ({
        ...prev,
        [currentIndex]: {
          compilationStatus: 'Compilation Error',
          compilationMessage: `❌ Error: ${err?.message || 'Failed to connect to evaluation engine'}`,
          executionTimeMs: 0,
          memoryMb: 0,
          totalTestCases: currentChallenge.testCases?.length || 0,
          passedTestCasesCount: 0,
          failedTestCasesCount: currentChallenge.testCases?.length || 0,
          score: 0,
          testCaseDetails: [],
          feedback: 'Execution failed.'
        }
      }));
    } finally {
      setIsExecuting(false);
    }
  };

  // Run Custom Code Execution Action
  const handleRunCustomCode = async () => {
    const currentChallenge = codingChallenges[currentIndex];
    if (!currentChallenge) return;

    if (!customInputParams.trim()) {
      setCustomInputResult({ error: 'Please enter custom input parameters first.' });
      return;
    }

    const currentCode = codeAnswers[currentIndex]?.[selectedLanguage] || currentChallenge.starterCode[selectedLanguage] || '';

    setCustomInputResult({ isRunning: true });
    try {
      const res = await fetch('/api/assessments/evaluate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          challengeId: currentChallenge.id,
          userCode: currentCode,
          language: selectedLanguage,
          customInput: customInputParams
        })
      });

      const data = await res.json();
      if (data.success) {
        setCustomInputResult({ output: data.actualOutput, error: data.error });
      } else {
        setCustomInputResult({ error: data.error || 'Failed to execute custom input' });
      }
    } catch (err: any) {
      setCustomInputResult({ error: err?.message || 'Execution error' });
    }
  };

  // Speech Synthesis
  const speakQuestion = (text: string) => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.0;
      utterance.pitch = 1.0;
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      window.speechSynthesis.speak(utterance);
    }
  };

  const toggleSpeechRecognition = () => {
    if (!recognitionRef.current) {
      alert('Speech recognition is not supported in this browser. Please use Chrome or Edge.');
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      recognitionRef.current.start();
      setIsListening(true);
    }
  };

  const handleNextQuestion = () => {
    const total = difficulty === 'Hard' ? codingChallenges.length : questions.length;
    if (currentIndex < total - 1) {
      const nextIdx = currentIndex + 1;
      setCurrentIndex(nextIdx);
    }
  };

  const handlePrevQuestion = () => {
    if (currentIndex > 0) {
      const prevIdx = currentIndex - 1;
      setCurrentIndex(prevIdx);
    }
  };

  const getCandidateSubmittedCode = (codeObj: any, selectedLang: string, starterCodeObj?: Record<string, string>): string => {
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
  };

  const handleFinishInterview = async () => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    if (isListening && recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }

    let finalTestResults = { ...testResults };

    if (difficulty === 'Hard') {
      setIsExecuting(true);
      const evalPromises = codingChallenges.map(async (c, idx) => {
        if (!testResults[idx]) {
          const currentCode = getCandidateSubmittedCode(codeAnswers[idx], selectedLanguage, c.starterCode);
          try {
            const res = await fetch('/api/assessments/evaluate', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                challengeId: c.id,
                userCode: currentCode,
                language: selectedLanguage
              })
            });
            const data = await res.json();
            return { idx, data };
          } catch (err) {
            return { idx, data: null };
          }
        }
        return null;
      });

      const results = await Promise.all(evalPromises);
      const newTestResults = { ...testResults };
      results.forEach(item => {
        if (item && item.data) {
          newTestResults[item.idx] = item.data;
        }
      });
      finalTestResults = newTestResults;
      setTestResults(newTestResults);
      setIsExecuting(false);
    }

    setIsSubmittingReport(true);
    setStep('results');

    const totalQ = difficulty === 'Hard' ? codingChallenges.length : questions.length;
    const attemptedQ = difficulty === 'Hard'
      ? codingChallenges.filter((_, i) => codeAnswers[i]?.[selectedLanguage]).length
      : (difficulty === 'Easy' ? Object.keys(mcqAnswers).length : Object.keys(userAnswers).length);

    try {
      const res = await fetch('/api/assessments/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          candidateId: candidate?.id,
          candidateName: candidate?.name || 'Candidate',
          email: candidate?.email || 'candidate@example.com',
          jobRole: roleName,
          experienceLevel: experienceLevel,
          assessmentName: 'AI Technical & Coding Assessment',
          difficulty,
          codingSubDifficulty,
          duration,
          totalQuestions: totalQ,
          attemptedQuestions: attemptedQ,
          unansweredQuestions: Math.max(0, totalQ - attemptedQ),
          testResults: finalTestResults,
          questions,
          codingChallenges,
          userAnswers,
          mcqAnswers,
          codeAnswers,
          selectedLanguage
        })
      });

      const resData = await res.json();
      if (resData.success && resData.result) {
        const record = resData.result;
        const parseJsonSafe = (val: any, fallback: any = []) => {
          if (!val) return fallback;
          if (typeof val === 'object') return val;
          try { return JSON.parse(val); } catch { return fallback; }
        };

        const repData = {
          id: record.id,
          candidateName: record.candidateName,
          candidateId: record.candidateId || record.id,
          email: record.email,
          jobRole: record.jobRole,
          experienceLevel: record.experienceLevel || experienceLevel,
          assessmentName: record.assessmentName,
          difficulty: record.difficulty,
          duration: record.duration,
          totalQuestions: record.totalQuestions,
          attemptedQuestions: record.attemptedQuestions,
          unansweredQuestions: record.unansweredQuestions,
          finalScore: record.finalScore,
          percentage: record.percentage,
          overallResult: record.overallResult,
          performanceLevel: record.performanceLevel,
          hiringRecommendation: record.hiringRecommendation,
          recommendationReason: record.recommendationReason,
          sectionScores: parseJsonSafe(record.sectionScoresJson, {}),
          codingDetails: parseJsonSafe(record.codingDetailsJson, []),
          skillAnalysis: parseJsonSafe(record.skillAnalysisJson, []),
          questionReview: parseJsonSafe(record.questionReviewJson, []),
          strengths: parseJsonSafe(record.strengthsJson, []),
          improvements: parseJsonSafe(record.improvementsJson, []),
          scoreFormula: parseJsonSafe(record.scoreFormulaJson, {}),
          createdAt: record.createdAt
        };

        if (typeof window !== 'undefined') {
          try {
            const existingStr = localStorage.getItem('candidate_assessment_reports');
            const existing = existingStr ? JSON.parse(existingStr) : [];
            const updated = [repData, ...existing.filter((r: any) => r.id !== repData.id)];
            localStorage.setItem('candidate_assessment_reports', JSON.stringify(updated));
          } catch (e) {}
        }

        setSubmittedReport(repData);
        return;
      }
    } catch (err) {
      console.error('Submit report API error, generating local report:', err);
    } finally {
      setIsSubmittingReport(false);
    }

    // Emergency Fallback Report Generation so candidate is NEVER stuck loading!
    let correctCount = 0;
    if (difficulty === 'Easy') {
      questions.forEach((q: any, i: number) => {
        if (mcqAnswers[i] === q.correctAnswer) correctCount += 1;
      });
    } else if (difficulty === 'Hard') {
      codingChallenges.forEach((_, i) => {
        if (finalTestResults[i]?.score === 100) correctCount += 1;
      });
    } else {
      questions.forEach((q: any, i: number) => {
        const candAns = (userAnswers[i] || '').toLowerCase().trim();
        const keyPoints: string[] = q.keyPoints || [];
        const referenceText = (q.sampleAnswer || q.explanation || '').toLowerCase();
        const targetKeyPoints = (keyPoints && keyPoints.length > 0) 
          ? keyPoints 
          : referenceText.split(/\W+/).filter((w: string) => w.length > 4);

        let matchedCount = 0;
        targetKeyPoints.forEach((kp: string) => {
          if (candAns.includes(kp.toLowerCase())) matchedCount++;
        });

        const score = targetKeyPoints.length > 0 ? Math.round((matchedCount / targetKeyPoints.length) * 100) : 0;
        if (score >= 50) correctCount += 1;
      });
    }

    const calcPct = totalQ > 0 ? Math.round((correctCount / totalQ) * 100) : 0;
    const isPass = calcPct >= 60;

    let localQuestionReview: any[] = [];
    if (difficulty === 'Hard') {
      codingChallenges.forEach((c: any, idx: number) => {
        const evalRes = finalTestResults[idx] || {};
        const score = evalRes.score || 0;
        const submittedCode = getCandidateSubmittedCode(codeAnswers[idx], selectedLanguage, c.starterCode);
        localQuestionReview.push({
          id: idx + 1,
          question: c.description || c.title || `[${c.category}] ${c.title}`,
          questionName: c.title,
          description: c.description,
          constraints: c.constraints || [],
          examples: c.examples || [],
          candidateAnswer: submittedCode,
          correctAnswer: c.referenceSolution?.[selectedLanguage] || c.referenceSolution?.JavaScript || 'Reference solution available in report',
          result: score === 100 ? 'Passed (100%)' : `Partial (${score}%)`,
          marks: `${Math.round((score / 100) * 10)}/10`,
          explanation: c.referenceSolution?.explanation || 'Optimal algorithmic reference solution.'
        });
      });
    } else {
      questions.forEach((q: any, idx: number) => {
        if (difficulty === 'Easy') {
          const candidateAnsIdx = mcqAnswers[idx];
          const isCorrect = candidateAnsIdx === q.correctAnswer;
          localQuestionReview.push({
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
          const candAns = userAnswers[idx] || '';
          const cleanAns = candAns.toLowerCase().trim();
          const keyPoints: string[] = q.keyPoints || [];
          const referenceText = (q.sampleAnswer || q.explanation || '').toLowerCase();
          const targetKeyPoints = (keyPoints && keyPoints.length > 0) 
            ? keyPoints 
            : referenceText.split(/\W+/).filter((w: string) => w.length > 4);

          let matched: string[] = [];
          targetKeyPoints.forEach((kp: string) => {
            if (cleanAns.includes(kp.toLowerCase())) {
              matched.push(kp);
            }
          });

          let score = 0;
          if (targetKeyPoints.length > 0) {
            score = Math.min(100, Math.round((matched.length / targetKeyPoints.length) * 100));
          }

          const isSatisfactory = score >= 50;
          localQuestionReview.push({
            id: idx + 1,
            question: q.question,
            candidateAnswer: candAns || 'Not Attempted',
            correctAnswer: `Sample Answer / Key Concepts: ${(targetKeyPoints || []).join(', ')}`,
            result: isSatisfactory ? 'Satisfactory' : 'Needs Improvement',
            marks: `${Math.round((score / 100) * 5)}/5`,
            explanation: q.explanation || q.sampleAnswer || `Matched Key Concepts: ${matched.join(', ') || 'None'}`
          });
        }
      });
    }

    const fallbackReport = {
      id: `REP-${Date.now()}`,
      candidateName: candidate?.name || 'Candidate',
      candidateId: candidate?.id || 'CAND-8891',
      email: candidate?.email || 'candidate@example.com',
      jobRole: roleName,
      experienceLevel: experienceLevel,
      assessmentName: 'AI Technical & Coding Assessment',
      difficulty,
      duration,
      totalQuestions: totalQ,
      attemptedQuestions: attemptedQ,
      unansweredQuestions: Math.max(0, totalQ - attemptedQ),
      finalScore: calcPct,
      percentage: calcPct,
      overallResult: isPass ? 'Pass' : 'Fail',
      performanceLevel: calcPct >= 85 ? 'Excellent' : (calcPct >= 70 ? 'Good' : 'Average'),
      hiringRecommendation: calcPct >= 80 ? 'Highly Recommended' : (calcPct >= 60 ? 'Recommended with Training' : 'Not Recommended'),
      recommendationReason: `Candidate achieved ${calcPct}% in the ${roleName} assessment.`,
      sectionScores: { [roleName]: { total: totalQ, correct: correctCount, wrong: totalQ - correctCount, score: calcPct } },
      codingDetails: [],
      questionReview: localQuestionReview,
      skillAnalysis: [
        { skill: 'Problem Solving', score: calcPct },
        { skill: 'Logical Thinking', score: Math.round(calcPct * 0.9) },
        { skill: 'Programming', score: calcPct },
        { skill: 'Attention to Detail', score: Math.round(calcPct * 0.95) }
      ],
      strengths: ['Solid technical comprehension and question execution'],
      improvements: ['Further practice on complex edge cases and timing'],
      scoreFormula: { formula: `Final Score = ${calcPct}%` },
      createdAt: new Date().toISOString()
    };

    if (typeof window !== 'undefined') {
      try {
        const existingStr = localStorage.getItem('candidate_assessment_reports');
        const existing = existingStr ? JSON.parse(existingStr) : [];
        const updated = [fallbackReport, ...existing.filter((r: any) => r.id !== fallbackReport.id)];
        localStorage.setItem('candidate_assessment_reports', JSON.stringify(updated));
      } catch (e) {}
    }

    setSubmittedReport(fallbackReport);
  };

  // Accurate Evaluation Function for Descriptive Questions
  const evaluateDescriptiveQuestion = (q: DescriptiveQuestion, answerText: string) => {
    if (!answerText || answerText.trim().length < 10) {
      return { score: 0, matchedPoints: [], isCorrect: false };
    }

    const cleanAnswer = answerText.toLowerCase().trim();
    const keyPoints = q.keyPoints || [];

    if (keyPoints.length === 0) {
      const score = Math.min(100, Math.round((cleanAnswer.length / 150) * 100));
      return { score, matchedPoints: [], isCorrect: score >= 50 };
    }

    let matchedPoints: string[] = [];
    keyPoints.forEach(kp => {
      const kpClean = kp.toLowerCase();
      const kpWords = kpClean.split(' ').filter(w => w.length > 3);
      
      const directMatch = cleanAnswer.includes(kpClean);
      const wordMatchCount = kpWords.filter(w => cleanAnswer.includes(w)).length;
      
      if (directMatch || (kpWords.length > 0 && wordMatchCount / kpWords.length >= 0.5)) {
        matchedPoints.push(kp);
      }
    });

    const keyPointRatio = matchedPoints.length / keyPoints.length;
    const lengthBonus = Math.min(30, Math.round((cleanAnswer.length / 200) * 30));
    const score = Math.min(100, Math.round((keyPointRatio * 70) + lengthBonus));

    return {
      score,
      matchedPoints,
      isCorrect: score >= 50
    };
  };

  // Calculate Evaluation Metrics
  const getResultsSummary = () => {
    if (difficulty === 'Hard') {
      let passedCount = 0;
      let scoreSum = 0;
      codingChallenges.forEach((c, idx) => {
        const evalRes = testResults[idx];
        const score = evalRes?.score ?? 0;
        scoreSum += score;
        if (score === 100) {
          passedCount += 1;
        }
      });
      const total = codingChallenges.length || 1;
      const percentage = Math.round(scoreSum / total);
      return { correct: passedCount, wrong: total - passedCount, total, percentage, perQuestionScores: {} };
    } else if (difficulty === 'Easy') {
      let correct = 0;
      questions.forEach((q, idx) => {
        if (mcqAnswers[idx] === (q as MCQQuestion).correctAnswer) {
          correct += 1;
        }
      });
      const wrong = questions.length - correct;
      const percentage = Math.round((correct / questions.length) * 100);
      return { correct, wrong, total: questions.length, percentage, perQuestionScores: {} };
    } else {
      let totalScoreSum = 0;
      let correctCount = 0;
      const perQuestionScores: Record<number, { score: number; matchedPoints: string[]; isCorrect: boolean }> = {};

      questions.forEach((q, idx) => {
        const evalResult = evaluateDescriptiveQuestion(q as DescriptiveQuestion, userAnswers[idx] || '');
        perQuestionScores[idx] = evalResult;
        totalScoreSum += evalResult.score;
        if (evalResult.isCorrect) {
          correctCount += 1;
        }
      });

      const wrongCount = questions.length - correctCount;
      const percentage = Math.round(totalScoreSum / questions.length);

      return {
        correct: correctCount,
        wrong: wrongCount,
        total: questions.length,
        percentage,
        perQuestionScores
      };
    }
  };

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const formatTimeSpent = (totalInit: number, remaining: number) => {
    const elapsed = Math.max(0, totalInit - remaining);
    const mins = Math.floor(elapsed / 60);
    const secs = elapsed % 60;
    if (mins === 0) return `${secs} seconds`;
    return `${mins} minutes`;
  };

  return (
    <DashboardLayout>
      <div style={{ maxWidth: 1040, margin: '0 auto', paddingBottom: '3rem' }}>
        
        {/* ==================== SETUP STEP ==================== */}
        {step === 'setup' && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {/* Header */}
            <div style={{ marginBottom: '2rem', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
              <div>
                <h1 style={{
                  fontSize: '2.25rem',
                  fontWeight: 900,
                  color: isDark ? '#ffffff' : '#0f172a',
                  marginBottom: 8,
                  letterSpacing: '-0.5px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12
                }}>
                  <div style={{
                    width: 48,
                    height: 48,
                    borderRadius: 14,
                    background: 'linear-gradient(135deg, rgba(56,189,248,0.2) 0%, rgba(14,165,233,0.1) 100%)',
                    border: '1px solid rgba(56,189,248,0.3)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#38bdf8'
                  }}>
                    <Mic size={26} />
                  </div>
                  AI Mock Interview & Live Coding Assessment
                </h1>
                <p style={{ color: isDark ? '#94a3b8' : '#475569', fontSize: '1.05rem', lineHeight: 1.5 }}>
                  Practice AI interviews with <strong>50 MCQs for Easy Level</strong>, <strong>25 Descriptive Questions for Medium Level</strong>, and <strong>Interactive Coding for IT Roles (JS, TS, Python, Java, C++, C)</strong>.
                </p>
              </div>

              <button
                onClick={() => router.push('/careers/assessment-reports')}
                style={{
                  padding: '0.75rem 1.35rem',
                  borderRadius: 14,
                  background: isDark ? 'rgba(30, 41, 59, 0.8)' : '#ffffff',
                  border: `1.5px solid ${isDark ? 'rgba(56, 189, 248, 0.4)' : '#00B4D8'}`,
                  color: '#00B4D8',
                  fontWeight: 800,
                  fontSize: '0.9rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  boxShadow: '0 4px 12px rgba(0, 180, 216, 0.15)'
                }}
              >
                <Award size={18} /> View My Past Score Reports
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              
              {/* SECTION 1: Select Role Dropdown ONLY */}
              <div style={{
                background: isDark ? 'rgba(30, 41, 59, 0.7)' : 'rgba(255, 255, 255, 0.9)',
                border: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.08)'}`,
                borderRadius: 20,
                padding: '1.75rem',
                backdropFilter: 'blur(12px)'
              }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontWeight: 800, fontSize: '1.15rem', color: isDark ? '#f8fafc' : '#0f172a', marginBottom: '1rem' }}>
                  <Briefcase size={22} color="#00B4D8" />
                  Select Target Job Role
                </label>

                {/* Direct Clean Dropdown Select */}
                <div>
                  <select
                    value={selectedRole}
                    onChange={(e) => setSelectedRole(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.95rem 1.25rem',
                      borderRadius: 14,
                      background: isDark ? '#0f172a' : '#f1f5f9',
                      border: `2px solid ${isDark ? 'rgba(56, 189, 248, 0.4)' : '#00B4D8'}`,
                      color: isDark ? '#ffffff' : '#0f172a',
                      fontWeight: 700,
                      fontSize: '1rem',
                      outline: 'none',
                      cursor: 'pointer'
                    }}
                  >
                    <optgroup label="🧪 Testing & QA Roles">
                      <option value="QA Automation Engineer">QA Automation Engineer</option>
                      <option value="Manual Software Tester">Manual Software Tester</option>
                      <option value="QA / Testing Lead">QA / Testing Lead</option>
                    </optgroup>

                    <optgroup label="💻 Technical & Engineering Roles">
                      <option value="Software Engineer">Software Engineer</option>
                      <option value="Frontend Developer">Frontend Developer</option>
                      <option value="Backend Developer">Backend Developer</option>
                      <option value="Full Stack Developer">Full Stack Developer</option>
                      <option value="Python Developer">Python Developer</option>
                      <option value="Java Developer">Java Developer</option>
                      <option value="DevOps Engineer">DevOps Engineer</option>
                      <option value="Data Analyst">Data Analyst</option>
                      <option value="Data Engineer">Data Engineer</option>
                      <option value="Data Scientist">Data Scientist</option>
                      <option value="UI/UX Designer">UI/UX Designer</option>
                      <option value="Mobile App Developer">Mobile App Developer</option>
                      <option value="Mechanical Engineer">Mechanical Engineer</option>
                      <option value="Civil Engineer">Civil Engineer</option>
                      <option value="Electrical Engineer">Electrical Engineer</option>
                    </optgroup>

                    <optgroup label="💼 Non-Technical & Business Roles">
                      <option value="HR Executive">HR Executive</option>
                      <option value="Recruiter">Recruiter</option>
                      <option value="Talent Acquisition Specialist">Talent Acquisition Specialist</option>
                      <option value="Business Analyst">Business Analyst</option>
                      <option value="Project Manager">Project Manager</option>
                      <option value="Accountant">Accountant</option>
                      <option value="Sales Executive">Sales Executive</option>
                      <option value="Digital Marketing Specialist">Digital Marketing Specialist</option>
                      <option value="Customer Support Specialist">Customer Support Specialist</option>
                      <option value="Warehouse Manager">Warehouse Manager</option>
                      <option value="Procurement Manager">Procurement Manager</option>
                      <option value="Logistics Coordinator">Logistics Coordinator</option>
                      <option value="Custom Role">Custom Role</option>
                    </optgroup>
                  </select>
                </div>

                {/* Custom Role Input */}
                {selectedRole === 'Custom Role' && (
                  <div style={{ marginTop: '1rem' }}>
                    <input
                      type="text"
                      placeholder="Type your custom job role title..."
                      value={customRoleText}
                      onChange={(e) => setCustomRoleText(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '0.85rem 1.25rem',
                        borderRadius: 14,
                        background: isDark ? 'rgba(15, 23, 42, 0.6)' : 'rgba(241, 245, 249, 0.8)',
                        border: `2px solid ${isDark ? '#00B4D8' : '#0077B6'}`,
                        color: isDark ? '#ffffff' : '#0f172a',
                        fontWeight: 600,
                        fontSize: '0.95rem',
                        outline: 'none'
                      }}
                    />
                  </div>
                )}
              </div>

              {/* SECTION 1.5: Experience Level Selection */}
              <div style={{
                background: isDark ? 'rgba(30, 41, 59, 0.7)' : 'rgba(255, 255, 255, 0.9)',
                border: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.08)'}`,
                borderRadius: 20,
                padding: '1.75rem',
                backdropFilter: 'blur(12px)'
              }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontWeight: 800, fontSize: '1.15rem', color: isDark ? '#f8fafc' : '#0f172a', marginBottom: '1.25rem' }}>
                  <Award size={22} color="#00B4D8" />
                  Select Experience Level <span style={{ color: '#ef4444', fontSize: '1rem' }}>*</span>
                </label>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
                  {EXPERIENCE_LEVELS.map((lvl) => {
                    const isSelected = experienceLevel === lvl.id;
                    return (
                      <div
                        key={lvl.id}
                        onClick={() => setExperienceLevel(lvl.id as any)}
                        style={{
                          padding: '1.25rem',
                          borderRadius: 16,
                          cursor: 'pointer',
                          background: isSelected
                            ? (isDark ? 'rgba(56, 189, 248, 0.15)' : 'rgba(0, 180, 216, 0.1)')
                            : (isDark ? 'rgba(15, 23, 42, 0.4)' : 'rgba(248, 250, 252, 0.8)'),
                          border: `2px solid ${isSelected ? '#00B4D8' : (isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.08)')}`,
                          boxShadow: isSelected ? '0 4px 14px rgba(0, 180, 216, 0.2)' : 'none',
                          transition: 'all 0.2s ease'
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                            {isSelected ? <CheckCircle2 size={22} color="#00B4D8" /> : <Circle size={22} color={isDark ? '#64748b' : '#94a3b8'} />}
                            <span style={{ fontWeight: 800, fontSize: '1.1rem', color: isSelected ? '#00B4D8' : (isDark ? '#f8fafc' : '#0f172a') }}>
                              {lvl.badge}
                            </span>
                          </div>
                        </div>
                        <div style={{ fontSize: '0.875rem', color: isDark ? '#94a3b8' : '#64748b', lineHeight: 1.5 }}>
                          {lvl.description}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* SECTION: Resume & Portfolio Intelligence Status */}
              <div style={{
                background: isDark ? 'linear-gradient(135deg, rgba(30, 41, 59, 0.8) 0%, rgba(15, 23, 42, 0.9) 100%)' : 'linear-gradient(135deg, #F4EFFF 0%, #EEF5FF 50%, #DDF8FF 100%)',
                border: `1.5px solid ${isDark ? 'rgba(56, 189, 248, 0.3)' : 'rgba(79, 70, 229, 0.25)'}`,
                borderRadius: 20,
                padding: '1.5rem 1.75rem',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12, marginBottom: '0.75rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <Sparkles size={22} color="#00B4D8" />
                    <div>
                      <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: isDark ? '#ffffff' : '#0f172a', margin: 0 }}>
                        Resume & Portfolio Intelligence Integrated
                      </h3>
                      <span style={{ fontSize: '0.825rem', color: isDark ? '#94a3b8' : '#64748b' }}>
                        Interview questions are dynamically pulled & tailored using your target role, resume skills, and connected portfolio links.
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => router.push('/careers/portfolio')}
                    style={{
                      fontSize: '0.8rem',
                      fontWeight: 700,
                      color: '#00B4D8',
                      background: 'transparent',
                      border: 'none',
                      cursor: 'pointer',
                      textDecoration: 'underline'
                    }}
                  >
                    Edit Portfolio Links &rarr;
                  </button>
                </div>

                {/* Badges for parsed skills and portfolio links */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap', marginTop: 10 }}>
                  {parsedSkills.length > 0 && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
                      <span style={{ fontSize: '0.775rem', fontWeight: 700, color: isDark ? '#94a3b8' : '#475569' }}>
                        Resume Skills Loaded:
                      </span>
                      {parsedSkills.slice(0, 8).map((sk, idx) => (
                        <span key={idx} style={{
                          padding: '3px 10px',
                          borderRadius: 9999,
                          fontSize: '0.75rem',
                          fontWeight: 700,
                          background: isDark ? 'rgba(56, 189, 248, 0.15)' : 'rgba(0, 180, 216, 0.12)',
                          color: '#00B4D8',
                          border: '1px solid rgba(56, 189, 248, 0.3)'
                        }}>
                          {sk}
                        </span>
                      ))}
                    </div>
                  )}

                  {portfolioData && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                      <span style={{ fontSize: '0.775rem', fontWeight: 700, color: isDark ? '#94a3b8' : '#475569' }}>
                        Connected Profiles:
                      </span>
                      {portfolioData.githubUrl && (
                        <span style={{ padding: '3px 9px', borderRadius: 8, fontSize: '0.725rem', fontWeight: 800, background: 'rgba(16, 185, 129, 0.15)', color: '#10b981', border: '1px solid rgba(16, 185, 129, 0.3)' }}>
                          GitHub
                        </span>
                      )}
                      {portfolioData.linkedinUrl && (
                        <span style={{ padding: '3px 9px', borderRadius: 8, fontSize: '0.725rem', fontWeight: 800, background: 'rgba(59, 130, 246, 0.15)', color: '#3b82f6', border: '1px solid rgba(59, 130, 246, 0.3)' }}>
                          LinkedIn
                        </span>
                      )}
                      {portfolioData.leetcodeUrl && (
                        <span style={{ padding: '3px 9px', borderRadius: 8, fontSize: '0.725rem', fontWeight: 800, background: 'rgba(234, 179, 8, 0.15)', color: '#eab308', border: '1px solid rgba(234, 179, 8, 0.3)' }}>
                          LeetCode
                        </span>
                      )}
                      {portfolioData.portfolioUrl && (
                        <span style={{ padding: '3px 9px', borderRadius: 8, fontSize: '0.725rem', fontWeight: 800, background: 'rgba(168, 85, 247, 0.15)', color: '#a855f7', border: '1px solid rgba(168, 85, 247, 0.3)' }}>
                          Portfolio
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* SECTION 2: Select 3 Assessment Difficulty Levels */}
              <div style={{
                background: isDark ? 'rgba(30, 41, 59, 0.7)' : 'rgba(255, 255, 255, 0.9)',
                border: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.08)'}`,
                borderRadius: 20,
                padding: '1.75rem',
                backdropFilter: 'blur(12px)'
              }}>
                <label style={{ display: 'block', fontWeight: 800, fontSize: '1.15rem', color: isDark ? '#f8fafc' : '#0f172a', marginBottom: '1.25rem' }}>
                  Select Assessment Type & Level
                </label>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
                  
                  {/* Level 1: Easy (50 MCQs) */}
                  <div
                    onClick={() => setDifficulty('Easy')}
                    style={{
                      padding: '1.25rem',
                      borderRadius: 16,
                      cursor: 'pointer',
                      background: difficulty === 'Easy' ? 'rgba(56, 189, 248, 0.12)' : (isDark ? 'rgba(15, 23, 42, 0.4)' : 'rgba(248, 250, 252, 0.8)'),
                      border: `2px solid ${difficulty === 'Easy' ? '#00B4D8' : (isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.08)')}`,
                      transition: 'all 0.2s ease'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        {difficulty === 'Easy' ? <CheckCircle2 size={22} color="#00B4D8" /> : <Circle size={22} color={isDark ? '#64748b' : '#94a3b8'} />}
                        <span style={{ fontWeight: 800, fontSize: '1.1rem', color: difficulty === 'Easy' ? '#00B4D8' : (isDark ? '#f8fafc' : '#0f172a') }}>
                          Easy (50 MCQ)
                        </span>
                      </div>
                    </div>
                    <div style={{ fontSize: '0.875rem', color: isDark ? '#94a3b8' : '#64748b', lineHeight: 1.5 }}>
                      50 Multiple Choice Questions. Results & explanations revealed after submission.
                    </div>
                  </div>

                  {/* Level 2: Medium (25 Descriptive Questions) */}
                  <div
                    onClick={() => setDifficulty('Medium')}
                    style={{
                      padding: '1.25rem',
                      borderRadius: 16,
                      cursor: 'pointer',
                      background: difficulty === 'Medium' ? 'rgba(56, 189, 248, 0.12)' : (isDark ? 'rgba(15, 23, 42, 0.4)' : 'rgba(248, 250, 252, 0.8)'),
                      border: `2px solid ${difficulty === 'Medium' ? '#00B4D8' : (isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.08)')}`,
                      transition: 'all 0.2s ease'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        {difficulty === 'Medium' ? <CheckCircle2 size={22} color="#00B4D8" /> : <Circle size={22} color={isDark ? '#64748b' : '#94a3b8'} />}
                        <span style={{ fontWeight: 800, fontSize: '1.1rem', color: difficulty === 'Medium' ? '#00B4D8' : (isDark ? '#f8fafc' : '#0f172a') }}>
                          Medium (25 Scenario)
                        </span>
                      </div>
                    </div>
                    <div style={{ fontSize: '0.875rem', color: isDark ? '#94a3b8' : '#64748b', lineHeight: 1.5 }}>
                      25 Descriptive technical & HR scenario questions evaluated on key concepts.
                    </div>
                  </div>

                  {/* Level 3: Coding Assessment for IT Roles */}
                  <div
                    onClick={() => setDifficulty('Hard')}
                    style={{
                      padding: '1.25rem',
                      borderRadius: 16,
                      cursor: 'pointer',
                      background: difficulty === 'Hard' ? 'rgba(56, 189, 248, 0.12)' : (isDark ? 'rgba(15, 23, 42, 0.4)' : 'rgba(248, 250, 252, 0.8)'),
                      border: `2px solid ${difficulty === 'Hard' ? '#00B4D8' : (isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.08)')}`,
                      transition: 'all 0.2s ease'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        {difficulty === 'Hard' ? <CheckCircle2 size={22} color="#00B4D8" /> : <Circle size={22} color={isDark ? '#64748b' : '#94a3b8'} />}
                        <span style={{ fontWeight: 800, fontSize: '1.1rem', color: difficulty === 'Hard' ? '#00B4D8' : (isDark ? '#f8fafc' : '#0f172a') }}>
                          💻 Coding for IT Roles
                        </span>
                      </div>
                    </div>
                    <div style={{ fontSize: '0.875rem', color: isDark ? '#94a3b8' : '#64748b', lineHeight: 1.5 }}>
                      Interactive Live Code Editor. Candidate can code in JS, TS, Python, Java, C, C++.
                    </div>
                  </div>

                </div>

                {/* Sub-Categories for Coding Assessment */}
                {difficulty === 'Hard' && (
                  <div style={{ marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: `1px solid ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)'}` }}>
                    <label style={{ display: 'block', fontWeight: 800, fontSize: '1rem', color: '#00B4D8', marginBottom: '0.85rem' }}>
                      Select Coding Sub-Difficulty Category:
                    </label>

                    <div style={{ display: 'flex', gap: '1rem' }}>
                      {(['Easy', 'Medium', 'Hard'] as const).map(subLvl => (
                        <button
                          key={subLvl}
                          type="button"
                          onClick={() => setCodingSubDifficulty(subLvl)}
                          style={{
                            flex: 1,
                            padding: '0.85rem',
                            borderRadius: 14,
                            fontWeight: 800,
                            fontSize: '0.9rem',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: 8,
                            background: codingSubDifficulty === subLvl ? 'rgba(56, 189, 248, 0.18)' : (isDark ? 'rgba(15,23,42,0.5)' : 'rgba(241,245,249,0.8)'),
                            color: codingSubDifficulty === subLvl ? '#00B4D8' : (isDark ? '#cbd5e1' : '#475569'),
                            border: `2px solid ${codingSubDifficulty === subLvl ? '#00B4D8' : (isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)')}`,
                            cursor: 'pointer'
                          }}
                        >
                          <Code size={18} />
                          {subLvl} Coding
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* SECTION 3: Duration */}
              <div style={{
                background: isDark ? 'rgba(30, 41, 59, 0.7)' : 'rgba(255, 255, 255, 0.9)',
                border: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.08)'}`,
                borderRadius: 20,
                padding: '1.75rem',
                backdropFilter: 'blur(12px)'
              }}>
                <label style={{ display: 'block', fontWeight: 800, fontSize: '1.05rem', color: isDark ? '#f8fafc' : '#0f172a', marginBottom: '1rem' }}>
                  Interview Duration
                </label>
                <div style={{ display: 'flex', gap: '0.75rem' }}>
                  {(['10 Minutes', '20 Minutes', '30 Minutes'] as const).map(time => (
                    <button
                      key={time}
                      type="button"
                      onClick={() => setDuration(time)}
                      style={{
                        flex: 1,
                        padding: '0.75rem',
                        borderRadius: 12,
                        fontWeight: 700,
                        fontSize: '0.85rem',
                        background: duration === time ? 'rgba(56, 189, 248, 0.15)' : (isDark ? 'rgba(15,23,42,0.5)' : 'rgba(241,245,249,0.8)'),
                        color: duration === time ? '#00B4D8' : (isDark ? '#cbd5e1' : '#475569'),
                        border: `1.5px solid ${duration === time ? '#00B4D8' : (isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)')}`,
                        cursor: 'pointer'
                      }}
                    >
                      {time}
                    </button>
                  ))}
                </div>
              </div>

              {/* Start Button */}
              <button
                onClick={handleStartInterview}
                style={{
                  width: '100%',
                  padding: '1.15rem 2rem',
                  borderRadius: 16,
                  background: 'linear-gradient(135deg, #00B4D8 0%, #0077B6 100%)',
                  color: '#ffffff',
                  border: 'none',
                  fontWeight: 800,
                  fontSize: '1.15rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 12,
                  boxShadow: '0 10px 25px -5px rgba(0, 180, 216, 0.4)'
                }}
              >
                <Sparkles size={24} />
                Start {difficulty === 'Hard' ? `${codingSubDifficulty} Coding Assessment` : (difficulty === 'Easy' ? '50-MCQ Exam' : '25-Scenario Test')} for "{roleName}"
              </button>

            </div>
          </motion.div>
        )}

        {/* ==================== INTERVIEW / CODING STEP ==================== */}
        {step === 'interview' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            {/* Top Bar Navigation with Exit to Setup Button & Timer */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '1.5rem',
              padding: '1rem 1.25rem',
              background: isDark ? 'rgba(30, 41, 59, 0.8)' : 'rgba(255, 255, 255, 0.9)',
              borderRadius: 16,
              border: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'}`
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                {/* Back to Setup Button */}
                <button
                  type="button"
                  onClick={() => {
                    if (confirm('Exit active test and return to AI Mock Interview setup?')) {
                      setStep('setup');
                    }
                  }}
                  style={{
                    padding: '0.5rem 0.85rem',
                    borderRadius: 10,
                    background: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.05)',
                    color: isDark ? '#cbd5e1' : '#475569',
                    border: 'none',
                    fontWeight: 700,
                    fontSize: '0.85rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6
                  }}
                >
                  <ArrowLeft size={16} /> Back to Setup
                </button>

                <div>
                  <span style={{ fontSize: '0.825rem', fontWeight: 600, color: isDark ? '#94a3b8' : '#64748b' }}>
                    Role: <strong style={{ color: '#00B4D8' }}>{roleName}</strong> ({difficulty === 'Hard' ? `${codingSubDifficulty} Coding` : `${difficulty} Level`})
                  </span>
                  <div style={{ fontSize: '1.05rem', fontWeight: 800, color: isDark ? '#ffffff' : '#0f172a' }}>
                    {difficulty === 'Hard' ? `Coding Problem ${currentIndex + 1} of ${codingChallenges.length}` : `Question ${currentIndex + 1} of ${questions.length}`}
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                {/* Select Programming Language for Coding Mode */}
                {difficulty === 'Hard' && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontSize: '0.85rem', fontWeight: 700, color: isDark ? '#cbd5e1' : '#475569' }}>Language:</span>
                    <select
                      value={selectedLanguage}
                      onChange={(e) => setSelectedLanguage(e.target.value as CodingLanguage)}
                      style={{
                        padding: '0.45rem 0.85rem',
                        borderRadius: 10,
                        background: isDark ? '#0f172a' : '#f1f5f9',
                        border: `1.5px solid ${isDark ? '#00B4D8' : '#0077B6'}`,
                        color: isDark ? '#ffffff' : '#0f172a',
                        fontWeight: 800,
                        fontSize: '0.875rem',
                        outline: 'none'
                      }}
                    >
                      <option value="JavaScript">🟨 JavaScript</option>
                      <option value="TypeScript">🔷 TypeScript</option>
                      <option value="Python">🐍 Python</option>
                      <option value="Java">☕ Java</option>
                      <option value="C++">⚡ C++</option>
                      <option value="C">⚙️ C</option>
                      <option value="SQL">🛢️ SQL Query</option>
                    </select>
                  </div>
                )}

                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: '0.5rem 1rem',
                  borderRadius: 12,
                  background: timeLeft < 120 ? 'rgba(239, 68, 68, 0.15)' : 'rgba(56, 189, 248, 0.15)',
                  border: `1px solid ${timeLeft < 120 ? 'rgba(239, 68, 68, 0.3)' : 'rgba(56, 189, 248, 0.3)'}`,
                  color: timeLeft < 120 ? '#ef4444' : '#00B4D8',
                  fontWeight: 800,
                  fontFamily: 'monospace',
                  fontSize: '1.05rem'
                }}>
                  <Clock size={18} />
                  {formatTimer(timeLeft)}
                </div>

                <button
                  onClick={handleFinishInterview}
                  style={{
                    padding: '0.6rem 1.25rem',
                    borderRadius: 12,
                    background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                    color: '#ffffff',
                    border: 'none',
                    fontWeight: 800,
                    fontSize: '0.9rem',
                    cursor: 'pointer',
                    boxShadow: '0 4px 12px rgba(239, 68, 68, 0.3)'
                  }}
                >
                  Submit Test
                </button>
              </div>
            </div>

            {/* ==================== HARD MODE: LIVE CODING ASSESSMENT ENVIRONMENT ==================== */}
            {difficulty === 'Hard' && codingChallenges.length > 0 && (
              <div style={{ display: 'grid', gridTemplateColumns: '42% 58%', gap: '0', marginBottom: '1.5rem', borderRadius: 16, overflow: 'hidden', border: '1px solid rgba(56, 189, 248, 0.2)', boxShadow: '0 16px 40px rgba(0,0,0,0.4)', height: 700 }}>
                
                {/* Left Pane: Problem Description & Constraints */}
                <div style={{
                  background: isDark ? '#1a2232' : '#ffffff',
                  borderRight: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.08)'}`,
                  padding: '1.75rem',
                  height: '100%',
                  overflowY: 'auto'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', color: '#00B4D8', background: 'rgba(56,189,248,0.12)', padding: '0.2rem 0.6rem', borderRadius: 6 }}>
                      {codingChallenges[currentIndex]?.category}
                    </span>
                    <span style={{ fontSize: '0.75rem', fontWeight: 800, color: codingSubDifficulty === 'Easy' ? '#22c55e' : (codingSubDifficulty === 'Medium' ? '#eab308' : '#ef4444'), background: 'rgba(255,255,255,0.06)', padding: '0.2rem 0.6rem', borderRadius: 6 }}>
                      {codingChallenges[currentIndex]?.difficulty}
                    </span>
                  </div>

                  <h2 style={{ fontSize: '1.3rem', fontWeight: 900, color: isDark ? '#ffffff' : '#0f172a', marginBottom: 16 }}>
                    {currentIndex + 1}. {codingChallenges[currentIndex]?.title}
                  </h2>

                  <div style={{ fontSize: '0.95rem', color: isDark ? '#cbd5e1' : '#334155', lineHeight: 1.6, marginBottom: '1.5rem' }}>
                    {codingChallenges[currentIndex]?.description}
                  </div>

                  {/* Constraints */}
                  {codingChallenges[currentIndex]?.constraints && (
                    <div style={{ marginBottom: '1.5rem' }}>
                      <strong style={{ fontSize: '0.85rem', color: isDark ? '#94a3b8' : '#64748b', textTransform: 'uppercase', display: 'block', marginBottom: 6 }}>
                        Constraints:
                      </strong>
                      <ul style={{ paddingLeft: '1.25rem', fontSize: '0.85rem', color: isDark ? '#cbd5e1' : '#334155', margin: 0 }}>
                        {codingChallenges[currentIndex].constraints.map((c, cIdx) => (
                          <li key={cIdx} style={{ marginBottom: 4 }}><code>{c}</code></li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Sample Examples */}
                  <div>
                    <strong style={{ fontSize: '0.85rem', color: isDark ? '#94a3b8' : '#64748b', textTransform: 'uppercase', display: 'block', marginBottom: 8 }}>
                      Sample Examples:
                    </strong>
                    {codingChallenges[currentIndex]?.examples.map((ex, exIdx) => (
                      <div key={exIdx} style={{ padding: '0.85rem 1rem', borderRadius: 12, background: isDark ? 'rgba(15, 23, 42, 0.6)' : '#f1f5f9', marginBottom: 8, fontSize: '0.85rem', fontFamily: 'monospace' }}>
                        <div><strong>Input:</strong> {ex.input}</div>
                        <div><strong>Output:</strong> {ex.output}</div>
                        {ex.explanation && <div style={{ color: isDark ? '#94a3b8' : '#64748b', marginTop: 4 }}><em>Explanation: {ex.explanation}</em></div>}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Right Pane: Live Code Editor */}
                <div style={{
                  background: '#0d1117',
                  display: 'flex',
                  flexDirection: 'column',
                  height: '100%',
                  overflow: 'hidden'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.75rem 1rem', borderBottom: '1px solid rgba(255,255,255,0.07)', background: '#161b22' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#38bdf8', fontWeight: 800, fontSize: '0.9rem' }}>
                      <Code size={18} />
                      Solution Editor ({selectedLanguage})
                    </div>

                    <button
                      onClick={handleRunCode}
                      disabled={isExecuting}
                      style={{
                        padding: '0.45rem 1.1rem',
                        borderRadius: 8,
                        background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
                        color: '#ffffff',
                        border: 'none',
                        fontWeight: 800,
                        fontSize: '0.825rem',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 6
                      }}
                    >
                      <Play size={14} />
                      {isExecuting ? 'Executing Code...' : 'Run & Test Code'}
                    </button>
                  </div>

                  {/* Code Editor Textarea */}
                  <textarea
                    rows={20}
                    value={codeAnswers[currentIndex]?.[selectedLanguage] || codingChallenges[currentIndex]?.starterCode[selectedLanguage] || ''}
                    onChange={(e) => {
                      const val = e.target.value;
                      setCodeAnswers(prev => ({
                        ...prev,
                        [currentIndex]: {
                          ...(prev[currentIndex] || {}),
                          [selectedLanguage]: val
                        }
                      }));
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Tab') {
                        e.preventDefault();
                        const textarea = e.currentTarget;
                        const start = textarea.selectionStart;
                        const end = textarea.selectionEnd;
                        const spaces = '    '; // 4 spaces
                        const currentVal = textarea.value;
                        const newVal = currentVal.substring(0, start) + spaces + currentVal.substring(end);
                        setCodeAnswers(prev => ({
                          ...prev,
                          [currentIndex]: {
                            ...(prev[currentIndex] || {}),
                            [selectedLanguage]: newVal
                          }
                        }));
                        // Move cursor after inserted spaces
                        requestAnimationFrame(() => {
                          textarea.selectionStart = start + spaces.length;
                          textarea.selectionEnd = start + spaces.length;
                        });
                      }
                    }}
                    style={{
                      width: '100%',
                      flex: 1,
                      padding: '1rem',
                      borderRadius: 0,
                      background: '#0d1117',
                      color: '#f8fafc',
                      fontFamily: 'Consolas, Monaco, "Andale Mono", "Ubuntu Mono", monospace',
                      fontSize: '0.925rem',
                      lineHeight: 1.65,
                      border: 'none',
                      borderTop: '1px solid rgba(255,255,255,0.05)',
                      outline: 'none',
                      resize: 'none',
                      minHeight: 320
                    }}
                  />

                  {/* Custom Input Section */}
                  <div style={{ padding: '0.75rem 1rem', borderTop: '1px solid rgba(255,255,255,0.07)', background: '#161b22' }}>
                    <div style={{ fontSize: '0.8rem', color: '#94a3b8', marginBottom: 6, fontWeight: 600 }}>Custom Input <span style={{ color: '#64748b', fontWeight: 400 }}>(JSON array of arguments, e.g. [[2,7,11,15], 9])</span></div>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <input
                        type="text"
                        placeholder="e.g. [[2,7,11,15], 9]"
                        value={customInputParams}
                        onChange={(e) => setCustomInputParams(e.target.value)}
                        style={{
                          flex: 1,
                          padding: '0.55rem 0.85rem',
                          borderRadius: 8,
                          background: '#0d1117',
                          color: '#f8fafc',
                          border: '1px solid rgba(255, 255, 255, 0.1)',
                          outline: 'none',
                          fontFamily: 'monospace',
                          fontSize: '0.85rem'
                        }}
                      />
                      <button
                        onClick={handleRunCustomCode}
                        disabled={customInputResult?.isRunning}
                        style={{
                          padding: '0 1rem',
                          borderRadius: 8,
                          background: 'rgba(56, 189, 248, 0.1)',
                          color: '#38bdf8',
                          border: '1px solid rgba(56, 189, 248, 0.3)',
                          cursor: 'pointer',
                          fontWeight: 600,
                          fontSize: '0.85rem'
                        }}
                      >
                        {customInputResult?.isRunning ? 'Running...' : 'Test Custom Input'}
                      </button>
                    </div>

                    {/* Custom Input Result */}
                    {customInputResult && !customInputResult.isRunning && (
                      <div style={{ marginTop: '0.5rem', padding: '0.75rem', borderRadius: 8, background: customInputResult.error ? 'rgba(239, 68, 68, 0.1)' : 'rgba(34, 197, 94, 0.1)', border: customInputResult.error ? '1px solid rgba(239, 68, 68, 0.2)' : '1px solid rgba(34, 197, 94, 0.2)', fontSize: '0.85rem', fontFamily: 'monospace' }}>
                        {customInputResult.error ? (
                          <span style={{ color: '#f87171' }}>Error: {customInputResult.error}</span>
                        ) : (
                          <span style={{ color: '#4ade80' }}>Output: {customInputResult.output}</span>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Execution Console Output */}
                  {testResults[currentIndex] && (
                    <div style={{
                      marginTop: '0.85rem',
                      padding: '1rem 1.25rem',
                      borderRadius: 14,
                      background: '#020617',
                      border: `1.5.px solid ${testResults[currentIndex]?.compilationStatus === 'Success' && testResults[currentIndex]?.score === 100 ? '#22c55e' : (testResults[currentIndex]?.score > 0 ? '#eab308' : '#ef4444')}`,
                      color: '#f8fafc',
                      fontSize: '0.85rem'
                    }}>
                      {/* Summary Metrics Row */}
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 8, marginBottom: '0.85rem', paddingBottom: '0.75rem', borderBottom: '1px solid rgba(255,255,255,0.1)', textAlign: 'center' }}>
                        <div>
                          <div style={{ fontSize: '0.7rem', color: '#94a3b8', textTransform: 'uppercase' }}>Compilation</div>
                          <div style={{ fontWeight: 800, color: testResults[currentIndex].compilationStatus === 'Success' ? '#4ade80' : '#f87171', marginTop: 2 }}>
                            {testResults[currentIndex].compilationStatus === 'Success' ? '✅ Success' : `❌ ${testResults[currentIndex].compilationStatus}`}
                          </div>
                        </div>
                        <div>
                          <div style={{ fontSize: '0.7rem', color: '#94a3b8', textTransform: 'uppercase' }}>Test Cases</div>
                          <div style={{ fontWeight: 800, color: '#38bdf8', marginTop: 2 }}>
                            {testResults[currentIndex].passedTestCasesCount} / {testResults[currentIndex].totalTestCases} Passed
                          </div>
                        </div>
                        <div>
                          <div style={{ fontSize: '0.7rem', color: '#94a3b8', textTransform: 'uppercase' }}>Runtime</div>
                          <div style={{ fontWeight: 800, color: '#e2e8f0', marginTop: 2 }}>
                            {testResults[currentIndex].executionTimeMs || 28} ms
                          </div>
                        </div>
                        <div>
                          <div style={{ fontSize: '0.7rem', color: '#94a3b8', textTransform: 'uppercase' }}>Memory</div>
                          <div style={{ fontWeight: 800, color: '#e2e8f0', marginTop: 2 }}>
                            {testResults[currentIndex].memoryMb || 14} MB
                          </div>
                        </div>
                        <div>
                          <div style={{ fontSize: '0.7rem', color: '#94a3b8', textTransform: 'uppercase' }}>Score</div>
                          <div style={{ fontWeight: 800, fontSize: '1rem', color: testResults[currentIndex].score === 100 ? '#4ade80' : (testResults[currentIndex].score >= 60 ? '#facc15' : '#f87171'), marginTop: 2 }}>
                            {testResults[currentIndex].score}%
                          </div>
                        </div>
                      </div>

                      {/* Error or Feedback message if any */}
                      {testResults[currentIndex].compilationMessage && testResults[currentIndex].compilationStatus !== 'Success' && (
                        <div style={{ padding: '0.5rem 0.75rem', borderRadius: 8, background: 'rgba(239, 68, 68, 0.15)', color: '#f87171', fontSize: '0.8rem', fontFamily: 'monospace', marginBottom: '0.75rem' }}>
                          {testResults[currentIndex].compilationMessage}
                        </div>
                      )}

                      {/* Test Case Breakdown */}
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 6, maxHeight: 150, overflowY: 'auto' }}>
                        {testResults[currentIndex].testCaseDetails?.map((tc: any, tcIdx: number) => (
                          <div key={tcIdx} style={{
                            padding: '0.5rem 0.75rem',
                            borderRadius: 8,
                            background: tc.passed ? 'rgba(34, 197, 94, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                            border: `1px solid ${tc.passed ? 'rgba(34, 197, 94, 0.25)' : 'rgba(239, 68, 68, 0.25)'}`,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            fontFamily: 'monospace',
                            fontSize: '0.775rem'
                          }}>
                            <div>
                              <span style={{ fontWeight: 700, color: tc.passed ? '#4ade80' : '#f87171' }}>
                                {tc.passed ? '✅' : '❌'} {tc.isHidden ? `Hidden Test Case #${tc.id}` : `Test Case #${tc.id}`}
                              </span>
                              {!tc.isHidden && (
                                <span style={{ color: '#cbd5e1', marginLeft: 8 }}>Input: {tc.input}</span>
                              )}
                            </div>
                            <div>
                              {!tc.isHidden ? (
                                <span style={{ color: tc.passed ? '#86efac' : '#fca5a5' }}>
                                  Output: {tc.actualOutput} | Expected: {tc.expectedOutput}
                                </span>
                              ) : (
                                <span style={{ color: tc.passed ? '#86efac' : '#fca5a5', fontWeight: 700 }}>
                                  {tc.passed ? 'PASSED ✅' : 'FAILED ❌'}
                                </span>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

              </div>
            )}

            {/* ==================== EASY / MEDIUM MODE: MCQ AND DESCRIPTIVE CARDS ==================== */}
            {difficulty !== 'Hard' && questions.length > 0 && (
              <div style={{
                background: isDark ? 'rgba(30, 41, 59, 0.7)' : 'rgba(255, 255, 255, 0.95)',
                border: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'}`,
                borderRadius: 20,
                padding: '2rem',
                marginBottom: '1.5rem',
                backdropFilter: 'blur(12px)'
              }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12, marginBottom: '1rem' }}>
                  <div>
                    <span style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', color: '#00B4D8', background: 'rgba(56,189,248,0.12)', padding: '0.2rem 0.6rem', borderRadius: 6, marginBottom: 8, display: 'inline-block' }}>
                      {(questions[currentIndex] as any).category || difficulty}
                    </span>
                    <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: isDark ? '#ffffff' : '#0f172a', lineHeight: 1.5 }}>
                      Q{currentIndex + 1}: {questions[currentIndex]?.question}
                    </h2>
                  </div>

                  {answerMode === 'Speech' && (
                    <button
                      onClick={() => speakQuestion(questions[currentIndex]?.question)}
                      style={{
                        background: 'rgba(56, 189, 248, 0.15)',
                        border: '1px solid rgba(56, 189, 248, 0.3)',
                        color: '#00B4D8',
                        padding: '0.5rem',
                        borderRadius: 10,
                        cursor: 'pointer'
                      }}
                      title="Read Question Out Loud"
                    >
                      {isSpeaking ? <VolumeX size={20} /> : <Volume2 size={20} />}
                    </button>
                  )}
                </div>

                {/* Optional Code Snippet */}
                {(questions[currentIndex] as DescriptiveQuestion).codeSnippet && (
                  <div style={{
                    background: isDark ? '#0f172a' : '#1e293b',
                    color: '#38bdf8',
                    padding: '1rem 1.25rem',
                    borderRadius: 12,
                    fontFamily: 'monospace',
                    fontSize: '0.9rem',
                    marginBottom: '1.25rem',
                    whiteSpace: 'pre-wrap'
                  }}>
                    {(questions[currentIndex] as DescriptiveQuestion).codeSnippet}
                  </div>
                )}

                {/* Mode A: MCQ Options (Easy) */}
                {difficulty === 'Easy' && 'options' in questions[currentIndex] && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', marginTop: '1.25rem' }}>
                    {(questions[currentIndex] as MCQQuestion).options.map((opt, optIdx) => {
                      const isSelected = mcqAnswers[currentIndex] === optIdx;
                      return (
                        <div
                          key={optIdx}
                          onClick={() => setMcqAnswers(prev => ({ ...prev, [currentIndex]: optIdx }))}
                          style={{
                            padding: '1rem 1.25rem',
                            borderRadius: 14,
                            cursor: 'pointer',
                            background: isSelected 
                              ? (isDark ? 'linear-gradient(135deg, rgba(0, 180, 216, 0.25) 0%, rgba(0, 119, 182, 0.2) 100%)' : 'linear-gradient(135deg, rgba(0, 180, 216, 0.14) 0%, rgba(144, 224, 239, 0.2) 100%)')
                              : (isDark ? 'rgba(15, 23, 42, 0.5)' : '#ffffff'),
                            border: `2px solid ${isSelected ? '#00B4D8' : (isDark ? 'rgba(255, 255, 255, 0.1)' : '#e2e8f0')}`,
                            color: isSelected ? (isDark ? '#38bdf8' : '#0077B6') : (isDark ? '#e2e8f0' : '#334155'),
                            fontWeight: isSelected ? 800 : 500,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            boxShadow: isSelected ? '0 4px 14px rgba(0, 180, 216, 0.2)' : '0 2px 4px rgba(0,0,0,0.02)',
                            transition: 'all 0.2s ease'
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                            <div style={{
                              width: 32,
                              height: 32,
                              borderRadius: '50%',
                              background: isSelected ? '#00B4D8' : (isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.05)'),
                              color: isSelected ? '#ffffff' : (isDark ? '#94a3b8' : '#64748b'),
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontSize: '0.9rem',
                              fontWeight: 800
                            }}>
                              {String.fromCharCode(65 + optIdx)}
                            </div>
                            <span style={{ fontSize: '1rem' }}>{opt}</span>
                          </div>

                          {isSelected && (
                            <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#00B4D8', display: 'flex', alignItems: 'center', gap: 4 }}>
                              <CheckCircle2 size={20} /> Selected
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Mode B: Descriptive / Text / Speech Output (Medium) */}
                {difficulty === 'Medium' && (
                  <div style={{ marginTop: '1.25rem' }}>
                    <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 700, color: isDark ? '#94a3b8' : '#64748b', marginBottom: '0.75rem' }}>
                      Your Solution / Detailed Response ({answerMode} Mode):
                    </label>

                    <textarea
                      rows={7}
                      placeholder="Type your detailed answer explanation here..."
                      value={userAnswers[currentIndex] || ''}
                      onChange={(e) => setUserAnswers(prev => ({ ...prev, [currentIndex]: e.target.value }))}
                      style={{
                        width: '100%',
                        padding: '1rem 1.25rem',
                        borderRadius: 14,
                        background: isDark ? 'rgba(15, 23, 42, 0.6)' : 'rgba(241, 245, 249, 0.8)',
                        border: `1.5px solid ${isDark ? 'rgba(255, 255, 255, 0.12)' : 'rgba(0, 0, 0, 0.12)'}`,
                        color: isDark ? '#ffffff' : '#0f172a',
                        fontSize: '0.975rem',
                        lineHeight: 1.6,
                        outline: 'none',
                        resize: 'vertical'
                      }}
                    />

                    {answerMode === 'Speech' && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: '1rem' }}>
                        <button
                          onClick={toggleSpeechRecognition}
                          style={{
                            padding: '0.75rem 1.25rem',
                            borderRadius: 12,
                            background: isListening ? '#ef4444' : '#00B4D8',
                            color: '#ffffff',
                            border: 'none',
                            fontWeight: 700,
                            fontSize: '0.9rem',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 8
                          }}
                        >
                          {isListening ? <MicOff size={18} /> : <Mic size={18} />}
                          {isListening ? 'Stop Speech Recording' : 'Start Microphone'}
                        </button>

                        {isListening && (
                          <span style={{ fontSize: '0.85rem', color: '#ef4444', fontWeight: 600 }}>
                            ● Recording speech live...
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Bottom Nav Bar */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <button
                onClick={handlePrevQuestion}
                disabled={currentIndex === 0}
                style={{
                  padding: '0.85rem 1.5rem',
                  borderRadius: 14,
                  background: isDark ? 'rgba(30, 41, 59, 0.8)' : 'rgba(241, 245, 249, 1)',
                  color: currentIndex === 0 ? (isDark ? '#475569' : '#94a3b8') : (isDark ? '#ffffff' : '#0f172a'),
                  border: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'}`,
                  fontWeight: 700,
                  cursor: currentIndex === 0 ? 'not-allowed' : 'pointer'
                }}
              >
                Previous
              </button>

              {currentIndex < (difficulty === 'Hard' ? codingChallenges.length : questions.length) - 1 ? (
                <button
                  onClick={handleNextQuestion}
                  style={{
                    padding: '0.85rem 1.75rem',
                    borderRadius: 14,
                    background: '#00B4D8',
                    color: '#ffffff',
                    border: 'none',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8
                  }}
                >
                  Next Problem ({currentIndex + 1}/{difficulty === 'Hard' ? codingChallenges.length : questions.length})
                  <ArrowRight size={18} />
                </button>
              ) : (
                <button
                  onClick={handleFinishInterview}
                  style={{
                    padding: '0.85rem 1.75rem',
                    borderRadius: 14,
                    background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
                    color: '#ffffff',
                    border: 'none',
                    fontWeight: 800,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8
                  }}
                >
                  Submit {difficulty === 'Hard' ? codingChallenges.length : questions.length}-Problem Assessment
                  <CheckCircle2 size={18} />
                </button>
              )}
            </div>

          </motion.div>
        )}

        {/* ==================== EVALUATION & REVIEW PAGE (POST SUBMISSION) ==================== */}
        {step === 'results' && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
          >
            {submittedReport ? (
              <AssessmentReportView
                data={submittedReport}
                isDark={isDark}
                onBack={() => setStep('setup')}
              />
            ) : (
              <div style={{ padding: '4rem', textAlign: 'center', color: '#94a3b8' }}>
                <Sparkles size={32} color="#00B4D8" className="animate-spin" style={{ margin: '0 auto 1rem auto' }} />
                <div style={{ fontSize: '1.2rem', fontWeight: 800, color: isDark ? '#ffffff' : '#0f172a' }}>
                  Generating Verified Interview Assessment Report...
                </div>
              </div>
            )}
          </motion.div>
        )}

      </div>
    </DashboardLayout>
  );
}
