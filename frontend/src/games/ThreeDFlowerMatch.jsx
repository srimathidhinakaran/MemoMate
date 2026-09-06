import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { sessionAPI } from '../services/api';
import { soundFx } from '../utils/soundEffects';
import { RotateCcw, ArrowRight, CheckCircle2 } from 'lucide-react';

const NODE_COLORS = [
  0x38BDF8, 0xFBBF24, 0xC084FC, 0x34D399, 0xFB923C, 0xEA580C
];

const ThreeDFlowerMatch = () => {
  const { user, updateStateFromSession, speakText, voiceAssistance, t } = useAuth();
  const navigate = useNavigate();
  const mountRef = useRef(null);

  const [moves, setMoves] = useState(0);
  const [matchedCount, setMatchedCount] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [scoreResult, setScoreResult] = useState(null);

  const cubesRef = useRef([]);
  const flippedCubesRef = useRef([]);
  const matchedCubesRef = useRef([]);
  const movesRef = useRef(0);
  const startTimeRef = useRef(Date.now());

  useEffect(() => {
    const currentMount = mountRef.current;
    if (!currentMount) return;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0B0E14);

    const camera = new THREE.PerspectiveCamera(45, currentMount.clientWidth / currentMount.clientHeight, 0.1, 100);
    camera.position.set(0, 0, 10);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(currentMount.clientWidth, currentMount.clientHeight);
    currentMount.appendChild(renderer.domElement);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);
    const dirLight = new THREE.DirectionalLight(0x38BDF8, 1.2);
    dirLight.position.set(5, 10, 7);
    scene.add(dirLight);

    const deck = [...NODE_COLORS, ...NODE_COLORS].sort(() => Math.random() - 0.5);
    const cubes = [];
    cubesRef.current = [];
    flippedCubesRef.current = [];
    matchedCubesRef.current = [];
    movesRef.current = 0;
    startTimeRef.current = Date.now();

    const cols = 4;
    const rows = 3;
    const spacing = 1.8;
    const startX = -((cols - 1) * spacing) / 2;
    const startY = ((rows - 1) * spacing) / 2;

    deck.forEach((colorHex, idx) => {
      const col = idx % cols;
      const row = Math.floor(idx / cols);

      const group = new THREE.Group();

      // Front Face (Cyber Shield Cover)
      const coverMat = new THREE.MeshStandardMaterial({ color: 0x222B3B, roughness: 0.3 });
      const coverGeo = new THREE.BoxGeometry(1.4, 1.4, 0.15);
      const coverMesh = new THREE.Mesh(coverGeo, coverMat);
      coverMesh.position.z = 0.08;
      group.add(coverMesh);

      // Back Face (Glowing Quantum Node)
      const backMat = new THREE.MeshStandardMaterial({ color: colorHex, roughness: 0.2, emissive: colorHex, emissiveIntensity: 0.4 });
      const backGeo = new THREE.BoxGeometry(1.4, 1.4, 0.15);
      const backMesh = new THREE.Mesh(backGeo, backMat);
      backMesh.position.z = -0.08;
      group.add(backMesh);

      group.position.set(startX + col * spacing, startY - row * spacing, 0);
      group.userData = { id: idx, symbolColor: colorHex, isFlipped: false };

      scene.add(group);
      cubes.push(group);
    });

    cubesRef.current = cubes;

    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const onPointerDown = (event) => {
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(scene.children, true);

      if (intersects.length > 0) {
        let hitGroup = intersects[0].object.parent;
        if (hitGroup && hitGroup.userData && hitGroup.userData.id !== undefined) {
          handle3DCubeClick(hitGroup);
        }
      }
    };

    renderer.domElement.addEventListener('pointerdown', onPointerDown);

    let frameId;
    const animate = () => {
      frameId = requestAnimationFrame(animate);

      cubes.forEach((cb) => {
        const targetRotY = cb.userData.isFlipped ? Math.PI : 0;
        cb.rotation.y += (targetRotY - cb.rotation.y) * 0.25; // Snappy 0.25 speed
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
  }, []);

  const handle3DCubeClick = (cubeGroup) => {
    const flipped = flippedCubesRef.current;
    const matched = matchedCubesRef.current;

    if (flipped.length === 2 || flipped.includes(cubeGroup) || matched.includes(cubeGroup)) return;

    soundFx.playCardFlip();
    cubeGroup.userData.isFlipped = true;
    flipped.push(cubeGroup);

    if (flipped.length === 2) {
      movesRef.current += 1;
      setMoves(movesRef.current);

      const [first, second] = flipped;
      if (first.userData.symbolColor === second.userData.symbolColor) {
        soundFx.playCardMatch();
        matched.push(first, second);
        matchedCubesRef.current = matched;
        flippedCubesRef.current = [];
        setMatchedCount(matched.length / 2);

        if (matched.length === cubesRef.current.length) {
          finish3DGame(movesRef.current);
        }
      } else {
        soundFx.playCardMismatch();
        // Fast 400ms un-flip delay
        setTimeout(() => {
          first.userData.isFlipped = false;
          second.userData.isFlipped = false;
          flippedCubesRef.current = [];
        }, 400);
      }
    }
  };

  const finish3DGame = async (totalMoves) => {
    soundFx.playLevelUp();
    const timeSpent = Math.max(5, Math.round((Date.now() - startTimeRef.current) / 1000));
    const score = Math.max(50, Math.min(100, Math.round(100 - (totalMoves - 6) * 5)));

    const sessionPayload = {
      userId: user?.id || user?._id,
      activity: 'Spatial Node Matrix',
      category: 'memory',
      difficulty: 'Medium',
      score,
      accuracy: Math.round((6 / totalMoves) * 100),
      reactionTime: timeSpent * 1000
    };

    const result = await sessionAPI.createSession(sessionPayload);
    updateStateFromSession(result);

    setScoreResult({ score, totalMoves, timeSpent });
    setIsCompleted(true);

    if (voiceAssistance) {
      speakText(`${t('spatialNodeTitle')}. ${score}.`);
    }
  };

  if (isCompleted && scoreResult) {
    return (
      <div className="garden-card animate-fade-in" style={{ textAlign: 'center', padding: '2.5rem 1.5rem', maxWidth: 650, margin: '0 auto' }}>
        <div style={{
          width: 70,
          height: 70,
          borderRadius: '50%',
          backgroundColor: 'rgba(56, 189, 248, 0.15)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 1.25rem',
          border: '1px solid #38BDF8'
        }}>
          <CheckCircle2 size={44} color="#38BDF8" />
        </div>

        <h2 style={{ fontSize: '2rem', marginBottom: '0.5rem', color: '#FFFFFF', fontWeight: 900 }}>
          {t('missionComplete') || 'SPATIAL NODE MATRIX COMPLETE!'} 🧩
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
            <div style={{ fontSize: '0.85rem', color: '#94A3B8', fontWeight: 700 }}>{t('memoryScore') || 'Memory Score'}</div>
            <div style={{ fontSize: '2rem', fontWeight: 900, color: '#FBBF24' }}>{scoreResult.score} / 100</div>
          </div>
          <div>
            <div style={{ fontSize: '0.85rem', color: '#94A3B8', fontWeight: 700 }}>{t('movesTaken') || 'Moves Taken'}</div>
            <div style={{ fontSize: '2rem', fontWeight: 900, color: '#38BDF8' }}>{scoreResult.totalMoves}</div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
          <button onClick={() => window.location.reload()} className="btn-secondary">
            <RotateCcw size={18} />
            <span>{t('playAgain') || 'Play Again'}</span>
          </button>
          <button onClick={() => navigate('/dashboard')} className="btn-flame">
            <span>{t('navDashboard') || 'Dashboard'}</span>
            <ArrowRight size={18} />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="garden-card animate-fade-in" style={{ maxWidth: 750, margin: '0 auto', textAlign: 'center' }}>
      <div className="garden-card-header">
        <div>
          <h2 style={{ fontSize: '1.6rem', color: '#FFFFFF', fontWeight: 900 }}>{t('spatialNodeTitle') || 'Spatial Node Recall Matrix'} 🧩</h2>
          <p style={{ fontSize: '0.95rem', color: '#94A3B8' }}>
            {t('spatialNodeDesc') || 'Match quantum node color pairs in 3D WebGL space!'}
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <span className="badge badge-cyan">{t('movesTaken') || 'Moves'}: {moves}</span>
          <span className="badge badge-gold">{t('matchedPairs') || 'Matched'}: {matchedCount} / 6</span>
        </div>
      </div>

      {/* 3D WebGL Canvas Container */}
      <div
        ref={mountRef}
        style={{
          width: '100%',
          height: 400,
          borderRadius: '24px',
          backgroundColor: '#0B0E14',
          border: '1px solid #263142',
          cursor: 'pointer',
          margin: '1rem 0',
          position: 'relative'
        }}
      />
    </div>
  );
};

export default ThreeDFlowerMatch;
