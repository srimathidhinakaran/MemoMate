import React, { useState } from 'react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from 'recharts';

const ProgressChart = ({ profile }) => {
  const [range, setRange] = useState('7days'); // '7days' | '30days'

  const data7Days = [
    { day: 'Mon', Memory: 78, Attention: 60, Recall: 72, Reaction: 68 },
    { day: 'Tue', Memory: 80, Attention: 62, Recall: 74, Reaction: 70 },
    { day: 'Wed', Memory: 81, Attention: 61, Recall: 75, Reaction: 69 },
    { day: 'Thu', Memory: 80, Attention: 63, Recall: 76, Reaction: 71 },
    { day: 'Fri', Memory: 82, Attention: 64, Recall: 76, Reaction: 71 },
    { day: 'Sat', Memory: 84, Attention: 66, Recall: 78, Reaction: 72 },
    { day: 'Sun', Memory: profile?.memoryScore || 85, Attention: profile?.attentionScore || 68, Recall: profile?.recallScore || 79, Reaction: profile?.reactionScore || 73 }
  ];

  const data30Days = [
    { day: 'Week 1', Memory: 74, Attention: 56, Recall: 68, Reaction: 65 },
    { day: 'Week 2', Memory: 78, Attention: 60, Recall: 72, Reaction: 68 },
    { day: 'Week 3', Memory: 81, Attention: 62, Recall: 75, Reaction: 70 },
    { day: 'Week 4', Memory: profile?.memoryScore || 84, Attention: profile?.attentionScore || 66, Recall: profile?.recallScore || 78, Reaction: profile?.reactionScore || 72 }
  ];

  const activeData = range === '7days' ? data7Days : data30Days;

  return (
    <div className="garden-card animate-fade-in">
      <div className="garden-card-header">
        <div>
          <h3 style={{ fontSize: '1.3rem', color: '#1C3B2B' }}>Cognitive Performance Trends 📈</h3>
          <p style={{ fontSize: '0.88rem', color: '#536B5C' }}>
            Tracking score improvements across Memory, Attention, Recall, and Reaction
          </p>
        </div>

        {/* Range Selector */}
        <div style={{ display: 'flex', gap: '0.5rem', backgroundColor: '#F7F4EE', padding: '0.25rem', borderRadius: 9999, border: '1px solid #E6E0D4' }}>
          <button
            onClick={() => setRange('7days')}
            className={`badge ${range === '7days' ? 'badge-sage' : ''}`}
            style={{ border: 'none', cursor: 'pointer', padding: '0.35rem 0.85rem' }}
          >
            Last 7 Days
          </button>
          <button
            onClick={() => setRange('30days')}
            className={`badge ${range === '30days' ? 'badge-sage' : ''}`}
            style={{ border: 'none', cursor: 'pointer', padding: '0.35rem 0.85rem' }}
          >
            Last 30 Days
          </button>
        </div>
      </div>

      <div style={{ width: '100%', height: 320, marginTop: '1rem' }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={activeData} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E6E0D4" />
            <XAxis dataKey="day" stroke="#536B5C" fontSize={12} tickLine={false} />
            <YAxis stroke="#536B5C" fontSize={12} domain={[40, 100]} tickLine={false} />
            <Tooltip
              contentStyle={{
                backgroundColor: '#FFFFFF',
                borderRadius: '12px',
                border: '1px solid #E6E0D4',
                boxShadow: '0 8px 20px rgba(0,0,0,0.08)'
              }}
            />
            <Legend wrapperStyle={{ paddingTop: 10 }} />
            <Line type="monotone" dataKey="Memory" stroke="#58755E" strokeWidth={3} dot={{ r: 5 }} />
            <Line type="monotone" dataKey="Attention" stroke="#C87862" strokeWidth={3} dot={{ r: 5 }} />
            <Line type="monotone" dataKey="Recall" stroke="#7A66A3" strokeWidth={3} dot={{ r: 5 }} />
            <Line type="monotone" dataKey="Reaction" stroke="#3B7A8C" strokeWidth={3} dot={{ r: 5 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ProgressChart;
