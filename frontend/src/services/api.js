import axios from 'axios';
import { cognitiveService } from './cognitiveService';

const RENDER_API_URL = 'https://memomate-backend-ju43.onrender.com/api';
const isLocalhost = typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');
const API_BASE_URL = import.meta.env.VITE_API_URL || (isLocalhost ? 'http://localhost:5000/api' : RENDER_API_URL);

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

export const getAccountsDB = () => {
  const saved = localStorage.getItem('memomate_accounts');
  const defaultAccounts = [];
  if (!saved) {
    localStorage.setItem('memomate_accounts', JSON.stringify(defaultAccounts));
    return defaultAccounts;
  }
  try {
    const parsed = JSON.parse(saved);
    if (!Array.isArray(parsed) || parsed.length === 0) {
      localStorage.setItem('memomate_accounts', JSON.stringify(defaultAccounts));
      return defaultAccounts;
    }
    return parsed;
  } catch (e) {
    localStorage.setItem('memomate_accounts', JSON.stringify(defaultAccounts));
    return defaultAccounts;
  }
};

export const saveAccountToDB = (account) => {
  const accounts = getAccountsDB();
  const existingIdx = accounts.findIndex(a => a.email.toLowerCase() === account.email.toLowerCase());
  if (existingIdx >= 0) {
    accounts[existingIdx] = { ...accounts[existingIdx], ...account };
  } else {
    accounts.push(account);
  }
  localStorage.setItem('memomate_accounts', JSON.stringify(accounts));
  return account;
};

export const getStoredProfile = (userId) => cognitiveService.getProfile(userId);

export const getStoredGarden = (userId) => {
  const uId = userId || 'user_default';
  const saved = localStorage.getItem(`memomate_garden_${uId}`);
  return saved ? JSON.parse(saved) : {
    userId: uId,
    plants: 1,
    flowers: 1,
    trees: 0,
    streak: 0,
    totalActivities: 0
  };
};

export const getStoredReminders = (userId) => {
  const uId = userId || 'user_default';
  const saved = localStorage.getItem(`memomate_reminders_${uId}`);
  return saved ? JSON.parse(saved) : [
    { id: 'rem_1', time: '08:00 AM', title: 'Hydration Reminder', category: 'hydration', detail: 'Drink 1 full glass of water', status: 'completed' },
    { id: 'rem_2', time: '09:00 AM', title: 'Cognitive Memory Session', category: 'cognitive', detail: '3D Memory & Spatial Match', status: 'pending' },
    { id: 'rem_3', time: '12:30 PM', title: 'Afternoon Medication', category: 'medicine', detail: 'Blood Pressure & Multivitamin', status: 'pending' }
  ];
};

export const getStoredFamily = (userId) => {
  const uId = userId || 'user_default';
  const saved = localStorage.getItem(`memomate_family_${uId}`);
  return saved ? JSON.parse(saved) : [];
};

export const authAPI = {
  register: async (userData) => {
    try {
      const res = await api.post('/auth/register', userData);
      return res.data;
    } catch (err) {
      if (err.response && err.response.data && err.response.data.message) {
        throw new Error(err.response.data.message);
      }
      console.warn('Backend server unreachable. Falling back to local offline session for registration.');
      const accounts = getAccountsDB();
      const existing = accounts.find(a => a.email.toLowerCase() === userData.email.toLowerCase().trim());
      if (existing) {
        throw new Error('An account with this email already exists. Please log in instead.');
      }
      const newUser = {
        id: 'usr_' + Date.now(),
        name: userData.name.trim(),
        age: Number(userData.age) || 68,
        email: userData.email.toLowerCase().trim(),
        password: userData.password,
        role: userData.role || 'elderly',
        preferredLanguage: userData.preferredLanguage || 'en',
        preferredTheme: userData.preferredTheme || 'theme-nature',
        familySetupCompleted: false,
        initialAssessmentCompleted: false,
        familyMembers: []
      };
      saveAccountToDB(newUser);
      const token = 'demo_token_' + Date.now();
      return { token, user: newUser };
    }
  },

  login: async (credentials) => {
    try {
      const res = await api.post('/auth/login', credentials);
      return res.data;
    } catch (err) {
      if (err.response && err.response.data && err.response.data.message) {
        throw new Error(err.response.data.message);
      }
      console.warn('Backend server unreachable. Falling back to local offline session for login.');
      const accounts = getAccountsDB();
      const emailClean = credentials.email.toLowerCase().trim();
      const target = accounts.find(a => a.email.toLowerCase() === emailClean);

      if (target) {
        if (target.password && credentials.password && target.password !== credentials.password) {
          throw new Error('Invalid email or password.');
        }
        const token = 'demo_token_' + Date.now();
        return { token, user: target };
      }

      // Fall back user creation for smooth offline access
      const fallbackUser = {
        id: 'usr_' + Date.now(),
        name: emailClean.split('@')[0] || 'MemoUser',
        age: 68,
        email: emailClean,
        password: credentials.password,
        role: emailClean.includes('caregiver') ? 'caregiver' : 'elderly',
        preferredLanguage: 'en',
        preferredTheme: 'theme-nature',
        familySetupCompleted: false,
        initialAssessmentCompleted: false,
        familyMembers: []
      };
      saveAccountToDB(fallbackUser);
      return { token: 'demo_token_' + Date.now(), user: fallbackUser };
    }
  },

  getMe: async () => {
    try {
      const res = await api.get('/auth/me');
      return res.data;
    } catch (err) {
      if (err.response && err.response.status === 401) {
        localStorage.removeItem('memomate_token');
        localStorage.removeItem('memomate_user');
        return null;
      }
      const stored = localStorage.getItem('memomate_user');
      return stored ? JSON.parse(stored) : null;
    }
  },

  updatePreferences: async (preferences) => {
    try {
      const res = await api.put('/auth/preferences', preferences);
      return res.data;
    } catch (err) {
      const uStr = localStorage.getItem('memomate_user');
      if (uStr) {
        const u = JSON.parse(uStr);
        const updated = { ...u, ...preferences };
        localStorage.setItem('memomate_user', JSON.stringify(updated));
      }
      return preferences;
    }
  },

  updateFamilySetup: async (familyMembers) => {
    try {
      const res = await api.put('/auth/family-setup', { familyMembers });
      return res.data;
    } catch (err) {
      const uStr = localStorage.getItem('memomate_user');
      if (uStr) {
        const u = JSON.parse(uStr);
        const updated = { ...u, familyMembers, familySetupCompleted: true };
        localStorage.setItem('memomate_user', JSON.stringify(updated));
      }
      return { familySetupCompleted: true, familyMembers };
    }
  },

  updateAssessmentCompleted: async () => {
    try {
      const res = await api.put('/auth/assessment-completed');
      return res.data;
    } catch (err) {
      const uStr = localStorage.getItem('memomate_user');
      if (uStr) {
        const u = JSON.parse(uStr);
        const updated = { ...u, initialAssessmentCompleted: true };
        localStorage.setItem('memomate_user', JSON.stringify(updated));
      }
      return { initialAssessmentCompleted: true };
    }
  }
};

export const cognitiveAPI = {
  getProfile: async (userId) => {
    try {
      const res = await api.get(`/cognitive/${userId}`);
      return res.data;
    } catch (err) {
      return getStoredProfile(userId);
    }
  },
  updateProfile: async (userId, data) => {
    try {
      const res = await api.put(`/cognitive/${userId}`, data);
      return res.data;
    } catch (err) {
      const current = getStoredProfile(userId);
      const updated = { ...current, ...data };
      localStorage.setItem(`memomate_profile_${userId}`, JSON.stringify(updated));
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
    const userStr = localStorage.getItem('memomate_user');
    const currentUser = userStr ? JSON.parse(userStr) : null;
    const userId = currentUser?.id || sessionData.userId || 'user_default';

    try {
      const res = await api.post('/sessions', { ...sessionData, userId });
      window.dispatchEvent(new Event('memomate_activity_updated'));
      return res.data;
    } catch (err) {
      const recorded = cognitiveService.recordGameSession({
        gameId: sessionData.activity || 'Exercise',
        gameTitle: sessionData.activity || 'Cognitive Exercise',
        category: sessionData.category || 'memory',
        score: Number(sessionData.score) || 80,
        accuracy: Number(sessionData.accuracy) || 85,
        responseTimeMs: Number(sessionData.reactionTime) || 1200,
        difficulty: sessionData.difficulty || 'Medium'
      }, userId);

      const newProf = recorded.profile;
      const recommendation = recorded.recommendation;

      if (currentUser) {
        const parts = (currentUser.name || 'User').split(' ').filter(Boolean);
        const initials = parts.length >= 2 ? `${parts[0][0]}${parts[1][0]}`.toUpperCase() : (currentUser.name || 'US').slice(0, 2).toUpperCase();

        const newAct = {
          id: 'act_' + Date.now(),
          user: currentUser.name || 'Active User',
          action: `completed ${sessionData.activity || 'Exercise'}`,
          score: Number(sessionData.score) || 80,
          completedAt: new Date().toISOString(),
          initials: initials || 'AU'
        };

        const storedActs = JSON.parse(localStorage.getItem('memomate_recent_activities') || '[]');
        const updatedActs = [newAct, ...storedActs].slice(0, 15);
        localStorage.setItem('memomate_recent_activities', JSON.stringify(updatedActs));

        const savedXp = localStorage.getItem(`memomate_xp_${userId}`);
        const savedGems = localStorage.getItem(`memomate_gems_${userId}`);
        const savedStreak = localStorage.getItem(`memomate_streak_${userId}`);
        const currentXp = savedXp !== null ? Number(savedXp) : 0;
        const currentGems = savedGems !== null ? Number(savedGems) : 10;
        const currentStreak = savedStreak !== null ? Number(savedStreak) : 0;

        const newXp = currentXp + Math.round((sessionData.score || 80) * 1.5);
        const newGems = currentGems + Math.round((sessionData.score || 80) * 0.25);

        localStorage.setItem(`memomate_xp_${userId}`, newXp);
        localStorage.setItem(`memomate_gems_${userId}`, newGems);

        const gamObj = {
          xpPoints: newXp,
          gems: newGems,
          level: Math.floor(newXp / 300) + 1,
          currentStreak
        };
        localStorage.setItem(`memomate_gamification_${userId}`, JSON.stringify(gamObj));
      }

      window.dispatchEvent(new Event('memomate_activity_updated'));

      const currentGarden = getStoredGarden(userId);
      const newGarden = {
        ...currentGarden,
        totalActivities: currentGarden.totalActivities + 1,
        flowers: (currentGarden.totalActivities + 1) % 2 === 0 ? currentGarden.flowers + 1 : currentGarden.flowers,
        plants: (currentGarden.totalActivities + 1) % 3 === 0 ? currentGarden.plants + 1 : currentGarden.plants
      };
      localStorage.setItem(`memomate_garden_${userId}`, JSON.stringify(newGarden));

      return {
        session: recorded.session,
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
      return cognitiveService.getGameSessions(userId);
    }
  }
};

export const recommendationAPI = {
  getLatest: async (userId) => {
    try {
      const res = await api.get(`/recommendations/${userId}`);
      return res.data;
    } catch (err) {
      const savedRec = localStorage.getItem(`memomate_recommendation_${userId}`);
      return savedRec ? JSON.parse(savedRec) : {
        weakArea: 'attention',
        recommendedActivity: '3D Focus Search 🎯',
        difficulty: 'Medium',
        reason: 'Complete your baseline assessment to personalize activity recommendations.'
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
      return getStoredGarden(userId);
    }
  },
  updateGarden: async (userId, action) => {
    try {
      const res = await api.put(`/garden/${userId}`, { action });
      return res.data;
    } catch (err) {
      const g = getStoredGarden(userId);
      const updated = { ...g, flowers: g.flowers + 1 };
      localStorage.setItem(`memomate_garden_${userId}`, JSON.stringify(updated));
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
      const accounts = getAccountsDB();
      return accounts.filter(acc => acc.role === 'elderly').map(acc => ({
        id: acc.id,
        _id: acc.id,
        name: acc.name,
        age: acc.age || 68,
        email: acc.email,
        profile: getStoredProfile(acc.id),
        sessionsCompleted: cognitiveService.getGameSessions(acc.id).length,
        gardenStreak: getStoredGarden(acc.id).streak || 0
      }));
    }
  },
  getUserDetails: async (userId) => {
    try {
      const res = await api.get(`/caregiver/user/${userId}`);
      return res.data;
    } catch (err) {
      const accounts = getAccountsDB();
      const targetUser = accounts.find(acc => acc.id === userId) || { id: userId, name: 'Patient User', age: 68, email: 'patient@example.com' };
      const p = getStoredProfile(userId);
      const sessions = cognitiveService.getGameSessions(userId);

      return {
        user: { id: userId, name: targetUser.name, age: targetUser.age, email: targetUser.email },
        profile: p,
        sessions,
        recommendation: {
          weakArea: 'attention',
          recommendedActivity: '3D Focus Search 🎯',
          difficulty: 'Medium',
          reason: 'Groq Llama-3 AI & Scikit-Learn Model telemetry observation.'
        },
        garden: getStoredGarden(userId),
        aiObservation: p.assessed
          ? `Attention score (${p.attentionScore || 0}/100) indicates focus exercise is recommended while memory recall (${p.memoryScore || 0}/100) remains tracked.`
          : 'Patient has not yet completed the initial cognitive baseline assessment.'
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
      const uId = userId || 'user_default';
      const saved = localStorage.getItem(`memomate_gamification_${uId}`);
      const savedXp = localStorage.getItem(`memomate_xp_${uId}`);
      const savedGems = localStorage.getItem(`memomate_gems_${uId}`);
      const savedStreak = localStorage.getItem(`memomate_streak_${uId}`);

      const xp = savedXp !== null ? Number(savedXp) : 0;
      const gems = savedGems !== null ? Number(savedGems) : 10;
      const streak = savedStreak !== null ? Number(savedStreak) : 0;

      let baseObj = saved ? JSON.parse(saved) : {};
      return {
        ...baseObj,
        userId: uId,
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
      const accounts = getAccountsDB();
      const currentUserStr = localStorage.getItem('memomate_user');
      const currentUser = currentUserStr ? JSON.parse(currentUserStr) : null;

      return accounts.map((acc, index) => {
        const uId = acc.id || acc._id;
        const savedXp = Number(localStorage.getItem(`memomate_xp_${uId}`)) || 0;
        const savedStreak = Number(localStorage.getItem(`memomate_streak_${uId}`)) || 0;

        return {
          rank: index + 1,
          userId: uId,
          name: acc.name,
          age: acc.age || 68,
          xpPoints: savedXp,
          currentStreak: savedStreak,
          league: 'Emerald League',
          avatar: acc.role === 'caregiver' ? '🩺' : '🌸',
          isCurrentUser: currentUser?.id === uId
        };
      }).sort((a, b) => b.xpPoints - a.xpPoints).map((item, idx) => ({ ...item, rank: idx + 1 }));
    }
  }
};

export default api;
