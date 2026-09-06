import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { soundFx } from '../utils/soundEffects';
import { NER_LANGUAGES } from '../utils/nerLanguages';
import { Brain, ArrowRight, Lock, Mail, User as UserIcon, Globe, Shield } from 'lucide-react';

const Register = () => {
  const { register, loading, t } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [age, setAge] = useState('68');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState('elderly');
  const [preferredLanguage, setPreferredLanguage] = useState('en');
  const [error, setError] = useState('');

  const validateForm = () => {
    if (!name.trim()) return t('valNameReq') || 'Full Name is required';
    if (!email.trim()) return t('valEmailReq') || 'Email address is required';

    const emailRegex = /^\S+@\S+\.\S+$/;
    if (!emailRegex.test(email.trim())) return t('valEmailInvalid') || 'Please enter a valid email address';

    if (!password) return t('valPassReq') || 'Password is required';
    if (password.length < 6) return t('valPassMin') || 'Password must be at least 6 characters long';

    if (password !== confirmPassword) return t('valPassMismatch') || 'Passwords do not match';

    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    soundFx.playClick();

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      setError('');
      const data = await register({
        name: name.trim(),
        age: Number(age) || 68,
        email: email.trim().toLowerCase(),
        password,
        role,
        preferredLanguage,
        preferredTheme: 'theme-nature'
      });

      soundFx.playLevelUp();
      if (data?.user?.role === 'caregiver') {
        navigate('/caregiver');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      console.error('Registration failure:', err);
      const errMsg = err.message || err.response?.data?.message || t('regFailed') || 'Registration failed. Email may already be registered.';
      setError(errMsg);
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
        maxWidth: 520,
        width: '100%',
        margin: '0 auto',
        padding: '2.5rem 2.2rem',
        border: '1px solid #30363D',
        backgroundColor: '#161B22',
        boxShadow: '0 12px 40px rgba(0, 0, 0, 0.6)'
      }}>
        {/* Brain Emblem */}
        <div style={{ textAlign: 'center', marginBottom: '1.8rem' }}>
          <div className="icon-box" style={{
            width: 56,
            height: 56,
            borderRadius: '14px',
            backgroundColor: 'rgba(56, 189, 248, 0.15)',
            border: '1px solid rgba(56, 189, 248, 0.35)',
            margin: '0 auto 1.1rem'
          }}>
            <Brain size={30} color="#38BDF8" />
          </div>

          <h1 style={{
            fontSize: '1.9rem',
            color: '#FFFFFF',
            fontWeight: 800,
            fontFamily: 'var(--font-heading)',
            margin: 0
          }}>
            {t('createAccount') || 'Create Account'}
          </h1>
          <p style={{ fontSize: '0.9rem', color: '#9198A1', marginTop: '0.4rem', lineHeight: 1.4 }}>
            {t('registerSub') || 'Register your official profile on MemoMate database'}
          </p>
        </div>

        {error && (
          <div style={{
            backgroundColor: 'rgba(239, 68, 68, 0.15)',
            border: '1px solid rgba(239, 68, 68, 0.4)',
            color: '#FCA5A5',
            padding: '0.9rem 1rem',
            borderRadius: '10px',
            marginBottom: '1.25rem',
            fontSize: '0.88rem',
            fontWeight: 600,
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.5rem',
            alignItems: 'center'
          }}>
            <div>{error}</div>
            {error.toLowerCase().includes('already exists') && (
              <Link
                to="/login"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  backgroundColor: 'rgba(56, 189, 248, 0.2)',
                  border: '1px solid #38BDF8',
                  color: '#38BDF8',
                  padding: '0.4rem 0.85rem',
                  borderRadius: '8px',
                  fontSize: '0.82rem',
                  fontWeight: 800,
                  textDecoration: 'none'
                }}
              >
                {t('logInWithThisAccount') || 'Log in with this account →'}
              </Link>
            )}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 700, color: '#FFFFFF', marginBottom: '0.35rem' }}>
              {t('fullNameLabel') || 'Full Name *'}
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your full name"
                required
                style={{
                  width: '100%',
                  padding: '0.8rem 1rem 0.8rem 2.6rem',
                  borderRadius: '10px',
                  border: '1px solid #30363D',
                  backgroundColor: '#0D1117',
                  color: '#FFFFFF',
                  fontSize: '0.95rem',
                  outline: 'none'
                }}
              />
              <UserIcon size={18} color="#9198A1" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 700, color: '#FFFFFF', marginBottom: '0.35rem' }}>
                {t('ageLabel') || 'Age *'}
              </label>
              <input
                type="number"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                placeholder="68"
                required
                min="1"
                max="120"
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
                {t('accountRoleLabel') || 'Account Role *'}
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
                <option value="elderly" style={{ backgroundColor: '#161B22', color: '#FFFFFF' }}>{t('patientRole') || 'Patient'}</option>
                <option value="caregiver" style={{ backgroundColor: '#161B22', color: '#FFFFFF' }}>{t('caregiverRole') || 'Caregiver'}</option>
              </select>
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 700, color: '#FFFFFF', marginBottom: '0.35rem' }}>
              {t('preferredLangLabel') || 'Preferred Language *'}
            </label>
            <div style={{ position: 'relative' }}>
              <select
                value={preferredLanguage}
                onChange={(e) => setPreferredLanguage(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.8rem 1rem 0.8rem 2.6rem',
                  borderRadius: '10px',
                  border: '1px solid #30363D',
                  backgroundColor: '#0D1117',
                  color: '#FFFFFF',
                  fontSize: '0.9rem',
                  outline: 'none'
                }}
              >
                {NER_LANGUAGES.map((lang) => (
                  <option key={lang.code} value={lang.code} style={{ backgroundColor: '#161B22', color: '#FFFFFF' }}>
                    {lang.name}
                  </option>
                ))}
              </select>
              <Globe size={18} color="#34D399" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 700, color: '#FFFFFF', marginBottom: '0.35rem' }}>
              {t('emailLabel') || 'Email Address *'}
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                style={{
                  width: '100%',
                  padding: '0.8rem 1rem 0.8rem 2.6rem',
                  borderRadius: '10px',
                  border: '1px solid #30363D',
                  backgroundColor: '#0D1117',
                  color: '#FFFFFF',
                  fontSize: '0.95rem',
                  outline: 'none'
                }}
              />
              <Mail size={18} color="#9198A1" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 700, color: '#FFFFFF', marginBottom: '0.35rem' }}>
                {t('passwordLabel') || 'Password *'}
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Min 6 chars"
                  required
                  minLength={6}
                  style={{
                    width: '100%',
                    padding: '0.8rem 1rem 0.8rem 2.6rem',
                    borderRadius: '10px',
                    border: '1px solid #30363D',
                    backgroundColor: '#0D1117',
                    color: '#FFFFFF',
                    fontSize: '0.95rem',
                    outline: 'none'
                  }}
                />
                <Lock size={18} color="#9198A1" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 700, color: '#FFFFFF', marginBottom: '0.35rem' }}>
                {t('confirmPasswordLabel') || 'Confirm Password *'}
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Repeat password"
                  required
                  minLength={6}
                  style={{
                    width: '100%',
                    padding: '0.8rem 1rem 0.8rem 2.6rem',
                    borderRadius: '10px',
                    border: '1px solid #30363D',
                    backgroundColor: '#0D1117',
                    color: '#FFFFFF',
                    fontSize: '0.95rem',
                    outline: 'none'
                  }}
                />
                <Shield size={18} color="#9198A1" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
              </div>
            </div>
          </div>

          <button type="submit" disabled={loading} className="btn-primary" style={{ padding: '0.9rem', width: '100%', marginTop: '0.5rem' }}>
            <span>{loading ? (t('creatingAccount') || 'Creating Account...') : (t('registerAccountBtn') || 'Register Account')}</span>
            <ArrowRight size={18} />
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '1.6rem', fontSize: '0.9rem', color: '#9198A1' }}>
          {t('alreadyRegisteredText') || 'Already registered?'}{' '}
          <Link to="/login" style={{ color: '#38BDF8', fontWeight: 700, textDecoration: 'none' }}>
            {t('logInHereLink') || 'Log in here'}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
