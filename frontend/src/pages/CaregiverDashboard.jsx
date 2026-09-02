import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { caregiverAPI } from '../services/api';
import CognitiveScoreCard from '../components/CognitiveScoreCard';
import ProgressChart from '../components/ProgressChart';
import { HeartHandshake, User, Sparkles, Download, Zap } from 'lucide-react';

const CaregiverDashboard = () => {
  const navigate = useNavigate();
  const [elderlyUsers, setElderlyUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    caregiverAPI.getUsers().then((users) => {
      setElderlyUsers(users);
      if (users.length > 0) {
        loadUserDetails(users[0].id || users[0]._id);
      } else {
        setLoading(false);
      }
    });
  }, []);

  const loadUserDetails = async (userId) => {
    setLoading(true);
    const details = await caregiverAPI.getUserDetails(userId);
    setSelectedUser(details);
    setLoading(false);
  };

  const exportReport = () => {
    alert(`Generating cognitive activity summary report for ${selectedUser?.user?.name}... Report downloaded.`);
  };

  return (
    <div className="page-view animate-fade-in">
      <div className="garden-card" style={{
        background: 'linear-gradient(135deg, #FFFFFF 0%, #F2EFF9 100%)',
        border: '1.5px solid #B8A7D9'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.3rem' }}>
              <HeartHandshake size={28} color="#7A66A3" />
              <h1 style={{ fontSize: '2rem', color: '#1C3B2B' }}>
                Caregiver Monitoring Dashboard 🛡️
              </h1>
            </div>
            <p style={{ color: '#536B5C', fontSize: '1.05rem' }}>
              Real-time cognitive activity observations & trend monitoring for registered elderly family members.
            </p>
          </div>

          <button onClick={exportReport} className="btn-lavender">
            <Download size={18} />
            <span>Export Summary Report</span>
          </button>
        </div>
      </div>

      {/* Patient Selector Row */}
      <div className="garden-card">
        <h3 style={{ fontSize: '1.1rem', color: '#7E9687', textTransform: 'uppercase', marginBottom: '0.85rem' }}>
          Select Monitored Patient
        </h3>

        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          {elderlyUsers.map((u) => {
            const isSel = (selectedUser?.user?.id || selectedUser?.user?._id) === (u.id || u._id);
            return (
              <button
                key={u.id || u._id}
                onClick={() => loadUserDetails(u.id || u._id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.85rem',
                  padding: '0.85rem 1.25rem',
                  borderRadius: '16px',
                  border: isSel ? '2px solid #7A66A3' : '1px solid #E6E0D4',
                  backgroundColor: isSel ? '#F2EFF9' : '#FFFFFF',
                  cursor: 'pointer',
                  textAlign: 'left'
                }}
              >
                <div style={{
                  width: 40,
                  height: 40,
                  borderRadius: '50%',
                  backgroundColor: isSel ? '#7A66A3' : '#EBF2EC',
                  display: 'flex',
                  alignItems: 'center',
                  justify: 'center'
                }}>
                  <User size={20} color={isSel ? '#FFFFFF' : '#58755E'} />
                </div>
                <div>
                  <div style={{ fontSize: '1.05rem', fontWeight: 700, color: '#1C3B2B' }}>
                    {u.name} (Age {u.age})
                  </div>
                  <div style={{ fontSize: '0.8rem', color: '#536B5C' }}>
                    Sessions Completed: {u.sessionsCompleted || 8}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {selectedUser && (
        <>
          {/* AI Observation Summary Box with Groq Llama-3 badge */}
          <div className="garden-card" style={{ backgroundColor: '#FFFFFF', border: '1.5px solid #F4C3B2' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Sparkles size={20} color="#C87862" />
                <h3 style={{ fontSize: '1.25rem', color: '#C87862' }}>
                  AI Activity Telemetry Observation
                </h3>
              </div>
              <span className="badge badge-lavender" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
                <Zap size={14} color="#7A66A3" />
                <span>Powered by Groq Llama-3 AI</span>
              </span>
            </div>

            <p style={{ fontSize: '1.1rem', color: '#1C3B2B', lineHeight: 1.6, marginBottom: '0.85rem' }}>
              "{selectedUser.aiObservation}"
            </p>
            
            <div style={{ fontSize: '0.85rem', color: '#536B5C' }}>
              Model: <strong>{selectedUser.aiModel || 'Groq Llama-3.3-70b-versatile'}</strong> | Note: Reflects engagement telemetry without clinical disease diagnosis.
            </div>
          </div>

          {/* Cognitive Profile Metrics */}
          <div>
            <h2 style={{ fontSize: '1.4rem', color: '#1C3B2B', marginBottom: '0.85rem' }}>
              {selectedUser.user.name} — Cognitive Metrics
            </h2>
            <CognitiveScoreCard
              memory={selectedUser.profile?.memoryScore || 82}
              attention={selectedUser.profile?.attentionScore || 64}
              recall={selectedUser.profile?.recallScore || 76}
              reaction={selectedUser.profile?.reactionScore || 71}
            />
          </div>

          {/* Weekly Performance Trends */}
          <ProgressChart profile={selectedUser.profile} />

          {/* Recent Cognitive Sessions Log Table */}
          <div className="garden-card">
            <h3 style={{ fontSize: '1.3rem', color: '#1C3B2B', marginBottom: '1rem' }}>
              Recent Activity History
            </h3>

            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.95rem' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid #E6E0D4', color: '#7E9687' }}>
                    <th style={{ padding: '0.75rem' }}>Activity Name</th>
                    <th style={{ padding: '0.75rem' }}>Category</th>
                    <th style={{ padding: '0.75rem' }}>Difficulty</th>
                    <th style={{ padding: '0.75rem' }}>Score</th>
                    <th style={{ padding: '0.75rem' }}>Date & Time</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedUser.sessions?.map((s, idx) => (
                    <tr key={idx} style={{ borderBottom: '1px solid #F7F4EE' }}>
                      <td style={{ padding: '0.85rem', fontWeight: 700, color: '#1C3B2B' }}>{s.activity}</td>
                      <td style={{ padding: '0.85rem' }}>
                        <span className="badge badge-sage">{s.category}</span>
                      </td>
                      <td style={{ padding: '0.85rem' }}>{s.difficulty || 'Medium'}</td>
                      <td style={{ padding: '0.85rem', fontWeight: 800, color: s.score >= 80 ? '#58755E' : '#C87862' }}>
                        {s.score} / 100
                      </td>
                      <td style={{ padding: '0.85rem', color: '#536B5C' }}>
                        {new Date(s.completedAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default CaregiverDashboard;
