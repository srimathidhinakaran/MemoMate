import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { soundFx } from '../utils/soundEffects';
import { Compass, Trophy, ArrowUp, ArrowDown, ArrowLeft, ArrowRight, RotateCcw, Sparkles, CheckCircle2, Shield, Zap } from 'lucide-react';

const MAZE_SIZE = 7; // 7x7 grid for elderly-accessible spatial navigation

// Procedural maze generator using Randomized DFS
const generateMaze = (size) => {
  const grid = Array(size).fill(null).map(() => Array(size).fill(null).map(() => ({
    top: true, right: true, bottom: true, left: true, visited: false
  })));

  const stack = [];
  let current = { r: 0, c: 0 };
  grid[0][0].visited = true;
  let visitedCount = 1;
  const totalCells = size * size;

  while (visitedCount < totalCells) {
    const { r, c } = current;
    const neighbors = [];

    if (r > 0 && !grid[r - 1][c].visited) neighbors.push({ r: r - 1, c, dir: 'top' });
    if (r < size - 1 && !grid[r + 1][c].visited) neighbors.push({ r: r + 1, c, dir: 'bottom' });
    if (c > 0 && !grid[r][c - 1].visited) neighbors.push({ r, c: c - 1, dir: 'left' });
    if (c < size - 1 && !grid[r][c + 1].visited) neighbors.push({ r, c: c + 1, dir: 'right' });

    if (neighbors.length > 0) {
      const next = neighbors[Math.floor(Math.random() * neighbors.length)];
      stack.push(current);

      if (next.dir === 'top') { grid[r][c].top = false; grid[next.r][next.c].bottom = false; }
      if (next.dir === 'bottom') { grid[r][c].bottom = false; grid[next.r][next.c].top = false; }
      if (next.dir === 'left') { grid[r][c].left = false; grid[next.r][next.c].right = false; }
      if (next.dir === 'right') { grid[r][c].right = false; grid[next.r][next.c].left = false; }

      current = { r: next.r, c: next.c };
      grid[current.r][current.c].visited = true;
      visitedCount++;
    } else if (stack.length > 0) {
      current = stack.pop();
    } else {
      break;
    }
  }
  return grid;
};

const SpatialMazeNavigator = () => {
  const { updateStateFromSession, speakText, voiceAssistance, t } = useAuth();

  const [maze, setMaze] = useState(null);
  const [player, setPlayer] = useState({ r: 0, c: 0 });
  const [goal, setGoal] = useState({ r: MAZE_SIZE - 1, c: MAZE_SIZE - 1 });
  const [moves, setMoves] = useState(0);
  const [startTime, setStartTime] = useState(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [resultScore, setResultScore] = useState(null);

  const initGame = useCallback(() => {
    const newMaze = generateMaze(MAZE_SIZE);
    setMaze(newMaze);
    setPlayer({ r: 0, c: 0 });
    setGoal({ r: MAZE_SIZE - 1, c: MAZE_SIZE - 1 });
    setMoves(0);
    setCompleted(false);
    setGameStarted(true);
    setStartTime(Date.now());
    setElapsedTime(0);
    if (voiceAssistance) {
      speakText("Spatial Maze Navigator started. Use arrow buttons to navigate the guide orb to the green crystal exit.");
    }
  }, [voiceAssistance, speakText]);

  useEffect(() => {
    initGame();
  }, [initGame]);

  useEffect(() => {
    let timer;
    if (gameStarted && !completed && startTime) {
      timer = setInterval(() => {
        setElapsedTime(Math.floor((Date.now() - startTime) / 1000));
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [gameStarted, completed, startTime]);

  const movePlayer = useCallback((dir) => {
    if (!gameStarted || completed || !maze) return;

    const { r, c } = player;
    const currentCell = maze[r][c];
    let nextR = r;
    let nextC = c;
    let valid = false;

    if (dir === 'UP' && !currentCell.top) { nextR = r - 1; valid = true; }
    if (dir === 'DOWN' && !currentCell.bottom) { nextR = r + 1; valid = true; }
    if (dir === 'LEFT' && !currentCell.left) { nextC = c - 1; valid = true; }
    if (dir === 'RIGHT' && !currentCell.right) { nextC = c + 1; valid = true; }

    if (valid) {
      soundFx.playClick();
      setPlayer({ r: nextR, c: nextC });
      setMoves((prev) => prev + 1);

      // Check win condition
      if (nextR === goal.r && nextC === goal.c) {
        soundFx.playLevelUp();
        setCompleted(true);
        const finalTime = Math.max(1, Math.floor((Date.now() - startTime) / 1000));
        
        // Calculate Cognitive Spatial Score (Max 100)
        const baseScore = 95;
        const timePenalty = Math.min(30, Math.floor(finalTime * 0.8));
        const movePenalty = Math.min(25, Math.floor(Math.max(0, moves - 12) * 1.5));
        const finalScore = Math.max(50, Math.min(100, baseScore - timePenalty - movePenalty + 15));

        setResultScore(finalScore);

        updateStateFromSession({
          activityType: 'Spatial Maze Navigation',
          score: finalScore,
          categoryScores: {
            memory: finalScore,
            attention: Math.min(100, finalScore + 5),
            recall: Math.min(100, finalScore + 8),
            reaction: Math.max(50, 100 - finalTime * 2)
          }
        });

        if (voiceAssistance) {
          speakText(`Congratulations! Spatial Maze completed in ${finalTime} seconds. Score: ${finalScore} points.`);
        }
      }
    }
  }, [gameStarted, completed, maze, player, goal, moves, startTime, updateStateFromSession, voiceAssistance, speakText]);

  // Keyboard navigation support
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowUp') movePlayer('UP');
      if (e.key === 'ArrowDown') movePlayer('DOWN');
      if (e.key === 'ArrowLeft') movePlayer('LEFT');
      if (e.key === 'ArrowRight') movePlayer('RIGHT');
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [movePlayer]);

  if (!maze) return null;

  return (
    <div className="garden-card animate-fade-in" style={{ gap: '1.5rem', width: '100%', maxWidth: '800px', margin: '0 auto' }}>
      {/* Header Info */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', borderBottom: '1px solid #263142', paddingBottom: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div className="icon-box" style={{ width: 44, height: 44, borderRadius: '12px', backgroundColor: 'rgba(56, 189, 248, 0.15)', border: '1px solid #38BDF8' }}>
            <Compass size={24} color="#38BDF8" />
          </div>
          <div>
            <h2 style={{ fontSize: '1.4rem', color: '#FFFFFF', margin: 0, fontWeight: 900, fontFamily: 'var(--font-heading)' }}>
              {t('spatialMazeTitle') || 'Spatial Maze Navigator'}
            </h2>
            <p style={{ color: '#94A3B8', fontSize: '0.85rem', margin: 0 }}>
              {t('spatialMazeDesc') || 'Train spatial orientation & executive planning. Guide the blue orb to the green crystal.'}
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '0.75rem', color: '#94A3B8', fontWeight: 700 }}>{t('movesTaken') || 'MOVES TAKEN'}</div>
            <div style={{ fontSize: '1.2rem', color: '#FBBF24', fontWeight: 900 }}>{moves}</div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '0.75rem', color: '#94A3B8', fontWeight: 700 }}>{t('timeElapsed') || 'TIME ELAPSED'}</div>
            <div style={{ fontSize: '1.2rem', color: '#38BDF8', fontWeight: 900 }}>{elapsedTime}s</div>
          </div>
        </div>
      </div>

      {/* Main Maze Canvas Grid */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.2rem' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${MAZE_SIZE}, 1fr)`,
          gap: '2px',
          backgroundColor: '#0B0E14',
          padding: '8px',
          borderRadius: '16px',
          border: '2px solid #263142',
          boxShadow: '0 10px 30px rgba(0, 0, 0, 0.6)'
        }}>
          {maze.map((row, rIdx) =>
            row.map((cell, cIdx) => {
              const isPlayer = player.r === rIdx && player.c === cIdx;
              const isGoal = goal.r === rIdx && goal.c === cIdx;

              return (
                <div
                  key={`${rIdx}-${cIdx}`}
                  style={{
                    width: '46px',
                    height: '46px',
                    backgroundColor: isPlayer ? 'rgba(56, 189, 248, 0.25)' : isGoal ? 'rgba(52, 211, 153, 0.25)' : '#161C26',
                    borderTop: cell.top ? '3px solid #38BDF8' : '1px solid rgba(255, 255, 255, 0.05)',
                    borderRight: cell.right ? '3px solid #38BDF8' : '1px solid rgba(255, 255, 255, 0.05)',
                    borderBottom: cell.bottom ? '3px solid #38BDF8' : '1px solid rgba(255, 255, 255, 0.05)',
                    borderLeft: cell.left ? '3px solid #38BDF8' : '1px solid rgba(255, 255, 255, 0.05)',
                    borderRadius: '4px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    position: 'relative'
                  }}
                >
                  {isPlayer && (
                    <div style={{
                      width: 22,
                      height: 22,
                      borderRadius: '50%',
                      backgroundColor: '#38BDF8',
                      boxShadow: '0 0 12px #38BDF8',
                      animation: 'pulse 1.5s infinite'
                    }} />
                  )}
                  {isGoal && !isPlayer && (
                    <Sparkles size={20} color="#34D399" style={{ animation: 'bounce 2s infinite' }} />
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Big On-Screen Direction Buttons for Elderly Accessibility */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.4rem', marginTop: '0.5rem' }}>
          <button
            onClick={() => movePlayer('UP')}
            className="btn-primary"
            style={{ width: '80px', height: '48px', padding: 0 }}
            disabled={completed}
          >
            <ArrowUp size={24} />
          </button>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <button
              onClick={() => movePlayer('LEFT')}
              className="btn-primary"
              style={{ width: '80px', height: '48px', padding: 0 }}
              disabled={completed}
            >
              <ArrowLeft size={24} />
            </button>
            <button
              onClick={() => movePlayer('DOWN')}
              className="btn-primary"
              style={{ width: '80px', height: '48px', padding: 0 }}
              disabled={completed}
            >
              <ArrowDown size={24} />
            </button>
            <button
              onClick={() => movePlayer('RIGHT')}
              className="btn-primary"
              style={{ width: '80px', height: '48px', padding: 0 }}
              disabled={completed}
            >
              <ArrowRight size={24} />
            </button>
          </div>
        </div>
      </div>

      {/* Completion Modal Card */}
      {completed && resultScore !== null && (
        <div style={{
          backgroundColor: '#121721',
          border: '1px solid #34D399',
          borderRadius: '16px',
          padding: '1.5rem',
          textAlign: 'center',
          animation: 'fadeIn 0.3s ease-in-out'
        }}>
          <div className="icon-box" style={{ width: 56, height: 56, borderRadius: '16px', backgroundColor: 'rgba(52, 211, 153, 0.15)', margin: '0 auto 1rem' }}>
            <CheckCircle2 size={32} color="#34D399" />
          </div>
          <h3 style={{ fontSize: '1.5rem', color: '#FFFFFF', fontWeight: 900, marginBottom: '0.4rem' }}>
            {t('mazeSolved') || 'MAZE SOLVED SUCCESSFULLY!'}
          </h3>
          <p style={{ color: '#94A3B8', fontSize: '0.95rem', marginBottom: '1.2rem' }}>
            Spatial cognition & path planning score updated across Memory & Attention metrics.
          </p>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem', marginBottom: '1.5rem' }}>
            <div>
              <div style={{ fontSize: '0.8rem', color: '#94A3B8' }}>{t('cognitiveScore') || 'COGNITIVE SCORE'}</div>
              <div style={{ fontSize: '2rem', color: '#38BDF8', fontWeight: 900 }}>+{resultScore} PTS</div>
            </div>
            <div>
              <div style={{ fontSize: '0.8rem', color: '#94A3B8' }}>XP GAINED</div>
              <div style={{ fontSize: '2rem', color: '#FBBF24', fontWeight: 900 }}>+60 XP</div>
            </div>
          </div>

          <button onClick={initGame} className="btn-primary" style={{ padding: '0.75rem 1.8rem', fontSize: '0.95rem' }}>
            <RotateCcw size={18} />
            <span>{t('playAgainMaze') || 'PLAY AGAIN (NEW PROCEDURAL MAZE)'}</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default SpatialMazeNavigator;
