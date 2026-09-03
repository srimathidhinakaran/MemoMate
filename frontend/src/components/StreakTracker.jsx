import React from 'react';
import { useAuth } from '../context/AuthContext';
import { soundFx } from '../utils/soundEffects';
import { Flame, ShieldCheck, Zap, CheckCircle2, Award, Info } from 'lucide-react';

const StreakTracker = () => {
  const { streak, highestStreak, streakFreeze, completeDailyStreakCheckin } = useAuth();

  const daysOfWeek = [
    { day: 'M', full: 'MON', active: true },
    { day: 'T', full: 'TUE', active: true },
    { day: 'W', full: 'WED', active: true },
    { day: 'T', full: 'THU', active: true },
    { day: 'F', full: 'FRI', active: true },
    { day: 'S', full: 'SAT', active: false, isToday: true },
    { day: 'S', full: 'SUN', active: false }
  ];

  const handleCheckin = () => {
    soundFx.playQuestClaim();
    if (completeDailyStreakCheckin) {
      completeDailyStreakCheckin();
    }
  };

  return (
    <div className="garden-card animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {/* Card Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{
            width: 44,
            height: 44,
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #FF4E50 0%, #FFD700 100%)',
            display: 'flex',
            alignItems: 'center',
            justify: 'center',
            boxShadow: '0 0 15px rgba(255, 78, 80, 0.4)'
          }}>
            <Flame size={26} fill="#050B14" color="#050B14" />
          </div>
          <div>
            <h3 style={{ fontSize: '1.25rem', color: '#F8FAFC', fontWeight: 900, margin: 0, fontFamily: 'var(--font-heading)' }}>
              DAILY STREAK ARENA
            </h3>
            <div style={{ fontSize: '0.8rem', color: '#94A3B8', fontWeight: 700 }}>
              PERSONAL BEST: <strong style={{ color: '#FF4E50', fontFamily: 'var(--font-esports)' }}>{highestStreak || 12} DAYS</strong>
            </div>
          </div>
        </div>

        {/* Streak Freeze Badge */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.4rem',
          backgroundColor: 'rgba(0, 242, 254, 0.12)',
          border: '1px solid rgba(0, 242, 254, 0.3)',
          padding: '0.45rem 0.85rem',
          borderRadius: '10px',
          fontSize: '0.8rem',
          fontWeight: 800,
          fontFamily: 'var(--font-esports)',
          color: '#00F2FE'
        }}>
          <ShieldCheck size={16} color="#00F2FE" />
          <span>SHIELD PROTECTED</span>
        </div>
      </div>

      {/* 7-Day Mon-Sun Check-in Calendar */}
      <div>
        <div style={{ fontSize: '0.85rem', fontWeight: 800, fontFamily: 'var(--font-esports)', color: '#F8FAFC', marginBottom: '0.75rem', display: 'flex', justifyContent: 'space-between' }}>
          <span>WEEKLY BATTLE CALENDAR</span>
          <span style={{ color: '#00E676' }}>5/7 DAYS COMPLETE</span>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(7, 1fr)',
          gap: '0.6rem',
          textAlign: 'center'
        }}>
          {daysOfWeek.map((d, idx) => (
            <div key={idx} style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '0.4rem'
            }}>
              <span style={{ fontSize: '0.72rem', fontWeight: 800, fontFamily: 'var(--font-esports)', color: d.isToday ? '#FF4E50' : '#94A3B8' }}>
                {d.full}
              </span>
              <div style={{
                width: '100%',
                aspectRatio: '1',
                maxHeight: '48px',
                borderRadius: '12px',
                backgroundColor: d.active ? 'rgba(255, 78, 80, 0.15)' : (d.isToday ? 'rgba(0, 242, 254, 0.1)' : 'rgba(255, 255, 255, 0.04)'),
                border: d.active ? '1px solid #FF4E50' : (d.isToday ? '1px dashed #00F2FE' : '1px solid rgba(255, 255, 255, 0.1)'),
                display: 'flex',
                alignItems: 'center',
                justify: 'center',
                boxShadow: d.active ? '0 0 12px rgba(255, 78, 80, 0.3)' : 'none',
                transition: 'all 0.2s ease'
              }}>
                {d.active ? (
                  <Flame size={20} fill="#FF4E50" color="#FF4E50" />
                ) : (
                  <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#64748B', fontFamily: 'var(--font-esports)' }}>{d.day}</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* XP Boost Banner */}
      <div style={{
        backgroundColor: 'rgba(0, 230, 118, 0.1)',
        border: '1px solid rgba(0, 230, 118, 0.3)',
        borderRadius: '14px',
        padding: '0.85rem 1.1rem',
        display: 'flex',
        alignItems: 'center',
        justify: 'space-between',
        gap: '0.75rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <Zap size={20} color="#00E676" fill="#00E676" />
          <div style={{ fontSize: '0.88rem', color: '#F8FAFC', fontWeight: 700 }}>
            <strong style={{ color: '#00E676', fontFamily: 'var(--font-esports)' }}>1.25x XP MULTIPLIER ACTIVE!</strong> Play daily for streak bonuses.
          </div>
        </div>

        <button
          onClick={handleCheckin}
          className="btn-primary"
          style={{ padding: '0.45rem 0.95rem', fontSize: '0.8rem', whiteSpace: 'nowrap' }}
        >
          CHECK IN TODAY
        </button>
      </div>
    </div>
  );
};

export default StreakTracker;
