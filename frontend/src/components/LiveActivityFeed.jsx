import React, { useState, useEffect } from 'react';
import { soundFx } from '../utils/soundEffects';
import { Activity, Zap, Flame, Award, Clock, Radio, Sparkles } from 'lucide-react';

const INITIAL_ACTIVITIES = [
  { id: 1, user: 'Aarav Patel', action: 'completed 3D Focus Search', score: 92, time: '2m ago', type: 'workout', initials: 'AP' },
  { id: 2, user: 'Sunita Sharma', action: 'reached a 9-Day Streak', score: null, time: '5m ago', type: 'streak', initials: 'SS' },
  { id: 3, user: 'Meena (You)', action: 'completed 3D Memory Match', score: 85, time: '12m ago', type: 'workout', initials: 'M' },
  { id: 4, user: 'Ramesh Kumar', action: 'promoted to Emerald League', score: null, time: '24m ago', type: 'league', initials: 'RK' },
  { id: 5, user: 'Anita Roy', action: 'completed Pattern Recall', score: 88, time: '41m ago', type: 'workout', initials: 'AR' }
];

const LiveActivityFeed = () => {
  const [activities, setActivities] = useState(INITIAL_ACTIVITIES);

  useEffect(() => {
    const interval = setInterval(() => {
      const users = [
        { name: 'Aarav Patel', initials: 'AP' },
        { name: 'Sunita Sharma', initials: 'SS' },
        { name: 'Ramesh Kumar', initials: 'RK' },
        { name: 'Anita Roy', initials: 'AR' },
        { name: 'Kavita Sen', initials: 'KS' }
      ];

      const games = ['3D Focus Search', '3D Memory Match', '3D Reaction Orbs', 'Pattern Recall', 'Number Recall'];
      const randomUser = users[Math.floor(Math.random() * users.length)];
      const randomGame = games[Math.floor(Math.random() * games.length)];
      const randomScore = Math.floor(Math.random() * 20) + 80;

      const newActivity = {
        id: Date.now(),
        user: randomUser.name,
        action: `completed ${randomGame}`,
        score: randomScore,
        time: 'Just now',
        type: 'workout',
        initials: randomUser.initials
      };

      setActivities((prev) => [newActivity, ...prev.slice(0, 4)]);
      soundFx.playXpGain();
    }, 15000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="garden-card animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          <div style={{
            width: 40,
            height: 40,
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #00F2FE 0%, #00E676 100%)',
            display: 'flex',
            alignItems: 'center',
            justify: 'center',
            boxShadow: '0 0 15px rgba(0, 242, 254, 0.4)'
          }}>
            <Radio size={22} color="#050B14" />
          </div>
          <div>
            <h4 style={{ fontSize: '1.15rem', color: '#F8FAFC', fontWeight: 900, margin: 0, fontFamily: 'var(--font-heading)' }}>
              LIVE BATTLE TICKER
            </h4>
            <div style={{ fontSize: '0.78rem', color: '#94A3B8', fontWeight: 700 }}>
              REAL-TIME GLOBAL PLAYER NETWORK FEED
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.75rem', color: '#00E676', fontWeight: 800, fontFamily: 'var(--font-esports)' }}>
          <span style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: '#00E676', boxShadow: '0 0 10px #00E676' }} className="animate-pulse-glow" />
          <span>LIVE SYNC</span>
        </div>
      </div>

      {/* Activity Stream List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
        {activities.map((act) => (
          <div
            key={act.id}
            style={{
              display: 'flex',
              alignItems: 'center',
              justify: 'space-between',
              padding: '0.7rem 1rem',
              backgroundColor: 'rgba(255, 255, 255, 0.04)',
              borderRadius: '12px',
              border: '1px solid rgba(0, 242, 254, 0.15)',
              fontSize: '0.88rem'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{
                width: 32,
                height: 32,
                borderRadius: '8px',
                background: 'linear-gradient(135deg, #00F2FE 0%, #A855F7 100%)',
                color: '#050B14',
                fontWeight: 900,
                fontSize: '0.8rem',
                fontFamily: 'var(--font-esports)',
                display: 'flex',
                alignItems: 'center',
                justify: 'center'
              }}>
                {act.initials}
              </div>

              <div>
                <span style={{ fontWeight: 800, color: '#F8FAFC' }}>{act.user}</span>{' '}
                <span style={{ color: '#94A3B8' }}>{act.action}</span>
                {act.score && (
                  <span style={{ marginLeft: '0.4rem', fontWeight: 900, color: '#FFD700', fontSize: '0.82rem', fontFamily: 'var(--font-esports)' }}>
                    (+{act.score} PTS)
                  </span>
                )}
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: '#00F2FE', fontSize: '0.75rem', fontWeight: 800, fontFamily: 'var(--font-esports)' }}>
              <Clock size={12} />
              <span>{act.time}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LiveActivityFeed;
