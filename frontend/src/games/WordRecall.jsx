import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { sessionAPI } from '../services/api';
import { BookOpen, CheckCircle2, RotateCcw, ArrowRight } from 'lucide-react';

const NER_WORDS = [
  'Assam Tea Leaf 🌱',
  'Lakadong Turmeric 🌿',
  'Mizo Chilli 🌶️',
  'Kaziranga Fern 🍃',
  'Brahmaputra Lily 🌺',
  'Pineapple 🍍',
  'Bamboo Shoot 🎍',
  'Nagaland Orchid 🌸'
];

const WordRecall = () => {
  const { user, updateStateFromSession, speakText, voiceAssistance } = useAuth();
  const navigate = useNavigate();

  const [targetWords, setTargetWords] = useState([]);
  const [options, setOptions] = useState([]);
  const [selected, setSelected] = useState([]);
  const [phase, setPhase] = useState('memorize'); // 'memorize' | 'recall' | 'done'
  const [countdown, setCountdown] = useState(4);
  const [scoreResult, setScoreResult] = useState(null);

  useEffect(() => {
    startNewGame();
  }, []);

  const startNewGame = () => {
    const shuffled = [...NER_WORDS].sort(() => Math.random() - 0.5);
    const targets = shuffled.slice(0, 3);
    const opts = shuffled.slice(0, 6).sort(() => Math.random() - 0.5);

    setTargetWords(targets);
    setOptions(opts);
    setSelected([]);
    setPhase('memorize');
    setCountdown(4);

    if (voiceAssistance) {
      speakText(`Remember these North Eastern garden items: ${targets.join(', ')}`);
    }
  };

  useEffect(() => {
    let timer;
    if (phase === 'memorize' && countdown > 0) {
      timer = setInterval(() => setCountdown((c) => c - 1), 1000);
    } else if (phase === 'memorize' && countdown === 0) {
      setPhase('recall');
    }
    return () => clearInterval(timer);
  }, [phase, countdown]);

  const handleSelectWord = async (word) => {
    if (phase !== 'recall') return;

    let newSel;
    if (selected.includes(word)) {
      newSel = selected.filter((w) => w !== word);
    } else {
      newSel = [...selected, word];
    }
    setSelected(newSel);

    if (newSel.length === 3) {
      const correctCount = newSel.filter((w) => targetWords.includes(w)).length;
      const score = Math.round((correctCount / 3) * 100);

      const sessionPayload = {
        userId: user?.id || user?._id,
        activity: 'Word Recall',
        category: 'recall',
        difficulty: 'Easy',
        score,
        accuracy: score
      };

      const result = await sessionAPI.createSession(sessionPayload);
      updateStateFromSession(result);

      setScoreResult({ score, correctCount });
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
          Word Recall Completed! 📖
        </h2>

        <div style={{ backgroundColor: '#F7F4EE', padding: '1.25rem', borderRadius: '18px', marginBottom: '1.75rem' }}>
          <div style={{ fontSize: '0.85rem', color: '#7E9687', fontWeight: 600 }}>Recall Score</div>
          <div style={{ fontSize: '2.4rem', fontWeight: 800, color: '#58755E' }}>{scoreResult.score} / 100</div>
        </div>

        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
          <button onClick={startNewGame} className="btn-secondary">
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
    <div className="garden-card animate-fade-in" style={{ maxWidth: 650, margin: '0 auto', textAlign: 'center' }}>
      <h2 style={{ fontSize: '1.6rem', color: '#1C3B2B', marginBottom: '0.5rem' }}>Regional Word Recall 🌿</h2>
      <p style={{ color: '#536B5C', marginBottom: '1.5rem' }}>
        {phase === 'memorize' ? 'Memorize these 3 North Eastern garden items!' : 'Select the 3 items you saw!'}
      </p>

      {phase === 'memorize' ? (
        <div style={{ backgroundColor: '#F7F4EE', border: '2px solid #7C9A82', borderRadius: '24px', padding: '2rem', margin: '1.5rem 0' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'center' }}>
            {targetWords.map((w, idx) => (
              <span key={idx} style={{ fontSize: '1.6rem', fontWeight: 700, color: '#1C3B2B' }}>{w}</span>
            ))}
          </div>
          <div style={{ fontSize: '0.9rem', color: '#536B5C', marginTop: '1.5rem' }}>
            Hiding in {countdown} seconds...
          </div>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', margin: '1.5rem 0' }}>
          {options.map((word, idx) => {
            const isSel = selected.includes(word);
            return (
              <button
                key={idx}
                onClick={() => handleSelectWord(word)}
                style={{
                  padding: '1.25rem 1rem',
                  borderRadius: '16px',
                  border: isSel ? '2.5px solid #7C9A82' : '1.5px solid #E6E0D4',
                  backgroundColor: isSel ? '#EBF2EC' : '#FFFFFF',
                  fontSize: '1.1rem',
                  fontWeight: 700,
                  color: '#1C3B2B',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
              >
                {word}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default WordRecall;
