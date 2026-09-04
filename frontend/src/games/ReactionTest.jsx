import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { sessionAPI } from '../services/api';
import { soundFx } from '../utils/soundEffects';
import { Zap, ArrowLeft, RotateCcw, Award } from 'lucide-react';

const ReactionTest = () => {
  const navigate = useNavigate();
  const { user, updateStateFromSession, speakText, voiceAssistance } = useAuth();

  const [state, setState] = useState('idle'); // 'idle' | 'waiting' | 'ready' | 'result'
  const [reactionTime, setReactionTime] = useState(0);
  const startTimeRef = useRef(0);
  const timerRef = useRef(null);

  const handleStart = () => {
    soundFx.playClick();
    setState('waiting');
    if (voiceAssistance) speakText("Wait for green signal then tap as fast as possible.");

    // Random delay between 1.5s to 3.5s
    const delay = Math.floor(Math.random() * 2000) + 1500;
    timerRef.current = setTimeout(() => {
      setState('ready');
      startTimeRef.current = Date.now();
      soundFx.playSuccess();
    }, delay);
  };

  const handleClick = () => {
    if (state === 'waiting') {
      clearTimeout(timerRef.current);
      soundFx.playCardMismatch();
      alert("Too early! Wait for green signal.");
      setState('idle');
    } else if (state === 'ready') {
      const elapsed = Date.now() - startTimeRef.current;
      setReactionTime(elapsed);
      setState('result');
      soundFx.playGameWin();
      saveResult(elapsed);
    }
  };

  const saveResult = async (ms) => {
    const calculatedScore = Math.min(100, Math.max(30, Math.round(100 - (ms - 200) / 8)));
    const result = await sessionAPI.createSession({
      userId: user?.id || user?._id,
      activity: 'Speed Reflex Reaction Test',
      category: 'reaction',
      difficulty: 'Medium',
      score: calculatedScore,
      accuracy: 100,
      reactionTime: ms
    });

    if (result) {
      updateStateFromSession(result);
    }
  };

  return (
    <div style={{ maxWidth: 800, margin: '0 auto', width: '100%' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
        <button onClick={() => navigate('/assessment')} className="btn-secondary" style={{ padding: '0.45rem 0.9rem', fontSize: '0.85rem' }}>
          <ArrowLeft size={16} /> Back to Exercises
        </button>
        <span className="badge badge-sage" style={{ fontSize: '0.85rem' }}>
          <Zap size={14} /> SPEED REFLEX TEST
        </span>
      </div>

      <div
        onClick={state !== 'idle' && state !== 'result' ? handleClick : undefined}
        className="garden-card animate-fade-in"
        style={{
          padding: '2.5rem',
          textAlign: 'center',
          minHeight: '420px',
          display: 'flex',
          flexDirection: 'column',
          justify: 'center',
          alignItems: 'center',
          backgroundColor: state === 'waiting' ? '#FB923C' : (state === 'ready' ? '#34D399' : '#161C26'),
          color: state === 'waiting' || state === 'ready' ? '#0B0E14' : '#FFFFFF',
          cursor: state !== 'idle' && state !== 'result' ? 'pointer' : 'default',
          transition: 'background-color 0.15s ease'
        }}
      >
        {state === 'idle' && (
          <div>
            <div className="icon-box" style={{ width: 64, height: 64, borderRadius: '16px', background: 'linear-gradient(135deg, #34D399 0%, #38BDF8 100%)', margin: '0 auto 1.25rem', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
              <Zap size={32} color="#0B0E14" />
            </div>
            <h2 style={{ fontSize: '1.8rem', color: '#FFFFFF', fontWeight: 900, marginBottom: '0.5rem' }}>
              Speed Reflex Reaction Test
            </h2>
            <p style={{ color: '#94A3B8', fontSize: '0.95rem', maxWidth: 500, margin: '0 auto 1.5rem' }}>
              Test your motor reaction speed. When the screen turns green, tap immediately!
            </p>
            <button onClick={handleStart} className="btn-primary" style={{ padding: '0.85rem 2rem', fontSize: '1.05rem' }}>
              START TEST NOW
            </button>
          </div>
        )}

        {state === 'waiting' && (
          <div>
            <h2 style={{ fontSize: '2.2rem', fontWeight: 900 }}>WAIT FOR GREEN...</h2>
            <p style={{ fontSize: '1.1rem', fontWeight: 700 }}>Don't tap yet!</p>
          </div>
        )}

        {state === 'ready' && (
          <div>
            <h2 style={{ fontSize: '2.8rem', fontWeight: 900 }}>TAP NOW! ⚡</h2>
          </div>
        )}

        {state === 'result' && (
          <div>
            <div className="icon-box" style={{ width: 64, height: 64, borderRadius: '16px', backgroundColor: 'rgba(52, 211, 153, 0.15)', border: '1px solid #34D399', margin: '0 auto 1.25rem', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
              <Award size={36} color="#34D399" />
            </div>
            <h2 style={{ fontSize: '1.8rem', color: '#FFFFFF', fontWeight: 900, marginBottom: '0.5rem' }}>
              SPEED RECORDED!
            </h2>
            <div style={{ fontSize: '2.8rem', color: '#34D399', fontWeight: 900, margin: '0.5rem 0' }}>
              {reactionTime} <span style={{ fontSize: '1rem', color: '#94A3B8' }}>ms</span>
            </div>
            <p style={{ color: '#94A3B8', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
              Reaction score updated in MongoDB.
            </p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
              <button onClick={handleStart} className="btn-primary">
                <RotateCcw size={16} /> TRY AGAIN
              </button>
              <button onClick={() => navigate('/dashboard')} className="btn-secondary">
                DASHBOARD
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReactionTest;
