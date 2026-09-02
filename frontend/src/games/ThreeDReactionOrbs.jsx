import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { sessionAPI } from '../services/api';
import { Zap, CheckCircle2, RotateCcw, ArrowRight, Award } from 'lucide-react';

const ThreeDReactionOrbs = () => {
  const { user, updateStateFromSession, speakText, voiceAssistance } = useAuth();
  const navigate = useNavigate();
  const mountRef = useRef(null);

  const [score, setScore] = useState(0);
  const [reactionMs, setReactionMs] = useState(null);
  const [gameState, setGameState] = useState('idle'); // 'idle' | 'waiting' | 'glow' | 'done'
  const [submitting, setSubmitting] = useState(false);
  const [scoreResult, setScoreResult] = useState(null);

  const targetMeshRef = useRef(null);
  const glowTimeRef = useRef(null);
  const timerRef = useRef(null);

  useEffect(() => {
    const currentMount = mountRef.current;
    if (!currentMount) return;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xFDFBF7);

    const camera = new THREE.PerspectiveCamera(50, currentMount.clientWidth / currentMount.clientHeight, 0.1, 100);
    camera.position.set(0, 0, 7);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(currentMount.clientWidth, currentMount.clientHeight);
    currentMount.appendChild(renderer.domElement);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0xffb74d, 1.5, 20);
    pointLight.position.set(2, 3, 4);
    scene.add(pointLight);

    // 3D Target Orb Sphere
    const orbGeo = new THREE.SphereGeometry(1.4, 32, 32);
    const orbMat = new THREE.MeshStandardMaterial({
      color: 0x7C9A82,
      roughness: 0.2,
      metalness: 0.3,
      emissive: 0x1C3B2B,
      emissiveIntensity: 0.2
    });
    const orb = new THREE.Mesh(orbGeo, orbMat);
    targetMeshRef.current = orb;
    scene.add(orb);

    // Surrounding floating decorative Orbs
    const decGroup = new THREE.Group();
    for (let i = 0; i < 6; i++) {
      const smallGeo = new THREE.SphereGeometry(0.3, 16, 16);
      const smallMat = new THREE.MeshStandardMaterial({ color: 0xB8A7D9 });
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
    setGameState('waiting');
    setReactionMs(null);

    if (targetMeshRef.current) {
      targetMeshRef.current.material.color.setHex(0x7C9A82);
      targetMeshRef.current.material.emissive.setHex(0x1C3B2B);
    }

    const delay = 1800 + Math.random() * 2500;
    timerRef.current = setTimeout(() => {
      setGameState('glow');
      glowTimeRef.current = Date.now();

      if (targetMeshRef.current) {
        targetMeshRef.current.material.color.setHex(0xFFB74D); // Golden Glow
        targetMeshRef.current.material.emissive.setHex(0xFF6F00);
        targetMeshRef.current.material.emissiveIntensity = 0.8;
      }

      if (voiceAssistance) speakText("TAP THE 3D ORB NOW!");
    }, delay);
  };

  const handleOrbClick = async () => {
    if (gameState === 'waiting') {
      clearTimeout(timerRef.current);
      alert("Wait for the 3D Orb to glow golden before tapping!");
      setGameState('idle');
    } else if (gameState === 'glow') {
      const ms = Date.now() - glowTimeRef.current;
      setReactionMs(ms);

      const calculatedScore = Math.max(50, Math.min(100, Math.round(100 - (ms - 240) * 0.1)));

      setSubmitting(true);
      const sessionPayload = {
        userId: user?.id || user?._id,
        activity: '3D Reaction Orbs',
        category: 'reaction',
        difficulty: 'Medium',
        score: calculatedScore,
        reactionTime: ms
      };

      const result = await sessionAPI.createSession(sessionPayload);
      updateStateFromSession(result);
      setSubmitting(false);

      setScoreResult({ score: calculatedScore, ms });
      setGameState('done');

      if (targetMeshRef.current) {
        targetMeshRef.current.material.color.setHex(0x58755E);
      }

      if (voiceAssistance) {
        speakText(`3D Reaction complete! Speed ${ms} milliseconds.`);
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
          backgroundColor: '#EBF6F8',
          display: 'flex',
          alignItems: 'center',
          justify: 'center',
          margin: '0 auto 1.25rem'
        }}>
          <CheckCircle2 size={44} color="#3B7A8C" />
        </div>

        <h2 style={{ fontSize: '2rem', marginBottom: '0.5rem', color: '#1C3B2B' }}>
          3D Reaction Test Complete! ⚡
        </h2>

        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '1rem',
          backgroundColor: '#F7F4EE',
          padding: '1.25rem',
          borderRadius: '18px',
          marginBottom: '1.75rem',
          textAlign: 'left'
        }}>
          <div>
            <div style={{ fontSize: '0.85rem', color: '#7E9687', fontWeight: 600 }}>Reaction Score</div>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: '#3B7A8C' }}>{scoreResult.score} / 100</div>
          </div>
          <div>
            <div style={{ fontSize: '0.85rem', color: '#7E9687', fontWeight: 600 }}>3D Spatial Speed</div>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: '#1C3B2B' }}>{scoreResult.ms} ms</div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
          <button onClick={start3DTest} className="btn-secondary">
            <RotateCcw size={18} />
            <span>Play Again</span>
          </button>
          <button onClick={() => navigate('/analysis')} className="btn-peach">
            <Award size={18} />
            <span>Analyse Performance</span>
            <ArrowRight size={18} />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="garden-card animate-fade-in" style={{ maxWidth: 700, margin: '0 auto', textAlign: 'center' }}>
      <h2 style={{ fontSize: '1.6rem', color: '#1C3B2B', marginBottom: '0.4rem' }}>3D Reaction Orbs ⚡</h2>
      <p style={{ color: '#536B5C', marginBottom: '1.25rem' }}>
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
          backgroundColor: gameState === 'glow' ? '#FDF3F0' : '#F7F4EE',
          border: gameState === 'glow' ? '3px solid #C87862' : '1.5px solid #E6E0D4',
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
          <div style={{ position: 'absolute', bottom: 20, fontWeight: 700, color: '#536B5C', zIndex: 10 }}>
            Wait for 3D Orb to glow golden...
          </div>
        )}

        {gameState === 'glow' && (
          <div style={{ position: 'absolute', bottom: 20, fontWeight: 800, color: '#C87862', fontSize: '1.2rem', zIndex: 10 }}>
            TAP THE GOLDEN 3D ORB NOW! ⚡
          </div>
        )}
      </div>
    </div>
  );
};

export default ThreeDReactionOrbs;
