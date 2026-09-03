import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { soundFx } from '../utils/soundEffects';
import { Swords, ArrowRight, User, Mail, Lock, ShieldCheck } from 'lucide-react';

const Register = () => {
  const { register, loading } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('elderly');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    soundFx.playClick();
    try {
      setError('');
      const data = await register({ name, age: Number(age) || 68, email, password, role });
      soundFx.playLevelUp();
      if (data.user.role === 'caregiver') {
        navigate('/caregiver');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
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
        maxWidth: 480,
        width: '100%',
        padding: '2.5rem 2.2rem',
        border: '1px solid rgba(0, 242, 254, 0.3)',
        boxShadow: '0 0 40px rgba(0, 242, 254, 0.15)'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '1.8rem' }}>
          <div style={{
            width: 60,
            height: 60,
            borderRadius: '16px',
            background: 'linear-gradient(135deg, #00F2FE 0%, #A855F7 100%)',
            display: 'flex',
            alignItems: 'center',
            justify: 'center',
            margin: '0 auto 1rem',
            boxShadow: '0 0 20px rgba(0, 242, 254, 0.4)'
          }}>
            <Swords size={30} color="#050B14" />
          </div>

          <h1 style={{
            fontSize: '2rem',
            color: '#F8FAFC',
            fontWeight: 900,
            fontFamily: 'var(--font-esports)',
            margin: 0,
            letterSpacing: '0.04em'
          }}>
            CREATE PLAYER PROFILE
          </h1>
          <div style={{ fontSize: '0.8rem', color: '#00F2FE', fontWeight: 800, fontFamily: 'var(--font-esports)', letterSpacing: '0.1em', marginTop: '0.3rem' }}>
            JOIN MEMOMATE COGNITIVE ARENA
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

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 800, fontFamily: 'var(--font-esports)', color: '#F8FAFC', marginBottom: '0.35rem' }}>
              FULL NAME
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Ramesh Kumar"
              required
              style={{
                width: '100%',
                padding: '0.8rem 1rem',
                borderRadius: '12px',
                border: '1px solid rgba(0, 242, 254, 0.25)',
                backgroundColor: '#090C15',
                color: '#F8FAFC',
                fontSize: '0.95rem',
                outline: 'none'
              }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 800, fontFamily: 'var(--font-esports)', color: '#F8FAFC', marginBottom: '0.35rem' }}>
                AGE
              </label>
              <input
                type="number"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                placeholder="68"
                required
                style={{
                  width: '100%',
                  padding: '0.8rem 1rem',
                  borderRadius: '12px',
                  border: '1px solid rgba(0, 242, 254, 0.25)',
                  backgroundColor: '#090C15',
                  color: '#F8FAFC',
                  fontSize: '0.95rem',
                  outline: 'none'
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 800, fontFamily: 'var(--font-esports)', color: '#F8FAFC', marginBottom: '0.35rem' }}>
                ACCOUNT ROLE
              </label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.8rem 1rem',
                  borderRadius: '12px',
                  border: '1px solid rgba(0, 242, 254, 0.25)',
                  backgroundColor: '#090C15',
                  color: '#F8FAFC',
                  fontSize: '0.9rem',
                  outline: 'none'
                }}
              >
                <option value="elderly">Hero Player</option>
                <option value="caregiver">Caregiver Portal</option>
              </select>
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 800, fontFamily: 'var(--font-esports)', color: '#F8FAFC', marginBottom: '0.35rem' }}>
              EMAIL ADDRESS
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. player@example.com"
              required
              style={{
                width: '100%',
                padding: '0.8rem 1rem',
                borderRadius: '12px',
                border: '1px solid rgba(0, 242, 254, 0.25)',
                backgroundColor: '#090C15',
                color: '#F8FAFC',
                fontSize: '0.95rem',
                outline: 'none'
              }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 800, fontFamily: 'var(--font-esports)', color: '#F8FAFC', marginBottom: '0.35rem' }}>
              PASSWORD
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Create password"
              required
              style={{
                width: '100%',
                padding: '0.8rem 1rem',
                borderRadius: '12px',
                border: '1px solid rgba(0, 242, 254, 0.25)',
                backgroundColor: '#090C15',
                color: '#F8FAFC',
                fontSize: '0.95rem',
                outline: 'none'
              }}
            />
          </div>

          <button type="submit" disabled={loading} className="btn-primary" style={{ padding: '0.95rem', width: '100%', marginTop: '0.5rem' }}>
            <span>{loading ? 'REGISTERING...' : 'COMPLETE REGISTRATION'}</span>
            <ArrowRight size={20} />
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '1.6rem', fontSize: '0.9rem', color: '#94A3B8' }}>
          Already registered?{' '}
          <Link to="/login" style={{ color: '#00F2FE', fontWeight: 800, textDecoration: 'none' }}>
            Log in here
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
