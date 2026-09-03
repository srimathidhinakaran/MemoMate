import React from 'react';
import { useSearchParams } from 'react-router-dom';
import ThreeDFlowerMatch from '../games/ThreeDFlowerMatch';
import ThreeDTargetSearch from '../games/ThreeDTargetSearch';
import ThreeDReactionOrbs from '../games/ThreeDReactionOrbs';
import NumberRecall from '../games/NumberRecall';
import PatternRecall from '../games/PatternRecall';
import WordRecall from '../games/WordRecall';
import ThreeMemoryGardenCanvas from '../components/ThreeMemoryGardenCanvas';
import { soundFx } from '../utils/soundEffects';
import { Brain, Target, RotateCcw, Zap, BookOpen, Layers, ArrowLeft, Box, Sparkles, Swords } from 'lucide-react';

const Assessment = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const currentGame = searchParams.get('game');

  const games = [
    {
      id: '3d-memory',
      title: '3D Memory Match',
      category: '3D Spatial Memory',
      icon: Box,
      color: '#00F2FE',
      desc: 'Interactive 3D Three.js WebGL Wooden Block Flip game with 3D color matching.',
      badge: '3D WEBGL'
    },
    {
      id: '3d-target',
      title: '3D Focus Search',
      category: '3D Visual Focus',
      icon: Target,
      color: '#FF4E50',
      desc: 'Interactive 3D Meadow Target Search using Three.js raycasting to find target gems.',
      badge: '3D WEBGL'
    },
    {
      id: '3d-reaction',
      title: '3D Reaction Orbs',
      category: '3D Spatial Speed',
      icon: Zap,
      color: '#FFD700',
      desc: 'Orbiting WebGL 3D Target Orbs measuring real-time 3D spatial reaction speed in milliseconds.',
      badge: '3D WEBGL'
    },
    {
      id: 'number',
      title: '3D Number Crystals',
      category: 'Sequence Recall',
      icon: RotateCcw,
      color: '#A855F7',
      desc: 'Floating 3D Three.js WebGL numbered crystal dodecahedrons for sequence memorization.',
      badge: '3D WEBGL'
    },
    {
      id: 'pattern',
      title: '3D Holographic Matrix',
      category: 'Pattern Memory',
      icon: Layers,
      color: '#00E676',
      desc: '3D grid matrix of illuminated WebGL cubes to reinforce spatial pattern recognition.',
      badge: '3D WEBGL'
    },
    {
      id: 'word',
      title: '3D Cyber Word Spheres',
      category: 'Regional Memory',
      icon: BookOpen,
      color: '#00F2FE',
      desc: 'Revolving 3D Three.js WebGL word spheres for regional garden item recall.',
      badge: '3D WEBGL'
    }
  ];

  const handleLaunchGame = (gameId) => {
    soundFx.playLevelUp();
    setSearchParams({ game: gameId });
  };

  if (currentGame) {
    return (
      <div className="page-view animate-fade-in" style={{ gap: '1.2rem' }}>
        <button
          onClick={() => {
            soundFx.playClick();
            setSearchParams({});
          }}
          className="btn-secondary"
          style={{ width: 'fit-content', padding: '0.6rem 1.25rem', fontSize: '0.85rem' }}
        >
          <ArrowLeft size={18} />
          <span>BACK TO COGNITIVE ARENA HUB</span>
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
    <div className="page-view animate-fade-in" style={{ gap: '1.5rem' }}>
      <div className="garden-card">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.4rem' }}>
          <Swords size={28} color="#00F2FE" />
          <h1 style={{ fontSize: '2rem', color: '#F8FAFC', fontWeight: 900, fontFamily: 'var(--font-heading)', margin: 0 }}>
            3D THREE.JS COGNITIVE ARENA HUB
          </h1>
        </div>
        <p style={{ color: '#94A3B8', fontSize: '1.05rem' }}>
          Select a 100% 3D Three.js WebGL interactive mission below. Real-time performance metrics automatically update your Groq AI Model & MongoDB Atlas database.
        </p>
      </div>

      {/* Interactive 3D Memory Garden Canvas */}
      <ThreeMemoryGardenCanvas />

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: '1.4rem'
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
              <span className="badge badge-cyan" style={{ position: 'absolute', top: 16, right: 16 }}>
                {g.badge}
              </span>

              <div>
                <div style={{
                  width: 50,
                  height: 50,
                  borderRadius: '14px',
                  background: `linear-gradient(135deg, ${g.color}25 0%, rgba(15, 20, 36, 0.9) 100%)`,
                  border: `1px solid ${g.color}`,
                  display: 'flex',
                  alignItems: 'center',
                  justify: 'center',
                  marginBottom: '1rem'
                }}>
                  <Icon size={26} color={g.color} />
                </div>

                <div className="badge badge-purple" style={{ marginBottom: '0.5rem', fontSize: '0.7rem' }}>
                  {g.category}
                </div>

                <h3 style={{ fontSize: '1.35rem', color: '#F8FAFC', fontWeight: 900, marginBottom: '0.4rem', fontFamily: 'var(--font-heading)' }}>
                  {g.title}
                </h3>

                <p style={{ color: '#94A3B8', fontSize: '0.92rem', lineHeight: 1.5, marginBottom: '1.4rem' }}>
                  {g.desc}
                </p>
              </div>

              <button
                onClick={() => handleLaunchGame(g.id)}
                className="btn-flame"
                style={{ width: '100%' }}
              >
                <span>LAUNCH 3D MISSION</span>
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Assessment;
