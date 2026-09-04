import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { sessionAPI } from '../services/api';
import { soundFx } from '../utils/soundEffects';
import { Zap, CheckCircle2, RotateCcw, ArrowRight } from 'lucide-react';

const ThreeDReactionOrbs = () => {
  const { user, updateStateFromSession, speakText, voiceAssistance, t } = useAuth();
  const navigate = useNavigate();
  const mountRef = useRef(null);

  const [scoreResult, setScoreResult] = useState(null);
  const [gameState, setGameState] = useState('idle'); // 'idle' | 'waiting' | 'glow' | 'done'

  const targetMeshRef = useRef(null);
  const glowTimeRef = useRef(null);
  const timerRef = useRef(null);

  useEffect(() => {
    const currentMount = mountRef.current;
    if (!currentMount) return;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0B0E14);

    const camera = new THREE.PerspectiveCamera(50, currentMount.clientWidth / currentMount.clientHeight, 0.1, 100);
    camera.position.set(0, 0, 7);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(currentMount.clientWidth, currentMount.clientHeight);
    currentMount.appendChild(renderer.domElement);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0x38BDF8, 2, 20);
    pointLight.position.set(2, 3, 4);
    scene.add(pointLight);

    // 3D Target Orb Sphere
    const orbGeo = new THREE.SphereGeometry(1.4, 32, 32);
    const orbMat = new THREE.MeshStandardMaterial({
      color: 0x222B3B,
      roughness: 0.2,
      metalness: 0.8,
      emissive: 0x38BDF8,
      emissiveIntensity: 0.2
    });
    const orb = new THREE.Mesh(orbGeo, orbMat);
    targetMeshRef.current = orb;
    scene.add(orb);

    // Surrounding floating decorative Orbs
    const decGroup = new THREE.Group();
    for (let i = 0; i < 6; i++) {
      const smallGeo = new THREE.SphereGeometry(0.3, 16, 16);
      const smallMat = new THREE.MeshStandardMaterial({ color: 0xC084FC });
      const smallMesh = new THREE.Mesh(smallGeo, smallMat);
      const angle = (i / 6) * Math.PI * 2;
      smallMesh.position.set(Math.cos(angle) * 3, Math.sin(angle) * 3, 0);
      decGroup.add(smallMesh);
    }
    scene.add(decGroup);

    let frameId;
    let clock = new THREE.Clock();

    const animate = () => {
      frameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      orb.rotation.y = elapsedTime * 0.5;
      orb.rotation.x = elapsedTime * 0.3;
      decGroup.rotation.z = -elapsedTime * 0.4;

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

  const start3DTest = () => {
    soundFx.playClick();
    setGameState('waiting');

    if (targetMeshRef.current) {
      targetMeshRef.current.material.color.setHex(0x222B3B);
      targetMeshRef.current.material.emissive.setHex(0x38BDF8);
      targetMeshRef.current.material.emissiveIntensity = 0.2;
    }

    const delay = 1200 + Math.random() * 2000;
    timerRef.current = setTimeout(() => {
      setGameState('glow');
      glowTimeRef.current = Date.now();

      if (targetMeshRef.current) {
        targetMeshRef.current.material.color.setHex(0xFBBF24);
        targetMeshRef.current.material.emissive.setHex(0xFBBF24);
        targetMeshRef.current.material.emissiveIntensity = 0.9;
      }

      soundFx.playSuccess();
      if (voiceAssistance) speakText("TAP THE 3D ORB NOW!");
    }, delay);
  };

  const handleOrbClick = async () => {
    if (gameState === 'waiting') {
      clearTimeout(timerRef.current);
      soundFx.playCardMismatch();
      alert("Wait for the 3D Orb to glow golden before tapping!");
      setGameState('idle');
    } else if (gameState === 'glow') {
      const ms = Date.now() - glowTimeRef.current;
      soundFx.playLevelUp();

      const calculatedScore = Math.max(50, Math.min(100, Math.round(100 - (ms - 220) * 0.1)));

      const sessionPayload = {
        userId: user?.id || user?._id,
        activity: 'Quantum Reflex Orbs',
        category: 'reaction',
        difficulty: 'Medium',
        score: calculatedScore,
        reactionTime: ms
      };

      const result = await sessionAPI.createSession(sessionPayload);
      updateStateFromSession(result);

      setScoreResult({ score: calculatedScore, ms });
      setGameState('done');

      if (targetMeshRef.current) {
        targetMeshRef.current.material.color.setHex(0x34D399);
      }
    }
  };

  if (gameState === 'done' && scoreResult) {
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
          3D REACTION TEST COMPLETE! ⚡
        </h2>

        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '1rem',
          backgroundColor: '#0B0E14',
          padding: '1.25rem',
          borderRadius: '16px',
          border: '1px solid #263142',
          marginBottom: '1.75rem',
          textAlign: 'left'
        }}>
          <div>
            <div style={{ fontSize: '0.85rem', color: '#94A3B8', fontWeight: 700 }}>Reaction Score</div>
            <div style={{ fontSize: '2rem', fontWeight: 900, color: '#FBBF24' }}>{scoreResult.score} / 100</div>
          </div>
          <div>
            <div style={{ fontSize: '0.85rem', color: '#94A3B8', fontWeight: 700 }}>Spatial Speed</div>
            <div style={{ fontSize: '2rem', fontWeight: 900, color: '#38BDF8' }}>{scoreResult.ms} ms</div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
          <button onClick={start3DTest} className="btn-secondary">
            <RotateCcw size={18} />
            <span>Play Again</span>
          </button>
          <button onClick={() => navigate('/dashboard')} className="btn-flame">
            <span>Dashboard</span>
            <ArrowRight size={18} />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="garden-card animate-fade-in" style={{ maxWidth: 700, margin: '0 auto', textAlign: 'center' }}>
      <h2 style={{ fontSize: '1.6rem', color: '#FFFFFF', fontWeight: 900, marginBottom: '0.4rem' }}>Quantum Speed Reflex Orbs ⚡</h2>
      <p style={{ color: '#94A3B8', marginBottom: '1.25rem' }}>
        Press START, then tap the center 3D sphere as soon as it glows golden!
      </p>

      {/* 3D WebGL Canvas Container */}
      <div
        ref={mountRef}
        onClick={handleOrbClick}
        style={{
          width: '100%',
          height: 320,
          borderRadius: '24px',
          backgroundColor: '#0B0E14',
          border: gameState === 'glow' ? '3px solid #FBBF24' : '1px solid #263142',
          cursor: gameState === 'glow' || gameState === 'waiting' ? 'pointer' : 'default',
          margin: '1rem 0',
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justify: 'center'
        }}
      >
        {gameState === 'idle' && (
          <button onClick={start3DTest} className="btn-primary" style={{ padding: '1.1rem 2.25rem', fontSize: '1.2rem', zIndex: 10 }}>
            <Zap size={22} />
            <span>START 3D TEST</span>
          </button>
        )}

        {gameState === 'waiting' && (
          <div style={{ position: 'absolute', bottom: 20, fontWeight: 700, color: '#94A3B8', zIndex: 10 }}>
            Wait for 3D Orb to glow golden...
          </div>
        )}

        {gameState === 'glow' && (
          <div style={{ position: 'absolute', bottom: 20, fontWeight: 800, color: '#FBBF24', fontSize: '1.2rem', zIndex: 10 }}>
            TAP THE GOLDEN 3D ORB NOW! ⚡
          </div>
        )}
      </div>
    </div>
  );
};

export default ThreeDReactionOrbs;
