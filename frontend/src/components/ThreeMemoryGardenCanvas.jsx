import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { Droplets, Sparkles, Sun, Palette, Compass } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { gardenAPI } from '../services/api';

const ThreeMemoryGardenCanvas = () => {
  const { user, garden, setGarden, speakText, voiceAssistance, t } = useAuth();
  const mountRef = useRef(null);
  
  const [theme, setTheme] = useState('spring'); // 'spring' | 'sunset' | 'lavender' | 'assam' | 'loktak'
  const [vrMode, setVrMode] = useState(false);
  const [isWatering, setIsWatering] = useState(false);
  const [rewardMsg, setRewardMsg] = useState(null);

  const sceneRef = useRef(null);
  const flowersGroupRef = useRef(null);

  useEffect(() => {
    const currentMount = mountRef.current;
    if (!currentMount) return;

    // 1. Scene setup
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    scene.background = new THREE.Color(0x090C15);

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

    const pointLight = new THREE.PointLight(0xFFD700, 1.5, 20);
    pointLight.position.set(-5, 8, -5);
    scene.add(pointLight);

    // 5. Ground / 3D Grid Pedestal Base
    const gridHelper = new THREE.GridHelper(14, 14, 0x38BDF8, 0x1F242D);
    gridHelper.position.y = -0.4;
    scene.add(gridHelper);

    const getGroundColor = (t) => {
      if (t === 'sunset') return 0xC87862;
      if (t === 'lavender') return 0x7A66A3;
      if (t === 'assam') return 0x1B4332; // Rich Tea Leaf Emerald
      if (t === 'loktak') return 0x0A3641; // Deep Floating Lake Water
      return 0x1F242D;
    };

    const groundGeo = new THREE.CylinderGeometry(7, 7.5, 0.8, 32);
    const groundMat = new THREE.MeshStandardMaterial({
      color: getGroundColor(theme),
      roughness: 0.6,
      metalness: 0.4
    });
    const ground = new THREE.Mesh(groundGeo, groundMat);
    ground.position.y = -0.4;
    ground.receiveShadow = true;
    scene.add(ground);

    // 6. 3D Trees
    const treeGroup = new THREE.Group();

    const getFoliageColor = (t) => {
      if (t === 'lavender') return 0xC084FC;
      if (t === 'assam') return 0x2D6A4F;
      if (t === 'loktak') return 0x38BDF8;
      return 0x34D399;
    };

    const create3DTree = (x, z) => {
      const singleTree = new THREE.Group();
      const trunkGeo = new THREE.CylinderGeometry(0.2, 0.35, 2.5, 8);
      const trunkMat = new THREE.MeshStandardMaterial({ color: 0x6E473B });
      const trunk = new THREE.Mesh(trunkGeo, trunkMat);
      trunk.position.y = 1.25;
      trunk.castShadow = true;
      singleTree.add(trunk);

      const foliageGeo = new THREE.DodecahedronGeometry(1.2, 1);
      const foliageMat = new THREE.MeshStandardMaterial({
        color: getFoliageColor(theme),
        roughness: 0.4,
        emissive: theme === 'lavender' ? 0x7E22CE : 0x059669,
        emissiveIntensity: 0.2
      });
      const foliage = new THREE.Mesh(foliageGeo, foliageMat);
      foliage.position.y = 2.8;
      foliage.castShadow = true;
      singleTree.add(foliage);

      singleTree.position.set(x, 0, z);
      return singleTree;
    };

    const treeCount = garden?.trees ?? 2;
    for (let i = 0; i < Math.max(2, treeCount); i++) {
      const angle = (i / treeCount) * Math.PI * 1.5 - 0.7;
      treeGroup.add(create3DTree(Math.cos(angle) * 4.5, Math.sin(angle) * 4.5));
    }
    scene.add(treeGroup);

    // 7. 3D Cyber Flowers Group
    const flowersGroup = new THREE.Group();
    flowersGroupRef.current = flowersGroup;

    const flowerCount = Math.max(3, garden?.flowers ?? 3);
    const flowerColors = [0x38BDF8, 0xFBBF24, 0xC084FC, 0x34D399, 0xFF4E50];

    for (let i = 0; i < flowerCount; i++) {
      const flower = new THREE.Group();
      const stemGeo = new THREE.CylinderGeometry(0.04, 0.04, 0.9, 8);
      const stemMat = new THREE.MeshStandardMaterial({ color: 0x34D399 });
      const stem = new THREE.Mesh(stemGeo, stemMat);
      stem.position.y = 0.45;
      flower.add(stem);

      const color = flowerColors[i % flowerColors.length];
      const petalGeo = new THREE.SphereGeometry(0.3, 8, 8);
      petalGeo.scale(1, 0.3, 1);
      const petalMat = new THREE.MeshStandardMaterial({ color, roughness: 0.3, emissive: color, emissiveIntensity: 0.3 });
      const centerMat = new THREE.MeshStandardMaterial({ color: 0xFFD700, emissive: 0xFFD700, emissiveIntensity: 0.5 });

      const center = new THREE.Mesh(new THREE.SphereGeometry(0.18, 8, 8), centerMat);
      center.position.y = 0.9;
      flower.add(center);

      for (let p = 0; p < 5; p++) {
        const petal = new THREE.Mesh(petalGeo, petalMat);
        const pAngle = (p / 5) * Math.PI * 2;
        petal.position.set(Math.cos(pAngle) * 0.25, 0.9, Math.sin(pAngle) * 0.25);
        flower.add(petal);
      }

      const fAngle = (i / flowerCount) * Math.PI * 2;
      const radius = 1.5 + (i % 3) * 1.1;
      flower.position.set(Math.cos(fAngle) * radius, 0, Math.sin(fAngle) * radius);
      flowersGroup.add(flower);
    }
    scene.add(flowersGroup);

    // 8. Floating Particles
    const particleCount = 50;
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

    // 9. Animation Loop & Orbit Rotation
    let animationFrameId;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      scene.rotation.y = elapsedTime * 0.08;

      const positions = particleSystem.geometry.attributes.position.array;
      for (let i = 1; i < particleCount * 3; i += 3) {
        positions[i] += Math.sin(elapsedTime + i) * 0.005;
      }
      particleSystem.geometry.attributes.position.needsUpdate = true;

      flowersGroup.children.forEach((fl, idx) => {
        fl.rotation.z = Math.sin(elapsedTime * 2 + idx) * 0.05;
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

  // Water 3D Garden Interaction
  const handleWaterGarden = async () => {
    setIsWatering(true);
    if (voiceAssistance) {
      speakText("Watering your 3D Memory Garden! Flowers are blooming.");
    }

    if (flowersGroupRef.current) {
      flowersGroupRef.current.children.forEach((fl) => {
        fl.scale.set(1.4, 1.4, 1.4);
        setTimeout(() => fl.scale.set(1, 1, 1), 600);
      });
    }

    const updated = await gardenAPI.updateGarden(user?.id || user?._id, 'water');
    setGarden(updated);

    setRewardMsg('💦 3D Water Droplets Applied! +50 XP Earned! 🌟');
    setTimeout(() => {
      setIsWatering(false);
      setRewardMsg(null);
    }, 2000);
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
            border: '1px solid rgba(56, 189, 248, 0.35)'
          }}>
            <Sparkles size={24} color="#38BDF8" />
          </div>
          <div>
            <h3 style={{ fontSize: '1.35rem', color: '#FFFFFF', fontWeight: 800, margin: 0, fontFamily: 'var(--font-heading)' }}>
              Interactive 3D WebGL Memory Garden 🌺
            </h3>
            <span style={{ fontSize: '0.85rem', color: '#9198A1', fontWeight: 600 }}>
              Three.js Real-time 3D Engine & VR Headset Immersion
            </span>
          </div>
        </div>

        {/* 3D Theme & VR Headset Selector */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
          <button
            onClick={() => setVrMode(!vrMode)}
            className={vrMode ? "btn-primary" : "btn-secondary"}
            style={{ padding: '0.4rem 0.85rem', fontSize: '0.8rem' }}
          >
            <span>{vrMode ? '🕶️ VR STEREO MODE ACTIVE' : t('vrMode')}</span>
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', backgroundColor: '#0D1117', padding: '0.3rem', borderRadius: '12px', border: '1px solid #30363D' }}>
            <Palette size={16} color="#38BDF8" style={{ marginLeft: '0.4rem' }} />
            <button
              onClick={() => setTheme('spring')}
              className={`badge ${theme === 'spring' ? 'badge-cyan' : ''}`}
              style={{ border: 'none', cursor: 'pointer', padding: '0.35rem 0.65rem' }}
            >
              Spring
            </button>
            <button
              onClick={() => setTheme('sunset')}
              className={`badge ${theme === 'sunset' ? 'badge-peach' : ''}`}
              style={{ border: 'none', cursor: 'pointer', padding: '0.35rem 0.65rem' }}
            >
              Sunset
            </button>
            <button
              onClick={() => setTheme('lavender')}
              className={`badge ${theme === 'lavender' ? 'badge-purple' : ''}`}
              style={{ border: 'none', cursor: 'pointer', padding: '0.35rem 0.65rem' }}
            >
              Lavender
            </button>
            <button
              onClick={() => setTheme('assam')}
              className={`badge ${theme === 'assam' ? 'badge-green' : ''}`}
              style={{ border: 'none', cursor: 'pointer', padding: '0.35rem 0.65rem' }}
            >
              Assam Tea 🍃
            </button>
            <button
              onClick={() => setTheme('loktak')}
              className={`badge ${theme === 'loktak' ? 'badge-cyan' : ''}`}
              style={{ border: 'none', cursor: 'pointer', padding: '0.35rem 0.65rem' }}
            >
              Loktak Meadow 🪷
            </button>
          </div>
        </div>
      </div>

      {/* 3D WebGL Canvas Container with VR Dual-Eye Frame Overlay when VR Mode Active */}
      <div style={{ position: 'relative', width: '100%', height: 380, borderRadius: '20px', overflow: 'hidden', border: '1px solid #30363D' }}>
        <div
          ref={mountRef}
          style={{
            width: '100%',
            height: '100%',
            backgroundColor: '#090C15'
          }}
        />

        {/* Simulated VR Headset Dual-Viewport Stereoscopic Lens Overlay */}
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

        {/* Floating 3D Reward Badge Overlay */}
        {rewardMsg && (
          <div style={{
            position: 'absolute',
            top: 20,
            left: '50%',
            transform: 'translateX(-50%)',
            backgroundColor: 'rgba(22, 27, 34, 0.95)',
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
          backgroundColor: 'rgba(13, 17, 23, 0.85)',
          border: '1px solid #30363D',
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

      {/* 3D Garden Interaction Controls */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justify: 'space-between',
        flexWrap: 'wrap',
        gap: '1rem',
        marginTop: '1.25rem',
        paddingTop: '1rem',
        borderTop: '1px solid #30363D'
      }}>
        <div style={{ display: 'flex', gap: '1.2rem', fontSize: '0.92rem', fontWeight: 800 }}>
          <div>🌱 Plants: <span style={{ color: '#34D399' }}>{garden?.plants ?? 1}</span></div>
          <div>🌸 3D Flowers: <span style={{ color: '#C084FC' }}>{garden?.flowers ?? 0}</span></div>
          <div>🌳 3D Trees: <span style={{ color: '#38BDF8' }}>{garden?.trees ?? 0}</span></div>
        </div>

        <button
          onClick={handleWaterGarden}
          disabled={isWatering}
          className="btn-primary"
          style={{ padding: '0.75rem 1.6rem', fontSize: '0.95rem' }}
        >
          <Droplets size={20} className={isWatering ? 'animate-pulse-gentle' : ''} />
          <span>{isWatering ? 'WATERING 3D GARDEN...' : t('water3dGarden')}</span>
        </button>
      </div>
    </div>
  );
};

export default ThreeMemoryGardenCanvas;
