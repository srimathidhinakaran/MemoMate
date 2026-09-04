import React from 'react';
import { useAuth } from '../context/AuthContext';
import ThreeMemoryGardenCanvas from '../components/ThreeMemoryGardenCanvas';
import { Cpu, Sparkles, Flame } from 'lucide-react';

const MemoryGardenPage = () => {
  const { xpPoints, level, levelTitle, streak, t } = useAuth();

  return (
    <div className="page-view animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div className="garden-card" style={{
        backgroundColor: '#161C26',
        border: '1px solid #263142',
        padding: '2rem 2.2rem'
      }}>
        <div className="garden-card-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.4rem' }}>
              <div className="icon-box" style={{
                width: 44,
                height: 44,
                borderRadius: '12px',
                backgroundColor: 'rgba(56, 189, 248, 0.15)',
                border: '1px solid rgba(56, 189, 248, 0.35)',
                display: 'inline-flex',
                alignItems: 'center',
                justify: 'center'
              }}>
                <Cpu size={24} color="#38BDF8" />
              </div>
              <h1 style={{ fontSize: '2rem', color: '#FFFFFF', fontWeight: 900, margin: 0, fontFamily: 'var(--font-heading)' }}>
                {t('navGarden')}
              </h1>
            </div>
            <p style={{ color: '#94A3B8', fontSize: '0.95rem', margin: 0, maxWidth: '640px', lineHeight: 1.5 }}>
              Real-time WebGL 3D Virtual Mind Matrix rendering quantum crystal relics, neural cores, and energy rings based on your cognitive progress.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            <span className="badge badge-flame" style={{ fontSize: '0.85rem', padding: '0.4rem 0.85rem' }}>
              <Flame size={16} fill="#FB923C" /> {streak || 0} Day Streak
            </span>
            <span className="badge badge-gold" style={{ fontSize: '0.85rem', padding: '0.4rem 0.85rem' }}>
              <Sparkles size={16} /> Level {level}: {levelTitle} ({xpPoints} XP)
            </span>
          </div>
        </div>
      </div>

      {/* Three.js Real 3D Mind Matrix Canvas */}
      <ThreeMemoryGardenCanvas />

      {/* Gamification Rewards & Milestones */}
      <div className="garden-card animate-fade-in" style={{ backgroundColor: '#161C26', border: '1px solid #263142' }}>
        <h3 style={{ fontSize: '1.2rem', color: '#FFFFFF', fontWeight: 900, margin: '0 0 1rem', fontFamily: 'var(--font-heading)' }}>
          3D Cyber Matrix Rewards & Milestones
        </h3>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1rem'
        }}>
          <div style={{ padding: '1rem', backgroundColor: '#0B0E14', borderRadius: '14px', border: '1px solid #263142' }}>
            <div style={{ fontWeight: 800, color: '#38BDF8', fontFamily: 'var(--font-heading)' }}>1 Mission Completed</div>
            <div style={{ fontSize: '0.85rem', color: '#94A3B8', marginTop: '0.2rem' }}>Activates Cyber Crystal (+100 XP)</div>
          </div>
          <div style={{ padding: '1rem', backgroundColor: '#0B0E14', borderRadius: '14px', border: '1px solid #263142' }}>
            <div style={{ fontWeight: 800, color: '#C084FC', fontFamily: 'var(--font-heading)' }}>3 Missions Completed</div>
            <div style={{ fontSize: '0.85rem', color: '#94A3B8', marginTop: '0.2rem' }}>Charges Neural Core (+150 XP)</div>
          </div>
          <div style={{ padding: '1rem', backgroundColor: '#0B0E14', borderRadius: '14px', border: '1px solid #263142' }}>
            <div style={{ fontWeight: 800, color: '#34D399', fontFamily: 'var(--font-heading)' }}>5 Missions Completed</div>
            <div style={{ fontSize: '0.85rem', color: '#94A3B8', marginTop: '0.2rem' }}>Generates Quantum Ring (+200 XP)</div>
          </div>
          <div style={{ padding: '1rem', backgroundColor: '#0B0E14', borderRadius: '14px', border: '1px solid #263142' }}>
            <div style={{ fontWeight: 800, color: '#FB923C', fontFamily: 'var(--font-heading)' }}>7 Day Consistent Streak</div>
            <div style={{ fontSize: '0.85rem', color: '#94A3B8', marginTop: '0.2rem' }}>Unlocks 3D Matrix atmosphere aura</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MemoryGardenPage;
