import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { soundFx } from '../utils/soundEffects';
import { Swords, UserCheck, ShieldCheck, ArrowRight, Lock, Mail, Sparkles } from 'lucide-react';

const Login = () => {
  const { login, loading } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    soundFx.playClick();
    try {
      setError('');
      const data = await login({ email, password });
      soundFx.playLevelUp();
      if (data.user.role === 'caregiver') {
        navigate('/caregiver');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
    }
  };

  return (
    <div style={{
      minHeight: '85vh',
      display: 'flex',
      alignItems: 'center',
      justify: 'center',
      padding: '2rem 1rem'
    }}>
      <div className="garden-card animate-fade-in" style={{
        maxWidth: 460,
        width: '100%',
        padding: '2.5rem 2.2rem',
        border: '1px solid rgba(0, 242, 254, 0.3)',
        boxShadow: '0 0 40px rgba(0, 242, 254, 0.15)'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{
            width: 64,
            height: 64,
            borderRadius: '16px',
            background: 'linear-gradient(135deg, #00F2FE 0%, #A855F7 100%)',
            display: 'flex',
            alignItems: 'center',
            justify: 'center',
            margin: '0 auto 1.2rem',
            boxShadow: '0 0 20px rgba(0, 242, 254, 0.4)'
          }}>
            <Swords size={32} color="#050B14" />
          </div>

          <h1 style={{
            fontSize: '2.2rem',
            color: '#F8FAFC',
            fontWeight: 900,
            fontFamily: 'var(--font-esports)',
            margin: 0,
            letterSpacing: '0.04em'
          }}>
            MEMOMATE
          </h1>
          <div style={{ fontSize: '0.85rem', color: '#00F2FE', fontWeight: 800, fontFamily: 'var(--font-esports)', letterSpacing: '0.1em', marginTop: '0.3rem' }}>
            COGNITIVE ARENA LOGIN
          </div>
        </div>

        {error && (
          <div style={{
            backgroundColor: 'rgba(255, 78, 80, 0.15)',
            border: '1px solid rgba(255, 78, 80, 0.4)',
            color: '#FF4E50',
            padding: '0.85rem 1rem',
            borderRadius: '12px',
            marginBottom: '1.25rem',
            fontSize: '0.85rem',
            fontWeight: 700,
            textAlign: 'center'
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 800, fontFamily: 'var(--font-esports)', color: '#F8FAFC', marginBottom: '0.4rem' }}>
              EMAIL ADDRESS
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
                style={{
                  width: '100%',
                  padding: '0.85rem 1rem 0.85rem 2.6rem',
                  borderRadius: '12px',
                  border: '1px solid rgba(0, 242, 254, 0.25)',
                  backgroundColor: '#090C15',
                  color: '#F8FAFC',
                  fontSize: '0.95rem',
                  outline: 'none'
                }}
              />
              <Mail size={18} color="#00F2FE" style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)' }} />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 800, fontFamily: 'var(--font-esports)', color: '#F8FAFC', marginBottom: '0.4rem' }}>
              PASSWORD
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
                style={{
                  width: '100%',
                  padding: '0.85rem 1rem 0.85rem 2.6rem',
                  borderRadius: '12px',
                  border: '1px solid rgba(0, 242, 254, 0.25)',
                  backgroundColor: '#090C15',
                  color: '#F8FAFC',
                  fontSize: '0.95rem',
                  outline: 'none'
                }}
              />
              <Lock size={18} color="#00F2FE" style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)' }} />
            </div>
          </div>

          <button type="submit" disabled={loading} className="btn-primary" style={{ padding: '0.95rem', width: '100%', marginTop: '0.5rem' }}>
            <span>{loading ? 'AUTHENTICATING...' : 'ENTER COGNITIVE ARENA'}</span>
            <ArrowRight size={20} />
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '1.8rem', fontSize: '0.9rem', color: '#94A3B8' }}>
          Don't have an account yet?{' '}
          <Link to="/register" style={{ color: '#00F2FE', fontWeight: 800, textDecoration: 'none' }}>
            Register Now
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
