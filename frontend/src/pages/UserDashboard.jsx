import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import CognitiveScoreCard from '../components/CognitiveScoreCard';
import GardenPreview from '../components/GardenPreview';
import RewardUnlockModal from '../components/RewardUnlockModal';
import { Brain, Play, Calendar, Users, Mic, Clock, Sparkles, ArrowRight, HelpCircle } from 'lucide-react';

const UserDashboard = () => {
  const { user, t, profile, recommendation, reminders, activeRewardModal, setActiveRewardModal, setVoiceModalOpen } = useAuth();
  const navigate = useNavigate();

  const getGreetingTime = () => {
    const hour = new Date().getHours();
    if (hour < 12) return t('goodMorning') || 'Good Morning';
    if (hour < 17) return t('goodAfternoon') || 'Good Afternoon';
    return t('goodEvening') || 'Good Evening';
  };

  const userName = user?.name || 'Lakshmi Devi';
  const isAssessed = profile?.assessed !== false && profile?.memoryScore !== null && profile?.memoryScore !== undefined;

  const handleStartPrimaryActivity = () => {
    if (!isAssessed) {
      navigate('/assessment?baseline=true');
      return;
    }

    let targetGame = recommendation?.recommendedGameId || '3d-memory';
    if (recommendation?.weakArea === 'attention') targetGame = '3d-target';
    if (recommendation?.weakArea === 'recall') targetGame = 'number';
    if (recommendation?.weakArea === 'reaction') targetGame = '3d-reaction';

    navigate(`/assessment?game=${targetGame}`);
  };

  return (
    <div className="page-view animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* 1. Elderly-First Warm Hero Header */}
      <div className="garden-card animate-fade-in" style={{
        backgroundColor: '#161C26',
        border: '1px solid #38BDF8',
        padding: '2.2rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1.5rem' }}>
          <div>
            <div style={{ fontSize: '0.85rem', color: '#38BDF8', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.3rem' }}>
              {t('platformTitle') || 'MemoMate Cognitive Companion'}
            </div>
            <h1 style={{ fontSize: '2.4rem', color: '#FFFFFF', fontWeight: 900, fontFamily: 'var(--font-heading)', margin: 0, lineHeight: 1.2 }}>
              {getGreetingTime()}, {userName}
            </h1>
            <p style={{ color: '#E2E8F0', fontSize: '1.15rem', marginTop: '0.4rem', margin: 0, fontWeight: 600 }}>
              {isAssessed ? (t('hereIsYourDay') || 'Here is your cognitive day with MemoMate.') : (t('letsUnderstandStarting') || "Let's establish your cognitive baseline profile today.")}
            </p>
          </div>

          {/* Large Primary Action Button */}
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <button
              onClick={handleStartPrimaryActivity}
              className="btn-primary"
              style={{
                padding: '1.1rem 2.2rem',
                fontSize: '1.15rem',
                borderRadius: '16px',
                boxShadow: '0 8px 25px rgba(2, 132, 199, 0.45)'
              }}
            >
              <Play size={24} />
              <span>
                {!isAssessed
                  ? (t('startBaseline') || 'START BASELINE ASSESSMENT')
                  : (t('startTodaysActivity') || "START TODAY'S ACTIVITY")}
              </span>
            </button>

            <button
              onClick={() => setVoiceModalOpen(true)}
              className="btn-secondary"
              style={{
                padding: '1.1rem 1.6rem',
                fontSize: '1.05rem',
                borderRadius: '16px',
                backgroundColor: 'rgba(52, 211, 153, 0.15)',
                borderColor: '#34D399',
                color: '#34D399'
              }}
            >
              <Mic size={22} color="#34D399" />
              <span>{t('talkToMemoMate') || 'Talk to MemoMate'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. Today's Activity Timeline Summary */}
      <div className="garden-card animate-fade-in">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
          <h2 style={{ fontSize: '1.3rem', color: '#FFFFFF', fontWeight: 800, margin: 0, fontFamily: 'var(--font-heading)' }}>
            {t('todaysSchedule') || "Today's Schedule & Reminders"}
          </h2>
          <button onClick={() => navigate('/my-day')} className="btn-secondary" style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}>
            <Calendar size={16} />
            <span>{t('viewFullSchedule') || 'VIEW FULL MY DAY SCHEDULE'}</span>
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
          {reminders.slice(0, 4).map((rem) => {
            const isDone = rem.status === 'completed';

            return (
              <div
                key={rem.id}
                style={{
                  backgroundColor: isDone ? 'rgba(52, 211, 153, 0.08)' : '#0D1117',
                  border: isDone ? '1px solid rgba(52, 211, 153, 0.3)' : '1px solid #263142',
                  borderRadius: '14px',
                  padding: '1rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.5rem'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '0.78rem', color: '#94A3B8', fontWeight: 700 }}>{rem.time}</span>
                  <span className={`badge ${isDone ? 'badge-green' : 'badge-cyan'}`}>
                    {isDone ? (t('completed') || 'Completed') : (t('pending') || 'Pending')}
                  </span>
                </div>
                <div style={{ fontSize: '1rem', fontWeight: 800, color: '#FFFFFF' }}>
                  {rem.title}
                </div>
                <div style={{ fontSize: '0.82rem', color: '#94A3B8' }}>
                  {rem.detail}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. AI Explainability Card */}
      <div className="garden-card animate-fade-in" style={{ backgroundColor: '#161C26', border: '1px solid #38BDF8' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.75rem' }}>
          <HelpCircle size={22} color="#38BDF8" />
          <h2 style={{ fontSize: '1.25rem', color: '#FFFFFF', fontWeight: 800, margin: 0, fontFamily: 'var(--font-heading)' }}>
            {t('whyMemoMateChoseThis') || 'Why did MemoMate choose this?'}
          </h2>
        </div>

        <p style={{ fontSize: '1.05rem', color: '#F8FAFC', lineHeight: 1.6, margin: '0 0 1rem' }}>
          {recommendation?.reason || `MemoMate analyzed your recent sessions and selected today's activity to strengthen your ${recommendation?.weakArea || 'attention'} skills.`}
        </p>

        <div style={{
          backgroundColor: '#0D1117',
          borderRadius: '12px',
          padding: '0.85rem 1.1rem',
          border: '1px solid #263142',
          fontSize: '0.85rem',
          color: '#94A3B8',
          display: 'flex',
          alignItems: 'center',
          gap: '0.6rem'
        }}>
          <Sparkles size={18} color="#38BDF8" />
          <span>Closed-Loop Adaptation: PLAY → RECORD PERFORMANCE → ANALYSE → WEAK AREA DETECTION → ADAPT DIFFICULTY</span>
        </div>
      </div>

      {/* 4. Cognitive Profile Metrics */}
      <div>
        <h2 style={{ fontSize: '1.3rem', marginBottom: '0.85rem', color: '#FFFFFF', fontWeight: 800, fontFamily: 'var(--font-heading)' }}>
          {t('cognitiveMetricsHeader') || 'Current Cognitive Performance Profile'}
        </h2>
        <CognitiveScoreCard
          onStartBaseline={() => navigate('/assessment?baseline=true')}
        />
      </div>

      {/* 5. Quick Links to My People & Garden */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: '1.5rem'
      }}>
        {/* Family Memories Shortcut */}
        <div className="garden-card animate-fade-in" style={{ cursor: 'pointer' }} onClick={() => navigate('/my-people')}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
            <div className="icon-box" style={{ width: 42, height: 42, borderRadius: '12px', backgroundColor: 'rgba(192, 132, 252, 0.15)', border: '1px solid rgba(192, 132, 252, 0.35)' }}>
              <Users size={22} color="#C084FC" />
            </div>
            <div>
              <h3 style={{ fontSize: '1.2rem', color: '#FFFFFF', fontWeight: 800, margin: 0, fontFamily: 'var(--font-heading)' }}>
                {t('myPeopleTitle') || 'My People & Family Memories'}
              </h3>
              <p style={{ color: '#94A3B8', fontSize: '0.85rem', margin: 0 }}>
                {t('myPeopleTitle')}
              </p>
            </div>
          </div>

          <button className="btn-secondary" style={{ width: 'fit-content', padding: '0.6rem 1.1rem', fontSize: '0.85rem', marginTop: '0.5rem' }}>
            <span>{t('myPeopleTitle') || 'OPEN FAMILY MEMORIES'}</span>
            <ArrowRight size={16} />
          </button>
        </div>

        {/* 3D Garden Preview */}
        <GardenPreview />
      </div>

      {/* Celebratory Reward Unlock Modal */}
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
