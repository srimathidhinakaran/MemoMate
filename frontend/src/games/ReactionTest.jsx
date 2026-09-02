import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { sessionAPI } from '../services/api';
import { Zap, CheckCircle2, RotateCcw, ArrowRight } from 'lucide-react';

const ReactionTest = () => {
  const { user, updateStateFromSession, speakText, voiceAssistance } = useAuth();
  const navigate = useNavigate();

  const [gameState, setGameState] = useState('waiting'); // 'waiting' | 'ready' | 'go' | 'done'
  const [reactionTime, setReactionTime] = useState(null);
  const [scoreResult, setScoreResult] = useState(null);
  const timerRef = useRef(null);
  const startTimeRef = useRef(null);

  const startTest = () => {
    setGameState('ready');
    setReactionTime(null);

    const delay = 2000 + Math.random() * 3000;
    timerRef.current = setTimeout(() => {
      setGameState('go');
      startTimeRef.current = Date.now();
      if (voiceAssistance) speakText("TAP NOW!");
    }, delay);
  };

  useEffect(() => {
    return () => clearTimeout(timerRef.current);
  }, []);

  const handleClick = async () => {
    if (gameState === 'ready') {
      // Clicked too early!
      clearTimeout(timerRef.current);
      alert("Too early! Wait for the sun to shine.");
      setGameState('waiting');
    } else if (gameState === 'go') {
      const ms = Date.now() - startTimeRef.current;
      setReactionTime(ms);

      // Score calculation: 300ms = 95, 600ms = 70
      const score = Math.max(50, Math.min(100, Math.round(100 - (ms - 250) * 0.1)));

      const sessionPayload = {
        userId: user?.id || user?._id,
        activity: 'Reaction Test',
        category: 'reaction',
        difficulty: 'Easy',
        score,
        reactionTime: ms
      };

      const result = await sessionAPI.createSession(sessionPayload);
      updateStateFromSession(result);

      setScoreResult({ score, ms });
      setGameState('done');
    }
  };

  if (gameState === 'done' && scoreResult) {
    return (
      <div className="garden-card animate-fade-in" style={{ textAlign: 'center', padding: '2.5rem 1.5rem', maxWidth: 650, margin: '0 auto' }}>
        <div style={{
          width: 70,
          height: 70,
          borderRadius: '50%',
          backgroundColor: '#EBF6F8',
          display: 'flex',
          alignItems: 'center',
          justify: 'center',
          margin: '0 auto 1.25rem'
        }}>
          <CheckCircle2 size={44} color="#3B7A8C" />
        </div>

        <h2 style={{ fontSize: '2rem', marginBottom: '0.5rem', color: '#1C3B2B' }}>
          Reaction Test Complete! ⚡
        </h2>

        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '1rem',
          backgroundColor: '#F7F4EE',
          padding: '1.25rem',
          borderRadius: '18px',
          marginBottom: '1.75rem',
          textAlign: 'left'
        }}>
          <div>
            <div style={{ fontSize: '0.85rem', color: '#7E9687', fontWeight: 600 }}>Reaction Score</div>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: '#3B7A8C' }}>{scoreResult.score} / 100</div>
          </div>
          <div>
            <div style={{ fontSize: '0.85rem', color: '#7E9687', fontWeight: 600 }}>Speed</div>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: '#1C3B2B' }}>{scoreResult.ms} ms</div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
          <button onClick={startTest} className="btn-secondary">
            <RotateCcw size={18} />
            <span>Try Again</span>
          </button>
          <button onClick={() => navigate('/analysis')} className="btn-peach">
            <span>Analyse My Performance</span>
            <ArrowRight size={18} />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="garden-card animate-fade-in" style={{ maxWidth: 650, margin: '0 auto', textAlign: 'center' }}>
      <h2 style={{ fontSize: '1.6rem', color: '#1C3B2B', marginBottom: '0.5rem' }}>Reaction Speed Test ⚡</h2>
      <p style={{ color: '#536B5C', marginBottom: '1.5rem' }}>
        Click START, then tap as fast as you can when the sun appears!
      </p>

      {gameState === 'waiting' && (
        <button onClick={startTest} className="btn-primary" style={{ padding: '1.25rem 2.5rem', fontSize: '1.3rem' }}>
          <Zap size={24} />
          <span>START TEST</span>
        </button>
      )}

      {(gameState === 'ready' || gameState === 'go') && (
        <div
          onClick={handleClick}
          style={{
            backgroundColor: gameState === 'go' ? '#FDF3F0' : '#F7F4EE',
            border: gameState === 'go' ? '4px solid #C87862' : '2px dashed #7E9687',
            borderRadius: '24px',
            padding: '4rem 2rem',
            cursor: 'pointer',
            userSelect: 'none'
          }}
        >
          <div style={{ fontSize: '4.5rem', marginBottom: '1rem' }}>
            {gameState === 'go' ? '☀️ TAP NOW! ☀️' : '🌱 Wait for it...'}
          </div>
          <div style={{ fontSize: '1.2rem', fontWeight: 700, color: gameState === 'go' ? '#C87862' : '#536B5C' }}>
            {gameState === 'go' ? 'TAP ANYWHERE AS FAST AS YOU CAN!' : 'Keep focus...'}
          </div>
        </div>
      )}
    </div>
  );
};

export default ReactionTest;
