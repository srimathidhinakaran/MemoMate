import React from 'react';
import { useAuth } from '../context/AuthContext';
import ThreeMemoryGardenCanvas from '../components/ThreeMemoryGardenCanvas';
import { Trees, Sparkles, Flame } from 'lucide-react';

const MemoryGardenPage = () => {
  const { garden, xpPoints, level, levelTitle } = useAuth();

  return (
    <div className="page-view animate-fade-in">
      <div className="garden-card" style={{
        background: 'linear-gradient(135deg, #FFFFFF 0%, #EBF2EC 100%)',
        border: '1.5px solid #7C9A82'
      }}>
        <div className="garden-card-header">
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.3rem' }}>
              <Trees size={28} color="#58755E" />
              <h1 style={{ fontSize: '2rem', color: '#1C3B2B' }}>
                Interactive 3D Memory Garden
              </h1>
            </div>
            <p style={{ color: '#536B5C', fontSize: '1.05rem' }}>
              Real-time WebGL 3D Virtual Garden rendering procedural trees, blooming flowers, and lighting environments.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            <span className="badge badge-sage" style={{ fontSize: '0.9rem', padding: '0.5rem 1rem' }}>
              <Flame size={18} color="#C87862" /> {garden?.streak || 4} Day Streak
            </span>
            <span className="badge badge-peach" style={{ fontSize: '0.9rem', padding: '0.5rem 1rem' }}>
              <Sparkles size={18} /> Level {level}: {levelTitle} ({xpPoints} XP)
            </span>
          </div>
        </div>
      </div>

      {/* Three.js Real 3D Memory Garden Canvas */}
      <ThreeMemoryGardenCanvas />

      {/* Garden Growth Milestone Rules Explanation */}
      <div className="garden-card">
        <h3 style={{ fontSize: '1.3rem', color: '#1C3B2B', marginBottom: '0.75rem' }}>
          3D Gamification Rewards & Milestones
        </h3>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1rem'
        }}>
          <div style={{ padding: '1rem', backgroundColor: '#F7F4EE', borderRadius: '16px' }}>
            <div style={{ fontWeight: 800, color: '#58755E' }}>1 Activity Completed</div>
            <div style={{ fontSize: '0.9rem', color: '#536B5C' }}>Sprouts a 3D plant (+100 XP)</div>
          </div>
          <div style={{ padding: '1rem', backgroundColor: '#F2EFF9', borderRadius: '16px' }}>
            <div style={{ fontWeight: 800, color: '#7A66A3' }}>3 Activities Completed</div>
            <div style={{ fontSize: '0.9rem', color: '#536B5C' }}>Blooms a 3D flower (+150 XP)</div>
          </div>
          <div style={{ padding: '1rem', backgroundColor: '#EBF6F8', borderRadius: '16px' }}>
            <div style={{ fontWeight: 800, color: '#3B7A8C' }}>5 Activities Completed</div>
            <div style={{ fontSize: '0.9rem', color: '#536B5C' }}>Grows a 3D garden tree (+200 XP)</div>
          </div>
          <div style={{ padding: '1rem', backgroundColor: '#FDF3F0', borderRadius: '16px' }}>
            <div style={{ fontWeight: 800, color: '#C87862' }}>7 Day Consistent Streak</div>
            <div style={{ fontSize: '0.9rem', color: '#536B5C' }}>Unlocks 3D particles & atmosphere</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MemoryGardenPage;
