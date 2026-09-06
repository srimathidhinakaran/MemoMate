import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Calendar, CheckCircle2, Clock, Droplets, Pill, Activity, User, HelpCircle, ArrowRight } from 'lucide-react';

const MyDayPage = () => {
  const { t, reminders, toggleReminderStatus, familyMembers, user } = useAuth();
  const [selectedAnswer1, setSelectedAnswer1] = useState(null);
  const [selectedAnswer2, setSelectedAnswer2] = useState(null);
  const [quizScore, setQuizScore] = useState(null);

  const hasFamily = Array.isArray(familyMembers) && familyMembers.length > 0;
  const mainMember = hasFamily ? familyMembers[0] : null;
  const secondMember = hasFamily && familyMembers.length > 1 ? familyMembers[1] : null;
  const medicationItem = reminders.find(r => r.category === 'medicine')?.detail || 'Blood Pressure Medication';

  const mainVisitorName = mainMember ? mainMember.name : '';
  const mainVisitorRelation = mainMember ? mainMember.relation : '';

  const storyText = hasFamily
    ? `Today is a peaceful day. Your ${mainVisitorRelation.toLowerCase()} ${mainVisitorName} ${secondMember ? `and your ${secondMember.relation.toLowerCase()} ${secondMember.name}` : ''} will visit you in the evening for tea and a garden walk. Your ${medicationItem} is scheduled after lunch. Keep hydrated throughout the day!`
    : '';

  const question1 = hasFamily ? {
    text: `Who is visiting you this evening?`,
    options: [mainVisitorName, secondMember ? secondMember.name : 'Neighbor', 'Doctor'],
    correct: mainVisitorName
  } : null;

  const question2 = {
    text: `What reminder is scheduled after lunch?`,
    options: ['Medicine', 'Grocery Shopping', 'TV Show'],
    correct: 'Medicine'
  };

  const handleCheckAnswers = () => {
    let score = 0;
    if (question1 && selectedAnswer1 === question1.correct) score += 50;
    if (selectedAnswer2 === question2.correct) score += 50;
    setQuizScore(score);
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'medicine': return <Pill size={20} color="#FBBF24" />;
      case 'hydration': return <Droplets size={20} color="#38BDF8" />;
      case 'cognitive': return <Activity size={20} color="#C084FC" />;
      default: return <Clock size={20} color="#34D399" />;
    }
  };

  return (
    <div className="page-view animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Header */}
      <div className="garden-card">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', marginBottom: '0.4rem' }}>
          <div className="icon-box" style={{
            width: 44,
            height: 44,
            borderRadius: '12px',
            backgroundColor: 'rgba(56, 189, 248, 0.15)',
            border: '1px solid rgba(56, 189, 248, 0.35)'
          }}>
            <Calendar size={24} color="#38BDF8" />
          </div>
          <div>
            <h1 style={{ fontSize: '1.8rem', color: '#FFFFFF', fontWeight: 900, fontFamily: 'var(--font-heading)', margin: 0 }}>
              {t('todaysSchedule') || "Today's Schedule & Reminders"}
            </h1>
            <p style={{ color: '#94A3B8', fontSize: '0.9rem', margin: 0 }}>
              Daily routine assistance, medicine timeline & memory recall
            </p>
          </div>
        </div>
      </div>

      {/* Today's Memory Story Card */}
      <div className="garden-card animate-fade-in" style={{ backgroundColor: '#161C26', border: '1px solid #38BDF8' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.85rem' }}>
          <HelpCircle size={22} color="#38BDF8" />
          <h2 style={{ fontSize: '1.25rem', color: '#FFFFFF', fontWeight: 800, margin: 0, fontFamily: 'var(--font-heading)' }}>
            {t('todaysMemoryStory') || "Today's Memory Story"}
          </h2>
        </div>

        {hasFamily ? (
          <>
            <div style={{
              backgroundColor: '#0D1117',
              border: '1px solid #263142',
              borderRadius: '14px',
              padding: '1.25rem',
              fontSize: '1.05rem',
              color: '#F8FAFC',
              lineHeight: 1.6,
              marginBottom: '1.25rem'
            }}>
              "{storyText}"
            </div>

            {/* Story Memory Recall Questions */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#38BDF8' }}>
                Daily Story Memory Check:
              </div>

              {question1 && (
                <div>
                  <div style={{ fontSize: '0.9rem', color: '#FFFFFF', fontWeight: 700, marginBottom: '0.5rem' }}>
                    1. {question1.text}
                  </div>
                  <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
                    {question1.options.map((opt, i) => (
                      <button
                        key={i}
                        onClick={() => setSelectedAnswer1(opt)}
                        className="btn-secondary"
                        style={{
                          padding: '0.6rem 1.1rem',
                          fontSize: '0.85rem',
                          backgroundColor: selectedAnswer1 === opt ? 'rgba(56, 189, 248, 0.2)' : '#0D1117',
                          borderColor: selectedAnswer1 === opt ? '#38BDF8' : '#263142',
                          color: selectedAnswer1 === opt ? '#38BDF8' : '#FFFFFF'
                        }}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <div style={{ fontSize: '0.9rem', color: '#FFFFFF', fontWeight: 700, marginBottom: '0.5rem' }}>
                  2. {question2.text}
                </div>
                <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
                  {question2.options.map((opt, i) => (
                    <button
                      key={i}
                      onClick={() => setSelectedAnswer2(opt)}
                      className="btn-secondary"
                      style={{
                        padding: '0.6rem 1.1rem',
                        fontSize: '0.85rem',
                        backgroundColor: selectedAnswer2 === opt ? 'rgba(56, 189, 248, 0.2)' : '#0D1117',
                        borderColor: selectedAnswer2 === opt ? '#38BDF8' : '#263142',
                        color: selectedAnswer2 === opt ? '#38BDF8' : '#FFFFFF'
                      }}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>

              {selectedAnswer1 && selectedAnswer2 && (
                <div style={{ marginTop: '0.5rem' }}>
                  <button onClick={handleCheckAnswers} className="btn-primary" style={{ padding: '0.7rem 1.3rem', fontSize: '0.88rem' }}>
                    <span>CHECK STORY RECALL ANSWERS</span>
                    <ArrowRight size={16} />
                  </button>
                </div>
              )}

              {quizScore !== null && (
                <div style={{
                  padding: '0.85rem 1.1rem',
                  borderRadius: '12px',
                  backgroundColor: quizScore === 100 ? 'rgba(52, 211, 153, 0.15)' : 'rgba(251, 191, 36, 0.15)',
                  border: quizScore === 100 ? '1px solid #34D399' : '1px solid #FBBF24',
                  color: quizScore === 100 ? '#34D399' : '#FBBF24',
                  fontWeight: 800,
                  fontSize: '0.9rem'
                }}>
                  {quizScore === 100 ? 'Excellent memory recall! 100% correct answers.' : `Memory Recall Score: ${quizScore}%. Keep practicing daily stories!`}
                </div>
              )}
            </div>
          </>
        ) : (
          <div style={{
            backgroundColor: '#0D1117',
            border: '1px border-dashed #263142',
            borderRadius: '14px',
            padding: '1.5rem',
            textAlign: 'center'
          }}>
            <p style={{ color: '#94A3B8', fontSize: '0.95rem', marginBottom: '1rem' }}>
              You haven't added any family members yet! Add family members in Family Setup to generate your personalized Daily Memory Story.
            </p>
            <a href="/family-setup" className="btn-primary" style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
              <User size={16} />
              <span>Go to Family Setup</span>
            </a>
          </div>
        )}
      </div>

      {/* Schedule Timeline */}
      <div className="garden-card animate-fade-in">
        <h2 style={{ fontSize: '1.25rem', color: '#FFFFFF', fontWeight: 800, margin: '0 0 1rem', fontFamily: 'var(--font-heading)' }}>
          Today's Activity Timeline
        </h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
          {reminders.map((rem) => {
            const isDone = rem.status === 'completed';

            return (
              <div
                key={rem.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justify: 'space-between',
                  padding: '1rem 1.25rem',
                  borderRadius: '14px',
                  backgroundColor: isDone ? 'rgba(52, 211, 153, 0.08)' : '#0D1117',
                  border: isDone ? '1px solid rgba(52, 211, 153, 0.3)' : '1px solid #263142',
                  transition: 'all 0.15s ease'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div className="icon-box" style={{
                    width: 44,
                    height: 44,
                    borderRadius: '12px',
                    backgroundColor: isDone ? 'rgba(52, 211, 153, 0.15)' : '#161C26',
                    display: 'flex',
                    alignItems: 'center',
                    justify: 'center',
                    flexShrink: 0
                  }}>
                    {getCategoryIcon(rem.category)}
                  </div>
                  <div>
                    <div style={{ fontSize: '0.8rem', color: '#94A3B8', fontWeight: 700, textTransform: 'uppercase' }}>
                      {rem.time}
                    </div>
                    <div style={{ fontSize: '1.05rem', fontWeight: 800, color: isDone ? '#94A3B8' : '#FFFFFF', textDecoration: isDone ? 'line-through' : 'none' }}>
                      {rem.title}
                    </div>
                    <div style={{ fontSize: '0.85rem', color: '#94A3B8' }}>
                      {rem.detail}
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => toggleReminderStatus(rem.id)}
                  style={{
                    padding: '0.6rem 1.1rem',
                    borderRadius: '10px',
                    border: isDone ? '1px solid #34D399' : '1px solid #38BDF8',
                    backgroundColor: isDone ? 'rgba(52, 211, 153, 0.15)' : 'rgba(56, 189, 248, 0.15)',
                    color: isDone ? '#34D399' : '#38BDF8',
                    fontWeight: 800,
                    fontSize: '0.85rem',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    cursor: 'pointer'
                  }}
                >
                  <CheckCircle2 size={16} />
                  <span>{isDone ? 'Completed' : 'Mark Done'}</span>
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default MyDayPage;
