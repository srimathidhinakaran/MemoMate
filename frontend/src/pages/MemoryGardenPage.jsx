import React from 'react';
import { useAuth } from '../context/AuthContext';
import ThreeMemoryGardenCanvas from '../components/ThreeMemoryGardenCanvas';
import { Trees, Sparkles, Flame } from 'lucide-react';

const MemoryGardenPage = () => {
  const { garden, xpPoints, level, levelTitle, streak } = useAuth();

  return (
    <div className="page-view animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div className="garden-card" style={{
        backgroundColor: '#161B22',
        border: '1px solid #30363D',
        padding: '2rem 2.2rem'
      }}>
        <div className="garden-card-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.4rem' }}>
              <div className="icon-box" style={{
                width: 44,
                height: 44,
                borderRadius: '12px',
                backgroundColor: 'rgba(52, 211, 153, 0.15)',
                border: '1px solid rgba(52, 211, 153, 0.35)'
              }}>
                <Trees size={24} color="#34D399" />
              </div>
              <h1 style={{ fontSize: '2rem', color: '#FFFFFF', fontWeight: 800, margin: 0, fontFamily: 'var(--font-heading)' }}>
                Interactive 3D Memory Garden
              </h1>
            </div>
            <p style={{ color: '#9198A1', fontSize: '0.95rem', margin: 0, maxWidth: '640px', lineHeight: 1.5 }}>
              Real-time WebGL 3D Virtual Garden rendering procedural trees, blooming flowers, and lighting environments based on your cognitive progress.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            <span className="badge badge-flame" style={{ fontSize: '0.85rem', padding: '0.4rem 0.85rem' }}>
              <Flame size={16} fill="#FB923C" /> {streak || 1} Day Streak
            </span>
            <span className="badge badge-gold" style={{ fontSize: '0.85rem', padding: '0.4rem 0.85rem' }}>
              <Sparkles size={16} /> Level {level}: {levelTitle} ({xpPoints} XP)
            </span>
          </div>
        </div>
      </div>

      {/* Three.js Real 3D Memory Garden Canvas */}
      <ThreeMemoryGardenCanvas />

      {/* Garden Growth Milestone Rules Explanation */}
      <div className="garden-card animate-fade-in" style={{ backgroundColor: '#161B22', border: '1px solid #30363D' }}>
        <h3 style={{ fontSize: '1.2rem', color: '#FFFFFF', fontWeight: 800, margin: '0 0 1rem', fontFamily: 'var(--font-heading)' }}>
          3D Gamification Rewards & Milestones
        </h3>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1rem'
        }}>
          <div style={{ padding: '1rem', backgroundColor: '#0D1117', borderRadius: '14px', border: '1px solid #30363D' }}>
            <div style={{ fontWeight: 800, color: '#34D399', fontFamily: 'var(--font-heading)' }}>1 Activity Completed</div>
            <div style={{ fontSize: '0.85rem', color: '#9198A1', marginTop: '0.2rem' }}>Sprouts a 3D plant (+100 XP)</div>
          </div>
          <div style={{ padding: '1rem', backgroundColor: '#0D1117', borderRadius: '14px', border: '1px solid #30363D' }}>
            <div style={{ fontWeight: 800, color: '#C084FC', fontFamily: 'var(--font-heading)' }}>3 Activities Completed</div>
            <div style={{ fontSize: '0.85rem', color: '#9198A1', marginTop: '0.2rem' }}>Blooms a 3D flower (+150 XP)</div>
          </div>
          <div style={{ padding: '1rem', backgroundColor: '#0D1117', borderRadius: '14px', border: '1px solid #30363D' }}>
            <div style={{ fontWeight: 800, color: '#38BDF8', fontFamily: 'var(--font-heading)' }}>5 Activities Completed</div>
            <div style={{ fontSize: '0.85rem', color: '#9198A1', marginTop: '0.2rem' }}>Grows a 3D garden tree (+200 XP)</div>
          </div>
          <div style={{ padding: '1rem', backgroundColor: '#0D1117', borderRadius: '14px', border: '1px solid #30363D' }}>
            <div style={{ fontWeight: 800, color: '#FB923C', fontFamily: 'var(--font-heading)' }}>7 Day Consistent Streak</div>
            <div style={{ fontSize: '0.85rem', color: '#9198A1', marginTop: '0.2rem' }}>Unlocks 3D particles & atmosphere</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MemoryGardenPage;
