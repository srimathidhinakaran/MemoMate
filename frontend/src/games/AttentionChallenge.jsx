import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { sessionAPI } from '../services/api';
import { Target, CheckCircle2, RotateCcw, ArrowRight } from 'lucide-react';

const SYMBOLS = ['🌱', '🌸', '🌳', '🦋', '☀️', '🌺', '🍃', '🐝'];

const AttentionChallenge = () => {
  const { user, updateStateFromSession, speakText, voiceAssistance } = useAuth();
  const navigate = useNavigate();

  const [round, setRound] = useState(1);
  const [targetSymbol, setTargetSymbol] = useState('🦋');
  const [gridItems, setGridItems] = useState([]);
  const [score, setScore] = useState(0);
  const [startTime, setStartTime] = useState(null);
  const [isCompleted, setIsCompleted] = useState(false);
  const [scoreResult, setScoreResult] = useState(null);

  useEffect(() => {
    startRound(1);
  }, []);

  const startRound = (rNum) => {
    const target = SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)];
    setTargetSymbol(target);

    const count = 12;
    const items = Array(count - 1).fill(null).map(() => {
      let rand = SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)];
      while (rand === target) {
        rand = SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)];
      }
      return rand;
    });

    items.push(target);
    const shuffled = items.sort(() => Math.random() - 0.5);

    setGridItems(shuffled);
    if (rNum === 1) {
      setStartTime(Date.now());
      setScore(0);
    }
  };

  const handleTileClick = async (symbol) => {
    if (symbol === targetSymbol) {
      const nextScore = score + 20;
      setScore(nextScore);

      if (round < 5) {
        setRound(round + 1);
        startRound(round + 1);
      } else {
        // Complete game
        const timeSpent = Math.max(4, Math.round((Date.now() - startTime) / 1000));
        const calculatedScore = Math.min(100, Math.max(50, 100 - (timeSpent - 8) * 3));

        const sessionPayload = {
          userId: user?.id || user?._id,
          activity: 'Attention Challenge',
          category: 'attention',
          difficulty: 'Medium',
          score: calculatedScore,
          accuracy: 100,
          reactionTime: timeSpent * 1000
        };

        const result = await sessionAPI.createSession(sessionPayload);
        updateStateFromSession(result);

        setScoreResult({
          score: calculatedScore,
          rounds: 5,
          timeSpent,
          recommendation: result.recommendation
        });
        setIsCompleted(true);

        if (voiceAssistance) {
          speakText(`Attention Challenge completed with score ${calculatedScore}!`);
        }
      }
    }
  };

  if (isCompleted && scoreResult) {
    return (
      <div className="garden-card animate-fade-in" style={{ textAlign: 'center', padding: '2.5rem 1.5rem', maxWidth: 650, margin: '0 auto' }}>
        <div style={{
          width: 70,
          height: 70,
          borderRadius: '50%',
          backgroundColor: '#FDF3F0',
          display: 'flex',
          alignItems: 'center',
          justify: 'center',
          margin: '0 auto 1.25rem'
        }}>
          <CheckCircle2 size={44} color="#C87862" />
        </div>

        <h2 style={{ fontSize: '2rem', marginBottom: '0.5rem', color: '#1C3B2B' }}>
          Attention Challenge Complete! 🎯
        </h2>
        <p style={{ color: '#536B5C', fontSize: '1.1rem', marginBottom: '1.5rem' }}>
          Excellent focus! Your attention metric has been updated.
        </p>

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
            <div style={{ fontSize: '0.85rem', color: '#7E9687', fontWeight: 600 }}>New Attention Score</div>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: '#C87862' }}>{scoreResult.score} / 100</div>
          </div>
          <div>
            <div style={{ fontSize: '0.85rem', color: '#7E9687', fontWeight: 600 }}>Completion Speed</div>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: '#1C3B2B' }}>{scoreResult.timeSpent} sec</div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
          <button onClick={() => { setIsCompleted(false); startRound(1); }} className="btn-secondary">
            <RotateCcw size={18} />
            <span>Play Again</span>
          </button>
          <button onClick={() => navigate('/analysis')} className="btn-peach">
            <Target size={18} />
            <span>Analyse My Performance</span>
            <ArrowRight size={18} />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="garden-card animate-fade-in" style={{ maxWidth: 700, margin: '0 auto', textAlign: 'center' }}>
      <div className="garden-card-header">
        <div>
          <h2 style={{ fontSize: '1.6rem', color: '#1C3B2B' }}>Attention Challenge 🎯</h2>
          <p style={{ fontSize: '0.95rem', color: '#536B5C' }}>
            Find and tap the target symbol as quickly as you can.
          </p>
        </div>

        <span className="badge badge-peach">Round {round} / 5</span>
      </div>

      <div style={{
        backgroundColor: '#FDF3F0',
        padding: '1rem',
        borderRadius: '16px',
        border: '1.5px solid #F4C3B2',
        margin: '1rem 0',
        fontSize: '1.25rem',
        fontWeight: 700,
        color: '#1C3B2B'
      }}>
        Find this target: <span style={{ fontSize: '2rem', marginLeft: '0.5rem' }}>{targetSymbol}</span>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: '1rem',
        margin: '1.5rem 0'
      }}>
        {gridItems.map((item, idx) => (
          <button
            key={idx}
            onClick={() => handleTileClick(item)}
            style={{
              height: 100,
              borderRadius: '16px',
              border: '2px solid #E6E0D4',
              backgroundColor: '#FFFFFF',
              fontSize: '2.5rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justify: 'center',
              boxShadow: '0 4px 12px rgba(0,0,0,0.04)',
              transition: 'transform 0.15s ease'
            }}
          >
            {item}
          </button>
        ))}
      </div>
    </div>
  );
};

export default AttentionChallenge;
