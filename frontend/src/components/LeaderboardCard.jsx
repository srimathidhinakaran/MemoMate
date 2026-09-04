import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { soundFx } from '../utils/soundEffects';
import { gamificationAPI } from '../services/api';
import { Trophy, Flame, Crown, ChevronRight } from 'lucide-react';

const getCleanInitials = (name) => {
  if (!name) return 'AM';
  const clean = name.replace(/\(.*?\)/g, '').trim();
  const parts = clean.split(' ').filter(Boolean);
  if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  return clean.slice(0, 2).toUpperCase();
};

const LeaderboardCard = () => {
  const { user, xpPoints, streak } = useAuth();
  const [leaderboard, setLeaderboard] = useState([]);

  useEffect(() => {
    gamificationAPI.getLeaderboard().then((res) => {
      if (res && Array.isArray(res)) {
        let updated = res.map((item) => {
          // Remove fake name checks; match logged in user strictly
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

        updated.sort((a, b) => b.xpPoints - a.xpPoints);
        updated = updated.map((item, idx) => ({ ...item, rank: idx + 1 }));
        setLeaderboard(updated.slice(0, 5));
      }
    });
  }, [xpPoints, streak, user]);

  return (
    <div className="garden-card animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div className="icon-box" style={{
            width: 44,
            height: 44,
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #FBBF24 0%, #EA580C 100%)'
          }}>
            <Trophy size={24} color="#0D1117" />
          </div>
          <div>
            <h3 style={{ fontSize: '1.25rem', color: '#FFFFFF', fontWeight: 800, margin: 0, fontFamily: 'var(--font-heading)' }}>
              COMMUNITY LEADERBOARD
            </h3>
            <div style={{ fontSize: '0.8rem', color: '#9198A1', fontWeight: 600 }}>
              TOP ACTIVE MEMBERS • REAL-TIME STANDINGS
            </div>
          </div>
        </div>

        <Link
          to="/leaderboard"
          onClick={() => soundFx.playClick()}
          style={{
            fontSize: '0.85rem',
            fontWeight: 800,
            fontFamily: 'var(--font-heading)',
            color: '#38BDF8',
            textDecoration: 'none',
            display: 'flex',
            alignItems: 'center',
            gap: '0.3rem'
          }}
        >
          VIEW LEADERBOARD <ChevronRight size={16} />
        </Link>
      </div>

      {/* Leaderboard Entries */}
      {leaderboard.length === 0 ? (
        <div style={{
          padding: '1.8rem 1rem',
          textAlign: 'center',
          backgroundColor: '#0D1117',
          borderRadius: '12px',
          border: '1px solid #30363D',
          color: '#9198A1',
          fontSize: '0.88rem'
        }}>
          No leaderboard rankings yet. Complete exercises to earn XP and top the board!
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {leaderboard.map((item) => {
            const isUser = item.isCurrentUser || (user && item.userId === user.id);
            const displayName = isUser ? (user?.name || item.name) : item.name;
            const initials = getCleanInitials(displayName);

            const isGold = item.rank === 1;
            const isSilver = item.rank === 2;
            const isBronze = item.rank === 3;

            let rankGlow = '#0D1117';
            let borderColor = '#30363D';
            let rankColor = '#9198A1';

            if (isGold) {
              rankGlow = 'rgba(251, 191, 36, 0.1)';
              borderColor = 'rgba(251, 191, 36, 0.4)';
              rankColor = '#FBBF24';
            } else if (isSilver) {
              rankGlow = 'rgba(226, 232, 240, 0.08)';
              borderColor = 'rgba(226, 232, 240, 0.3)';
              rankColor = '#E2E8F0';
            } else if (isBronze) {
              rankGlow = 'rgba(251, 146, 60, 0.08)';
              borderColor = 'rgba(251, 146, 60, 0.3)';
              rankColor = '#FB923C';
            } else if (isUser) {
              rankGlow = 'rgba(56, 189, 248, 0.1)';
              borderColor = '#38BDF8';
              rankColor = '#38BDF8';
            }

            return (
              <div
                key={item.userId || item.rank}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justify: 'space-between',
                  padding: '0.85rem 1.2rem',
                  borderRadius: '12px',
                  backgroundColor: rankGlow,
                  border: `1px solid ${borderColor}`,
                  transition: 'all 0.25s ease'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.9rem' }}>
                  <div className="icon-box" style={{
                    fontSize: '0.95rem',
                    fontWeight: 800,
                    fontFamily: 'var(--font-heading)',
                    color: rankColor,
                    width: '28px'
                  }}>
                    {isGold ? <Crown size={22} color="#FBBF24" fill="#FBBF24" /> : `#${item.rank}`}
                  </div>

                  {/* Dead-Centered Player Badge */}
                  <div className="icon-box" style={{
                    width: 38,
                    height: 38,
                    borderRadius: '10px',
                    backgroundColor: isGold ? '#FBBF24' : (isUser ? '#38BDF8' : '#21262D'),
                    color: (isGold || isUser) ? '#0D1117' : '#FFFFFF',
                    fontWeight: 800,
                    fontSize: '0.85rem',
                    fontFamily: 'var(--font-heading)',
                    border: '1px solid #30363D'
                  }}>
                    {initials}
                  </div>

                  <div>
                    <div style={{ fontWeight: 800, color: '#FFFFFF', fontSize: '0.95rem' }}>
                      {displayName} {isUser && <span style={{ color: '#38BDF8', fontWeight: 800, marginLeft: '0.3rem' }}>(You)</span>}
                    </div>
                    <div style={{ fontSize: '0.78rem', color: '#9198A1', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span>Age {item.age || 68}</span>
                      <span>•</span>
                      <span style={{ color: '#FB923C', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '0.2rem' }}>
                        <Flame size={12} fill="#FB923C" /> {item.currentStreak || streak || 1}d streak
                      </span>
                    </div>
                  </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontWeight: 800, fontFamily: 'var(--font-heading)', color: '#FBBF24', fontSize: '1.05rem' }}>
                    {item.xpPoints} <span style={{ fontSize: '0.75rem', color: '#38BDF8' }}>XP</span>
                  </div>
                  <div style={{ fontSize: '0.72rem', color: '#34D399', fontWeight: 700 }}>
                    TOP DIVISION
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default LeaderboardCard;
