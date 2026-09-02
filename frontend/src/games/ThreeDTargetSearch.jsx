import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { sessionAPI } from '../services/api';
import { Target, CheckCircle2, RotateCcw, ArrowRight, Award } from 'lucide-react';

const ThreeDTargetSearch = () => {
  const { user, updateStateFromSession, speakText, voiceAssistance } = useAuth();
  const navigate = useNavigate();
  const mountRef = useRef(null);

  const [round, setRound] = useState(1);
  const [scoreResult, setScoreResult] = useState(null);
  const [isCompleted, setIsCompleted] = useState(false);

  const targetMeshRef = useRef(null);
  const sceneRef = useRef(null);
  const roundRef = useRef(1);
  const startTimeRef = useRef(Date.now());

  useEffect(() => {
    const currentMount = mountRef.current;
    if (!currentMount) return;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xFDFBF7);
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(45, currentMount.clientWidth / currentMount.clientHeight, 0.1, 100);
    camera.position.set(0, 4, 9);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(currentMount.clientWidth, currentMount.clientHeight);
    currentMount.appendChild(renderer.domElement);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xfff5e6, 1.2);
    dirLight.position.set(5, 10, 5);
    scene.add(dirLight);

    // Ground Plane
    const groundGeo = new THREE.PlaneGeometry(12, 10);
    const groundMat = new THREE.MeshStandardMaterial({ color: 0x58755E });
    const ground = new THREE.Mesh(groundGeo, groundMat);
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -1;
    scene.add(ground);

    // Spawn 3D Distractor Objects & 1 Target Object
    const objectsGroup = new THREE.Group();
    scene.add(objectsGroup);

    const spawn3DObjects = () => {
      while (objectsGroup.children.length > 0) {
        objectsGroup.remove(objectsGroup.children[0]);
      }

      const targetIdx = Math.floor(Math.random() * 8);

      for (let i = 0; i < 8; i++) {
        const isTarget = i === targetIdx;
        const geo = isTarget
          ? new THREE.DodecahedronGeometry(0.7)
          : (i % 2 === 0 ? new THREE.BoxGeometry(0.9, 0.9, 0.9) : new THREE.CylinderGeometry(0.4, 0.4, 1.2, 16));

        const mat = new THREE.MeshStandardMaterial({
          color: isTarget ? 0xFFB74D : (i % 2 === 0 ? 0x7A66A3 : 0x80CBC4),
          roughness: isTarget ? 0.2 : 0.6,
          emissive: isTarget ? 0xFF6F00 : 0x000000,
          emissiveIntensity: isTarget ? 0.5 : 0
        });

        const mesh = new THREE.Mesh(geo, mat);
        const col = i % 4;
        const row = Math.floor(i / 4);
        mesh.position.set(-3.5 + col * 2.3, 0, -1.5 + row * 2.5);
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
          // Found Target!
          if (roundRef.current < 5) {
            roundRef.current += 1;
            setRound(roundRef.current);
            spawn3DObjects();
          } else {
            // Complete Game
            const timeSpent = Math.max(4, Math.round((Date.now() - startTimeRef.current) / 1000));
            const score = Math.min(100, Math.max(50, 100 - (timeSpent - 8) * 3));

            const sessionPayload = {
              userId: user?.id || user?._id,
              activity: 'Attention Challenge',
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

            if (voiceAssistance) {
              speakText(`3D Attention Challenge complete! Score ${score}.`);
            }
          }
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
          backgroundColor: '#FDF3F0',
          display: 'flex',
          alignItems: 'center',
          justify: 'center',
          margin: '0 auto 1.25rem'
        }}>
          <CheckCircle2 size={44} color="#C87862" />
        </div>

        <h2 style={{ fontSize: '2rem', marginBottom: '0.5rem', color: '#1C3B2B' }}>
          3D Attention Challenge Complete! 🎯
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
            <div style={{ fontSize: '0.85rem', color: '#7E9687', fontWeight: 600 }}>Attention Score</div>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: '#C87862' }}>{scoreResult.score} / 100</div>
          </div>
          <div>
            <div style={{ fontSize: '0.85rem', color: '#7E9687', fontWeight: 600 }}>3D Search Time</div>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: '#1C3B2B' }}>{scoreResult.timeSpent} sec</div>
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
          <h2 style={{ fontSize: '1.6rem', color: '#1C3B2B' }}>3D Target Focus Search 🎯</h2>
          <p style={{ fontSize: '0.95rem', color: '#536B5C' }}>
            Find and click the glowing golden 3D Gem floating in the 3D Meadow!
          </p>
        </div>

        <span className="badge badge-peach">Round {round} / 5</span>
      </div>

      {/* 3D WebGL Canvas Container */}
      <div
        ref={mountRef}
        style={{
          width: '100%',
          height: 380,
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

export default ThreeDTargetSearch;
