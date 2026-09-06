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
import NERCulturalGame from '../games/NERCulturalGame';

const Assessment = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const currentGame = searchParams.get('game');
  const { t } = useAuth();
  const games = [
    {
      id: 'ner-cultural',
      titleKey: 'nerCulturalTitle',
      categoryKey: 'culturalPersonalizationCategory',
      descKey: 'nerCulturalDesc',
      badgeKey: 'regionalHeritageBadge',
      title: 'North Eastern Cultural Memories',
      category: 'Regional Personalization',
      desc: 'Culturally familiar memory & object recognition for elderly patients in North Eastern Region.',
      badge: 'NER HERITAGE',
      icon: Compass,
      color: '#34D399'
    },
    {
      id: 'spatial-maze',
      titleKey: 'spatialMazeTitle',
      categoryKey: 'spatialOrientationCategory',
      descKey: 'spatialMazeDesc',
      badgeKey: 'newDynamicBadge',
      title: 'Spatial Maze Navigator',
      category: 'Spatial Orientation',
      desc: 'Procedural 2D/3D orientation and spatial navigation maze challenge for elderly memory training.',
      badge: 'NEW DYNAMIC',
      icon: Compass,
      color: '#38BDF8'
    },
    {
      id: 'tone-rhythm',
      titleKey: 'toneRhythmTitle',
      categoryKey: 'auditoryMemoryCategory',
      descKey: 'toneRhythmDesc',
      badgeKey: 'newDynamicBadge',
      title: 'Acoustic Rhythm & Tone Recall',
      category: 'Auditory Memory',
      desc: 'Interactive audio-visual harmonic tone sequence recall game with dynamic pattern scaling.',
      badge: 'NEW DYNAMIC',
      icon: Music,
      color: '#C084FC'
    },
    {
      id: '3d-memory',
      titleKey: 'spatialNodeTitle',
      categoryKey: 'memoryMatrixCategory',
      descKey: 'spatialNodeDesc',
      badgeKey: 'dynamic3dBadge',
      title: 'Spatial Node Matrix',
      category: '3D Memory Matrix',
      desc: 'Interactive 3D Three.js WebGL Quantum Node flip game with procedural color pairs.',
      badge: 'DYNAMIC 3D',
      icon: Box,
      color: '#38BDF8'
    },
    {
      id: '3d-target',
      titleKey: 'targetFocusTitle',
      categoryKey: 'targetPrecisionCategory',
      descKey: 'targetFocusDesc',
      badgeKey: 'dynamic3dBadge',
      title: '3D Target Focus Search',
      category: 'Target Precision',
      desc: 'Interactive 3D Target Search using Three.js raycasting to find target quantum crystals.',
      badge: 'DYNAMIC 3D',
      icon: Target,
      color: '#FB923C'
    },
    {
      id: '3d-reaction',
      titleKey: 'quantumSpeedTitle',
      categoryKey: 'reactionSpeedCategory',
      descKey: 'quantumSpeedDesc',
      badgeKey: 'dynamic3dBadge',
      title: 'Quantum Speed Reflex',
      category: 'Reaction Speed',
      desc: 'Orbiting WebGL 3D Target Orbs measuring real-time spatial reaction speed in milliseconds.',
      badge: 'DYNAMIC 3D',
      icon: Zap,
      color: '#FBBF24'
    },
    {
      id: 'focus-reflex',
      titleKey: 'focusReflexTitle',
      categoryKey: 'executiveFocusCategory',
      descKey: 'focusReflexDesc',
      badgeKey: 'proceduralBadge',
      title: 'Focus Reflex & Math Matrix',
      category: 'Executive Focus',
      desc: 'Procedural focus and mental calculation challenges scaling dynamically with your level.',
      badge: 'PROCEDURAL',
      icon: Zap,
      color: '#34D399'
    },
    {
      id: 'card-match',
      titleKey: 'cardMatchTitle',
      categoryKey: 'visualMemoryCategory',
      descKey: 'cardMatchDesc',
      badgeKey: 'proceduralBadge',
      title: 'Card Memory Matrix',
      category: 'Visual Memory',
      desc: 'Procedurally generated card matching game to train visual recall and concentration.',
      badge: 'PROCEDURAL',
      icon: Brain,
      color: '#C084FC'
    },
    {
      id: 'speed-reaction',
      titleKey: 'speedReactionTitle',
      categoryKey: 'motorSpeedCategory',
      descKey: 'speedReactionDesc',
      badgeKey: 'proceduralBadge',
      title: 'Speed Reflex Reaction Test',
      category: 'Motor Speed',
      desc: 'Motor reaction speed test measuring response velocity in milliseconds.',
      badge: 'PROCEDURAL',
      icon: Zap,
      color: '#FB923C'
    },
    {
      id: 'number',
      titleKey: 'numberRecallGameTitle',
      categoryKey: 'sequenceRecallCategory',
      descKey: 'numberRecallGameDesc',
      badgeKey: 'dynamic3dBadge',
      title: '3D Dual-N-Back & Number Recall',
      category: 'Sequence Recall',
      desc: 'Procedural digit sequence memorization scaling from 3 to 10 digits based on progress.',
      badge: 'DYNAMIC 3D',
      icon: RotateCcw,
      color: '#C084FC'
    },
    {
      id: 'pattern',
      titleKey: 'holographicTitle',
      categoryKey: 'patternMemoryCategory',
      descKey: 'holographicDesc',
      badgeKey: 'dynamic3dBadge',
      title: '3D Holographic Matrix',
      category: 'Pattern Memory',
      desc: '3D grid matrix of illuminated WebGL cubes to reinforce spatial pattern recognition.',
      badge: 'DYNAMIC 3D',
      icon: Layers,
      color: '#34D399'
    },
    {
      id: 'word',
      titleKey: 'wordRecallTitle',
      categoryKey: 'categoricalRecallCategory',
      descKey: 'wordRecallDesc',
      badgeKey: 'dynamic3dBadge',
      title: '3D Categorical Word Recall',
      category: 'Categorical Recall',
      desc: 'Revolving 3D Three.js WebGL word spheres for multi-category item recall.',
      badge: 'DYNAMIC 3D',
      icon: BookOpen,
      color: '#38BDF8'
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

        {activeGameKey === 'ner-cultural' && <NERCulturalGame />}
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
          const gameTitle = t(g.titleKey) || g.title;
          const gameCategory = t(g.categoryKey) || g.category;
          const gameDesc = t(g.descKey) || g.desc;
          const gameBadge = t(g.badgeKey) || g.badge;

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
                {gameBadge}
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
                  {gameCategory}
                </div>

                <h3 style={{ fontSize: '1.3rem', color: '#FFFFFF', fontWeight: 900, marginBottom: '0.4rem', fontFamily: 'var(--font-heading)' }}>
                  {gameTitle}
                </h3>

                <p style={{ color: '#94A3B8', fontSize: '0.9rem', lineHeight: 1.5, marginBottom: '1.4rem' }}>
                  {gameDesc}
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
