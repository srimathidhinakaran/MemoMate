import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { sessionAPI } from '../services/api';
import { soundFx } from '../utils/soundEffects';
import { Target, CheckCircle2, RotateCcw, ArrowRight } from 'lucide-react';

const ThreeDTargetSearch = ({ onComplete }) => {
  const { user, updateStateFromSession, speakText, voiceAssistance, t } = useAuth();
  const navigate = useNavigate();
  const mountRef = useRef(null);

  const [round, setRound] = useState(1);
  const [scoreResult, setScoreResult] = useState(null);
  const [isCompleted, setIsCompleted] = useState(false);

  const targetMeshRef = useRef(null);
  const roundRef = useRef(1);
  const startTimeRef = useRef(Date.now());

  useEffect(() => {
    const currentMount = mountRef.current;
    if (!currentMount) return;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0B0E14);

    const camera = new THREE.PerspectiveCamera(45, currentMount.clientWidth / currentMount.clientHeight, 0.1, 100);
    camera.position.set(0, 4, 9);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(currentMount.clientWidth, currentMount.clientHeight);
    currentMount.appendChild(renderer.domElement);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0x38BDF8, 1.2);
    dirLight.position.set(5, 10, 5);
    scene.add(dirLight);

    // Ground Grid Base
    const gridHelper = new THREE.GridHelper(12, 10, 0x38BDF8, 0x1E2634);
    gridHelper.position.y = -1;
    scene.add(gridHelper);

    // Spawn 3D Distractor Objects & 1 Target Object
    const objectsGroup = new THREE.Group();
    scene.add(objectsGroup);

    const spawn3DObjects = () => {
      while (objectsGroup.children.length > 0) {
        objectsGroup.remove(objectsGroup.children[0]);
      }

      const totalItems = 9;
      const targetIdx = Math.floor(Math.random() * totalItems);

      for (let i = 0; i < totalItems; i++) {
        const isTarget = i === targetIdx;
        const geo = isTarget
          ? new THREE.IcosahedronGeometry(0.75, 1)
          : (i % 2 === 0 ? new THREE.BoxGeometry(0.85, 0.85, 0.85) : new THREE.CylinderGeometry(0.4, 0.4, 1.2, 16));

        const mat = new THREE.MeshStandardMaterial({
          color: isTarget ? 0xFBBF24 : (i % 2 === 0 ? 0xC084FC : 0x34D399),
          roughness: isTarget ? 0.2 : 0.6,
          metalness: isTarget ? 0.8 : 0.2,
          emissive: isTarget ? 0xFBBF24 : 0x000000,
          emissiveIntensity: isTarget ? 0.6 : 0
        });

        const mesh = new THREE.Mesh(geo, mat);
        const col = i % 3;
        const row = Math.floor(i / 3);
        mesh.position.set(-3 + col * 3, 0, -2 + row * 2.5);
        mesh.userData = { isTarget };

        if (isTarget) targetMeshRef.current = mesh;
        objectsGroup.add(mesh);
      }
    };

    spawn3DObjects();
    startTimeRef.current = Date.now();

    // Raycasting for 3D Target Clicks
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const onPointerDown = async (event) => {
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(objectsGroup.children, true);

      if (intersects.length > 0) {
        const hit = intersects[0].object;
        if (hit.userData && hit.userData.isTarget) {
          soundFx.playSuccess();
          if (roundRef.current < 5) {
            roundRef.current += 1;
            setRound(roundRef.current);
            spawn3DObjects();
          } else {
            soundFx.playLevelUp();
            const timeSpent = Math.max(3, Math.round((Date.now() - startTimeRef.current) / 1000));
            const score = Math.min(100, Math.max(50, 100 - (timeSpent - 5) * 3));

            const sessionPayload = {
              userId: user?.id || user?._id,
              activity: 'Target Precision Velocity',
              category: 'attention',
              difficulty: 'Medium',
              score,
              accuracy: 100,
              reactionTime: timeSpent * 1000
            };

            const result = await sessionAPI.createSession(sessionPayload);
            updateStateFromSession(result);

            setScoreResult({ score, timeSpent });
            setIsCompleted(true);
            if (onComplete) {
              onComplete({ score, timeSpent });
            }

            if (voiceAssistance) {
              speakText(`${t('targetFocusTitle')}. ${score}`);
            }
          }
        } else {
          soundFx.playCardMismatch();
        }
      }
    };

    renderer.domElement.addEventListener('pointerdown', onPointerDown);

    let frameId;
    let clock = new THREE.Clock();

    const animate = () => {
      frameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      if (targetMeshRef.current) {
        targetMeshRef.current.rotation.y = elapsedTime * 2;
        targetMeshRef.current.position.y = Math.sin(elapsedTime * 4) * 0.15;
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
      renderer.domElement.removeEventListener('pointerdown', onPointerDown);
      cancelAnimationFrame(frameId);
      if (currentMount.contains(renderer.domElement)) {
        currentMount.removeChild(renderer.domElement);
      }
    };
  }, []);

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
          justify: 'center',
          margin: '0 auto 1.25rem',
          border: '1px solid #38BDF8'
        }}>
          <CheckCircle2 size={44} color="#38BDF8" />
        </div>

        <h2 style={{ fontSize: '2rem', marginBottom: '0.5rem', color: '#FFFFFF', fontWeight: 900 }}>
          {t('missionComplete') || '3D TARGET SEARCH COMPLETE!'}
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
            <div style={{ fontSize: '0.85rem', color: '#94A3B8', fontWeight: 700 }}>{t('attentionScore') || 'Attention Score'}</div>
            <div style={{ fontSize: '2rem', fontWeight: 900, color: '#FBBF24' }}>{scoreResult.score} / 100</div>
          </div>
          <div>
            <div style={{ fontSize: '0.85rem', color: '#94A3B8', fontWeight: 700 }}>{t('timeElapsed') || 'Search Time'}</div>
            <div style={{ fontSize: '2rem', fontWeight: 900, color: '#38BDF8' }}>{scoreResult.timeSpent} s</div>
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
          <h2 style={{ fontSize: '1.6rem', color: '#FFFFFF', fontWeight: 900 }}>{t('targetFocusTitle') || '3D Target Focus Search'} 🎯</h2>
          <p style={{ fontSize: '0.95rem', color: '#94A3B8' }}>
            {t('targetFocusDesc') || 'Tap the glowing golden 3D Quantum Crystal in the matrix grid!'}
          </p>
        </div>

        <span className="badge badge-cyan">{t('roundInfo', { round, total: 5 }) || `Round ${round} / 5`}</span>
      </div>

      {/* 3D WebGL Canvas Container */}
      <div
        ref={mountRef}
        style={{
          width: '100%',
          height: '320px',
          borderRadius: '16px',
          backgroundColor: '#0B0E14',
          border: '1px solid rgba(56, 189, 248, 0.3)',
          cursor: 'pointer',
          margin: '1rem 0',
          position: 'relative'
        }}
      />
    </div>
  );
};

export default ThreeDTargetSearch;
