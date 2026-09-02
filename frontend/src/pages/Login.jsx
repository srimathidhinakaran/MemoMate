import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Flower2, UserCheck, ShieldCheck, ArrowRight } from 'lucide-react';

const Login = () => {
  const { login, loading } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('meena@example.com');
  const [password, setPassword] = useState('password123');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setError('');
      const data = await login({ email, password });
      if (data.user.role === 'caregiver') {
        navigate('/caregiver');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    }
  };

  const loginAsDemoUser = async (userEmail) => {
    try {
      const data = await login({ email: userEmail, password: 'password123' });
      if (data.user.role === 'caregiver') {
        navigate('/caregiver');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      setError('Failed to login demo user.');
    }
  };

  return (
    <div style={{
      minHeight: '80vh',
      display: 'flex',
      alignItems: 'center',
      justify: 'center',
      padding: '2rem'
    }}>
      <div className="garden-card animate-fade-in" style={{ maxWidth: 480, width: '100%', padding: '2.5rem 2rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{
            width: 60,
            height: 60,
            borderRadius: '50%',
            backgroundColor: '#EBF2EC',
            display: 'flex',
            alignItems: 'center',
            justify: 'center',
            margin: '0 auto 1rem'
          }}>
            <Flower2 size={34} color="#58755E" />
          </div>
          <h1 style={{ fontSize: '2rem', color: '#1C3B2B', marginBottom: '0.4rem' }}>MemoMate 🌱</h1>
          <p style={{ color: '#536B5C', fontSize: '1.05rem' }}>
            Growing memories, one day at a time.
          </p>
        </div>

        {error && (
          <div style={{
            backgroundColor: '#FDF3F0',
            color: '#C87862',
            padding: '0.85rem',
            borderRadius: '12px',
            marginBottom: '1.25rem',
            fontSize: '0.9rem',
            fontWeight: 600
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.95rem', fontWeight: 700, color: '#1C3B2B', marginBottom: '0.4rem' }}>
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '0.85rem 1rem',
                borderRadius: '14px',
                border: '1.5px solid #E6E0D4',
                fontSize: '1rem',
                outline: 'none'
              }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.95rem', fontWeight: 700, color: '#1C3B2B', marginBottom: '0.4rem' }}>
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '0.85rem 1rem',
                borderRadius: '14px',
                border: '1.5px solid #E6E0D4',
                fontSize: '1rem',
                outline: 'none'
              }}
            />
          </div>

          <button type="submit" disabled={loading} className="btn-primary" style={{ padding: '1rem', width: '100%', marginTop: '0.5rem' }}>
            <span>{loading ? 'Logging in...' : 'Start Session'}</span>
            <ArrowRight size={20} />
          </button>
        </form>

        {/* Demo Quick Shortcuts for Hackathon Evaluation */}
        <div style={{ marginTop: '2rem', paddingTop: '1.5rem', borderTop: '1px dashed #E6E0D4' }}>
          <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#7E9687', textAlign: 'center', marginBottom: '0.85rem', textTransform: 'uppercase' }}>
            ⚡ Hackathon Demo Shortcuts
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
            <button
              onClick={() => loginAsDemoUser('meena@example.com')}
              className="btn-secondary"
              style={{ width: '100%', justifyContent: 'flex-start', padding: '0.75rem 1rem' }}
            >
              <UserCheck size={18} />
              <div style={{ textAlign: 'left' }}>
                <div style={{ fontSize: '0.95rem', fontWeight: 700 }}>Log in as Patient (Meena, 68)</div>
                <div style={{ fontSize: '0.78rem', color: '#536B5C' }}>Initial metrics: Memory 82, Attention 64</div>
              </div>
            </button>

            <button
              onClick={() => loginAsDemoUser('caregiver@example.com')}
              className="btn-secondary"
              style={{ width: '100%', justifyContent: 'flex-start', padding: '0.75rem 1rem', borderColor: '#B8A7D9', backgroundColor: '#F2EFF9', color: '#7A66A3' }}
            >
              <ShieldCheck size={18} color="#7A66A3" />
              <div style={{ textAlign: 'left' }}>
                <div style={{ fontSize: '0.95rem', fontWeight: 700 }}>Log in as Caregiver (Dr. Sharma)</div>
                <div style={{ fontSize: '0.78rem', color: '#7A66A3' }}>Monitor patient cognitive trends & AI insights</div>
              </div>
            </button>
          </div>
        </div>

        <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.9rem', color: '#536B5C' }}>
          Don't have an account?{' '}
          <Link to="/register" style={{ color: '#58755E', fontWeight: 700, textDecoration: 'none' }}>
            Register here
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
