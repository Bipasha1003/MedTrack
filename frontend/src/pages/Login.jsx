import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../lib/api';
import toast from 'react-hot-toast';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Forgot password state
  const [showForgot, setShowForgot] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotLoading, setForgotLoading] = useState(false);
  const [forgotSent, setForgotSent] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post('/auth/login', form);
      login(res.data.token, res.data.user);
      toast.success('Welcome back!');
      navigate('/');
    } catch (error) {
      toast.error(error.response?.data?.error || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    if (!forgotEmail) { toast.error('Enter your email address'); return; }
    setForgotLoading(true);
    try {
      await api.post('/auth/forgot-password', { email: forgotEmail });
      setForgotSent(true);
    } catch (error) {
      toast.error(error.response?.data?.error || 'Could not send reset email');
    } finally {
      setForgotLoading(false);
    }
  };

  const inputStyle = {
    width: '100%', background: '#111827',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: '10px', padding: '13px 16px',
    fontSize: '15px', color: '#eef2ff',
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

      {/* Back to home */}
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
      <div style={{ position: 'absolute', top: '10%', left: '50%', transform: 'translateX(-50%)', width: '500px', height: '400px', background: 'radial-gradient(ellipse, rgba(79,142,247,0.07) 0%, transparent 70%)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: '10%', right: '10%', width: '300px', height: '300px', background: 'radial-gradient(ellipse, rgba(45,217,143,0.05) 0%, transparent 70%)', pointerEvents: 'none' }} />

      <div style={{ width: '100%', maxWidth: '420px', animation: 'fadeUp 0.4s ease both' }}>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '36px' }}>
          <img src="/icon.png" alt="MedTrack"
            style={{ width: '64px', height: '64px', objectFit: 'contain', margin: '0 auto 20px', display: 'block' }}
          />
          <h1 style={{ fontFamily: 'Syne, sans-serif', fontSize: '28px', fontWeight: '700', color: '#eef2ff', marginBottom: '8px', letterSpacing: '-0.6px' }}>
            {showForgot ? 'Reset Password' : 'Welcome back'}
          </h1>
          <p style={{ color: '#7d8faa', fontSize: '15px' }}>
            {showForgot ? 'Enter your email to receive a reset link' : 'Sign in to your medicine cabinet'}
          </p>
        </div>

        {/* ── FORGOT PASSWORD CARD ── */}
        {showForgot ? (
          <div style={{ background: '#0d1220', borderRadius: '20px', padding: '32px', border: '1px solid rgba(255,255,255,0.07)', boxShadow: '0 20px 60px rgba(0,0,0,0.5)' }}>
            {forgotSent ? (
              <div style={{ textAlign: 'center', padding: '12px 0' }}>
                <div style={{ fontSize: '48px', marginBottom: '16px' }}>📧</div>
                <h3 style={{ fontFamily: 'Syne, sans-serif', fontSize: '18px', fontWeight: '600', color: '#2dd98f', marginBottom: '10px' }}>
                  Check your inbox!
                </h3>
                <p style={{ fontSize: '14px', color: '#7d8faa', lineHeight: '1.7', marginBottom: '24px' }}>
                  We sent a password reset link to <strong style={{ color: '#eef2ff' }}>{forgotEmail}</strong>.
                  Check your inbox and spam folder.
                </p>
                <button onClick={() => { setShowForgot(false); setForgotSent(false); setForgotEmail(''); }} style={{
                  width: '100%', padding: '13px', borderRadius: '10px', fontSize: '15px',
                  fontFamily: 'Syne, sans-serif', fontWeight: '600', color: 'white', border: 'none',
                  background: 'linear-gradient(135deg, #4f8ef7, #3b7de8)', cursor: 'pointer',
                }}>← Back to Login</button>
              </div>
            ) : (
              <form onSubmit={handleForgotPassword}>
                <div style={{ marginBottom: '24px' }}>
                  <label style={labelStyle}>Email Address</label>
                  <input
                    type="email" value={forgotEmail} required autoComplete="email"
                    onChange={e => setForgotEmail(e.target.value)}
                    placeholder="you@example.com"
                    style={inputStyle}
                    onFocus={e => e.target.style.borderColor = 'rgba(79,142,247,0.5)'}
                    onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.08)'}
                  />
                  <p style={{ fontSize: '12px', color: '#3d4f66', marginTop: '8px' }}>
                    We'll send a reset link to this email address.
                  </p>
                </div>
                <button type="submit" disabled={forgotLoading} style={{
                  width: '100%', padding: '14px', borderRadius: '10px', fontSize: '15px',
                  fontFamily: 'Syne, sans-serif', fontWeight: '600', color: 'white', border: 'none',
                  background: forgotLoading ? 'rgba(79,142,247,0.4)' : 'linear-gradient(135deg, #4f8ef7, #3b7de8)',
                  cursor: forgotLoading ? 'not-allowed' : 'pointer', transition: 'all 0.2s ease',
                }}>
                  {forgotLoading ? 'Sending...' : 'Send Reset Link →'}
                </button>
                <button type="button" onClick={() => setShowForgot(false)} style={{
                  width: '100%', marginTop: '12px', padding: '12px', borderRadius: '10px',
                  fontSize: '14px', color: '#7d8faa', background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.08)', cursor: 'pointer',
                }}>
                  ← Back to Login
                </button>
              </form>
            )}
          </div>

        ) : (
          /* ── LOGIN CARD ── */
          <div style={{ background: '#0d1220', borderRadius: '20px', padding: '32px', border: '1px solid rgba(255,255,255,0.07)', boxShadow: '0 20px 60px rgba(0,0,0,0.5)' }}>
            <form onSubmit={handleSubmit}>

              {/* Email */}
              <div style={{ marginBottom: '20px' }}>
                <label style={labelStyle}>Email</label>
                <input
                  type="email" value={form.email} required
                  onChange={e => setForm({ ...form, email: e.target.value })}
                  placeholder="you@example.com"
                  style={inputStyle}
                  onFocus={e => e.target.style.borderColor = 'rgba(79,142,247,0.5)'}
                  onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.08)'}
                />
              </div>

              {/* Password with eye toggle */}
              <div style={{ marginBottom: '8px' }}>
                <label style={labelStyle}>Password</label>
                <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={form.password} required
                    onChange={e => setForm({ ...form, password: e.target.value })}
                    placeholder="••••••••"
                    style={{ ...inputStyle, paddingRight: '48px' }}
                    onFocus={e => e.target.style.borderColor = 'rgba(79,142,247,0.5)'}
                    onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.08)'}
                  />
                  {/* 👁 Eye toggle button */}
                  <button
                    type="button"
                    onClick={() => setShowPassword(p => !p)}
                    style={{
                      position: 'absolute', right: '14px',
                      background: 'none', border: 'none', cursor: 'pointer', padding: '4px',
                      color: showPassword ? '#4f8ef7' : '#3d4f66',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      transition: 'color 0.2s ease',
                    }}
                    onMouseEnter={e => e.currentTarget.style.color = '#4f8ef7'}
                    onMouseLeave={e => e.currentTarget.style.color = showPassword ? '#4f8ef7' : '#3d4f66'}
                  >
                    {showPassword ? (
                      /* Eye with slash — currently showing, click to hide */
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
                        <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
                        <line x1="1" y1="1" x2="23" y2="23"/>
                      </svg>
                    ) : (
                      /* Eye open — currently hidden, click to show */
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                        <circle cx="12" cy="12" r="3"/>
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              {/* Forgot password link — right aligned under password */}
              <div style={{ textAlign: 'right', marginBottom: '24px' }}>
                <button
                  type="button"
                  onClick={() => setShowForgot(true)}
                  style={{
                    background: 'none', border: 'none', cursor: 'pointer',
                    fontSize: '13px', color: '#4f8ef7', fontWeight: '500',
                    transition: 'opacity 0.2s ease', padding: '4px 0',
                  }}
                  onMouseEnter={e => e.currentTarget.style.opacity = '0.7'}
                  onMouseLeave={e => e.currentTarget.style.opacity = '1'}
                >
                  Forgot password?
                </button>
              </div>

              {/* Sign In button */}
              <button type="submit" disabled={loading} style={{
                width: '100%', padding: '14px', borderRadius: '10px', fontSize: '15px',
                fontFamily: 'Syne, sans-serif', fontWeight: '600', color: 'white',
                letterSpacing: '0.2px', border: 'none',
                background: loading ? 'rgba(79,142,247,0.4)' : 'linear-gradient(135deg, #4f8ef7, #3b7de8)',
                cursor: loading ? 'not-allowed' : 'pointer', transition: 'all 0.2s ease',
              }}
                onMouseEnter={e => { if (!loading) e.currentTarget.style.transform = 'translateY(-1px)'; }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; }}
              >
                {loading ? 'Signing in...' : 'Sign In →'}
              </button>
            </form>

            <div style={{ margin: '24px 0', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.07)' }} />
              <span style={{ color: '#3d4f66', fontSize: '13px' }}>or</span>
              <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.07)' }} />
            </div>

            <p style={{ textAlign: 'center', fontSize: '14px', color: '#7d8faa' }}>
              No account?{' '}
              <Link to="/register" style={{ color: '#4f8ef7', fontWeight: '500' }}>Create one free</Link>
            </p>
          </div>
        )}

        <p style={{ textAlign: 'center', marginTop: '24px', fontSize: '13px', color: '#3d4f66' }}>
          Your medicines. Your privacy. Fully secure.
        </p>
      </div>

      <style>{`
        @keyframes fadeUp { from { opacity: 0; transform: translateY(24px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </div>
  );
}