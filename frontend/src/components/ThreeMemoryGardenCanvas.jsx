import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { Droplets, Sparkles, Sun, Palette, Compass } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { gardenAPI } from '../services/api';

const ThreeMemoryGardenCanvas = () => {
  const { user, garden, setGarden, speakText, voiceAssistance } = useAuth();
  const mountRef = useRef(null);
  
  const [theme, setTheme] = useState('spring'); // 'spring' | 'sunset' | 'lavender'
  const [isWatering, setIsWatering] = useState(false);
  const [selectedPlant, setSelectedPlant] = useState('flower');
  const [rewardMsg, setRewardMsg] = useState(null);

  const sceneRef = useRef(null);
  const flowersGroupRef = useRef(null);
  const waterParticlesRef = useRef([]);

  useEffect(() => {
    const currentMount = mountRef.current;
    if (!currentMount) return;

    // 1. Scene setup
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const getBgColor = () => {
      if (theme === 'sunset') return 0xFDF3F0;
      if (theme === 'lavender') return 0xF2EFF9;
      return 0xEBF2EC; // spring
    };
    scene.background = new THREE.Color(getBgColor());

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
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xfffaed, 1.2);
    dirLight.position.set(10, 20, 10);
    dirLight.castShadow = true;
    scene.add(dirLight);

    // 5. Ground / Garden Soil
    const groundGeo = new THREE.CylinderGeometry(7, 7.5, 0.8, 32);
    const groundMat = new THREE.MeshStandardMaterial({
      color: theme === 'sunset' ? 0xC87862 : (theme === 'lavender' ? 0x7A66A3 : 0x58755E),
      roughness: 0.8
    });
    const ground = new THREE.Mesh(groundGeo, groundMat);
    ground.position.y = -0.4;
    ground.receiveShadow = true;
    scene.add(ground);

    // Inner Soil bed
    const soilGeo = new THREE.CylinderGeometry(6.2, 6.2, 0.85, 32);
    const soilMat = new THREE.MeshStandardMaterial({ color: 0x4A3728, roughness: 0.9 });
    const soil = new THREE.Mesh(soilGeo, soilMat);
    soil.position.y = -0.38;
    scene.add(soil);

    // 6. 3D Trees (Procedural Meshes)
    const treeGroup = new THREE.Group();

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
        color: theme === 'lavender' ? 0x9D8BC9 : 0x7C9A82,
        roughness: 0.5
      });
      const foliage = new THREE.Mesh(foliageGeo, foliageMat);
      foliage.position.y = 2.8;
      foliage.castShadow = true;
      singleTree.add(foliage);

      singleTree.position.set(x, 0, z);
      return singleTree;
    };

    const treeCount = garden?.trees || 2;
    for (let i = 0; i < Math.max(2, treeCount); i++) {
      const angle = (i / treeCount) * Math.PI * 1.5 - 0.7;
      treeGroup.add(create3DTree(Math.cos(angle) * 4.5, Math.sin(angle) * 4.5));
    }
    scene.add(treeGroup);

    // 7. 3D Flowers Group
    const flowersGroup = new THREE.Group();
    flowersGroupRef.current = flowersGroup;

    const flowerCount = garden?.flowers || 5;
    const flowerColors = [0xF4C3B2, 0xB8A7D9, 0xFFE082, 0xEF9A9A, 0x80CBC4];

    for (let i = 0; i < flowerCount; i++) {
      const flower = new THREE.Group();
      // Stem
      const stemGeo = new THREE.CylinderGeometry(0.04, 0.04, 0.9, 8);
      const stemMat = new THREE.MeshStandardMaterial({ color: 0x58755E });
      const stem = new THREE.Mesh(stemGeo, stemMat);
      stem.position.y = 0.45;
      flower.add(stem);

      // Petals
      const color = flowerColors[i % flowerColors.length];
      const petalGeo = new THREE.SphereGeometry(0.3, 8, 8);
      petalGeo.scale(1, 0.3, 1);
      const petalMat = new THREE.MeshStandardMaterial({ color, roughness: 0.4 });
      const centerMat = new THREE.MeshStandardMaterial({ color: 0xFFD54F });

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

    // 8. 3D Floating Particles / Butterflies
    const particleCount = 40;
    const particlesGeo = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);

    for (let p = 0; p < particleCount * 3; p += 3) {
      particlePositions[p] = (Math.random() - 0.5) * 12;
      particlePositions[p + 1] = Math.random() * 6 + 1;
      particlePositions[p + 2] = (Math.random() - 0.5) * 12;
    }

    particlesGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    const particleMat = new THREE.PointsMaterial({
      color: 0xFFE082,
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

      // Gentle scene rotation
      scene.rotation.y = elapsedTime * 0.08;

      // Particle floating wave motion
      const positions = particleSystem.geometry.attributes.position.array;
      for (let i = 1; i < particleCount * 3; i += 3) {
        positions[i] += Math.sin(elapsedTime + i) * 0.005;
      }
      particleSystem.geometry.attributes.position.needsUpdate = true;

      // Flower gentle sway animation
      flowersGroup.children.forEach((fl, idx) => {
        fl.rotation.z = Math.sin(elapsedTime * 2 + idx) * 0.05;
      });

      renderer.render(scene, camera);
    };

    animate();

    // Resize listener
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
      speakText("Watering your 3D Memory Garden! Flowers are growing in 3D.");
    }

    // Trigger 3D flower scale pulse
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
    <div className="garden-card animate-fade-in" style={{ padding: '1.5rem', position: 'relative', overflow: 'hidden' }}>
      {/* 3D Controls Bar */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justify: 'space-between',
        flexWrap: 'wrap',
        gap: '0.85rem',
        marginBottom: '1rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <div style={{
            width: 40,
            height: 40,
            borderRadius: '12px',
            backgroundColor: '#EBF2EC',
            display: 'flex',
            alignItems: 'center',
            justify: 'center'
          }}>
            <Sparkles size={24} color="#58755E" />
          </div>
          <div>
            <h3 style={{ fontSize: '1.35rem', color: '#1C3B2B' }}>Interactive 3D Memory Garden 🌺</h3>
            <span style={{ fontSize: '0.85rem', color: '#536B5C' }}>Powered by Three.js WebGL Real-time 3D Graphics</span>
          </div>
        </div>

        {/* 3D Soil Theme Selector */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', backgroundColor: '#F7F4EE', padding: '0.3rem', borderRadius: 9999, border: '1px solid #E6E0D4' }}>
          <Palette size={16} color="#58755E" style={{ marginLeft: '0.4rem' }} />
          <button
            onClick={() => setTheme('spring')}
            className={`badge ${theme === 'spring' ? 'badge-sage' : ''}`}
            style={{ border: 'none', cursor: 'pointer', padding: '0.35rem 0.75rem' }}
          >
            Spring Meadow
          </button>
          <button
            onClick={() => setTheme('sunset')}
            className={`badge ${theme === 'sunset' ? 'badge-peach' : ''}`}
            style={{ border: 'none', cursor: 'pointer', padding: '0.35rem 0.75rem' }}
          >
            Golden Sunset
          </button>
          <button
            onClick={() => setTheme('lavender')}
            className={`badge ${theme === 'lavender' ? 'badge-lavender' : ''}`}
            style={{ border: 'none', cursor: 'pointer', padding: '0.35rem 0.75rem' }}
          >
            Lavender Mist
          </button>
        </div>
      </div>

      {/* 3D WebGL Canvas Container */}
      <div
        ref={mountRef}
        style={{
          width: '100%',
          height: 380,
          borderRadius: '20px',
          overflow: 'hidden',
          position: 'relative',
          boxShadow: 'inset 0 0 20px rgba(0,0,0,0.06)',
          border: '1.5px solid #E6E0D4'
        }}
      >
        {/* Floating 3D Reward Badge Overlay */}
        {rewardMsg && (
          <div style={{
            position: 'absolute',
            top: 20,
            left: '50%',
            transform: 'translateX(-50%)',
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            border: '2px solid #7C9A82',
            borderRadius: 9999,
            padding: '0.6rem 1.4rem',
            boxShadow: '0 10px 25px rgba(0,0,0,0.15)',
            fontSize: '1rem',
            fontWeight: 800,
            color: '#1C3B2B',
            zIndex: 10
          }} className="animate-fade-in">
            {rewardMsg}
          </div>
        )}

        <div style={{
          position: 'absolute',
          bottom: 14,
          left: 14,
          backgroundColor: 'rgba(255,255,255,0.85)',
          padding: '0.4rem 0.85rem',
          borderRadius: 9999,
          fontSize: '0.8rem',
          fontWeight: 600,
          color: '#536B5C',
          display: 'flex',
          alignItems: 'center',
          gap: '0.4rem'
        }}>
          <Compass size={14} /> 3D Camera Rotation Active
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
        borderTop: '1px dashed #E6E0D4'
      }}>
        <div style={{ display: 'flex', gap: '1rem', fontSize: '0.92rem', fontWeight: 700 }}>
          <div>🌱 Plants: <span style={{ color: '#58755E', fontWeight: 800 }}>{garden?.plants || 3}</span></div>
          <div>🌸 3D Flowers: <span style={{ color: '#7A66A3', fontWeight: 800 }}>{garden?.flowers || 5}</span></div>
          <div>🌳 3D Trees: <span style={{ color: '#3B7A8C', fontWeight: 800 }}>{garden?.trees || 2}</span></div>
        </div>

        <button
          onClick={handleWaterGarden}
          disabled={isWatering}
          className="btn-peach"
          style={{ padding: '0.75rem 1.6rem', fontSize: '1rem' }}
        >
          <Droplets size={20} className={isWatering ? 'animate-pulse-gentle' : ''} />
          <span>{isWatering ? 'Watering 3D Garden...' : 'Water 3D Garden 💦'}</span>
        </button>
      </div>
    </div>
  );
};

export default ThreeMemoryGardenCanvas;
