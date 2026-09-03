import React from 'react';
import { useAuth } from '../context/AuthContext';
import { soundFx } from '../utils/soundEffects';
import { Gem, Sparkles, ShoppingBag, Check, ShieldCheck, Trees, Sprout, Cpu, Crown, Lock } from 'lucide-react';

const RewardShopCard = () => {
  const { gems, unlockedItems, buyShopItem } = useAuth();

  const shopItems = [
    {
      id: 'golden_sunflower',
      title: 'Cyber Golden Sunflower',
      desc: 'Unlocks dynamic glowing 3D golden sunflowers in your interactive Memory Garden.',
      cost: 50,
      icon: Sprout,
      category: '3D Garden Asset'
    },
    {
      id: 'ai_llama_booster',
      title: 'Groq Llama-3 AI Crystal',
      desc: 'Boosts cognitive analysis precision with instant Groq neural telemetry.',
      cost: 80,
      icon: Cpu,
      category: 'AI Telemetry Power-Up'
    },
    {
      id: 'streak_freeze',
      title: 'Streak Freeze Shield',
      desc: 'Protects your daily workout streak for 1 day if a session is missed.',
      cost: 40,
      icon: ShieldCheck,
      category: 'Battle Shield'
    },
    {
      id: 'heroic_crest',
      title: 'Heroic Memory Crest',
      desc: 'Displays legendary Heroic golden rank aura on profile & global leaderboard.',
      cost: 120,
      icon: Crown,
      category: 'Profile Cosmetic'
    }
  ];

  const handlePurchase = (item) => {
    if (gems >= item.cost) {
      soundFx.playQuestClaim();
      if (buyShopItem) {
        buyShopItem(item.id, item.cost);
      }
    } else {
      soundFx.playClick();
    }
  };

  return (
    <div className="garden-card animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{
            width: 44,
            height: 44,
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #00F2FE 0%, #FFD700 100%)',
            display: 'flex',
            alignItems: 'center',
            justify: 'center',
            boxShadow: '0 0 15px rgba(0, 242, 254, 0.4)'
          }}>
            <ShoppingBag size={24} color="#050B14" />
          </div>
          <div>
            <h3 style={{ fontSize: '1.25rem', color: '#F8FAFC', fontWeight: 900, margin: 0, fontFamily: 'var(--font-heading)' }}>
              ARMORY & BATTLE STORE
            </h3>
            <div style={{ fontSize: '0.8rem', color: '#94A3B8', fontWeight: 700 }}>
              REDEEM BATTLE GEMS FOR 3D GARDEN ASSETS & POWER-UPS
            </div>
          </div>
        </div>

        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.4rem',
          backgroundColor: 'rgba(0, 242, 254, 0.12)',
          padding: '0.45rem 0.95rem',
          borderRadius: '10px',
          border: '1px solid rgba(0, 242, 254, 0.4)',
          fontWeight: 800,
          fontFamily: 'var(--font-esports)',
          color: '#00F2FE',
          fontSize: '0.9rem',
          boxShadow: '0 0 12px rgba(0, 242, 254, 0.2)'
        }}>
          <Gem size={16} fill="#00F2FE" />
          <span>{gems || 140} GEMS</span>
        </div>
      </div>

      {/* Shop Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1rem' }}>
        {shopItems.map((item) => {
          const isUnlocked = unlockedItems?.includes(item.id);
          const Icon = item.icon;

          return (
            <div
              key={item.id}
              style={{
                backgroundColor: isUnlocked ? 'rgba(255, 255, 255, 0.02)' : 'rgba(255, 255, 255, 0.05)',
                border: isUnlocked ? '1px solid rgba(0, 230, 118, 0.3)' : '1px solid rgba(0, 242, 254, 0.2)',
                borderRadius: '16px',
                padding: '1.1rem',
                display: 'flex',
                flexDirection: 'column',
                justify: 'space-between',
                gap: '0.85rem',
                transition: 'all 0.25s ease'
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <span className="badge badge-cyan" style={{ fontSize: '0.7rem' }}>
                    {item.category}
                  </span>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.3rem',
                    fontWeight: 800,
                    fontFamily: 'var(--font-esports)',
                    color: '#00F2FE',
                    fontSize: '0.9rem'
                  }}>
                    <Gem size={14} fill="#00F2FE" />
                    <span>{item.cost}</span>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', margin: '0.3rem 0' }}>
                  <Icon size={20} color="#FFD700" />
                  <h4 style={{ fontSize: '1.05rem', color: '#F8FAFC', fontWeight: 800, margin: 0 }}>
                    {item.title}
                  </h4>
                </div>

                <p style={{ fontSize: '0.82rem', color: '#94A3B8', lineHeight: 1.4, margin: 0 }}>
                  {item.desc}
                </p>
              </div>

              {isUnlocked ? (
                <div style={{
                  backgroundColor: 'rgba(0, 230, 118, 0.15)',
                  color: '#00E676',
                  border: '1px solid rgba(0, 230, 118, 0.4)',
                  padding: '0.5rem',
                  borderRadius: '10px',
                  fontWeight: 800,
                  fontFamily: 'var(--font-esports)',
                  fontSize: '0.8rem',
                  textAlign: 'center',
                  display: 'flex',
                  alignItems: 'center',
                  justify: 'center',
                  gap: '0.35rem'
                }}>
                  <Check size={16} /> UNLOCKED
                </div>
              ) : (
                <button
                  onClick={() => handlePurchase(item)}
                  className="btn-primary"
                  style={{ width: '100%', padding: '0.5rem', fontSize: '0.8rem' }}
                  disabled={gems < item.cost}
                >
                  {gems >= item.cost ? `UNLOCK FOR 💎 ${item.cost}` : 'LOCKED (INSUFFICIENT GEMS)'}
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default RewardShopCard;
