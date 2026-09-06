import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { soundFx } from '../utils/soundEffects';
import { gamificationAPI } from '../services/api';
import { Trophy, Crown, Flame, Sparkles, Swords } from 'lucide-react';

const getCleanInitials = (name) => {
  if (!name) return 'AM';
  const clean = name.replace(/\(.*?\)/g, '').trim();
  const parts = clean.split(' ').filter(Boolean);
  if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  return clean.slice(0, 2).toUpperCase();
};

const LeaderboardPage = () => {
  const { user, xpPoints, streak, t } = useAuth();
  const [activeLeague, setActiveLeague] = useState('Emerald');
  const [activeCategory, setActiveCategory] = useState('xp');
  const [timeframe, setTimeframe] = useState('weekly');
  const [leaderboard, setLeaderboard] = useState([]);

  const leagues = [
    { name: 'Bronze', color: '#B45309', icon: '🥉' },
    { name: 'Silver', color: '#CBD5E1', icon: '🥈' },
    { name: 'Gold', color: '#FBBF24', icon: '🥇' },
    { name: 'Emerald', color: '#34D399', icon: '💚', current: true },
    { name: 'Sapphire', color: '#38BDF8', icon: '💙' },
    { name: 'Diamond', color: '#C084FC', icon: '💎' }
  ];

  useEffect(() => {
    gamificationAPI.getLeaderboard().then((res) => {
      if (res && Array.isArray(res)) {
        let updated = res.map((item) => {
          if (item.isCurrentUser || (user && item.userId === user.id)) {
            return {
              ...item,
              name: user.name || item.name,
              xpPoints: xpPoints !== undefined ? xpPoints : item.xpPoints,
              currentStreak: streak !== undefined ? streak : item.currentStreak
            };
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
  }, [activeCategory, timeframe, xpPoints, streak, user]);

  const topThree = leaderboard.slice(0, 3);
  const remainingList = leaderboard.slice(3);
  const currentUserRank = leaderboard.find(item => item.isCurrentUser || (user && item.userId === user.id))?.rank || 1;

  const handleFilterClick = (type, value) => {
    soundFx.playClick();
    if (type === 'league') setActiveLeague(value);
    if (type === 'category') setActiveCategory(value);
    if (type === 'timeframe') setTimeframe(value);
  };

  return (
    <div className="page-view animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.8rem' }}>
      {/* Hero Header */}
      <div style={{
        backgroundColor: '#161C26',
        borderRadius: '20px',
        padding: '2.2rem 2.5rem',
        border: '1px solid #263142',
        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.5)',
        display: 'flex',
        alignItems: 'center',
        justify: 'space-between',
        flexWrap: 'wrap',
        gap: '1.5rem'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.6rem', flexWrap: 'wrap' }}>
            <span className="badge badge-gold">
              <Swords size={14} /> {t('globalDivisionTier') || 'GLOBAL DIVISION TIER #1'}
            </span>
            <span className="badge badge-cyan">
              <Sparkles size={14} /> {t('liveStandings') || 'LIVE STANDINGS'}
            </span>
          </div>
          <h1 style={{ fontSize: '2.2rem', margin: 0, fontWeight: 900, fontFamily: 'var(--font-heading)', color: '#FFFFFF' }}>
            {t('leaderboardTitle').toUpperCase()}
          </h1>
          <p style={{ color: '#94A3B8', fontSize: '1rem', marginTop: '0.4rem', maxWidth: '640px', lineHeight: 1.5 }}>
            {t('leaderboardSub') || 'Top members in the Emerald Division promote to Sapphire Tier! Execute daily cognitive exercises to maintain your streak.'}
          </p>
        </div>

        {/* User Active Rank Card */}
        <div style={{
          backgroundColor: '#0B0E14',
          border: '1px solid #38BDF8',
          borderRadius: '16px',
          padding: '1.2rem 1.8rem',
          display: 'flex',
          alignItems: 'center',
          gap: '1.4rem'
        }}>
          <div className="icon-box" style={{
            width: 54,
            height: 54,
            borderRadius: '14px',
            backgroundColor: 'rgba(56, 189, 248, 0.15)',
            color: '#38BDF8',
            fontSize: '1.5rem',
            fontWeight: 900,
            fontFamily: 'var(--font-heading)'
          }}>
            #{currentUserRank}
          </div>
          <div>
            <div style={{ fontSize: '0.78rem', color: '#94A3B8', fontWeight: 700 }}>{t('yourCurrentRank') || 'YOUR CURRENT RANK'}</div>
            <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#FFFFFF' }}>
              {user?.name || (t('activeMember') || 'Active Member')}
            </div>
            <div style={{ fontSize: '0.85rem', color: '#38BDF8', display: 'flex', gap: '0.8rem', marginTop: '0.2rem', fontWeight: 700 }}>
              <span>⚡ {xpPoints || 0} XP</span>
              <span style={{ color: '#FB923C' }}>🔥 {streak || 0} {t('daysStreak') || 'DAY STREAK'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* League Selection Bar */}
      <div style={{
        backgroundColor: '#161C26',
        borderRadius: '16px',
        padding: '0.85rem 1.25rem',
        border: '1px solid #263142',
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
              borderRadius: '10px',
              border: lg.name === activeLeague ? `1px solid ${lg.color}` : '1px solid transparent',
              backgroundColor: lg.name === activeLeague ? 'rgba(56, 189, 248, 0.15)' : 'transparent',
              color: lg.name === activeLeague ? lg.color : '#94A3B8',
              fontWeight: 800,
              fontFamily: 'var(--font-heading)',
              fontSize: '0.9rem',
              cursor: 'pointer',
              whiteSpace: 'nowrap'
            }}
          >
            <span style={{ fontSize: '1.1rem' }}>{lg.icon}</span>
            <span>{lg.name.toUpperCase()}</span>
            {lg.current && <span style={{ fontSize: '0.65rem', backgroundColor: '#34D399', color: '#0B0E14', padding: '0.15rem 0.45rem', borderRadius: '4px', fontWeight: 800 }}>{t('activeTab') || 'ACTIVE'}</span>}
          </button>
        ))}
      </div>

      {/* Category Filters */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button
            onClick={() => handleFilterClick('category', 'xp')}
            className={activeCategory === 'xp' ? 'btn-primary' : 'btn-secondary'}
            style={{ padding: '0.55rem 1.25rem', fontSize: '0.85rem' }}
          >
            ⚡ {t('totalXpStandings') || 'TOTAL XP STANDINGS'}
          </button>
          <button
            onClick={() => handleFilterClick('category', 'streak')}
            className={activeCategory === 'streak' ? 'btn-flame' : 'btn-secondary'}
            style={{ padding: '0.55rem 1.25rem', fontSize: '0.85rem' }}
          >
            🔥 {t('streakMasters') || 'STREAK MASTERS'}
          </button>
        </div>

        <div style={{ display: 'flex', gap: '0.4rem', backgroundColor: '#161C26', padding: '0.3rem', borderRadius: '10px', border: '1px solid #263142' }}>
          {['weekly', 'today', 'alltime'].map((tf) => (
            <button
              key={tf}
              onClick={() => handleFilterClick('timeframe', tf)}
              style={{
                backgroundColor: timeframe === tf ? '#38BDF8' : 'transparent',
                color: timeframe === tf ? '#0B0E14' : '#94A3B8',
                border: 'none',
                padding: '0.45rem 0.95rem',
                borderRadius: '6px',
                fontWeight: 800,
                fontSize: '0.78rem'
              }}
            >
              {tf === 'weekly' ? (t('thisWeek') || 'THIS WEEK') : (tf === 'today' ? (t('today') || 'TODAY') : (t('allTime') || 'ALL-TIME'))}
            </button>
          ))}
        </div>
      </div>

      {/* Top 3 Podium Cards or Empty State */}
      {leaderboard.length === 0 ? (
        <div style={{
          textAlign: 'center',
          padding: '3.5rem 2rem',
          backgroundColor: '#161C26',
          borderRadius: '20px',
          border: '1px solid #263142',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '1rem'
        }}>
          <Trophy size={48} color="#94A3B8" style={{ opacity: 0.5 }} />
          <h3 style={{ fontSize: '1.4rem', color: '#FFFFFF', fontWeight: 800, margin: 0, fontFamily: 'var(--font-heading)' }}>
            {t('noRankingsAvailable') || 'No Rankings Available Yet'}
          </h3>
          <p style={{ color: '#94A3B8', fontSize: '0.95rem', maxWidth: '480px', margin: 0, lineHeight: 1.5 }}>
            {t('noRankingsDesc') || 'Be the first community member to complete a cognitive exercise session to claim the #1 spot on the leaderboard!'}
          </p>
        </div>
      ) : (
        <>
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
              let borderGlow = '#FBBF24';
              let titleColor = '#FBBF24';

              if (isSilver) {
                crownIcon = '🥈';
                borderGlow = '#E2E8F0';
                titleColor = '#E2E8F0';
              } else if (isBronze) {
                crownIcon = '🥉';
                borderGlow = '#FB923C';
                titleColor = '#FB923C';
              }

              const isUser = item.isCurrentUser || (user && item.userId === user.id);
              const displayName = isUser ? (user?.name || item.name) : item.name;
              const initials = getCleanInitials(displayName);

              return (
                <div
                  key={idx}
                  style={{
                    backgroundColor: '#161C26',
                    border: `1px solid ${borderGlow}`,
                    borderRadius: '20px',
                    padding: '2rem 1.5rem',
                    textAlign: 'center',
                    position: 'relative'
                  }}
                >
                  <div style={{
                    position: 'absolute',
                    top: '-18px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    fontSize: '2rem'
                  }}>
                    {crownIcon}
                  </div>

                  <div className="icon-box" style={{
                    width: 68,
                    height: 68,
                    borderRadius: '18px',
                    backgroundColor: isGold ? '#FBBF24' : (isUser ? '#38BDF8' : '#222B3B'),
                    color: (isGold || isUser) ? '#0B0E14' : '#FFFFFF',
                    fontSize: '1.5rem',
                    fontWeight: 800,
                    fontFamily: 'var(--font-heading)',
                    margin: '0.85rem auto 0.8rem',
                    border: '1px solid #263142',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justify: 'center'
                  }}>
                    {initials}
                  </div>

                  <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#FFFFFF', margin: '0.2rem 0' }}>
                    {displayName} {isUser && <span style={{ color: '#38BDF8', fontWeight: 800 }}>(You)</span>}
                  </div>

                  <div style={{ fontSize: '0.85rem', color: '#94A3B8', marginBottom: '1rem', fontWeight: 600 }}>
                    Age {item.age || 68} • {item.league || 'Emerald Division'}
                  </div>

                  <div style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    backgroundColor: '#0B0E14',
                    padding: '0.55rem 1.2rem',
                    borderRadius: '10px',
                    border: `1px solid ${borderGlow}`,
                    fontWeight: 800,
                    fontFamily: 'var(--font-heading)',
                    fontSize: '1.05rem',
                    color: titleColor
                  }}>
                    <Sparkles size={18} color={titleColor} />
                    <span>{item.xpPoints} XP</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Remaining Rankings Table */}
          {remainingList.length > 0 && (
            <div className="garden-card animate-fade-in" style={{ padding: 0, overflow: 'hidden' }}>
              <div style={{
                padding: '1.4rem 1.8rem',
                borderBottom: '1px solid #263142',
                backgroundColor: '#161C26',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <span style={{ fontWeight: 800, fontFamily: 'var(--font-heading)', color: '#FFFFFF', fontSize: '1.1rem' }}>
                  EMERALD LEAGUE STANDINGS #4 – #{remainingList.length + 3}
                </span>
                <span style={{ fontSize: '0.85rem', color: '#34D399', fontWeight: 700 }}>
                  PROMOTION ZONE
                </span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column' }}>
                {remainingList.map((item, idx) => {
                  const isUser = item.isCurrentUser || (user && item.userId === user.id);
                  const rank = idx + 4;
                  const displayName = isUser ? (user?.name || item.name) : item.name;
                  const initials = getCleanInitials(displayName);

                  return (
                    <div
                      key={idx}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justify: 'space-between',
                        padding: '1.1rem 1.8rem',
                        borderBottom: idx === remainingList.length - 1 ? 'none' : '1px solid #263142',
                        backgroundColor: isUser ? 'rgba(56, 189, 248, 0.1)' : '#0B0E14',
                        flexWrap: 'wrap',
                        gap: '0.5rem'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1.4rem' }}>
                        <span style={{ fontWeight: 800, color: isUser ? '#38BDF8' : '#94A3B8', width: '32px', fontSize: '1.05rem' }}>
                          #{rank}
                        </span>

                        <div className="icon-box" style={{
                          width: 42,
                          height: 42,
                          borderRadius: '10px',
                          backgroundColor: isUser ? '#38BDF8' : '#222B3B',
                          color: isUser ? '#0B0E14' : '#FFFFFF',
                          fontWeight: 800,
                          fontSize: '0.9rem',
                          border: '1px solid #263142',
                          display: 'inline-flex',
                          alignItems: 'center',
                          justify: 'center'
                        }}>
                          {initials}
                        </div>

                        <div>
                          <div style={{ fontWeight: 800, color: '#FFFFFF', fontSize: '1rem' }}>
                            {displayName} {isUser && <span style={{ color: '#38BDF8', fontWeight: 800 }}>(You)</span>}
                          </div>
                          <div style={{ fontSize: '0.82rem', color: '#94A3B8' }}>
                            Age: {item.age || 68} • Active recently
                          </div>
                        </div>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.35rem',
                          backgroundColor: 'rgba(251, 146, 60, 0.15)',
                          border: '1px solid rgba(251, 146, 60, 0.35)',
                          padding: '0.4rem 0.85rem',
                          borderRadius: '8px',
                          color: '#FB923C',
                          fontWeight: 700,
                          fontSize: '0.85rem'
                        }}>
                          <Flame size={16} fill="#FB923C" />
                          <span>{(item.currentStreak !== undefined ? item.currentStreak : streak) || 0}d STREAK</span>
                        </div>

                        <div style={{ textAlign: 'right', minWidth: '100px' }}>
                          <div style={{ fontWeight: 800, fontFamily: 'var(--font-heading)', color: '#FBBF24', fontSize: '1.1rem' }}>
                            {item.xpPoints} <span style={{ fontSize: '0.8rem', color: '#38BDF8' }}>XP</span>
                          </div>
                          <div style={{ fontSize: '0.75rem', color: rank <= 5 ? '#34D399' : '#94A3B8', fontWeight: 700 }}>
                            {rank <= 5 ? 'PROMOTION ZONE' : 'SAFE ZONE'}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default LeaderboardPage;
