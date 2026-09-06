import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { soundFx } from '../utils/soundEffects';
import { Users, Plus, Trash2, Edit3, ArrowRight, Heart, Sparkles, Image, CheckCircle2 } from 'lucide-react';

const RELATIONSHIP_OPTIONS = [
  'Daughter',
  'Son',
  'Daughter-in-law',
  'Son-in-law',
  'Granddaughter',
  'Grandson',
  'Wife',
  'Husband',
  'Mother',
  'Father',
  'Sister',
  'Brother',
  'Other'
];

const FamilySetup = () => {
  const { user, familyMembers, setFamilyMembers, updateFamilyMembers, completeFamilySetup, t } = useAuth();
  const navigate = useNavigate();

  const [relation, setRelation] = useState('Daughter');
  const [name, setName] = useState('');
  const [notes, setNotes] = useState('');
  const [photoUrl, setPhotoUrl] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState('');

  const handleAddOrUpdateMember = (e) => {
    e.preventDefault();
    soundFx.playClick();

    if (!name.trim()) {
      setError(t('valNameReq') || 'Please enter the family member\'s name.');
      return;
    }

    setError('');
    const memberObj = {
      id: editingId || 'fam_' + Date.now(),
      relation,
      name: name.trim(),
      notes: notes.trim(),
      photoUrl: photoUrl.trim(),
      visitSchedule: 'Regular visits'
    };

    let updatedList;
    if (editingId) {
      updatedList = familyMembers.map((m) => m.id === editingId ? memberObj : m);
      setEditingId(null);
    } else {
      updatedList = [...familyMembers, memberObj];
    }

    setFamilyMembers(updatedList);
    const userId = user?.id || user?._id || 'user_default';
    localStorage.setItem(`memomate_family_${userId}`, JSON.stringify(updatedList));

    // Reset form fields
    setName('');
    setNotes('');
    setPhotoUrl('');
    setRelation('Daughter');
  };

  const handleEdit = (member) => {
    soundFx.playClick();
    setEditingId(member.id);
    setRelation(member.relation || 'Daughter');
    setName(member.name || '');
    setNotes(member.notes || '');
    setPhotoUrl(member.photoUrl || '');
  };

  const handleDelete = (id) => {
    soundFx.playClick();
    const updated = familyMembers.filter((m) => m.id !== id);
    setFamilyMembers(updated);
    const userId = user?.id || user?._id || 'user_default';
    localStorage.setItem(`memomate_family_${userId}`, JSON.stringify(updated));
    if (editingId === id) {
      setEditingId(null);
      setName('');
      setNotes('');
      setPhotoUrl('');
    }
  };

  const handleCompleteSetup = async () => {
    soundFx.playLevelUp();
    await completeFamilySetup(familyMembers);
    navigate('/assessment?baseline=true');
  };

  return (
    <div className="page-view animate-fade-in" style={{ maxWidth: '800px', margin: '0 auto', padding: '1.5rem 1rem' }}>
      <div className="garden-card" style={{ borderColor: '#38BDF8', backgroundColor: '#161C26', padding: '2rem' }}>
        {/* Onboarding Header */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div className="icon-box" style={{
            width: 56,
            height: 56,
            borderRadius: '16px',
            backgroundColor: 'rgba(56, 189, 248, 0.15)',
            border: '1px solid #38BDF8',
            margin: '0 auto 1rem'
          }}>
            <Users size={32} color="#38BDF8" />
          </div>
          <span className="badge badge-cyan" style={{ marginBottom: '0.5rem' }}>
            STEP 1 OF 2 • MANDATORY ONBOARDING
          </span>
          <h1 style={{ fontSize: '2rem', color: '#FFFFFF', fontWeight: 900, fontFamily: 'var(--font-heading)', margin: '0.4rem 0 0.5rem' }}>
            {t('familySetupTitle') || 'Tell Us About Your Family'}
          </h1>
          <p style={{ color: '#94A3B8', fontSize: '1rem', maxWidth: '580px', margin: '0 auto', lineHeight: 1.5 }}>
            {t('familySetupSub') || 'Please provide the names of family members that are relevant to your Daily Story memory check. Photographs are 100% optional.'}
          </p>
        </div>

        {/* Family Member Input Form */}
        <form onSubmit={handleAddOrUpdateMember} style={{
          backgroundColor: '#0D1117',
          padding: '1.5rem',
          borderRadius: '16px',
          border: '1px solid #263142',
          marginBottom: '2rem'
        }}>
          <h3 style={{ fontSize: '1.1rem', color: '#FFFFFF', fontWeight: 800, marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Plus size={20} color="#38BDF8" />
            <span>{editingId ? (t('editFamilyMember') || 'Edit Family Member') : (t('addFamilyMember') || 'Add Family Member')}</span>
          </h3>

          {error && (
            <div style={{ backgroundColor: 'rgba(239, 68, 68, 0.15)', border: '1px solid rgba(239, 68, 68, 0.4)', color: '#FCA5A5', padding: '0.75rem 1rem', borderRadius: '10px', marginBottom: '1rem', fontSize: '0.88rem' }}>
              {error}
            </div>
          )}

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem', marginBottom: '1.25rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#FFFFFF', marginBottom: '0.4rem' }}>
                {t('relationshipLabel') || 'Relationship'} *
              </label>
              <select
                value={relation}
                onChange={(e) => setRelation(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.8rem 1rem',
                  borderRadius: '10px',
                  border: '1px solid #263142',
                  backgroundColor: '#161C26',
                  color: '#FFFFFF',
                  fontSize: '0.95rem',
                  outline: 'none'
                }}
              >
                {RELATIONSHIP_OPTIONS.map((opt) => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#FFFFFF', marginBottom: '0.4rem' }}>
                {t('nameLabel') || 'Person\'s Name'} *
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Priya"
                required
                style={{
                  width: '100%',
                  padding: '0.8rem 1rem',
                  borderRadius: '10px',
                  border: '1px solid #263142',
                  backgroundColor: '#161C26',
                  color: '#FFFFFF',
                  fontSize: '0.95rem',
                  outline: 'none'
                }}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem', marginBottom: '1.25rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#FFFFFF', marginBottom: '0.4rem' }}>
                {t('notesLabel') || 'Personal Note / Memories (Optional)'}
              </label>
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="e.g. Loves drinking tea together"
                style={{
                  width: '100%',
                  padding: '0.8rem 1rem',
                  borderRadius: '10px',
                  border: '1px solid #263142',
                  backgroundColor: '#161C26',
                  color: '#FFFFFF',
                  fontSize: '0.95rem',
                  outline: 'none'
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#FFFFFF', marginBottom: '0.4rem' }}>
                {t('photoUrlLabel') || 'Photo URL (Optional)'}
              </label>
              <input
                type="url"
                value={photoUrl}
                onChange={(e) => setPhotoUrl(e.target.value)}
                placeholder="https://images.unsplash.com/..."
                style={{
                  width: '100%',
                  padding: '0.8rem 1rem',
                  borderRadius: '10px',
                  border: '1px solid #263142',
                  backgroundColor: '#161C26',
                  color: '#FFFFFF',
                  fontSize: '0.95rem',
                  outline: 'none'
                }}
              />
            </div>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
            {editingId && (
              <button
                type="button"
                onClick={() => {
                  setEditingId(null);
                  setName('');
                  setNotes('');
                  setPhotoUrl('');
                }}
                className="btn-secondary"
                style={{ padding: '0.7rem 1.25rem' }}
              >
                Cancel Edit
              </button>
            )}
            <button type="submit" className="btn-primary" style={{ padding: '0.7rem 1.5rem' }}>
              <Plus size={18} />
              <span>{editingId ? (t('updateMember') || 'Update Member') : (t('addMemberBtn') || 'Add Member')}</span>
            </button>
          </div>
        </form>

        {/* Added Family Members List */}
        <div style={{ marginBottom: '2rem' }}>
          <h3 style={{ fontSize: '1.2rem', color: '#FFFFFF', fontWeight: 800, marginBottom: '1rem' }}>
            {t('yourFamilyMembers') || 'Your Added Family Members'} ({familyMembers.length})
          </h3>

          {familyMembers.length === 0 ? (
            <div style={{
              backgroundColor: '#0D1117',
              padding: '2rem',
              borderRadius: '16px',
              border: '1px border-dashed #263142',
              textAlign: 'center',
              color: '#94A3B8'
            }}>
              <Heart size={36} color="#38BDF8" style={{ margin: '0 auto 0.75rem' }} />
              <div style={{ fontSize: '1rem', fontWeight: 700, color: '#FFFFFF' }}>
                {t('emptyFamilyList') || 'No family members added yet.'}
              </div>
              <div style={{ fontSize: '0.88rem', color: '#94A3B8', marginTop: '0.3rem' }}>
                {t('emptyFamilySub') || 'Add your family members above to personalize your Daily Story memory check.'}
              </div>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '1rem' }}>
              {familyMembers.map((member) => (
                <div key={member.id} style={{
                  backgroundColor: '#0D1117',
                  padding: '1.25rem',
                  borderRadius: '14px',
                  border: '1px solid #263142',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem',
                  position: 'relative'
                }}>
                  {member.photoUrl ? (
                    <img src={member.photoUrl} alt={member.name} style={{ width: 50, height: 50, borderRadius: '50%', objectFit: 'cover', border: '2px solid #38BDF8' }} />
                  ) : (
                    <div style={{ width: 50, height: 50, borderRadius: '50%', backgroundColor: 'rgba(56, 189, 248, 0.15)', border: '1px solid #38BDF8', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, color: '#38BDF8', fontSize: '1.2rem' }}>
                      {member.name.charAt(0).toUpperCase()}
                    </div>
                  )}

                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 800, color: '#FFFFFF', fontSize: '1.05rem' }}>{member.name}</div>
                    <span className="badge badge-cyan" style={{ fontSize: '0.75rem', marginTop: '0.2rem' }}>{member.relation}</span>
                    {member.notes && (
                      <div style={{ fontSize: '0.8rem', color: '#94A3B8', marginTop: '0.4rem' }}>{member.notes}</div>
                    )}
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                    <button onClick={() => handleEdit(member)} title="Edit" style={{ background: 'none', border: 'none', color: '#38BDF8', cursor: 'pointer', padding: '4px' }}>
                      <Edit3 size={16} />
                    </button>
                    <button onClick={() => handleDelete(member.id)} title="Delete" style={{ background: 'none', border: 'none', color: '#EF4444', cursor: 'pointer', padding: '4px' }}>
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Complete Onboarding Button */}
        <div style={{ textAlign: 'center', borderTop: '1px solid #263142', paddingTop: '1.5rem' }}>
          <button
            onClick={handleCompleteSetup}
            className="btn-primary"
            style={{ padding: '1rem 2.5rem', fontSize: '1.1rem', borderRadius: '14px' }}
          >
            <span>{t('saveFamilyContinue') || 'SAVE & CONTINUE TO ASSESSMENT'}</span>
            <ArrowRight size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default FamilySetup;
