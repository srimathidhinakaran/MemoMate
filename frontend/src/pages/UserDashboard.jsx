import React from 'react';
import { useAuth } from '../context/AuthContext';
import DynamicGreetingHero from '../components/DynamicGreetingHero';
import DementiaOrientationCard from '../components/DementiaOrientationCard';
import LiveActivityFeed from '../components/LiveActivityFeed';
import StreakTracker from '../components/StreakTracker';
import DailyQuestsCard from '../components/DailyQuestsCard';
import LeaderboardCard from '../components/LeaderboardCard';
import RewardShopCard from '../components/RewardShopCard';
import CognitiveScoreCard from '../components/CognitiveScoreCard';
import RecommendationCard from '../components/RecommendationCard';
import CognitivePath from '../components/CognitivePath';
import GardenPreview from '../components/GardenPreview';
import RewardUnlockModal from '../components/RewardUnlockModal';

const UserDashboard = () => {
  const { profile, recommendation, activeRewardModal, setActiveRewardModal } = useAuth();

  return (
    <div className="page-view animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* 1. Dynamic Time-Aware Hero Greeting */}
      <DynamicGreetingHero />

      {/* 2. Dementia Daily Memory Anchor & Orientation Suite (NER Multi-lingual) */}
      <DementiaOrientationCard />

      {/* 3. Live Cognitive Telemetry Ticker Stream */}
      <LiveActivityFeed />

      {/* 3. Daily Streak Maintenance & Quests */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
        gap: '1.5rem'
      }}>
        <StreakTracker />
        <DailyQuestsCard />
      </div>

      {/* 4. Current Cognitive Profile Score Cards */}
      <div>
        <h2 style={{ fontSize: '1.35rem', marginBottom: '0.85rem', color: '#F8FAFC', fontWeight: 900, fontFamily: 'var(--font-heading)' }}>
          {t('cognitiveMetricsHeader')}
        </h2>
        <CognitiveScoreCard
          memory={profile?.memoryScore || 88}
          attention={profile?.attentionScore || 64}
          recall={profile?.recallScore || 76}
          reaction={profile?.reactionScore || 71}
        />
      </div>

      {/* 5. Adaptive AI Recommendation Card */}
      <RecommendationCard recommendation={recommendation} />

      {/* 6. Emerald League Leaderboard Widget */}
      <LeaderboardCard />

      {/* 7. Rewards Shop & Unlocks */}
      <RewardShopCard />

      {/* 8. Personalized Cognitive Path & 3D Garden Preview */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: '1.5rem'
      }}>
        <CognitivePath recommendation={recommendation} />
        <GardenPreview />
      </div>

      {/* 9. Celebratory Reward Unlock Modal */}
      {activeRewardModal && (
        <RewardUnlockModal
          reward={activeRewardModal}
          onClose={() => setActiveRewardModal(null)}
        />
      )}
    </div>
  );
};

export default UserDashboard;
