import React, { useState, useEffect, useRef } from 'react';
import * as THREE from 'three';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { soundFx } from '../utils/soundEffects';
import { sessionAPI } from '../services/api';
import { CheckCircle2, RotateCcw, ArrowRight, Grid } from 'lucide-react';

const PatternRecall = () => {
  const { user, updateStateFromSession, speakText, voiceAssistance } = useAuth();
  const navigate = useNavigate();
  const mountRef = useRef(null);

  const [pattern, setPattern] = useState([]);
  const [selected, setSelected] = useState([]);
  const [phase, setPhase] = useState('show'); // 'show' | 'guess' | 'done'
  const [scoreResult, setScoreResult] = useState(null);

  const cubesGroupRef = useRef(null);
  const patternRef = useRef([]);
  const selectedRef = useRef([]);

  useEffect(() => {
    startNewPattern();
  }, []);

  const startNewPattern = () => {
    soundFx.playClick();
    const indices = [];
    while (indices.length < 3) {
      const r = Math.floor(Math.random() * 9);
      if (!indices.includes(r)) indices.push(r);
    }
    setPattern(indices);
    patternRef.current = indices;
    setSelected([]);
    selectedRef.current = [];
    setPhase('show');

    if (voiceAssistance) {
      speakText("Memorize the glowing 3D matrix cubes.");
    }

    setTimeout(() => {
      setPhase('guess');
    }, 3200);
  };

  // 3D Three.js WebGL Holographic Grid Matrix Scene
  useEffect(() => {
    const currentMount = mountRef.current;
    if (!currentMount) return;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x090C15);

    const camera = new THREE.PerspectiveCamera(45, currentMount.clientWidth / currentMount.clientHeight, 0.1, 100);
    camera.position.set(0, 0, 7.5);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(currentMount.clientWidth, currentMount.clientHeight);
    currentMount.appendChild(renderer.domElement);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0x00F2FE, 1.5);
    dirLight.position.set(4, 5, 6);
    scene.add(dirLight);

    // 3x3 Grid of 3D WebGL Cubes
    const cubesGroup = new THREE.Group();
    cubesGroupRef.current = cubesGroup;

    for (let i = 0; i < 9; i++) {
      const row = Math.floor(i / 3);
      const col = i % 3;

      const geo = new THREE.BoxGeometry(1.2, 1.2, 0.3);
      const mat = new THREE.MeshStandardMaterial({
        color: 0x121829,
        roughness: 0.3,
        metalness: 0.7,
        emissive: 0x000000,
        emissiveIntensity: 0
      });

      const cube = new THREE.Mesh(geo, mat);
      cube.position.set(-1.6 + col * 1.6, 1.6 - row * 1.6, 0);
      cube.userData = { index: i };
      cubesGroup.add(cube);
    }
    scene.add(cubesGroup);

    // Raycasting for 3D Cube Clicks
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const onPointerDown = async (event) => {
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(cubesGroup.children);

      if (intersects.length > 0) {
        const hitIndex = intersects[0].object.userData.index;
        handle3DTileClick(hitIndex);
      }
    };

    renderer.domElement.addEventListener('pointerdown', onPointerDown);

    let frameId;
    let clock = new THREE.Clock();

    const animate = () => {
      frameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      cubesGroup.children.forEach((child) => {
        const idx = child.userData.index;
        const isLit = (phase === 'show' && patternRef.current.includes(idx)) || (phase === 'guess' && selectedRef.current.includes(idx));

        if (isLit) {
          child.material.color.setHex(0x00F2FE);
          child.material.emissive.setHex(0x00A3C4);
          child.material.emissiveIntensity = 0.8;
          child.position.z = 0.25;
        } else {
          child.material.color.setHex(0x121829);
          child.material.emissive.setHex(0x000000);
          child.material.emissiveIntensity = 0;
          child.position.z = 0;
        }
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
      renderer.domElement.removeEventListener('pointerdown', onPointerDown);
      cancelAnimationFrame(frameId);
      if (currentMount.contains(renderer.domElement)) {
        currentMount.removeChild(renderer.domElement);
      }
    };
  }, [phase]);

  const handle3DTileClick = async (idx) => {
    if (phase !== 'guess') return;
    soundFx.playClick();

    let newSel;
    if (selectedRef.current.includes(idx)) {
      newSel = selectedRef.current.filter((i) => i !== idx);
    } else {
      newSel = [...selectedRef.current, idx];
    }
    selectedRef.current = newSel;
    setSelected(newSel);

    if (newSel.length === 3) {
      const matchCount = newSel.filter((i) => patternRef.current.includes(i)).length;
      const score = Math.round((matchCount / 3) * 100);

      const sessionPayload = {
        userId: user?.id || user?._id,
        activity: 'Pattern Recall',
        category: 'memory',
        difficulty: 'Medium',
        score,
        accuracy: score
      };

      const result = await sessionAPI.createSession(sessionPayload);
      updateStateFromSession(result);

      setScoreResult({ score, matchCount });
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
          backgroundColor: 'rgba(0, 242, 254, 0.15)',
          display: 'flex',
          alignItems: 'center',
          justify: 'center',
          margin: '0 auto 1.25rem',
          border: '1px solid #00F2FE'
        }}>
          <CheckCircle2 size={44} color="#00F2FE" />
        </div>

        <h2 style={{ fontSize: '2rem', marginBottom: '0.5rem', color: '#F8FAFC', fontWeight: 900 }}>
          3D PATTERN RECALL COMPLETE! 🧩
        </h2>

        <div style={{
          backgroundColor: 'rgba(0, 0, 0, 0.4)',
          padding: '1.25rem',
          borderRadius: '16px',
          border: '1px solid rgba(0, 242, 254, 0.3)',
          marginBottom: '1.75rem'
        }}>
          <div style={{ fontSize: '0.85rem', color: '#94A3B8', fontWeight: 800, fontFamily: 'var(--font-esports)' }}>PATTERN RECALL SCORE</div>
          <div style={{ fontSize: '2.5rem', fontWeight: 900, color: '#FFD700', fontFamily: 'var(--font-esports)' }}>{scoreResult.score} / 100 PTS</div>
        </div>

        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
          <button onClick={startNewPattern} className="btn-secondary">
            <RotateCcw size={18} />
            <span>PLAY AGAIN</span>
          </button>
          <button onClick={() => navigate('/analysis')} className="btn-flame">
            <span>ANALYZE TELEMETRY</span>
            <ArrowRight size={18} />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="garden-card animate-fade-in" style={{ maxWidth: 680, margin: '0 auto', textAlign: 'center' }}>
      <div className="garden-card-header">
        <div>
          <h2 style={{ fontSize: '1.6rem', color: '#F8FAFC', fontWeight: 900 }}>3D HOLOGRAPHIC PATTERN MATRIX 🧩</h2>
          <p style={{ fontSize: '0.95rem', color: '#94A3B8' }}>
            {phase === 'show' ? 'MEMORIZE THE HIGHLIGHTED 3D MATRIX CUBES!' : 'TAP THE 3D CUBES YOU SAW IN PATTERN.'}
          </p>
        </div>
        <span className="badge badge-cyan">{phase === 'show' ? 'MEMORIZING...' : 'SELECT 3 CUBES'}</span>
      </div>

      {/* 3D WebGL Matrix Grid Scene */}
      <div
        ref={mountRef}
        style={{
          width: '100%',
          height: '360px',
          borderRadius: '20px',
          backgroundColor: '#090C15',
          border: '1px solid rgba(0, 242, 254, 0.3)',
          cursor: 'pointer',
          margin: '1rem 0',
          position: 'relative'
        }}
      />
    </div>
  );
};

export default PatternRecall;
