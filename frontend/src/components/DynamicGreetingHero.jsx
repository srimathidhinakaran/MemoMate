import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { soundFx } from '../utils/soundEffects';
import { Sun, Sunset, Moon, Sparkles, Flame, Gem, Trophy, Clock, Calendar, ShieldCheck, Zap, Crown, Target, ChevronRight } from 'lucide-react';

const DynamicGreetingHero = () => {
  const { user, streak, gems, xpPoints, level, levelTitle, league } = useAuth();
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const hours = time.getHours();

  let greetingConfig = {
    title: 'Morning Warfare',
    icon: Sun,
    badgeText: 'MORNING ARENA ACTIVE',
    subtext: 'Peak mental acuity window. Execute short-term memory drills and 3D spatial focus missions.',
    neonColor: '#00F2FE'
  };

  if (hours >= 12 && hours < 17) {
    greetingConfig = {
      title: 'Afternoon Ops',
      icon: Sun,
      badgeText: 'PEAK MIND PERFORMANCE',
      subtext: 'Sustain maximum processing speed with mid-day 3D target search and reaction challenges.',
      neonColor: '#FFD700'
    };
  } else if (hours >= 17 && hours < 22) {
    greetingConfig = {
      title: 'Evening Mission',
      icon: Sunset,
      badgeText: 'EVENING RECALL SESSION',
      subtext: 'Unwind with pattern recall, memory garden expansion, and strategic puzzle battles.',
      neonColor: '#A855F7'
    };
  } else if (hours < 5 || hours >= 22) {
    greetingConfig = {
      title: 'Night Recovery',
      icon: Moon,
      badgeText: 'MEMORY CONSOLIDATION',
      subtext: 'Rest supports neural synaptic consolidation. Outstanding cognitive progress completed today!',
      neonColor: '#FF4E50'
    };
  }

  const IconComponent = greetingConfig.icon;
  const timeFormatted = time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  const dateFormatted = time.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' });

  // XP Progress Calculation for Level 3 -> Level 4 (850 / 1000)
  const nextLevelXp = 1000;
  const currentXpInLevel = xpPoints || 850;
  const progressPercent = Math.min(100, Math.round((currentXpInLevel / nextLevelXp) * 100));

  return (
    <div style={{
      background: 'linear-gradient(135deg, rgba(15, 20, 36, 0.95) 0%, rgba(9, 12, 21, 0.98) 100%)',
      borderRadius: '24px',
      padding: '2rem 2.4rem',
      border: '1px solid rgba(0, 242, 254, 0.3)',
      boxShadow: '0 0 40px rgba(0, 242, 254, 0.15)',
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
            {/* Animated Rank Crest */}
            <div 
              onClick={() => soundFx.playClick()}
              style={{
                width: 64,
                height: 64,
                borderRadius: '16px',
                background: 'linear-gradient(135deg, #FFD700 0%, #FF4E50 100%)',
                padding: '2px',
                boxShadow: '0 0 25px rgba(255, 215, 0, 0.5)',
                cursor: 'pointer'
              }}
            >
              <div style={{
                width: '100%',
                height: '100%',
                backgroundColor: '#090C15',
                borderRadius: '14px',
                display: 'flex',
                alignItems: 'center',
                justify: 'center'
              }}>
                <Crown size={34} color="#FFD700" />
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.2rem' }}>
                <span className="badge badge-gold">
                  <Crown size={14} /> HEROIC RANK
                </span>
                <span className="badge badge-cyan">
                  <Sparkles size={14} /> {greetingConfig.badgeText}
                </span>
              </div>
              <h1 style={{
                fontSize: '2.4rem',
                color: '#F8FAFC',
                fontWeight: 900,
                margin: 0,
                fontFamily: 'var(--font-heading)',
                letterSpacing: '-0.02em'
              }}>
                {greetingConfig.title}, <span style={{ color: '#00F2FE' }}>{user?.name || 'Player'}</span>
              </h1>
            </div>
          </div>

          <p style={{ color: '#94A3B8', fontSize: '1.05rem', maxWidth: '640px', lineHeight: 1.5, marginBottom: '1.2rem' }}>
            {greetingConfig.subtext}
          </p>

          {/* Battle Pass XP Level Progress HUD Bar */}
          <div style={{
            backgroundColor: 'rgba(255, 255, 255, 0.04)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '14px',
            padding: '0.85rem 1.2rem',
            maxWidth: '560px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 800, fontFamily: 'var(--font-esports)', color: '#FFD700', textTransform: 'uppercase' }}>
                BATTLE PASS TIER {level || 3} PROGRESS
              </span>
              <span style={{ fontSize: '0.85rem', fontWeight: 800, fontFamily: 'var(--font-esports)', color: '#00F2FE' }}>
                {currentXpInLevel} / {nextLevelXp} XP ({progressPercent}%)
              </span>
            </div>

            {/* Glowing Progress Track */}
            <div style={{
              width: '100%',
              height: '10px',
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              borderRadius: '9999px',
              overflow: 'hidden',
              position: 'relative'
            }}>
              <div style={{
                width: `${progressPercent}%`,
                height: '100%',
                background: 'linear-gradient(90deg, #00F2FE 0%, #FFD700 100%)',
                borderRadius: '9999px',
                boxShadow: '0 0 15px rgba(0, 242, 254, 0.8)',
                transition: 'width 0.8s ease-out'
              }} />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '0.45rem', fontSize: '0.8rem', color: '#64748B', fontWeight: 700 }}>
              <span>CURRENT REWARD: 🌸 CYBER SUNFLOWER</span>
              <span style={{ color: '#FF4E50' }}>NEXT TIER: 👑 HEROIC CRYSTAL (+150 GEMS)</span>
            </div>
          </div>
        </div>

        {/* Right Section: Season 1 Timer & Battle Counters */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-end',
          gap: '1rem'
        }}>
          {/* Season Countdown Clock */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            backgroundColor: 'rgba(0, 242, 254, 0.08)',
            border: '1px solid rgba(0, 242, 254, 0.3)',
            padding: '0.65rem 1.25rem',
            borderRadius: '14px',
            boxShadow: '0 0 20px rgba(0, 242, 254, 0.15)'
          }}>
            <Clock size={18} color="#00F2FE" />
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '0.7rem', color: '#64748B', fontWeight: 800, fontFamily: 'var(--font-esports)', letterSpacing: '0.05em' }}>
                SEASON 1 ARENA
              </div>
              <div style={{ fontSize: '0.95rem', fontWeight: 800, color: '#F8FAFC', fontFamily: 'var(--font-esports)' }}>
                {timeFormatted} <span style={{ color: '#00F2FE' }}>•</span> {dateFormatted}
              </div>
            </div>
          </div>

          {/* Gaming Status Counters */}
          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', justifyContent: 'flex-end' }}>
            <div style={{
              backgroundColor: 'rgba(255, 78, 80, 0.12)',
              border: '1px solid rgba(255, 78, 80, 0.4)',
              padding: '0.6rem 1rem',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              color: '#FF4E50',
              fontWeight: 800,
              fontFamily: 'var(--font-esports)',
              fontSize: '0.85rem'
            }}>
              <Flame size={20} fill="#FF4E50" />
              <div>
                <div style={{ fontSize: '0.65rem', color: '#94A3B8' }}>STREAK</div>
                <div>{streak || 5} DAYS</div>
              </div>
            </div>

            <div style={{
              backgroundColor: 'rgba(255, 215, 0, 0.12)',
              border: '1px solid rgba(255, 215, 0, 0.4)',
              padding: '0.6rem 1rem',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              color: '#FFD700',
              fontWeight: 800,
              fontFamily: 'var(--font-esports)',
              fontSize: '0.85rem'
            }}>
              <Trophy size={20} color="#FFD700" />
              <div>
                <div style={{ fontSize: '0.65rem', color: '#94A3B8' }}>LEAGUE</div>
                <div>EMERALD #3</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DynamicGreetingHero;
