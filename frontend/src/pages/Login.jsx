import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../lib/api';
import toast from 'react-hot-toast';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
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

  return (
    <div style={{
      minHeight: '100vh', background: '#070b12',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '24px', position: 'relative', overflow: 'hidden',
    }}>

      {/* ← Back to home — top left corner */}
      <Link to="/" style={{
        position: 'absolute', top: '24px', left: '24px',
        display: 'flex', alignItems: 'center', gap: '6px',
        fontSize: '14px', color: '#7d8faa',
        textDecoration: 'none',
        transition: 'color 0.2s ease',
        zIndex: 10,
      }}
        onMouseEnter={e => e.currentTarget.style.color = '#eef2ff'}
        onMouseLeave={e => e.currentTarget.style.color = '#7d8faa'}
      >
        ← Back to home
      </Link>

      {/* Background glow effects */}
      <div style={{ position: 'absolute', top: '10%', left: '50%', transform: 'translateX(-50%)', width: '500px', height: '400px', background: 'radial-gradient(ellipse, rgba(79,142,247,0.07) 0%, transparent 70%)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: '10%', right: '10%', width: '300px', height: '300px', background: 'radial-gradient(ellipse, rgba(45,217,143,0.05) 0%, transparent 70%)', pointerEvents: 'none' }} />

      <div style={{ width: '100%', maxWidth: '420px', animation: 'fadeUp 0.4s ease both' }}>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '36px' }}>
          <img
            src="/icon.png"
            alt="MedTrack"
            style={{
              width: '64px', height: '64px',
              objectFit: 'contain',
              margin: '0 auto 20px',
              display: 'block',
            }}
          />
          <h1 style={{
            fontFamily: 'Syne, sans-serif', fontSize: '28px',
            fontWeight: '700', color: '#eef2ff',
            marginBottom: '8px', letterSpacing: '-0.6px',
          }}>
            Welcome back
          </h1>
          <p style={{ color: '#7d8faa', fontSize: '15px' }}>
            Sign in to your medicine cabinet
          </p>
        </div>

        {/* Form card */}
        <div style={{
          background: '#0d1220', borderRadius: '20px', padding: '32px',
          border: '1px solid rgba(255,255,255,0.07)',
          boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
        }}>
          <form onSubmit={handleSubmit}>

            {/* Email field */}
            <div style={{ marginBottom: '20px' }}>
              <label style={{
                display: 'block', fontSize: '12px', fontWeight: '500',
                color: '#7d8faa', marginBottom: '8px',
                textTransform: 'uppercase', letterSpacing: '0.8px',
              }}>Email</label>
              <input
                type="email"
                autoComplete="new-email"
                value={form.email}
                required
                onChange={e => setForm({ ...form, email: e.target.value })}
                placeholder="you@example.com"
                style={{
                  width: '100%', background: '#111827',
                  border: '1px solid rgba(255,255,255,0.08)',
                  borderRadius: '10px', padding: '13px 16px',
                  fontSize: '15px', color: '#eef2ff',
                  boxSizing: 'border-box',
                }}
                onFocus={e => e.target.style.borderColor = 'rgba(79,142,247,0.5)'}
                onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.08)'}
              />
            </div>

            {/* Password field */}
            <div style={{ marginBottom: '28px' }}>
              <label style={{
                display: 'block', fontSize: '12px', fontWeight: '500',
                color: '#7d8faa', marginBottom: '8px',
                textTransform: 'uppercase', letterSpacing: '0.8px',
              }}>Password</label>
              <input
                type="password"
                autoComplete="new-password"
                value={form.password}
                required
                onChange={e => setForm({ ...form, password: e.target.value })}
                placeholder="••••••••"
                style={{
                  width: '100%', background: '#111827',
                  border: '1px solid rgba(255,255,255,0.08)',
                  borderRadius: '10px', padding: '13px 16px',
                  fontSize: '15px', color: '#eef2ff',
                  boxSizing: 'border-box',
                }}
                onFocus={e => e.target.style.borderColor = 'rgba(79,142,247,0.5)'}
                onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.08)'}
              />
            </div>

            {/* Sign in button */}
            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%', padding: '14px',
                borderRadius: '10px', fontSize: '15px',
                fontFamily: 'Syne, sans-serif', fontWeight: '600',
                color: 'white', letterSpacing: '0.2px', border: 'none',
                background: loading
                  ? 'rgba(79,142,247,0.4)'
                  : 'linear-gradient(135deg, #4f8ef7, #3b7de8)',
                cursor: loading ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={e => { if (!loading) e.currentTarget.style.transform = 'translateY(-1px)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; }}
            >
              {loading ? 'Signing in...' : 'Sign In →'}
            </button>
          </form>

          {/* Divider */}
          <div style={{ margin: '24px 0', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.07)' }} />
            <span style={{ color: '#3d4f66', fontSize: '13px' }}>or</span>
            <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.07)' }} />
          </div>

          {/* Link to register */}
          <p style={{ textAlign: 'center', fontSize: '14px', color: '#7d8faa' }}>
            No account?{' '}
            <Link to="/register" style={{ color: '#4f8ef7', fontWeight: '500' }}>
              Create one free
            </Link>
          </p>
        </div>

        {/* Footer */}
        <p style={{ textAlign: 'center', marginTop: '24px', fontSize: '13px', color: '#3d4f66' }}>
          Your medicines. Your privacy. Fully secure.
        </p>
      </div>
    </div>
  );
}