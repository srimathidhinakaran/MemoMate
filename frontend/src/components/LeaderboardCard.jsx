import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { soundFx } from '../utils/soundEffects';
import { gamificationAPI } from '../services/api';
import { Trophy, Award, Flame, Crown, ChevronRight, Zap } from 'lucide-react';

const LeaderboardCard = () => {
  const { xpPoints, streak } = useAuth();
  const [leaderboard, setLeaderboard] = useState([]);

  useEffect(() => {
    gamificationAPI.getLeaderboard().then((res) => {
      if (res) {
        let updated = res.map((item) => {
          if (item.isCurrentUser || item.name.includes('Meena')) {
            return { ...item, xpPoints: xpPoints || item.xpPoints, currentStreak: streak || item.currentStreak };
          }
          return item;
        });

        updated.sort((a, b) => b.xpPoints - a.xpPoints);
        updated = updated.map((item, idx) => ({ ...item, rank: idx + 1 }));
        setLeaderboard(updated.slice(0, 5));
      }
    });
  }, [xpPoints, streak]);

  return (
    <div className="garden-card animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{
            width: 44,
            height: 44,
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #FFD700 0%, #FF4E50 100%)',
            display: 'flex',
            alignItems: 'center',
            justify: 'center',
            boxShadow: '0 0 15px rgba(255, 215, 0, 0.4)'
          }}>
            <Trophy size={24} color="#050B14" />
          </div>
          <div>
            <h3 style={{ fontSize: '1.25rem', color: '#F8FAFC', fontWeight: 900, margin: 0, fontFamily: 'var(--font-heading)' }}>
              EMERALD LEAGUE PODIUM
            </h3>
            <div style={{ fontSize: '0.8rem', color: '#94A3B8', fontWeight: 700 }}>
              TOP 5 GLOBAL PLAYERS • REAL-TIME LEAGUE STANDINGS
            </div>
          </div>
        </div>

        <Link
          to="/leaderboard"
          onClick={() => soundFx.playClick()}
          style={{
            fontSize: '0.85rem',
            fontWeight: 800,
            fontFamily: 'var(--font-esports)',
            color: '#00F2FE',
            textDecoration: 'none',
            display: 'flex',
            alignItems: 'center',
            gap: '0.3rem'
          }}
        >
          FULL ARENA <ChevronRight size={16} />
        </Link>
      </div>

      {/* Mini Esports Leaderboard */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {leaderboard.map((item) => {
          const isUser = item.isCurrentUser || item.name.includes('Meena');
          const initials = item.initials || (item.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase());

          const isGold = item.rank === 1;
          const isSilver = item.rank === 2;
          const isBronze = item.rank === 3;

          let rankGlow = 'rgba(255, 255, 255, 0.05)';
          let borderColor = 'rgba(255, 255, 255, 0.1)';
          let rankColor = '#94A3B8';

          if (isGold) {
            rankGlow = 'rgba(255, 215, 0, 0.12)';
            borderColor = 'rgba(255, 215, 0, 0.5)';
            rankColor = '#FFD700';
          } else if (isSilver) {
            rankGlow = 'rgba(203, 213, 225, 0.1)';
            borderColor = 'rgba(203, 213, 225, 0.4)';
            rankColor = '#CBD5E1';
          } else if (isBronze) {
            rankGlow = 'rgba(249, 115, 22, 0.1)';
            borderColor = 'rgba(249, 115, 22, 0.4)';
            rankColor = '#F97316';
          } else if (isUser) {
            rankGlow = 'rgba(0, 242, 254, 0.12)';
            borderColor = '#00F2FE';
            rankColor = '#00F2FE';
          }

          return (
            <div
              key={item.userId}
              style={{
                display: 'flex',
                alignItems: 'center',
                justify: 'space-between',
                padding: '0.85rem 1.2rem',
                borderRadius: '14px',
                backgroundColor: rankGlow,
                border: `1px solid ${borderColor}`,
                boxShadow: isUser || isGold ? '0 0 20px rgba(0, 242, 254, 0.2)' : 'none',
                transition: 'all 0.25s ease'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.9rem' }}>
                <div style={{
                  fontSize: '1rem',
                  fontWeight: 900,
                  fontFamily: 'var(--font-esports)',
                  color: rankColor,
                  width: '28px',
                  textAlign: 'center'
                }}>
                  {isGold ? <Crown size={22} color="#FFD700" fill="#FFD700" /> : `#${item.rank}`}
                </div>

                {/* Player Badge */}
                <div style={{
                  width: 38,
                  height: 38,
                  borderRadius: '10px',
                  background: isGold ? 'linear-gradient(135deg, #FFD700 0%, #FFA000 100%)' : (isUser ? 'linear-gradient(135deg, #00F2FE 0%, #A855F7 100%)' : 'rgba(255, 255, 255, 0.1)'),
                  color: (isGold || isUser) ? '#050B14' : '#F8FAFC',
                  fontWeight: 900,
                  fontSize: '0.9rem',
                  fontFamily: 'var(--font-esports)',
                  display: 'flex',
                  alignItems: 'center',
                  justify: 'center'
                }}>
                  {initials}
                </div>

                <div>
                  <div style={{ fontWeight: 800, color: '#F8FAFC', fontSize: '0.98rem' }}>
                    {item.name} {isUser && <span style={{ color: '#00F2FE', fontWeight: 800 }}>(You)</span>}
                  </div>
                  <div style={{ fontSize: '0.78rem', color: '#94A3B8', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span>Age {item.age}</span>
                    <span>•</span>
                    <span style={{ color: '#FF4E50', fontWeight: 800, display: 'inline-flex', alignItems: 'center', gap: '0.2rem' }}>
                      <Flame size={12} fill="#FF4E50" /> {item.currentStreak}d streak
                    </span>
                  </div>
                </div>
              </div>

              <div style={{ textAlign: 'right' }}>
                <div style={{ fontWeight: 900, fontFamily: 'var(--font-esports)', color: '#FFD700', fontSize: '1.05rem' }}>
                  {item.xpPoints} <span style={{ fontSize: '0.75rem', color: '#00F2FE' }}>XP</span>
                </div>
                <div style={{ fontSize: '0.72rem', color: '#00E676', fontWeight: 800, fontFamily: 'var(--font-esports)' }}>
                  PROMOTION ZONE
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default LeaderboardCard;
