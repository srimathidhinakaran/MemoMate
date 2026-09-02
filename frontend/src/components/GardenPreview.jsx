import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { gardenAPI } from '../services/api';
import { Trees, Droplets, Sparkles, Flame } from 'lucide-react';

const GardenPreview = () => {
  const { user, garden, setGarden, speakText, voiceAssistance } = useAuth();
  const [watering, setWatering] = useState(false);

  const handleWater = async () => {
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
      background: 'linear-gradient(135deg, #F7F4EE 0%, #EBF2EC 100%)',
      border: '1.5px solid #7C9A82'
    }}>
      <div className="garden-card-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <div style={{
            width: 38,
            height: 38,
            borderRadius: '10px',
            backgroundColor: '#FFFFFF',
            display: 'flex',
            alignItems: 'center',
            justify: 'center'
          }}>
            <Trees size={22} color="#58755E" />
          </div>
          <div>
            <h3 style={{ fontSize: '1.2rem', color: '#1C3B2B' }}>Meena's Memory Garden 🌱</h3>
            <span style={{ fontSize: '0.82rem', color: '#536B5C' }}>Visualizing cognitive engagement & activity streak</span>
          </div>
        </div>

        <span className="badge badge-sage" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
          <Flame size={16} color="#C87862" />
          <span>{garden?.streak || 4} Day Streak!</span>
        </span>
      </div>

      {/* Visual Garden Elements Showcase */}
      <div style={{
        backgroundColor: '#FFFFFF',
        borderRadius: '18px',
        padding: '1.25rem',
        border: '1px solid #E6E0D4',
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
          transform: watering ? 'scale(1.15) translateY(-4px)' : 'scale(1)'
        }}>
          🌱 🌸 🌳 🦋 ☀️ 🌸 🌱
        </div>

        <div style={{
          display: 'flex',
          justify: 'space-around',
          marginTop: '0.75rem',
          paddingTop: '0.75rem',
          borderTop: '1px dashed #E6E0D4',
          fontSize: '0.9rem',
          fontWeight: 600
        }}>
          <div>
            <span style={{ color: '#58755E' }}>Plants: </span>
            <span style={{ fontWeight: 800 }}>{garden?.plants || 3}</span>
          </div>
          <div>
            <span style={{ color: '#7A66A3' }}>Flowers: </span>
            <span style={{ fontWeight: 800 }}>{garden?.flowers || 5}</span>
          </div>
          <div>
            <span style={{ color: '#3B7A8C' }}>Trees: </span>
            <span style={{ fontWeight: 800 }}>{garden?.trees || 2}</span>
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem' }}>
        <button
          onClick={handleWater}
          disabled={watering}
          className="btn-secondary"
          style={{ padding: '0.6rem 1.2rem', fontSize: '0.9rem' }}
        >
          <Droplets size={18} color="#3B7A8C" className={watering ? 'animate-pulse-gentle' : ''} />
          <span>{watering ? 'Watering Garden...' : 'Water Garden Today 💦'}</span>
        </button>

        <Link to="/garden" style={{ color: '#58755E', fontWeight: 700, fontSize: '0.9rem', textDecoration: 'none' }}>
          Explore Virtual Garden →
        </Link>
      </div>
    </div>
  );
};

export default GardenPreview;
