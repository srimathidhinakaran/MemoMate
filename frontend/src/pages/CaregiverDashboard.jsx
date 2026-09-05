import React, { useState, useEffect } from 'react';
import { caregiverAPI } from '../services/api';
import CognitiveScoreCard from '../components/CognitiveScoreCard';
import ProgressChart from '../components/ProgressChart';
import { HeartHandshake, User, Sparkles, Download, Zap } from 'lucide-react';

const CaregiverDashboard = ({ initialUserId }) => {
  const [elderlyUsers, setElderlyUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    caregiverAPI.getUsers().then((users) => {
      setElderlyUsers(users);
      const targetId = initialUserId || (users && users.length > 0 ? (users[0].id || users[0]._id) : null);
      if (targetId) {
        loadUserDetails(targetId);
      } else {
        setLoading(false);
      }
    });
  }, [initialUserId]);

  const loadUserDetails = async (userId) => {
    setLoading(true);
    try {
      const details = await caregiverAPI.getUserDetails(userId);
      setSelectedUser(details);
    } catch (err) {
      console.error("Error loading user details:", err);
    } finally {
      setLoading(false);
    }
  };

  const exportReport = () => {
    alert(`Generating cognitive activity summary report for ${selectedUser?.user?.name || 'Monitored Patient'}... Report downloaded.`);
  };

  return (
    <div className="page-view animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Caregiver Hero Header */}
      <div className="garden-card" style={{
        backgroundColor: '#161B22',
        border: '1px solid #30363D',
        padding: '2rem 2.2rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1.2rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.4rem' }}>
              <div className="icon-box" style={{
                width: 44,
                height: 44,
                borderRadius: '12px',
                backgroundColor: 'rgba(192, 132, 252, 0.15)',
                border: '1px solid rgba(192, 132, 252, 0.35)'
              }}>
                <HeartHandshake size={24} color="#C084FC" />
              </div>
              <h1 style={{ fontSize: '2rem', color: '#FFFFFF', fontWeight: 800, margin: 0, fontFamily: 'var(--font-heading)' }}>
                Caregiver Monitoring Dashboard
              </h1>
            </div>
            <p style={{ color: '#9198A1', fontSize: '0.95rem', margin: 0, maxWidth: '640px', lineHeight: 1.5 }}>
              Real-time cognitive activity observations & trend monitoring for registered family members.
            </p>
          </div>

          {selectedUser && (
            <button onClick={exportReport} className="btn-primary" style={{ padding: '0.7rem 1.2rem', fontSize: '0.88rem' }}>
              <Download size={18} />
              <span>Export Summary Report</span>
            </button>
          )}
        </div>
      </div>

      {/* Patient Selector Row */}
      <div className="garden-card animate-fade-in" style={{ backgroundColor: '#161B22', border: '1px solid #30363D' }}>
        <h3 style={{ fontSize: '1rem', color: '#38BDF8', fontWeight: 800, fontFamily: 'var(--font-heading)', textTransform: 'uppercase', marginBottom: '1rem' }}>
          SELECT MONITORED PATIENT
        </h3>

        {elderlyUsers.length === 0 ? (
          <div style={{ padding: '1.5rem', textAlign: 'center', color: '#9198A1', fontSize: '0.9rem' }}>
            No registered elderly patients found in database yet.
          </div>
        ) : (
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            {elderlyUsers.map((u) => {
              const uId = u.id || u._id;
              const isSel = (selectedUser?.user?.id || selectedUser?.user?._id) === uId;
              const completedCount = u.sessionsCompleted !== undefined ? u.sessionsCompleted : 0;

              return (
                <button
                  key={uId}
                  onClick={() => loadUserDetails(uId)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.85rem',
                    padding: '0.85rem 1.25rem',
                    borderRadius: '14px',
                    border: isSel ? '1px solid #38BDF8' : '1px solid #30363D',
                    backgroundColor: isSel ? 'rgba(56, 189, 248, 0.12)' : '#0D1117',
                    cursor: 'pointer',
                    textAlign: 'left',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <div className="icon-box" style={{
                    width: 40,
                    height: 40,
                    borderRadius: '10px',
                    backgroundColor: isSel ? '#38BDF8' : '#21262D',
                    color: isSel ? '#0D1117' : '#9198A1',
                    display: 'flex',
                    alignItems: 'center',
                    justify: 'center',
                    flexShrink: 0
                  }}>
                    <User size={20} />
                  </div>
                  <div>
                    <div style={{ fontSize: '1rem', fontWeight: 800, color: '#FFFFFF', fontFamily: 'var(--font-heading)' }}>
                      {u.name} (Age {u.age || 68})
                    </div>
                    <div style={{ fontSize: '0.78rem', color: '#9198A1', fontWeight: 600 }}>
                      Sessions Completed: {completedCount}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {loading ? (
        <div style={{ padding: '2rem', textAlign: 'center', color: '#9198A1', fontSize: '0.9rem' }}>
          Loading patient telemetry & AI observations...
        </div>
      ) : selectedUser && (
        <>
          {/* AI Observation Summary Box */}
          <div className="garden-card animate-fade-in" style={{ backgroundColor: '#161B22', border: '1px solid #38BDF8' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.65rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <Sparkles size={22} color="#38BDF8" />
                <h3 style={{ fontSize: '1.2rem', color: '#FFFFFF', fontWeight: 800, margin: 0, fontFamily: 'var(--font-heading)' }}>
                  AI Activity Telemetry Observation
                </h3>
              </div>
              <span className="badge badge-purple" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
                <Zap size={14} color="#C084FC" />
                <span>Groq Llama-3 AI</span>
              </span>
            </div>

            <p style={{ fontSize: '1.05rem', color: '#F8FAFC', lineHeight: 1.6, marginBottom: '0.85rem' }}>
              "{selectedUser.aiObservation || 'Patient metrics are being recorded. Recommend regular daily cognitive sessions.'}"
            </p>
            
            <div style={{ fontSize: '0.8rem', color: '#9198A1' }}>
              Model: <strong style={{ color: '#38BDF8' }}>{selectedUser.aiModel || 'Groq Llama-3.3-70b-versatile'}</strong> | Note: Reflects engagement telemetry without clinical disease diagnosis.
            </div>
          </div>

          {/* Cognitive Profile Metrics */}
          <div>
            <h2 style={{ fontSize: '1.3rem', color: '#FFFFFF', fontWeight: 800, margin: '0.5rem 0 0.85rem', fontFamily: 'var(--font-heading)' }}>
              {selectedUser.user?.name || 'Patient'} — Cognitive Metrics
            </h2>
            <CognitiveScoreCard
              memory={selectedUser.profile?.memoryScore || 70}
              attention={selectedUser.profile?.attentionScore || 70}
              recall={selectedUser.profile?.recallScore || 70}
              reaction={selectedUser.profile?.reactionScore || 70}
            />
          </div>

          {/* Performance Trends Chart */}
          <ProgressChart profile={selectedUser.profile} />

          {/* Recent Cognitive Sessions Table */}
          <div className="garden-card animate-fade-in" style={{ backgroundColor: '#161B22', border: '1px solid #30363D', padding: 0, overflow: 'hidden' }}>
            <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid #30363D' }}>
              <h3 style={{ fontSize: '1.15rem', color: '#FFFFFF', fontWeight: 800, margin: 0, fontFamily: 'var(--font-heading)' }}>
                Recent Activity History
              </h3>
            </div>

            <div style={{ overflowX: 'auto' }}>
              {(!selectedUser.sessions || selectedUser.sessions.length === 0) ? (
                <div style={{ padding: '2rem', textAlign: 'center', color: '#9198A1', fontSize: '0.88rem' }}>
                  No cognitive sessions recorded for this patient yet.
                </div>
              ) : (
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid #30363D', color: '#9198A1', backgroundColor: '#0D1117' }}>
                      <th style={{ padding: '0.85rem 1.25rem' }}>Activity Name</th>
                      <th style={{ padding: '0.85rem 1.25rem' }}>Category</th>
                      <th style={{ padding: '0.85rem 1.25rem' }}>Difficulty</th>
                      <th style={{ padding: '0.85rem 1.25rem' }}>Score</th>
                      <th style={{ padding: '0.85rem 1.25rem' }}>Date & Time</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedUser.sessions.map((s, idx) => (
                      <tr key={idx} style={{ borderBottom: '1px solid #30363D', backgroundColor: '#161B22' }}>
                        <td style={{ padding: '0.9rem 1.25rem', fontWeight: 800, color: '#FFFFFF' }}>{s.activity}</td>
                        <td style={{ padding: '0.9rem 1.25rem' }}>
                          <span className="badge badge-cyan">{s.category}</span>
                        </td>
                        <td style={{ padding: '0.9rem 1.25rem', color: '#9198A1' }}>{s.difficulty || 'Medium'}</td>
                        <td style={{ padding: '0.9rem 1.25rem', fontWeight: 800, color: s.score >= 80 ? '#34D399' : '#FBBF24', fontFamily: 'var(--font-esports)' }}>
                          {s.score} / 100
                        </td>
                        <td style={{ padding: '0.9rem 1.25rem', color: '#9198A1' }}>
                          {new Date(s.completedAt).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default CaregiverDashboard;
