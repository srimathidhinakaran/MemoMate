import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { soundFx } from '../utils/soundEffects';
import { Volume2, Music, RotateCcw, CheckCircle2, Trophy, Play, Zap } from 'lucide-react';

const PADS = [
  { id: 0, color: '#38BDF8', label: 'CYAN', freq: 523.25 },   // C5
  { id: 1, color: '#34D399', label: 'EMERALD', freq: 659.25 },// E5
  { id: 2, color: '#FBBF24', label: 'GOLD', freq: 783.99 },   // G5
  { id: 3, color: '#C084FC', label: 'PURPLE', freq: 1046.50 } // C6
];

const ToneRhythmRecall = () => {
  const { updateStateFromSession, speakText, voiceAssistance, t } = useAuth();

  const [sequence, setSequence] = useState([]);
  const [playerInput, setPlayerInput] = useState([]);
  const [activePad, setActivePad] = useState(null);
  const [isPlayingSeq, setIsPlayingSeq] = useState(false);
  const [round, setRound] = useState(0);
  const [gameState, setGameState] = useState('IDLE'); // 'IDLE' | 'PLAYING' | 'GAMEOVER'
  const [score, setScore] = useState(0);

  const audioCtxRef = useRef(null);

  const playTone = useCallback((freq, duration = 300) => {
    try {
      if (!audioCtxRef.current) {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        audioCtxRef.current = new AudioCtx();
      }
      if (audioCtxRef.current.state === 'suspended') {
        audioCtxRef.current.resume();
      }
      const osc = audioCtxRef.current.createOscillator();
      const gain = audioCtxRef.current.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, audioCtxRef.current.currentTime);

      gain.gain.setValueAtTime(0.2, audioCtxRef.current.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtxRef.current.currentTime + duration / 1000);

      osc.connect(gain);
      gain.connect(audioCtxRef.current.destination);

      osc.start();
      osc.stop(audioCtxRef.current.currentTime + duration / 1000);
    } catch (e) {
      console.warn('Tone synth error:', e);
    }
  }, []);

  const playSequence = useCallback((seq) => {
    setIsPlayingSeq(true);
    let delay = 600;

    seq.forEach((padIdx, i) => {
      setTimeout(() => {
        const pad = PADS[padIdx];
        setActivePad(padIdx);
        playTone(pad.freq, 400);

        setTimeout(() => {
          setActivePad(null);
          if (i === seq.length - 1) {
            setIsPlayingSeq(false);
          }
        }, 400);
      }, i * delay);
    });
  }, [playTone]);

  const startNextRound = useCallback((currentSeq) => {
    const nextPad = Math.floor(Math.random() * 4);
    const newSeq = [...currentSeq, nextPad];
    setSequence(newSeq);
    setPlayerInput([]);
    setRound(newSeq.length);
    playSequence(newSeq);
  }, [playSequence]);

  const startGame = () => {
    soundFx.playClick();
    setGameState('PLAYING');
    setScore(0);
    const initialSeq = [Math.floor(Math.random() * 4)];
    setSequence(initialSeq);
    setPlayerInput([]);
    setRound(1);
    if (voiceAssistance) {
      speakText("Rhythm Tone Recall started. Watch and listen to the tone sequence, then repeat it.");
    }
    playSequence(initialSeq);
  };

  const handlePadClick = (padIdx) => {
    if (isPlayingSeq || gameState !== 'PLAYING') return;

    const pad = PADS[padIdx];
    setActivePad(padIdx);
    playTone(pad.freq, 250);

    setTimeout(() => setActivePad(null), 250);

    const nextInput = [...playerInput, padIdx];
    setPlayerInput(nextInput);

    const stepIdx = nextInput.length - 1;

    // Check if input matches sequence
    if (nextInput[stepIdx] !== sequence[stepIdx]) {
      // Game Over
      soundFx.playClick();
      setGameState('GAMEOVER');
      const finalScore = Math.max(45, Math.min(100, (round - 1) * 18 + 50));
      setScore(finalScore);

      updateStateFromSession({
        activityType: 'Acoustic Tone & Rhythm Recall',
        score: finalScore,
        categoryScores: {
          memory: finalScore,
          attention: finalScore,
          recall: finalScore,
          reaction: Math.min(100, finalScore + 5)
        }
      });

      if (voiceAssistance) {
        speakText(`Sequence ended. Your acoustic recall score is ${finalScore} points.`);
      }
      return;
    }

    // Check if user completed current sequence
    if (nextInput.length === sequence.length) {
      soundFx.playXpGain();
      setTimeout(() => {
        startNextRound(sequence);
      }, 800);
    }
  };

  return (
    <div className="garden-card animate-fade-in" style={{ gap: '1.5rem', width: '100%', maxWidth: '750px', margin: '0 auto' }}>
      {/* Header Info */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', borderBottom: '1px solid #263142', paddingBottom: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div className="icon-box" style={{ width: 44, height: 44, borderRadius: '12px', backgroundColor: 'rgba(192, 132, 252, 0.15)', border: '1px solid #C084FC' }}>
            <Music size={24} color="#C084FC" />
          </div>
          <div>
            <h2 style={{ fontSize: '1.4rem', color: '#FFFFFF', margin: 0, fontWeight: 900, fontFamily: 'var(--font-heading)' }}>
              Acoustic Rhythm & Tone Recall
            </h2>
            <p style={{ color: '#94A3B8', fontSize: '0.85rem', margin: 0 }}>
              Train auditory memory & sequential pattern recall with harmonic tones.
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '0.75rem', color: '#94A3B8', fontWeight: 700 }}>SEQUENCE ROUND</div>
            <div style={{ fontSize: '1.2rem', color: '#C084FC', fontWeight: 900 }}>{round}</div>
          </div>
        </div>
      </div>

      {/* Main Interactive Audio Pads */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '1.2rem',
          maxWidth: '380px',
          width: '100%'
        }}>
          {PADS.map((pad) => {
            const isActive = activePad === pad.id;
            return (
              <button
                key={pad.id}
                onClick={() => handlePadClick(pad.id)}
                disabled={isPlayingSeq || gameState !== 'PLAYING'}
                style={{
                  height: '140px',
                  borderRadius: '20px',
                  backgroundColor: isActive ? pad.color : 'rgba(22, 28, 38, 0.95)',
                  border: `3px solid ${pad.color}`,
                  boxShadow: isActive ? `0 0 25px ${pad.color}` : 'none',
                  color: isActive ? '#0B0E14' : pad.color,
                  fontSize: '1.1rem',
                  fontWeight: 900,
                  fontFamily: 'var(--font-heading)',
                  cursor: isPlayingSeq || gameState !== 'PLAYING' ? 'not-allowed' : 'pointer',
                  transition: 'all 0.15s ease',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justify: 'center',
                  gap: '0.5rem',
                  opacity: isPlayingSeq && !isActive ? 0.4 : 1
                }}
              >
                <Volume2 size={32} />
                <span>{pad.label}</span>
              </button>
            );
          })}
        </div>

        {gameState === 'IDLE' && (
          <button onClick={startGame} className="btn-primary" style={{ padding: '0.85rem 2rem', fontSize: '1rem' }}>
            <Play size={20} />
            <span>START TONE RECALL EXERCISE</span>
          </button>
        )}

        {isPlayingSeq && (
          <div style={{ color: '#38BDF8', fontWeight: 800, fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Volume2 size={18} className="animate-pulse" />
            <span>LISTEN TO THE TONE SEQUENCE...</span>
          </div>
        )}

        {!isPlayingSeq && gameState === 'PLAYING' && (
          <div style={{ color: '#34D399', fontWeight: 800, fontSize: '0.95rem' }}>
            YOUR TURN! REPEAT THE SEQUENCE BY TAPPING THE PADS.
          </div>
        )}
      </div>

      {/* Game Over Modal Card */}
      {gameState === 'GAMEOVER' && (
        <div style={{
          backgroundColor: '#121721',
          border: '1px solid #C084FC',
          borderRadius: '16px',
          padding: '1.5rem',
          textAlign: 'center',
          animation: 'fadeIn 0.3s ease-in-out'
        }}>
          <div className="icon-box" style={{ width: 56, height: 56, borderRadius: '16px', backgroundColor: 'rgba(192, 132, 252, 0.15)', margin: '0 auto 1rem' }}>
            <CheckCircle2 size={32} color="#C084FC" />
          </div>
          <h3 style={{ fontSize: '1.5rem', color: '#FFFFFF', fontWeight: 900, marginBottom: '0.4rem' }}>
            ACOUSTIC SEQUENCE COMPLETED!
          </h3>
          <p style={{ color: '#94A3B8', fontSize: '0.95rem', marginBottom: '1.2rem' }}>
            Auditory recall & sequential memory score recorded across profile metrics.
          </p>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem', marginBottom: '1.5rem' }}>
            <div>
              <div style={{ fontSize: '0.8rem', color: '#94A3B8' }}>ROUNDS PASSED</div>
              <div style={{ fontSize: '2rem', color: '#C084FC', fontWeight: 900 }}>{round - 1}</div>
            </div>
            <div>
              <div style={{ fontSize: '0.8rem', color: '#94A3B8' }}>COGNITIVE SCORE</div>
              <div style={{ fontSize: '2rem', color: '#38BDF8', fontWeight: 900 }}>+{score} PTS</div>
            </div>
          </div>

          <button onClick={startGame} className="btn-primary" style={{ padding: '0.75rem 1.8rem', fontSize: '0.95rem' }}>
            <RotateCcw size={18} />
            <span>TRY AGAIN</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default ToneRhythmRecall;
