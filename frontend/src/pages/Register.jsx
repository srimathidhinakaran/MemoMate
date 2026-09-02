import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Flower2, ArrowRight } from 'lucide-react';

const Register = () => {
  const { register, loading } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [age, setAge] = useState(68);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('elderly');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setError('');
      const data = await register({ name, age: Number(age), email, password, role });
      if (data.user.role === 'caregiver') {
        navigate('/caregiver');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed.');
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
      <div className="garden-card animate-fade-in" style={{ maxWidth: 500, width: '100%', padding: '2.5rem 2rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
          <div style={{
            width: 54,
            height: 54,
            borderRadius: '50%',
            backgroundColor: '#EBF2EC',
            display: 'flex',
            alignItems: 'center',
            justify: 'center',
            margin: '0 auto 0.75rem'
          }}>
            <Flower2 size={30} color="#58755E" />
          </div>
          <h1 style={{ fontSize: '1.8rem', color: '#1C3B2B', marginBottom: '0.2rem' }}>Join MemoMate 🌱</h1>
          <p style={{ color: '#536B5C', fontSize: '0.95rem' }}>
            Create your account to start your cognitive path.
          </p>
        </div>

        {error && (
          <div style={{ backgroundColor: '#FDF3F0', color: '#C87862', padding: '0.85rem', borderRadius: '12px', marginBottom: '1.25rem', fontSize: '0.9rem', fontWeight: 600 }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 700, color: '#1C3B2B', marginBottom: '0.3rem' }}>
              Full Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Meena"
              required
              style={{ width: '100%', padding: '0.8rem 1rem', borderRadius: '14px', border: '1.5px solid #E6E0D4', outline: 'none' }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 700, color: '#1C3B2B', marginBottom: '0.3rem' }}>
                Age
              </label>
              <input
                type="number"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                required
                style={{ width: '100%', padding: '0.8rem 1rem', borderRadius: '14px', border: '1.5px solid #E6E0D4', outline: 'none' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 700, color: '#1C3B2B', marginBottom: '0.3rem' }}>
                Account Role
              </label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                style={{ width: '100%', padding: '0.8rem 1rem', borderRadius: '14px', border: '1.5px solid #E6E0D4', outline: 'none', backgroundColor: '#FFF' }}
              >
                <option value="elderly">Elderly Patient</option>
                <option value="caregiver">Caregiver</option>
              </select>
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 700, color: '#1C3B2B', marginBottom: '0.3rem' }}>
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{ width: '100%', padding: '0.8rem 1rem', borderRadius: '14px', border: '1.5px solid #E6E0D4', outline: 'none' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 700, color: '#1C3B2B', marginBottom: '0.3rem' }}>
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{ width: '100%', padding: '0.8rem 1rem', borderRadius: '14px', border: '1.5px solid #E6E0D4', outline: 'none' }}
            />
          </div>

          <button type="submit" disabled={loading} className="btn-primary" style={{ padding: '1rem', width: '100%', marginTop: '0.5rem' }}>
            <span>{loading ? 'Creating Account...' : 'Complete Registration'}</span>
            <ArrowRight size={20} />
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.9rem', color: '#536B5C' }}>
          Already registered?{' '}
          <Link to="/login" style={{ color: '#58755E', fontWeight: 700, textDecoration: 'none' }}>
            Log in here
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
