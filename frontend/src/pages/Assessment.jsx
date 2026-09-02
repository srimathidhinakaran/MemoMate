import React from 'react';
import { useSearchParams } from 'react-router-dom';
import ThreeDFlowerMatch from '../games/ThreeDFlowerMatch';
import ThreeDTargetSearch from '../games/ThreeDTargetSearch';
import ThreeDReactionOrbs from '../games/ThreeDReactionOrbs';
import NumberRecall from '../games/NumberRecall';
import PatternRecall from '../games/PatternRecall';
import WordRecall from '../games/WordRecall';
import ThreeMemoryGardenCanvas from '../components/ThreeMemoryGardenCanvas';
import { Brain, Target, RotateCcw, Zap, BookOpen, Layers, ArrowLeft, Box } from 'lucide-react';

const Assessment = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const currentGame = searchParams.get('game');

  const games = [
    {
      id: '3d-memory',
      title: '3D Memory Match',
      category: '3D Spatial Memory',
      icon: Box,
      color: '#58755E',
      bg: '#EBF2EC',
      desc: 'WebGL 3D Wooden Block Flip game with physics & spatial memory matching.',
      highlight: true,
      badge: '3D WebGL'
    },
    {
      id: '3d-target',
      title: '3D Focus Search',
      category: '3D Visual Focus',
      icon: Target,
      color: '#C87862',
      bg: '#FDF3F0',
      desc: 'Interactive 3D Meadow Target Search using Three.js raycasting to find target gems.',
      highlight: true,
      badge: '3D WebGL'
    },
    {
      id: '3d-reaction',
      title: '3D Reaction Orbs',
      category: '3D Spatial Speed',
      icon: Zap,
      color: '#C87862',
      bg: '#FDF3F0',
      desc: 'Orbiting WebGL 3D Target Orbs measuring real-time 3D spatial reaction speed in milliseconds.',
      highlight: true,
      badge: '3D WebGL'
    },
    {
      id: 'number',
      title: 'Number Recall',
      category: 'Sequence Recall',
      icon: RotateCcw,
      color: '#7A66A3',
      bg: '#F2EFF9',
      desc: 'Short sequence memorization to strengthen short-term memory accuracy.'
    },
    {
      id: 'pattern',
      title: 'Pattern Recall',
      category: 'Pattern Memory',
      icon: Layers,
      color: '#3B7A8C',
      bg: '#EBF6F8',
      desc: 'Grid visualization challenge to reinforce spatial pattern recognition.'
    },
    {
      id: 'word',
      title: 'Regional Word Recall',
      category: 'Regional Memory',
      icon: BookOpen,
      color: '#58755E',
      bg: '#EBF2EC',
      desc: 'North Eastern regional flora & item recall for familiar cognitive exercise.'
    }
  ];

  if (currentGame) {
    return (
      <div className="page-view animate-fade-in">
        <button
          onClick={() => setSearchParams({})}
          className="btn-secondary"
          style={{ width: 'fit-content', padding: '0.5rem 1.1rem', fontSize: '0.9rem' }}
        >
          <ArrowLeft size={18} />
          <span>Back to Cognitive Games Hub</span>
        </button>

        {currentGame === '3d-memory' && <ThreeDFlowerMatch />}
        {currentGame === '3d-target' && <ThreeDTargetSearch />}
        {currentGame === '3d-reaction' && <ThreeDReactionOrbs />}
        {currentGame === 'number' && <NumberRecall />}
        {currentGame === 'pattern' && <PatternRecall />}
        {currentGame === 'word' && <WordRecall />}
      </div>
    );
  }

  return (
    <div className="page-view animate-fade-in">
      <div className="garden-card">
        <h1 style={{ fontSize: '1.8rem', color: '#1C3B2B', marginBottom: '0.4rem' }}>
          Cognitive Gamification Hub
        </h1>
        <p style={{ color: '#536B5C', fontSize: '1.05rem' }}>
          Select a 3D WebGL or cognitive activity below. Real-time performance metrics automatically update your Scikit-Learn ML Model & MongoDB Atlas database.
        </p>
      </div>

      {/* 3D Garden Interactive Canvas Showcase */}
      <ThreeMemoryGardenCanvas />

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: '1.5rem',
        marginTop: '1rem'
      }}>
        {games.map((g) => {
          const Icon = g.icon;
          return (
            <div
              key={g.id}
              className="garden-card animate-fade-in"
              style={{
                display: 'flex',
                flexDirection: 'column',
                justify: 'space-between',
                position: 'relative'
              }}
            >
              {g.badge ? (
                <span className="badge badge-lavender" style={{ position: 'absolute', top: 16, right: 16 }}>
                  {g.badge}
                </span>
              ) : g.highlight && (
                <span className="badge badge-peach" style={{ position: 'absolute', top: 16, right: 16 }}>
                  Recommended Focus
                </span>
              )}

              <div>
                <div style={{
                  width: 50,
                  height: 50,
                  borderRadius: '16px',
                  backgroundColor: g.bg,
                  display: 'flex',
                  alignItems: 'center',
                  justify: 'center',
                  marginBottom: '1rem'
                }}>
                  <Icon size={26} color={g.color} />
                </div>

                <div className="badge badge-sage" style={{ marginBottom: '0.5rem' }}>
                  {g.category}
                </div>

                <h3 style={{ fontSize: '1.4rem', color: '#1C3B2B', marginBottom: '0.5rem' }}>
                  {g.title}
                </h3>

                <p style={{ color: '#536B5C', fontSize: '0.95rem', lineHeight: 1.5, marginBottom: '1.5rem' }}>
                  {g.desc}
                </p>
              </div>

              <button
                onClick={() => setSearchParams({ game: g.id })}
                className={g.badge === '3D WebGL' ? 'btn-peach' : 'btn-primary'}
                style={{ width: '100%' }}
              >
                <span>Play {g.title}</span>
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Assessment;
