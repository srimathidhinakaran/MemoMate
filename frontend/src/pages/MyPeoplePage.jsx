import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Users, UserPlus, Heart, Calendar, HelpCircle, CheckCircle2, X } from 'lucide-react';

const MyPeoplePage = () => {
  const { t, familyMembers, addFamilyMember } = useAuth();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newName, setNewName] = useState('');
  const [newRelation, setNewRelation] = useState('');
  const [newSchedule, setNewSchedule] = useState('');
  const [newNotes, setNewNotes] = useState('');
  const [newPhotoUrl, setNewPhotoUrl] = useState('');

  const [activeQuizIndex, setActiveQuizIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState(null);
  const [quizResult, setQuizResult] = useState(null);

  const currentQuizPerson = familyMembers[activeQuizIndex % familyMembers.length];

  const handleAddSubmit = (e) => {
    e.preventDefault();
    if (!newName || !newRelation) return;

    addFamilyMember({
      name: newName,
      relation: newRelation,
      visitSchedule: newSchedule || 'Regular visits',
      notes: newNotes || 'Beloved family member',
      photoUrl: newPhotoUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop'
    });

    setNewName('');
    setNewRelation('');
    setNewSchedule('');
    setNewNotes('');
    setNewPhotoUrl('');
    setIsAddModalOpen(false);
  };

  const handleAnswerOption = (selectedName) => {
    setUserAnswer(selectedName);
    if (selectedName === currentQuizPerson.name) {
      setQuizResult('correct');
    } else {
      setQuizResult('incorrect');
    }
  };

  const nextQuizQuestion = () => {
    setUserAnswer(null);
    setQuizResult(null);
    setActiveQuizIndex((prev) => (prev + 1) % familyMembers.length);
  };

  // Generate 3 choices for the quiz (including correct answer)
  const quizChoices = Array.from(new Set([
    currentQuizPerson.name,
    ...familyMembers.map(f => f.name).filter(n => n !== currentQuizPerson.name)
  ])).slice(0, 3);

  return (
    <div className="page-view animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Header */}
      <div className="garden-card">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
            <div className="icon-box" style={{
              width: 44,
              height: 44,
              borderRadius: '12px',
              backgroundColor: 'rgba(192, 132, 252, 0.15)',
              border: '1px solid rgba(192, 132, 252, 0.35)'
            }}>
              <Users size={24} color="#C084FC" />
            </div>
            <div>
              <h1 style={{ fontSize: '1.8rem', color: '#FFFFFF', fontWeight: 900, fontFamily: 'var(--font-heading)', margin: 0 }}>
                {t('myPeopleTitle') || 'My People & Family Memories'}
              </h1>
              <p style={{ color: '#94A3B8', fontSize: '0.9rem', margin: 0 }}>
                Familiar family member recognition, emotional connection & memory drills
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="btn-primary"
            style={{ padding: '0.7rem 1.25rem', fontSize: '0.88rem' }}
          >
            <UserPlus size={18} />
            <span>{t('addFamilyMember') || 'Add Family Member'}</span>
          </button>
        </div>
      </div>

      {/* Interactive Family Memory Quiz Card */}
      {familyMembers.length > 0 && currentQuizPerson && (
        <div className="garden-card animate-fade-in" style={{ backgroundColor: '#161C26', border: '1px solid #C084FC' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1rem' }}>
            <HelpCircle size={22} color="#C084FC" />
            <h2 style={{ fontSize: '1.25rem', color: '#FFFFFF', fontWeight: 800, margin: 0, fontFamily: 'var(--font-heading)' }}>
              Family Memory Recognition Exercise
            </h2>
          </div>

          <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
            <img
              src={currentQuizPerson.photoUrl}
              alt="Familiar Person"
              style={{
                width: 140,
                height: 140,
                borderRadius: '20px',
                objectFit: 'cover',
                border: '2px solid #C084FC',
                boxShadow: '0 8px 24px rgba(192, 132, 252, 0.2)'
              }}
            />

            <div style={{ flex: 1, minWidth: 260, display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#FFFFFF' }}>
                Question: "Who is this family member?"
              </div>

              <div style={{ fontSize: '0.88rem', color: '#94A3B8' }}>
                Hint: {currentQuizPerson.relation} • {currentQuizPerson.notes}
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                {quizChoices.map((nameOpt, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleAnswerOption(nameOpt)}
                    className="btn-secondary"
                    style={{
                      padding: '0.7rem 1.25rem',
                      fontSize: '0.9rem',
                      backgroundColor: userAnswer === nameOpt ? (nameOpt === currentQuizPerson.name ? 'rgba(52, 211, 153, 0.2)' : 'rgba(239, 68, 68, 0.2)') : '#0D1117',
                      borderColor: userAnswer === nameOpt ? (nameOpt === currentQuizPerson.name ? '#34D399' : '#EF4444') : '#263142',
                      color: userAnswer === nameOpt ? (nameOpt === currentQuizPerson.name ? '#34D399' : '#EF4444') : '#FFFFFF'
                    }}
                  >
                    {nameOpt}
                  </button>
                ))}
              </div>

              {quizResult && (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '0.5rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                  <div style={{
                    fontWeight: 800,
                    color: quizResult === 'correct' ? '#34D399' : '#EF4444',
                    fontSize: '0.95rem'
                  }}>
                    {quizResult === 'correct' ? `Correct! This is ${currentQuizPerson.name} (${currentQuizPerson.relation}).` : `Try again! This is ${currentQuizPerson.name}.`}
                  </div>

                  <button
                    onClick={nextQuizQuestion}
                    className="btn-primary"
                    style={{ padding: '0.5rem 1rem', fontSize: '0.82rem' }}
                  >
                    <span>NEXT RECOGNITION DRILL</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Family Members Grid */}
      {familyMembers.length === 0 ? (
        <div className="garden-card animate-fade-in" style={{ textAlign: 'center', padding: '3rem 1.5rem', backgroundColor: '#161C26' }}>
          <div className="icon-box" style={{ width: 64, height: 64, borderRadius: '50%', backgroundColor: 'rgba(192, 132, 252, 0.15)', border: '1px solid #C084FC', margin: '0 auto 1.25rem' }}>
            <Heart size={36} color="#C084FC" />
          </div>
          <h2 style={{ fontSize: '1.4rem', color: '#FFFFFF', fontWeight: 900, marginBottom: '0.5rem' }}>
            {t('emptyFamilyList') || 'No family members added yet.'}
          </h2>
          <p style={{ color: '#94A3B8', fontSize: '0.95rem', maxWidth: 480, margin: '0 auto 1.5rem' }}>
            {t('emptyFamilySub') || 'Add your family members to personalize your Daily Stories & memory check exercises.'}
          </p>
          <button onClick={() => setIsAddModalOpen(true)} className="btn-primary" style={{ padding: '0.85rem 1.75rem' }}>
            <UserPlus size={18} />
            <span>{t('addFamilyMember') || 'Add Family Member'}</span>
          </button>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.25rem' }}>
          {familyMembers.map((person) => (
            <div key={person.id} className="garden-card animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                {person.photoUrl ? (
                  <img
                    src={person.photoUrl}
                    alt={person.name}
                    style={{
                      width: 72,
                      height: 72,
                      borderRadius: '16px',
                      objectFit: 'cover',
                      border: '1px solid #38BDF8'
                    }}
                  />
                ) : (
                  <div style={{ width: 72, height: 72, borderRadius: '16px', backgroundColor: 'rgba(56, 189, 248, 0.15)', border: '1px solid #38BDF8', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, color: '#38BDF8', fontSize: '1.8rem' }}>
                    {person.name ? person.name.charAt(0).toUpperCase() : '?'}
                  </div>
                )}
                <div>
                  <h3 style={{ fontSize: '1.25rem', color: '#FFFFFF', fontWeight: 900, margin: 0, fontFamily: 'var(--font-heading)' }}>
                    {person.name}
                  </h3>
                  <span className="badge badge-purple" style={{ marginTop: '0.2rem' }}>
                    {person.relation}
                  </span>
                </div>
              </div>

              <div style={{ backgroundColor: '#0D1117', padding: '0.85rem 1rem', borderRadius: '12px', border: '1px solid #263142', fontSize: '0.85rem', color: '#94A3B8', lineHeight: 1.5 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#38BDF8', fontWeight: 700, marginBottom: '0.2rem' }}>
                  <Calendar size={14} />
                  <span>{person.visitSchedule || 'Regular visits'}</span>
                </div>
                {person.notes || 'Beloved family member'}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Family Member Modal */}
      {isAddModalOpen && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(11, 14, 20, 0.85)',
          backdropFilter: 'blur(10px)',
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center',
          justify: 'center',
          padding: '1.5rem'
        }}>
          <div style={{
            backgroundColor: '#161C26',
            border: '1px solid #38BDF8',
            borderRadius: '24px',
            maxWidth: 500,
            width: '100%',
            padding: '2rem',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
              <h2 style={{ fontSize: '1.3rem', color: '#FFFFFF', fontWeight: 900, fontFamily: 'var(--font-heading)', margin: 0 }}>
                {t('addFamilyMember') || 'Add Family Member'}
              </h2>
              <button
                onClick={() => setIsAddModalOpen(false)}
                style={{ background: 'none', border: 'none', color: '#94A3B8', cursor: 'pointer' }}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleAddSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', color: '#94A3B8', fontWeight: 700, marginBottom: '0.4rem' }}>
                  Full Name:
                </label>
                <input
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="e.g. Meena Devi"
                  style={{ width: '100%' }}
                  required
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', color: '#94A3B8', fontWeight: 700, marginBottom: '0.4rem' }}>
                  Relationship:
                </label>
                <input
                  type="text"
                  value={newRelation}
                  onChange={(e) => setNewRelation(e.target.value)}
                  placeholder="e.g. Daughter / Son / Grandchild / Caregiver"
                  style={{ width: '100%' }}
                  required
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', color: '#94A3B8', fontWeight: 700, marginBottom: '0.4rem' }}>
                  Visit Schedule:
                </label>
                <input
                  type="text"
                  value={newSchedule}
                  onChange={(e) => setNewSchedule(e.target.value)}
                  placeholder="e.g. Every evening at 5:00 PM"
                  style={{ width: '100%' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', color: '#94A3B8', fontWeight: 700, marginBottom: '0.4rem' }}>
                  Personal Notes & Memories:
                </label>
                <textarea
                  value={newNotes}
                  onChange={(e) => setNewNotes(e.target.value)}
                  placeholder="e.g. Loves drinking tea together in afternoon"
                  rows={3}
                  style={{ width: '100%' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', color: '#94A3B8', fontWeight: 700, marginBottom: '0.4rem' }}>
                  Photo URL (Optional):
                </label>
                <input
                  type="url"
                  value={newPhotoUrl}
                  onChange={(e) => setNewPhotoUrl(e.target.value)}
                  placeholder="https://example.com/photo.jpg"
                  style={{ width: '100%' }}
                />
              </div>

              <button type="submit" className="btn-primary" style={{ padding: '0.85rem', marginTop: '0.5rem' }}>
                <span>SAVE FAMILY MEMBER</span>
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyPeoplePage;
