import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../lib/api';
import toast from 'react-hot-toast';

export default function Register() {
  const [form, setForm] = useState({ name: '', phone: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }
    if (form.phone && !/^[0-9]{10}$/.test(form.phone)) {
      toast.error('Enter a valid 10-digit phone number');
      return;
    }
    setLoading(true);
    try {
      const res = await api.post('/auth/register', form);
      login(res.data.token, res.data.user);
      toast.success('Account created!');
      navigate('/');
    } catch (error) {
      toast.error(error.response?.data?.error || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    width: '100%', background: '#111827',
    border: '1px solid rgba(255,255,255,0.08)', borderRadius: '10px',
    padding: '13px 16px', fontSize: '15px', color: '#eef2ff',
    boxSizing: 'border-box',
  };

  const labelStyle = {
    display: 'block', fontSize: '12px', fontWeight: '500',
    color: '#7d8faa', marginBottom: '8px',
    textTransform: 'uppercase', letterSpacing: '0.8px',
  };

  return (
    <div style={{
      minHeight: '100vh', background: '#070b12',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '24px', position: 'relative', overflow: 'hidden',
    }}>

      {/* ← Back to home */}
      <Link to="/" style={{
        position: 'absolute', top: '24px', left: '24px',
        display: 'flex', alignItems: 'center', gap: '6px',
        fontSize: '14px', color: '#7d8faa', textDecoration: 'none',
        transition: 'color 0.2s ease', zIndex: 10,
      }}
        onMouseEnter={e => e.currentTarget.style.color = '#eef2ff'}
        onMouseLeave={e => e.currentTarget.style.color = '#7d8faa'}
      >← Back to home</Link>

      {/* Background glows */}
      <div style={{ position: 'absolute', top: '20%', right: '10%', width: '400px', height: '400px', background: 'radial-gradient(ellipse, rgba(45,217,143,0.06) 0%, transparent 70%)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: '10%', left: '10%', width: '300px', height: '300px', background: 'radial-gradient(ellipse, rgba(79,142,247,0.06) 0%, transparent 70%)', pointerEvents: 'none' }} />

      <div style={{ width: '100%', maxWidth: '420px', animation: 'fadeUp 0.4s ease both' }}>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '36px' }}>
          <img
            src="/icon.png" alt="MedTrack"
            style={{ width: '64px', height: '64px', objectFit: 'contain', margin: '0 auto 20px', display: 'block' }}
          />
          <h1 style={{
            fontFamily: 'Syne, sans-serif', fontSize: '28px',
            fontWeight: '700', color: '#eef2ff',
            marginBottom: '8px', letterSpacing: '-0.6px',
          }}>Create account</h1>
          <p style={{ color: '#7d8faa', fontSize: '15px' }}>
            Start tracking your medicines for free
          </p>
        </div>

        {/* Form card */}
        <div style={{
          background: '#0d1220', borderRadius: '20px', padding: '32px',
          border: '1px solid rgba(255,255,255,0.07)',
          boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
        }}>
          <form onSubmit={handleSubmit}>

            {/* Full Name */}
            <div style={{ marginBottom: '18px' }}>
              <label style={labelStyle}>Full Name</label>
              <input
                type="text" value={form.name} required
                onChange={e => setForm({ ...form, name: e.target.value })}
                placeholder="Enter Name"
                autoComplete="off"
                style={inputStyle}
                onFocus={e => e.target.style.borderColor = 'rgba(45,217,143,0.5)'}
                onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.08)'}
              />
            </div>

            {/* Phone Number */}
            <div style={{ marginBottom: '18px' }}>
              <label style={labelStyle}>
                Phone Number
                <span style={{ color: '#3d4f66', marginLeft: '6px', textTransform: 'none', letterSpacing: 0, fontSize: '11px' }}>
                  (optional)
                </span>
              </label>
              <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                {/* Country code prefix */}
                <div style={{
                  position: 'absolute', left: '16px',
                  fontSize: '15px', color: '#7d8faa',
                  pointerEvents: 'none', userSelect: 'none',
                }}>+91</div>
                <input
                  type="tel" value={form.phone}
                  onChange={e => setForm({ ...form, phone: e.target.value.replace(/\D/g, '').slice(0, 10) })}
                  placeholder="Enter Phone Number"
                  autoComplete="off"
                  style={{ ...inputStyle, paddingLeft: '52px' }}
                  onFocus={e => e.target.style.borderColor = 'rgba(45,217,143,0.5)'}
                  onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.08)'}
                />
              </div>
            </div>

            {/* Email */}
            <div style={{ marginBottom: '18px' }}>
              <label style={labelStyle}>Email</label>
              <input
                type="email" value={form.email} required
                onChange={e => setForm({ ...form, email: e.target.value })}
                placeholder="Enter Email"
                autoComplete="new-email"
                style={inputStyle}
                onFocus={e => e.target.style.borderColor = 'rgba(45,217,143,0.5)'}
                onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.08)'}
              />
            </div>

            {/* Password with show/hide toggle */}
            <div style={{ marginBottom: '28px' }}>
              <label style={labelStyle}>Password</label>
              <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={form.password} required
                  onChange={e => setForm({ ...form, password: e.target.value })}
                  placeholder="Min. 6 characters"
                  autoComplete="new-password"
                  style={{ ...inputStyle, paddingRight: '48px' }}
                  onFocus={e => e.target.style.borderColor = 'rgba(45,217,143,0.5)'}
                  onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.08)'}
                />
                {/* Eye icon button */}
                <button
                  type="button"
                  onClick={() => setShowPassword(p => !p)}
                  style={{
                    position: 'absolute', right: '14px',
                    background: 'none', border: 'none',
                    cursor: 'pointer', padding: '4px',
                    color: showPassword ? '#4f8ef7' : '#3d4f66',
                    fontSize: '18px', lineHeight: 1,
                    transition: 'color 0.2s ease',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}
                  title={showPassword ? 'Hide password' : 'Show password'}
                  onMouseEnter={e => e.currentTarget.style.color = '#4f8ef7'}
                  onMouseLeave={e => e.currentTarget.style.color = showPassword ? '#4f8ef7' : '#3d4f66'}
                >
                  {showPassword ? (
                    /* Eye with slash — hide */
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
                      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
                      <line x1="1" y1="1" x2="23" y2="23"/>
                    </svg>
                  ) : (
                    /* Eye open — show */
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                      <circle cx="12" cy="12" r="3"/>
                    </svg>
                  )}
                </button>
              </div>
              {/* Password strength hint */}
              {form.password.length > 0 && (
                <div style={{ marginTop: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ flex: 1, height: '3px', borderRadius: '2px', background: '#1a2235', overflow: 'hidden' }}>
                    <div style={{
                      height: '100%', borderRadius: '2px',
                      width: form.password.length < 6 ? '33%' : form.password.length < 10 ? '66%' : '100%',
                      background: form.password.length < 6 ? '#f56565' : form.password.length < 10 ? '#f59e0b' : '#2dd98f',
                      transition: 'all 0.3s ease',
                    }} />
                  </div>
                  <span style={{
                    fontSize: '11px',
                    color: form.password.length < 6 ? '#f56565' : form.password.length < 10 ? '#f59e0b' : '#2dd98f',
                  }}>
                    {form.password.length < 6 ? 'Too short' : form.password.length < 10 ? 'Good' : 'Strong'}
                  </span>
                </div>
              )}
            </div>

            {/* Submit button */}
            <button
              type="submit" disabled={loading}
              style={{
                width: '100%', padding: '14px', borderRadius: '10px',
                fontSize: '15px', fontFamily: 'Syne, sans-serif', fontWeight: '600',
                color: 'white', letterSpacing: '0.2px', border: 'none',
                background: loading ? 'rgba(45,217,143,0.3)' : 'linear-gradient(135deg, #2dd98f, #1bb87a)',
                cursor: loading ? 'not-allowed' : 'pointer', transition: 'all 0.2s ease',
              }}
              onMouseEnter={e => { if (!loading) e.currentTarget.style.transform = 'translateY(-1px)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; }}
            >
              {loading ? 'Creating account...' : 'Create Account →'}
            </button>
          </form>

          {/* Divider */}
          <div style={{ margin: '24px 0', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.07)' }} />
            <span style={{ color: '#3d4f66', fontSize: '13px' }}>or</span>
            <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.07)' }} />
          </div>

          <p style={{ textAlign: 'center', fontSize: '14px', color: '#7d8faa' }}>
            Already have an account?{' '}
            <Link to="/login" style={{ color: '#4f8ef7', fontWeight: '500' }}>Sign in</Link>
          </p>
        </div>

        <p style={{ textAlign: 'center', marginTop: '24px', fontSize: '13px', color: '#3d4f66' }}>
          Free forever. No credit card required.
        </p>
      </div>
    </div>
  );
}