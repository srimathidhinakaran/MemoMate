import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI, cognitiveAPI, recommendationAPI, gardenAPI, gamificationAPI } from '../services/api';
import { NER_TRANSLATIONS } from '../utils/nerLanguages';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  // Initialize user persistently from localStorage
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('memomate_user');
    if (!saved) return null;
    try {
      return JSON.parse(saved);
    } catch (e) {
      return null;
    }
  });

  const [token, setToken] = useState(() => {
    let savedToken = localStorage.getItem('memomate_token');
    if (!savedToken && localStorage.getItem('memomate_user')) {
      savedToken = 'session_token_' + Date.now();
      localStorage.setItem('memomate_token', savedToken);
    }
    return savedToken || null;
  });
  const [loading, setLoading] = useState(false);
  
  // Theme state: 'theme-healthcare' | 'theme-fire-pro' | 'theme-high-contrast' | 'theme-daylight'
  const [theme, setTheme] = useState(() => localStorage.getItem('memomate_theme') || 'theme-healthcare');

  // Accessibility Font Size state: 'font-normal' | 'font-large' | 'font-xlarge'
  const [fontSize, setFontSize] = useState(() => localStorage.getItem('memomate_fontsize') || 'font-normal');
  
  // Audio / Voice Assistance toggle & Voice Modal state
  const [voiceAssistance, setVoiceAssistance] = useState(false);
  const [isVoiceModalOpen, setVoiceModalOpen] = useState(false);

  // Network Offline / Online status
  const [networkStatus, setNetworkStatus] = useState(() => navigator.onLine ? 'ONLINE' : 'OFFLINE');

  // Language state: defaults to 'en'
  const [language, setLanguage] = useState(() => localStorage.getItem('memomate_language') || 'en');

  // Family Members state
  const [familyMembers, setFamilyMembers] = useState(() => {
    const saved = localStorage.getItem('memomate_family_members');
    return saved ? JSON.parse(saved) : [
      { id: 'fam_1', name: 'Meena', relation: 'Daughter', visitSchedule: 'Every evening at 5:00 PM', notes: 'Loves drinking afternoon tea together and talking about family memories', photoUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&auto=format&fit=crop' },
      { id: 'fam_2', name: 'Rahul', relation: 'Son', visitSchedule: 'Sunday mornings', notes: 'Engineers in Guwahati, calls every Sunday at 10:00 AM', photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop' },
      { id: 'fam_3', name: 'Ankit', relation: 'Grandson', visitSchedule: 'Weekend afternoons', notes: 'Loves listening to stories about Bihu festivals and school stories', photoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop' },
      { id: 'fam_4', name: 'Dr. Sarma', relation: 'Family Doctor', visitSchedule: 'Bi-weekly checkups', notes: 'Family physician for over 15 years', photoUrl: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=400&auto=format&fit=crop' }
    ];
  });

  // Reminders Schedule state
  const [reminders, setReminders] = useState(() => {
    const saved = localStorage.getItem('memomate_reminders');
    return saved ? JSON.parse(saved) : [
      { id: 'rem_1', time: '08:00 AM', title: 'Hydration Reminder', category: 'hydration', detail: 'Drink 1 full glass of water', status: 'completed' },
      { id: 'rem_2', time: '09:00 AM', title: 'Cognitive Memory Session', category: 'cognitive', detail: '3D Memory & Spatial Match', status: 'pending' },
      { id: 'rem_3', time: '12:30 PM', title: 'Afternoon Medication', category: 'medicine', detail: 'Blood Pressure & Multivitamin', status: 'pending' },
      { id: 'rem_4', time: '02:00 PM', title: 'Hydration Check', category: 'hydration', detail: 'Drink 1 glass of fresh water', status: 'pending' },
      { id: 'rem_5', time: '05:00 PM', title: 'Evening Garden Walk', category: 'activity', detail: 'Walk in garden with Meena', status: 'pending' },
      { id: 'rem_6', time: 'Tomorrow 10:00 AM', title: 'Doctor Appointment', category: 'appointment', detail: 'Dr. Barua Regular Checkup', status: 'pending' }
    ];
  });

  // Caregiver Alerts state
  const [caregiverAlerts, setCaregiverAlerts] = useState(() => {
    const saved = localStorage.getItem('memomate_caregiver_alerts');
    return saved ? JSON.parse(saved) : [
      { id: 'alt_1', severity: 'ATTENTION', title: 'Attention Score Trend Alert', message: 'Attention score decreased across 3 consecutive sessions. Recommended focus exercise scheduled.', time: 'Today 9:15 AM', acknowledged: false },
      { id: 'alt_2', severity: 'WATCH', title: 'Hydration Reminder Pending', message: 'Afternoon hydration reminder pending confirmation.', time: 'Today 2:30 PM', acknowledged: false },
      { id: 'alt_3', severity: 'INFO', title: 'Memory Improvement', message: 'Memory index improved by 8% this week.', time: 'Yesterday', acknowledged: true }
    ];
  });

  useEffect(() => {
    document.documentElement.className = `${fontSize} ${theme}`;
    localStorage.setItem('memomate_theme', theme);
  }, [theme, fontSize]);

  useEffect(() => {
    const handleOnline = () => setNetworkStatus('ONLINE');
    const handleOffline = () => setNetworkStatus('OFFLINE');
    const handleSyncStatus = (e) => setNetworkStatus(e.detail || 'ONLINE');

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    window.addEventListener('memomate_sync_status', handleSyncStatus);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('memomate_sync_status', handleSyncStatus);
    };
  }, []);

  const updateTheme = (newTheme) => {
    setTheme(newTheme);
    localStorage.setItem('memomate_theme', newTheme);
  };

  const updateLanguage = (langCode) => {
    setLanguage(langCode);
    localStorage.setItem('memomate_language', langCode);
  };

  const toggleReminderStatus = (reminderId) => {
    setReminders((prev) => {
      const updated = prev.map((r) => r.id === reminderId ? { ...r, status: r.status === 'completed' ? 'pending' : 'completed' } : r);
      localStorage.setItem('memomate_reminders', JSON.stringify(updated));
      return updated;
    });
  };

  const addReminder = (newRem) => {
    setReminders((prev) => {
      const updated = [...prev, { ...newRem, id: 'rem_' + Date.now(), status: 'pending' }];
      localStorage.setItem('memomate_reminders', JSON.stringify(updated));
      return updated;
    });
  };

  const addFamilyMember = (newFam) => {
    setFamilyMembers((prev) => {
      const updated = [...prev, { ...newFam, id: 'fam_' + Date.now() }];
      localStorage.setItem('memomate_family_members', JSON.stringify(updated));
      return updated;
    });
  };

  const acknowledgeAlert = (alertId) => {
    setCaregiverAlerts((prev) => {
      const updated = prev.map((a) => a.id === alertId ? { ...a, acknowledged: true } : a);
      localStorage.setItem('memomate_caregiver_alerts', JSON.stringify(updated));
      return updated;
    });
  };

  const t = (key) => {
    const dict = NER_TRANSLATIONS[language] || NER_TRANSLATIONS.en;
    return dict[key] || NER_TRANSLATIONS.en[key] || key;
  };

  // Duolingo-Style Dynamic Streak Engine (Initial Streak = 0)
  const todayStr = new Date().toISOString().split('T')[0];
  const lastCheckin = localStorage.getItem('memomate_last_checkin_date');

  const [streak, setStreak] = useState(() => {
    const savedStreak = localStorage.getItem('memomate_streak');
    if (savedStreak === null) return 0; // Default to 0 initially
    const val = Number(savedStreak);
    
    if (lastCheckin) {
      const lastDate = new Date(lastCheckin);
      const todayDate = new Date(todayStr);
      const diffTime = todayDate - lastDate;
      const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));
      
      // If missed more than 1 day, reset streak to 0
      if (diffDays > 1) return 0;
    }
    return val;
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
    return saved ? JSON.parse(saved) : ['cyber_crystal'];
  });

  const [dailyQuests, setDailyQuests] = useState([
    { id: 'quest_1', title: 'Complete 2 Cognitive Missions', target: 2, current: 0, rewardXp: 50, rewardGems: 15, completed: false },
    { id: 'quest_2', title: 'Score over 80 in Focus Reflex', target: 1, current: 0, rewardXp: 75, rewardGems: 25, completed: false },
    { id: 'quest_3', title: 'Maintain your Daily Workout Streak', target: 1, current: streak > 0 ? 1 : 0, rewardXp: 40, rewardGems: 10, completed: streak > 0 }
  ]);
  
  const [recentScoreToast, setRecentScoreToast] = useState(null);
  const [activeRewardModal, setActiveRewardModal] = useState(null);

  // Dedicated External Gamification App URL
  const [externalGamificationUrl, setExternalGamificationUrl] = useState(() => {
    return localStorage.getItem('memomate_external_gamification_url') || 'https://memomate-gamification.vercel.app';
  });

  const updateExternalGamificationUrl = (url) => {
    setExternalGamificationUrl(url);
    localStorage.setItem('memomate_external_gamification_url', url);
  };

  // Global Cognitive Performance State
  const [profile, setProfile] = useState(() => {
    const savedProf = localStorage.getItem('memomate_profile');
    return savedProf ? JSON.parse(savedProf) : {
      memoryScore: 70,
      attentionScore: 70,
      recallScore: 70,
      reactionScore: 70,
      overallScore: 70
    };
  });

  const [recommendation, setRecommendation] = useState(() => {
    const savedRec = localStorage.getItem('memomate_recommendation');
    return savedRec ? JSON.parse(savedRec) : {
      weakArea: 'attention',
      recommendedActivity: '3D Focus Search 🎯',
      difficulty: 'Medium',
      reason: 'Complete focus training to evaluate your attention performance metrics.'
    };
  });

  const [garden, setGarden] = useState(() => {
    const savedGdn = localStorage.getItem('memomate_garden');
    return savedGdn ? JSON.parse(savedGdn) : {
      plants: 1,
      flowers: 1,
      trees: 0,
      streak: streak,
      totalActivities: 0
    };
  });

  const level = Math.floor(xpPoints / 300) + 1;
  const levelTitle = level === 1 ? 'Cognitive Initiate ⚡' : (level === 2 ? 'Focus Explorer 🛡️' : (level === 3 ? 'Memory Master 🧠' : (level === 4 ? 'Mind Legend 👑' : 'Grandmaster Supreme 🌌')));

  useEffect(() => {
    document.documentElement.className = fontSize;
    localStorage.setItem('memomate_fontsize', fontSize);
  }, [fontSize]);

  useEffect(() => {
    const checkAuth = async () => {
      const savedToken = localStorage.getItem('memomate_token');
      const savedUserStr = localStorage.getItem('memomate_user');
      
      if (savedToken) {
        try {
          const me = await authAPI.getMe();
          if (me) {
            setUser(me);
            localStorage.setItem('memomate_user', JSON.stringify(me));
          } else if (savedUserStr) {
            setUser(JSON.parse(savedUserStr));
          }
        } catch (err) {
          if (savedUserStr) {
            try {
              setUser(JSON.parse(savedUserStr));
            } catch (e) {}
          }
        }
      } else if (savedUserStr) {
        try {
          setUser(JSON.parse(savedUserStr));
        } catch (e) {}
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
      gamificationAPI.getGamification(userId).then((res) => {
        if (res) {
          if (res.currentStreak !== undefined) {
            setStreak((prev) => {
              const maxS = Math.max(prev, res.currentStreak);
              localStorage.setItem('memomate_streak', maxS);
              return maxS;
            });
          }
          if (res.xpPoints !== undefined) {
            setXpPoints((prev) => {
              const maxXp = Math.max(prev, res.xpPoints);
              localStorage.setItem('memomate_xp', maxXp);
              return maxXp;
            });
          }
          if (res.gems !== undefined) {
            setGems((prev) => {
              const maxGems = Math.max(prev, res.gems);
              localStorage.setItem('memomate_gems', maxGems);
              return maxGems;
            });
          }
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
      // Reset XP to 0 & streak to 0 for brand new account
      setXpPoints(0);
      setGems(10);
      setStreak(0);
      setHighestStreak(0);
      localStorage.setItem('memomate_xp', '0');
      localStorage.setItem('memomate_gems', '10');
      localStorage.setItem('memomate_streak', '0');
      localStorage.setItem('memomate_highest_streak', '0');
      localStorage.setItem('memomate_gamification', JSON.stringify({ xpPoints: 0, gems: 10, currentStreak: 0 }));
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
    localStorage.removeItem('memomate_xp');
    localStorage.removeItem('memomate_gems');
    localStorage.removeItem('memomate_streak');
    localStorage.removeItem('memomate_gamification');
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

    // Dynamic Duolingo Streak Logic
    let newStreak = streak;
    if (sessionResult.gamification?.currentStreak !== undefined) {
      newStreak = sessionResult.gamification.currentStreak;
    } else if (lastCheckin !== todayStr) {
      if (streak === 0) {
        newStreak = 1;
      } else {
        const lastDate = new Date(lastCheckin);
        const todayDate = new Date(todayStr);
        const diffDays = Math.round((todayDate - lastDate) / (1000 * 60 * 60 * 24));
        if (diffDays === 1) {
          newStreak = streak + 1;
        } else {
          newStreak = 1;
        }
      }
    }
    setStreak(newStreak);
    const h = Math.max(newStreak, highestStreak);
    setHighestStreak(h);
    localStorage.setItem('memomate_streak', newStreak);
    localStorage.setItem('memomate_last_checkin_date', todayStr);
    localStorage.setItem('memomate_highest_streak', h);

    // Dynamic XP & Gems Calculation
    const earnedScore = sessionResult.session?.score || 85;
    const streakBonusMultiplier = newStreak >= 3 ? 1.25 : 1.0;
    const gainedXp = Math.round(earnedScore * 1.5 * streakBonusMultiplier);
    const gainedGems = Math.round(earnedScore * 0.25);

    let newXp = xpPoints + gainedXp;
    let newGems = gems + gainedGems;

    if (sessionResult.gamification) {
      if (sessionResult.gamification.xpPoints !== undefined) {
        newXp = Math.max(newXp, sessionResult.gamification.xpPoints);
      }
      if (sessionResult.gamification.gems !== undefined) {
        newGems = Math.max(newGems, sessionResult.gamification.gems);
      }
    }

    const oldLevel = Math.floor(xpPoints / 300) + 1;
    const newLevel = Math.floor(newXp / 300) + 1;

    setXpPoints(newXp);
    setGems(newGems);
    localStorage.setItem('memomate_xp', newXp);
    localStorage.setItem('memomate_gems', newGems);

    // Persist full gamification object to local storage
    const gamObj = {
      xpPoints: newXp,
      gems: newGems,
      level: newLevel,
      currentStreak: newStreak,
      highestStreak: h
    };
    localStorage.setItem('memomate_gamification', JSON.stringify(gamObj));

    // Update quests
    setDailyQuests((prev) =>
      prev.map((q) => {
        if (q.id === 'quest_1') {
          const c = Math.min(q.target, q.current + 1);
          return { ...q, current: c, completed: c >= q.target };
        }
        if (q.id === 'quest_2' && earnedScore >= 80) {
          return { ...q, current: 1, completed: true };
        }
        if (q.id === 'quest_3' && newStreak > 0) {
          return { ...q, current: 1, completed: true };
        }
        return q;
      })
    );

    // Level-up celebratory trigger
    if (newLevel > oldLevel) {
      setActiveRewardModal({
        title: `Level Up! Level ${newLevel}`,
        desc: `Congratulations! You reached Level ${newLevel} (${levelTitle}). You unlocked new Mind Matrix relics!`,
        icon: '⚡',
        xp: gainedXp,
        gems: 50
      });
    }

    setRecentScoreToast({
      activity: sessionResult.session?.activity || 'Cognitive Mission',
      score: earnedScore,
      xp: gainedXp
    });

    setTimeout(() => setRecentScoreToast(null), 4000);
  };

  const completeDailyStreakCheckin = () => {
    if (lastCheckin === todayStr && streak > 0) {
      alert("You have already completed your exercise for today! 🔥 Keep playing to earn XP.");
      return;
    }

    const newStreak = streak === 0 ? 1 : streak + 1;
    const newGems = gems + 25;
    setStreak(newStreak);
    setGems(newGems);
    if (newStreak > highestStreak) setHighestStreak(newStreak);
    
    localStorage.setItem('memomate_streak', newStreak);
    localStorage.setItem('memomate_gems', newGems);
    localStorage.setItem('memomate_last_checkin_date', todayStr);
    localStorage.setItem('memomate_highest_streak', Math.max(newStreak, highestStreak));

    setActiveRewardModal({
      title: 'Daily Streak Active! 🔥',
      desc: `You maintained a ${newStreak}-day workout streak for today!`,
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
        title: 'Cognitive Relic Unlocked! 🛡️',
        desc: `You unlocked ${itemId.replace('_', ' ').toUpperCase()} in your profile!`,
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
      utterance.rate = 0.95;
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
      theme,
      updateTheme,
      fontSize,
      setFontSize,
      voiceAssistance,
      setVoiceAssistance,
      isVoiceModalOpen,
      setVoiceModalOpen,
      networkStatus,
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
      familyMembers,
      addFamilyMember,
      reminders,
      toggleReminderStatus,
      addReminder,
      caregiverAlerts,
      acknowledgeAlert,
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
      externalGamificationUrl,
      updateExternalGamificationUrl,
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
