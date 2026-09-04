import React from 'react';
import { useAuth } from '../context/AuthContext';
import ProgressChart from '../components/ProgressChart';
import CognitiveScoreCard from '../components/CognitiveScoreCard';
import { TrendingUp, ArrowUpRight, Minus } from 'lucide-react';

const ProgressPage = () => {
  const { profile } = useAuth();

  const memoryScore = profile?.memoryScore || 88;
  const attentionScore = profile?.attentionScore || 64;
  const recallScore = profile?.recallScore || 76;
  const reactionScore = profile?.reactionScore || 71;

  return (
    <div className="page-view animate-fade-in">
      <div className="garden-card" style={{ backgroundColor: '#161B22', border: '1px solid #30363D' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.4rem' }}>
          <div className="icon-box" style={{
            width: 42,
            height: 42,
            borderRadius: '12px',
            backgroundColor: 'rgba(56, 189, 248, 0.15)',
            border: '1px solid rgba(56, 189, 248, 0.35)'
          }}>
            <TrendingUp size={24} color="#38BDF8" />
          </div>
          <h1 style={{ fontSize: '1.8rem', color: '#FFFFFF', fontWeight: 800, fontFamily: 'var(--font-heading)', margin: 0 }}>
            Cognitive Progress & Weekly Trends 📊
          </h1>
        </div>
        <p style={{ color: '#9198A1', fontSize: '0.96rem', margin: 0, lineHeight: 1.5 }}>
          Simple visual tracking of your weekly performance across all 4 cognitive categories.
        </p>
      </div>

      {/* Weekly Trend Indicators */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '1.25rem'
      }}>
        <div className="garden-card" style={{ padding: '1.25rem', backgroundColor: '#161B22', border: '1px solid #30363D' }}>
          <div style={{ fontSize: '0.82rem', color: '#9198A1', fontWeight: 800, textTransform: 'uppercase', fontFamily: 'var(--font-heading)' }}>Memory Trend</div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '0.6rem' }}>
            <span style={{ fontSize: '1.6rem', fontWeight: 900, color: '#38BDF8', fontFamily: 'var(--font-heading)' }}>Memory</span>
            <span className="badge badge-cyan" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.2rem' }}>
              <ArrowUpRight size={15} /> Improving
            </span>
          </div>
        </div>

        <div className="garden-card" style={{ padding: '1.25rem', backgroundColor: '#161B22', border: '1px solid #30363D' }}>
          <div style={{ fontSize: '0.82rem', color: '#9198A1', fontWeight: 800, textTransform: 'uppercase', fontFamily: 'var(--font-heading)' }}>Attention Trend</div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '0.6rem' }}>
            <span style={{ fontSize: '1.6rem', fontWeight: 900, color: '#FF4E50', fontFamily: 'var(--font-heading)' }}>Attention</span>
            <span className="badge badge-flame" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.2rem' }}>
              <Minus size={15} /> Focus Needed
            </span>
          </div>
        </div>

        <div className="garden-card" style={{ padding: '1.25rem', backgroundColor: '#161B22', border: '1px solid #30363D' }}>
          <div style={{ fontSize: '0.82rem', color: '#9198A1', fontWeight: 800, textTransform: 'uppercase', fontFamily: 'var(--font-heading)' }}>Recall Trend</div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '0.6rem' }}>
            <span style={{ fontSize: '1.6rem', fontWeight: 900, color: '#A855F7', fontFamily: 'var(--font-heading)' }}>Recall</span>
            <span className="badge badge-purple" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.2rem' }}>
              <ArrowUpRight size={15} /> Improving
            </span>
          </div>
        </div>

        <div className="garden-card" style={{ padding: '1.25rem', backgroundColor: '#161B22', border: '1px solid #30363D' }}>
          <div style={{ fontSize: '0.82rem', color: '#9198A1', fontWeight: 800, textTransform: 'uppercase', fontFamily: 'var(--font-heading)' }}>Reaction Trend</div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '0.6rem' }}>
            <span style={{ fontSize: '1.6rem', fontWeight: 900, color: '#34D399', fontFamily: 'var(--font-heading)' }}>Reaction</span>
            <span className="badge badge-green" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.2rem' }}>
              <Minus size={15} /> Consistent
            </span>
          </div>
        </div>
      </div>

      <ProgressChart profile={profile} />

      <CognitiveScoreCard
        memory={memoryScore}
        attention={attentionScore}
        recall={recallScore}
        reaction={reactionScore}
      />
    </div>
  );
};

export default ProgressPage;
