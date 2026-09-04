import React from 'react';
import { useAuth } from '../context/AuthContext';
import { soundFx } from '../utils/soundEffects';
import { Flame, ShieldCheck, Zap } from 'lucide-react';

const StreakTracker = () => {
  const { streak, highestStreak, todayStr, lastCheckin, completeDailyStreakCheckin, t } = useAuth();
  const isCheckedInToday = lastCheckin === todayStr && streak > 0;

  const currentDayIndex = new Date().getDay(); // 0 = Sun, 1 = Mon, ...
  const daysOfWeek = [
    { day: 'M', full: 'MON', idx: 1 },
    { day: 'T', full: 'TUE', idx: 2 },
    { day: 'W', full: 'WED', idx: 3 },
    { day: 'T', full: 'THU', idx: 4 },
    { day: 'F', full: 'FRI', idx: 5 },
    { day: 'S', full: 'SAT', idx: 6 },
    { day: 'S', full: 'SUN', idx: 0 }
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
          <div className="icon-box" style={{
            width: 44,
            height: 44,
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #FB923C 0%, #FBBF24 100%)',
            display: 'inline-flex',
            alignItems: 'center',
            justify: 'center'
          }}>
            <Flame size={26} fill="#0B0E14" color="#0B0E14" />
          </div>
          <div>
            <h3 style={{ fontSize: '1.2rem', color: '#FFFFFF', fontWeight: 900, margin: 0, fontFamily: 'var(--font-heading)' }}>
              DAILY STREAK ARENA
            </h3>
            <div style={{ fontSize: '0.8rem', color: '#94A3B8', fontWeight: 700 }}>
              {t('streakCount').toUpperCase()}: <strong style={{ color: '#FB923C' }}>{streak || 0} DAYS</strong> | BEST: <strong style={{ color: '#FBBF24' }}>{highestStreak || 0} DAYS</strong>
            </div>
          </div>
        </div>

        {/* Streak Protection Badge */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.4rem',
          backgroundColor: 'rgba(56, 189, 248, 0.12)',
          border: '1px solid rgba(56, 189, 248, 0.35)',
          padding: '0.45rem 0.85rem',
          borderRadius: '10px',
          fontSize: '0.8rem',
          fontWeight: 800,
          fontFamily: 'var(--font-heading)',
          color: '#38BDF8'
        }}>
          <ShieldCheck size={16} color="#38BDF8" />
          <span>STREAK SHIELD ACTIVE</span>
        </div>
      </div>

      {/* 7-Day Mon-Sun Dynamic Check-in Calendar */}
      <div>
        <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#FFFFFF', marginBottom: '0.75rem', display: 'flex', justifyContent: 'space-between' }}>
          <span>WEEKLY CHECKIN CALENDAR</span>
          <span style={{ color: isCheckedInToday ? '#34D399' : '#FB923C' }}>
            {isCheckedInToday ? t('alreadyChecked') : t('checkinToday')}
          </span>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(7, 1fr)',
          gap: '0.6rem',
          textAlign: 'center'
        }}>
          {daysOfWeek.map((d, i) => {
            const isToday = d.idx === currentDayIndex;
            const isCompleted = isToday ? isCheckedInToday : (streak > 0 && d.idx < currentDayIndex);

            return (
              <div key={i} style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '0.4rem'
              }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 800, color: isToday ? '#FB923C' : '#94A3B8' }}>
                  {d.full}
                </span>
                <div style={{
                  width: '100%',
                  aspectRatio: '1',
                  maxHeight: '48px',
                  borderRadius: '12px',
                  backgroundColor: isCompleted ? 'rgba(251, 146, 60, 0.15)' : (isToday ? 'rgba(56, 189, 248, 0.1)' : '#0B0E14'),
                  border: isCompleted ? '1px solid #FB923C' : (isToday ? '1px dashed #38BDF8' : '1px solid #263142'),
                  display: 'flex',
                  alignItems: 'center',
                  justify: 'center'
                }}>
                  {isCompleted ? (
                    <Flame size={20} fill="#FB923C" color="#FB923C" />
                  ) : (
                    <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#64748B' }}>{d.day}</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* XP Boost Banner */}
      <div style={{
        backgroundColor: 'rgba(52, 211, 153, 0.1)',
        border: '1px solid rgba(52, 211, 153, 0.3)',
        borderRadius: '14px',
        padding: '0.85rem 1.1rem',
        display: 'flex',
        alignItems: 'center',
        justify: 'space-between',
        gap: '0.75rem',
        flexWrap: 'wrap'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <Zap size={20} color="#34D399" fill="#34D399" />
          <div style={{ fontSize: '0.85rem', color: '#FFFFFF', fontWeight: 700 }}>
            <strong style={{ color: '#34D399' }}>1.25x XP MULTIPLIER ACTIVE!</strong> Play daily exercises to maintain your streak.
          </div>
        </div>

        <button
          onClick={handleCheckin}
          disabled={isCheckedInToday}
          className={isCheckedInToday ? "btn-secondary" : "btn-flame"}
          style={{ padding: '0.45rem 0.95rem', fontSize: '0.8rem', whiteSpace: 'nowrap' }}
        >
          {isCheckedInToday ? 'CHECKED IN TODAY ✓' : 'RECORD DAILY CHECKIN'}
        </button>
      </div>
    </div>
  );
};

export default StreakTracker;
