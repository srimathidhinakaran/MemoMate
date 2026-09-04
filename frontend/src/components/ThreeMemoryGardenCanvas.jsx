import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { Zap, Sparkles, Palette, Compass } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { gardenAPI } from '../services/api';

const ThreeMemoryGardenCanvas = () => {
  const { user, garden, setGarden, speakText, voiceAssistance, t } = useAuth();
  const mountRef = useRef(null);
  
  const [theme, setTheme] = useState('cyan'); // 'cyan' | 'gold' | 'purple' | 'emerald'
  const [vrMode, setVrMode] = useState(false);
  const [isCharging, setIsCharging] = useState(false);
  const [rewardMsg, setRewardMsg] = useState(null);

  const sceneRef = useRef(null);
  const nodesGroupRef = useRef(null);

  useEffect(() => {
    const currentMount = mountRef.current;
    if (!currentMount) return;

    // 1. Scene setup
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.background = new THREE.Color(0x0B0E14);

    // 2. Camera setup
    const camera = new THREE.PerspectiveCamera(
      45,
      currentMount.clientWidth / currentMount.clientHeight,
      0.1,
      1000
    );
    camera.position.set(0, 8, 14);
    camera.lookAt(0, 1, 0);

    // 3. Renderer setup
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(currentMount.clientWidth, currentMount.clientHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    currentMount.appendChild(renderer.domElement);

    // 4. Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0x38BDF8, 1.2);
    dirLight.position.set(10, 20, 10);
    dirLight.castShadow = true;
    scene.add(dirLight);

    const pointLight = new THREE.PointLight(0xFBBF24, 1.5, 20);
    pointLight.position.set(-5, 8, -5);
    scene.add(pointLight);

    // 5. Ground / 3D Grid Pedestal Base
    const gridHelper = new THREE.GridHelper(14, 14, 0x38BDF8, 0x1E2634);
    gridHelper.position.y = -0.4;
    scene.add(gridHelper);

    const groundGeo = new THREE.CylinderGeometry(7, 7.5, 0.8, 32);
    const groundMat = new THREE.MeshStandardMaterial({
      color: 0x161C26,
      roughness: 0.5,
      metalness: 0.5
    });
    const ground = new THREE.Mesh(groundGeo, groundMat);
    ground.position.y = -0.4;
    ground.receiveShadow = true;
    scene.add(ground);

    // 6. 3D Quantum Nodes Group
    const nodesGroup = new THREE.Group();
    nodesGroupRef.current = nodesGroup;

    const nodeCount = Math.max(4, garden?.plants || 4);
    const nodeColors = [0x38BDF8, 0xFBBF24, 0xC084FC, 0x34D399, 0xFB923C];

    for (let i = 0; i < nodeCount; i++) {
      const nodeGroup = new THREE.Group();
      const color = nodeColors[i % nodeColors.length];

      // Octahedron Core Crystal
      const crystalGeo = new THREE.OctahedronGeometry(0.7, 1);
      const crystalMat = new THREE.MeshStandardMaterial({
        color,
        roughness: 0.2,
        metalness: 0.8,
        emissive: color,
        emissiveIntensity: 0.4
      });
      const crystalMesh = new THREE.Mesh(crystalGeo, crystalMat);
      crystalMesh.position.y = 1.0;
      crystalMesh.castShadow = true;
      nodeGroup.add(crystalMesh);

      // Torus Orbit Ring
      const ringGeo = new THREE.TorusGeometry(0.95, 0.05, 16, 32);
      const ringMat = new THREE.MeshBasicMaterial({ color, wireframe: true });
      const ringMesh = new THREE.Mesh(ringGeo, ringMat);
      ringMesh.position.y = 1.0;
      ringMesh.rotation.x = Math.PI / 2;
      nodeGroup.add(ringMesh);

      const fAngle = (i / nodeCount) * Math.PI * 2;
      const radius = 2.0 + (i % 3) * 1.2;
      nodeGroup.position.set(Math.cos(fAngle) * radius, 0, Math.sin(fAngle) * radius);
      nodesGroup.add(nodeGroup);
    }
    scene.add(nodesGroup);

    // 7. Floating Cyber Particles
    const particleCount = 60;
    const particlesGeo = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);

    for (let p = 0; p < particleCount * 3; p += 3) {
      particlePositions[p] = (Math.random() - 0.5) * 12;
      particlePositions[p + 1] = Math.random() * 6 + 1;
      particlePositions[p + 2] = (Math.random() - 0.5) * 12;
    }

    particlesGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    const particleMat = new THREE.PointsMaterial({
      color: 0x38BDF8,
      size: 0.22,
      transparent: true,
      opacity: 0.8
    });
    const particleSystem = new THREE.Points(particlesGeo, particleMat);
    scene.add(particleSystem);

    // 8. Animation Loop
    let animationFrameId;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      scene.rotation.y = elapsedTime * 0.08;

      nodesGroup.children.forEach((node, idx) => {
        node.rotation.y = elapsedTime * (1 + idx * 0.2);
        node.position.y = Math.sin(elapsedTime * 2 + idx) * 0.15;
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
      cancelAnimationFrame(animationFrameId);
      if (currentMount.contains(renderer.domElement)) {
        currentMount.removeChild(renderer.domElement);
      }
    };
  }, [theme, garden]);

  // Charge 3D Matrix Interaction
  const handleChargeMatrix = async () => {
    setIsCharging(true);
    if (voiceAssistance) {
      speakText("Charging 3D Mind Matrix! Neural energy active.");
    }

    if (nodesGroupRef.current) {
      nodesGroupRef.current.children.forEach((nd) => {
        nd.scale.set(1.3, 1.3, 1.3);
        setTimeout(() => nd.scale.set(1, 1, 1), 300);
      });
    }

    const updated = await gardenAPI.updateGarden(user?.id || user?._id, 'water');
    setGarden(updated);

    setRewardMsg('⚡ Matrix Charged! +50 XP Earned! 🌟');
    setTimeout(() => {
      setIsCharging(false);
      setRewardMsg(null);
    }, 1500);
  };

  return (
    <div className="garden-card animate-fade-in" style={{ padding: '1.6rem 1.8rem', position: 'relative', overflow: 'hidden' }}>
      {/* 3D Controls Bar */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justify: 'space-between',
        flexWrap: 'wrap',
        gap: '0.85rem',
        marginBottom: '1rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div className="icon-box" style={{
            width: 44,
            height: 44,
            borderRadius: '12px',
            backgroundColor: 'rgba(56, 189, 248, 0.15)',
            border: '1px solid rgba(56, 189, 248, 0.35)',
            display: 'inline-flex',
            alignItems: 'center',
            justify: 'center'
          }}>
            <Sparkles size={24} color="#38BDF8" />
          </div>
          <div>
            <h3 style={{ fontSize: '1.35rem', color: '#FFFFFF', fontWeight: 900, margin: 0, fontFamily: 'var(--font-heading)' }}>
              Interactive 3D Mind Matrix Sanctum ⚡
            </h3>
            <span style={{ fontSize: '0.85rem', color: '#94A3B8', fontWeight: 600 }}>
              Three.js Real-time 3D Engine & VR Headset Immersion
            </span>
          </div>
        </div>

        {/* 3D VR Headset Selector */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
          <button
            onClick={() => setVrMode(!vrMode)}
            className={vrMode ? "btn-primary" : "btn-secondary"}
            style={{ padding: '0.4rem 0.85rem', fontSize: '0.8rem' }}
          >
            <span>{vrMode ? '🕶️ VR STEREO MODE ACTIVE' : t('vrMode')}</span>
          </button>
        </div>
      </div>

      {/* 3D WebGL Canvas Container */}
      <div style={{ position: 'relative', width: '100%', height: 380, borderRadius: '20px', overflow: 'hidden', border: '1px solid #263142' }}>
        <div
          ref={mountRef}
          style={{
            width: '100%',
            height: '100%',
            backgroundColor: '#0B0E14'
          }}
        />

        {vrMode && (
          <div style={{
            position: 'absolute',
            inset: 0,
            pointerEvents: 'none',
            display: 'flex',
            border: '4px solid #38BDF8',
            borderRadius: '20px',
            background: 'radial-gradient(circle at 25% 50%, transparent 60%, rgba(0,0,0,0.7) 100%), radial-gradient(circle at 75% 50%, transparent 60%, rgba(0,0,0,0.7) 100%)',
            boxShadow: 'inset 0 0 40px rgba(56, 189, 248, 0.4)'
          }}>
            <div style={{ flex: 1, borderRight: '2px solid rgba(56, 189, 248, 0.4)', display: 'flex', alignItems: 'flex-end', padding: '1rem' }}>
              <span className="badge badge-cyan" style={{ fontSize: '0.7rem' }}>LEFT EYE LENS (VR)</span>
            </div>
            <div style={{ flex: 1, display: 'flex', alignItems: 'flex-end', justifyContent: 'flex-end', padding: '1rem' }}>
              <span className="badge badge-cyan" style={{ fontSize: '0.7rem' }}>RIGHT EYE LENS (VR)</span>
            </div>
          </div>
        )}

        {rewardMsg && (
          <div style={{
            position: 'absolute',
            top: 20,
            left: '50%',
            transform: 'translateX(-50%)',
            backgroundColor: '#161C26',
            border: '1px solid #38BDF8',
            borderRadius: '9999px',
            padding: '0.6rem 1.4rem',
            boxShadow: '0 10px 25px rgba(56, 189, 248, 0.25)',
            fontSize: '0.95rem',
            fontWeight: 800,
            color: '#FFFFFF',
            zIndex: 10
          }} className="animate-fade-in">
            {rewardMsg}
          </div>
        )}

        <div style={{
          position: 'absolute',
          bottom: 14,
          left: 14,
          backgroundColor: '#0B0E14',
          border: '1px solid #263142',
          padding: '0.4rem 0.85rem',
          borderRadius: '9999px',
          fontSize: '0.8rem',
          fontWeight: 700,
          color: '#38BDF8',
          display: 'flex',
          alignItems: 'center',
          gap: '0.4rem'
        }}>
          <Compass size={14} /> 3D Camera Orbit Active
        </div>
      </div>

      {/* 3D Matrix Interaction Controls */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justify: 'space-between',
        flexWrap: 'wrap',
        gap: '1rem',
        marginTop: '1.25rem',
        paddingTop: '1rem',
        borderTop: '1px solid #263142'
      }}>
        <div style={{ display: 'flex', gap: '1.2rem', fontSize: '0.92rem', fontWeight: 800 }}>
          <div>💎 Cyber Crystals: <span style={{ color: '#38BDF8' }}>{garden?.plants ?? 1}</span></div>
          <div>🧠 Neural Cores: <span style={{ color: '#C084FC' }}>{garden?.flowers ?? 1}</span></div>
          <div>⭕ Quantum Rings: <span style={{ color: '#34D399' }}>{garden?.trees ?? 0}</span></div>
        </div>

        <button
          onClick={handleChargeMatrix}
          disabled={isCharging}
          className="btn-primary"
          style={{ padding: '0.75rem 1.6rem', fontSize: '0.95rem' }}
        >
          <Zap size={20} />
          <span>{isCharging ? 'CHARGING MATRIX...' : t('water3dGarden')}</span>
        </button>
      </div>
    </div>
  );
};

export default ThreeMemoryGardenCanvas;
