import React, { useState } from 'react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from 'recharts';

const ProgressChart = ({ profile }) => {
  const [range, setRange] = useState('7days'); // '7days' | '30days'

  const memoryScore = profile?.memoryScore || 88;
  const attentionScore = profile?.attentionScore || 64;
  const recallScore = profile?.recallScore || 76;
  const reactionScore = profile?.reactionScore || 71;

  const data7Days = [
    { day: 'Mon', Memory: 78, Attention: 60, Recall: 72, Reaction: 68 },
    { day: 'Tue', Memory: 80, Attention: 62, Recall: 74, Reaction: 70 },
    { day: 'Wed', Memory: 81, Attention: 61, Recall: 75, Reaction: 69 },
    { day: 'Thu', Memory: 80, Attention: 63, Recall: 76, Reaction: 71 },
    { day: 'Fri', Memory: 82, Attention: 64, Recall: 76, Reaction: 71 },
    { day: 'Sat', Memory: 84, Attention: 66, Recall: 78, Reaction: 72 },
    { day: 'Sun', Memory: memoryScore, Attention: attentionScore, Recall: recallScore, Reaction: reactionScore }
  ];

  const data30Days = [
    { day: 'Week 1', Memory: 74, Attention: 56, Recall: 68, Reaction: 65 },
    { day: 'Week 2', Memory: 78, Attention: 60, Recall: 72, Reaction: 68 },
    { day: 'Week 3', Memory: 81, Attention: 62, Recall: 75, Reaction: 70 },
    { day: 'Week 4', Memory: memoryScore, Attention: attentionScore, Recall: recallScore, Reaction: reactionScore }
  ];

  const activeData = range === '7days' ? data7Days : data30Days;

  return (
    <div className="garden-card animate-fade-in" style={{ backgroundColor: '#161B22', border: '1px solid #30363D' }}>
      <div className="garden-card-header">
        <div>
          <h3 style={{ fontSize: '1.3rem', color: '#FFFFFF', fontWeight: 800, fontFamily: 'var(--font-heading)' }}>
            Cognitive Performance Trends 📈
          </h3>
          <p style={{ fontSize: '0.88rem', color: '#9198A1', margin: 0 }}>
            Tracking score improvements across Memory, Attention, Recall, and Reaction
          </p>
        </div>

        {/* Range Selector */}
        <div style={{ display: 'flex', gap: '0.4rem', backgroundColor: '#0D1117', padding: '0.3rem', borderRadius: '12px', border: '1px solid #30363D' }}>
          <button
            onClick={() => setRange('7days')}
            className={`badge ${range === '7days' ? 'badge-cyan' : ''}`}
            style={{ border: 'none', cursor: 'pointer', padding: '0.35rem 0.85rem' }}
          >
            Last 7 Days
          </button>
          <button
            onClick={() => setRange('30days')}
            className={`badge ${range === '30days' ? 'badge-cyan' : ''}`}
            style={{ border: 'none', cursor: 'pointer', padding: '0.35rem 0.85rem' }}
          >
            Last 30 Days
          </button>
        </div>
      </div>

      <div style={{ width: '100%', height: 320, marginTop: '1rem' }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={activeData} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#30363D" />
            <XAxis dataKey="day" stroke="#9198A1" fontSize={12} tickLine={false} />
            <YAxis stroke="#9198A1" fontSize={12} domain={[40, 100]} tickLine={false} />
            <Tooltip
              contentStyle={{
                backgroundColor: '#161B22',
                borderRadius: '12px',
                border: '1px solid #30363D',
                color: '#FFFFFF',
                boxShadow: '0 8px 25px rgba(0,0,0,0.5)'
              }}
            />
            <Legend wrapperStyle={{ paddingTop: 10, color: '#9198A1' }} />
            <Line type="monotone" dataKey="Memory" stroke="#38BDF8" strokeWidth={3} dot={{ r: 5 }} />
            <Line type="monotone" dataKey="Attention" stroke="#FF4E50" strokeWidth={3} dot={{ r: 5 }} />
            <Line type="monotone" dataKey="Recall" stroke="#A855F7" strokeWidth={3} dot={{ r: 5 }} />
            <Line type="monotone" dataKey="Reaction" stroke="#34D399" strokeWidth={3} dot={{ r: 5 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ProgressChart;
