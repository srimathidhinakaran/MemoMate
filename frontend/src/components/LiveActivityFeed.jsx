import React, { useState, useEffect } from 'react';
import { sessionAPI } from '../services/api';
import { Activity, Clock, Radio, Sparkles, AlertCircle } from 'lucide-react';

const getRelativeTime = (timestamp) => {
  if (!timestamp) return 'Just now';
  const now = new Date();
  const past = new Date(timestamp);
  const diffSec = Math.floor((now - past) / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHr = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHr / 24);

  if (isNaN(diffSec) || diffSec < 45) return 'Just now';
  if (diffMin < 60) return `${diffMin}m ago`;
  if (diffHr < 24) return `${diffHr}h ago`;
  return `${diffDay}d ago`;
};

const LiveActivityFeed = () => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchActivities = async () => {
    try {
      const data = await sessionAPI.getRecentActivities();
      if (Array.isArray(data)) {
        setActivities(data);
      }
    } catch (err) {
      console.error("Failed to load real live activities:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActivities();

    const handleUpdate = () => {
      fetchActivities();
    };

    window.addEventListener('memomate_activity_updated', handleUpdate);
    const interval = setInterval(fetchActivities, 12000);

    return () => {
      window.removeEventListener('memomate_activity_updated', handleUpdate);
      clearInterval(interval);
    };
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
      {loading ? (
        <div style={{ padding: '1.5rem', textAlign: 'center', color: '#9198A1', fontSize: '0.88rem' }}>
          Syncing activity stream...
        </div>
      ) : activities.length === 0 ? (
        <div style={{
          textAlign: 'center',
          padding: '2.2rem 1.5rem',
          backgroundColor: '#0D1117',
          borderRadius: '12px',
          border: '1px solid #30363D',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '0.75rem'
        }}>
          <Radio size={32} color="#9198A1" style={{ opacity: 0.5 }} />
          <div style={{ fontWeight: 800, color: '#FFFFFF', fontSize: '1rem', fontFamily: 'var(--font-heading)' }}>
            No Live Community Activities Yet
          </div>
          <div style={{ fontSize: '0.82rem', color: '#9198A1', maxWidth: '380px', lineHeight: 1.4 }}>
            Be the first community member to complete an exercise session to kick off the real-time activity stream!
          </div>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
          {activities.map((act) => (
            <div
              key={act.id || act._id}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
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
                  {act.initials || 'CM'}
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
                <span>{getRelativeTime(act.completedAt)}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default LiveActivityFeed;
