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
      backgroundColor: '#161B22',
      borderBottom: '1px solid #30363D',
      padding: '0.6rem 1.5rem',
      display: 'flex',
      alignItems: 'center',
      justify: 'space-between',
      fontSize: '0.88rem',
      color: '#FFFFFF',
      boxShadow: '0 2px 10px rgba(0, 0, 0, 0.4)'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem', fontWeight: 700 }}>
        <div className="icon-box" style={{ width: 26, height: 26, borderRadius: '6px', backgroundColor: 'rgba(56, 189, 248, 0.15)' }}>
          <Eye size={16} color="#38BDF8" />
        </div>
        <span style={{ color: '#FFFFFF', letterSpacing: '0.01em' }}>Elderly Accessibility Mode</span>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
        {/* Text Size Adjuster */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <Type size={16} color="#38BDF8" style={{ marginRight: '0.1rem' }} />
          <span style={{ fontWeight: 700, color: '#9198A1', marginRight: '0.3rem', fontSize: '0.85rem' }}>Text Size:</span>
          
          <button
            onClick={() => setFontSize('font-normal')}
            style={{
              padding: '0.3rem 0.7rem',
              borderRadius: '6px',
              border: fontSize === 'font-normal' ? '1px solid #38BDF8' : '1px solid #30363D',
              backgroundColor: fontSize === 'font-normal' ? 'rgba(56, 189, 248, 0.2)' : '#0D1117',
              color: fontSize === 'font-normal' ? '#FFFFFF' : '#9198A1',
              fontWeight: fontSize === 'font-normal' ? 800 : 600,
              fontSize: '0.8rem',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
          >
            Normal
          </button>
          
          <button
            onClick={() => setFontSize('font-large')}
            style={{
              padding: '0.3rem 0.7rem',
              borderRadius: '6px',
              border: fontSize === 'font-large' ? '1px solid #38BDF8' : '1px solid #30363D',
              backgroundColor: fontSize === 'font-large' ? 'rgba(56, 189, 248, 0.2)' : '#0D1117',
              color: fontSize === 'font-large' ? '#FFFFFF' : '#9198A1',
              fontWeight: fontSize === 'font-large' ? 800 : 600,
              fontSize: '0.8rem',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
          >
            Large
          </button>
          
          <button
            onClick={() => setFontSize('font-xlarge')}
            style={{
              padding: '0.3rem 0.7rem',
              borderRadius: '6px',
              border: fontSize === 'font-xlarge' ? '1px solid #38BDF8' : '1px solid #30363D',
              backgroundColor: fontSize === 'font-xlarge' ? 'rgba(56, 189, 248, 0.2)' : '#0D1117',
              color: fontSize === 'font-xlarge' ? '#FFFFFF' : '#9198A1',
              fontWeight: fontSize === 'font-xlarge' ? 800 : 600,
              fontSize: '0.8rem',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
          >
            Extra Large
          </button>
        </div>

        {/* Voice Assistance Button */}
        <button
          onClick={handleVoiceToggle}
          style={{
            padding: '0.35rem 0.85rem',
            fontSize: '0.82rem',
            fontWeight: 700,
            borderRadius: '8px',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.45rem',
            border: voiceAssistance ? '1px solid #34D399' : '1px solid #30363D',
            backgroundColor: voiceAssistance ? 'rgba(52, 211, 153, 0.15)' : '#0D1117',
            color: voiceAssistance ? '#34D399' : '#9198A1',
            cursor: 'pointer',
            transition: 'all 0.2s ease'
          }}
        >
          {voiceAssistance ? <Volume2 size={16} color="#34D399" /> : <VolumeX size={16} color="#9198A1" />}
          <span>{voiceAssistance ? 'Voice Assistance ON' : 'Voice Assistance OFF'}</span>
        </button>
      </div>
    </div>
  );
};

export default AccessibilityBar;
