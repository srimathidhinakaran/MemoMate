import React from 'react';
import { useAuth } from '../context/AuthContext';
import CognitivePath from '../components/CognitivePath';
import RecommendationCard from '../components/RecommendationCard';
import { GitCommit, Sparkles } from 'lucide-react';

const CognitivePathPage = () => {
  const { recommendation } = useAuth();

  return (
    <div className="page-view animate-fade-in">
      <div className="garden-card" style={{
        background: 'linear-gradient(135deg, #FFFFFF 0%, #EBF2EC 100%)',
        border: '1.5px solid #7C9A82'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.4rem' }}>
          <div style={{
            width: 38,
            height: 38,
            borderRadius: '10px',
            backgroundColor: '#FFFFFF',
            display: 'flex',
            alignItems: 'center',
            justify: 'center'
          }}>
            <GitCommit size={22} color="#58755E" />
          </div>
          <span className="badge badge-sage">Core Innovation</span>
        </div>

        <h1 style={{ fontSize: '2rem', color: '#1C3B2B', marginBottom: '0.4rem' }}>
          Personalized Cognitive Path 🌱
        </h1>
        <p style={{ color: '#536B5C', fontSize: '1.05rem' }}>
          MemoMate observes your performance after every activity, identifies weak cognitive areas, and updates your tailored sequence.
        </p>
      </div>

      <RecommendationCard recommendation={recommendation} />

      <CognitivePath recommendation={recommendation} />
    </div>
  );
};

export default CognitivePathPage;
