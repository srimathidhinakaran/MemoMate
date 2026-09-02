import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ArrowRight, Zap } from 'lucide-react';

const RecommendationCard = ({ recommendation }) => {
  const rec = recommendation || {
    weakArea: 'attention',
    recommendedActivity: 'Attention Challenge',
    difficulty: 'Medium',
    reason: 'Your recent attention performance is lower than your other measured areas.'
  };

  const activityRoutes = {
    'Attention Challenge': '/assessment?game=attention',
    'Memory Match': '/assessment?game=memory',
    'Number Recall': '/assessment?game=number',
    'Pattern Recall': '/assessment?game=pattern',
    'Reaction Test': '/assessment?game=reaction',
    'Word Recall': '/assessment?game=word'
  };

  const route = activityRoutes[rec.recommendedActivity] || '/assessment';
  const aiInsight = rec.aiInsight;

  return (
    <div className="garden-card animate-fade-in" style={{
      background: 'linear-gradient(135deg, #FFFFFF 0%, #FDF3F0 100%)',
      border: '1.5px solid #F4C3B2',
      boxShadow: '0 12px 30px rgba(200, 120, 98, 0.1)'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.6rem', marginBottom: '0.85rem' }}>
        <div style={{
          padding: '0.4rem 0.85rem',
          borderRadius: 9999,
          backgroundColor: '#FDF3F0',
          border: '1px solid #F4C3B2',
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.4rem',
          color: '#C87862',
          fontSize: '0.85rem',
          fontWeight: 700
        }}>
          <Sparkles size={16} />
          <span>Adaptive Recommendation</span>
        </div>

        <span className="badge badge-lavender" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
          <Zap size={14} color="#7A66A3" />
          <span>⚡ Groq Llama-3 AI Engine</span>
        </span>
      </div>

      <h3 style={{ fontSize: '1.45rem', marginBottom: '0.5rem', color: '#1C3B2B' }}>
        Focus Activity: {rec.recommendedActivity}
      </h3>

      <p style={{ color: '#536B5C', fontSize: '1.05rem', lineHeight: 1.6, marginBottom: '1rem' }}>
        "{rec.reason}"
      </p>

      {aiInsight && (
        <div style={{
          backgroundColor: '#FFFFFF',
          padding: '1rem 1.25rem',
          borderRadius: '16px',
          border: '1px solid #E6E0D4',
          marginBottom: '1.25rem'
        }}>
          <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#7A66A3', textTransform: 'uppercase', marginBottom: '0.2rem' }}>
            {aiInsight.title}
          </div>
          <div style={{ fontSize: '0.98rem', color: '#1C3B2B', fontStyle: 'italic', lineHeight: 1.5 }}>
            "{aiInsight.insight}"
          </div>
        </div>
      )}

      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
        <Link to={route} className="btn-peach" style={{ textDecoration: 'none' }}>
          <span>Start Recommended Activity</span>
          <ArrowRight size={20} />
        </Link>
        <span style={{ fontSize: '0.9rem', color: '#7E9687', fontWeight: 500 }}>
          🌱 Completing this activity updates your cognitive path & blooms your garden.
        </span>
      </div>
    </div>
  );
};

export default RecommendationCard;
