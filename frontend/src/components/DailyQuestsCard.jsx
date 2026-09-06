import React from 'react';
import { useAuth } from '../context/AuthContext';
import { soundFx } from '../utils/soundEffects';
import { Target, CheckCircle2, Sparkles, Gem, Gift } from 'lucide-react';

const DailyQuestsCard = () => {
  const { dailyQuests, claimQuestReward, t } = useAuth();

  const quests = dailyQuests || [
    { id: 'quest_1', title: 'Complete 2 Cognitive Missions', target: 2, current: 0, rewardXp: 50, rewardGems: 15, completed: false },
    { id: 'quest_2', title: 'Score over 80 in Focus Reflex', target: 1, current: 0, rewardXp: 75, rewardGems: 25, completed: false },
    { id: 'quest_3', title: 'Maintain your Daily Workout Streak', target: 1, current: 0, rewardXp: 40, rewardGems: 10, completed: false }
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
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div className="icon-box" style={{
            width: 44,
            height: 44,
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #C084FC 0%, #38BDF8 100%)',
            display: 'inline-flex',
            alignItems: 'center',
            justify: 'center'
          }}>
            <Target size={24} color="#0B0E14" />
          </div>
          <div>
            <h3 style={{ fontSize: '1.2rem', color: '#FFFFFF', fontWeight: 900, margin: 0, fontFamily: 'var(--font-heading)' }}>
              {t('dailyQuests').toUpperCase()}
            </h3>
            <div style={{ fontSize: '0.8rem', color: '#94A3B8', fontWeight: 700 }}>
              {t('resetsAtMidnight') || 'RESETS AT MIDNIGHT • EARN GEMS & XP'}
            </div>
          </div>
        </div>

        <span className="badge badge-purple">
          <Gift size={14} /> {completedCount} / {quests.length} {t('completed').toUpperCase()}
        </span>
      </div>

      {/* Quests List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
        {quests.map((q) => {
          const progressPercent = Math.min(100, Math.round((q.current / q.target) * 100));
          const questKeyMap = {
            'quest_1': 'quest1Title',
            'quest_2': 'quest2Title',
            'quest_3': 'quest3Title'
          };
          const questTitle = t(questKeyMap[q.id]) || q.title;

          return (
            <div
              key={q.id}
              style={{
                backgroundColor: q.completed ? 'rgba(52, 211, 153, 0.05)' : '#0B0E14',
                border: q.completed ? '1px solid rgba(52, 211, 153, 0.3)' : '1px solid #263142',
                borderRadius: '14px',
                padding: '1rem 1.2rem',
                display: 'flex',
                alignItems: 'center',
                justify: 'space-between',
                gap: '1rem',
                flexWrap: 'wrap'
              }}
            >
              <div style={{ flex: 1, minWidth: 200 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                  <span style={{ fontWeight: 800, color: q.completed ? '#94A3B8' : '#FFFFFF', fontSize: '0.92rem' }}>
                    {questTitle}
                  </span>
                  <span style={{ fontSize: '0.85rem', fontWeight: 800, color: q.completed ? '#34D399' : '#38BDF8' }}>
                    {q.current} / {q.target}
                  </span>
                </div>

                {/* Progress Bar */}
                <div style={{
                  width: '100%',
                  height: '8px',
                  backgroundColor: '#161C26',
                  borderRadius: '9999px',
                  overflow: 'hidden'
                }}>
                  <div style={{
                    width: `${progressPercent}%`,
                    height: '100%',
                    background: q.completed ? 'linear-gradient(90deg, #34D399 0%, #38BDF8 100%)' : 'linear-gradient(90deg, #38BDF8 0%, #FBBF24 100%)',
                    borderRadius: '9999px',
                    transition: 'width 0.3s ease'
                  }} />
                </div>

                {/* Reward Badges */}
                <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#FBBF24', display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                    <Sparkles size={13} /> +{q.rewardXp} XP
                  </span>
                  <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#38BDF8', display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                    <Gem size={13} fill="#38BDF8" /> +{q.rewardGems} GEMS
                  </span>
                </div>
              </div>

              {q.completed ? (
                <div style={{
                  backgroundColor: 'rgba(52, 211, 153, 0.15)',
                  color: '#34D399',
                  border: '1px solid rgba(52, 211, 153, 0.4)',
                  padding: '0.45rem 0.9rem',
                  borderRadius: '10px',
                  fontSize: '0.8rem',
                  fontWeight: 800,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.35rem'
                }}>
                  <CheckCircle2 size={16} />
                  {t('completed').toUpperCase()}
                </div>
              ) : (
                <button
                  onClick={() => handleClaim(q.id)}
                  className="btn-flame"
                  style={{ padding: '0.45rem 1rem', fontSize: '0.8rem' }}
                >
                  {t('claimReward')}
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
