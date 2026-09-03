import React from 'react';
import { useAuth } from '../context/AuthContext';
import { soundFx } from '../utils/soundEffects';
import { Target, CheckCircle2, Sparkles, Gem, Gift } from 'lucide-react';

const DailyQuestsCard = () => {
  const { dailyQuests, claimQuestReward } = useAuth();

  const quests = dailyQuests || [
    { id: 'quest_1', title: 'Complete 2 Cognitive Sessions', target: 2, current: 1, rewardXp: 50, rewardGems: 15, completed: false },
    { id: 'quest_2', title: 'Score over 80 in 3D Focus Search', target: 1, current: 1, rewardXp: 75, rewardGems: 25, completed: true },
    { id: 'quest_3', title: 'Maintain your Daily Workout Streak', target: 1, current: 1, rewardXp: 40, rewardGems: 10, completed: true }
  ];

  const handleClaim = (questId) => {
    soundFx.playQuestClaim();
    if (claimQuestReward) {
      claimQuestReward(questId);
    }
  };

  const completedCount = quests.filter(q => q.completed).length;

  return (
    <div className="garden-card animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{
            width: 44,
            height: 44,
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #A855F7 0%, #00F2FE 100%)',
            display: 'flex',
            alignItems: 'center',
            justify: 'center',
            boxShadow: '0 0 15px rgba(168, 85, 247, 0.4)'
          }}>
            <Target size={24} color="#050B14" />
          </div>
          <div>
            <h3 style={{ fontSize: '1.25rem', color: '#F8FAFC', fontWeight: 900, margin: 0, fontFamily: 'var(--font-heading)' }}>
              DAILY BATTLE MISSIONS
            </h3>
            <div style={{ fontSize: '0.8rem', color: '#94A3B8', fontWeight: 700 }}>
              RESETS AT MIDNIGHT • EARN GEMS & BATTLE XP
            </div>
          </div>
        </div>

        <span className="badge badge-purple">
          <Gift size={14} /> {completedCount} / {quests.length} CLAIMED
        </span>
      </div>

      {/* Quests List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
        {quests.map((q) => {
          const progressPercent = Math.min(100, Math.round((q.current / q.target) * 100));

          return (
            <div
              key={q.id}
              style={{
                backgroundColor: q.completed ? 'rgba(255, 255, 255, 0.02)' : 'rgba(255, 255, 255, 0.05)',
                border: q.completed ? '1px solid rgba(0, 230, 118, 0.3)' : '1px solid rgba(0, 242, 254, 0.2)',
                borderRadius: '14px',
                padding: '1rem 1.2rem',
                display: 'flex',
                alignItems: 'center',
                justify: 'space-between',
                gap: '1rem',
                transition: 'all 0.2s ease'
              }}
            >
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                  <span style={{ fontWeight: 800, color: q.completed ? '#94A3B8' : '#F8FAFC', fontSize: '0.95rem' }}>
                    {q.title}
                  </span>
                  <span style={{ fontSize: '0.85rem', fontWeight: 800, fontFamily: 'var(--font-esports)', color: q.completed ? '#00E676' : '#00F2FE' }}>
                    {q.current} / {q.target}
                  </span>
                </div>

                {/* Progress Bar */}
                <div style={{
                  width: '100%',
                  height: '8px',
                  backgroundColor: 'rgba(0, 0, 0, 0.5)',
                  borderRadius: '9999px',
                  overflow: 'hidden'
                }}>
                  <div style={{
                    width: `${progressPercent}%`,
                    height: '100%',
                    background: q.completed ? 'linear-gradient(90deg, #00E676 0%, #00F2FE 100%)' : 'linear-gradient(90deg, #00F2FE 0%, #FFD700 100%)',
                    borderRadius: '9999px',
                    boxShadow: q.completed ? '0 0 10px rgba(0, 230, 118, 0.6)' : '0 0 10px rgba(0, 242, 254, 0.6)',
                    transition: 'width 0.5s ease'
                  }} />
                </div>

                {/* Reward Badges */}
                <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#FFD700', display: 'flex', alignItems: 'center', gap: '0.25rem', fontFamily: 'var(--font-esports)' }}>
                    <Sparkles size={13} /> +{q.rewardXp} XP
                  </span>
                  <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#00F2FE', display: 'flex', alignItems: 'center', gap: '0.25rem', fontFamily: 'var(--font-esports)' }}>
                    <Gem size={13} fill="#00F2FE" /> +{q.rewardGems} GEMS
                  </span>
                </div>
              </div>

              {q.completed ? (
                <div style={{
                  backgroundColor: 'rgba(0, 230, 118, 0.15)',
                  color: '#00E676',
                  border: '1px solid rgba(0, 230, 118, 0.4)',
                  padding: '0.45rem 0.9rem',
                  borderRadius: '10px',
                  fontSize: '0.8rem',
                  fontWeight: 800,
                  fontFamily: 'var(--font-esports)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.35rem'
                }}>
                  <CheckCircle2 size={16} />
                  COMPLETED
                </div>
              ) : (
                <button
                  onClick={() => handleClaim(q.id)}
                  className="btn-flame"
                  style={{ padding: '0.45rem 1rem', fontSize: '0.8rem' }}
                >
                  CLAIM
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default DailyQuestsCard;
