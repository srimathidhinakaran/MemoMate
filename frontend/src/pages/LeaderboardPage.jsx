import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { soundFx } from '../utils/soundEffects';
import { gamificationAPI } from '../services/api';
import { Trophy, Crown, Flame, Gem, ShieldCheck, Sparkles, Filter, ChevronUp, ChevronDown, Award, Swords } from 'lucide-react';

const LeaderboardPage = () => {
  const { user, xpPoints, streak, league } = useAuth();
  const [activeLeague, setActiveLeague] = useState('Emerald');
  const [activeCategory, setActiveCategory] = useState('xp');
  const [timeframe, setTimeframe] = useState('weekly');
  const [leaderboard, setLeaderboard] = useState([]);

  const leagues = [
    { name: 'Bronze', color: '#B45309', icon: '🥉' },
    { name: 'Silver', color: '#CBD5E1', icon: '🥈' },
    { name: 'Gold', color: '#FFD700', icon: '🥇' },
    { name: 'Emerald', color: '#00E676', icon: '💚', current: true },
    { name: 'Sapphire', color: '#00F2FE', icon: '💙' },
    { name: 'Diamond', color: '#A855F7', icon: '💎' }
  ];

  useEffect(() => {
    gamificationAPI.getLeaderboard().then((res) => {
      if (res) {
        let updated = res.map((item) => {
          if (item.isCurrentUser || item.name.includes('Meena')) {
            return { ...item, xpPoints: xpPoints || item.xpPoints, currentStreak: streak || item.currentStreak };
          }
          return item;
        });

        if (activeCategory === 'streak') {
          updated.sort((a, b) => b.currentStreak - a.currentStreak);
        } else {
          updated.sort((a, b) => b.xpPoints - a.xpPoints);
        }

        updated = updated.map((item, idx) => ({ ...item, rank: idx + 1 }));
        setLeaderboard(updated);
      }
    });
  }, [activeCategory, timeframe, xpPoints, streak]);

  const topThree = leaderboard.slice(0, 3);
  const remainingList = leaderboard.slice(3);
  const currentUserRank = leaderboard.find(item => item.isCurrentUser || item.name.includes('Meena'))?.rank || 3;

  const handleFilterClick = (type, value) => {
    soundFx.playClick();
    if (type === 'league') setActiveLeague(value);
    if (type === 'category') setActiveCategory(value);
    if (type === 'timeframe') setTimeframe(value);
  };

  return (
    <div className="page-view animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.8rem' }}>
      {/* Hero Esports Header */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(15, 20, 36, 0.98) 0%, rgba(9, 12, 21, 0.98) 100%)',
        borderRadius: '24px',
        padding: '2.2rem 2.5rem',
        border: '1px solid rgba(0, 242, 254, 0.3)',
        boxShadow: '0 0 40px rgba(0, 242, 254, 0.15)',
        display: 'flex',
        alignItems: 'center',
        justify: 'space-between',
        flexWrap: 'wrap',
        gap: '1.5rem',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{ zIndex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.6rem' }}>
            <span className="badge badge-gold">
              <Swords size={14} /> ARENA DIVISION #14
            </span>
            <span className="badge badge-cyan">
              <Sparkles size={14} /> LIVE TELEMETRY
            </span>
          </div>
          <h1 style={{ fontSize: '2.4rem', margin: 0, fontWeight: 900, fontFamily: 'var(--font-heading)', color: '#F8FAFC' }}>
            EMERALD LEAGUE <span style={{ color: '#00F2FE' }}>ARENA</span>
          </h1>
          <p style={{ color: '#94A3B8', fontSize: '1.05rem', marginTop: '0.4rem', maxWidth: '640px', lineHeight: 1.5 }}>
            Top 5 players in the Emerald League promote to Sapphire Tier! Execute daily memory missions to earn XP multipliers.
          </p>
        </div>

        {/* User Active Rank Card */}
        <div style={{
          backgroundColor: 'rgba(0, 242, 254, 0.08)',
          border: '1px solid rgba(0, 242, 254, 0.3)',
          borderRadius: '20px',
          padding: '1.2rem 1.8rem',
          display: 'flex',
          alignItems: 'center',
          gap: '1.4rem',
          boxShadow: '0 0 25px rgba(0, 242, 254, 0.2)',
          zIndex: 1
        }}>
          <div style={{
            width: 58,
            height: 58,
            borderRadius: '16px',
            background: 'linear-gradient(135deg, #00F2FE 0%, #FFD700 100%)',
            color: '#050B14',
            fontSize: '1.6rem',
            fontWeight: 900,
            fontFamily: 'var(--font-esports)',
            display: 'flex',
            alignItems: 'center',
            justify: 'center'
          }}>
            #{currentUserRank}
          </div>
          <div>
            <div style={{ fontSize: '0.8rem', color: '#94A3B8', fontWeight: 800, fontFamily: 'var(--font-esports)' }}>YOUR GLOBAL RANK</div>
            <div style={{ fontSize: '1.25rem', fontWeight: 900, color: '#F8FAFC' }}>Meena (Top 5% 🚀)</div>
            <div style={{ fontSize: '0.85rem', color: '#00F2FE', display: 'flex', gap: '0.8rem', marginTop: '0.2rem', fontFamily: 'var(--font-esports)' }}>
              <span>⚡ {xpPoints || 850} XP</span>
              <span style={{ color: '#FF4E50' }}>🔥 {streak || 5} DAY STREAK</span>
            </div>
          </div>
        </div>
      </div>

      {/* League Selection Tier Bar */}
      <div style={{
        backgroundColor: 'rgba(15, 20, 36, 0.85)',
        backdropFilter: 'blur(16px)',
        borderRadius: '20px',
        padding: '0.85rem 1.25rem',
        border: '1px solid rgba(0, 242, 254, 0.2)',
        display: 'flex',
        alignItems: 'center',
        justify: 'space-between',
        gap: '0.5rem',
        overflowX: 'auto'
      }}>
        {leagues.map((lg) => (
          <button
            key={lg.name}
            onClick={() => handleFilterClick('league', lg.name)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.65rem 1.25rem',
              borderRadius: '12px',
              border: lg.name === activeLeague ? `1px solid ${lg.color}` : '1px solid transparent',
              backgroundColor: lg.name === activeLeague ? 'rgba(0, 242, 254, 0.12)' : 'transparent',
              color: lg.name === activeLeague ? lg.color : '#94A3B8',
              fontWeight: 800,
              fontFamily: 'var(--font-esports)',
              fontSize: '0.9rem',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              transition: 'all 0.25s ease'
            }}
          >
            <span style={{ fontSize: '1.2rem' }}>{lg.icon}</span>
            <span>{lg.name.toUpperCase()}</span>
            {lg.current && <span style={{ fontSize: '0.65rem', backgroundColor: '#00E676', color: '#050B14', padding: '0.15rem 0.45rem', borderRadius: '4px' }}>ACTIVE</span>}
          </button>
        ))}
      </div>

      {/* Category & Timeframe Filters */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button
            onClick={() => handleFilterClick('category', 'xp')}
            className={activeCategory === 'xp' ? 'btn-primary' : 'btn-secondary'}
            style={{ padding: '0.55rem 1.25rem', fontSize: '0.85rem' }}
          >
            ⚡ TOTAL XP STANDINGS
          </button>
          <button
            onClick={() => handleFilterClick('category', 'streak')}
            className={activeCategory === 'streak' ? 'btn-flame' : 'btn-secondary'}
            style={{ padding: '0.55rem 1.25rem', fontSize: '0.85rem' }}
          >
            🔥 STREAK MASTERS
          </button>
        </div>

        <div style={{ display: 'flex', gap: '0.4rem', backgroundColor: 'rgba(255, 255, 255, 0.05)', padding: '0.3rem', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
          {['weekly', 'today', 'alltime'].map((tf) => (
            <button
              key={tf}
              onClick={() => handleFilterClick('timeframe', tf)}
              style={{
                background: timeframe === tf ? '#00F2FE' : 'transparent',
                color: timeframe === tf ? '#050B14' : '#94A3B8',
                border: 'none',
                padding: '0.45rem 0.95rem',
                borderRadius: '8px',
                fontWeight: 800,
                fontFamily: 'var(--font-esports)',
                fontSize: '0.75rem',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              {tf === 'weekly' ? 'THIS WEEK' : (tf === 'today' ? 'TODAY' : 'ALL-TIME')}
            </button>
          ))}
        </div>
      </div>

      {/* Top 3 Podium Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
        gap: '1.4rem'
      }}>
        {topThree.map((item, idx) => {
          const isGold = idx === 0;
          const isSilver = idx === 1;
          const isBronze = idx === 2;

          let crownIcon = '🥇';
          let borderGlow = 'rgba(255, 215, 0, 0.5)';
          let bgGradient = 'linear-gradient(180deg, rgba(255, 215, 0, 0.12) 0%, rgba(15, 20, 36, 0.95) 100%)';
          let titleColor = '#FFD700';

          if (isSilver) {
            crownIcon = '🥈';
            borderGlow = 'rgba(203, 213, 225, 0.4)';
            bgGradient = 'linear-gradient(180deg, rgba(203, 213, 225, 0.1) 0%, rgba(15, 20, 36, 0.95) 100%)';
            titleColor = '#CBD5E1';
          } else if (isBronze) {
            crownIcon = '🥉';
            borderGlow = 'rgba(249, 115, 22, 0.4)';
            bgGradient = 'linear-gradient(180deg, rgba(249, 115, 22, 0.1) 0%, rgba(15, 20, 36, 0.95) 100%)';
            titleColor = '#F97316';
          }

          const isUser = item.isCurrentUser || item.name.includes('Meena');
          const initials = item.initials || (item.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase());

          return (
            <div
              key={idx}
              style={{
                background: bgGradient,
                border: `2px solid ${borderGlow}`,
                borderRadius: '24px',
                padding: '2rem 1.5rem',
                textAlign: 'center',
                boxShadow: `0 0 30px ${borderGlow}`,
                position: 'relative'
              }}
            >
              <div style={{
                position: 'absolute',
                top: '-20px',
                left: '50%',
                transform: 'translateX(-50%)',
                fontSize: '2.2rem'
              }}>
                {crownIcon}
              </div>

              {/* Player Avatar */}
              <div style={{
                width: 72,
                height: 72,
                borderRadius: '20px',
                background: isGold ? 'linear-gradient(135deg, #FFD700 0%, #FFA000 100%)' : (isUser ? 'linear-gradient(135deg, #00F2FE 0%, #A855F7 100%)' : 'rgba(255, 255, 255, 0.1)'),
                color: (isGold || isUser) ? '#050B14' : '#F8FAFC',
                fontSize: '1.6rem',
                fontWeight: 900,
                fontFamily: 'var(--font-esports)',
                display: 'flex',
                alignItems: 'center',
                justify: 'center',
                margin: '0.85rem auto 0.8rem',
                boxShadow: '0 0 20px rgba(0, 0, 0, 0.5)'
              }}>
                {initials}
              </div>

              <div style={{ fontSize: '1.3rem', fontWeight: 900, color: '#F8FAFC', margin: '0.2rem 0' }}>
                {item.name} {isUser && <span style={{ color: '#00F2FE' }}>(You)</span>}
              </div>

              <div style={{ fontSize: '0.85rem', color: '#94A3B8', marginBottom: '1rem', fontWeight: 700 }}>
                Age {item.age} • {item.league}
              </div>

              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                backgroundColor: 'rgba(0, 0, 0, 0.4)',
                padding: '0.55rem 1.2rem',
                borderRadius: '12px',
                border: `1px solid ${borderGlow}`,
                fontWeight: 900,
                fontFamily: 'var(--font-esports)',
                fontSize: '1.1rem',
                color: titleColor
              }}>
                <Sparkles size={18} color={titleColor} />
                <span>{item.xpPoints} XP</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Full Esports Rankings Table */}
      <div className="garden-card animate-fade-in" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{
          padding: '1.4rem 1.8rem',
          borderBottom: '1px solid rgba(0, 242, 254, 0.2)',
          backgroundColor: 'rgba(0, 242, 254, 0.05)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <span style={{ fontWeight: 900, fontFamily: 'var(--font-heading)', color: '#F8FAFC', fontSize: '1.15rem' }}>
            EMERALD LEAGUE STANDINGS #4 – #10
          </span>
          <span style={{ fontSize: '0.85rem', color: '#00E676', fontWeight: 800, fontFamily: 'var(--font-esports)' }}>
            TOP 5 PROMOTED TO SAPPHIRE LEAGUE
          </span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {remainingList.map((item, idx) => {
            const isUser = item.isCurrentUser || item.name.includes('Meena');
            const rank = idx + 4;
            const initials = item.initials || (item.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase());

            return (
              <div
                key={idx}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justify: 'space-between',
                  padding: '1.2rem 1.8rem',
                  borderBottom: idx === remainingList.length - 1 ? 'none' : '1px solid rgba(255, 255, 255, 0.05)',
                  backgroundColor: isUser ? 'rgba(0, 242, 254, 0.08)' : 'transparent',
                  transition: 'all 0.2s ease'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '1.4rem' }}>
                  <span style={{ fontWeight: 900, fontFamily: 'var(--font-esports)', color: isUser ? '#00F2FE' : '#94A3B8', width: '32px', fontSize: '1.1rem' }}>
                    #{rank}
                  </span>

                  <div style={{
                    width: 44,
                    height: 44,
                    borderRadius: '12px',
                    backgroundColor: isUser ? '#00F2FE' : 'rgba(255, 255, 255, 0.1)',
                    color: isUser ? '#050B14' : '#F8FAFC',
                    fontWeight: 900,
                    fontFamily: 'var(--font-esports)',
                    fontSize: '0.95rem',
                    display: 'flex',
                    alignItems: 'center',
                    justify: 'center'
                  }}>
                    {initials}
                  </div>

                  <div>
                    <div style={{ fontWeight: 800, color: '#F8FAFC', fontSize: '1.05rem' }}>
                      {item.name} {isUser && <span style={{ color: '#00F2FE' }}>(You)</span>}
                    </div>
                    <div style={{ fontSize: '0.82rem', color: '#94A3B8' }}>
                      Age: {item.age} • Active {item.lastActive || '10m ago'}
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                    backgroundColor: 'rgba(255, 78, 80, 0.12)',
                    border: '1px solid rgba(255, 78, 80, 0.3)',
                    padding: '0.4rem 0.85rem',
                    borderRadius: '10px',
                    color: '#FF4E50',
                    fontWeight: 800,
                    fontFamily: 'var(--font-esports)',
                    fontSize: '0.85rem'
                  }}>
                    <Flame size={16} fill="#FF4E50" />
                    <span>{item.currentStreak}d STREAK</span>
                  </div>

                  <div style={{ textAlign: 'right', minWidth: '100px' }}>
                    <div style={{ fontWeight: 900, fontFamily: 'var(--font-esports)', color: '#FFD700', fontSize: '1.15rem' }}>
                      {item.xpPoints} <span style={{ fontSize: '0.8rem', color: '#00F2FE' }}>XP</span>
                    </div>
                    <div style={{ fontSize: '0.75rem', color: rank <= 5 ? '#00E676' : '#64748B', fontWeight: 800, fontFamily: 'var(--font-esports)' }}>
                      {rank <= 5 ? 'PROMOTION ZONE' : 'SAFE ZONE'}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default LeaderboardPage;
