import React from 'react';
import { useAuth } from '../context/AuthContext';
import ThreeMemoryGardenCanvas from '../components/ThreeMemoryGardenCanvas';
import { Flower2, Sparkles, Flame, CheckCircle2, Award, TreePine, Leaf, Sprout } from 'lucide-react';

const MemoryGardenPage = () => {
  const { garden, profile, xpPoints, level, levelTitle, streak, t } = useAuth();

  const totalActivities = garden?.totalActivities || 0;

  let currentStage = 'Day 1 — Seed';
  if (totalActivities >= 30) currentStage = 'Day 30 — Memory Tree';
  else if (totalActivities >= 10) currentStage = 'Day 10 — Flower';
  else if (totalActivities >= 5) currentStage = 'Day 5 — Plant';

  const gardenElements = [
    { title: 'Memory Tree', category: 'Memory Area', score: profile?.memoryScore || 88, stage: 'Memory Tree', icon: TreePine, color: '#34D399' },
    { title: 'Attention Flower', category: 'Attention Area', score: profile?.attentionScore || 64, stage: 'Bloom Flower', icon: Flower2, color: '#C084FC' },
    { title: 'Recall Plant', category: 'Recall Speed', score: profile?.recallScore || 76, stage: 'Growing Plant', icon: Leaf, color: '#38BDF8' },
    { title: 'Pattern Plant', category: 'Pattern Matrix', score: profile?.reactionScore || 71, stage: 'Sprout Seedling', icon: Sprout, color: '#FBBF24' }
  ];

  return (
    <div className="page-view animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Header */}
      <div className="garden-card" style={{
        backgroundColor: '#161C26',
        border: '1px solid #30363D',
        padding: '2rem 2.2rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.4rem' }}>
              <div className="icon-box" style={{
                width: 44,
                height: 44,
                borderRadius: '12px',
                backgroundColor: 'rgba(52, 211, 153, 0.15)',
                border: '1px solid rgba(52, 211, 153, 0.35)'
              }}>
                <Flower2 size={24} color="#34D399" />
              </div>
              <h1 style={{ fontSize: '2rem', color: '#FFFFFF', fontWeight: 900, margin: 0, fontFamily: 'var(--font-heading)' }}>
                {t('navGarden') || 'Memory Garden'}
              </h1>
            </div>
            <p style={{ color: '#94A3B8', fontSize: '0.95rem', margin: 0, maxWidth: '640px', lineHeight: 1.5 }}>
              Visual 3D progression garden where completed cognitive exercises nurture virtual Memory Trees, Attention Flowers, and Recall Plants.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            <span className="badge badge-green" style={{ fontSize: '0.85rem', padding: '0.45rem 0.85rem' }}>
              <Award size={16} /> Current Growth: {currentStage}
            </span>
            <span className="badge badge-cyan" style={{ fontSize: '0.85rem', padding: '0.45rem 0.85rem' }}>
              <Sparkles size={16} /> {totalActivities} Activities Completed
            </span>
          </div>
        </div>
      </div>

      {/* 4 Progression Stages Breakdown */}
      <div className="garden-card animate-fade-in" style={{ backgroundColor: '#161C26', border: '1px solid #38BDF8' }}>
        <h3 style={{ fontSize: '1.2rem', color: '#FFFFFF', fontWeight: 800, margin: '0 0 1rem', fontFamily: 'var(--font-heading)' }}>
          Memory Garden Growth Stages
        </h3>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
          <div style={{ padding: '1.1rem', backgroundColor: totalActivities >= 0 ? 'rgba(52, 211, 153, 0.12)' : '#0D1117', borderRadius: '14px', border: totalActivities >= 0 ? '1px solid #34D399' : '1px solid #263142' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.3rem' }}>
              <Sprout size={18} color="#34D399" />
              <div style={{ fontWeight: 800, color: '#34D399' }}>Day 1 — Seed</div>
            </div>
            <div style={{ fontSize: '0.82rem', color: '#94A3B8' }}>First cognitive activity planted</div>
          </div>

          <div style={{ padding: '1.1rem', backgroundColor: totalActivities >= 5 ? 'rgba(56, 189, 248, 0.12)' : '#0D1117', borderRadius: '14px', border: totalActivities >= 5 ? '1px solid #38BDF8' : '1px solid #263142' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.3rem' }}>
              <Leaf size={18} color="#38BDF8" />
              <div style={{ fontWeight: 800, color: '#38BDF8' }}>Day 5 — Plant</div>
            </div>
            <div style={{ fontSize: '0.82rem', color: '#94A3B8' }}>5 activities completed</div>
          </div>

          <div style={{ padding: '1.1rem', backgroundColor: totalActivities >= 10 ? 'rgba(192, 132, 252, 0.12)' : '#0D1117', borderRadius: '14px', border: totalActivities >= 10 ? '1px solid #C084FC' : '1px solid #263142' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.3rem' }}>
              <Flower2 size={18} color="#C084FC" />
              <div style={{ fontWeight: 800, color: '#C084FC' }}>Day 10 — Flower</div>
            </div>
            <div style={{ fontSize: '0.82rem', color: '#94A3B8' }}>10 activities completed</div>
          </div>

          <div style={{ padding: '1.1rem', backgroundColor: totalActivities >= 30 ? 'rgba(251, 191, 36, 0.12)' : '#0D1117', borderRadius: '14px', border: totalActivities >= 30 ? '1px solid #FBBF24' : '1px solid #263142' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.3rem' }}>
              <TreePine size={18} color="#FBBF24" />
              <div style={{ fontWeight: 800, color: '#FBBF24' }}>Day 30 — Memory Tree</div>
            </div>
            <div style={{ fontSize: '0.82rem', color: '#94A3B8' }}>30+ activities completed</div>
          </div>
        </div>
      </div>

      {/* 3D WebGL Garden Canvas */}
      <ThreeMemoryGardenCanvas />

      {/* Visual Cognitive Area Elements */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.4rem' }}>
        {gardenElements.map((elem, idx) => {
          const Icon = elem.icon;

          return (
            <div key={idx} className="garden-card animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div className="icon-box" style={{ width: 44, height: 44, borderRadius: '12px', backgroundColor: 'rgba(56, 189, 248, 0.15)', border: `1px solid ${elem.color}` }}>
                  <Icon size={22} color={elem.color} />
                </div>
                <span className="badge badge-cyan">{elem.stage}</span>
              </div>

              <h3 style={{ fontSize: '1.2rem', color: '#FFFFFF', fontWeight: 800, margin: 0 }}>
                {elem.title}
              </h3>

              <div style={{ fontSize: '0.85rem', color: '#94A3B8' }}>
                {elem.category} • Index Score: <strong style={{ color: elem.color }}>{elem.score}/100</strong>
              </div>

              <div style={{ width: '100%', backgroundColor: '#0D1117', height: 8, borderRadius: 4, overflow: 'hidden', border: '1px solid #263142' }}>
                <div style={{ width: `${elem.score}%`, height: '100%', backgroundColor: elem.color, transition: 'width 0.3s ease' }} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MemoryGardenPage;
