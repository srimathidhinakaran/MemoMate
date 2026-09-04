import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { soundFx } from '../utils/soundEffects';
import { Sun, Sunset, Moon, Sparkles, Flame, Trophy, Clock, Crown } from 'lucide-react';

const DynamicGreetingHero = () => {
  const { user, streak, xpPoints, level, league, t } = useAuth();
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const hours = time.getHours();

  let greetingConfig = {
    title: t('goodMorning'),
    icon: Sun,
    badgeText: t('morningSessionActive'),
    subtext: t('morningSessionSub'),
    neonColor: '#38BDF8'
  };

  if (hours >= 12 && hours < 17) {
    greetingConfig = {
      title: t('goodAfternoon'),
      icon: Sun,
      badgeText: t('afternoonSessionActive'),
      subtext: t('afternoonSessionSub'),
      neonColor: '#FBBF24'
    };
  } else if (hours >= 17 && hours < 22) {
    greetingConfig = {
      title: t('goodEvening'),
      icon: Sunset,
      badgeText: t('eveningSessionActive'),
      subtext: t('eveningSessionSub'),
      neonColor: '#C084FC'
    };
  } else if (hours < 5 || hours >= 22) {
    greetingConfig = {
      title: t('goodNight'),
      icon: Moon,
      badgeText: t('nightSessionActive'),
      subtext: t('nightSessionSub'),
      neonColor: '#34D399'
    };
  }

  const timeFormatted = time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  const dateFormatted = time.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' });

  // XP Progress Calculation per Level (300 XP per Level)
  const nextLevelXp = 300;
  const currentXpInLevel = (xpPoints || 0) % 300;
  const progressPercent = Math.min(100, Math.round((currentXpInLevel / nextLevelXp) * 100));

  return (
    <div style={{
      background: 'linear-gradient(135deg, #161C26 0%, #0B0E14 100%)',
      borderRadius: '24px',
      padding: '2rem 2.4rem',
      border: '1px solid rgba(56, 189, 248, 0.3)',
      boxShadow: '0 0 40px rgba(56, 189, 248, 0.15)',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Background Animated Neon Beam */}
      <div style={{
        position: 'absolute',
        top: 0,
        right: 0,
        width: '400px',
        height: '100%',
        background: `radial-gradient(circle at 80% 20%, ${greetingConfig.neonColor}15 0%, transparent 70%)`,
        pointerEvents: 'none'
      }} />

      <div style={{
        display: 'flex',
        alignItems: 'center',
        justify: 'space-between',
        flexWrap: 'wrap',
        gap: '1.8rem',
        position: 'relative',
        zIndex: 1
      }}>
        {/* Left Section: Hero Player Profile & Greeting */}
        <div style={{ flex: '1 1 500px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.8rem' }}>
            <div 
              onClick={() => soundFx.playClick()}
              style={{
                width: 60,
                height: 60,
                borderRadius: '16px',
                background: 'linear-gradient(135deg, #FBBF24 0%, #FB923C 100%)',
                padding: '2px',
                cursor: 'pointer'
              }}
            >
              <div className="icon-box" style={{
                width: '100%',
                height: '100%',
                backgroundColor: '#0B0E14',
                borderRadius: '14px',
                display: 'inline-flex',
                alignItems: 'center',
                justify: 'center'
              }}>
                <Crown size={32} color="#FBBF24" />
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.2rem', flexWrap: 'wrap' }}>
                <span className="badge badge-gold">
                  <Crown size={14} /> {t('activeMember')}
                </span>
                <span className="badge badge-cyan">
                  <Sparkles size={14} /> {greetingConfig.badgeText}
                </span>
              </div>
              <h1 style={{
                fontSize: '2.2rem',
                color: '#FFFFFF',
                fontWeight: 900,
                margin: 0,
                fontFamily: 'var(--font-heading)',
                letterSpacing: '-0.02em'
              }}>
                {greetingConfig.title}, <span style={{ color: '#38BDF8' }}>{user?.name || 'Player'}</span>
              </h1>
            </div>
          </div>

          <p style={{ color: '#94A3B8', fontSize: '1rem', maxWidth: '640px', lineHeight: 1.5, marginBottom: '1.2rem' }}>
            {greetingConfig.subtext}
          </p>

          {/* Daily Goal Level Progress Bar */}
          <div style={{
            backgroundColor: '#222B3B',
            border: '1px solid #263142',
            borderRadius: '14px',
            padding: '0.85rem 1.2rem',
            maxWidth: '560px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
              <span style={{ fontSize: '0.82rem', fontWeight: 800, color: '#FBBF24', textTransform: 'uppercase' }}>
                {t('dailyGoalTier')} {level || 1} {t('progress')}
              </span>
              <span style={{ fontSize: '0.82rem', fontWeight: 800, color: '#38BDF8' }}>
                {currentXpInLevel} / {nextLevelXp} XP ({progressPercent}%)
              </span>
            </div>

            {/* Glowing Progress Track */}
            <div style={{
              width: '100%',
              height: '10px',
              backgroundColor: '#0B0E14',
              borderRadius: '9999px',
              overflow: 'hidden',
              position: 'relative'
            }}>
              <div style={{
                width: `${progressPercent}%`,
                height: '100%',
                background: 'linear-gradient(90deg, #38BDF8 0%, #FBBF24 100%)',
                borderRadius: '9999px',
                transition: 'width 0.5s ease-out'
              }} />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '0.45rem', fontSize: '0.78rem', color: '#94A3B8', fontWeight: 700 }}>
              <span>{t('currentReward')}</span>
              <span style={{ color: '#FB923C' }}>{t('nextTier')}</span>
            </div>
          </div>
        </div>

        {/* Right Section: Daily Program Timer */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-end',
          gap: '1rem'
        }}>
          {/* Daily Program Clock */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            backgroundColor: 'rgba(56, 189, 248, 0.12)',
            border: '1px solid rgba(56, 189, 248, 0.35)',
            padding: '0.65rem 1.25rem',
            borderRadius: '14px'
          }}>
            <Clock size={18} color="#38BDF8" />
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '0.7rem', color: '#94A3B8', fontWeight: 800, letterSpacing: '0.05em' }}>
                {t('dailyProgram')}
              </div>
              <div style={{ fontSize: '0.95rem', fontWeight: 800, color: '#FFFFFF' }}>
                {timeFormatted} <span style={{ color: '#38BDF8' }}>•</span> {dateFormatted}
              </div>
            </div>
          </div>

          {/* Gaming Status Counters */}
          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', justifyContent: 'flex-end' }}>
            <div style={{
              backgroundColor: 'rgba(251, 146, 60, 0.12)',
              border: '1px solid rgba(251, 146, 60, 0.4)',
              padding: '0.6rem 1rem',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              color: '#FB923C',
              fontWeight: 800,
              fontSize: '0.85rem'
            }}>
              <Flame size={20} fill="#FB923C" />
              <div>
                <div style={{ fontSize: '0.65rem', color: '#94A3B8' }}>{t('streak').toUpperCase()}</div>
                <div>{streak ?? 0} {t('days') || 'DAYS'}</div>
              </div>
            </div>

            <div style={{
              backgroundColor: 'rgba(251, 191, 36, 0.12)',
              border: '1px solid rgba(251, 191, 36, 0.4)',
              padding: '0.6rem 1rem',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              color: '#FBBF24',
              fontWeight: 800,
              fontSize: '0.85rem'
            }}>
              <Trophy size={20} color="#FBBF24" />
              <div>
                <div style={{ fontSize: '0.65rem', color: '#94A3B8' }}>{t('league')}</div>
                <div>{league ? league.toUpperCase() : 'EMERALD LEAGUE'}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DynamicGreetingHero;
