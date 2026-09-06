import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { soundFx } from '../utils/soundEffects';
import ExternalGamificationCard from '../components/ExternalGamificationCard';
import LeaderboardPage from './LeaderboardPage';
import { Trophy, Zap, Award, Flame, Shield, Globe, ExternalLink, Sparkles } from 'lucide-react';

const GamificationHubPage = () => {
  const { user, xpPoints, gems, streak, level, t, externalGamificationUrl } = useAuth();
  const [activeTab, setActiveTab] = useState('hub'); // 'hub' | 'leaderboard'

  const levelTitle = level === 1 ? 'Cognitive Initiate ⚡' : (level === 2 ? 'Focus Explorer 🛡️' : (level === 3 ? 'Memory Master 🧠' : (level === 4 ? 'Mind Legend 👑' : 'Grandmaster Supreme 🌌')));

  return (
    <div className="page-view animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Header Banner */}
      <div className="garden-card" style={{ backgroundColor: '#161C26', borderColor: '#38BDF8' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div className="icon-box" style={{
              width: 56,
              height: 56,
              borderRadius: '16px',
              backgroundColor: 'rgba(56, 189, 248, 0.15)',
              border: '1px solid #38BDF8'
            }}>
              <Trophy size={32} color="#38BDF8" />
            </div>
            <div>
              <div style={{ fontSize: '0.8rem', fontWeight: 800, color: '#38BDF8', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                {t('externalGamificationTag') || 'DEDICATED GAMIFICATION HUB 🌐'}
              </div>
              <h1 style={{ fontSize: '1.9rem', color: '#FFFFFF', fontWeight: 900, fontFamily: 'var(--font-heading)', margin: '0.2rem 0' }}>
                {t('gamificationHubTitle') || 'Gamification & Mind Matrix Hub'}
              </h1>
              <p style={{ color: '#94A3B8', fontSize: '0.92rem', margin: 0 }}>
                {t('gamificationHubSub') || 'Track your XP, Gems, daily cognitive quests, leaderboard rank, and 3D WebGL multiplayer challenges.'}
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            <div style={{ backgroundColor: '#0D1117', padding: '0.75rem 1.1rem', borderRadius: '12px', border: '1px solid #263142', textAlign: 'center' }}>
              <div style={{ fontSize: '0.75rem', color: '#94A3B8', fontWeight: 700 }}>LEVEL {level}</div>
              <div style={{ fontSize: '1.1rem', fontWeight: 900, color: '#FBBF24' }}>{levelTitle}</div>
            </div>
            <div style={{ backgroundColor: '#0D1117', padding: '0.75rem 1.1rem', borderRadius: '12px', border: '1px solid #263142', textAlign: 'center' }}>
              <div style={{ fontSize: '0.75rem', color: '#94A3B8', fontWeight: 700 }}>STREAK</div>
              <div style={{ fontSize: '1.1rem', fontWeight: 900, color: '#FB923C' }}>🔥 {streak} Days</div>
            </div>
            <div style={{ backgroundColor: '#0D1117', padding: '0.75rem 1.1rem', borderRadius: '12px', border: '1px solid #263142', textAlign: 'center' }}>
              <div style={{ fontSize: '0.75rem', color: '#94A3B8', fontWeight: 700 }}>TOTAL XP</div>
              <div style={{ fontSize: '1.1rem', fontWeight: 900, color: '#38BDF8' }}>⚡ {xpPoints} XP</div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '0.75rem' }}>
        <button
          onClick={() => { soundFx.playClick(); setActiveTab('hub'); }}
          className="btn-secondary"
          style={{
            padding: '0.75rem 1.5rem',
            backgroundColor: activeTab === 'hub' ? 'rgba(56, 189, 248, 0.2)' : '#161C26',
            borderColor: activeTab === 'hub' ? '#38BDF8' : '#263142',
            color: activeTab === 'hub' ? '#38BDF8' : '#FFFFFF',
            fontWeight: 800
          }}
        >
          <Sparkles size={18} />
          <span>Gamification Overview</span>
        </button>
        <button
          onClick={() => { soundFx.playClick(); setActiveTab('leaderboard'); }}
          className="btn-secondary"
          style={{
            padding: '0.75rem 1.5rem',
            backgroundColor: activeTab === 'leaderboard' ? 'rgba(56, 189, 248, 0.2)' : '#161C26',
            borderColor: activeTab === 'leaderboard' ? '#38BDF8' : '#263142',
            color: activeTab === 'leaderboard' ? '#38BDF8' : '#FFFFFF',
            fontWeight: 800
          }}
        >
          <Trophy size={18} />
          <span>Live Leaderboard</span>
        </button>
      </div>

      {/* Main Tab Content */}
      {activeTab === 'hub' ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <ExternalGamificationCard />
        </div>
      ) : (
        <LeaderboardPage />
      )}
    </div>
  );
};

export default GamificationHubPage;
