import React from 'react';
import { useSearchParams } from 'react-router-dom';
import SpatialMazeNavigator from '../games/SpatialMazeNavigator';
import ToneRhythmRecall from '../games/ToneRhythmRecall';
import ThreeDFlowerMatch from '../games/ThreeDFlowerMatch';
import ThreeDTargetSearch from '../games/ThreeDTargetSearch';
import ThreeDReactionOrbs from '../games/ThreeDReactionOrbs';
import NumberRecall from '../games/NumberRecall';
import PatternRecall from '../games/PatternRecall';
import WordRecall from '../games/WordRecall';
import AttentionChallenge from '../games/AttentionChallenge';
import MemoryMatch from '../games/MemoryMatch';
import ReactionTest from '../games/ReactionTest';
import ThreeMemoryGardenCanvas from '../components/ThreeMemoryGardenCanvas';
import { soundFx } from '../utils/soundEffects';
import { Brain, Target, RotateCcw, Zap, BookOpen, Layers, ArrowLeft, Box, Gamepad2, Compass, Music } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Assessment = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const currentGame = searchParams.get('game');
  const { t } = useAuth();
  const games = [
    {
      id: 'spatial-maze',
      title: 'Spatial Maze Navigator',
      category: 'Spatial Orientation',
      icon: Compass,
      color: '#38BDF8',
      desc: 'Procedural 2D/3D orientation and spatial navigation maze challenge for elderly memory training.',
      badge: 'NEW DYNAMIC'
    },
    {
      id: 'tone-rhythm',
      title: 'Acoustic Rhythm & Tone Recall',
      category: 'Auditory Memory',
      icon: Music,
      color: '#C084FC',
      desc: 'Interactive audio-visual harmonic tone sequence recall game with dynamic pattern scaling.',
      badge: 'NEW DYNAMIC'
    },
    {
      id: '3d-memory',
      title: 'Spatial Node Matrix',
      category: '3D Memory Matrix',
      icon: Box,
      color: '#38BDF8',
      desc: 'Interactive 3D Three.js WebGL Quantum Node flip game with procedural color pairs.',
      badge: 'DYNAMIC 3D'
    },
    {
      id: '3d-target',
      title: '3D Target Focus Search',
      category: 'Target Precision',
      icon: Target,
      color: '#FB923C',
      desc: 'Interactive 3D Target Search using Three.js raycasting to find target quantum crystals.',
      badge: 'DYNAMIC 3D'
    },
    {
      id: '3d-reaction',
      title: 'Quantum Speed Reflex',
      category: 'Reaction Speed',
      icon: Zap,
      color: '#FBBF24',
      desc: 'Orbiting WebGL 3D Target Orbs measuring real-time spatial reaction speed in milliseconds.',
      badge: 'DYNAMIC 3D'
    },
    {
      id: 'focus-reflex',
      title: 'Focus Reflex & Math Matrix',
      category: 'Executive Focus',
      icon: Zap,
      color: '#34D399',
      desc: 'Procedural focus and mental calculation challenges scaling dynamically with your level.',
      badge: 'PROCEDURAL'
    },
    {
      id: 'card-match',
      title: 'Card Memory Matrix',
      category: 'Visual Memory',
      icon: Brain,
      color: '#C084FC',
      desc: 'Procedurally generated card matching game to train visual recall and concentration.',
      badge: 'PROCEDURAL'
    },
    {
      id: 'speed-reaction',
      title: 'Speed Reflex Reaction Test',
      category: 'Motor Speed',
      icon: Zap,
      color: '#FB923C',
      desc: 'Motor reaction speed test measuring response velocity in milliseconds.',
      badge: 'PROCEDURAL'
    },
    {
      id: 'number',
      title: '3D Dual-N-Back & Number Recall',
      category: 'Sequence Recall',
      icon: RotateCcw,
      color: '#C084FC',
      desc: 'Procedural digit sequence memorization scaling from 3 to 10 digits based on progress.',
      badge: 'DYNAMIC 3D'
    },
    {
      id: 'pattern',
      title: '3D Holographic Matrix',
      category: 'Pattern Memory',
      icon: Layers,
      color: '#34D399',
      desc: '3D grid matrix of illuminated WebGL cubes to reinforce spatial pattern recognition.',
      badge: 'DYNAMIC 3D'
    },
    {
      id: 'word',
      title: '3D Categorical Word Recall',
      category: 'Categorical Recall',
      icon: BookOpen,
      color: '#38BDF8',
      desc: 'Revolving 3D Three.js WebGL word spheres for multi-category item recall.',
      badge: 'DYNAMIC 3D'
    }
  ];

  const handleLaunchGame = (gameId) => {
    soundFx.playLevelUp();
    setSearchParams({ game: gameId });
  };

  const gameAliasMap = {
    'spatial-maze': 'spatial-maze',
    'tone-rhythm': 'tone-rhythm',
    'attention': '3d-target',
    '3d-target': '3d-target',
    'memory': '3d-memory',
    '3d-memory': '3d-memory',
    'recall': 'number',
    'number': 'number',
    'reaction': '3d-reaction',
    '3d-reaction': '3d-reaction',
    'pattern': 'pattern',
    'word': 'word',
    'focus-reflex': 'focus-reflex',
    'card-match': 'card-match',
    'speed-reaction': 'speed-reaction'
  };

  const activeGameKey = currentGame ? (gameAliasMap[currentGame] || currentGame) : null;

  if (activeGameKey) {
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
          <span>{t('backToExercises') || 'BACK TO EXERCISE HUB'}</span>
        </button>

        {activeGameKey === 'spatial-maze' && <SpatialMazeNavigator />}
        {activeGameKey === 'tone-rhythm' && <ToneRhythmRecall />}
        {activeGameKey === '3d-memory' && <ThreeDFlowerMatch />}
        {activeGameKey === '3d-target' && <ThreeDTargetSearch />}
        {activeGameKey === '3d-reaction' && <ThreeDReactionOrbs />}
        {activeGameKey === 'number' && <NumberRecall />}
        {activeGameKey === 'pattern' && <PatternRecall />}
        {activeGameKey === 'word' && <WordRecall />}
        {activeGameKey === 'focus-reflex' && <AttentionChallenge />}
        {activeGameKey === 'card-match' && <MemoryMatch />}
        {activeGameKey === 'speed-reaction' && <ReactionTest />}
      </div>
    );
  }

  return (
    <div className="page-view animate-fade-in" style={{ gap: '1.5rem' }}>
      <div className="garden-card">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.4rem' }}>
          <div className="icon-box" style={{ width: 44, height: 44, borderRadius: '12px', backgroundColor: 'rgba(56, 189, 248, 0.15)', border: '1px solid rgba(56, 189, 248, 0.35)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
            <Brain size={26} color="#38BDF8" />
          </div>
          <h1 style={{ fontSize: '1.9rem', color: '#FFFFFF', fontWeight: 900, fontFamily: 'var(--font-heading)', margin: 0 }}>
            {t('navExercises').toUpperCase()}
          </h1>
        </div>
        <p style={{ color: '#94A3B8', fontSize: '0.95rem', lineHeight: 1.5 }}>
          {t('exercisesSub') || 'Select a dynamic, non-repetitive cognitive exercise below. All games feature procedural generation and zero delay execution.'}
        </p>
      </div>

      {/* Interactive 3D Mind Matrix Canvas */}
      <ThreeMemoryGardenCanvas />

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
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
                <div className="icon-box" style={{
                  width: 48,
                  height: 48,
                  borderRadius: '14px',
                  backgroundColor: 'rgba(56, 189, 248, 0.15)',
                  border: `1px solid ${g.color}`,
                  marginBottom: '1rem',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justify: 'center'
                }}>
                  <Icon size={24} color={g.color} />
                </div>

                <div className="badge badge-purple" style={{ marginBottom: '0.5rem', fontSize: '0.75rem' }}>
                  {g.category}
                </div>

                <h3 style={{ fontSize: '1.3rem', color: '#FFFFFF', fontWeight: 900, marginBottom: '0.4rem', fontFamily: 'var(--font-heading)' }}>
                  {g.title}
                </h3>

                <p style={{ color: '#94A3B8', fontSize: '0.9rem', lineHeight: 1.5, marginBottom: '1.4rem' }}>
                  {g.desc}
                </p>
              </div>

              <button
                onClick={() => handleLaunchGame(g.id)}
                className="btn-primary"
                style={{ width: '100%', padding: '0.85rem' }}
              >
                <Gamepad2 size={18} />
                <span>{t('startGame') || 'START GAME'}</span>
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Assessment;
