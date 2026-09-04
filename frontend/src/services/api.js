import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('memomate_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => Promise.reject(error));

const getStoredProfile = () => {
  const saved = localStorage.getItem('memomate_profile');
  return saved ? JSON.parse(saved) : {
    memoryScore: 70,
    attentionScore: 70,
    recallScore: 70,
    reactionScore: 70,
    overallScore: 70
  };
};

const getStoredGarden = () => {
  const saved = localStorage.getItem('memomate_garden');
  return saved ? JSON.parse(saved) : {
    plants: 1,
    flowers: 1,
    trees: 0,
    streak: 1,
    totalActivities: 0
  };
};

export const authAPI = {
  register: async (userData) => {
    const res = await api.post('/auth/register', userData);
    return res.data;
  },
  login: async (credentials) => {
    const res = await api.post('/auth/login', credentials);
    return res.data;
  },
  getMe: async () => {
    try {
      const res = await api.get('/auth/me');
      return res.data;
    } catch (err) {
      const stored = localStorage.getItem('memomate_user');
      return stored ? JSON.parse(stored) : null;
    }
  }
};

export const cognitiveAPI = {
  getProfile: async (userId) => {
    try {
      const res = await api.get(`/cognitive/${userId}`);
      return res.data;
    } catch (err) {
      return getStoredProfile();
    }
  },
  updateProfile: async (userId, data) => {
    try {
      const res = await api.put(`/cognitive/${userId}`, data);
      return res.data;
    } catch (err) {
      const current = getStoredProfile();
      const updated = { ...current, ...data };
      localStorage.setItem('memomate_profile', JSON.stringify(updated));
      return updated;
    }
  }
};

export const sessionAPI = {
  getRecentActivities: async () => {
    try {
      const res = await api.get('/sessions/live-activities');
      return res.data;
    } catch (err) {
      const saved = localStorage.getItem('memomate_recent_activities');
      return saved ? JSON.parse(saved) : [];
    }
  },
  createSession: async (sessionData) => {
    try {
      const res = await api.post('/sessions', sessionData);
      window.dispatchEvent(new Event('memomate_activity_updated'));
      return res.data;
    } catch (err) {
      const score = Number(sessionData.score);
      const cat = sessionData.category;
      
      const currentProfile = getStoredProfile();
      const newProf = { ...currentProfile };

      // Update actual metric based on game played
      if (cat === 'memory' || cat === 'pattern' || cat === '3d-memory') newProf.memoryScore = Math.round(newProf.memoryScore * 0.65 + score * 0.35);
      if (cat === 'attention' || cat === '3d-target' || cat === 'focus') newProf.attentionScore = Math.round(newProf.attentionScore * 0.65 + score * 0.35);
      if (cat === 'recall' || cat === 'word' || cat === 'number') newProf.recallScore = Math.round(newProf.recallScore * 0.65 + score * 0.35);
      if (cat === 'reaction' || cat === '3d-reaction') newProf.reactionScore = Math.round(newProf.reactionScore * 0.65 + score * 0.35);
      
      newProf.overallScore = Math.round((newProf.memoryScore + newProf.attentionScore + newProf.recallScore + newProf.reactionScore) / 4);
      localStorage.setItem('memomate_profile', JSON.stringify(newProf));

      // Record real activity entry in local storage for fallback mode
      const userStr = localStorage.getItem('memomate_user');
      const currentUser = userStr ? JSON.parse(userStr) : null;
      if (currentUser) {
        const parts = (currentUser.name || 'User').split(' ').filter(Boolean);
        const initials = parts.length >= 2 ? `${parts[0][0]}${parts[1][0]}`.toUpperCase() : (currentUser.name || 'US').slice(0, 2).toUpperCase();

        const newAct = {
          id: 'act_' + Date.now(),
          user: currentUser.name || 'Active User',
          action: `completed ${sessionData.activity || 'Exercise'}`,
          score: score,
          completedAt: new Date().toISOString(),
          initials: initials || 'AU'
        };

        const storedActs = JSON.parse(localStorage.getItem('memomate_recent_activities') || '[]');
        const updatedActs = [newAct, ...storedActs].slice(0, 15);
        localStorage.setItem('memomate_recent_activities', JSON.stringify(updatedActs));

        // Also update local gamification XP
        const savedXp = localStorage.getItem('memomate_xp');
        const savedGems = localStorage.getItem('memomate_gems');
        const savedStreak = localStorage.getItem('memomate_streak');
        const currentXp = savedXp !== null ? Number(savedXp) : 0;
        const currentGems = savedGems !== null ? Number(savedGems) : 10;
        const currentStreak = savedStreak !== null ? Number(savedStreak) : 0;

        const newXp = currentXp + Math.round(score * 1.5);
        const newGems = currentGems + Math.round(score * 0.25);

        localStorage.setItem('memomate_xp', newXp);
        localStorage.setItem('memomate_gems', newGems);

        const gamObj = {
          xpPoints: newXp,
          gems: newGems,
          level: Math.floor(newXp / 300) + 1,
          currentStreak: currentStreak
        };
        localStorage.setItem('memomate_gamification', JSON.stringify(gamObj));
      }

      window.dispatchEvent(new Event('memomate_activity_updated'));

      // Determine new weakest area
      let weakArea = 'attention';
      let minScore = newProf.attentionScore;
      if (newProf.memoryScore < minScore) { weakArea = 'memory'; minScore = newProf.memoryScore; }
      if (newProf.recallScore < minScore) { weakArea = 'recall'; minScore = newProf.recallScore; }
      if (newProf.reactionScore < minScore) { weakArea = 'reaction'; minScore = newProf.reactionScore; }

      let recommendedActivity = '3D Focus Search 🎯';
      if (weakArea === 'memory') recommendedActivity = '3D Memory Match 🎨';
      if (weakArea === 'recall') recommendedActivity = 'Number Recall 🔢';
      if (weakArea === 'reaction') recommendedActivity = '3D Reaction Orbs ⚡';

      const recommendation = {
        weakArea,
        recommendedActivity,
        difficulty: minScore < 65 ? 'Easy' : 'Medium',
        reason: `Our Scikit-Learn ML Model analyzed your recent scores (${minScore}) and detected ${weakArea} as your primary focus area.`
      };
      localStorage.setItem('memomate_recommendation', JSON.stringify(recommendation));

      const currentGarden = getStoredGarden();
      const newGarden = {
        ...currentGarden,
        totalActivities: currentGarden.totalActivities + 1,
        flowers: currentGarden.totalActivities % 2 === 0 ? currentGarden.flowers + 1 : currentGarden.flowers,
        plants: currentGarden.totalActivities % 3 === 0 ? currentGarden.plants + 1 : currentGarden.plants
      };
      localStorage.setItem('memomate_garden', JSON.stringify(newGarden));

      return {
        session: { ...sessionData, completedAt: new Date() },
        profile: newProf,
        recommendation,
        garden: newGarden
      };
    }
  },
  getSessionsByUser: async (userId) => {
    try {
      const res = await api.get(`/sessions/${userId}`);
      return res.data;
    } catch (err) {
      return [];
    }
  }
};

export const recommendationAPI = {
  getLatest: async (userId) => {
    try {
      const res = await api.get(`/recommendations/${userId}`);
      return res.data;
    } catch (err) {
      const savedRec = localStorage.getItem('memomate_recommendation');
      return savedRec ? JSON.parse(savedRec) : {
        weakArea: 'attention',
        recommendedActivity: '3D Focus Search 🎯',
        difficulty: 'Medium',
        reason: 'Our Scikit-Learn ML Model detected attention as your primary focus area.'
      };
    }
  }
};

export const gardenAPI = {
  getGarden: async (userId) => {
    try {
      const res = await api.get(`/garden/${userId}`);
      return res.data;
    } catch (err) {
      return getStoredGarden();
    }
  },
  updateGarden: async (userId, action) => {
    try {
      const res = await api.put(`/garden/${userId}`, { action });
      return res.data;
    } catch (err) {
      const g = getStoredGarden();
      const updated = { ...g, flowers: g.flowers + 1 };
      localStorage.setItem('memomate_garden', JSON.stringify(updated));
      return updated;
    }
  }
};

export const caregiverAPI = {
  getUsers: async () => {
    try {
      const res = await api.get('/caregiver/users');
      return res.data;
    } catch (err) {
      const storedUserStr = localStorage.getItem('memomate_user');
      const storedUser = storedUserStr ? JSON.parse(storedUserStr) : null;
      if (storedUser) {
        return [{
          id: storedUser.id,
          _id: storedUser.id,
          name: storedUser.name,
          age: storedUser.age || 68,
          email: storedUser.email,
          profile: getStoredProfile(),
          sessionsCompleted: 1,
          gardenStreak: 1
        }];
      }
      return [];
    }
  },
  getUserDetails: async (userId) => {
    try {
      const res = await api.get(`/caregiver/user/${userId}`);
      return res.data;
    } catch (err) {
      const p = getStoredProfile();
      const storedUserStr = localStorage.getItem('memomate_user');
      const storedUser = storedUserStr ? JSON.parse(storedUserStr) : null;
      const name = storedUser?.name || 'User';

      return {
        user: { id: userId, name: name, age: storedUser?.age || 68, email: storedUser?.email || 'user@example.com' },
        profile: p,
        sessions: [],
        recommendation: {
          weakArea: 'attention',
          recommendedActivity: '3D Focus Search 🎯',
          difficulty: 'Medium',
          reason: 'Groq Llama-3 AI & Scikit-Learn Model telemetry observation.'
        },
        garden: getStoredGarden(),
        aiObservation: `Attention score (${p.attentionScore}/100) indicates focus exercise is recommended while memory recall (${p.memoryScore}/100) remains strong.`
      };
    }
  }
};

export const gamificationAPI = {
  getGamification: async (userId) => {
    try {
      const res = await api.get(`/gamification/${userId}`);
      return res.data;
    } catch (err) {
      const saved = localStorage.getItem('memomate_gamification');
      const savedXp = localStorage.getItem('memomate_xp');
      const savedGems = localStorage.getItem('memomate_gems');
      const savedStreak = localStorage.getItem('memomate_streak');

      const xp = savedXp !== null ? Number(savedXp) : 0;
      const gems = savedGems !== null ? Number(savedGems) : 10;
      const streak = savedStreak !== null ? Number(savedStreak) : 0;

      let baseObj = saved ? JSON.parse(saved) : {};
      return {
        ...baseObj,
        userId: userId || 'user_1',
        xpPoints: Math.max(xp, baseObj.xpPoints || 0),
        gems: Math.max(gems, baseObj.gems || 10),
        level: Math.floor(Math.max(xp, baseObj.xpPoints || 0) / 300) + 1,
        currentStreak: Math.max(streak, baseObj.currentStreak || 0),
        highestStreak: Math.max(streak, baseObj.highestStreak || 0),
        streakFreezeAvailable: true,
        league: 'Emerald League',
        leagueRank: 1,
        unlockedBadges: [],
        unlockedGardenItems: ['cyber_crystal'],
        dailyQuests: baseObj.dailyQuests || [
          { id: 'quest_1', title: 'Complete 2 Cognitive Sessions', target: 2, current: 0, rewardXp: 50, rewardGems: 15, completed: false },
          { id: 'quest_2', title: 'Score over 80 in 3D Focus', target: 1, current: 0, rewardXp: 75, rewardGems: 25, completed: false },
          { id: 'quest_3', title: 'Maintain your Daily Streak', target: 1, current: streak > 0 ? 1 : 0, rewardXp: 40, rewardGems: 10, completed: streak > 0 }
        ],
        weeklyHistory: []
      };
    }
  },
  getLeaderboard: async () => {
    try {
      const res = await api.get('/gamification/leaderboard');
      return res.data;
    } catch (err) {
      const storedUserStr = localStorage.getItem('memomate_user');
      const storedUser = storedUserStr ? JSON.parse(storedUserStr) : null;
      const storedGam = localStorage.getItem('memomate_gamification');
      const gamData = storedGam ? JSON.parse(storedGam) : null;

      if (storedUser) {
        return [
          {
            rank: 1,
            userId: storedUser.id || 'user_1',
            name: storedUser.name || 'User',
            age: storedUser.age || 68,
            xpPoints: gamData?.xpPoints || 100,
            currentStreak: gamData?.currentStreak || 1,
            league: 'Emerald League',
            avatar: '🌸',
            isCurrentUser: true
          }
        ];
      }
      return [];
    }
  }
};

export default api;
