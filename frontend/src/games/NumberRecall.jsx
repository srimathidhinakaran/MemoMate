import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { sessionAPI } from '../services/api';
import { RotateCcw, CheckCircle2, ArrowRight } from 'lucide-react';

const NumberRecall = () => {
  const { user, updateStateFromSession, speakText, voiceAssistance } = useAuth();
  const navigate = useNavigate();

  const [stage, setStage] = useState('memorize'); // 'memorize' | 'input' | 'completed'
  const [targetNumber, setTargetNumber] = useState('');
  const [userInput, setUserInput] = useState('');
  const [countdown, setCountdown] = useState(3);
  const [scoreResult, setScoreResult] = useState(null);

  useEffect(() => {
    startNewGame();
  }, []);

  const startNewGame = () => {
    const randomNum = Math.floor(1000 + Math.random() * 9000).toString();
    setTargetNumber(randomNum);
    setUserInput('');
    setStage('memorize');
    setCountdown(3);

    if (voiceAssistance) {
      speakText(`Remember this number: ${randomNum}`);
    }
  };

  useEffect(() => {
    let timer;
    if (stage === 'memorize' && countdown > 0) {
      timer = setInterval(() => setCountdown((c) => c - 1), 1000);
    } else if (stage === 'memorize' && countdown === 0) {
      setStage('input');
    }
    return () => clearInterval(timer);
  }, [stage, countdown]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const isCorrect = userInput.trim() === targetNumber;
    const calculatedScore = isCorrect ? 95 : 60;

    const sessionPayload = {
      userId: user?.id || user?._id,
      activity: 'Number Recall',
      category: 'recall',
      difficulty: 'Easy',
      score: calculatedScore,
      accuracy: isCorrect ? 100 : 0
    };

    const result = await sessionAPI.createSession(sessionPayload);
    updateStateFromSession(result);

    setScoreResult({
      score: calculatedScore,
      isCorrect,
      targetNumber,
      userInput
    });
    setStage('completed');
  };

  if (stage === 'completed' && scoreResult) {
    return (
      <div className="garden-card animate-fade-in" style={{ textAlign: 'center', padding: '2.5rem 1.5rem', maxWidth: 650, margin: '0 auto' }}>
        <div style={{
          width: 70,
          height: 70,
          borderRadius: '50%',
          backgroundColor: scoreResult.isCorrect ? '#EBF2EC' : '#FDF3F0',
          display: 'flex',
          alignItems: 'center',
          justify: 'center',
          margin: '0 auto 1.25rem'
        }}>
          <CheckCircle2 size={44} color={scoreResult.isCorrect ? '#58755E' : '#C87862'} />
        </div>

        <h2 style={{ fontSize: '2rem', marginBottom: '0.5rem', color: '#1C3B2B' }}>
          {scoreResult.isCorrect ? 'Excellent Recall! 🎉' : 'Good Effort! 🌱'}
        </h2>
        <p style={{ color: '#536B5C', fontSize: '1.1rem', marginBottom: '1.5rem' }}>
          Target number was: <strong>{scoreResult.targetNumber}</strong> (You entered: {scoreResult.userInput})
        </p>

        <div style={{
          backgroundColor: '#F7F4EE',
          padding: '1.25rem',
          borderRadius: '18px',
          marginBottom: '1.75rem'
        }}>
          <div style={{ fontSize: '0.85rem', color: '#7E9687', fontWeight: 600 }}>Recall Score</div>
          <div style={{ fontSize: '2.4rem', fontWeight: 800, color: '#7A66A3' }}>{scoreResult.score} / 100</div>
        </div>

        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
          <button onClick={startNewGame} className="btn-secondary">
            <RotateCcw size={18} />
            <span>Try Another Number</span>
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
      <h2 style={{ fontSize: '1.6rem', color: '#1C3B2B', marginBottom: '0.5rem' }}>Number Recall 🔢</h2>
      <p style={{ color: '#536B5C', marginBottom: '1.5rem' }}>
        {stage === 'memorize' ? 'Memorize the number sequence below before time runs out!' : 'Enter the number sequence you just saw.'}
      </p>

      {stage === 'memorize' ? (
        <div style={{
          backgroundColor: '#F2EFF9',
          border: '2px solid #B8A7D9',
          borderRadius: '24px',
          padding: '2.5rem',
          margin: '1.5rem 0'
        }}>
          <div style={{ fontSize: '3.5rem', fontWeight: 800, letterSpacing: '0.8rem', color: '#7A66A3' }}>
            {targetNumber}
          </div>
          <div style={{ fontSize: '0.9rem', color: '#536B5C', marginTop: '1rem' }}>
            Hiding in {countdown} seconds...
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} style={{ margin: '1.5rem 0' }}>
          <input
            type="number"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            placeholder="Enter digits..."
            autoFocus
            style={{
              width: '100%',
              fontSize: '2rem',
              padding: '0.85rem',
              borderRadius: '16px',
              border: '2px solid #7C9A82',
              textAlign: 'center',
              outline: 'none',
              marginBottom: '1.5rem'
            }}
          />
          <button type="submit" className="btn-primary" style={{ width: '100%', padding: '1rem' }}>
            Submit Answer
          </button>
        </form>
      )}
    </div>
  );
};

export default NumberRecall;
