import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { sessionAPI } from '../services/api';
import { RotateCcw, ArrowRight, CheckCircle2, Award } from 'lucide-react';

const SYMBOLS_COLOR = [
  0xF4C3B2, 0xB8A7D9, 0xFFE082, 0x80CBC4, 0xEF9A9A, 0xA5D6A7
];

const ThreeDFlowerMatch = () => {
  const { user, updateStateFromSession, speakText, voiceAssistance } = useAuth();
  const navigate = useNavigate();
  const mountRef = useRef(null);

  const [moves, setMoves] = useState(0);
  const [matchedCount, setMatchedCount] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [scoreResult, setScoreResult] = useState(null);

  const sceneRef = useRef(null);
  const cubesRef = useRef([]);
  const flippedCubesRef = useRef([]);
  const matchedCubesRef = useRef([]);
  const movesRef = useRef(0);
  const startTimeRef = useRef(Date.now());

  useEffect(() => {
    const currentMount = mountRef.current;
    if (!currentMount) return;

    // 1. Scene & Camera
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xFDFBF7);
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(45, currentMount.clientWidth / currentMount.clientHeight, 0.1, 100);
    camera.position.set(0, 0, 10);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(currentMount.clientWidth, currentMount.clientHeight);
    currentMount.appendChild(renderer.domElement);

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);
    const dirLight = new THREE.DirectionalLight(0xfff5e6, 1.2);
    dirLight.position.set(5, 10, 7);
    scene.add(dirLight);

    // 2. Generate 3D Cubes Grid (4x3 = 12 Cubes)
    const deck = [...SYMBOLS_COLOR, ...SYMBOLS_COLOR].sort(() => Math.random() - 0.5);
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

      // Front Face (Cover)
      const coverMat = new THREE.MeshStandardMaterial({ color: 0x58755E, roughness: 0.3 });
      const coverGeo = new THREE.BoxGeometry(1.4, 1.4, 0.15);
      const coverMesh = new THREE.Mesh(coverGeo, coverMat);
      coverMesh.position.z = 0.08;
      group.add(coverMesh);

      // Back Face (Color Symbol)
      const backMat = new THREE.MeshStandardMaterial({ color: colorHex, roughness: 0.2 });
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

    // 3. Raycaster for 3D Clicks
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

    // 4. Animation Loop
    let frameId;
    const animate = () => {
      frameId = requestAnimationFrame(animate);

      // Rotate flipped cubes smoothly
      cubes.forEach((cb) => {
        const targetRotY = cb.userData.isFlipped ? Math.PI : 0;
        cb.rotation.y += (targetRotY - cb.rotation.y) * 0.15;
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

    cubeGroup.userData.isFlipped = true;
    flipped.push(cubeGroup);

    if (flipped.length === 2) {
      movesRef.current += 1;
      setMoves(movesRef.current);

      const [first, second] = flipped;
      if (first.userData.symbolColor === second.userData.symbolColor) {
        matched.push(first, second);
        matchedCubesRef.current = matched;
        flippedCubesRef.current = [];
        setMatchedCount(matched.length / 2);

        if (matched.length === cubesRef.current.length) {
          finish3DGame(movesRef.current);
        }
      } else {
        setTimeout(() => {
          first.userData.isFlipped = false;
          second.userData.isFlipped = false;
          flippedCubesRef.current = [];
        }, 1000);
      }
    }
  };

  const finish3DGame = async (totalMoves) => {
    const timeSpent = Math.max(5, Math.round((Date.now() - startTimeRef.current) / 1000));
    const score = Math.max(50, Math.min(100, Math.round(100 - (totalMoves - 6) * 5)));

    const sessionPayload = {
      userId: user?.id || user?._id,
      activity: 'Memory Match',
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
      speakText(`3D Memory Match Complete! Score ${score}.`);
    }
  };

  if (isCompleted && scoreResult) {
    return (
      <div className="garden-card animate-fade-in" style={{ textAlign: 'center', padding: '2.5rem 1.5rem', maxWidth: 650, margin: '0 auto' }}>
        <div style={{
          width: 70,
          height: 70,
          borderRadius: '50%',
          backgroundColor: '#EBF2EC',
          display: 'flex',
          alignItems: 'center',
          justify: 'center',
          margin: '0 auto 1.25rem'
        }}>
          <CheckCircle2 size={44} color="#58755E" />
        </div>

        <h2 style={{ fontSize: '2rem', marginBottom: '0.5rem', color: '#1C3B2B' }}>
          3D Memory Match Complete! 🎨
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
            <div style={{ fontSize: '0.85rem', color: '#7E9687', fontWeight: 600 }}>Memory Score</div>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: '#58755E' }}>{scoreResult.score} / 100</div>
          </div>
          <div>
            <div style={{ fontSize: '0.85rem', color: '#7E9687', fontWeight: 600 }}>3D Moves Taken</div>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: '#1C3B2B' }}>{scoreResult.totalMoves} moves</div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
          <button onClick={() => window.location.reload()} className="btn-secondary">
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
    <div className="garden-card animate-fade-in" style={{ maxWidth: 750, margin: '0 auto', textAlign: 'center' }}>
      <div className="garden-card-header">
        <div>
          <h2 style={{ fontSize: '1.6rem', color: '#1C3B2B' }}>3D Memory Match 🎨</h2>
          <p style={{ fontSize: '0.95rem', color: '#536B5C' }}>
            Click 3D wooden blocks to flip them in 3D WebGL space and match color pairs!
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <span className="badge badge-sage">Moves: {moves}</span>
          <span className="badge badge-lavender">Matched: {matchedCount} / 6</span>
        </div>
      </div>

      {/* 3D WebGL Canvas Container */}
      <div
        ref={mountRef}
        style={{
          width: '100%',
          height: 420,
          borderRadius: '24px',
          backgroundColor: '#F7F4EE',
          border: '1.5px solid #E6E0D4',
          cursor: 'pointer',
          margin: '1rem 0',
          position: 'relative'
        }}
      />
    </div>
  );
};

export default ThreeDFlowerMatch;
