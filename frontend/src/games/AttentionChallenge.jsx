import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { sessionAPI } from '../services/api';
import { soundFx } from '../utils/soundEffects';
import { Zap, ArrowLeft, RotateCcw, Award, CheckCircle, Sparkles } from 'lucide-react';

const AttentionChallenge = () => {
  const navigate = useNavigate();
  const { user, updateStateFromSession, speakText, voiceAssistance, level, t } = useAuth();

  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [round, setRound] = useState(1);
  const totalRounds = 8;

  const [currentProblem, setCurrentProblem] = useState(null);
  const [options, setOptions] = useState([]);
  const [startTime, setStartTime] = useState(0);
  const [reactionTimes, setReactionTimes] = useState([]);
  const [feedback, setFeedback] = useState(null);

  // Generate procedural random focus/math reflex problem based on user level
  const generateProblem = (roundNum) => {
    const isMath = Math.random() > 0.3;
    const diffMultiplier = Math.min(4, Math.floor((level || 1) / 2) + Math.floor(roundNum / 3) + 1);

    if (isMath) {
      const a = Math.floor(Math.random() * (10 * diffMultiplier)) + 2;
      const b = Math.floor(Math.random() * (8 * diffMultiplier)) + 1;
      const op = Math.random() > 0.5 ? '+' : '-';
      const ans = op === '+' ? a + b : a - b;

      const wrong1 = ans + (Math.random() > 0.5 ? 2 : -2);
      const wrong2 = ans + (Math.random() > 0.5 ? 5 : -3);
      const wrong3 = ans + (Math.random() > 0.5 ? 1 : -1);

      const opts = [ans, wrong1, wrong2, wrong3]
        .filter((v, i, self) => self.indexOf(v) === i)
        .sort(() => Math.random() - 0.5);

      return {
        prompt: `${a} ${op} ${b} = ?`,
        correct: ans,
        options: opts.length < 4 ? [ans, ans + 2, ans - 2, ans + 4].sort(() => Math.random() - 0.5) : opts,
        type: 'math'
      };
    } else {
      const symbols = ['⚡', '🎯', '💎', '🛡️', '👑', '🔥'];
      const target = symbols[Math.floor(Math.random() * symbols.length)];
      const distractors = symbols.filter(s => s !== target).sort(() => Math.random() - 0.5).slice(0, 3);
      const opts = [target, ...distractors].sort(() => Math.random() - 0.5);

      return {
        prompt: t('findSymbolPrompt', { symbol: target }) || `Find the Symbol: ${target}`,
        correct: target,
        options: opts,
        type: 'symbol'
      };
    }
  };

  const startNextRound = (currentRoundScore = score) => {
    if (round > totalRounds) {
      finishGame(currentRoundScore);
      return;
    }
    const prob = generateProblem(round);
    setCurrentProblem(prob);
    setOptions(prob.options);
    setStartTime(Date.now());
  };

  const handleStartGame = () => {
    soundFx.playClick();
    setGameStarted(true);
    setGameOver(false);
    setScore(0);
    setRound(1);
    setReactionTimes([]);
    const prob = generateProblem(1);
    setCurrentProblem(prob);
    setOptions(prob.options);
    setStartTime(Date.now());
    if (voiceAssistance) speakText(t('focusReflexTitle') + ". " + t('focusReflexDesc'));
  };

  const handleSelectOption = (selected) => {
    if (feedback !== null || gameOver) return;
    const elapsed = Date.now() - startTime;
    setReactionTimes(prev => [...prev, elapsed]);

    const isCorrect = selected === currentProblem.correct;
    let points = 0;
    if (isCorrect) {
      soundFx.playSuccess();
      points = Math.max(10, Math.round(15 - elapsed / 250));
      setScore(prev => prev + points);
      setFeedback({ correct: true, text: t('correctFeedback', { points, time: elapsed }) || `Correct! +${points} pts (${elapsed}ms)` });
    } else {
      soundFx.playCardMismatch();
      setFeedback({ correct: false, text: t('wrongFeedback', { answer: currentProblem.correct }) || `Wrong! Correct answer: ${currentProblem.correct}` });
    }

    setTimeout(() => {
      setFeedback(null);
      const nextScore = isCorrect ? score + points : score;
      if (round + 1 > totalRounds) {
        finishGame(nextScore);
      } else {
        setRound(r => r + 1);
        startNextRound(nextScore);
      }
    }, 350);
  };

  const finishGame = async (finalScore) => {
    setGameOver(true);
    soundFx.playGameWin();
    const avgRx = reactionTimes.length > 0 ? Math.round(reactionTimes.reduce((a, b) => a + b, 0) / reactionTimes.length) : 800;
    const calculatedScore = Math.min(100, Math.max(30, Math.round((finalScore / (totalRounds * 15)) * 100)));

    const result = await sessionAPI.createSession({
      userId: user?.id || user?._id,
      activity: 'Focus Reflex & Math Matrix',
      category: 'attention',
      difficulty: level > 2 ? 'Hard' : 'Medium',
      score: calculatedScore,
      accuracy: Math.round((finalScore / (totalRounds * 15)) * 100),
      reactionTime: avgRx
    });

    if (result) {
      updateStateFromSession(result);
    }
  };

  return (
    <div style={{ maxWidth: 800, margin: '0 auto', width: '100%' }}>
      {/* Header Bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
        <button onClick={() => navigate('/assessment')} className="btn-secondary" style={{ padding: '0.45rem 0.9rem', fontSize: '0.85rem' }}>
          <ArrowLeft size={16} /> {t('backToExercises') || 'Back to Exercises'}
        </button>
        <span className="badge badge-cyan" style={{ fontSize: '0.85rem' }}>
          <Zap size={14} /> {t('focusReflexTitle').toUpperCase() || 'FOCUS REFLEX MATRIX'}
        </span>
      </div>

      <div className="garden-card animate-fade-in" style={{ padding: '2rem', textAlign: 'center', minHeight: '420px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        {!gameStarted ? (
          <div>
            <div className="icon-box" style={{ width: 64, height: 64, borderRadius: '16px', background: 'linear-gradient(135deg, #38BDF8 0%, #FBBF24 100%)', margin: '0 auto 1.25rem', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
              <Zap size={32} color="#0B0E14" />
            </div>
            <h2 style={{ fontSize: '1.8rem', color: '#FFFFFF', fontWeight: 900, marginBottom: '0.5rem' }}>
              {t('focusReflexTitle') || 'Focus Reflex & Math Matrix'}
            </h2>
            <p style={{ color: '#94A3B8', fontSize: '0.95rem', maxWidth: 500, margin: '0 auto 1.5rem', lineHeight: 1.5 }}>
              {t('focusReflexDesc') || 'Solve procedurally generated focus and mental math challenges rapidly. Tests speed, attention, and executive reflexes!'}
            </p>
            <button onClick={handleStartGame} className="btn-primary" style={{ padding: '0.85rem 2rem', fontSize: '1.05rem' }}>
              {t('startMissionNow') || 'START MISSION NOW'}
            </button>
          </div>
        ) : gameOver ? (
          <div>
            <div className="icon-box" style={{ width: 64, height: 64, borderRadius: '16px', backgroundColor: 'rgba(52, 211, 153, 0.15)', border: '1px solid #34D399', margin: '0 auto 1.25rem', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
              <Award size={36} color="#34D399" />
            </div>
            <h2 style={{ fontSize: '1.8rem', color: '#FFFFFF', fontWeight: 900, marginBottom: '0.5rem' }}>
              {t('missionComplete') || 'MISSION COMPLETE!'}
            </h2>
            <div style={{ fontSize: '2.5rem', color: '#38BDF8', fontWeight: 900, margin: '0.5rem 0' }}>
              {Math.min(100, Math.round((score / (totalRounds * 15)) * 100))} <span style={{ fontSize: '1rem', color: '#94A3B8' }}>/100 {t('pts') || 'PTS'}</span>
            </div>
            <p style={{ color: '#94A3B8', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
              {t('profileReady') || 'Performance metrics saved to your profile dynamically.'}
            </p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
              <button onClick={handleStartGame} className="btn-primary">
                <RotateCcw size={16} /> {t('playAgain') || 'PLAY AGAIN'}
              </button>
              <button onClick={() => navigate('/dashboard')} className="btn-secondary">
                {t('navDashboard').toUpperCase() || 'DASHBOARD'}
              </button>
            </div>
          </div>
        ) : (
          <div>
            {/* Game Round Info */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', backgroundColor: '#0B0E14', padding: '0.75rem 1.25rem', borderRadius: '12px', border: '1px solid #263142' }}>
              <span style={{ fontWeight: 800, color: '#38BDF8', fontSize: '0.9rem' }}>
                {t('roundInfo', { round, total: totalRounds }) || `ROUND ${round} / ${totalRounds}`}
              </span>
              <span style={{ fontWeight: 800, color: '#FBBF24', fontSize: '1rem' }}>
                {t('scoreText', { score }) || `SCORE: ${score}`}
              </span>
            </div>

            {/* Problem Box */}
            <div style={{ backgroundColor: '#0B0E14', border: '1px solid #38BDF8', borderRadius: '16px', padding: '2rem', marginBottom: '1.5rem', fontSize: '2rem', fontWeight: 900, color: '#FFFFFF' }}>
              {currentProblem?.prompt}
            </div>

            {/* Feedback alert */}
            {feedback && (
              <div style={{ marginBottom: '1rem', color: feedback.correct ? '#34D399' : '#FB923C', fontWeight: 800, fontSize: '1.1rem' }}>
                {feedback.text}
              </div>
            )}

            {/* Options Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
              {options.map((opt, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSelectOption(opt)}
                  className="btn-secondary"
                  style={{
                    padding: '1.25rem',
                    fontSize: '1.5rem',
                    fontWeight: 900,
                    backgroundColor: '#161C26',
                    border: '1px solid #263142',
                    borderRadius: '14px'
                  }}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AttentionChallenge;
