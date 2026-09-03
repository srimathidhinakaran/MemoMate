import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { soundFx } from '../utils/soundEffects';
import { gardenAPI } from '../services/api';
import { Trees, Droplets, Sparkles, Flame } from 'lucide-react';

const GardenPreview = () => {
  const { user, garden, setGarden, speakText, voiceAssistance } = useAuth();
  const [watering, setWatering] = useState(false);

  const handleWater = async () => {
    soundFx.playXpGain();
    setWatering(true);
    if (voiceAssistance) {
      speakText("Watering your memory garden! Plants are blooming.");
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
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          <div style={{
            width: 42,
            height: 42,
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #00E676 0%, #00F2FE 100%)',
            display: 'flex',
            alignItems: 'center',
            justify: 'center'
          }}>
            <Trees size={24} color="#050B14" />
          </div>
          <div>
            <h3 style={{ fontSize: '1.25rem', color: '#F8FAFC', fontWeight: 900, fontFamily: 'var(--font-heading)' }}>
              MEMOMATE 3D GARDEN 🌱
            </h3>
            <span style={{ fontSize: '0.8rem', color: '#94A3B8', fontWeight: 700 }}>
              VISUALIZING COGNITIVE ENGAGEMENT & STREAK BLOOMS
            </span>
          </div>
        </div>

        <span className="badge badge-cyan" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
          <Flame size={16} color="#FF4E50" fill="#FF4E50" />
          <span>{garden?.streak || 4} DAY STREAK</span>
        </span>
      </div>

      {/* Visual Garden Elements Showcase */}
      <div style={{
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
        borderRadius: '16px',
        padding: '1.4rem',
        border: '1px solid rgba(0, 242, 254, 0.2)',
        marginBottom: '1rem',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{
          fontSize: '3rem',
          letterSpacing: '0.8rem',
          margin: '0.5rem 0',
          transition: 'transform 0.3s ease',
          transform: watering ? 'scale(1.2) translateY(-4px)' : 'scale(1)'
        }}>
          🌱 🌸 🌳 🦋 ☀️ 🌸 🌱
        </div>

        <div style={{
          display: 'flex',
          justify: 'space-around',
          marginTop: '0.85rem',
          paddingTop: '0.85rem',
          borderTop: '1px dashed rgba(255, 255, 255, 0.1)',
          fontSize: '0.88rem',
          fontWeight: 800,
          fontFamily: 'var(--font-esports)'
        }}>
          <div>
            <span style={{ color: '#00E676' }}>PLANTS: </span>
            <span style={{ color: '#F8FAFC' }}>{garden?.plants || 3}</span>
          </div>
          <div>
            <span style={{ color: '#A855F7' }}>FLOWERS: </span>
            <span style={{ color: '#F8FAFC' }}>{garden?.flowers || 5}</span>
          </div>
          <div>
            <span style={{ color: '#00F2FE' }}>TREES: </span>
            <span style={{ color: '#F8FAFC' }}>{garden?.trees || 2}</span>
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem' }}>
        <button
          onClick={handleWater}
          disabled={watering}
          className="btn-secondary"
          style={{ padding: '0.65rem 1.2rem', fontSize: '0.85rem' }}
        >
          <Droplets size={18} color="#00F2FE" className={watering ? 'animate-pulse-glow' : ''} />
          <span>{watering ? 'WATERING GARDEN...' : 'WATER GARDEN TODAY 💦'}</span>
        </button>

        <Link 
          to="/garden" 
          onClick={() => soundFx.playClick()}
          style={{ color: '#00F2FE', fontWeight: 800, fontFamily: 'var(--font-esports)', fontSize: '0.85rem', textDecoration: 'none' }}
        >
          EXPLORE 3D GARDEN →
        </Link>
      </div>
    </div>
  );
};

export default GardenPreview;
