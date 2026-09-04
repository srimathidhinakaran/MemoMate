import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI, cognitiveAPI, recommendationAPI, gardenAPI } from '../services/api';

import { NER_TRANSLATIONS } from '../utils/nerLanguages';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  // Initialize user strictly from localStorage (purge old mock tokens)
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('memomate_user');
    const savedToken = localStorage.getItem('memomate_token');
    if (!savedToken || savedToken.startsWith('mock_jwt_token')) {
      localStorage.removeItem('memomate_user');
      localStorage.removeItem('memomate_token');
      return null;
    }
    return saved ? JSON.parse(saved) : null;
  });

  const [token, setToken] = useState(() => {
    const savedToken = localStorage.getItem('memomate_token');
    if (savedToken && savedToken.startsWith('mock_jwt_token')) return null;
    return savedToken || null;
  });
  const [loading, setLoading] = useState(false);
  
  // Accessibility Font Size state: 'font-normal' | 'font-large' | 'font-xlarge'
  const [fontSize, setFontSize] = useState(() => localStorage.getItem('memomate_fontsize') || 'font-normal');
  
  // Audio / Voice Assistance toggle
  const [voiceAssistance, setVoiceAssistance] = useState(false);

  // NER Language state: 'en' | 'as' | 'bn' | 'mni' | 'kha' | 'hi'
  const [language, setLanguage] = useState(() => localStorage.getItem('memomate_language') || 'en');

  const updateLanguage = (langCode) => {
    setLanguage(langCode);
    localStorage.setItem('memomate_language', langCode);
  };

  const t = (key) => {
    const dict = NER_TRANSLATIONS[language] || NER_TRANSLATIONS.en;
    return dict[key] || NER_TRANSLATIONS.en[key] || key;
  };

  // Dynamic Today Streak Engine relative to real-time Date
  const todayStr = new Date().toDateString();
  const lastCheckin = localStorage.getItem('memomate_last_checkin_date');

  const [streak, setStreak] = useState(() => {
    const savedStreak = Number(localStorage.getItem('memomate_streak'));
    if (!savedStreak) return 1;
    
    if (lastCheckin) {
      const lastDate = new Date(lastCheckin);
      const todayDate = new Date();
      const diffTime = Math.abs(todayDate - lastDate);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      // If missed more than 1 day, reset streak to 1
      if (diffDays > 2) return 1;
    }
    return savedStreak;
  });

  const [highestStreak, setHighestStreak] = useState(() => Number(localStorage.getItem('memomate_highest_streak')) || streak);
  const [streakFreeze, setStreakFreeze] = useState(true);

  // Currency & Gamification XP & Gems (Start at 0 XP for dynamic progression)
  const [xpPoints, setXpPoints] = useState(() => {
    const saved = localStorage.getItem('memomate_xp');
    return saved !== null ? Number(saved) : 0;
  });
  
  const [gems, setGems] = useState(() => {
    const saved = localStorage.getItem('memomate_gems');
    return saved !== null ? Number(saved) : 10;
  });

  const [league, setLeague] = useState('Emerald League');
  const [unlockedItems, setUnlockedItems] = useState(() => {
    const saved = localStorage.getItem('memomate_unlocked_items');
    return saved ? JSON.parse(saved) : ['golden_sunflower'];
  });

  const [dailyQuests, setDailyQuests] = useState([
    { id: 'quest_1', title: 'Complete 2 Cognitive Missions', target: 2, current: 0, rewardXp: 50, rewardGems: 15, completed: false },
    { id: 'quest_2', title: 'Score over 80 in 3D Focus', target: 1, current: 0, rewardXp: 75, rewardGems: 25, completed: false },
    { id: 'quest_3', title: 'Maintain your Daily Workout Streak', target: 1, current: 1, rewardXp: 40, rewardGems: 10, completed: true }
  ]);
  
  const [recentScoreToast, setRecentScoreToast] = useState(null);
  const [activeRewardModal, setActiveRewardModal] = useState(null);

  // Global Cognitive State
  const [profile, setProfile] = useState(() => {
    const savedProf = localStorage.getItem('memomate_profile');
    return savedProf ? JSON.parse(savedProf) : {
      memoryScore: 78,
      attentionScore: 68,
      recallScore: 74,
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
      plants: 1,
      flowers: 2,
      trees: 1,
      streak: streak,
      totalActivities: 1
    };
  });

  const level = Math.floor(xpPoints / 300) + 1;
  const levelTitle = level === 1 ? 'Cognitive Novice 🌱' : (level === 2 ? 'Memory Explorer 🌸' : (level === 3 ? 'Focus Master 🌳' : (level === 4 ? 'Mind Master ⚡' : 'Cognitive Legend 👑')));

  useEffect(() => {
    document.documentElement.className = fontSize;
    localStorage.setItem('memomate_fontsize', fontSize);
  }, [fontSize]);

  useEffect(() => {
    const checkAuth = async () => {
      const savedToken = localStorage.getItem('memomate_token');
      if (savedToken) {
        if (savedToken.startsWith('mock_jwt_token')) {
          logout();
          return;
        }
        try {
          const me = await authAPI.getMe();
          if (me) {
            setUser(me);
            localStorage.setItem('memomate_user', JSON.stringify(me));
          } else {
            logout();
          }
        } catch (err) {
          logout();
        }
      } else {
        setUser(null);
      }
    };
    checkAuth();
  }, []);

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
      // Reset XP to 0 for fresh account
      setXpPoints(0);
      setGems(10);
      localStorage.setItem('memomate_xp', '0');
      localStorage.setItem('memomate_gems', '10');
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

    // Dynamic XP & Gems Calculation
    const earnedScore = sessionResult.session?.score || 85;
    const streakBonusMultiplier = streak >= 5 ? 1.25 : 1.0;
    const gainedXp = Math.round(earnedScore * 1.5 * streakBonusMultiplier);
    const gainedGems = Math.round(earnedScore * 0.25);
    
    const newXp = xpPoints + gainedXp;
    const newGems = gems + gainedGems;
    
    const oldLevel = Math.floor(xpPoints / 300) + 1;
    const newLevel = Math.floor(newXp / 300) + 1;

    setXpPoints(newXp);
    setGems(newGems);
    localStorage.setItem('memomate_xp', newXp);
    localStorage.setItem('memomate_gems', newGems);

    // Update streak for today
    if (lastCheckin !== todayStr) {
      const newStreak = streak + 1;
      setStreak(newStreak);
      if (newStreak > highestStreak) setHighestStreak(newStreak);
      localStorage.setItem('memomate_streak', newStreak);
      localStorage.setItem('memomate_last_checkin_date', todayStr);
      localStorage.setItem('memomate_highest_streak', Math.max(newStreak, highestStreak));
    }

    // Level-up celebratory trigger
    if (newLevel > oldLevel) {
      setActiveRewardModal({
        title: `Level Up! Level ${newLevel}`,
        desc: `Congratulations! You reached Level ${newLevel} (${levelTitle}). You unlocked new Memory Garden shop perks!`,
        icon: '👑',
        xp: gainedXp,
        gems: 50
      });
    }

    setRecentScoreToast({
      activity: sessionResult.session?.activity || 'Cognitive Game',
      score: earnedScore,
      xp: gainedXp
    });

    setTimeout(() => setRecentScoreToast(null), 5000);
  };

  const completeDailyStreakCheckin = () => {
    if (lastCheckin === todayStr) {
      alert("You have already checked in for today! 🔥 Keep playing exercises to earn XP.");
      return;
    }

    const newStreak = streak + 1;
    const newGems = gems + 25;
    setStreak(newStreak);
    setGems(newGems);
    if (newStreak > highestStreak) setHighestStreak(newStreak);
    
    localStorage.setItem('memomate_streak', newStreak);
    localStorage.setItem('memomate_gems', newGems);
    localStorage.setItem('memomate_last_checkin_date', todayStr);
    localStorage.setItem('memomate_highest_streak', Math.max(newStreak, highestStreak));

    setActiveRewardModal({
      title: 'Daily Streak Checked In! 🔥',
      desc: `You maintained a ${newStreak}-day workout streak for today! Your 1.25x XP multiplier is active.`,
      icon: '🔥',
      xp: 50,
      gems: 25
    });
  };

  const buyShopItem = (itemId, cost) => {
    if (gems >= cost && !unlockedItems.includes(itemId)) {
      const newGems = gems - cost;
      const updatedItems = [...unlockedItems, itemId];
      setGems(newGems);
      setUnlockedItems(updatedItems);
      localStorage.setItem('memomate_gems', newGems);
      localStorage.setItem('memomate_unlocked_items', JSON.stringify(updatedItems));

      setActiveRewardModal({
        title: 'Item Unlocked! 🛡️',
        desc: `You unlocked ${itemId.replace('_', ' ')} in your account!`,
        icon: '🎁',
        xp: 30,
        gems: 0
      });
    }
  };

  const claimQuestReward = (questId) => {
    setDailyQuests((prev) =>
      prev.map((q) => {
        if (q.id === questId && !q.completed) {
          const newXp = xpPoints + q.rewardXp;
          const newGems = gems + q.rewardGems;
          setXpPoints(newXp);
          setGems(newGems);
          localStorage.setItem('memomate_xp', newXp);
          localStorage.setItem('memomate_gems', newGems);
          return { ...q, completed: true, current: q.target };
        }
        return q;
      })
    );
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
      language,
      updateLanguage,
      t,
      profile,
      setProfile,
      recommendation,
      setRecommendation,
      garden,
      setGarden,
      updateStateFromSession,
      xpPoints,
      gems,
      streak,
      highestStreak,
      todayStr,
      lastCheckin,
      streakFreeze,
      league,
      unlockedItems,
      dailyQuests,
      level,
      levelTitle,
      recentScoreToast,
      activeRewardModal,
      setActiveRewardModal,
      completeDailyStreakCheckin,
      buyShopItem,
      claimQuestReward
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
