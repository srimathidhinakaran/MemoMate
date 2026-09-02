import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Sparkles, Brain, Target, RotateCcw, Zap, ArrowRight, ShieldCheck } from 'lucide-react';

const AIAnalysis = () => {
  const { profile, recommendation } = useAuth();
  const navigate = useNavigate();

  const [analyzing, setAnalyzing] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnalyzing(false);
    }, 1200);
    return () => clearTimeout(timer);
  }, []);

  const rec = recommendation || {
    weakArea: 'attention',
    recommendedActivity: 'Attention Challenge',
    difficulty: 'Medium',
    reason: 'Your recent attention score (64) is lower compared with your other measured cognitive areas.'
  };

  if (analyzing) {
    return (
      <div className="page-view animate-fade-in" style={{ alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
        <div className="garden-card" style={{ textAlign: 'center', padding: '3rem 2rem', maxWidth: 500 }}>
          <div className="animate-pulse-gentle" style={{
            width: 70,
            height: 70,
            borderRadius: '50%',
            backgroundColor: '#FDF3F0',
            display: 'flex',
            alignItems: 'center',
            justify: 'center',
            margin: '0 auto 1.5rem'
          }}>
            <Sparkles size={38} color="#C87862" />
          </div>
          <h2 style={{ fontSize: '1.8rem', color: '#1C3B2B', marginBottom: '0.5rem' }}>
            Analysing your performance...
          </h2>
          <p style={{ color: '#536B5C', fontSize: '1rem' }}>
            Evaluating recent session scores across Memory, Attention, Recall, and Reaction.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="page-view animate-fade-in">
      <div className="garden-card" style={{
        background: 'linear-gradient(135deg, #FFFFFF 0%, #FDF3F0 100%)',
        border: '1.5px solid #F4C3B2'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.5rem' }}>
          <span className="badge badge-peach" style={{ fontSize: '0.9rem' }}>
            <Sparkles size={16} /> Cognitive Performance Analysis
          </span>
          <span className="badge badge-sage">Adaptive Recommendation Engine</span>
        </div>

        <h1 style={{ fontSize: '2rem', color: '#1C3B2B', marginBottom: '0.5rem' }}>
          AI Performance Breakdown 🌱
        </h1>
        <p style={{ color: '#536B5C', fontSize: '1.05rem' }}>
          Our system continuously observes performance and adapts your daily cognitive path.
        </p>
      </div>

      {/* Cognitive Performance Breakdown Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '1.25rem'
      }}>
        <div className="garden-card" style={{ border: '1px solid #7C9A82' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.5rem' }}>
            <Brain size={22} color="#58755E" />
            <span style={{ fontWeight: 700 }}>Memory</span>
          </div>
          <div style={{ fontSize: '2.4rem', fontWeight: 800, color: '#58755E' }}>
            {profile?.memoryScore || 82} <span style={{ fontSize: '1rem', color: '#536B5C' }}>/ 100</span>
          </div>
          <span className="badge badge-sage" style={{ marginTop: '0.5rem' }}>Stable & Strong</span>
        </div>

        <div className="garden-card" style={{ border: '2px solid #C87862', backgroundColor: '#FDF3F0' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.5rem' }}>
            <Target size={22} color="#C87862" />
            <span style={{ fontWeight: 700, color: '#C87862' }}>Attention</span>
          </div>
          <div style={{ fontSize: '2.4rem', fontWeight: 800, color: '#C87862' }}>
            {profile?.attentionScore || 64} <span style={{ fontSize: '1rem', color: '#C87862' }}>/ 100</span>
          </div>
          <span className="badge badge-peach" style={{ marginTop: '0.5rem' }}>Needs More Practice 🎯</span>
        </div>

        <div className="garden-card" style={{ border: '1px solid #B8A7D9' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.5rem' }}>
            <RotateCcw size={22} color="#7A66A3" />
            <span style={{ fontWeight: 700 }}>Recall</span>
          </div>
          <div style={{ fontSize: '2.4rem', fontWeight: 800, color: '#7A66A3' }}>
            {profile?.recallScore || 76} <span style={{ fontSize: '1rem', color: '#536B5C' }}>/ 100</span>
          </div>
          <span className="badge badge-lavender" style={{ marginTop: '0.5rem' }}>Improving ↑</span>
        </div>

        <div className="garden-card" style={{ border: '1px solid #8EC5D2' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.5rem' }}>
            <Zap size={22} color="#3B7A8C" />
            <span style={{ fontWeight: 700 }}>Reaction</span>
          </div>
          <div style={{ fontSize: '2.4rem', fontWeight: 800, color: '#3B7A8C' }}>
            {profile?.reactionScore || 71} <span style={{ fontSize: '1rem', color: '#536B5C' }}>/ 100</span>
          </div>
          <span className="badge" style={{ backgroundColor: '#EBF6F8', color: '#3B7A8C', marginTop: '0.5rem' }}>Consistent</span>
        </div>
      </div>

      {/* Focus Area Highlight & Next Activity Recommendation */}
      <div className="garden-card" style={{ backgroundColor: '#FFFFFF', border: '1.5px solid #F4C3B2' }}>
        <h3 style={{ fontSize: '1.4rem', color: '#C87862', marginBottom: '0.75rem' }}>
          Weakest Cognitive Area Identified: Attention
        </h3>
        
        <p style={{ fontSize: '1.1rem', color: '#1C3B2B', lineHeight: 1.6, marginBottom: '1.25rem' }}>
          "{rec.reason}"
        </p>

        <div style={{
          backgroundColor: '#F7F4EE',
          padding: '1.25rem',
          borderRadius: '16px',
          border: '1px solid #E6E0D4',
          display: 'flex',
          alignItems: 'center',
          justify: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem',
          marginBottom: '1.5rem'
        }}>
          <div>
            <div style={{ fontSize: '0.85rem', color: '#7E9687', fontWeight: 700, textTransform: 'uppercase' }}>
              Recommended Next Activity
            </div>
            <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#1C3B2B' }}>
              {rec.recommendedActivity}
            </div>
            <div style={{ fontSize: '0.9rem', color: '#536B5C' }}>
              Recommended Difficulty: <strong>{rec.difficulty || 'Medium'}</strong>
            </div>
          </div>

          <button
            onClick={() => navigate('/assessment?game=attention')}
            className="btn-peach"
            style={{ padding: '0.85rem 1.6rem' }}
          >
            <span>Start {rec.recommendedActivity}</span>
            <ArrowRight size={20} />
          </button>
        </div>

        {/* Workflow Diagram */}
        <div style={{
          padding: '1rem',
          backgroundColor: '#F9F6F0',
          borderRadius: '14px',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#7E9687', marginBottom: '0.5rem', textTransform: 'uppercase' }}>
            Adaptive Cognitive Path Loop
          </div>
          <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#58755E', letterSpacing: '0.1rem' }}>
            PLAY → RECORD → ANALYSE → PERSONALIZE → REPEAT
          </div>
        </div>
      </div>

      {/* Non-Diagnostic Medical Safety Disclaimer */}
      <div style={{
        backgroundColor: '#F7F4EE',
        padding: '1rem 1.25rem',
        borderRadius: '16px',
        border: '1px solid #E6E0D4',
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
        fontSize: '0.88rem',
        color: '#536B5C'
      }}>
        <ShieldCheck size={22} color="#58755E" style={{ flexShrink: 0 }} />
        <span>
          <strong>Medical Safety Notice:</strong> MemoMate provides cognitive exercises and non-clinical trend tracking. It does not diagnose dementia or medical conditions. Consult qualified healthcare professionals for medical advice.
        </span>
      </div>
    </div>
  );
};

export default AIAnalysis;
