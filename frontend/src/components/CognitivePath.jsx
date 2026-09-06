import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { soundFx } from '../utils/soundEffects';
import { CheckCircle2, Target, Clock, Lock, ArrowDown, MapPin } from 'lucide-react';

const CognitivePath = ({ recommendation }) => {
  const { t } = useAuth();
  const targetActivity = recommendation?.recommendedActivity || t('reactionTestTitle') || 'Reaction Speed Test ⚡';

  const steps = [
    {
      title: t('memoryMatchTitle') || '3D Memory Match 🎨',
      status: 'completed',
      category: t('memoryScore') || 'Memory',
      badgeText: (t('completed') || 'COMPLETED').toUpperCase(),
      desc: t('sessionCompletedToday') || 'Score: 85 / 100 — Session completed earlier today',
      route: '/assessment?game=memory'
    },
    {
      title: targetActivity,
      status: 'current',
      category: recommendation?.weakArea || 'Attention',
      badgeText: (t('currentFocusMission') || 'CURRENT FOCUS MISSION').toUpperCase(),
      desc: t('recommendedMissionDesc') || 'Recommended next battle mission based on AI telemetry',
      route: '/assessment?game=attention'
    },
    {
      title: t('numberRecallTitle') || 'Number Recall 🔢',
      status: 'next',
      category: t('recallScore') || 'Recall',
      badgeText: (t('nextStage') || 'NEXT STAGE').toUpperCase(),
      desc: t('seqMemoryDesc') || 'Sequence memory recall exercise',
      route: '/assessment?game=number'
    },
    {
      title: t('patternRecallTitle') || 'Pattern Recall 🧩',
      status: 'upcoming',
      category: t('patternMemory') || 'Pattern Memory',
      badgeText: (t('upcomingStage') || 'UPCOMING STAGE').toUpperCase(),
      desc: t('gridSpatialDesc') || 'Grid spatial visualization challenge',
      route: '/assessment?game=pattern'
    }
  ];

  return (
    <div className="garden-card animate-fade-in">
      <div className="garden-card-header" style={{ flexWrap: 'wrap', gap: '0.75rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          <MapPin size={22} color="#00F2FE" />
          <div>
            <h3 style={{ fontSize: '1.25rem', color: '#F8FAFC', fontWeight: 900, fontFamily: 'var(--font-heading)' }}>
              {t('battlePathTitle') || 'BATTLE PATH ROADMAP'}
            </h3>
            <p style={{ fontSize: '0.8rem', color: '#94A3B8', fontWeight: 700 }}>
              {t('battlePathSub') || 'YOUR COGNITIVE SEQUENCE ADAPTS DYNAMICALLY TO REAL-TIME SCORES'}
            </p>
          </div>
        </div>
        <Link 
          to="/path" 
          onClick={() => soundFx.playClick()}
          style={{ color: '#00F2FE', fontWeight: 800, fontFamily: 'var(--font-heading)', fontSize: '0.85rem', textDecoration: 'none' }}
        >
          {t('fullRoadmap') || 'FULL ROADMAP →'}
        </Link>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', position: 'relative' }}>
        {steps.map((step, idx) => {
          const isCurrent = step.status === 'current';
          const isCompleted = step.status === 'completed';

          return (
            <React.Fragment key={step.title + idx}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '1.25rem',
                backgroundColor: isCurrent ? 'rgba(255, 78, 80, 0.12)' : isCompleted ? 'rgba(0, 230, 118, 0.08)' : 'rgba(255, 255, 255, 0.03)',
                border: isCurrent ? '1px solid #FF4E50' : isCompleted ? '1px solid rgba(0, 230, 118, 0.4)' : '1px solid rgba(255, 255, 255, 0.1)',
                padding: '1.2rem 1.4rem',
                borderRadius: '18px',
                boxShadow: isCurrent ? '0 0 25px rgba(255, 78, 80, 0.3)' : 'none',
                transition: 'all 0.25s ease'
              }}>
                <div style={{
                  width: 46,
                  height: 46,
                  borderRadius: '12px',
                  background: isCompleted ? 'linear-gradient(135deg, #00E676 0%, #00F2FE 100%)' : isCurrent ? 'linear-gradient(135deg, #FF4E50 0%, #FFD700 100%)' : 'rgba(255, 255, 255, 0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justify: 'center',
                  flexShrink: 0,
                  boxShadow: isCurrent ? '0 0 15px rgba(255, 78, 80, 0.5)' : 'none'
                }}>
                  {isCompleted && <CheckCircle2 size={24} color="#050B14" />}
                  {isCurrent && <Target size={24} color="#050B14" />}
                  {step.status === 'next' && <Clock size={22} color="#00F2FE" />}
                  {step.status === 'upcoming' && <Lock size={20} color="#94A3B8" />}
                </div>

                <div style={{ flex: '1 1 200px', minWidth: '180px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.2rem', flexWrap: 'wrap' }}>
                    <span style={{ fontSize: '1.15rem', fontWeight: 900, color: '#F8FAFC', fontFamily: 'var(--font-heading)' }}>
                      {step.title}
                    </span>
                    <span className={`badge ${isCompleted ? 'badge-sage' : isCurrent ? 'badge-flame' : 'badge-cyan'}`}>
                      {step.badgeText}
                    </span>
                  </div>
                  <div style={{ fontSize: '0.88rem', color: '#94A3B8', fontWeight: 600 }}>
                    {step.desc}
                  </div>
                </div>

                {isCurrent && (
                  <Link 
                    to={step.route} 
                    onClick={() => soundFx.playLevelUp()}
                    className="btn-flame" 
                    style={{ padding: '0.6rem 1.25rem', fontSize: '0.85rem', textDecoration: 'none', whiteSpace: 'nowrap', flexShrink: 0, marginLeft: 'auto' }}
                  >
                    {t('playMission') || 'PLAY MISSION'}
                  </Link>
                )}
              </div>

              {idx < steps.length - 1 && (
                <div style={{ display: 'flex', justifyContent: 'center', margin: '-0.4rem 0' }}>
                  <ArrowDown size={20} color={isCurrent ? '#FF4E50' : '#00F2FE'} />
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};

export default CognitivePath;
