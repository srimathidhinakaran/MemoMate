import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { sessionAPI } from '../services/api';
import { soundFx } from '../utils/soundEffects';
import { Compass, CheckCircle2, RotateCcw, Award, ArrowRight } from 'lucide-react';

const CULTURAL_ITEMS = [
  { id: 'gamosa', name: 'Gamosa', category: 'Traditional Textile', desc: 'Assamese traditional red and white handwoven cloth of honor', iconText: 'Gamosa (🧣 Woven Cloth)' },
  { id: 'japi', name: 'Japi', category: 'Traditional Handicraft', desc: 'Conical headgear woven from bamboo, cane, and palm leaves', iconText: 'Japi (👒 Bamboo Hat)' },
  { id: 'mekhela', name: 'Mekhela Chador', category: 'Traditional Attire', desc: 'Two-piece traditional Assamese silk attire worn on festive occasions', iconText: 'Mekhela Chador (👗 Silk Attire)' },
  { id: 'masor_tenga', name: 'Masor Tenga', category: 'Regional Cuisine', desc: 'Traditional light sour fish curry cooked with elephant apple or lemon', iconText: 'Masor Tenga (🐟 Sour Fish Curry)' },
  { id: 'assam_tea', name: 'Assam Tea Leaves', category: 'Local Produce', desc: 'World-famous black tea grown in lush Brahmaputra valley tea gardens', iconText: 'Assam Tea (🍵 Tea Leaves)' },
  { id: 'bihu_dhol', name: 'Bihu Dhol', category: 'Musical Instrument', desc: 'Two-headed percussion drum played during spring Bihu celebrations', iconText: 'Bihu Dhol (🥁 Drum)' },
  { id: 'bamboo_basket', name: 'Bamboo Basket', category: 'Craft & Utility', desc: 'Woven bamboo storage vessel crafted by NER indigenous artisans', iconText: 'Bamboo Basket (🧺 Basket)' }
];

const NERCulturalGame = () => {
  const { user, updateStateFromSession, t } = useAuth();
  const [currentRound, setCurrentRound] = useState(0);
  const [phase, setPhase] = useState('MEMORIZE'); // 'MEMORIZE' | 'RECALL' | 'COMPLETE'
  const [targetItems, setTargetItems] = useState([]);
  const [selectedChoices, setSelectedChoices] = useState([]);
  const [score, setScore] = useState(0);
  const [startTime, setStartTime] = useState(Date.now());
  const [optionsPool, setOptionsPool] = useState([]);

  useEffect(() => {
    startNewRound(0);
  }, []);

  const startNewRound = (roundIdx) => {
    // Procedurally pick 3 target cultural items
    const shuffled = [...CULTURAL_ITEMS].sort(() => Math.random() - 0.5);
    const targets = shuffled.slice(0, 3);
    const options = [...shuffled.slice(0, 6)].sort(() => Math.random() - 0.5);

    setTargetItems(targets);
    setOptionsPool(options);
    setSelectedChoices([]);
    setPhase('MEMORIZE');
    setStartTime(Date.now());
  };

  const handleStartRecall = () => {
    soundFx.playClick();
    setPhase('RECALL');
  };

  const handleSelectOption = (item) => {
    soundFx.playClick();
    if (selectedChoices.find(c => c.id === item.id)) {
      setSelectedChoices(prev => prev.filter(c => c.id !== item.id));
    } else if (selectedChoices.length < 3) {
      setSelectedChoices(prev => [...prev, item]);
    }
  };

  const handleSubmitRecall = async () => {
    soundFx.playLevelUp();
    const correctCount = selectedChoices.filter(c => targetItems.some(t => t.id === c.id)).length;
    const roundScore = Math.round((correctCount / 3) * 100);
    setScore(roundScore);
    setPhase('COMPLETE');

    const duration = Math.round((Date.now() - startTime) / 1000);
    const sessionData = {
      userId: user?.id || user?._id || 'user_1',
      activity: 'Familiar Memories (NER Cultural Recall)',
      category: 'recall',
      score: roundScore,
      difficulty: 'Medium',
      metrics: {
        accuracy: roundScore,
        completionTimeSeconds: duration,
        sessionConsistency: 100
      }
    };

    try {
      const res = await sessionAPI.createSession(sessionData);
      if (res) updateStateFromSession(res);
    } catch (e) {
      console.warn("Session record local fallback active", e);
    }
  };

  return (
    <div className="garden-card animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
          <div className="icon-box" style={{
            width: 44,
            height: 44,
            borderRadius: '12px',
            backgroundColor: 'rgba(56, 189, 248, 0.15)',
            border: '1px solid rgba(56, 189, 248, 0.35)'
          }}>
            <Compass size={24} color="#38BDF8" />
          </div>
          <div>
            <h1 style={{ fontSize: '1.6rem', color: '#FFFFFF', fontWeight: 900, fontFamily: 'var(--font-heading)', margin: 0 }}>
              {t('nerCulturalTitle') || 'Familiar Memories — North Eastern Cultural Recall'}
            </h1>
            <p style={{ color: '#94A3B8', fontSize: '0.88rem', margin: 0 }}>
              Culturally familiar memory & object recognition for elderly patients in the NER region
            </p>
          </div>
        </div>

        <span className="badge badge-cyan">CULTURAL PERSONALIZATION</span>
      </div>

      {/* PHASE 1: MEMORIZE */}
      {phase === 'MEMORIZE' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div style={{
            backgroundColor: '#0D1117',
            border: '1px solid #38BDF8',
            borderRadius: '14px',
            padding: '1.25rem',
            textAlign: 'center'
          }}>
            <h3 style={{ fontSize: '1.2rem', color: '#FFFFFF', fontWeight: 800, marginBottom: '0.4rem' }}>
              Memorize these 3 North Eastern cultural items:
            </h3>
            <p style={{ color: '#94A3B8', fontSize: '0.9rem', margin: 0 }}>
              Take a moment to look at their names and traditional cultural heritage details.
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '1.2rem'
          }}>
            {targetItems.map((item) => (
              <div
                key={item.id}
                style={{
                  backgroundColor: '#161C26',
                  border: '1px solid #30363D',
                  borderRadius: '16px',
                  padding: '1.25rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.6rem'
                }}
              >
                <span className="badge badge-purple" style={{ width: 'fit-content' }}>
                  {item.category}
                </span>
                <h4 style={{ fontSize: '1.3rem', color: '#FFFFFF', fontWeight: 900, margin: 0 }}>
                  {item.name}
                </h4>
                <div style={{ fontSize: '0.9rem', color: '#38BDF8', fontWeight: 700 }}>
                  {item.iconText}
                </div>
                <p style={{ fontSize: '0.85rem', color: '#94A3B8', lineHeight: 1.4, margin: 0 }}>
                  {item.desc}
                </p>
              </div>
            ))}
          </div>

          <button
            onClick={handleStartRecall}
            className="btn-primary"
            style={{ padding: '0.85rem 1.8rem', fontSize: '0.95rem', alignSelf: 'center' }}
          >
            <span>I HAVE MEMORIZED THEM — START RECALL</span>
            <ArrowRight size={18} />
          </button>
        </div>
      )}

      {/* PHASE 2: RECALL */}
      {phase === 'RECALL' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div style={{
            backgroundColor: '#0D1117',
            border: '1px solid #263142',
            borderRadius: '14px',
            padding: '1.25rem',
            textAlign: 'center'
          }}>
            <h3 style={{ fontSize: '1.2rem', color: '#FFFFFF', fontWeight: 800, marginBottom: '0.4rem' }}>
              Select the 3 cultural items you saw earlier:
            </h3>
            <p style={{ color: '#94A3B8', fontSize: '0.9rem', margin: 0 }}>
              Selected: {selectedChoices.length} / 3 items
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '1rem'
          }}>
            {optionsPool.map((opt) => {
              const isSelected = selectedChoices.some(c => c.id === opt.id);

              return (
                <button
                  key={opt.id}
                  onClick={() => handleSelectOption(opt)}
                  style={{
                    backgroundColor: isSelected ? 'rgba(56, 189, 248, 0.18)' : '#161C26',
                    border: isSelected ? '1px solid #38BDF8' : '1px solid #30363D',
                    borderRadius: '14px',
                    padding: '1.1rem',
                    textAlign: 'left',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.5rem',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <span className="badge badge-cyan" style={{ width: 'fit-content', fontSize: '0.75rem' }}>
                    {opt.category}
                  </span>
                  <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#FFFFFF' }}>
                    {opt.name}
                  </div>
                  <div style={{ fontSize: '0.85rem', color: isSelected ? '#38BDF8' : '#94A3B8' }}>
                    {opt.iconText}
                  </div>
                </button>
              );
            })}
          </div>

          {selectedChoices.length === 3 && (
            <button
              onClick={handleSubmitRecall}
              className="btn-primary"
              style={{ padding: '0.85rem 1.8rem', fontSize: '0.95rem', alignSelf: 'center' }}
            >
              <span>SUBMIT RECALL ANSWERS</span>
              <CheckCircle2 size={18} />
            </button>
          )}
        </div>
      )}

      {/* PHASE 3: COMPLETE */}
      {phase === 'COMPLETE' && (
        <div style={{
          backgroundColor: '#0D1117',
          border: '1px solid #34D399',
          borderRadius: '16px',
          padding: '2rem',
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '1rem'
        }}>
          <div className="icon-box" style={{
            width: 60,
            height: 60,
            borderRadius: '50%',
            backgroundColor: 'rgba(52, 211, 153, 0.15)',
            border: '1px solid #34D399'
          }}>
            <Award size={32} color="#34D399" />
          </div>

          <h3 style={{ fontSize: '1.6rem', color: '#FFFFFF', fontWeight: 900, margin: 0, fontFamily: 'var(--font-heading)' }}>
            Cultural Memory Recall Complete!
          </h3>

          <div style={{ fontSize: '1.2rem', color: '#34D399', fontWeight: 800 }}>
            Accuracy Score: {score} / 100 PTS
          </div>

          <p style={{ color: '#94A3B8', fontSize: '0.9rem', maxWidth: 460 }}>
            Great job! Engaging with familiar regional cultural heritage items reinforces long-term visual recall and emotional memory connection.
          </p>

          <button
            onClick={() => startNewRound(currentRound + 1)}
            className="btn-primary"
            style={{ padding: '0.8rem 1.6rem', fontSize: '0.9rem' }}
          >
            <RotateCcw size={18} />
            <span>PLAY AGAIN (NEW PROCEDURAL ITEMS)</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default NERCulturalGame;
