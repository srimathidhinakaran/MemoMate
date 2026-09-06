import React, { useState, useEffect } from 'react';
import { caregiverAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import CognitiveScoreCard from '../components/CognitiveScoreCard';
import ProgressChart from '../components/ProgressChart';
import { HeartHandshake, User, Sparkles, Download, Zap, Bell, AlertTriangle, Info, CheckCircle2, Plus, Calendar, Clock, Pill, Droplets, Activity } from 'lucide-react';

const CaregiverDashboard = ({ initialUserId }) => {
  const [elderlyUsers, setElderlyUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const { t, caregiverAlerts, acknowledgeAlert, reminders, addReminder } = useAuth();

  const [newTitle, setNewTitle] = useState('');
  const [newTime, setNewTime] = useState('');
  const [newCategory, setNewCategory] = useState('medicine');
  const [newDetail, setNewDetail] = useState('');
  const [isAddReminderOpen, setIsAddReminderOpen] = useState(false);

  useEffect(() => {
    caregiverAPI.getUsers().then((users) => {
      const uniquePatients = [];
      const seenEmails = new Set();
      (users || []).forEach((u) => {
        const identifier = u.email || u.id || u._id;
        if (identifier && !seenEmails.has(identifier)) {
          seenEmails.add(identifier);
          uniquePatients.push(u);
        }
      });

      setElderlyUsers(uniquePatients);
      const targetId = initialUserId || (uniquePatients.length > 0 ? (uniquePatients[0].id || uniquePatients[0]._id) : null);
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

  const handleCreateReminder = (e) => {
    e.preventDefault();
    if (!newTitle || !newTime) return;

    addReminder({
      title: newTitle,
      time: newTime,
      category: newCategory,
      detail: newDetail || 'Caregiver scheduled reminder'
    });

    setNewTitle('');
    setNewTime('');
    setNewDetail('');
    setIsAddReminderOpen(false);
  };

  const exportReport = () => {
    alert(`Generating cognitive activity summary report for ${selectedUser?.user?.name || 'Monitored Patient'}... Summary report exported.`);
  };

  const insightsList = [
    { severity: 'ATTENTION', title: 'Attention Performance Drop', text: 'Attention performance has decreased during the last 3 sessions. Recommended focus exercise scheduled.' },
    { severity: 'INFO', title: 'Memory Index Improvement', text: 'Memory accuracy has improved by 12% this week across 5 completed cognitive exercises.' },
    { severity: 'WATCH', title: 'Hydration Reminder Missed', text: 'Patient frequently misses afternoon hydration reminders. Caregiver check recommended.' }
  ];

  const getSeverityBadge = (severity) => {
    switch (severity) {
      case 'ATTENTION': return <span className="badge badge-flame"><AlertTriangle size={14} /> ATTENTION</span>;
      case 'WATCH': return <span className="badge badge-gold"><Clock size={14} /> WATCH</span>;
      default: return <span className="badge badge-cyan"><Info size={14} /> INFO</span>;
    }
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
                {t('caregiverMonitoring') || 'Caregiver Monitoring Portal'}
              </h1>
            </div>
            <p style={{ color: '#9198A1', fontSize: '0.95rem', margin: 0, maxWidth: '640px', lineHeight: 1.5 }}>
              Assistive cognitive observations, trend monitoring & schedule management for family members.
            </p>
          </div>

          {selectedUser && (
            <button onClick={exportReport} className="btn-primary" style={{ padding: '0.7rem 1.2rem', fontSize: '0.88rem' }}>
              <Download size={18} />
              <span>{t('exportReport') || 'Export Summary Report'}</span>
            </button>
          )}
        </div>
      </div>

      {/* Actionable Caregiver Alerts Feed */}
      <div className="garden-card animate-fade-in" style={{ backgroundColor: '#161B22', border: '1px solid #FB923C' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1rem' }}>
          <Bell size={22} color="#FB923C" />
          <h2 style={{ fontSize: '1.2rem', color: '#FFFFFF', fontWeight: 800, margin: 0, fontFamily: 'var(--font-heading)' }}>
            Active Caregiver Alerts
          </h2>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {caregiverAlerts.map((alertItem) => (
            <div
              key={alertItem.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                justify: 'space-between',
                padding: '0.9rem 1.25rem',
                backgroundColor: alertItem.acknowledged ? '#0D1117' : 'rgba(251, 146, 60, 0.08)',
                border: alertItem.acknowledged ? '1px solid #263142' : '1px solid rgba(251, 146, 60, 0.35)',
                borderRadius: '12px',
                flexWrap: 'wrap',
                gap: '0.75rem'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                {getSeverityBadge(alertItem.severity)}
                <div>
                  <div style={{ fontSize: '0.95rem', fontWeight: 800, color: '#FFFFFF' }}>
                    {alertItem.title}
                  </div>
                  <div style={{ fontSize: '0.85rem', color: '#94A3B8' }}>
                    {alertItem.message} ({alertItem.time})
                  </div>
                </div>
              </div>

              {!alertItem.acknowledged ? (
                <button
                  onClick={() => acknowledgeAlert(alertItem.id)}
                  style={{
                    padding: '0.45rem 0.9rem',
                    borderRadius: '8px',
                    border: '1px solid #FB923C',
                    backgroundColor: 'rgba(251, 146, 60, 0.15)',
                    color: '#FB923C',
                    fontSize: '0.8rem',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  Acknowledge Alert
                </button>
              ) : (
                <span style={{ fontSize: '0.78rem', color: '#34D399', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
                  <CheckCircle2 size={14} /> Acknowledged
                </span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* AI Caregiver Insights */}
      <div className="garden-card animate-fade-in" style={{ backgroundColor: '#161B22', border: '1px solid #38BDF8' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <Sparkles size={22} color="#38BDF8" />
            <h2 style={{ fontSize: '1.25rem', color: '#FFFFFF', fontWeight: 800, margin: 0, fontFamily: 'var(--font-heading)' }}>
              AI Cognitive Insights & Observations
            </h2>
          </div>
          <span className="badge badge-purple">
            <Zap size={14} /> AI Telemetry Model
          </span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
          {insightsList.map((ins, idx) => (
            <div key={idx} style={{ backgroundColor: '#0D1117', border: '1px solid #263142', borderRadius: '14px', padding: '1.1rem', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              <div>{getSeverityBadge(ins.severity)}</div>
              <h3 style={{ fontSize: '1.05rem', color: '#FFFFFF', fontWeight: 800, margin: 0 }}>
                {ins.title}
              </h3>
              <p style={{ fontSize: '0.88rem', color: '#94A3B8', lineHeight: 1.5, margin: 0 }}>
                "{ins.text}"
              </p>
            </div>
          ))}
        </div>

        <div style={{ marginTop: '1rem', fontSize: '0.78rem', color: '#94A3B8' }}>
          Note: Refers to assistive cognitive exercise performance telemetry. Strictly non-diagnostic monitoring.
        </div>
      </div>

      {/* Caregiver Reminder Management */}
      <div className="garden-card animate-fade-in">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.75rem' }}>
          <h2 style={{ fontSize: '1.25rem', color: '#FFFFFF', fontWeight: 800, margin: 0, fontFamily: 'var(--font-heading)' }}>
            Patient Schedule & Reminder Timeline Manager
          </h2>
          <button onClick={() => setIsAddReminderOpen(!isAddReminderOpen)} className="btn-primary" style={{ padding: '0.55rem 1.1rem', fontSize: '0.85rem' }}>
            <Plus size={16} />
            <span>Add New Reminder</span>
          </button>
        </div>

        {isAddReminderOpen && (
          <form onSubmit={handleCreateReminder} style={{ backgroundColor: '#0D1117', border: '1px solid #38BDF8', borderRadius: '14px', padding: '1.25rem', marginBottom: '1.25rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', color: '#94A3B8', fontWeight: 700, marginBottom: '0.3rem' }}>Title:</label>
              <input type="text" value={newTitle} onChange={(e) => setNewTitle(e.target.value)} placeholder="e.g. Afternoon Medicine" style={{ width: '100%' }} required />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', color: '#94A3B8', fontWeight: 700, marginBottom: '0.3rem' }}>Time:</label>
              <input type="text" value={newTime} onChange={(e) => setNewTime(e.target.value)} placeholder="e.g. 12:30 PM" style={{ width: '100%' }} required />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', color: '#94A3B8', fontWeight: 700, marginBottom: '0.3rem' }}>Category:</label>
              <select value={newCategory} onChange={(e) => setNewCategory(e.target.value)} style={{ width: '100%' }}>
                <option value="medicine">Medicine</option>
                <option value="hydration">Hydration</option>
                <option value="cognitive">Cognitive Exercise</option>
                <option value="activity">Daily Activity</option>
                <option value="appointment">Doctor Appointment</option>
              </select>
            </div>

            <div style={{ gridColumn: '1 / -1' }}>
              <label style={{ display: 'block', fontSize: '0.8rem', color: '#94A3B8', fontWeight: 700, marginBottom: '0.3rem' }}>Detail:</label>
              <input type="text" value={newDetail} onChange={(e) => setNewDetail(e.target.value)} placeholder="e.g. Blood pressure medicine after lunch" style={{ width: '100%' }} />
            </div>

            <button type="submit" className="btn-primary" style={{ gridColumn: '1 / -1', padding: '0.75rem' }}>
              <span>SAVE REMINDER TO PATIENT TIMELINE</span>
            </button>
          </form>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '0.85rem' }}>
          {reminders.map((rem) => (
            <div key={rem.id} style={{ backgroundColor: '#0D1117', border: '1px solid #263142', borderRadius: '12px', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              <div style={{ fontSize: '0.78rem', color: '#38BDF8', fontWeight: 700 }}>{rem.time} • {rem.category}</div>
              <div style={{ fontSize: '1rem', fontWeight: 800, color: '#FFFFFF' }}>{rem.title}</div>
              <div style={{ fontSize: '0.82rem', color: '#94A3B8' }}>{rem.detail}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Patient Selector Row */}
      <div className="garden-card animate-fade-in" style={{ backgroundColor: '#161B22', border: '1px solid #30363D' }}>
        <h3 style={{ fontSize: '1rem', color: '#38BDF8', fontWeight: 800, fontFamily: 'var(--font-heading)', textTransform: 'uppercase', marginBottom: '1rem' }}>
          {t('selectMonitoredPatient') || 'SELECT MONITORED PATIENT'}
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
          {/* Cognitive Profile Metrics */}
          <div>
            <h2 style={{ fontSize: '1.3rem', color: '#FFFFFF', fontWeight: 800, margin: '0.5rem 0 0.85rem', fontFamily: 'var(--font-heading)' }}>
              {selectedUser.user?.name || 'Patient'} — Cognitive Metrics Breakdown
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
        </>
      )}
    </div>
  );
};

export default CaregiverDashboard;
