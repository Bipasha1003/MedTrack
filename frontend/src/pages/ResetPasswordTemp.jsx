import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import api from '../lib/api';
import toast from 'react-hot-toast';

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const navigate = useNavigate();

  const [form, setForm] = useState({ password: '', confirmPassword: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [validToken, setValidToken] = useState(true);

  useEffect(() => {
    if (!token) { setValidToken(false); }
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password.length < 6) { toast.error('Password must be at least 6 characters'); return; }
    if (form.password !== form.confirmPassword) { toast.error('Passwords do not match'); return; }

    setLoading(true);
    try {
      await api.post('/auth/reset-password', { token, newPassword: form.password });
      toast.success('Password reset! Please log in.');
      navigate('/login');
    } catch (error) {
      toast.error(error.response?.data?.error || 'Reset failed. Link may have expired.');
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

  return (
    <div style={{
      minHeight: '100vh', background: '#070b12',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '24px', position: 'relative', overflow: 'hidden',
    }}>
      <div style={{ position: 'absolute', top: '10%', left: '50%', transform: 'translateX(-50%)', width: '500px', height: '400px', background: 'radial-gradient(ellipse, rgba(79,142,247,0.07) 0%, transparent 70%)', pointerEvents: 'none' }} />

      <div style={{ width: '100%', maxWidth: '420px', animation: 'fadeUp 0.4s ease both' }}>

        <div style={{ textAlign: 'center', marginBottom: '36px' }}>
          <img src="/icon.png" alt="MedTrack"
            style={{ width: '64px', height: '64px', objectFit: 'contain', margin: '0 auto 20px', display: 'block' }}
          />
          <h1 style={{ fontFamily: 'Syne, sans-serif', fontSize: '28px', fontWeight: '700', color: '#eef2ff', marginBottom: '8px', letterSpacing: '-0.6px' }}>
            Set New Password
          </h1>
          <p style={{ color: '#7d8faa', fontSize: '15px' }}>Choose a strong password for your account</p>
        </div>

        <div style={{ background: '#0d1220', borderRadius: '20px', padding: '32px', border: '1px solid rgba(255,255,255,0.07)', boxShadow: '0 20px 60px rgba(0,0,0,0.5)' }}>

          {!validToken ? (
            <div style={{ textAlign: 'center', padding: '12px 0' }}>
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>⚠️</div>
              <h3 style={{ fontFamily: 'Syne, sans-serif', fontSize: '18px', color: '#f56565', marginBottom: '10px' }}>Invalid Link</h3>
              <p style={{ fontSize: '14px', color: '#7d8faa', marginBottom: '24px' }}>
                This reset link is invalid or has expired. Please request a new one.
              </p>
              <Link to="/login">
                <button style={{
                  width: '100%', padding: '13px', borderRadius: '10px', fontSize: '15px',
                  fontFamily: 'Syne, sans-serif', fontWeight: '600', color: 'white', border: 'none',
                  background: 'linear-gradient(135deg, #4f8ef7, #3b7de8)', cursor: 'pointer',
                }}>Back to Login</button>
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>

              {/* New Password */}
              <div style={{ marginBottom: '18px' }}>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '500', color: '#7d8faa', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.8px' }}>
                  New Password
                </label>
                <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={form.password} required
                    onChange={e => setForm({ ...form, password: e.target.value })}
                    placeholder="Min. 6 characters"
                    style={{ ...inputStyle, paddingRight: '48px' }}
                    onFocus={e => e.target.style.borderColor = 'rgba(79,142,247,0.5)'}
                    onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.08)'}
                  />
                  <button type="button" onClick={() => setShowPassword(p => !p)} style={{
                    position: 'absolute', right: '14px', background: 'none', border: 'none',
                    cursor: 'pointer', color: showPassword ? '#4f8ef7' : '#3d4f66',
                    display: 'flex', alignItems: 'center', transition: 'color 0.2s',
                  }}>
                    {showPassword ? (
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
                        <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
                        <line x1="1" y1="1" x2="23" y2="23"/>
                      </svg>
                    ) : (
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                        <circle cx="12" cy="12" r="3"/>
                      </svg>
                    )}
                  </button>
                </div>
                {/* Strength bar */}
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
                    <span style={{ fontSize: '11px', color: form.password.length < 6 ? '#f56565' : form.password.length < 10 ? '#f59e0b' : '#2dd98f' }}>
                      {form.password.length < 6 ? 'Too short' : form.password.length < 10 ? 'Good' : 'Strong'}
                    </span>
                  </div>
                )}
              </div>

              {/* Confirm Password */}
              <div style={{ marginBottom: '28px' }}>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '500', color: '#7d8faa', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.8px' }}>
                  Confirm Password
                </label>
                <input
                  type="password" value={form.confirmPassword} required
                  onChange={e => setForm({ ...form, confirmPassword: e.target.value })}
                  placeholder="Repeat new password"
                  style={{
                    ...inputStyle,
                    borderColor: form.confirmPassword && form.password !== form.confirmPassword
                      ? 'rgba(245,101,101,0.5)' : 'rgba(255,255,255,0.08)',
                  }}
                  onFocus={e => e.target.style.borderColor = 'rgba(79,142,247,0.5)'}
                  onBlur={e => e.target.style.borderColor = form.confirmPassword && form.password !== form.confirmPassword
                    ? 'rgba(245,101,101,0.5)' : 'rgba(255,255,255,0.08)'}
                />
                {form.confirmPassword && form.password !== form.confirmPassword && (
                  <p style={{ fontSize: '12px', color: '#f56565', marginTop: '6px' }}>✕ Passwords do not match</p>
                )}
                {form.confirmPassword && form.password === form.confirmPassword && form.confirmPassword.length > 0 && (
                  <p style={{ fontSize: '12px', color: '#2dd98f', marginTop: '6px' }}>✓ Passwords match</p>
                )}
              </div>

              <button type="submit" disabled={loading} style={{
                width: '100%', padding: '14px', borderRadius: '10px', fontSize: '15px',
                fontFamily: 'Syne, sans-serif', fontWeight: '600', color: 'white', border: 'none',
                background: loading ? 'rgba(79,142,247,0.4)' : 'linear-gradient(135deg, #4f8ef7, #3b7de8)',
                cursor: loading ? 'not-allowed' : 'pointer', transition: 'all 0.2s ease',
              }}>
                {loading ? 'Resetting...' : '🔒 Reset Password →'}
              </button>
            </form>
          )}
        </div>

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