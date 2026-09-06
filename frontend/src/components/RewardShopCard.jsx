import React from 'react';
import { useAuth } from '../context/AuthContext';
import { soundFx } from '../utils/soundEffects';
import { Gem, ShoppingBag, Check, ShieldCheck, Cpu, Crown, Zap } from 'lucide-react';

const RewardShopCard = () => {
  const { gems, unlockedItems, buyShopItem, t } = useAuth();

  const shopItems = [
    {
      id: 'cyber_crystal',
      titleKey: 'quantumCrystalTitle',
      descKey: 'quantumCrystalDesc',
      categoryKey: 'cyberRelicCategory',
      title: 'Quantum Crystal Relic',
      desc: 'Unlocks dynamic glowing 3D quantum crystals in your interactive Mind Matrix Sanctum.',
      cost: 50,
      icon: Zap,
      category: '3D Cyber Relic'
    },
    {
      id: 'ai_llama_booster',
      titleKey: 'neuralBoosterTitle',
      descKey: 'neuralBoosterDesc',
      categoryKey: 'telemetryPowerupCategory',
      title: 'Neural Core Booster',
      desc: 'Boosts cognitive analysis precision with instant AI neural telemetry.',
      cost: 80,
      icon: Cpu,
      category: 'AI Telemetry Power-Up'
    },
    {
      id: 'streak_freeze',
      titleKey: 'streakShieldTitle',
      descKey: 'streakShieldDesc',
      categoryKey: 'battleShieldCategory',
      title: 'Streak Freeze Shield',
      desc: 'Protects your daily workout streak for 1 day if a session is missed.',
      cost: 40,
      icon: ShieldCheck,
      category: 'Battle Shield'
    },
    {
      id: 'heroic_crest',
      titleKey: 'heroicCrestTitle',
      descKey: 'heroicCrestDesc',
      categoryKey: 'profileAvatarCategory',
      title: 'Heroic Memory Crest',
      desc: 'Displays legendary Heroic rank aura on profile & global leaderboard.',
      cost: 120,
      icon: Crown,
      category: 'Profile Avatar'
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
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div className="icon-box" style={{
            width: 44,
            height: 44,
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #38BDF8 0%, #FBBF24 100%)',
            display: 'inline-flex',
            alignItems: 'center',
            justify: 'center'
          }}>
            <ShoppingBag size={24} color="#0B0E14" />
          </div>
          <div>
            <h3 style={{ fontSize: '1.2rem', color: '#FFFFFF', fontWeight: 900, margin: 0, fontFamily: 'var(--font-heading)' }}>
              {t('relicsShop').toUpperCase()}
            </h3>
            <div style={{ fontSize: '0.8rem', color: '#94A3B8', fontWeight: 700 }}>
              {t('shopSub') || 'REDEEM POINTS FOR POWER-UPS & CYBER AVATARS'}
            </div>
          </div>
        </div>

        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.4rem',
          backgroundColor: 'rgba(56, 189, 248, 0.12)',
          padding: '0.45rem 0.95rem',
          borderRadius: '10px',
          border: '1px solid rgba(56, 189, 248, 0.4)',
          fontWeight: 800,
          fontFamily: 'var(--font-heading)',
          color: '#38BDF8',
          fontSize: '0.9rem'
        }}>
          <Gem size={16} fill="#38BDF8" />
          <span>{gems || 10} PTS</span>
        </div>
      </div>

      {/* Shop Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1rem' }}>
        {shopItems.map((item) => {
          const isUnlocked = unlockedItems?.includes(item.id);
          const Icon = item.icon;
          const itemTitle = t(item.titleKey) || item.title;
          const itemDesc = t(item.descKey) || item.desc;
          const itemCategory = t(item.categoryKey) || item.category;

          return (
            <div
              key={item.id}
              style={{
                backgroundColor: isUnlocked ? 'rgba(52, 211, 153, 0.05)' : '#0B0E14',
                border: isUnlocked ? '1px solid rgba(52, 211, 153, 0.3)' : '1px solid #263142',
                borderRadius: '16px',
                padding: '1.1rem',
                display: 'flex',
                flexDirection: 'column',
                justify: 'space-between',
                gap: '0.85rem'
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <span className="badge badge-cyan" style={{ fontSize: '0.7rem' }}>
                    {itemCategory}
                  </span>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.3rem',
                    fontWeight: 800,
                    color: '#38BDF8',
                    fontSize: '0.88rem'
                  }}>
                    <Gem size={14} fill="#38BDF8" />
                    <span>{item.cost}</span>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', margin: '0.3rem 0' }}>
                  <Icon size={20} color="#FBBF24" />
                  <h4 style={{ fontSize: '1rem', color: '#FFFFFF', fontWeight: 800, margin: 0 }}>
                    {itemTitle}
                  </h4>
                </div>

                <p style={{ fontSize: '0.82rem', color: '#94A3B8', lineHeight: 1.4, margin: 0 }}>
                  {itemDesc}
                </p>
              </div>

              {isUnlocked ? (
                <div style={{
                  backgroundColor: 'rgba(52, 211, 153, 0.15)',
                  color: '#34D399',
                  border: '1px solid rgba(52, 211, 153, 0.4)',
                  padding: '0.5rem',
                  borderRadius: '10px',
                  fontWeight: 800,
                  fontSize: '0.8rem',
                  textAlign: 'center',
                  display: 'flex',
                  alignItems: 'center',
                  justify: 'center',
                  gap: '0.35rem'
                }}>
                  <Check size={16} /> {t('unlocked') || 'UNLOCKED ✓'}
                </div>
              ) : (
                <button
                  onClick={() => handlePurchase(item)}
                  className="btn-primary"
                  style={{ width: '100%', padding: '0.5rem', fontSize: '0.8rem' }}
                  disabled={gems < item.cost}
                >
                  {gems >= item.cost ? `${t('unlockBtn') || 'UNLOCK FOR'} 💎 ${item.cost}` : (t('lockedBtn') || 'LOCKED')}
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
