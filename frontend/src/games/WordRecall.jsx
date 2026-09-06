import React, { useState, useEffect, useRef } from 'react';
import * as THREE from 'three';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { soundFx } from '../utils/soundEffects';
import { sessionAPI } from '../services/api';
import { BookOpen, CheckCircle2, RotateCcw, ArrowRight } from 'lucide-react';

const CATEGORY_WORD_BANKS = [
  ['Quantum Core ⚡', 'Neural Node 🧠', 'Cyber Crystal 💎', 'Shield Barrier 🛡️', 'Solar Array ☀️', 'Starlight Prism ✨'],
  ['Memory Matrix 🧩', 'Focus Beacon 🎯', 'Velocity Vector 🚀', 'Atomic Orbit ⚛️', 'Laser Optics 💡', 'Gravity Field 🪐'],
  ['Purity Stream 🌊', 'Mountain Crest ⛰️', 'Emerald Leaf 🍃', 'Golden Aura 🌟', 'Diamond Shield 💎', 'Cosmic Nebula 🌌']
];

const WordRecall = () => {
  const { user, updateStateFromSession, speakText, voiceAssistance, t } = useAuth();
  const navigate = useNavigate();
  const mountRef = useRef(null);

  const [targetWords, setTargetWords] = useState([]);
  const [options, setOptions] = useState([]);
  const [selected, setSelected] = useState([]);
  const [phase, setPhase] = useState('memorize'); // 'memorize' | 'recall' | 'done'
  const [countdown, setCountdown] = useState(5);
  const [scoreResult, setScoreResult] = useState(null);

  const nodesGroupRef = useRef(null);

  useEffect(() => {
    startNewGame();
  }, []);

  const startNewGame = () => {
    soundFx.playClick();
    const bank = CATEGORY_WORD_BANKS[Math.floor(Math.random() * CATEGORY_WORD_BANKS.length)];
    const shuffled = [...bank].sort(() => Math.random() - 0.5);
    const targets = shuffled.slice(0, 3);
    const opts = shuffled.slice(0, 6).sort(() => Math.random() - 0.5);

    setTargetWords(targets);
    setOptions(opts);
    setSelected([]);
    setPhase('memorize');
    setCountdown(5);

    if (voiceAssistance) {
      speakText(`${t('wordRecallTitle')}. ${targets.join(', ')}`);
    }
  };

  // 3D Three.js WebGL Scene for Revolving Word Spheres
  useEffect(() => {
    const currentMount = mountRef.current;
    if (!currentMount) return;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0B0E14);

    const camera = new THREE.PerspectiveCamera(45, currentMount.clientWidth / currentMount.clientHeight, 0.1, 100);
    camera.position.set(0, 0, 8);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(currentMount.clientWidth, currentMount.clientHeight);
    currentMount.appendChild(renderer.domElement);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0x38BDF8, 2, 20);
    pointLight.position.set(3, 4, 5);
    scene.add(pointLight);

    const nodesGroup = new THREE.Group();
    nodesGroupRef.current = nodesGroup;

    const colors = [0x38BDF8, 0xFBBF24, 0xC084FC, 0x34D399, 0xFB923C, 0x3182CE];

    for (let i = 0; i < 6; i++) {
      const angle = (i / 6) * Math.PI * 2;
      const radius = 2.8;
      const x = Math.cos(angle) * radius;
      const y = Math.sin(angle) * radius;

      const geo = new THREE.OctahedronGeometry(0.6, 1);
      const mat = new THREE.MeshStandardMaterial({
        color: colors[i],
        roughness: 0.2,
        metalness: 0.8,
        emissive: colors[i],
        emissiveIntensity: 0.4
      });

      const mesh = new THREE.Mesh(geo, mat);
      mesh.position.set(x, y, 0);
      nodesGroup.add(mesh);
    }
    scene.add(nodesGroup);

    let frameId;
    let clock = new THREE.Clock();

    const animate = () => {
      frameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      if (nodesGroupRef.current) {
        nodesGroupRef.current.rotation.z = elapsedTime * 0.3;
        nodesGroupRef.current.children.forEach((child) => {
          child.rotation.y = elapsedTime * 1.2;
          child.rotation.x = elapsedTime * 0.8;
        });
      }

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      if (!currentMount) return;
      camera.aspect = currentMount.clientWidth / currentMount.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(currentMount.clientWidth, currentMount.clientHeight);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(frameId);
      if (currentMount.contains(renderer.domElement)) {
        currentMount.removeChild(renderer.domElement);
      }
    };
  }, []);

  useEffect(() => {
    let timer;
    if (phase === 'memorize' && countdown > 0) {
      timer = setInterval(() => setCountdown((c) => c - 1), 1000);
    } else if (phase === 'memorize' && countdown === 0) {
      setPhase('recall');
    }
    return () => clearInterval(timer);
  }, [phase, countdown]);

  const handleSelectWord = async (word) => {
    if (phase !== 'recall') return;
    soundFx.playClick();

    let newSel;
    if (selected.includes(word)) {
      newSel = selected.filter((w) => w !== word);
    } else {
      newSel = [...selected, word];
    }
    setSelected(newSel);

    if (newSel.length === 3) {
      const correctCount = newSel.filter((w) => targetWords.includes(w)).length;
      const score = Math.round((correctCount / 3) * 100);

      const sessionPayload = {
        userId: user?.id || user?._id,
        activity: 'Categorical Word Recall',
        category: 'recall',
        difficulty: 'Medium',
        score,
        accuracy: score
      };

      const result = await sessionAPI.createSession(sessionPayload);
      updateStateFromSession(result);

      setScoreResult({ score, correctCount });
      setPhase('done');
      soundFx.playLevelUp();
    }
  };

  if (phase === 'done' && scoreResult) {
    return (
      <div className="garden-card animate-fade-in" style={{ textAlign: 'center', padding: '2.5rem 1.5rem', maxWidth: 650, margin: '0 auto' }}>
        <div style={{
          width: 70,
          height: 70,
          borderRadius: '50%',
          backgroundColor: 'rgba(56, 189, 248, 0.15)',
          display: 'flex',
          alignItems: 'center',
          justify: 'center',
          margin: '0 auto 1.25rem',
          border: '1px solid #38BDF8'
        }}>
          <CheckCircle2 size={44} color="#38BDF8" />
        </div>

        <h2 style={{ fontSize: '2rem', marginBottom: '0.5rem', color: '#FFFFFF', fontWeight: 900 }}>
          {t('missionComplete') || 'CATEGORICAL RECALL COMPLETE!'}
        </h2>

        <div style={{
          backgroundColor: '#0B0E14',
          padding: '1.25rem',
          borderRadius: '16px',
          border: '1px solid #263142',
          marginBottom: '1.75rem'
        }}>
          <div style={{ fontSize: '0.85rem', color: '#94A3B8', fontWeight: 800 }}>{t('wordRecallTitle').toUpperCase() || 'RECALL SCORE'}</div>
          <div style={{ fontSize: '2.5rem', fontWeight: 900, color: '#FBBF24' }}>{scoreResult.score} / 100 {t('pts') || 'PTS'}</div>
        </div>

        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
          <button onClick={startNewGame} className="btn-secondary">
            <RotateCcw size={18} />
            <span>{t('playAgain') || 'PLAY AGAIN'}</span>
          </button>
          <button onClick={() => navigate('/dashboard')} className="btn-flame">
            <span>{t('navDashboard').toUpperCase() || 'DASHBOARD'}</span>
            <ArrowRight size={18} />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="garden-card animate-fade-in" style={{ maxWidth: 700, margin: '0 auto', textAlign: 'center' }}>
      <div className="garden-card-header">
        <div>
          <h2 style={{ fontSize: '1.6rem', color: '#FFFFFF', fontWeight: 900 }}>{t('wordRecallTitle') || '3D CATEGORICAL WORD RECALL'}</h2>
          <p style={{ fontSize: '0.95rem', color: '#94A3B8' }}>
            {phase === 'memorize' ? (t('wordRecallDesc') || 'Memorize the items below!') : (t('wordRecallTitle') || 'Select the items you saw.')}
          </p>
        </div>
        <span className="badge badge-cyan">{phase === 'memorize' ? `${countdown}s` : '3'}</span>
      </div>

      {/* 3D WebGL Revolving Word Spheres Scene */}
      <div
        ref={mountRef}
        style={{
          width: '100%',
          height: '220px',
          borderRadius: '16px',
          backgroundColor: '#0B0E14',
          border: '1px solid rgba(56, 189, 248, 0.3)',
          margin: '1rem 0',
          position: 'relative'
        }}
      />

      {phase === 'memorize' ? (
        <div style={{
          backgroundColor: 'rgba(56, 189, 248, 0.1)',
          border: '1px solid rgba(56, 189, 248, 0.4)',
          borderRadius: '16px',
          padding: '1.5rem',
          margin: '1rem 0',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.8rem'
        }}>
          {targetWords.map((w, idx) => (
            <span key={idx} style={{ fontSize: '1.4rem', fontWeight: 900, color: '#38BDF8', fontFamily: 'var(--font-heading)' }}>
              {w}
            </span>
          ))}
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', margin: '1rem 0' }}>
          {options.map((word, idx) => {
            const isSel = selected.includes(word);
            return (
              <button
                key={idx}
                onClick={() => handleSelectWord(word)}
                style={{
                  padding: '1.1rem 1rem',
                  borderRadius: '14px',
                  border: isSel ? '2px solid #38BDF8' : '1px solid #263142',
                  backgroundColor: isSel ? 'rgba(56, 189, 248, 0.15)' : '#0B0E14',
                  fontSize: '1rem',
                  fontWeight: 800,
                  color: isSel ? '#38BDF8' : '#FFFFFF',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
              >
                {word}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default WordRecall;
