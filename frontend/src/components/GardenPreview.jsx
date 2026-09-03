import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import * as THREE from 'three';
import { useAuth } from '../context/AuthContext';
import { soundFx } from '../utils/soundEffects';
import { gardenAPI } from '../services/api';
import { Trees, Droplets, Sparkles, Flame, Shield, ArrowRight } from 'lucide-react';

const GardenPreview = () => {
  const { user, garden, setGarden, speakText, voiceAssistance } = useAuth();
  const [watering, setWatering] = useState(false);
  const mountRef = useRef(null);
  const flowersGroupRef = useRef(null);

  // Render 3D Three.js WebGL Cyber Garden Preview Canvas
  useEffect(() => {
    const currentMount = mountRef.current;
    if (!currentMount) return;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x090C15);

    const camera = new THREE.PerspectiveCamera(45, currentMount.clientWidth / currentMount.clientHeight, 0.1, 100);
    camera.position.set(0, 3.5, 7);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(currentMount.clientWidth, currentMount.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    currentMount.appendChild(renderer.domElement);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0x00F2FE, 2, 20);
    pointLight.position.set(2, 5, 3);
    scene.add(pointLight);

    const goldLight = new THREE.PointLight(0xFFD700, 1.5, 15);
    goldLight.position.set(-3, 3, -2);
    scene.add(goldLight);

    // Group for 3D Cyber Flower Geometries
    const flowersGroup = new THREE.Group();
    flowersGroupRef.current = flowersGroup;
    scene.add(flowersGroup);

    // 3D Grid Pedestal Base
    const gridHelper = new THREE.GridHelper(10, 10, 0x00F2FE, 0x1A233A);
    gridHelper.position.y = -1;
    scene.add(gridHelper);

    // Create 3D Cyber Flower Meshes
    const plantCount = Math.max(3, garden?.plants || 3);
    const flowerColors = [0x00F2FE, 0xFFD700, 0xA855F7, 0x00E676, 0xFF4E50];

    for (let i = 0; i < plantCount; i++) {
      const angle = (i / plantCount) * Math.PI * 2;
      const radius = 2.2;
      const x = Math.cos(angle) * radius;
      const z = Math.sin(angle) * radius;

      // 3D Flower Stem & Petals
      const flowerNode = new THREE.Group();
      flowerNode.position.set(x, -0.2, z);

      // Core Crystal Gem
      const gemGeo = new THREE.IcosahedronGeometry(0.55, 1);
      const gemMat = new THREE.MeshStandardMaterial({
        color: flowerColors[i % flowerColors.length],
        roughness: 0.2,
        metalness: 0.8,
        emissive: flowerColors[i % flowerColors.length],
        emissiveIntensity: 0.4
      });
      const gemMesh = new THREE.Mesh(gemGeo, gemMat);
      flowerNode.add(gemMesh);

      // Petal Rings
      const ringGeo = new THREE.TorusGeometry(0.75, 0.05, 16, 32);
      const ringMat = new THREE.MeshBasicMaterial({ color: flowerColors[i % flowerColors.length], wireframe: true });
      const ringMesh = new THREE.Mesh(ringGeo, ringMat);
      ringMesh.rotation.x = Math.PI / 2;
      flowerNode.add(ringMesh);

      flowersGroup.add(flowerNode);
    }

    // Floating Ambient Particles
    const particleGeo = new THREE.BufferGeometry();
    const particleCount = 60;
    const posArray = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount * 3; i++) {
      posArray[i] = (Math.random() - 0.5) * 10;
    }
    particleGeo.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    const particleMat = new THREE.PointsMaterial({ size: 0.06, color: 0x00F2FE, transparent: true, opacity: 0.7 });
    const particleSystem = new THREE.Points(particleGeo, particleMat);
    scene.add(particleSystem);

    let frameId;
    let clock = new THREE.Clock();

    const animate = () => {
      frameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      if (flowersGroupRef.current) {
        flowersGroupRef.current.rotation.y = elapsedTime * 0.4;
        flowersGroupRef.current.children.forEach((child, idx) => {
          child.position.y = -0.2 + Math.sin(elapsedTime * 2 + idx) * 0.15;
          child.rotation.y = elapsedTime * 1.5;
        });
      }

      particleSystem.rotation.y = elapsedTime * 0.05;
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
  }, [garden]);

  const handleWater = async () => {
    soundFx.playXpGain();
    setWatering(true);
    if (voiceAssistance) {
      speakText("Watering 3D memory garden! Cognitive plants blooming.");
    }
    const updated = await gardenAPI.updateGarden(user?.id || user?._id, 'water');
    setGarden(updated);
    setTimeout(() => setWatering(false), 1200);
  };

  return (
    <div className="garden-card animate-fade-in" style={{
      background: 'linear-gradient(135deg, rgba(0, 242, 254, 0.08) 0%, rgba(15, 20, 36, 0.95) 100%)',
      border: '1px solid rgba(0, 242, 254, 0.3)',
      boxShadow: '0 0 25px rgba(0, 242, 254, 0.15)'
    }}>
      <div className="garden-card-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div className="icon-box" style={{
            width: 44,
            height: 44,
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #34D399 0%, #38BDF8 100%)'
          }}>
            <Trees size={24} color="#050B14" />
          </div>
          <div>
            <h3 style={{ fontSize: '1.25rem', color: '#F8FAFC', fontWeight: 900, fontFamily: 'var(--font-heading)' }}>
              3D WEBGL MEMORY GARDEN
            </h3>
            <span style={{ fontSize: '0.8rem', color: '#94A3B8', fontWeight: 700 }}>
              REAL-TIME 3D VISUALIZATION OF COGNITIVE PROGRESS
            </span>
          </div>
        </div>

        <span className="badge badge-cyan" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
          <Flame size={16} color="#FF4E50" fill="#FF4E50" />
          <span>{garden?.streak || 4} DAY STREAK</span>
        </span>
      </div>

      {/* Live Interactive 3D Three.js WebGL Canvas Container */}
      <div
        ref={mountRef}
        style={{
          width: '100%',
          height: '240px',
          borderRadius: '16px',
          backgroundColor: '#090C15',
          border: '1px solid rgba(0, 242, 254, 0.2)',
          marginBottom: '1rem',
          position: 'relative',
          overflow: 'hidden'
        }}
      />

      {/* Garden Stats Row */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '0.75rem',
        marginBottom: '1.1rem',
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
        padding: '0.75rem 1rem',
        borderRadius: '12px',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        textAlign: 'center',
        fontFamily: 'var(--font-esports)'
      }}>
        <div>
          <span style={{ color: '#00E676', fontSize: '0.75rem' }}>PLANTS</span>
          <div style={{ color: '#F8FAFC', fontWeight: 900, fontSize: '1.1rem' }}>{garden?.plants || 3}</div>
        </div>
        <div>
          <span style={{ color: '#A855F7', fontSize: '0.75rem' }}>FLOWERS</span>
          <div style={{ color: '#F8FAFC', fontWeight: 900, fontSize: '1.1rem' }}>{garden?.flowers || 5}</div>
        </div>
        <div>
          <span style={{ color: '#00F2FE', fontSize: '0.75rem' }}>TREES</span>
          <div style={{ color: '#F8FAFC', fontWeight: 900, fontSize: '1.1rem' }}>{garden?.trees || 2}</div>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem' }}>
        <button
          onClick={handleWater}
          disabled={watering}
          className="btn-secondary"
          style={{ padding: '0.65rem 1.2rem', fontSize: '0.85rem' }}
        >
          <Droplets size={18} color="#00F2FE" />
          <span>{watering ? 'WATERING 3D GARDEN...' : 'WATER 3D GARDEN'}</span>
        </button>

        <Link 
          to="/garden" 
          onClick={() => soundFx.playClick()}
          style={{ color: '#00F2FE', fontWeight: 800, fontFamily: 'var(--font-esports)', fontSize: '0.85rem', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.3rem' }}
        >
          FULL 3D GARDEN <ArrowRight size={16} />
        </Link>
      </div>
    </div>
  );
};

export default GardenPreview;
