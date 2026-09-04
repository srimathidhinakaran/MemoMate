import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { MapPin, Calendar, Sun, CheckCircle2, AlertCircle, Volume2, HeartHandshake } from 'lucide-react';
import { soundFx } from '../utils/soundEffects';

const DementiaOrientationCard = () => {
  const { t, speakText, user } = useAuth();
  const [medTaken, setMedTaken] = useState(true);

  const now = new Date();
  const dateStr = now.toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  const toggleMedication = () => {
    soundFx.playSuccess();
    const nextState = !medTaken;
    setMedTaken(nextState);
    if (nextState) {
      speakText("Morning medication recorded as taken.");
    } else {
      speakText("Medication reminder set for morning dose.");
    }
  };

  const handleSpeakAnchor = () => {
    soundFx.playClick();
    const textToSpeak = `${t('orientationHeader')}. ${t('todaysDate')}: ${dateStr}, ${timeStr}. ${t('memoryAnchorPrompt')}: ${t('memoryAnchorText')}`;
    speakText(textToSpeak);
  };

  return (
    <div style={{
      backgroundColor: '#161B22',
      border: '1px solid #34D399',
      borderRadius: '20px',
      padding: '1.5rem 1.8rem',
      boxShadow: '0 8px 32px rgba(52, 211, 153, 0.12)',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Top Banner Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
          <div className="icon-box" style={{ width: 42, height: 42, borderRadius: '12px', backgroundColor: 'rgba(52, 211, 153, 0.15)', border: '1px solid rgba(52, 211, 153, 0.3)' }}>
            <MapPin size={24} color="#34D399" />
          </div>
          <div>
            <div style={{ fontSize: '1.2rem', fontWeight: 900, color: '#FFFFFF', fontFamily: 'var(--font-heading)' }}>
              {t('orientationHeader')}
            </div>
            <div style={{ fontSize: '0.82rem', color: '#34D399', fontWeight: 700 }}>
              {t('orientationSub')}
            </div>
          </div>
        </div>

        <button
          onClick={handleSpeakAnchor}
          style={{
            padding: '0.45rem 0.9rem',
            borderRadius: '10px',
            backgroundColor: 'rgba(52, 211, 153, 0.15)',
            border: '1px solid #34D399',
            color: '#34D399',
            fontWeight: 800,
            fontSize: '0.82rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.45rem',
            transition: 'all 0.2s ease'
          }}
        >
          <Volume2 size={16} />
          <span>READ ANCHOR ALOUD</span>
        </button>
      </div>

      {/* Grid Information Modules */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
        gap: '1.2rem',
        marginBottom: '1.2rem'
      }}>
        {/* 1. Date & Time Orientation */}
        <div style={{
          backgroundColor: '#0D1117',
          border: '1px solid #30363D',
          borderRadius: '14px',
          padding: '1rem 1.2rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem', color: '#9198A1', fontSize: '0.8rem', fontWeight: 700 }}>
            <Calendar size={16} color="#38BDF8" />
            <span>{t('todaysDate')}</span>
          </div>
          <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#FFFFFF' }}>
            {dateStr}
          </div>
          <div style={{ fontSize: '0.9rem', color: '#38BDF8', fontWeight: 700, marginTop: '0.2rem' }}>
            {timeStr}
          </div>
        </div>

        {/* 2. NER Regional Season */}
        <div style={{
          backgroundColor: '#0D1117',
          border: '1px solid #30363D',
          borderRadius: '14px',
          padding: '1rem 1.2rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem', color: '#9198A1', fontSize: '0.8rem', fontWeight: 700 }}>
            <Sun size={16} color="#FBBF24" />
            <span>{t('currentSeason')}</span>
          </div>
          <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#FFFFFF' }}>
            Autumn / Post-Monsoon 🌿
          </div>
          <div style={{ fontSize: '0.85rem', color: '#9198A1', fontWeight: 600, marginTop: '0.2rem' }}>
            Pleasant climate across NER hill towns & valleys
          </div>
        </div>

        {/* 3. Medication Tracker */}
        <div style={{
          backgroundColor: '#0D1117',
          border: medTaken ? '1px solid rgba(52, 211, 153, 0.4)' : '1px solid rgba(251, 146, 60, 0.4)',
          borderRadius: '14px',
          padding: '1rem 1.2rem',
          cursor: 'pointer'
        }} onClick={toggleMedication}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#9198A1', fontSize: '0.8rem', fontWeight: 700 }}>
              <HeartHandshake size={16} color={medTaken ? '#34D399' : '#FB923C'} />
              <span>{t('medicationCheck')}</span>
            </div>
            <span style={{ fontSize: '0.75rem', color: '#9198A1' }}>Tap to toggle</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            {medTaken ? (
              <>
                <CheckCircle2 size={20} color="#34D399" />
                <span style={{ fontSize: '1.05rem', fontWeight: 800, color: '#34D399' }}>{t('medicationTaken')}</span>
              </>
            ) : (
              <>
                <AlertCircle size={20} color="#FB923C" />
                <span style={{ fontSize: '1.05rem', fontWeight: 800, color: '#FB923C' }}>{t('medicationPending')}</span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Personal Memory Anchor Text Banner */}
      <div style={{
        backgroundColor: 'rgba(52, 211, 153, 0.08)',
        border: '1px solid rgba(52, 211, 153, 0.25)',
        borderRadius: '14px',
        padding: '1rem 1.2rem'
      }}>
        <div style={{ fontSize: '0.8rem', fontWeight: 800, color: '#34D399', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.3rem' }}>
          📍 {t('memoryAnchorPrompt')}
        </div>
        <p style={{ margin: 0, fontSize: '1.02rem', fontWeight: 700, color: '#F8FAFC', lineHeight: 1.5 }}>
          "{t('memoryAnchorText')}"
        </p>
      </div>
    </div>
  );
};

export default DementiaOrientationCard;
