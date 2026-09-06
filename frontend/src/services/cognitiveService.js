// Centralized Cognitive Score & Adaptive AI Engine for MemoMate

const PROFILE_KEY = 'memomate_profile';
const SESSIONS_KEY = 'memomate_game_sessions';
const RECOMMENDATION_KEY = 'memomate_recommendation';

export const cognitiveService = {
  // Retrieve profile or default to unassessed state
  getProfile: () => {
    const saved = localStorage.getItem(PROFILE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return parsed;
      } catch (e) {
        console.error('Error parsing stored profile', e);
      }
    }
    return {
      assessed: false,
      memoryScore: null,
      attentionScore: null,
      recallScore: null,
      reactionScore: null,
      overallScore: null,
      history: []
    };
  },

  // Retrieve recorded game sessions
  getGameSessions: () => {
    const saved = localStorage.getItem(SESSIONS_KEY);
    if (!saved) return [];
    try {
      return JSON.parse(saved);
    } catch (e) {
      return [];
    }
  },

  // Record a single game session performance deterministically
  recordGameSession: (sessionData) => {
    const sessions = cognitiveService.getGameSessions();
    const currentProfile = cognitiveService.getProfile();

    const timestamp = new Date().toISOString();
    const rawScore = Number(sessionData.score) || 75;
    const accuracy = Number(sessionData.accuracy) || 80;
    const responseTimeMs = Number(sessionData.responseTimeMs) || 1200;
    const category = sessionData.category || 'memory'; // 'memory' | 'attention' | 'recall' | 'reaction' | 'pattern'

    const newSession = {
      id: 'sess_' + Date.now(),
      gameId: sessionData.gameId || 'game',
      gameTitle: sessionData.gameTitle || 'Cognitive Activity',
      category,
      score: rawScore,
      accuracy,
      responseTimeMs,
      mistakes: Number(sessionData.mistakes) || 0,
      difficulty: sessionData.difficulty || 'Medium',
      timestamp
    };

    const updatedSessions = [newSession, ...sessions].slice(0, 50);
    localStorage.setItem(SESSIONS_KEY, JSON.stringify(updatedSessions));

    // Update cognitive domain score using weighted exponential moving average
    const mapCategoryToKey = {
      memory: 'memoryScore',
      '3d-memory': 'memoryScore',
      card: 'memoryScore',
      attention: 'attentionScore',
      '3d-target': 'attentionScore',
      focus: 'attentionScore',
      recall: 'recallScore',
      number: 'recallScore',
      word: 'recallScore',
      reaction: 'reactionScore',
      '3d-reaction': 'reactionScore',
      speed: 'reactionScore',
      pattern: 'memoryScore'
    };

    const targetKey = mapCategoryToKey[category] || 'memoryScore';
    
    // Existing values or fallback to baseline rawScore
    const prevMemory = currentProfile.memoryScore;
    const prevAttention = currentProfile.attentionScore;
    const prevRecall = currentProfile.recallScore;
    const prevReaction = currentProfile.reactionScore;

    const calcNewScore = (prev, fresh) => {
      if (prev === null || prev === undefined) return Math.round(fresh);
      return Math.round(prev * 0.65 + fresh * 0.35);
    };

    const newMemory = targetKey === 'memoryScore' ? calcNewScore(prevMemory, rawScore) : (prevMemory || null);
    const newAttention = targetKey === 'attentionScore' ? calcNewScore(prevAttention, rawScore) : (prevAttention || null);
    const newRecall = targetKey === 'recallScore' ? calcNewScore(prevRecall, rawScore) : (prevRecall || null);
    const newReaction = targetKey === 'reactionScore' ? calcNewScore(prevReaction, rawScore) : (prevReaction || null);

    const validScores = [newMemory, newAttention, newRecall, newReaction].filter(s => s !== null);
    const overallScore = validScores.length > 0 ? Math.round(validScores.reduce((a, b) => a + b, 0) / validScores.length) : null;

    // Calculate trends (+6, -4, etc) compared to 2 sessions ago
    const getTrend = (catKey) => {
      const catSessions = updatedSessions.filter(s => mapCategoryToKey[s.category] === catKey);
      if (catSessions.length < 2) return 0;
      return catSessions[0].score - catSessions[1].score;
    };

    const newProfile = {
      assessed: true,
      memoryScore: newMemory,
      memoryTrend: getTrend('memoryScore'),
      attentionScore: newAttention,
      attentionTrend: getTrend('attentionScore'),
      recallScore: newRecall,
      recallTrend: getTrend('recallScore'),
      reactionScore: newReaction,
      reactionTrend: getTrend('reactionScore'),
      overallScore,
      lastUpdated: timestamp
    };

    localStorage.setItem(PROFILE_KEY, JSON.stringify(newProfile));

    // Adaptive AI Engine: Identify Weakest Domain & Adjust Difficulty
    const scoreEntries = [
      { key: 'memory', score: newMemory ?? 100, title: 'Memory' },
      { key: 'attention', score: newAttention ?? 100, title: 'Attention' },
      { key: 'recall', score: newRecall ?? 100, title: 'Recall' },
      { key: 'reaction', score: newReaction ?? 100, title: 'Reaction' }
    ];

    scoreEntries.sort((a, b) => a.score - b.score);
    const weakDomain = scoreEntries[0];

    // Determine adaptive difficulty based on recent performance
    let recommendedDifficulty = 'Medium';
    let difficultyReason = '';

    if (accuracy >= 85) {
      recommendedDifficulty = 'Hard';
      difficultyReason = `Your accuracy reached ${accuracy}% during your last session. MemoMate therefore increased the difficulty to target ${weakDomain.title}.`;
    } else if (accuracy < 60) {
      recommendedDifficulty = 'Easy';
      difficultyReason = `Your accuracy was ${accuracy}% with extra time needed. MemoMate adjusted your next activity to a gentler difficulty to strengthen ${weakDomain.title}.`;
    } else {
      recommendedDifficulty = 'Medium';
      difficultyReason = `Your recent performance is consistent (${accuracy}% accuracy). MemoMate recommends practicing ${weakDomain.title} at an optimal pace.`;
    }

    const gameRecommendationMap = {
      memory: '3d-memory',
      attention: '3d-target',
      recall: 'number',
      reaction: '3d-reaction'
    };

    const newRecommendation = {
      weakArea: weakDomain.key,
      recommendedGameId: gameRecommendationMap[weakDomain.key] || '3d-memory',
      difficulty: recommendedDifficulty,
      reason: difficultyReason,
      accuracy,
      lastSessionScore: rawScore
    };

    localStorage.setItem(RECOMMENDATION_KEY, JSON.stringify(newRecommendation));

    return {
      profile: newProfile,
      recommendation: newRecommendation,
      session: newSession
    };
  },

  // Save full Baseline Assessment results for first-time users
  saveBaselineAssessment: (baselineResults) => {
    // baselineResults = { memoryScore, attentionScore, recallScore, reactionScore }
    const memory = Math.min(100, Math.max(30, Math.round(baselineResults.memoryScore || 75)));
    const attention = Math.min(100, Math.max(30, Math.round(baselineResults.attentionScore || 70)));
    const recall = Math.min(100, Math.max(30, Math.round(baselineResults.recallScore || 72)));
    const reaction = Math.min(100, Math.max(30, Math.round(baselineResults.reactionScore || 68)));

    const overall = Math.round((memory + attention + recall + reaction) / 4);

    const profile = {
      assessed: true,
      memoryScore: memory,
      memoryTrend: 0,
      attentionScore: attention,
      attentionTrend: 0,
      recallScore: recall,
      recallTrend: 0,
      reactionScore: reaction,
      reactionTrend: 0,
      overallScore: overall,
      lastUpdated: new Date().toISOString()
    };

    localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));

    // Record baseline as initial sessions
    const baselineSessions = [
      { id: 'base_1', gameTitle: 'Baseline Memory Test', category: 'memory', score: memory, timestamp: new Date().toISOString() },
      { id: 'base_2', gameTitle: 'Baseline Attention Test', category: 'attention', score: attention, timestamp: new Date().toISOString() },
      { id: 'base_3', gameTitle: 'Baseline Recall Test', category: 'recall', score: recall, timestamp: new Date().toISOString() },
      { id: 'base_4', gameTitle: 'Baseline Reaction Test', category: 'reaction', score: reaction, timestamp: new Date().toISOString() }
    ];

    localStorage.setItem(SESSIONS_KEY, JSON.stringify(baselineSessions));

    // Identify initial focus area
    const domains = [
      { key: 'memory', score: memory },
      { key: 'attention', score: attention },
      { key: 'recall', score: recall },
      { key: 'reaction', score: reaction }
    ].sort((a, b) => a.score - b.score);

    const initialWeak = domains[0].key;
    const gameRecommendationMap = {
      memory: '3d-memory',
      attention: '3d-target',
      recall: 'number',
      reaction: '3d-reaction'
    };

    const recommendation = {
      weakArea: initialWeak,
      recommendedGameId: gameRecommendationMap[initialWeak] || '3d-memory',
      difficulty: 'Medium',
      reason: `Your baseline cognitive profile is established! MemoMate recommends starting with ${initialWeak.toUpperCase()} exercises for optimal progress.`
    };

    localStorage.setItem(RECOMMENDATION_KEY, JSON.stringify(recommendation));

    return { profile, recommendation };
  }
};
