import React from 'react';
import { useAuth } from '../context/AuthContext';
import CognitivePath from '../components/CognitivePath';
import RecommendationCard from '../components/RecommendationCard';
import { GitCommit, Sparkles } from 'lucide-react';

const CognitivePathPage = () => {
  const { recommendation, t } = useAuth();

  return (
    <div className="page-view animate-fade-in">
      <div className="garden-card" style={{
        background: 'linear-gradient(135deg, #161C26 0%, #0B0E14 100%)',
        border: '1.5px solid #38BDF8'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.4rem' }}>
          <div style={{
            width: 38,
            height: 38,
            borderRadius: '10px',
            backgroundColor: 'rgba(56, 189, 248, 0.15)',
            display: 'flex',
            alignItems: 'center',
            justify: 'center'
          }}>
            <GitCommit size={22} color="#38BDF8" />
          </div>
          <span className="badge badge-cyan">{t('coreInnovationBadge') || 'Core Innovation'}</span>
        </div>

        <h1 style={{ fontSize: '2rem', color: '#FFFFFF', marginBottom: '0.4rem' }}>
          {t('personalizedPathTitle') || 'Personalized Cognitive Path 🌱'}
        </h1>
        <p style={{ color: '#94A3B8', fontSize: '1.05rem' }}>
          {t('personalizedPathDesc') || 'MemoMate observes your performance after every activity, identifies weak cognitive areas, and updates your tailored sequence.'}
        </p>
      </div>

      <RecommendationCard recommendation={recommendation} />

      <CognitivePath recommendation={recommendation} />
    </div>
  );
};

export default CognitivePathPage;
