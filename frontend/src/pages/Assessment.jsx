import React, { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { soundFx } from '../utils/soundEffects';
import { cognitiveService } from '../services/cognitiveService';

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
import ThreeMemoryGardenCanvas from '../components/ThreeMemoryGardenCanvas';

import {
  ArrowLeft,
  Brain,
  Compass,
  Music,
  Box,
  Target,
  Zap,
  RotateCcw,
  Layers,
  BookOpen,
  Gamepad2,
  Sparkles,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

const Assessment = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const currentGame = searchParams.get('game');
  const isBaselineMode = searchParams.get('baseline') === 'true';

  const { t, setProfile, setRecommendation } = useAuth();

  // Baseline Assessment state (4-step mini flow for new users)
  const [baselineStep, setBaselineStep] = useState(0); // 0: Welcome, 1: Memory, 2: Attention, 3: Recall, 4: Reaction, 5: Complete
  const [baselineScores, setBaselineScores] = useState({
    memoryScore: 80,
    attentionScore: 75,
    recallScore: 78,
    reactionScore: 72
  });

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
      id: '3d-memory',
      titleKey: 'spatialNodeTitle',
      categoryKey: 'memoryMatrixCategory',
      descKey: 'spatialNodeDesc',
      badgeKey: 'dynamic3dBadge',
      title: 'Spatial Node Matrix',
      category: '3D Memory Matrix',
      desc: 'Interactive 3D WebGL Quantum Node flip game with procedural color pairs.',
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
      id: 'spatial-maze',
      titleKey: 'spatialMazeTitle',
      categoryKey: 'spatialOrientationCategory',
      descKey: 'spatialMazeDesc',
      badgeKey: 'newDynamicBadge',
      title: 'Spatial Maze Navigator',
      category: 'Spatial Orientation',
      desc: 'Procedural orientation and spatial navigation maze challenge for elderly memory training.',
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
    'speed-reaction': 'speed-reaction',
    'ner-cultural': 'ner-cultural'
  };

  const activeGameKey = currentGame ? (gameAliasMap[currentGame] || currentGame) : null;

  // Handle Baseline Assessment Complete
  const handleFinishBaseline = () => {
    soundFx.playGameWin();
    const { profile, recommendation } = cognitiveService.saveBaselineAssessment(baselineScores);
    setProfile(profile);
    setRecommendation(recommendation);
    navigate('/dashboard');
  };

  // Render Baseline Assessment Flow
  if (isBaselineMode) {
    return (
      <div className="page-view animate-fade-in" style={{ maxWidth: '800px', margin: '0 auto', gap: '1.5rem' }}>
        <div className="garden-card" style={{ borderColor: '#38BDF8', backgroundColor: '#161C26', textAlign: 'center', padding: '2rem' }}>
          <div className="icon-box" style={{ width: 56, height: 56, borderRadius: '16px', backgroundColor: 'rgba(56, 189, 248, 0.15)', border: '1px solid #38BDF8', margin: '0 auto 1rem' }}>
            <Sparkles size={32} color="#38BDF8" />
          </div>
          <h1 style={{ fontSize: '2.1rem', color: '#FFFFFF', fontWeight: 900, fontFamily: 'var(--font-heading)', margin: '0 0 0.5rem' }}>
            {t('welcomeMemoMate') || 'WELCOME TO MEMOMATE'}
          </h1>
          <p style={{ color: '#E2E8F0', fontSize: '1.1rem', margin: '0 0 1.5rem' }}>
            {t('baselineIntro') || "Let's understand your starting point with a quick, gentle cognitive baseline assessment."}
          </p>

          {baselineStep === 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', alignItems: 'center' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem', width: '100%', maxWidth: '600px', textAlign: 'left' }}>
                <div style={{ backgroundColor: '#0D1117', padding: '1rem', borderRadius: '12px', border: '1px solid #263142' }}>
                  <Brain size={20} color="#38BDF8" />
                  <div style={{ fontWeight: 800, color: '#FFFFFF', marginTop: '0.4rem' }}>1. Memory</div>
                  <div style={{ fontSize: '0.8rem', color: '#94A3B8' }}>Visual recall match</div>
                </div>
                <div style={{ backgroundColor: '#0D1117', padding: '1rem', borderRadius: '12px', border: '1px solid #263142' }}>
                  <Target size={20} color="#FB923C" />
                  <div style={{ fontWeight: 800, color: '#FFFFFF', marginTop: '0.4rem' }}>2. Attention</div>
                  <div style={{ fontSize: '0.8rem', color: '#94A3B8' }}>Target identification</div>
                </div>
                <div style={{ backgroundColor: '#0D1117', padding: '1rem', borderRadius: '12px', border: '1px solid #263142' }}>
                  <RotateCcw size={20} color="#C084FC" />
                  <div style={{ fontWeight: 800, color: '#FFFFFF', marginTop: '0.4rem' }}>3. Recall</div>
                  <div style={{ fontSize: '0.8rem', color: '#94A3B8' }}>Sequence memorization</div>
                </div>
                <div style={{ backgroundColor: '#0D1117', padding: '1rem', borderRadius: '12px', border: '1px solid #263142' }}>
                  <Zap size={20} color="#34D399" />
                  <div style={{ fontWeight: 800, color: '#FFFFFF', marginTop: '0.4rem' }}>4. Reaction</div>
                  <div style={{ fontSize: '0.8rem', color: '#94A3B8' }}>Response velocity</div>
                </div>
              </div>

              <button
                onClick={() => setBaselineStep(1)}
                className="btn-primary"
                style={{ padding: '1rem 2.5rem', fontSize: '1.1rem', borderRadius: '14px', marginTop: '1rem' }}
              >
                <span>{t('beginBaseline') || 'BEGIN ASSESSMENT'}</span>
              </button>
            </div>
          )}

          {baselineStep === 1 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'center' }}>
              <span className="badge badge-cyan">STEP 1 OF 4 • MEMORY</span>
              <h2 style={{ color: '#FFFFFF', fontSize: '1.4rem' }}>Memory Match Activity</h2>
              <div style={{ width: '100%', minHeight: '300px' }}>
                <ThreeDFlowerMatch onComplete={(res) => {
                  if (res?.score) setBaselineScores(prev => ({ ...prev, memoryScore: res.score }));
                }} />
              </div>
              <button onClick={() => setBaselineStep(2)} className="btn-primary" style={{ padding: '0.85rem 2rem' }}>
                <span>NEXT: ATTENTION TEST →</span>
              </button>
            </div>
          )}

          {baselineStep === 2 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'center' }}>
              <span className="badge badge-flame">STEP 2 OF 4 • ATTENTION</span>
              <h2 style={{ color: '#FFFFFF', fontSize: '1.4rem' }}>Target Search Activity</h2>
              <div style={{ width: '100%', minHeight: '300px' }}>
                <ThreeDTargetSearch onComplete={(res) => {
                  if (res?.score) setBaselineScores(prev => ({ ...prev, attentionScore: res.score }));
                }} />
              </div>
              <button onClick={() => setBaselineStep(3)} className="btn-primary" style={{ padding: '0.85rem 2rem' }}>
                <span>NEXT: RECALL TEST →</span>
              </button>
            </div>
          )}

          {baselineStep === 3 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'center' }}>
              <span className="badge badge-purple">STEP 3 OF 4 • RECALL</span>
              <h2 style={{ color: '#FFFFFF', fontSize: '1.4rem' }}>Digit Sequence Recall</h2>
              <div style={{ width: '100%', minHeight: '300px' }}>
                <NumberRecall onComplete={(res) => {
                  if (res?.score) setBaselineScores(prev => ({ ...prev, recallScore: res.score }));
                }} />
              </div>
              <button onClick={() => setBaselineStep(4)} className="btn-primary" style={{ padding: '0.85rem 2rem' }}>
                <span>NEXT: REACTION TEST →</span>
              </button>
            </div>
          )}

          {baselineStep === 4 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'center' }}>
              <span className="badge badge-green">STEP 4 OF 4 • REACTION</span>
              <h2 style={{ color: '#FFFFFF', fontSize: '1.4rem' }}>Reflex Speed Test</h2>
              <div style={{ width: '100%', minHeight: '300px' }}>
                <ReactionTest onComplete={(res) => {
                  if (res?.score) setBaselineScores(prev => ({ ...prev, reactionScore: res.score }));
                }} />
              </div>
              <button onClick={() => setBaselineStep(5)} className="btn-primary" style={{ padding: '0.85rem 2rem' }}>
                <span>CALCULATE PROFILE →</span>
              </button>
            </div>
          )}

          {baselineStep === 5 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', alignItems: 'center' }}>
              <div className="icon-box" style={{ width: 64, height: 64, borderRadius: '50%', backgroundColor: 'rgba(52, 211, 153, 0.2)', border: '2px solid #34D399' }}>
                <CheckCircle2 size={36} color="#34D399" />
              </div>
              <h2 style={{ color: '#FFFFFF', fontSize: '1.8rem', fontWeight: 900 }}>
                {t('profileReady') || 'Your initial cognitive profile is ready!'}
              </h2>
              <p style={{ color: '#94A3B8', fontSize: '1rem', maxWidth: '500px' }}>
                MemoMate calculated your baseline metrics based on your actual performance during the assessment.
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem', width: '100%', maxWidth: '400px' }}>
                <div style={{ backgroundColor: '#0D1117', padding: '1rem', borderRadius: '12px', border: '1px solid #263142' }}>
                  <div style={{ fontSize: '0.8rem', color: '#94A3B8' }}>Memory</div>
                  <div style={{ fontSize: '1.8rem', fontWeight: 900, color: '#38BDF8' }}>{baselineScores.memoryScore}/100</div>
                </div>
                <div style={{ backgroundColor: '#0D1117', padding: '1rem', borderRadius: '12px', border: '1px solid #263142' }}>
                  <div style={{ fontSize: '0.8rem', color: '#94A3B8' }}>Attention</div>
                  <div style={{ fontSize: '1.8rem', fontWeight: 900, color: '#FB923C' }}>{baselineScores.attentionScore}/100</div>
                </div>
                <div style={{ backgroundColor: '#0D1117', padding: '1rem', borderRadius: '12px', border: '1px solid #263142' }}>
                  <div style={{ fontSize: '0.8rem', color: '#94A3B8' }}>Recall</div>
                  <div style={{ fontSize: '1.8rem', fontWeight: 900, color: '#C084FC' }}>{baselineScores.recallScore}/100</div>
                </div>
                <div style={{ backgroundColor: '#0D1117', padding: '1rem', borderRadius: '12px', border: '1px solid #263142' }}>
                  <div style={{ fontSize: '0.8rem', color: '#94A3B8' }}>Reaction</div>
                  <div style={{ fontSize: '1.8rem', fontWeight: 900, color: '#34D399' }}>{baselineScores.reactionScore}/100</div>
                </div>
              </div>

              <button onClick={handleFinishBaseline} className="btn-primary" style={{ padding: '1rem 2.5rem', fontSize: '1.1rem', borderRadius: '14px' }}>
                <span>{t('goToDashboard') || 'GO TO MY DASHBOARD'}</span>
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Active Game View with Fail-Safe Component Mapping
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
          <span>{t('backToExercises') || '← BACK TO EXERCISE HUB'}</span>
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

        {/* Fallback if key doesn't match any component */}
        {!['ner-cultural', 'spatial-maze', 'tone-rhythm', '3d-memory', '3d-target', '3d-reaction', 'number', 'pattern', 'word', 'focus-reflex', 'card-match', 'speed-reaction'].includes(activeGameKey) && (
          <div className="garden-card" style={{ padding: '2rem', textAlign: 'center', borderColor: '#FB923C' }}>
            <AlertCircle size={40} color="#FB923C" style={{ margin: '0 auto 1rem' }} />
            <h2 style={{ color: '#FFFFFF', marginBottom: '0.5rem' }}>Unable to load requested activity</h2>
            <p style={{ color: '#94A3B8', marginBottom: '1.5rem' }}>Your requested exercise is ready to play below.</p>
            <button onClick={() => setSearchParams({ game: '3d-memory' })} className="btn-primary">
              <span>START MEMORY MATCH GAME</span>
            </button>
          </div>
        )}
      </div>
    );
  }

  // Cognitive Arena / Game Hub Main Screen
  return (
    <div className="page-view animate-fade-in" style={{ gap: '1.5rem' }}>
      <div className="garden-card">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.4rem' }}>
          <div className="icon-box" style={{ width: 44, height: 44, borderRadius: '12px', backgroundColor: 'rgba(56, 189, 248, 0.15)', border: '1px solid rgba(56, 189, 248, 0.35)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
            <Brain size={26} color="#38BDF8" />
          </div>
          <h1 style={{ fontSize: '1.9rem', color: '#FFFFFF', fontWeight: 900, fontFamily: 'var(--font-heading)', margin: 0 }}>
            {t('navExercises') || 'MEMOMATE COGNITIVE ARENA'}
          </h1>
        </div>
        <p style={{ color: '#94A3B8', fontSize: '0.95rem', lineHeight: 1.5 }}>
          {t('exercisesSub') || 'Select a dynamic cognitive activity below. All games adapt difficulty based on your real performance.'}
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
