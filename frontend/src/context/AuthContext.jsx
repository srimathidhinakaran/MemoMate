import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI, cognitiveAPI, recommendationAPI, gardenAPI } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('memomate_user');
    return saved ? JSON.parse(saved) : {
      id: 'elderly_meena_68',
      _id: 'elderly_meena_68',
      name: 'Meena',
      age: 68,
      email: 'meena@example.com',
      role: 'elderly'
    };
  });

  const [token, setToken] = useState(() => localStorage.getItem('memomate_token') || 'demo_token');
  const [loading, setLoading] = useState(false);
  
  // Accessibility Font Size state: 'font-normal' | 'font-large' | 'font-xlarge'
  const [fontSize, setFontSize] = useState(() => localStorage.getItem('memomate_fontsize') || 'font-normal');
  
  // Audio / Voice Assistance toggle
  const [voiceAssistance, setVoiceAssistance] = useState(false);

  // Gamification XP & Level State
  const [xpPoints, setXpPoints] = useState(() => Number(localStorage.getItem('memomate_xp')) || 850);
  const [recentScoreToast, setRecentScoreToast] = useState(null);

  // Global Cognitive State (Loaded from localStorage if updated!)
  const [profile, setProfile] = useState(() => {
    const savedProf = localStorage.getItem('memomate_profile');
    return savedProf ? JSON.parse(savedProf) : {
      memoryScore: 82,
      attentionScore: 64,
      recallScore: 76,
      reactionScore: 71,
      overallScore: 73
    };
  });

  const [recommendation, setRecommendation] = useState(() => {
    const savedRec = localStorage.getItem('memomate_recommendation');
    return savedRec ? JSON.parse(savedRec) : {
      weakArea: 'attention',
      recommendedActivity: '3D Focus Search 🎯',
      difficulty: 'Medium',
      reason: 'Your recent attention score is lower compared with your other measured cognitive areas. We recommend starting a 3D Focus Search.'
    };
  });

  const [garden, setGarden] = useState(() => {
    const savedGdn = localStorage.getItem('memomate_garden');
    return savedGdn ? JSON.parse(savedGdn) : {
      plants: 3,
      flowers: 5,
      trees: 2,
      streak: 4,
      totalActivities: 8
    };
  });

  const level = Math.floor(xpPoints / 300) + 1;
  const levelTitle = level === 1 ? 'Garden Seedling 🌱' : (level === 2 ? 'Memory Explorer 🌸' : (level === 3 ? 'Focus Master 🌳' : 'Cognitive Champion 👑'));

  useEffect(() => {
    document.documentElement.className = fontSize;
    localStorage.setItem('memomate_fontsize', fontSize);
  }, [fontSize]);

  useEffect(() => {
    if (user && user.role === 'elderly') {
      const userId = user.id || user._id;
      cognitiveAPI.getProfile(userId).then((res) => {
        if (res) {
          setProfile(res);
          localStorage.setItem('memomate_profile', JSON.stringify(res));
        }
      });
      recommendationAPI.getLatest(userId).then((res) => {
        if (res) {
          setRecommendation(res);
          localStorage.setItem('memomate_recommendation', JSON.stringify(res));
        }
      });
      gardenAPI.getGarden(userId).then((res) => {
        if (res) {
          setGarden(res);
          localStorage.setItem('memomate_garden', JSON.stringify(res));
        }
      });
    }
  }, [user]);

  const login = async (credentials) => {
    setLoading(true);
    try {
      const data = await authAPI.login(credentials);
      setUser(data.user);
      setToken(data.token);
      localStorage.setItem('memomate_token', data.token);
      localStorage.setItem('memomate_user', JSON.stringify(data.user));
      return data;
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    setLoading(true);
    try {
      const data = await authAPI.register(userData);
      setUser(data.user);
      setToken(data.token);
      localStorage.setItem('memomate_token', data.token);
      localStorage.setItem('memomate_user', JSON.stringify(data.user));
      return data;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('memomate_token');
    localStorage.removeItem('memomate_user');
    localStorage.removeItem('memomate_profile');
    localStorage.removeItem('memomate_recommendation');
    localStorage.removeItem('memomate_garden');
  };

  const updateStateFromSession = (sessionResult) => {
    if (sessionResult.profile) {
      setProfile(sessionResult.profile);
      localStorage.setItem('memomate_profile', JSON.stringify(sessionResult.profile));
    }
    if (sessionResult.recommendation) {
      setRecommendation(sessionResult.recommendation);
      localStorage.setItem('memomate_recommendation', JSON.stringify(sessionResult.recommendation));
    }
    if (sessionResult.garden) {
      setGarden(sessionResult.garden);
      localStorage.setItem('memomate_garden', JSON.stringify(sessionResult.garden));
    }

    // Dynamic XP Calculation
    const earnedScore = sessionResult.session?.score || 85;
    const gainedXp = Math.round(earnedScore * 1.5);
    const newXp = xpPoints + gainedXp;
    setXpPoints(newXp);
    localStorage.setItem('memomate_xp', newXp);

    // Toast alert for dynamic score update
    setRecentScoreToast({
      activity: sessionResult.session?.activity || 'Cognitive Game',
      score: earnedScore,
      xp: gainedXp
    });

    setTimeout(() => setRecentScoreToast(null), 5000);
  };

  const speakText = (text) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;
      utterance.pitch = 1.0;
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      token,
      loading,
      login,
      register,
      logout,
      fontSize,
      setFontSize,
      voiceAssistance,
      setVoiceAssistance,
      speakText,
      profile,
      setProfile,
      recommendation,
      setRecommendation,
      garden,
      setGarden,
      updateStateFromSession,
      xpPoints,
      level,
      levelTitle,
      recentScoreToast
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
