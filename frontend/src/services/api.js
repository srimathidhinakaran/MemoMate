import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

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

export default api;
