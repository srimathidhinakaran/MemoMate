import React, { useState, useEffect, useRef } from 'react';
import * as THREE from 'three';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { soundFx } from '../utils/soundEffects';
import { sessionAPI } from '../services/api';
import { RotateCcw, CheckCircle2, ArrowRight } from 'lucide-react';

const NumberRecall = ({ onComplete }) => {
  const { user, updateStateFromSession, speakText, voiceAssistance, level, t } = useAuth();
  const navigate = useNavigate();
  const mountRef = useRef(null);

  const [stage, setStage] = useState('memorize'); // 'memorize' | 'input' | 'completed'
  const [targetNumber, setTargetNumber] = useState('');
  const [userInput, setUserInput] = useState('');
  const [countdown, setCountdown] = useState(4);
  const [scoreResult, setScoreResult] = useState(null);

  const digitLength = Math.min(10, Math.max(3, 3 + Math.floor((level || 1) / 2)));

  useEffect(() => {
    startNewGame();
  }, []);

  const startNewGame = () => {
    soundFx.playClick();
    let numStr = '';
    for (let i = 0; i < digitLength; i++) {
      numStr += Math.floor(Math.random() * 10).toString();
    }
    setTargetNumber(numStr);
    setUserInput('');
    setStage('memorize');
    setCountdown(4);

    if (voiceAssistance) {
      speakText(`${t('numberRecallTitle')}. ${numStr}`);
    }
  };

  // 3D Three.js WebGL Scene for Floating Number Crystal Nodes
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

    // Floating 3D Crystal Nodes representing digits
    const crystalsGroup = new THREE.Group();
    const nodeColors = [0x38BDF8, 0xFBBF24, 0xC084FC, 0x34D399, 0xFB923C];

    const displayCount = Math.min(6, digitLength);
    for (let i = 0; i < displayCount; i++) {
      const geo = new THREE.DodecahedronGeometry(0.6, 1);
      const mat = new THREE.MeshStandardMaterial({
        color: nodeColors[i % nodeColors.length],
        roughness: 0.2,
        metalness: 0.8,
        emissive: nodeColors[i % nodeColors.length],
        emissiveIntensity: 0.3
      });
      const mesh = new THREE.Mesh(geo, mat);
      mesh.position.set(-3.5 + i * 1.4, 0, 0);
      crystalsGroup.add(mesh);
    }
    scene.add(crystalsGroup);

    let frameId;
    let clock = new THREE.Clock();

    const animate = () => {
      frameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      crystalsGroup.children.forEach((child, idx) => {
        child.rotation.y = elapsedTime * (1 + idx * 0.2);
        child.rotation.x = elapsedTime * (0.5 + idx * 0.1);
        child.position.y = Math.sin(elapsedTime * 2 + idx) * 0.2;
      });

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
  }, [stage, digitLength]);

  useEffect(() => {
    let timer;
    if (stage === 'memorize' && countdown > 0) {
      timer = setInterval(() => setCountdown((c) => c - 1), 1000);
    } else if (stage === 'memorize' && countdown === 0) {
      setStage('input');
    }
    return () => clearInterval(timer);
  }, [stage, countdown]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    soundFx.playClick();
    const isCorrect = userInput.trim() === targetNumber;
    const calculatedScore = isCorrect ? 95 : 50;

    const sessionPayload = {
      userId: user?.id || user?._id,
      activity: 'Dual-N-Back & Number Recall',
      category: 'recall',
      difficulty: digitLength > 5 ? 'Hard' : 'Medium',
      score: calculatedScore,
      accuracy: isCorrect ? 100 : 0
    };

    const result = await sessionAPI.createSession(sessionPayload);
    updateStateFromSession(result);

    setScoreResult({
      score: calculatedScore,
      isCorrect,
      targetNumber,
      userInput
    });
    setStage('completed');
    if (onComplete) {
      onComplete({ score: calculatedScore, isCorrect });
    }
    if (isCorrect) soundFx.playLevelUp();
  };

  if (stage === 'completed' && scoreResult) {
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
          {t('missionComplete') || '3D NUMBER RECALL COMPLETE!'}
        </h2>

        <div style={{
          backgroundColor: '#0B0E14',
          padding: '1.25rem',
          borderRadius: '16px',
          border: '1px solid #263142',
          marginBottom: '1.75rem'
        }}>
          <div style={{ fontSize: '0.85rem', color: '#94A3B8', fontWeight: 800 }}>{t('numberRecallTitle').toUpperCase() || 'RECALL SCORE'}</div>
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
          <h2 style={{ fontSize: '1.6rem', color: '#FFFFFF', fontWeight: 900 }}>{t('numberRecallTitle') || '3D DUAL-N-BACK & NUMBER RECALL'}</h2>
          <p style={{ fontSize: '0.95rem', color: '#94A3B8' }}>
            {stage === 'memorize' ? (t('numberRecallGameDesc') || 'Memorize sequence below.') : (t('numberRecallTitle') || 'Enter digits recalled.')}
          </p>
        </div>
        <span className="badge badge-cyan">{stage === 'memorize' ? `${countdown}s` : '✓'}</span>
      </div>

      {/* 3D WebGL Floating Crystals Scene */}
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

      {stage === 'memorize' ? (
        <div style={{
          backgroundColor: 'rgba(56, 189, 248, 0.1)',
          border: '1px solid rgba(56, 189, 248, 0.4)',
          borderRadius: '16px',
          padding: '1.5rem',
          margin: '1rem 0'
        }}>
          <div style={{ fontSize: '3rem', fontWeight: 900, letterSpacing: '0.5rem', color: '#38BDF8', fontFamily: 'var(--font-heading)' }}>
            {targetNumber}
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} style={{ margin: '1rem 0' }}>
          <input
            type="number"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            placeholder="..."
            autoFocus
            style={{
              width: '100%',
              fontSize: '2rem',
              padding: '0.85rem',
              borderRadius: '14px',
              border: '2px solid #38BDF8',
              backgroundColor: '#0B0E14',
              color: '#FFFFFF',
              fontFamily: 'var(--font-heading)',
              textAlign: 'center',
              outline: 'none',
              marginBottom: '1.25rem'
            }}
          />
          <button type="submit" className="btn-primary" style={{ width: '100%', padding: '0.85rem' }}>
            {t('startMissionNow') || 'SUBMIT ANSWER'}
          </button>
        </form>
      )}
    </div>
  );
};

export default NumberRecall;
