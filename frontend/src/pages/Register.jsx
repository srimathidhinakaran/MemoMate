import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { soundFx } from '../utils/soundEffects';
import { Swords, ArrowRight } from 'lucide-react';

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
      width: '100%',
      display: 'flex',
      alignItems: 'center',
      justify: 'center',
      padding: '1.5rem 1rem'
    }}>
      <div className="garden-card animate-fade-in" style={{
        maxWidth: 480,
        width: '100%',
        margin: '0 auto',
        padding: '2.5rem 2.2rem',
        border: '1px solid #30363D',
        backgroundColor: '#161B22',
        boxShadow: '0 12px 40px rgba(0, 0, 0, 0.6)'
      }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '1.8rem' }}>
          <div style={{
            width: 60,
            height: 60,
            borderRadius: '16px',
            background: 'linear-gradient(135deg, #0284C7 0%, #38BDF8 100%)',
            display: 'flex',
            alignItems: 'center',
            justify: 'center',
            margin: '0 auto 1rem',
            boxShadow: '0 4px 16px rgba(2, 132, 199, 0.4)'
          }}>
            <Swords size={30} color="#FFFFFF" />
          </div>

          <h1 style={{
            fontSize: '2rem',
            color: '#FFFFFF',
            fontWeight: 800,
            fontFamily: 'var(--font-heading)',
            margin: 0
          }}>
            Create Account
          </h1>
          <p style={{ fontSize: '0.9rem', color: '#9198A1', marginTop: '0.4rem', lineHeight: 1.4 }}>
            Join MemoMate for personalized 3D cognitive training
          </p>
        </div>

        {error && (
          <div style={{
            backgroundColor: 'rgba(239, 68, 68, 0.15)',
            border: '1px solid rgba(239, 68, 68, 0.4)',
            color: '#FCA5A5',
            padding: '0.85rem 1rem',
            borderRadius: '10px',
            marginBottom: '1.25rem',
            fontSize: '0.88rem',
            fontWeight: 700,
            textAlign: 'center'
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 700, color: '#FFFFFF', marginBottom: '0.35rem' }}>
              Full Name
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
                borderRadius: '10px',
                border: '1px solid #30363D',
                backgroundColor: '#0D1117',
                color: '#FFFFFF',
                fontSize: '0.95rem',
                outline: 'none'
              }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 700, color: '#FFFFFF', marginBottom: '0.35rem' }}>
                Age
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
                  borderRadius: '10px',
                  border: '1px solid #30363D',
                  backgroundColor: '#0D1117',
                  color: '#FFFFFF',
                  fontSize: '0.95rem',
                  outline: 'none'
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 700, color: '#FFFFFF', marginBottom: '0.35rem' }}>
                Account Role
              </label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.8rem 1rem',
                  borderRadius: '10px',
                  border: '1px solid #30363D',
                  backgroundColor: '#0D1117',
                  color: '#FFFFFF',
                  fontSize: '0.9rem',
                  outline: 'none'
                }}
              >
                <option value="elderly" style={{ backgroundColor: '#161B22', color: '#FFFFFF' }}>Patient</option>
                <option value="caregiver" style={{ backgroundColor: '#161B22', color: '#FFFFFF' }}>Caregiver</option>
              </select>
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 700, color: '#FFFFFF', marginBottom: '0.35rem' }}>
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              style={{
                width: '100%',
                padding: '0.8rem 1rem',
                borderRadius: '10px',
                border: '1px solid #30363D',
                backgroundColor: '#0D1117',
                color: '#FFFFFF',
                fontSize: '0.95rem',
                outline: 'none'
              }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 700, color: '#FFFFFF', marginBottom: '0.35rem' }}>
              Password
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
                borderRadius: '10px',
                border: '1px solid #30363D',
                backgroundColor: '#0D1117',
                color: '#FFFFFF',
                fontSize: '0.95rem',
                outline: 'none'
              }}
            />
          </div>

          <button type="submit" disabled={loading} className="btn-primary" style={{ padding: '0.9rem', width: '100%', marginTop: '0.5rem' }}>
            <span>{loading ? 'Registering...' : 'Register Account'}</span>
            <ArrowRight size={18} />
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '1.6rem', fontSize: '0.9rem', color: '#9198A1' }}>
          Already registered?{' '}
          <Link to="/login" style={{ color: '#38BDF8', fontWeight: 700, textDecoration: 'none' }}>
            Log in here
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
