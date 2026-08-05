'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useCandidateAuth } from '@/context/CandidateAuthContext';
import { usePortalTheme } from '@/context/PortalThemeContext';
import CandidateDashboardLayout from '../DashboardLayout';
import {
  Video,
  Play,
  Pause,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  Clock,
  Eye,
  Sparkles,
  ShieldCheck,
  Lightbulb,
  Mic,
  Camera,
  Check,
  Send,
  Download,
  FileText,
  Volume2,
  Lock,
  ArrowRight
} from 'lucide-react';

interface SubmittedVideoData {
  id: string;
  videoUrl: string;
  duration: string;
  durationSec: number;
  status: string;
  createdAt: string;
}

export default function VideoIntroductionPage() {
  const { candidate, isLoading: authLoading } = useCandidateAuth();
  const { isDark } = usePortalTheme();
  const router = useRouter();

  // 5-Step Workflow State: 1 | 2 | 3 | 4 | 5
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [sampleWatched, setSampleWatched] = useState<boolean>(false);
  const [submittedVideo, setSubmittedVideo] = useState<SubmittedVideoData | null>(null);
  const [fetchingExisting, setFetchingExisting] = useState<boolean>(true);

  // Sample Video & Script Breakdown State
  const [sampleVideoUrl, setSampleVideoUrl] = useState<string | null>('/videos/sample-self-introduction.mp4');
  const [sampleVideoError, setSampleVideoError] = useState<boolean>(false);
  const [sampleDuration, setSampleDuration] = useState<string>('01:25');
  const [activeScriptSection, setActiveScriptSection] = useState<number>(0);
  const sampleVideoRef = useRef<HTMLVideoElement | null>(null);

  const scriptBreakdown = [
    {
      title: '1. Greeting & Name',
      tag: 'Greeting',
      text: 'Hello Hiring Manager! My name is Priya Sharma, a Software Engineering candidate.',
      tip: 'Smile, look directly into the camera lens, and introduce your name with confidence.'
    },
    {
      title: '2. Educational Background',
      tag: 'Education',
      text: 'I completed my Bachelor of Technology in Computer Science with distinction.',
      tip: 'State your degree, specialization, and relevant academic background.'
    },
    {
      title: '3. Technical Skills',
      tag: 'Skills',
      text: 'I specialize in React, TypeScript, Next.js, Node.js, and SQL database design.',
      tip: 'Focus on 3-5 core technical skills that align with your desired job role.'
    },
    {
      title: '4. Featured Project',
      tag: 'Projects',
      text: 'I developed an AI-powered job assessment portal with real-time scoring and analytics.',
      tip: 'Highlight a major project, your technical role, and problem solved.'
    },
    {
      title: '5. Internship / Experience',
      tag: 'Experience',
      text: 'I completed a 6-month Software Engineering internship optimizing web app responsiveness.',
      tip: 'Share practical experience, key responsibilities, and team accomplishments.'
    },
    {
      title: '6. Career Goals & Thank You',
      tag: 'Goals',
      text: 'My goal is to excel as a Full-Stack Engineer with your engineering team. Thank you for your time!',
      tip: 'Conclude with a clear career objective and thank the recruiter warmly.'
    }
  ];

  const handleSampleLoadedMetadata = () => {
    if (sampleVideoRef.current) {
      const dur = Math.floor(sampleVideoRef.current.duration);
      if (!isNaN(dur) && isFinite(dur) && dur > 0) {
        const m = Math.floor(dur / 60);
        const s = dur % 60;
        setSampleDuration(`${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`);
      }
    }
  };

  const sampleCaptions = [
    "Greeting: Hello Hiring Manager! Hope you are having a great day.",
    "Name: My name is Alex Rivers, a Software Engineer.",
    "Education: I graduated with a B.Tech in Computer Science.",
    "Technical Skills: I specialize in React, Next.js, Node.js, and SQL.",
    "Projects: Built a full-stack web portal with automated scoring.",
    "Experience: Completed a 6-month Software Developer internship.",
    "Career Goal: My goal is to build impactful web applications with your team.",
    "Thank You: Thank you for watching my introduction video!"
  ];


  // Recording State
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [recordingSeconds, setRecordingSeconds] = useState<number>(0);
  const [recordedBlobUrl, setRecordedBlobUrl] = useState<string | null>(null);
  const [recordedBlob, setRecordedBlob] = useState<Blob | null>(null);
  const [recordingError, setRecordingError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState<boolean>(false);

  // Refs
  const liveVideoRef = useRef<HTMLVideoElement | null>(null);
  const previewVideoRef = useRef<HTMLVideoElement | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Fetch existing submitted video
  useEffect(() => {
    if (candidate?.email) {
      fetchSubmittedVideo();
    }
  }, [candidate?.email]);

  const fetchSubmittedVideo = async () => {
    if (!candidate?.email) return;
    setFetchingExisting(true);
    try {
      const res = await fetch(`/api/video-introduction?email=${encodeURIComponent(candidate.email)}`);
      const data = await res.json();
      if (data.success && data.video) {
        setSubmittedVideo(data.video);
        setCurrentStep(5); // Go straight to submission status if video exists
      }
    } catch (err) {
      console.error('Fetch video introduction error:', err);
    } finally {
      setFetchingExisting(false);
    }
  };

  // Step 3 Camera Stream Initialization
  useEffect(() => {
    if (currentStep === 3) {
      startCamera();
    } else {
      stopCamera();
    }

    return () => {
      stopCamera();
    };
  }, [currentStep]);

  const startCamera = async () => {
    setRecordingError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: { ideal: 1280 }, height: { ideal: 720 }, facingMode: 'user' },
        audio: true
      });
      streamRef.current = stream;
      if (liveVideoRef.current) {
        liveVideoRef.current.srcObject = stream;
      }
    } catch (err: any) {
      console.error('Camera/Microphone access error:', err);
      setRecordingError('Camera or Microphone access was denied. Please allow browser permissions to record your video.');
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (liveVideoRef.current) {
      liveVideoRef.current.srcObject = null;
    }
  };

  // Timer Countdown / Countup
  useEffect(() => {
    if (isRecording && !isPaused) {
      timerIntervalRef.current = setInterval(() => {
        setRecordingSeconds(prev => {
          if (prev >= 120) {
            // Auto stop at max 2 minutes (120 seconds)
            handleStopRecording();
            return 120;
          }
          return prev + 1;
        });
      }, 1000);
    } else {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    }

    return () => {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    };
  }, [isRecording, isPaused]);

  // Recording Controls
  const handleStartRecording = () => {
    if (!streamRef.current) {
      startCamera();
      return;
    }

    chunksRef.current = [];
    setRecordingError(null);
    setRecordingSeconds(0);
    setRecordedBlobUrl(null);

    try {
      const mimeType = MediaRecorder.isTypeSupported('video/webm;codecs=vp9')
        ? 'video/webm;codecs=vp9'
        : (MediaRecorder.isTypeSupported('video/webm') ? 'video/webm' : 'video/mp4');

      const recorder = new MediaRecorder(streamRef.current, { mimeType });

      recorder.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };

      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: mimeType });
        setRecordedBlob(blob);
        const url = URL.createObjectURL(blob);
        setRecordedBlobUrl(url);
      };

      recorder.start(500);
      mediaRecorderRef.current = recorder;
      setIsRecording(true);
      setIsPaused(false);
    } catch (err: any) {
      console.error('MediaRecorder start error:', err);
      setRecordingError('Failed to initialize video recorder. Please try again.');
    }
  };

  const handlePauseResume = () => {
    if (!mediaRecorderRef.current) return;
    if (isPaused) {
      mediaRecorderRef.current.resume();
      setIsPaused(false);
    } else {
      mediaRecorderRef.current.pause();
      setIsPaused(true);
    }
  };

  const handleStopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
    setIsRecording(false);
    setIsPaused(false);
    stopCamera();

    if (recordingSeconds < 30) {
      setRecordingError('Recording was under 30 seconds minimum duration. We recommend speaking for 60–120 seconds.');
    }

    // Move to Preview Step 4
    setCurrentStep(4);
  };

  const handleRetakeRecording = () => {
    setIsRecording(false);
    setIsPaused(false);
    setRecordingSeconds(0);
    setRecordedBlobUrl(null);
    setRecordedBlob(null);
    setRecordingError(null);
    setCurrentStep(3);
    startCamera();
  };

  // Convert Blob to Base64 Data URL for persistence
  const blobToBase64 = (blob: Blob): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  };

  // Submit Video Action
  const handleSubmitVideo = async () => {
    if (!recordedBlob && !recordedBlobUrl) {
      setRecordingError('No recorded video available to submit.');
      return;
    }

    setSubmitting(true);
    try {
      let finalVideoUrl = recordedBlobUrl || '';

      if (recordedBlob) {
        try {
          finalVideoUrl = await blobToBase64(recordedBlob);
        } catch (e) {
          console.warn('Blob base64 conversion fallback to object url:', e);
        }
      }

      const formattedMin = Math.floor(recordingSeconds / 60);
      const formattedSec = recordingSeconds % 60;
      const durationStr = `${String(formattedMin).padStart(2, '0')}:${String(formattedSec).padStart(2, '0')}`;

      const res = await fetch('/api/video-introduction', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          candidateId: candidate?.id,
          candidateName: candidate?.name || 'Candidate',
          email: candidate?.email,
          videoUrl: finalVideoUrl,
          duration: durationStr,
          durationSec: recordingSeconds
        })
      });

      const resData = await res.json();
      if (resData.success && resData.video) {
        setSubmittedVideo(resData.video);
        setCurrentStep(5);
      } else {
        setRecordingError(resData.error || 'Failed to submit video. Please try again.');
      }
    } catch (err) {
      console.error('Submit video error:', err);
      setRecordingError('Network or server error while submitting video.');
    } finally {
      setSubmitting(false);
    }
  };

  const formatTimer = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  if (authLoading || fetchingExisting) {
    return (
      <CandidateDashboardLayout>
        <div style={{ padding: '4rem', textAlign: 'center', color: isDark ? '#94a3b8' : '#64748b' }}>
          Loading Video Introduction...
        </div>
      </CandidateDashboardLayout>
    );
  }

  // Steps indicator configuration
  const steps = [
    { num: 1, title: 'Watch Sample' },
    { num: 2, title: 'Read Guidelines' },
    { num: 3, title: 'Record' },
    { num: 4, title: 'Preview' },
    { num: 5, title: 'Submit' }
  ];

  return (
    <CandidateDashboardLayout>
      <div style={{ maxWidth: 1000, margin: '0 auto' }}>

        {/* Page Header */}
        <div style={{ marginBottom: '2rem' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#00B4D8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Interview Stage Module
          </span>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 900, color: isDark ? '#ffffff' : '#0f172a', margin: '4px 0 0 0', display: 'flex', alignItems: 'center', gap: 10 }}>
            <Video size={28} color="#00B4D8" /> Candidate Video Introduction
          </h1>
          <p style={{ margin: '4px 0 0 0', fontSize: '0.9rem', color: isDark ? '#94a3b8' : '#64748b' }}>
            Record a short 60–120 second self-introduction video to highlight your skills, projects, and career goals for hiring managers.
          </p>
        </div>

        {/* Progress Step Indicators Bar */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '2.5rem',
          padding: '1.25rem 1.5rem',
          borderRadius: 20,
          background: isDark ? 'rgba(30, 41, 59, 0.7)' : '#ffffff',
          border: `1.5px solid ${isDark ? 'rgba(255, 255, 255, 0.08)' : '#e2e8f0'}`,
          overflowX: 'auto',
          gap: 12
        }}>
          {steps.map((s, idx) => {
            const isActive = currentStep === s.num;
            const isCompleted = currentStep > s.num || (currentStep === 5 && submittedVideo !== null);

            return (
              <React.Fragment key={s.num}>
                <div
                  onClick={() => {
                    if (isCompleted || (s.num <= 2) || (s.num === 3 && sampleWatched)) {
                      setCurrentStep(s.num);
                    }
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                    cursor: (isCompleted || s.num <= 2 || (s.num === 3 && sampleWatched)) ? 'pointer' : 'not-allowed',
                    opacity: (isCompleted || isActive || s.num <= 2 || sampleWatched) ? 1 : 0.5
                  }}
                >
                  <div style={{
                    width: 34,
                    height: 34,
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 800,
                    fontSize: '0.85rem',
                    background: isCompleted ? '#22c55e' : (isActive ? 'linear-gradient(135deg, #0077B6 0%, #00B4D8 100%)' : (isDark ? 'rgba(255,255,255,0.08)' : '#e2e8f0')),
                    color: (isCompleted || isActive) ? '#ffffff' : (isDark ? '#94a3b8' : '#64748b')
                  }}>
                    {isCompleted ? <Check size={18} /> : s.num}
                  </div>

                  <span style={{
                    fontWeight: isActive ? 800 : 600,
                    fontSize: '0.85rem',
                    color: isActive ? '#00B4D8' : (isCompleted ? '#22c55e' : (isDark ? '#94a3b8' : '#64748b')),
                    whiteSpace: 'nowrap'
                  }}>
                    {s.title}
                  </span>
                </div>

                {idx < steps.length - 1 && (
                  <div style={{ flex: 1, height: 2, minWidth: 20, background: isCompleted ? '#22c55e' : (isDark ? 'rgba(255,255,255,0.1)' : '#e2e8f0') }} />
                )}
              </React.Fragment>
            );
          })}
        </div>

        {/* ========================================================================= */}
        {/* STEP 1 - SAMPLE SELF INTRODUCTION VIDEO */}
        {/* ========================================================================= */}
        {currentStep === 1 && (
          <div style={{
            background: isDark ? 'rgba(15, 23, 42, 0.8)' : '#ffffff',
            border: `1.5px solid ${isDark ? 'rgba(255, 255, 255, 0.1)' : '#e2e8f0'}`,
            borderRadius: 24,
            padding: '2rem',
            marginBottom: '2rem'
          }}>
            <div style={{ marginBottom: '1.5rem' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#00B4D8', textTransform: 'uppercase' }}>Step 1 of 5</span>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 900, color: isDark ? '#ffffff' : '#0f172a', margin: '4px 0 0 0' }}>
                Sample Self Introduction Video
              </h2>
              <p style={{ color: isDark ? '#94a3b8' : '#64748b', fontSize: '0.9rem', marginTop: 4 }}>
                Watch this professional sample to learn how to structure your self-introduction video.
              </p>
            </div>



            {/* Video Player Box */}
            <div style={{
              borderRadius: 20,
              overflow: 'hidden',
              background: '#000000',
              marginBottom: '1.5rem',
              border: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : '#cbd5e1'}`,
              position: 'relative'
            }}>
              {!sampleVideoUrl ? (
                <div style={{ padding: '3rem 1.5rem', textAlign: 'center', color: isDark ? '#94a3b8' : '#64748b' }}>
                  <Video size={42} style={{ marginBottom: 12, opacity: 0.5 }} />
                  <div style={{ fontSize: '1rem', fontWeight: 700 }}>Sample self-introduction video is not available.</div>
                </div>
              ) : sampleVideoError ? (
                <div style={{ padding: '3rem 1.5rem', textAlign: 'center', color: '#ef4444' }}>
                  <AlertCircle size={42} style={{ marginBottom: 12, opacity: 0.8 }} />
                  <div style={{ fontSize: '1rem', fontWeight: 800, marginBottom: 4 }}>Unable to load sample video.</div>
                  <div style={{ fontSize: '0.85rem', color: isDark ? '#94a3b8' : '#64748b', marginBottom: 16 }}>
                    The sample video file could not be retrieved. Please check your network or try again.
                  </div>
                  <button
                    onClick={() => { setSampleVideoError(false); if (sampleVideoRef.current) sampleVideoRef.current.load(); }}
                    style={{
                      padding: '0.5rem 1.25rem',
                      borderRadius: 10,
                      background: 'rgba(239, 68, 68, 0.15)',
                      color: '#ef4444',
                      border: '1px solid rgba(239, 68, 68, 0.3)',
                      fontWeight: 700,
                      cursor: 'pointer'
                    }}
                  >
                    Retry Loading Sample Video
                  </button>
                </div>
              ) : (
                <video
                  ref={sampleVideoRef}
                  controls
                  preload="metadata"
                  playsInline
                  autoPlay={false}
                  poster="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=1200&q=80"
                  onLoadedMetadata={handleSampleLoadedMetadata}
                  onPlay={() => setSampleWatched(true)}
                  onEnded={() => setSampleWatched(true)}
                  onError={() => setSampleVideoError(true)}
                  style={{ width: '100%', maxHeight: '460px', display: 'block', objectFit: 'cover' }}
                >
                  <source src="/videos/sample-self-introduction.mp4" type="video/mp4" />
                  <source src="/videos/sample-self-introduction.webm" type="video/webm" />
                  <source src="/videos/sample-self-introduction.ogv" type="video/ogg" />
                  Your browser does not support HTML5 video.
                </video>
              )}

              <div style={{ padding: '1.25rem', background: isDark ? '#0f172a' : '#f8fafc', borderTop: `1px solid ${isDark ? 'rgba(255,255,255,0.08)' : '#e2e8f0'}` }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: isDark ? '#ffffff' : '#0f172a', margin: 0 }}>
                    Professional Candidate Self-Introduction Sample
                  </h3>
                  <span style={{ padding: '0.25rem 0.75rem', borderRadius: 8, background: 'rgba(56, 189, 248, 0.15)', color: '#38bdf8', fontSize: '0.8rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: 4 }}>
                    <Clock size={14} /> Duration: {sampleDuration}
                  </span>
                </div>
                <p style={{ margin: '6px 0 0 0', fontSize: '0.85rem', color: isDark ? '#94a3b8' : '#64748b' }}>
                  Reference sample video demonstrating clear speech, structured elevator pitch, and high engagement for recruiters.
                </p>
              </div>
            </div>

            {/* Interactive Script & Pitch Breakdown Navigator */}
            <div style={{
              padding: '1.5rem',
              borderRadius: 20,
              background: isDark ? 'rgba(30, 41, 59, 0.6)' : '#f8fafc',
              border: `1.5px solid ${isDark ? 'rgba(255, 255, 255, 0.08)' : '#e2e8f0'}`,
              marginBottom: '2rem'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', flexWrap: 'wrap', gap: 8 }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: isDark ? '#ffffff' : '#0f172a', margin: 0, display: 'flex', alignItems: 'center', gap: 8 }}>
                  <FileText size={20} color="#00B4D8" /> Interactive Sample Script & Elevator Pitch Breakdown
                </h3>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#00B4D8' }}>
                  Click any topic to view script & speaking tips
                </span>
              </div>

              {/* Section Tabs */}
              <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 8, marginBottom: '1rem' }}>
                {scriptBreakdown.map((sec, idx) => {
                  const isSecActive = activeScriptSection === idx;
                  return (
                    <button
                      key={idx}
                      onClick={() => {
                        setActiveScriptSection(idx);
                        setSampleWatched(true);
                      }}
                      style={{
                        padding: '0.45rem 0.85rem',
                        borderRadius: 10,
                        fontWeight: isSecActive ? 800 : 600,
                        fontSize: '0.8rem',
                        border: 'none',
                        cursor: 'pointer',
                        whiteSpace: 'nowrap',
                        background: isSecActive ? 'linear-gradient(135deg, #0077B6 0%, #00B4D8 100%)' : (isDark ? 'rgba(15, 23, 42, 0.7)' : '#ffffff'),
                        color: isSecActive ? '#ffffff' : (isDark ? '#cbd5e1' : '#475569'),
                        boxShadow: isSecActive ? '0 2px 8px rgba(0, 180, 216, 0.3)' : 'none'
                      }}
                    >
                      {sec.title}
                    </button>
                  );
                })}
              </div>

              {/* Active Script Content Box */}
              <div style={{
                padding: '1.25rem',
                borderRadius: 16,
                background: isDark ? 'rgba(15, 23, 42, 0.8)' : '#ffffff',
                border: `1.5px solid ${isDark ? 'rgba(0, 180, 216, 0.3)' : 'rgba(0, 180, 216, 0.2)'}`
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#00B4D8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Sample Script: {scriptBreakdown[activeScriptSection].tag}
                  </span>
                  <button
                    onClick={() => {
                      setSampleWatched(true);
                      if ('speechSynthesis' in window) {
                        window.speechSynthesis.cancel();
                        const ut = new SpeechSynthesisUtterance(scriptBreakdown[activeScriptSection].text);
                        ut.rate = 0.95;
                        window.speechSynthesis.speak(ut);
                      }
                    }}
                    className="btn btn-secondary btn-sm"
                    style={{ fontSize: '0.75rem', display: 'inline-flex', alignItems: 'center', gap: 6 }}
                  >
                    <Volume2 size={13} /> Listen to Audio Pitch
                  </button>
                </div>

                <div style={{ fontSize: '1rem', fontWeight: 700, color: isDark ? '#ffffff' : '#0f172a', lineHeight: 1.5, marginBottom: '0.75rem' }}>
                  &ldquo;{scriptBreakdown[activeScriptSection].text}&rdquo;
                </div>

                <div style={{ fontSize: '0.8125rem', color: isDark ? '#94a3b8' : '#64748b', display: 'flex', alignItems: 'center', gap: 6, background: isDark ? 'rgba(30, 41, 59, 0.5)' : '#f8fafc', padding: '0.6rem 0.85rem', borderRadius: 10 }}>
                  <Lightbulb size={16} color="#f59e0b" style={{ flexShrink: 0 }} />
                  <span><strong>Pro Tip:</strong> {scriptBreakdown[activeScriptSection].tip}</span>
                </div>
              </div>
            </div>

            {/* What a Good Self Introduction Should Include */}
            <div style={{
              padding: '1.5rem',
              borderRadius: 20,
              background: isDark ? 'rgba(30, 41, 59, 0.6)' : '#f8fafc',
              border: `1.5px solid ${isDark ? 'rgba(255, 255, 255, 0.08)' : '#e2e8f0'}`,
              marginBottom: '2rem'
            }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: isDark ? '#ffffff' : '#0f172a', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: 8 }}>
                <Sparkles size={20} color="#00B4D8" /> What a good self introduction should include
              </h3>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '0.85rem' }}>
                {[
                  'Greeting',
                  'Name',
                  'Educational Background',
                  'Technical Skills',
                  'Projects',
                  'Internship / Experience',
                  'Career Goal',
                  'Thank You'
                ].map((item, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '0.75rem 1rem', borderRadius: 12, background: isDark ? 'rgba(15, 23, 42, 0.7)' : '#ffffff', border: `1px solid ${isDark ? 'rgba(255,255,255,0.05)' : '#e2e8f0'}` }}>
                    <CheckCircle2 size={18} color="#22c55e" />
                    <span style={{ fontWeight: 700, fontSize: '0.875rem', color: isDark ? '#f8fafc' : '#0f172a' }}>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Action Bar */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
              <button
                onClick={() => setSampleWatched(true)}
                style={{
                  padding: '0.65rem 1.15rem',
                  borderRadius: 12,
                  background: sampleWatched ? 'rgba(34, 197, 94, 0.15)' : (isDark ? 'rgba(255,255,255,0.08)' : '#e2e8f0'),
                  color: sampleWatched ? '#22c55e' : (isDark ? '#ffffff' : '#0f172a'),
                  border: `1px solid ${sampleWatched ? 'rgba(34, 197, 94, 0.3)' : 'transparent'}`,
                  fontWeight: 700,
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6
                }}
              >
                {sampleWatched ? <CheckCircle2 size={16} /> : <Eye size={16} />}
                {sampleWatched ? 'Sample Watched' : 'Mark Sample Watched'}
              </button>

              <button
                disabled={!sampleWatched}
                onClick={() => setCurrentStep(2)}
                style={{
                  padding: '0.75rem 1.65rem',
                  borderRadius: 12,
                  background: sampleWatched ? 'linear-gradient(135deg, #0077B6 0%, #00B4D8 100%)' : (isDark ? 'rgba(255,255,255,0.1)' : '#cbd5e1'),
                  color: '#ffffff',
                  border: 'none',
                  fontWeight: 800,
                  fontSize: '0.9rem',
                  cursor: sampleWatched ? 'pointer' : 'not-allowed',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  opacity: sampleWatched ? 1 : 0.6,
                  boxShadow: sampleWatched ? '0 4px 14px rgba(0, 180, 216, 0.3)' : 'none'
                }}
              >
                {!sampleWatched && <Lock size={16} />} Continue to Guidelines <ArrowRight size={18} />
              </button>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* STEP 2 - TIPS & GUIDELINES */}
        {/* ========================================================================= */}
        {currentStep === 2 && (
          <div style={{
            background: isDark ? 'rgba(15, 23, 42, 0.8)' : '#ffffff',
            border: `1.5px solid ${isDark ? 'rgba(255, 255, 255, 0.1)' : '#e2e8f0'}`,
            borderRadius: 24,
            padding: '2rem',
            marginBottom: '2rem'
          }}>
            <div style={{ marginBottom: '1.5rem' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#00B4D8', textTransform: 'uppercase' }}>Step 2 of 5</span>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 900, color: isDark ? '#ffffff' : '#0f172a', margin: '4px 0 0 0' }}>
                Interview Recording Guidelines & Tips
              </h2>
              <p style={{ color: isDark ? '#94a3b8' : '#64748b', fontSize: '0.9rem', marginTop: 4 }}>
                Review these expert video recording recommendations to ensure high recruiter impression.
              </p>
            </div>

            {/* Guidelines Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem', marginBottom: '2rem' }}>
              {[
                { title: 'Maintain Eye Contact', text: 'Look directly into your web camera lens while speaking, not at the screen.', icon: '👁️' },
                { title: 'Speak Confidently', text: 'Maintain a clear, articulate, and natural tone of voice throughout.', icon: '🗣️' },
                { title: 'Keep Good Lighting', text: 'Ensure proper lighting facing your front. Avoid strong backlighting.', icon: '💡' },
                { title: 'Use a Quiet Environment', text: 'Choose a silent room free from background noises and interruptions.', icon: '🤫' },
                { title: 'Clean Background', text: 'Record against a clean, uncluttered, professional wall or room backdrop.', icon: '🧹' },
                { title: 'Avoid Reading from Paper', text: 'Do not read scripts line-by-line. Speak naturally from your key points.', icon: '📄' },
                { title: 'Target Duration: 60–120 Seconds', text: 'Keep your recording between 1 to 2 minutes maximum duration.', icon: '⏱️' }
              ].map((tip, idx) => (
                <div key={idx} style={{
                  padding: '1.25rem',
                  borderRadius: 18,
                  background: isDark ? 'rgba(30, 41, 59, 0.5)' : '#f8fafc',
                  border: `1.5px solid ${isDark ? 'rgba(255, 255, 255, 0.08)' : '#e2e8f0'}`
                }}>
                  <div style={{ fontSize: '1.5rem', marginBottom: 6 }}>{tip.icon}</div>
                  <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: isDark ? '#ffffff' : '#0f172a', margin: '0 0 4px 0' }}>
                    {tip.title}
                  </h3>
                  <p style={{ margin: 0, fontSize: '0.85rem', color: isDark ? '#94a3b8' : '#64748b', lineHeight: 1.5 }}>
                    {tip.text}
                  </p>
                </div>
              ))}
            </div>

            {/* Actions Bar */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
              <button
                onClick={() => setCurrentStep(1)}
                style={{
                  padding: '0.75rem 1.35rem',
                  borderRadius: 12,
                  background: isDark ? 'rgba(255,255,255,0.08)' : '#e2e8f0',
                  color: isDark ? '#ffffff' : '#0f172a',
                  border: 'none',
                  fontWeight: 700,
                  fontSize: '0.9rem',
                  cursor: 'pointer'
                }}
              >
                ← Back to Sample
              </button>

              <button
                onClick={() => setCurrentStep(3)}
                style={{
                  padding: '0.75rem 1.65rem',
                  borderRadius: 12,
                  background: 'linear-gradient(135deg, #0077B6 0%, #00B4D8 100%)',
                  color: '#ffffff',
                  border: 'none',
                  fontWeight: 800,
                  fontSize: '0.9rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  boxShadow: '0 4px 14px rgba(0, 180, 216, 0.3)'
                }}
              >
                <Camera size={18} /> I&apos;m Ready - Proceed to Camera & Recording <ArrowRight size={18} />
              </button>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* STEP 3 - RECORD VIDEO */}
        {/* ========================================================================= */}
        {currentStep === 3 && (
          <div style={{
            background: isDark ? 'rgba(15, 23, 42, 0.8)' : '#ffffff',
            border: `1.5px solid ${isDark ? 'rgba(255, 255, 255, 0.1)' : '#e2e8f0'}`,
            borderRadius: 24,
            padding: '2rem',
            marginBottom: '2rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: 12 }}>
              <div>
                <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#00B4D8', textTransform: 'uppercase' }}>Step 3 of 5</span>
                <h2 style={{ fontSize: '1.4rem', fontWeight: 900, color: isDark ? '#ffffff' : '#0f172a', margin: '4px 0 0 0' }}>
                  Live Camera Recording Studio
                </h2>
              </div>

              {/* Timer Badge */}
              <div style={{
                padding: '0.5rem 1.15rem',
                borderRadius: 12,
                fontWeight: 900,
                fontSize: '1rem',
                background: isRecording ? 'rgba(239, 68, 68, 0.15)' : 'rgba(56, 189, 248, 0.15)',
                color: isRecording ? '#ef4444' : '#38bdf8',
                border: `1.5px solid ${isRecording ? '#ef4444' : 'rgba(56, 189, 248, 0.3)'}`,
                display: 'flex',
                alignItems: 'center',
                gap: 8
              }}>
                {isRecording && (
                  <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#ef4444', animation: 'pulse 1s infinite' }} />
                )}
                <Clock size={18} /> {formatTimer(recordingSeconds)} / 02:00
              </div>
            </div>

            {/* Error Message */}
            {recordingError && (
              <div style={{
                padding: '1rem 1.25rem',
                borderRadius: 14,
                background: 'rgba(239, 68, 68, 0.15)',
                border: '1.5px solid rgba(239, 68, 68, 0.3)',
                color: '#ef4444',
                fontWeight: 700,
                marginBottom: '1.5rem',
                display: 'flex',
                alignItems: 'center',
                gap: 10
              }}>
                <AlertCircle size={20} /> {recordingError}
              </div>
            )}

            {/* Camera Viewport Box */}
            <div style={{
              borderRadius: 20,
              overflow: 'hidden',
              background: '#000000',
              marginBottom: '1.5rem',
              border: `2px solid ${isRecording ? '#ef4444' : 'rgba(56, 189, 248, 0.4)'}`,
              position: 'relative',
              aspectRatio: '16/9',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <video
                ref={liveVideoRef}
                autoPlay
                muted
                playsInline
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />

              {/* Status overlay badge */}
              <div style={{
                position: 'absolute',
                top: 16,
                left: 16,
                padding: '0.4rem 0.85rem',
                borderRadius: 10,
                background: 'rgba(0,0,0,0.6)',
                color: '#ffffff',
                fontSize: '0.8rem',
                fontWeight: 700,
                backdropFilter: 'blur(8px)',
                display: 'flex',
                alignItems: 'center',
                gap: 6
              }}>
                <Camera size={14} color="#00B4D8" />
                {isRecording ? (isPaused ? 'Recording Paused' : 'Live Recording...') : 'Camera Ready'}
              </div>
            </div>

            {/* Recording Action Controls Bar */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexWrap: 'wrap', gap: 14 }}>
              {!isRecording ? (
                <button
                  onClick={handleStartRecording}
                  style={{
                    padding: '0.85rem 2rem',
                    borderRadius: 14,
                    background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                    color: '#ffffff',
                    border: 'none',
                    fontWeight: 900,
                    fontSize: '1rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                    boxShadow: '0 4px 16px rgba(239, 68, 68, 0.4)'
                  }}
                >
                  <span style={{ width: 12, height: 12, borderRadius: '50%', background: '#ffffff' }} /> Start Recording
                </button>
              ) : (
                <>
                  <button
                    onClick={handlePauseResume}
                    style={{
                      padding: '0.85rem 1.65rem',
                      borderRadius: 14,
                      background: isDark ? 'rgba(255,255,255,0.1)' : '#e2e8f0',
                      color: isDark ? '#ffffff' : '#0f172a',
                      border: 'none',
                      fontWeight: 800,
                      fontSize: '0.95rem',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8
                    }}
                  >
                    {isPaused ? <Play size={18} /> : <Pause size={18} />}
                    {isPaused ? 'Resume' : 'Pause'}
                  </button>

                  <button
                    onClick={handleStopRecording}
                    style={{
                      padding: '0.85rem 2rem',
                      borderRadius: 14,
                      background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                      color: '#ffffff',
                      border: 'none',
                      fontWeight: 900,
                      fontSize: '1rem',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8,
                      boxShadow: '0 4px 16px rgba(16, 185, 129, 0.4)'
                    }}
                  >
                    <CheckCircle2 size={20} /> Stop & Preview
                  </button>
                </>
              )}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* STEP 4 - PREVIEW */}
        {/* ========================================================================= */}
        {currentStep === 4 && (
          <div style={{
            background: isDark ? 'rgba(15, 23, 42, 0.8)' : '#ffffff',
            border: `1.5px solid ${isDark ? 'rgba(255, 255, 255, 0.1)' : '#e2e8f0'}`,
            borderRadius: 24,
            padding: '2rem',
            marginBottom: '2rem'
          }}>
            <div style={{ marginBottom: '1.5rem' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#00B4D8', textTransform: 'uppercase' }}>Step 4 of 5</span>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 900, color: isDark ? '#ffffff' : '#0f172a', margin: '4px 0 0 0' }}>
                Preview Recorded Introduction
              </h2>
              <p style={{ color: isDark ? '#94a3b8' : '#64748b', fontSize: '0.9rem', marginTop: 4 }}>
                Replay your recorded video introduction before final submission.
              </p>
            </div>

            {/* Error Message */}
            {recordingError && (
              <div style={{
                padding: '1rem 1.25rem',
                borderRadius: 14,
                background: 'rgba(239, 68, 68, 0.15)',
                border: '1.5px solid rgba(239, 68, 68, 0.3)',
                color: '#ef4444',
                fontWeight: 700,
                marginBottom: '1.5rem',
                display: 'flex',
                alignItems: 'center',
                gap: 10
              }}>
                <AlertCircle size={20} /> {recordingError}
              </div>
            )}

            {/* Video Player Preview */}
            <div style={{
              borderRadius: 20,
              overflow: 'hidden',
              background: '#000000',
              marginBottom: '1.5rem',
              border: '2px solid rgba(56, 189, 248, 0.4)',
              aspectRatio: '16/9'
            }}>
              {recordedBlobUrl ? (
                <video
                  ref={previewVideoRef}
                  src={recordedBlobUrl}
                  controls
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              ) : (
                <div style={{ padding: '4rem', textAlign: 'center', color: '#94a3b8' }}>
                  No video recorded yet.
                </div>
              )}
            </div>

            {/* Action Bar */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
              <button
                onClick={handleRetakeRecording}
                style={{
                  padding: '0.75rem 1.35rem',
                  borderRadius: 12,
                  background: isDark ? 'rgba(255,255,255,0.08)' : '#e2e8f0',
                  color: isDark ? '#ffffff' : '#0f172a',
                  border: 'none',
                  fontWeight: 700,
                  fontSize: '0.9rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6
                }}
              >
                <RotateCcw size={16} /> Retake Video
              </button>

              <button
                disabled={submitting}
                onClick={handleSubmitVideo}
                style={{
                  padding: '0.85rem 2rem',
                  borderRadius: 14,
                  background: 'linear-gradient(135deg, #0077B6 0%, #00B4D8 100%)',
                  color: '#ffffff',
                  border: 'none',
                  fontWeight: 900,
                  fontSize: '0.95rem',
                  cursor: submitting ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  boxShadow: '0 4px 14px rgba(0, 180, 216, 0.3)'
                }}
              >
                <Send size={18} /> {submitting ? 'Submitting Video...' : 'Submit Video Introduction'}
              </button>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* STEP 5 - SUBMISSION SUCCESS & STATUS */}
        {/* ========================================================================= */}
        {(currentStep === 5 || submittedVideo) && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {/* Success Summary Header */}
            <div style={{
              padding: '2.25rem',
              borderRadius: 24,
              background: 'rgba(34, 197, 94, 0.08)',
              border: '2px solid rgba(34, 197, 94, 0.3)',
              textAlign: 'center'
            }}>
              <div style={{
                width: 60,
                height: 60,
                borderRadius: '50%',
                background: '#22c55e',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1rem auto',
                boxShadow: '0 4px 14px rgba(34, 197, 94, 0.4)'
              }}>
                <CheckCircle2 size={36} />
              </div>
              <h2 style={{ fontSize: '1.6rem', fontWeight: 900, color: '#22c55e', margin: '0 0 6px 0' }}>
                Video Submitted Successfully!
              </h2>
              <p style={{ margin: 0, fontSize: '0.95rem', color: isDark ? '#cbd5e1' : '#334155' }}>
                Your self-introduction video is verified and available for recruiters reviewing your applications.
              </p>
            </div>

            {/* Video Details Card */}
            <div style={{
              padding: '2rem',
              borderRadius: 24,
              background: isDark ? 'rgba(15, 23, 42, 0.8)' : '#ffffff',
              border: `1.5px solid ${isDark ? 'rgba(255, 255, 255, 0.1)' : '#e2e8f0'}`
            }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
                <div style={{ padding: '1rem', borderRadius: 16, background: isDark ? 'rgba(30, 41, 59, 0.5)' : '#f8fafc', border: `1px solid ${isDark ? 'rgba(255,255,255,0.05)' : '#e2e8f0'}` }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: 700, color: isDark ? '#94a3b8' : '#64748b', textTransform: 'uppercase' }}>Submission Date</div>
                  <div style={{ fontSize: '1.05rem', fontWeight: 800, color: isDark ? '#ffffff' : '#0f172a', marginTop: 2 }}>
                    {submittedVideo?.createdAt ? new Date(submittedVideo.createdAt).toLocaleDateString() : new Date().toLocaleDateString()}
                  </div>
                </div>

                <div style={{ padding: '1rem', borderRadius: 16, background: isDark ? 'rgba(30, 41, 59, 0.5)' : '#f8fafc', border: `1px solid ${isDark ? 'rgba(255,255,255,0.05)' : '#e2e8f0'}` }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: 700, color: isDark ? '#94a3b8' : '#64748b', textTransform: 'uppercase' }}>Video Duration</div>
                  <div style={{ fontSize: '1.05rem', fontWeight: 800, color: '#38bdf8', marginTop: 2 }}>
                    {submittedVideo?.duration || '01:25'} mins
                  </div>
                </div>

                <div style={{ padding: '1rem', borderRadius: 16, background: 'rgba(34, 197, 94, 0.1)', border: '1px solid rgba(34, 197, 94, 0.3)' }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#22c55e', textTransform: 'uppercase' }}>Submission Status</div>
                  <div style={{ fontSize: '1.05rem', fontWeight: 900, color: '#22c55e', marginTop: 2 }}>
                    Verified & Active
                  </div>
                </div>
              </div>

              {/* Submitted Video Player */}
              {submittedVideo?.videoUrl && (
                <div style={{
                  borderRadius: 20,
                  overflow: 'hidden',
                  background: '#000000',
                  marginBottom: '1.5rem',
                  aspectRatio: '16/9'
                }}>
                  <video
                    src={submittedVideo.videoUrl}
                    controls
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </div>
              )}

              {/* Action */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 12 }}>
                <button
                  onClick={() => {
                    setSubmittedVideo(null);
                    setRecordedBlob(null);
                    setRecordedBlobUrl(null);
                    setCurrentStep(1);
                  }}
                  style={{
                    padding: '0.75rem 1.5rem',
                    borderRadius: 12,
                    background: isDark ? 'rgba(255,255,255,0.08)' : '#e2e8f0',
                    color: isDark ? '#ffffff' : '#0f172a',
                    border: 'none',
                    fontWeight: 700,
                    fontSize: '0.9rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8
                  }}
                >
                  <RotateCcw size={16} /> Retake & Update Video Introduction
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </CandidateDashboardLayout>
  );
}
