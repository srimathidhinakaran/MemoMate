import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { sessionAPI } from '../services/api';
import { soundFx } from '../utils/soundEffects';
import { Brain, ArrowLeft, RotateCcw, Award, Sparkles, CheckCircle2 } from 'lucide-react';

const CARD_ICONS = ['⚡', '🎯', '💎', '🛡️', '👑', '🔥', '🌌', '🚀'];

const MemoryMatch = () => {
  const navigate = useNavigate();
  const { user, updateStateFromSession, speakText, voiceAssistance, level } = useAuth();

  const [cards, setCards] = useState([]);
  const [flipped, setFlipped] = useState([]);
  const [matched, setMatched] = useState([]);
  const [moves, setMoves] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [startTime, setStartTime] = useState(0);

  const initializeDeck = () => {
    const pairCount = Math.min(8, 4 + Math.floor((level || 1) / 2));
    const selectedIcons = CARD_ICONS.slice(0, pairCount);
    const deck = [...selectedIcons, ...selectedIcons]
      .sort(() => Math.random() - 0.5)
      .map((icon, idx) => ({ id: idx, icon, flipped: false }));
    setCards(deck);
    setFlipped([]);
    setMatched([]);
    setMoves(0);
  };

  const handleStartGame = () => {
    soundFx.playClick();
    initializeDeck();
    setGameStarted(true);
    setGameOver(false);
    setStartTime(Date.now());
    if (voiceAssistance) speakText("Card Memory Matrix started! Match all pairs.");
  };

  const handleCardClick = (index) => {
    if (flipped.length === 2 || cards[index].flipped || matched.includes(index) || gameOver) return;

    soundFx.playCardFlip();
    const newFlipped = [...flipped, index];
    setFlipped(newFlipped);

    if (newFlipped.length === 2) {
      setMoves(m => m + 1);
      const [firstIdx, secondIdx] = newFlipped;
      if (cards[firstIdx].icon === cards[secondIdx].icon) {
        soundFx.playCardMatch();
        const newMatched = [...matched, firstIdx, secondIdx];
        setMatched(newMatched);
        setFlipped([]);

        if (newMatched.length === cards.length) {
          finishGame(moves + 1);
        }
      } else {
        soundFx.playCardMismatch();
        // Fast 400ms un-flip
        setTimeout(() => {
          setFlipped([]);
        }, 400);
      }
    }
  };

  const finishGame = async (finalMoves) => {
    setGameOver(true);
    soundFx.playGameWin();
    const duration = Math.round((Date.now() - startTime) / 1000);
    const totalPairs = cards.length / 2;
    const accuracy = Math.round((totalPairs / Math.max(totalPairs, finalMoves)) * 100);
    const score = Math.min(100, Math.max(40, accuracy));

    const result = await sessionAPI.createSession({
      userId: user?.id || user?._id,
      activity: 'Card Memory Matrix',
      category: 'memory',
      difficulty: level > 2 ? 'Medium' : 'Easy',
      score: score,
      accuracy: accuracy,
      reactionTime: duration
    });

    if (result) {
      updateStateFromSession(result);
    }
  };

  return (
    <div style={{ maxWidth: 800, margin: '0 auto', width: '100%' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
        <button onClick={() => navigate('/assessment')} className="btn-secondary" style={{ padding: '0.45rem 0.9rem', fontSize: '0.85rem' }}>
          <ArrowLeft size={16} /> Back to Exercises
        </button>
        <span className="badge badge-purple" style={{ fontSize: '0.85rem' }}>
          <Brain size={14} /> CARD MEMORY MATRIX
        </span>
      </div>

      <div className="garden-card animate-fade-in" style={{ padding: '2rem', textAlign: 'center', minHeight: '420px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        {!gameStarted ? (
          <div>
            <div className="icon-box" style={{ width: 64, height: 64, borderRadius: '16px', background: 'linear-gradient(135deg, #C084FC 0%, #38BDF8 100%)', margin: '0 auto 1.25rem', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
              <Brain size={32} color="#0B0E14" />
            </div>
            <h2 style={{ fontSize: '1.8rem', color: '#FFFFFF', fontWeight: 900, marginBottom: '0.5rem' }}>
              Card Memory Matrix
            </h2>
            <p style={{ color: '#94A3B8', fontSize: '0.95rem', maxWidth: 500, margin: '0 auto 1.5rem', lineHeight: 1.5 }}>
              Procedurally generated card matching game. Memorize positions and pair symbols to train visual recall.
            </p>
            <button onClick={handleStartGame} className="btn-primary" style={{ padding: '0.85rem 2rem', fontSize: '1.05rem' }}>
              START MISSION NOW
            </button>
          </div>
        ) : gameOver ? (
          <div>
            <div className="icon-box" style={{ width: 64, height: 64, borderRadius: '16px', backgroundColor: 'rgba(52, 211, 153, 0.15)', border: '1px solid #34D399', margin: '0 auto 1.25rem', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
              <Award size={36} color="#34D399" />
            </div>
            <h2 style={{ fontSize: '1.8rem', color: '#FFFFFF', fontWeight: 900, marginBottom: '0.5rem' }}>
              EXCELLENT RECALL!
            </h2>
            <div style={{ fontSize: '2.5rem', color: '#38BDF8', fontWeight: 900, margin: '0.5rem 0' }}>
              {Math.min(100, Math.round(((cards.length / 2) / Math.max(cards.length / 2, moves)) * 100))} <span style={{ fontSize: '1rem', color: '#94A3B8' }}>/100 PTS</span>
            </div>
            <p style={{ color: '#94A3B8', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
              Completed in {moves} moves. Profile memory score updated in MongoDB.
            </p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
              <button onClick={handleStartGame} className="btn-primary">
                <RotateCcw size={16} /> PLAY AGAIN
              </button>
              <button onClick={() => navigate('/dashboard')} className="btn-secondary">
                DASHBOARD
              </button>
            </div>
          </div>
        ) : (
          <div>
            {/* Stats Row */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', backgroundColor: '#0B0E14', padding: '0.75rem 1.25rem', borderRadius: '12px', border: '1px solid #263142' }}>
              <span style={{ fontWeight: 800, color: '#C084FC', fontSize: '0.9rem' }}>
                MOVES: {moves}
              </span>
              <span style={{ fontWeight: 800, color: '#34D399', fontSize: '0.9rem' }}>
                MATCHED: {matched.length / 2} / {cards.length / 2}
              </span>
            </div>

            {/* Grid */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: `repeat(${cards.length <= 8 ? 4 : 4}, 1fr)`,
              gap: '0.85rem'
            }}>
              {cards.map((card, idx) => {
                const isOpen = flipped.includes(idx) || matched.includes(idx);
                return (
                  <button
                    key={idx}
                    onClick={() => handleCardClick(idx)}
                    style={{
                      aspectRatio: '1',
                      borderRadius: '14px',
                      border: isOpen ? '1px solid #38BDF8' : '1px solid #263142',
                      backgroundColor: isOpen ? 'rgba(56, 189, 248, 0.15)' : '#0B0E14',
                      fontSize: '2.2rem',
                      display: 'flex',
                      alignItems: 'center',
                      justify: 'center',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    {isOpen ? card.icon : '❓'}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MemoryMatch;
