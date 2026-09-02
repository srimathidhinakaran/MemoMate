import React from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle2, Target, Clock, Lock, ArrowDown } from 'lucide-react';

const CognitivePath = ({ recommendation }) => {
  const targetActivity = recommendation?.recommendedActivity || '3D Focus Search';

  const steps = [
    {
      title: 'Memory Match',
      status: 'completed',
      category: 'Memory',
      badgeText: 'Completed',
      desc: 'Score: 82 / 100 — Completed earlier today',
      route: '/assessment?game=3d-memory'
    },
    {
      title: targetActivity,
      status: 'current',
      category: recommendation?.weakArea || 'Attention',
      badgeText: 'Current Focus',
      desc: `Recommended next activity based on your metric profile`,
      route: '/assessment?game=3d-target'
    },
    {
      title: 'Number Recall',
      status: 'next',
      category: 'Recall',
      badgeText: 'Next Up',
      desc: 'Sequence memory exercise',
      route: '/assessment?game=number'
    },
    {
      title: 'Pattern Recall',
      status: 'upcoming',
      category: 'Pattern Memory',
      badgeText: 'Upcoming Stage',
      desc: 'Grid visualization challenge',
      route: '/assessment?game=pattern'
    }
  ];

  return (
    <div className="garden-card animate-fade-in">
      <div className="garden-card-header">
        <div>
          <h3 style={{ fontSize: '1.35rem', color: '#1C3B2B' }}>Today's Cognitive Path</h3>
          <p style={{ fontSize: '0.9rem', color: '#536B5C' }}>
            Your sequence dynamically adapts based on your latest performance scores.
          </p>
        </div>
        <Link to="/path" style={{ color: '#58755E', fontWeight: 600, fontSize: '0.9rem', textDecoration: 'none' }}>
          View Timeline →
        </Link>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', position: 'relative' }}>
        {steps.map((step, idx) => {
          const isCurrent = step.status === 'current';
          const isCompleted = step.status === 'completed';

          return (
            <React.Fragment key={step.title + idx}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '1.25rem',
                backgroundColor: isCurrent ? '#FDF3F0' : isCompleted ? '#F7F4EE' : '#FFFFFF',
                border: isCurrent ? '2px solid #F4C3B2' : '1px solid #E6E0D4',
                padding: '1.2rem 1.4rem',
                borderRadius: '18px',
                boxShadow: isCurrent ? '0 8px 24px rgba(200, 120, 98, 0.12)' : 'none',
                transition: 'all 0.2s ease'
              }}>
                <div style={{
                  width: 44,
                  height: 44,
                  borderRadius: '50%',
                  backgroundColor: isCompleted ? '#EBF2EC' : isCurrent ? '#FDF3F0' : '#F7F4EE',
                  display: 'flex',
                  alignItems: 'center',
                  justify: 'center',
                  flexShrink: 0
                }}>
                  {isCompleted && <CheckCircle2 size={24} color="#58755E" />}
                  {isCurrent && <Target size={24} color="#C87862" className="animate-pulse-gentle" />}
                  {step.status === 'next' && <Clock size={22} color="#7A66A3" />}
                  {step.status === 'upcoming' && <Lock size={20} color="#7E9687" />}
                </div>

                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.2rem' }}>
                    <span style={{ fontSize: '1.15rem', fontWeight: 700, color: '#1C3B2B' }}>
                      {step.title}
                    </span>
                    <span className={`badge ${isCompleted ? 'badge-sage' : isCurrent ? 'badge-peach' : 'badge-lavender'}`}>
                      {step.badgeText}
                    </span>
                  </div>
                  <div style={{ fontSize: '0.88rem', color: '#536B5C' }}>
                    {step.desc}
                  </div>
                </div>

                {isCurrent && (
                  <Link to={step.route} className="btn-peach" style={{ padding: '0.5rem 1.1rem', fontSize: '0.9rem', textDecoration: 'none' }}>
                    Play Now
                  </Link>
                )}
              </div>

              {idx < steps.length - 1 && (
                <div style={{ display: 'flex', justifyContent: 'center', margin: '-0.4rem 0' }}>
                  <ArrowDown size={20} color={isCurrent ? '#C87862' : '#7E9687'} />
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};

export default CognitivePath;
