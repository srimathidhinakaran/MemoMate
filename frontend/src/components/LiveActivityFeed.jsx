import React, { useState, useEffect } from 'react';
import { soundFx } from '../utils/soundEffects';
import { Activity, Zap, Flame, Award, Clock, Radio, Sparkles } from 'lucide-react';

const INITIAL_ACTIVITIES = [
  { id: 1, user: 'Aarav Patel', action: 'completed 3D Focus Search', score: 92, time: '2m ago', initials: 'AP' },
  { id: 2, user: 'Sunita Sharma', action: 'reached a 9-Day Streak', score: null, time: '5m ago', initials: 'SS' },
  { id: 3, user: 'Patient Member', action: 'completed 3D Memory Match', score: 85, time: '12m ago', initials: 'PM' },
  { id: 4, user: 'Ramesh Kumar', action: 'promoted to Rank #3', score: null, time: '24m ago', initials: 'RK' },
  { id: 5, user: 'Anita Roy', action: 'completed Pattern Recall', score: 88, time: '41m ago', initials: 'AR' }
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
        initials: randomUser.initials
      };

      setActivities((prev) => [newActivity, ...prev.slice(0, 4)]);
      soundFx.playXpGain();
    }, 18000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="garden-card animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          <div className="icon-box" style={{
            width: 40,
            height: 40,
            borderRadius: '10px',
            backgroundColor: 'rgba(56, 189, 248, 0.15)',
            border: '1px solid rgba(56, 189, 248, 0.35)'
          }}>
            <Radio size={22} color="#38BDF8" />
          </div>
          <div>
            <h4 style={{ fontSize: '1.15rem', color: '#FFFFFF', fontWeight: 800, margin: 0, fontFamily: 'var(--font-heading)' }}>
              LIVE ACTIVITY STREAM
            </h4>
            <div style={{ fontSize: '0.78rem', color: '#9198A1', fontWeight: 600 }}>
              REAL-TIME COMMUNITY EXERCISE FEED
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.75rem', color: '#34D399', fontWeight: 800, fontFamily: 'var(--font-esports)' }}>
          <span style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: '#34D399' }} />
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
              backgroundColor: '#0D1117',
              borderRadius: '10px',
              border: '1px solid #30363D',
              fontSize: '0.88rem'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div className="icon-box" style={{
                width: 32,
                height: 32,
                borderRadius: '8px',
                backgroundColor: 'rgba(56, 189, 248, 0.15)',
                color: '#38BDF8',
                fontWeight: 800,
                fontSize: '0.8rem',
                fontFamily: 'var(--font-esports)'
              }}>
                {act.initials}
              </div>

              <div>
                <span style={{ fontWeight: 800, color: '#FFFFFF' }}>{act.user}</span>{' '}
                <span style={{ color: '#9198A1' }}>{act.action}</span>
                {act.score && (
                  <span style={{ marginLeft: '0.4rem', fontWeight: 800, color: '#FBBF24', fontSize: '0.82rem', fontFamily: 'var(--font-esports)' }}>
                    (+{act.score} PTS)
                  </span>
                )}
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: '#38BDF8', fontSize: '0.75rem', fontWeight: 800, fontFamily: 'var(--font-esports)' }}>
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
