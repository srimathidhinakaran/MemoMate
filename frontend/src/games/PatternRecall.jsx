import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { sessionAPI } from '../services/api';
import { CheckCircle2, RotateCcw, ArrowRight } from 'lucide-react';

const PatternRecall = () => {
  const { user, updateStateFromSession, speakText, voiceAssistance } = useAuth();
  const navigate = useNavigate();

  const [pattern, setPattern] = useState([]);
  const [selected, setSelected] = useState([]);
  const [phase, setPhase] = useState('show'); // 'show' | 'guess' | 'done'
  const [scoreResult, setScoreResult] = useState(null);

  useEffect(() => {
    startNewPattern();
  }, []);

  const startNewPattern = () => {
    // Pick 3 unique random grid indices (0-8)
    const indices = [];
    while (indices.length < 3) {
      const r = Math.floor(Math.random() * 9);
      if (!indices.includes(r)) indices.push(r);
    }
    setPattern(indices);
    setSelected([]);
    setPhase('show');

    if (voiceAssistance) {
      speakText("Memorize the highlighted green garden tiles.");
    }

    setTimeout(() => {
      setPhase('guess');
    }, 3000);
  };

  const handleTileClick = async (idx) => {
    if (phase !== 'guess') return;

    let newSel;
    if (selected.includes(idx)) {
      newSel = selected.filter((i) => i !== idx);
    } else {
      newSel = [...selected, idx];
    }
    setSelected(newSel);

    if (newSel.length === 3) {
      // Calculate score
      const matchCount = newSel.filter((i) => pattern.includes(i)).length;
      const score = Math.round((matchCount / 3) * 100);

      const sessionPayload = {
        userId: user?.id || user?._id,
        activity: 'Pattern Recall',
        category: 'recall',
        difficulty: 'Medium',
        score,
        accuracy: score
      };

      const result = await sessionAPI.createSession(sessionPayload);
      updateStateFromSession(result);

      setScoreResult({ score, matchCount });
      setPhase('done');
    }
  };

  if (phase === 'done' && scoreResult) {
    return (
      <div className="garden-card animate-fade-in" style={{ textAlign: 'center', padding: '2.5rem 1.5rem', maxWidth: 650, margin: '0 auto' }}>
        <div style={{
          width: 70,
          height: 70,
          borderRadius: '50%',
          backgroundColor: '#EBF2EC',
          display: 'flex',
          alignItems: 'center',
          justify: 'center',
          margin: '0 auto 1.25rem'
        }}>
          <CheckCircle2 size={44} color="#58755E" />
        </div>

        <h2 style={{ fontSize: '2rem', marginBottom: '0.5rem', color: '#1C3B2B' }}>
          Pattern Recall Completed! 🎨
        </h2>

        <div style={{ backgroundColor: '#F7F4EE', padding: '1.25rem', borderRadius: '18px', marginBottom: '1.75rem' }}>
          <div style={{ fontSize: '0.85rem', color: '#7E9687', fontWeight: 600 }}>Pattern Recall Score</div>
          <div style={{ fontSize: '2.4rem', fontWeight: 800, color: '#58755E' }}>{scoreResult.score} / 100</div>
        </div>

        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
          <button onClick={startNewPattern} className="btn-secondary">
            <RotateCcw size={18} />
            <span>Play Again</span>
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
    <div className="garden-card animate-fade-in" style={{ maxWidth: 600, margin: '0 auto', textAlign: 'center' }}>
      <h2 style={{ fontSize: '1.6rem', color: '#1C3B2B', marginBottom: '0.5rem' }}>Pattern Recall 🧩</h2>
      <p style={{ color: '#536B5C', marginBottom: '1.5rem' }}>
        {phase === 'show' ? 'Memorize the highlighted garden tiles!' : 'Tap the 3 tiles you saw!'}
      </p>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '1rem',
        maxWidth: 360,
        margin: '0 auto 1.5rem'
      }}>
        {Array(9).fill(null).map((_, idx) => {
          const isHighlighted = (phase === 'show' && pattern.includes(idx)) || (phase === 'guess' && selected.includes(idx));
          return (
            <button
              key={idx}
              onClick={() => handleTileClick(idx)}
              style={{
                height: 100,
                borderRadius: '18px',
                border: isHighlighted ? '3px solid #58755E' : '2px solid #E6E0D4',
                backgroundColor: isHighlighted ? '#7C9A82' : '#FFFFFF',
                fontSize: '2rem',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              {isHighlighted ? '🌱' : ''}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default PatternRecall;
