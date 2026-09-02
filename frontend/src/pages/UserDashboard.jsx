import React from 'react';
import { useAuth } from '../context/AuthContext';
import CognitiveScoreCard from '../components/CognitiveScoreCard';
import RecommendationCard from '../components/RecommendationCard';
import CognitivePath from '../components/CognitivePath';
import GardenPreview from '../components/GardenPreview';
import { Sun, Sparkles } from 'lucide-react';

const UserDashboard = () => {
  const { user, profile, recommendation } = useAuth();

  return (
    <div className="page-view animate-fade-in">
      {/* Header Banner */}
      <div style={{
        backgroundColor: '#FFFFFF',
        borderRadius: '24px',
        padding: '1.75rem 2rem',
        border: '1px solid #E6E0D4',
        boxShadow: '0 10px 30px rgba(28, 59, 43, 0.04)',
        display: 'flex',
        alignItems: 'center',
        justify: 'space-between',
        flexWrap: 'wrap',
        gap: '1rem'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.2rem' }}>
            <Sun size={26} color="#C87862" />
            <h1 style={{ fontSize: '2rem', color: '#1C3B2B' }}>
              Good Morning, {user?.name || 'Meena'}
            </h1>
          </div>
          <p style={{ color: '#536B5C', fontSize: '1.05rem' }}>
            Age: {user?.age || 68} | Focus Area: Tailored cognitive training and engagement.
          </p>
        </div>

        <div style={{
          backgroundColor: '#F7F4EE',
          padding: '0.75rem 1.25rem',
          borderRadius: '16px',
          border: '1px solid #E6E0D4',
          display: 'flex',
          alignItems: 'center',
          gap: '0.6rem'
        }}>
          <Sparkles size={20} color="#58755E" />
          <span style={{ fontWeight: 700, color: '#1C3B2B', fontSize: '0.95rem' }}>
            Adaptive Learning Pipeline Active
          </span>
        </div>
      </div>

      {/* 4 Cognitive Metrics Cards */}
      <div>
        <h2 style={{ fontSize: '1.35rem', marginBottom: '0.85rem', color: '#1C3B2B' }}>
          Current Cognitive Profile
        </h2>
        <CognitiveScoreCard
          memory={profile?.memoryScore || 82}
          attention={profile?.attentionScore || 64}
          recall={profile?.recallScore || 76}
          reaction={profile?.reactionScore || 71}
        />
      </div>

      {/* Adaptive Recommendation Card */}
      <RecommendationCard recommendation={recommendation} />

      {/* Two Column Grid for Path & Garden Preview */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: '1.5rem'
      }}>
        <CognitivePath recommendation={recommendation} />
        <GardenPreview />
      </div>
    </div>
  );
};

export default UserDashboard;
