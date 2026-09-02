import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { sessionAPI } from '../services/api';
import { Flower2, Sparkles, CheckCircle2, RotateCcw, ArrowRight } from 'lucide-react';

const CARD_ITEMS = ['🌱', '🌸', '🌳', '🦋', '☀️', '🌺'];

const MemoryMatch = () => {
  const { user, updateStateFromSession, speakText, voiceAssistance } = useAuth();
  const navigate = useNavigate();

  const [cards, setCards] = useState([]);
  const [flipped, setFlipped] = useState([]);
  const [matched, setMatched] = useState([]);
  const [moves, setMoves] = useState(0);
  const [startTime, setStartTime] = useState(null);
  const [isCompleted, setIsCompleted] = useState(false);
  const [scoreResult, setScoreResult] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    initGame();
  }, []);

  const initGame = () => {
    const deck = [...CARD_ITEMS, ...CARD_ITEMS]
      .sort(() => Math.random() - 0.5)
      .map((symbol, idx) => ({ id: idx, symbol }));

    setCards(deck);
    setFlipped([]);
    setMatched([]);
    setMoves(0);
    setStartTime(Date.now());
    setIsCompleted(false);
    setScoreResult(null);

    if (voiceAssistance) {
      speakText("Memory Match started. Tap pairs of matching garden cards.");
    }
  };

  const handleCardClick = (idx) => {
    if (flipped.length === 2 || flipped.includes(idx) || matched.includes(idx) || isCompleted) return;

    const newFlipped = [...flipped, idx];
    setFlipped(newFlipped);

    if (newFlipped.length === 2) {
      setMoves((m) => m + 1);
      const [first, second] = newFlipped;
      
      if (cards[first].symbol === cards[second].symbol) {
        const newMatched = [...matched, first, second];
        setMatched(newMatched);
        setFlipped([]);

        if (newMatched.length === cards.length) {
          finishGame(moves + 1);
        }
      } else {
        setTimeout(() => setFlipped([]), 1000);
      }
    }
  };

  const finishGame = async (totalMoves) => {
    const timeSpent = Math.max(5, Math.round((Date.now() - startTime) / 1000));
    // Calculate elderly-friendly score: Perfect is 6 moves
    const calculatedScore = Math.max(50, Math.min(100, Math.round(100 - (totalMoves - 6) * 5)));
    const calculatedAccuracy = Math.round((6 / totalMoves) * 100);

    const sessionPayload = {
      userId: user?.id || user?._id,
      activity: 'Memory Match',
      category: 'memory',
      difficulty: 'Easy',
      score: calculatedScore,
      accuracy: calculatedAccuracy,
      reactionTime: timeSpent * 1000
    };

    setSubmitting(true);
    const result = await sessionAPI.createSession(sessionPayload);
    updateStateFromSession(result);
    setSubmitting(false);

    setScoreResult({
      score: calculatedScore,
      moves: totalMoves,
      accuracy: calculatedAccuracy,
      timeSpent,
      recommendation: result.recommendation
    });
    setIsCompleted(true);

    if (voiceAssistance) {
      speakText(`Congratulations! Game completed with a score of ${calculatedScore}.`);
    }
  };

  if (isCompleted && scoreResult) {
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
          Memory Match Completed! 🎉
        </h2>
        <p style={{ color: '#536B5C', fontSize: '1.1rem', marginBottom: '1.5rem' }}>
          Great work exercizing your spatial memory today.
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
            <div style={{ fontSize: '0.85rem', color: '#7E9687', fontWeight: 600 }}>Memory Score</div>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: '#58755E' }}>{scoreResult.score} / 100</div>
          </div>
          <div>
            <div style={{ fontSize: '0.85rem', color: '#7E9687', fontWeight: 600 }}>Moves Taken</div>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: '#1C3B2B' }}>{scoreResult.moves} moves</div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
          <button onClick={initGame} className="btn-secondary">
            <RotateCcw size={18} />
            <span>Play Again</span>
          </button>
          <button onClick={() => navigate('/analysis')} className="btn-peach">
            <Sparkles size={18} />
            <span>Analyse My Performance</span>
            <ArrowRight size={18} />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="garden-card animate-fade-in" style={{ maxWidth: 700, margin: '0 auto' }}>
      <div className="garden-card-header">
        <div>
          <h2 style={{ fontSize: '1.6rem', color: '#1C3B2B' }}>Memory Match 🌱</h2>
          <p style={{ fontSize: '0.95rem', color: '#536B5C' }}>
            Tap two cards to reveal hidden garden symbols and find all matching pairs.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <span className="badge badge-sage">Moves: {moves}</span>
          <span className="badge badge-lavender">Pairs: {matched.length / 2} / {CARD_ITEMS.length}</span>
        </div>
      </div>

      {/* Cards Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: '1rem',
        margin: '1.5rem 0'
      }}>
        {cards.map((card, idx) => {
          const isFlipped = flipped.includes(idx) || matched.includes(idx);
          return (
            <button
              key={card.id}
              onClick={() => handleCardClick(idx)}
              style={{
                height: 110,
                borderRadius: '16px',
                border: isFlipped ? '2px solid #7C9A82' : '2px solid #E6E0D4',
                backgroundColor: isFlipped ? '#FFFFFF' : '#F7F4EE',
                fontSize: isFlipped ? '3rem' : '1.5rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justify: 'center',
                boxShadow: '0 4px 12px rgba(0,0,0,0.04)',
                transition: 'all 0.25 ease',
                userSelect: 'none'
              }}
            >
              {isFlipped ? card.symbol : '🌿'}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default MemoryMatch;
