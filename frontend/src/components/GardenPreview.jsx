import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import * as THREE from 'three';
import { useAuth } from '../context/AuthContext';
import { soundFx } from '../utils/soundEffects';
import { gardenAPI } from '../services/api';
import { Cpu, Zap, Flame, ArrowRight } from 'lucide-react';

const GardenPreview = () => {
  const { user, garden, setGarden, speakText, voiceAssistance, t } = useAuth();
  const [charging, setCharging] = useState(false);
  const mountRef = useRef(null);
  const nodesGroupRef = useRef(null);

  // Render 3D Three.js WebGL Cyber Mind Matrix Canvas
  useEffect(() => {
    const currentMount = mountRef.current;
    if (!currentMount) return;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0B0E14);

    const camera = new THREE.PerspectiveCamera(45, currentMount.clientWidth / currentMount.clientHeight, 0.1, 100);
    camera.position.set(0, 3.5, 7);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(currentMount.clientWidth, currentMount.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    currentMount.appendChild(renderer.domElement);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0x38BDF8, 2, 20);
    pointLight.position.set(2, 5, 3);
    scene.add(pointLight);

    const goldLight = new THREE.PointLight(0xFBBF24, 1.5, 15);
    goldLight.position.set(-3, 3, -2);
    scene.add(goldLight);

    const nodesGroup = new THREE.Group();
    nodesGroupRef.current = nodesGroup;
    scene.add(nodesGroup);

    // 3D Matrix Pedestal Base Grid
    const gridHelper = new THREE.GridHelper(10, 10, 0x38BDF8, 0x1E2634);
    gridHelper.position.y = -1;
    scene.add(gridHelper);

    // Create 3D Cyber Neural Crystal Nodes
    const nodeCount = Math.max(4, garden?.plants || 4);
    const nodeColors = [0x38BDF8, 0xFBBF24, 0xC084FC, 0x34D399, 0xFB923C];

    for (let i = 0; i < nodeCount; i++) {
      const angle = (i / nodeCount) * Math.PI * 2;
      const radius = 2.2;
      const x = Math.cos(angle) * radius;
      const z = Math.sin(angle) * radius;

      const nodeGroup = new THREE.Group();
      nodeGroup.position.set(x, -0.2, z);

      // Core Octahedron Quantum Crystal
      const crystalGeo = new THREE.OctahedronGeometry(0.5, 0);
      const crystalMat = new THREE.MeshStandardMaterial({
        color: nodeColors[i % nodeColors.length],
        roughness: 0.2,
        metalness: 0.8,
        emissive: nodeColors[i % nodeColors.length],
        emissiveIntensity: 0.5
      });
      const crystalMesh = new THREE.Mesh(crystalGeo, crystalMat);
      nodeGroup.add(crystalMesh);

      // Quantum Energy Orbit Rings
      const ringGeo = new THREE.TorusGeometry(0.7, 0.04, 16, 32);
      const ringMat = new THREE.MeshBasicMaterial({ color: nodeColors[i % nodeColors.length], wireframe: true });
      const ringMesh = new THREE.Mesh(ringGeo, ringMat);
      ringMesh.rotation.x = Math.PI / 2;
      nodeGroup.add(ringMesh);

      nodesGroup.add(nodeGroup);
    }

    // Floating Ambient Particles
    const particleGeo = new THREE.BufferGeometry();
    const particleCount = 70;
    const posArray = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount * 3; i++) {
      posArray[i] = (Math.random() - 0.5) * 10;
    }
    particleGeo.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    const particleMat = new THREE.PointsMaterial({ size: 0.06, color: 0x38BDF8, transparent: true, opacity: 0.8 });
    const particleSystem = new THREE.Points(particleGeo, particleMat);
    scene.add(particleSystem);

    let frameId;
    let clock = new THREE.Clock();

    const animate = () => {
      frameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      if (nodesGroupRef.current) {
        nodesGroupRef.current.rotation.y = elapsedTime * 0.4;
        nodesGroupRef.current.children.forEach((child, idx) => {
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

  const handleCharge = async () => {
    soundFx.playXpGain();
    setCharging(true);
    if (voiceAssistance) {
      speakText("Charging 3D Mind Matrix! Neural crystals activated.");
    }
    const updated = await gardenAPI.updateGarden(user?.id || user?._id, 'water');
    setGarden(updated);
    setTimeout(() => setCharging(false), 500); // Fast 500ms
  };

  return (
    <div className="garden-card animate-fade-in" style={{
      background: 'linear-gradient(135deg, rgba(56, 189, 248, 0.08) 0%, #161C26 100%)',
      border: '1px solid rgba(56, 189, 248, 0.3)',
      boxShadow: '0 0 25px rgba(56, 189, 248, 0.15)'
    }}>
      <div className="garden-card-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div className="icon-box" style={{
            width: 44,
            height: 44,
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #38BDF8 0%, #34D399 100%)',
            display: 'inline-flex',
            alignItems: 'center',
            justify: 'center'
          }}>
            <Cpu size={24} color="#0B0E14" />
          </div>
          <div>
            <h3 style={{ fontSize: '1.2rem', color: '#FFFFFF', fontWeight: 900, fontFamily: 'var(--font-heading)' }}>
              {t('navGarden').toUpperCase()}
            </h3>
            <span style={{ fontSize: '0.8rem', color: '#94A3B8', fontWeight: 700 }}>
              {t('gardenSub')}
            </span>
          </div>
        </div>

        <span className="badge badge-cyan" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
          <Flame size={16} color="#FB923C" fill="#FB923C" />
          <span>{garden?.streak ?? 0} {t('daysStreak')}</span>
        </span>
      </div>

      {/* Live Interactive 3D Three.js WebGL Canvas Container */}
      <div
        ref={mountRef}
        style={{
          width: '100%',
          height: '220px',
          borderRadius: '16px',
          backgroundColor: '#0B0E14',
          border: '1px solid rgba(56, 189, 248, 0.25)',
          marginBottom: '1rem',
          position: 'relative',
          overflow: 'hidden'
        }}
      />

      {/* Relic Stats Row */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '0.75rem',
        marginBottom: '1.1rem',
        backgroundColor: '#0B0E14',
        padding: '0.75rem 1rem',
        borderRadius: '12px',
        border: '1px solid #263142',
        textAlign: 'center',
        fontFamily: 'var(--font-heading)'
      }}>
        <div>
          <span style={{ color: '#38BDF8', fontSize: '0.75rem', fontWeight: 800 }}>{t('cyberCrystals')}</span>
          <div style={{ color: '#FFFFFF', fontWeight: 900, fontSize: '1.1rem' }}>{garden?.plants ?? 1}</div>
        </div>
        <div>
          <span style={{ color: '#C084FC', fontSize: '0.75rem', fontWeight: 800 }}>{t('neuralCores')}</span>
          <div style={{ color: '#FFFFFF', fontWeight: 900, fontSize: '1.1rem' }}>{garden?.flowers ?? 1}</div>
        </div>
        <div>
          <span style={{ color: '#34D399', fontSize: '0.75rem', fontWeight: 800 }}>{t('quantumRings')}</span>
          <div style={{ color: '#FFFFFF', fontWeight: 900, fontSize: '1.1rem' }}>{garden?.trees ?? 0}</div>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem' }}>
        <button
          onClick={handleCharge}
          disabled={charging}
          className="btn-secondary"
          style={{ padding: '0.65rem 1.2rem', fontSize: '0.85rem' }}
        >
          <Zap size={18} color="#38BDF8" />
          <span>{charging ? '...' : t('water3dGarden')}</span>
        </button>

        <Link 
          to="/garden" 
          onClick={() => soundFx.playClick()}
          style={{ color: '#38BDF8', fontWeight: 800, fontFamily: 'var(--font-heading)', fontSize: '0.85rem', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}
        >
          {t('openMindSanctum')} <ArrowRight size={16} />
        </Link>
      </div>
    </div>
  );
};

export default GardenPreview;
