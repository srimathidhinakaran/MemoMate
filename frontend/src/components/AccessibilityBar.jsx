import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Type, Volume2, VolumeX, Eye } from 'lucide-react';

const AccessibilityBar = () => {
  const { fontSize, setFontSize, voiceAssistance, setVoiceAssistance, speakText } = useAuth();

  const handleVoiceToggle = () => {
    const nextState = !voiceAssistance;
    setVoiceAssistance(nextState);
    if (nextState) {
      speakText("Voice assistance activated. Buttons and instructions will be read aloud.");
    }
  };

  return (
    <div style={{
      backgroundColor: '#F7F4EE',
      borderBottom: '1px solid #E6E0D4',
      padding: '0.5rem 1.5rem',
      display: 'flex',
      alignItems: 'center',
      justify: 'space-between',
      fontSize: '0.9rem',
      color: '#1C3B2B'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600 }}>
        <Eye size={18} color="#58755E" />
        <span>Elderly Accessibility Mode</span>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
        {/* Text Size Adjuster */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <Type size={16} color="#58755E" />
          <span style={{ fontWeight: 600, marginRight: '0.2rem' }}>Text Size:</span>
          <button
            onClick={() => setFontSize('font-normal')}
            className={`badge ${fontSize === 'font-normal' ? 'badge-sage' : ''}`}
            style={{ border: 'none', cursor: 'pointer', padding: '0.25rem 0.6rem' }}
          >
            Normal
          </button>
          <button
            onClick={() => setFontSize('font-large')}
            className={`badge ${fontSize === 'font-large' ? 'badge-sage' : ''}`}
            style={{ border: 'none', cursor: 'pointer', padding: '0.25rem 0.6rem' }}
          >
            Large
          </button>
          <button
            onClick={() => setFontSize('font-xlarge')}
            className={`badge ${fontSize === 'font-xlarge' ? 'badge-sage' : ''}`}
            style={{ border: 'none', cursor: 'pointer', padding: '0.25rem 0.6rem' }}
          >
            Extra Large
          </button>
        </div>

        {/* Voice Assistance Button */}
        <button
          onClick={handleVoiceToggle}
          className={`btn-secondary`}
          style={{
            padding: '0.35rem 0.85rem',
            fontSize: '0.85rem',
            borderColor: voiceAssistance ? '#7C9A82' : '#C87862',
            backgroundColor: voiceAssistance ? '#EBF2EC' : '#FFF'
          }}
        >
          {voiceAssistance ? <Volume2 size={16} color="#58755E" /> : <VolumeX size={16} color="#C87862" />}
          <span>{voiceAssistance ? 'Voice Assistance ON' : 'Voice Assistance OFF'}</span>
        </button>
      </div>
    </div>
  );
};

export default AccessibilityBar;
