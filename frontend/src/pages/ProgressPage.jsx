import React from 'react';
import { useAuth } from '../context/AuthContext';
import ProgressChart from '../components/ProgressChart';
import CognitiveScoreCard from '../components/CognitiveScoreCard';
import { TrendingUp, ArrowUpRight, Minus } from 'lucide-react';

const ProgressPage = () => {
  const { profile } = useAuth();

  return (
    <div className="page-view animate-fade-in">
      <div className="garden-card">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.4rem' }}>
          <TrendingUp size={26} color="#58755E" />
          <h1 style={{ fontSize: '1.8rem', color: '#1C3B2B' }}>
            Cognitive Progress & Weekly Trends 📊
          </h1>
        </div>
        <p style={{ color: '#536B5C', fontSize: '1.05rem' }}>
          Simple visual tracking of your weekly performance across all 4 cognitive categories.
        </p>
      </div>

      {/* Weekly Trend Indicators */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '1.25rem'
      }}>
        <div className="garden-card" style={{ padding: '1.25rem' }}>
          <div style={{ fontSize: '0.85rem', color: '#7E9687', fontWeight: 700 }}>Memory Trend</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.4rem' }}>
            <span style={{ fontSize: '1.6rem', fontWeight: 800, color: '#58755E' }}>Memory</span>
            <span className="badge badge-sage" style={{ display: 'inline-flex', alignItems: 'center' }}>
              <ArrowUpRight size={16} /> Improving
            </span>
          </div>
        </div>

        <div className="garden-card" style={{ padding: '1.25rem' }}>
          <div style={{ fontSize: '0.85rem', color: '#7E9687', fontWeight: 700 }}>Attention Trend</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.4rem' }}>
            <span style={{ fontSize: '1.6rem', fontWeight: 800, color: '#C87862' }}>Attention</span>
            <span className="badge badge-peach" style={{ display: 'inline-flex', alignItems: 'center' }}>
              <Minus size={16} /> Stable Focus
            </span>
          </div>
        </div>

        <div className="garden-card" style={{ padding: '1.25rem' }}>
          <div style={{ fontSize: '0.85rem', color: '#7E9687', fontWeight: 700 }}>Recall Trend</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.4rem' }}>
            <span style={{ fontSize: '1.6rem', fontWeight: 800, color: '#7A66A3' }}>Recall</span>
            <span className="badge badge-lavender" style={{ display: 'inline-flex', alignItems: 'center' }}>
              <ArrowUpRight size={16} /> Improving
            </span>
          </div>
        </div>

        <div className="garden-card" style={{ padding: '1.25rem' }}>
          <div style={{ fontSize: '0.85rem', color: '#7E9687', fontWeight: 700 }}>Reaction Trend</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.4rem' }}>
            <span style={{ fontSize: '1.6rem', fontWeight: 800, color: '#3B7A8C' }}>Reaction</span>
            <span className="badge" style={{ backgroundColor: '#EBF6F8', color: '#3B7A8C', display: 'inline-flex', alignItems: 'center' }}>
              <Minus size={16} /> Consistent
            </span>
          </div>
        </div>
      </div>

      <ProgressChart profile={profile} />

      <CognitiveScoreCard
        memory={profile?.memoryScore || 82}
        attention={profile?.attentionScore || 64}
        recall={profile?.recallScore || 76}
        reaction={profile?.reactionScore || 71}
      />
    </div>
  );
};

export default ProgressPage;
