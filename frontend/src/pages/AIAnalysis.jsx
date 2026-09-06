import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import CognitiveScoreCard from '../components/CognitiveScoreCard';
import { Sparkles, ArrowRight, ShieldCheck, Zap, Activity } from 'lucide-react';

const AIAnalysis = () => {
  const { profile, recommendation, t } = useAuth();
  const navigate = useNavigate();

  const [analyzing, setAnalyzing] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnalyzing(false);
    }, 600);
    return () => clearTimeout(timer);
  }, []);

  const memoryScore = profile?.memoryScore || 88;
  const attentionScore = profile?.attentionScore || 64;
  const recallScore = profile?.recallScore || 76;
  const reactionScore = profile?.reactionScore || 71;

  const rec = recommendation || {
    weakArea: 'attention',
    recommendedActivity: 'Attention Challenge',
    difficulty: 'Easy',
    reason: 'Your recent attention score (64) is lower compared with your other measured cognitive areas. We recommend starting an Attention Challenge.'
  };

  const weakAreaTitle = rec.weakArea ? rec.weakArea.charAt(0).toUpperCase() + rec.weakArea.slice(1) : 'Attention';

  if (analyzing) {
    return (
      <div className="page-view animate-fade-in" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
        <div className="garden-card" style={{ textAlign: 'center', padding: '3rem 2.5rem', maxWidth: 480, backgroundColor: '#161B22', border: '1px solid #30363D' }}>
          <div className="animate-pulse-gentle" style={{
            width: 68,
            height: 68,
            borderRadius: '18px',
            backgroundColor: 'rgba(56, 189, 248, 0.15)',
            border: '1px solid rgba(56, 189, 248, 0.35)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1.25rem'
          }}>
            <Sparkles size={32} color="#38BDF8" />
          </div>
          <h2 style={{ fontSize: '1.6rem', color: '#FFFFFF', fontWeight: 800, margin: '0 0 0.5rem', fontFamily: 'var(--font-heading)' }}>
            {t('evaluatingCognitivePerformance')}
          </h2>
          <p style={{ color: '#9198A1', fontSize: '0.92rem', margin: 0, lineHeight: 1.5 }}>
            Evaluating recent exercise session scores across Memory, Attention, Recall, and Reaction.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="page-view animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Hero Header Card */}
      <div className="garden-card" style={{
        backgroundColor: '#161B22',
        border: '1px solid #30363D',
        padding: '2rem 2.2rem',
        borderRadius: '16px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.65rem', flexWrap: 'wrap' }}>
          <span className="badge badge-cyan" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
            <Sparkles size={14} /> {t('performanceAnalysis')}
          </span>
          <span className="badge badge-purple" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
            <Zap size={14} /> {t('adaptiveRecommendationEngine')}
          </span>
        </div>

        <h1 style={{ fontSize: '2.1rem', color: '#FFFFFF', fontWeight: 800, margin: '0 0 0.4rem', fontFamily: 'var(--font-heading)' }}>
          {t('navTelemetry')} 🌿
        </h1>
        <p style={{ color: '#9198A1', fontSize: '0.96rem', margin: 0, maxWidth: '680px', lineHeight: 1.5 }}>
          Our system continuously observes performance and adapts your daily cognitive path.
        </p>
      </div>

      {/* 4 Cognitive Area Score Cards */}
      <CognitiveScoreCard
        memory={memoryScore}
        attention={attentionScore}
        recall={recallScore}
        reaction={reactionScore}
      />

      {/* Focus Area Highlight & Next Activity Recommendation */}
      <div className="garden-card animate-fade-in" style={{
        backgroundColor: '#161B22',
        border: '1px solid rgba(255, 78, 80, 0.4)',
        borderRadius: '16px',
        padding: '2rem 2.2rem',
        boxShadow: '0 0 25px rgba(255, 78, 80, 0.1)'
      }}>
        <h2 style={{ fontSize: '1.45rem', color: '#FFFFFF', fontWeight: 800, margin: '0 0 0.75rem', fontFamily: 'var(--font-heading)' }}>
          Weakest Cognitive Area Identified: <span style={{ color: '#FF4E50' }}>{weakAreaTitle}</span>
        </h2>
        
        <p style={{ fontSize: '1.05rem', color: '#CBD5E1', lineHeight: 1.6, marginBottom: '1.5rem', fontStyle: 'italic' }}>
          "{rec.reason || `Your recent ${weakAreaTitle.toLowerCase()} score (${attentionScore}) is lower compared with your other measured cognitive areas. We recommend starting an ${rec.recommendedActivity || 'Attention Challenge'}.`}"
        </p>

        {/* Inner Recommended Activity Box */}
        <div style={{
          backgroundColor: '#0D1117',
          padding: '1.4rem 1.6rem',
          borderRadius: '14px',
          border: '1px solid #30363D',
          display: 'flex',
          alignItems: 'center',
          justify: 'space-between',
          flexWrap: 'wrap',
          gap: '1.2rem',
          marginBottom: '1.25rem'
        }}>
          <div>
            <div style={{ fontSize: '0.78rem', color: '#9198A1', fontWeight: 800, textTransform: 'uppercase', fontFamily: 'var(--font-heading)', letterSpacing: '0.05em' }}>
              RECOMMENDED NEXT ACTIVITY
            </div>
            <div style={{ fontSize: '1.45rem', fontWeight: 900, color: '#FFFFFF', margin: '0.2rem 0', fontFamily: 'var(--font-heading)' }}>
              {rec.recommendedActivity || 'Attention Challenge'}
            </div>
            <div style={{ fontSize: '0.88rem', color: '#9198A1' }}>
              Recommended Difficulty: <strong style={{ color: '#38BDF8' }}>{rec.difficulty || 'Easy'}</strong>
            </div>
          </div>

          <button
            onClick={() => navigate('/assessment?game=' + (rec.weakArea || 'attention'))}
            className="btn-primary"
            style={{ padding: '0.85rem 1.6rem', fontSize: '0.92rem', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
          >
            <span>Start {rec.recommendedActivity || 'Attention Challenge'}</span>
            <ArrowRight size={18} />
          </button>
        </div>

        {/* Workflow Diagram Loop */}
        <div style={{
          padding: '1rem',
          backgroundColor: '#0D1117',
          borderRadius: '12px',
          border: '1px solid #30363D',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#9198A1', marginBottom: '0.4rem', textTransform: 'uppercase', fontFamily: 'var(--font-heading)', letterSpacing: '0.08em' }}>
            ADAPTIVE COGNITIVE PATH LOOP
          </div>
          <div style={{ fontSize: '1.05rem', fontWeight: 900, color: '#34D399', letterSpacing: '0.14rem', fontFamily: 'var(--font-esports)' }}>
            PLAY → RECORD → ANALYSE → PERSONALIZE → REPEAT
          </div>
        </div>
      </div>

      {/* Non-Diagnostic Medical Safety Disclaimer */}
      <div style={{
        backgroundColor: '#161B22',
        padding: '1.1rem 1.5rem',
        borderRadius: '14px',
        border: '1px solid #30363D',
        display: 'flex',
        alignItems: 'center',
        gap: '0.9rem',
        fontSize: '0.88rem',
        color: '#9198A1'
      }}>
        <ShieldCheck size={22} color="#34D399" style={{ flexShrink: 0 }} />
        <span>
          <strong style={{ color: '#FFFFFF' }}>Medical Safety Notice:</strong> MemoMate provides cognitive exercises and non-clinical trend tracking. It does not diagnose dementia or medical conditions. Consult qualified healthcare professionals for medical advice.
        </span>
      </div>
    </div>
  );
};

export default AIAnalysis;
