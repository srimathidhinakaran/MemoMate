import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { soundFx } from '../utils/soundEffects';
import { Sparkles, ArrowRight, Zap, Cpu } from 'lucide-react';

const RecommendationCard = ({ recommendation }) => {
  const { t } = useAuth();
  const rec = recommendation || {
    weakArea: 'attention',
    recommendedActivity: '3D Focus Search 🎯',
    difficulty: 'Medium',
    reason: 'Our Scikit-Learn & Groq AI Model detected attention as your primary focus area.'
  };

  const activityRoutes = {
    'Attention Challenge': '/assessment?game=attention',
    '3D Focus Search 🎯': '/assessment?game=attention',
    'Memory Match': '/assessment?game=memory',
    '3D Memory Match 🎨': '/assessment?game=memory',
    'Number Recall': '/assessment?game=number',
    'Pattern Recall': '/assessment?game=pattern',
    'Reaction Test': '/assessment?game=reaction',
    '3D Reaction Orbs ⚡': '/assessment?game=reaction',
    'Word Recall': '/assessment?game=word'
  };

  const route = activityRoutes[rec.recommendedActivity] || '/assessment';
  const aiInsight = rec.aiInsight;

  return (
    <div className="garden-card animate-fade-in" style={{
      background: 'linear-gradient(135deg, rgba(255, 78, 80, 0.08) 0%, rgba(15, 20, 36, 0.95) 100%)',
      border: '1px solid rgba(255, 78, 80, 0.4)',
      boxShadow: '0 0 30px rgba(255, 78, 80, 0.2)'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.6rem', marginBottom: '0.85rem' }}>
        <div style={{
          padding: '0.45rem 0.95rem',
          borderRadius: '10px',
          backgroundColor: 'rgba(255, 78, 80, 0.15)',
          border: '1px solid rgba(255, 78, 80, 0.4)',
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.4rem',
          color: '#FF4E50',
          fontSize: '0.85rem',
          fontWeight: 800,
          fontFamily: 'var(--font-esports)'
        }}>
          <Sparkles size={16} />
          <span>{t('adaptiveMission')}</span>
        </div>

        <span className="badge badge-purple" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
          <Cpu size={14} color="#A855F7" />
          <span>{t('aiTelemetry')}</span>
        </span>
      </div>

      <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem', color: '#F8FAFC', fontWeight: 900, fontFamily: 'var(--font-heading)' }}>
        {t('focusMissionTitle')} <span style={{ color: '#00F2FE' }}>{rec.recommendedActivity}</span>
      </h3>

      <p style={{ color: '#CBD5E1', fontSize: '1.05rem', lineHeight: 1.6, marginBottom: '1.2rem' }}>
        "{rec.reason}"
      </p>

      {aiInsight && (
        <div style={{
          backgroundColor: 'rgba(0, 0, 0, 0.4)',
          padding: '1rem 1.25rem',
          borderRadius: '14px',
          border: '1px solid rgba(168, 85, 247, 0.3)',
          marginBottom: '1.25rem'
        }}>
          <div style={{ fontSize: '0.78rem', fontWeight: 800, color: '#A855F7', fontFamily: 'var(--font-esports)', textTransform: 'uppercase', marginBottom: '0.25rem' }}>
            {aiInsight.title}
          </div>
          <div style={{ fontSize: '0.98rem', color: '#F8FAFC', fontStyle: 'italic', lineHeight: 1.5 }}>
            "{aiInsight.insight}"
          </div>
        </div>
      )}

      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
        <Link 
          to={route} 
          onClick={() => soundFx.playLevelUp()}
          className="btn-flame" 
          style={{ textDecoration: 'none' }}
        >
          <span>{t('startBattleMission')}</span>
          <ArrowRight size={20} />
        </Link>
        <span style={{ fontSize: '0.85rem', color: '#94A3B8', fontWeight: 700 }}>
          {t('missionBonusSub')}
        </span>
      </div>
    </div>
  );
};

export default RecommendationCard;
