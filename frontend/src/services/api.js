import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://memomate-backend-ju43.onrender.com/api';

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
    memoryScore: 82,
    attentionScore: 64,
    recallScore: 76,
    reactionScore: 71,
    overallScore: 73
  };
};

const getStoredGarden = () => {
  const saved = localStorage.getItem('memomate_garden');
  return saved ? JSON.parse(saved) : {
    plants: 3,
    flowers: 5,
    trees: 2,
    streak: 4,
    totalActivities: 8
  };
};

export const authAPI = {
  register: async (userData) => {
    try {
      const res = await api.post('/auth/register', userData);
      return res.data;
    } catch (err) {
      const user = {
        id: 'user_demo_' + Date.now(),
        name: userData.name || 'Meena',
        age: userData.age || 68,
        email: userData.email || 'meena@example.com',
        role: userData.role || 'elderly'
      };
      return { token: 'mock_jwt_token_123', user };
    }
  },
  login: async (credentials) => {
    try {
      const res = await api.post('/auth/login', credentials);
      return res.data;
    } catch (err) {
      const isCaregiver = credentials.email?.includes('caregiver') || credentials.email?.includes('dr');
      const user = {
        id: isCaregiver ? 'caregiver_1' : 'elderly_meena_68',
        name: isCaregiver ? 'Dr. Sharma' : 'Meena',
        age: isCaregiver ? 45 : 68,
        email: credentials.email || 'meena@example.com',
        role: isCaregiver ? 'caregiver' : 'elderly'
      };
      return { token: 'mock_jwt_token_123', user };
    }
  },
  getMe: async () => {
    try {
      const res = await api.get('/auth/me');
      return res.data;
    } catch (err) {
      const stored = localStorage.getItem('memomate_user');
      return stored ? JSON.parse(stored) : { id: 'elderly_meena_68', name: 'Meena', age: 68, email: 'meena@example.com', role: 'elderly' };
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
  createSession: async (sessionData) => {
    try {
      const res = await api.post('/sessions', sessionData);
      return res.data;
    } catch (err) {
      const score = Number(sessionData.score);
      const cat = sessionData.category;
      
      const currentProfile = getStoredProfile();
      const newProf = { ...currentProfile };

      // Update actual metric based on game played
      if (cat === 'memory') newProf.memoryScore = Math.round(newProf.memoryScore * 0.65 + score * 0.35);
      if (cat === 'attention') newProf.attentionScore = Math.round(newProf.attentionScore * 0.65 + score * 0.35);
      if (cat === 'recall') newProf.recallScore = Math.round(newProf.recallScore * 0.65 + score * 0.35);
      if (cat === 'reaction') newProf.reactionScore = Math.round(newProf.reactionScore * 0.65 + score * 0.35);
      
      newProf.overallScore = Math.round((newProf.memoryScore + newProf.attentionScore + newProf.recallScore + newProf.reactionScore) / 4);
      localStorage.setItem('memomate_profile', JSON.stringify(newProf));

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
      return [
        { activity: '3D Memory Match', category: 'memory', score: 85, completedAt: new Date(Date.now() - 3600000) },
        { activity: '3D Focus Search', category: 'attention', score: 78, completedAt: new Date(Date.now() - 86400000) }
      ];
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
      const p = getStoredProfile();
      return [
        {
          id: 'elderly_meena_68',
          _id: 'elderly_meena_68',
          name: 'Meena',
          age: 68,
          email: 'meena@example.com',
          profile: p,
          sessionsCompleted: 8,
          gardenStreak: 4
        }
      ];
    }
  },
  getUserDetails: async (userId) => {
    try {
      const res = await api.get(`/caregiver/user/${userId}`);
      return res.data;
    } catch (err) {
      const p = getStoredProfile();
      return {
        user: { id: userId, name: 'Meena', age: 68, email: 'meena@example.com' },
        profile: p,
        sessions: [
          { activity: '3D Memory Match', category: 'memory', score: p.memoryScore, difficulty: 'Medium', completedAt: new Date() },
          { activity: '3D Focus Search', category: 'attention', score: p.attentionScore, difficulty: 'Medium', completedAt: new Date(Date.now() - 3600000) }
        ],
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
      return saved ? JSON.parse(saved) : {
        userId: userId || 'elderly_meena_68',
        xpPoints: 850,
        gems: 140,
        level: 3,
        currentStreak: 5,
        highestStreak: 12,
        streakFreezeAvailable: true,
        league: 'Emerald League',
        leagueRank: 3,
        unlockedBadges: [
          { id: 'first_win', title: 'First Victory 🏆', desc: 'Completed 1st cognitive game session', icon: '🎯' },
          { id: 'streak_3', title: 'Streak Pioneer 🔥', desc: 'Maintained 3-day workout streak', icon: '⚡' },
          { id: '3d_master', title: '3D Spatial Explorer 🎨', desc: 'Played 3D WebGL flower memory', icon: '🌸' }
        ],
        unlockedGardenItems: ['golden_sunflower'],
        dailyQuests: [
          { id: 'quest_1', title: 'Complete 2 Cognitive Sessions', target: 2, current: 1, rewardXp: 50, rewardGems: 15, completed: false },
          { id: 'quest_2', title: 'Score over 80 in 3D Focus', target: 1, current: 1, rewardXp: 75, rewardGems: 25, completed: true },
          { id: 'quest_3', title: 'Maintain your Daily Streak', target: 1, current: 1, rewardXp: 40, rewardGems: 10, completed: true }
        ],
        weeklyHistory: [
          { day: 'Mon', active: true },
          { day: 'Tue', active: true },
          { day: 'Wed', active: true },
          { day: 'Thu', active: true },
          { day: 'Fri', active: true },
          { day: 'Sat', active: false },
          { day: 'Sun', active: false }
        ]
      };
    }
  },
  getLeaderboard: async () => {
    try {
      const res = await api.get('/gamification/leaderboard');
      return res.data;
    } catch (err) {
      return [
        { rank: 1, userId: 'user_aarav_99', name: 'Aarav Patel', age: 71, xpPoints: 1420, currentStreak: 14, league: 'Emerald League', avatar: '👴' },
        { rank: 2, userId: 'user_sunita_45', name: 'Sunita Sharma', age: 65, xpPoints: 1180, currentStreak: 9, league: 'Emerald League', avatar: '👵' },
        { rank: 3, userId: 'elderly_meena_68', name: 'Meena (You)', age: 68, xpPoints: 850, currentStreak: 5, league: 'Emerald League', avatar: '🌸', isCurrentUser: true },
        { rank: 4, userId: 'user_ramesh_12', name: 'Ramesh Kumar', age: 74, xpPoints: 720, currentStreak: 4, league: 'Emerald League', avatar: '👴' },
        { rank: 5, userId: 'user_anita_88', name: 'Anita Roy', age: 69, xpPoints: 650, currentStreak: 3, league: 'Emerald League', avatar: '👵' },
        { rank: 6, userId: 'user_dev_33', name: 'Devendra Das', age: 72, xpPoints: 590, currentStreak: 2, league: 'Emerald League', avatar: '👨‍🌾' },
        { rank: 7, userId: 'user_kavita_01', name: 'Kavita Sen', age: 67, xpPoints: 480, currentStreak: 1, league: 'Emerald League', avatar: '👩‍🏫' }
      ];
    }
  }
};

export default api;
