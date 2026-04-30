import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../lib/api';
import toast from 'react-hot-toast';

export default function Profile() {
  const { user, login } = useAuth();
  const [loading, setLoading]   = useState(false);
  const [saving,  setSaving]    = useState(false);
  const [form,    setForm]      = useState({
    name: '', email: '', phone: '',
    currentPassword: '', newPassword: '', confirmPassword: '',
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false, new: false, confirm: false,
  });
  const [activeTab, setActiveTab] = useState('details'); // 'details' | 'security'

  // Pre-fill form with current user data
  useEffect(() => {
    if (user) {
      setForm(prev => ({
        ...prev,
        name:  user.name  || '',
        email: user.email || '',
        phone: user.phone || '',
      }));
    }
  }, [user]);

  const handleChange = (e) =>
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  // ── Save profile details ──
  const handleSaveDetails = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email) {
      toast.error('Name and email are required');
      return;
    }
    if (form.phone && !/^[0-9]{10}$/.test(form.phone)) {
      toast.error('Enter a valid 10-digit phone number');
      return;
    }
    setSaving(true);
    try {
      const res = await api.put('/auth/profile', {
        name:  form.name,
        email: form.email,
        phone: form.phone,
      });
      // Update auth context with new user data (keep same token)
      const token = localStorage.getItem('token');
      login(token, res.data.user);
      toast.success('Profile updated!');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Could not update profile');
    } finally {
      setSaving(false);
    }
  };

  // ── Change password ──
  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (!form.currentPassword || !form.newPassword || !form.confirmPassword) {
      toast.error('All password fields are required');
      return;
    }
    if (form.newPassword.length < 6) {
      toast.error('New password must be at least 6 characters');
      return;
    }
    if (form.newPassword !== form.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    setSaving(true);
    try {
      await api.put('/auth/change-password', {
        currentPassword: form.currentPassword,
        newPassword:     form.newPassword,
      });
      toast.success('Password changed!');
      setForm(prev => ({ ...prev, currentPassword: '', newPassword: '', confirmPassword: '' }));
    } catch (err) {
      toast.error(err.response?.data?.error || 'Could not change password');
    } finally {
      setSaving(false);
    }
  };

  // ── Shared styles ──
  const inputStyle = {
    width: '100%', background: '#111827',
    border: '1px solid rgba(255,255,255,0.08)', borderRadius: '10px',
    padding: '13px 16px', fontSize: '15px', color: '#eef2ff',
    boxSizing: 'border-box', transition: 'border-color 0.2s ease',
  };

  const labelStyle = {
    display: 'block', fontSize: '12px', fontWeight: '500',
    color: '#7d8faa', marginBottom: '8px',
    textTransform: 'uppercase', letterSpacing: '0.8px',
  };

  const initials = user?.name
    ?.split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2) || 'U';

  return (
    <div className="page" style={{ padding: '24px 20px', maxWidth: '700px', margin: '0 auto' }}>

      {/* ── Back link ── */}
      <Link to="/dashboard" style={{
        display: 'inline-flex', alignItems: 'center', gap: '6px',
        color: '#7d8faa', fontSize: '14px', marginBottom: '24px',
        transition: 'color 0.2s ease',
      }}
        onMouseEnter={e => e.currentTarget.style.color = '#eef2ff'}
        onMouseLeave={e => e.currentTarget.style.color = '#7d8faa'}
      >← Back to cabinet</Link>

      {/* ── Profile hero card ── */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(79,142,247,0.08), rgba(45,217,143,0.05))',
        borderRadius: '20px', padding: '28px',
        border: '1px solid rgba(79,142,247,0.15)',
        marginBottom: '24px',
        display: 'flex', alignItems: 'center', gap: '20px', flexWrap: 'wrap',
      }}>
        {/* Avatar */}
        <div style={{
          width: '72px', height: '72px', borderRadius: '50%', flexShrink: 0,
          background: 'linear-gradient(135deg, #4f8ef7, #2dd98f)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontFamily: 'Syne, sans-serif', fontWeight: '700',
          fontSize: '26px', color: 'white',
          boxShadow: '0 0 0 4px rgba(79,142,247,0.15)',
        }}>
          {initials}
        </div>

        {/* Info */}
        <div style={{ flex: 1 }}>
          <h1 style={{
            fontFamily: 'Syne, sans-serif', fontSize: '22px',
            fontWeight: '700', color: '#eef2ff', letterSpacing: '-0.5px', marginBottom: '4px',
          }}>
            {user?.name || 'User'}
          </h1>
          <p style={{ color: '#7d8faa', fontSize: '14px', marginBottom: '6px' }}>
            {user?.email}
          </p>
          {user?.phone && (
            <p style={{ color: '#7d8faa', fontSize: '13px' }}>
              📱 +91 {user.phone}
            </p>
          )}
        </div>

        {/* Member badge */}
        <div style={{
          padding: '6px 16px', borderRadius: '20px',
          background: 'rgba(45,217,143,0.1)', border: '1px solid rgba(45,217,143,0.25)',
          fontSize: '12px', color: '#2dd98f', fontWeight: '500',
          flexShrink: 0,
        }}>
          ● Active Member
        </div>
      </div>

      {/* ── Tabs ── */}
      <div style={{
        display: 'flex', gap: '4px',
        background: 'rgba(255,255,255,0.04)',
        borderRadius: '12px', padding: '4px',
        border: '1px solid rgba(255,255,255,0.06)',
        marginBottom: '20px',
      }}>
        {[
          { key: 'details',  label: '👤 Profile Details' },
          { key: 'security', label: '🔒 Change Password' },
        ].map(tab => (
          <button key={tab.key} onClick={() => setActiveTab(tab.key)} style={{
            flex: 1, padding: '9px 16px', borderRadius: '8px',
            fontSize: '14px', fontWeight: activeTab === tab.key ? '500' : '400',
            color: activeTab === tab.key ? '#eef2ff' : '#7d8faa',
            background: activeTab === tab.key ? 'rgba(79,142,247,0.15)' : 'transparent',
            border: activeTab === tab.key ? '1px solid rgba(79,142,247,0.28)' : '1px solid transparent',
            transition: 'all 0.2s ease',
          }}>{tab.label}</button>
        ))}
      </div>

      {/* ══════════════════════════════ */}
      {/* TAB: PROFILE DETAILS           */}
      {/* ══════════════════════════════ */}
      {activeTab === 'details' && (
        <div style={{
          background: '#0d1220', borderRadius: '20px', padding: '28px',
          border: '1px solid rgba(255,255,255,0.07)',
          animation: 'fadeUp 0.25s ease both',
        }}>
          <h2 style={{
            fontFamily: 'Syne, sans-serif', fontSize: '17px',
            fontWeight: '600', color: '#eef2ff', marginBottom: '22px',
          }}>Edit Profile Information</h2>

          <form onSubmit={handleSaveDetails}>

            {/* Full Name */}
            <div style={{ marginBottom: '20px' }}>
              <label style={labelStyle}>Full Name</label>
              <input
                name="name" type="text" value={form.name} required
                onChange={handleChange}
                placeholder="Your full name"
                style={inputStyle}
                onFocus={e => e.target.style.borderColor = 'rgba(79,142,247,0.5)'}
                onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.08)'}
              />
            </div>

            {/* Email */}
            <div style={{ marginBottom: '20px' }}>
              <label style={labelStyle}>Email Address</label>
              <input
                name="email" type="email" value={form.email} required
                onChange={handleChange}
                placeholder="you@example.com"
                style={inputStyle}
                onFocus={e => e.target.style.borderColor = 'rgba(79,142,247,0.5)'}
                onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.08)'}
              />
              <p style={{ fontSize: '12px', color: '#3d4f66', marginTop: '6px' }}>
                📧 Email alerts for expiring medicines will be sent here
              </p>
            </div>

            {/* Phone */}
            <div style={{ marginBottom: '28px' }}>
              <label style={labelStyle}>
                Phone Number
                <span style={{ color: '#3d4f66', marginLeft: '6px', textTransform: 'none', letterSpacing: 0, fontSize: '11px' }}>
                  (optional)
                </span>
              </label>
              <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                <div style={{
                  position: 'absolute', left: '16px',
                  fontSize: '15px', color: '#7d8faa',
                  pointerEvents: 'none', userSelect: 'none',
                }}>+91</div>
                <input
                  name="phone" type="tel" value={form.phone}
                  onChange={e => setForm(prev => ({ ...prev, phone: e.target.value.replace(/\D/g, '').slice(0, 10) }))}
                  placeholder="98765 43210"
                  style={{ ...inputStyle, paddingLeft: '52px' }}
                  onFocus={e => e.target.style.borderColor = 'rgba(79,142,247,0.5)'}
                  onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.08)'}
                />
              </div>
            </div>

            {/* Buttons */}
            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                type="button"
                onClick={() => setForm(prev => ({ ...prev, name: user?.name || '', email: user?.email || '', phone: user?.phone || '' }))}
                style={{
                  flex: 1, padding: '13px', borderRadius: '10px', fontSize: '15px',
                  color: '#7d8faa', background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.08)', fontWeight: '500',
                }}
              >Reset</button>
              <button type="submit" disabled={saving} style={{
                flex: 2, padding: '13px', borderRadius: '10px', fontSize: '15px',
                fontFamily: 'Syne, sans-serif', fontWeight: '600', color: 'white',
                background: saving ? 'rgba(79,142,247,0.4)' : 'linear-gradient(135deg, #4f8ef7, #3b7de8)',
                border: 'none', cursor: saving ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s ease',
              }}
                onMouseEnter={e => { if (!saving) e.currentTarget.style.transform = 'translateY(-1px)'; }}
                onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
              >
                {saving ? 'Saving...' : '✓ Save Changes'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ══════════════════════════════ */}
      {/* TAB: CHANGE PASSWORD           */}
      {/* ══════════════════════════════ */}
      {activeTab === 'security' && (
        <div style={{
          background: '#0d1220', borderRadius: '20px', padding: '28px',
          border: '1px solid rgba(255,255,255,0.07)',
          animation: 'fadeUp 0.25s ease both',
        }}>
          <h2 style={{
            fontFamily: 'Syne, sans-serif', fontSize: '17px',
            fontWeight: '600', color: '#eef2ff', marginBottom: '6px',
          }}>Change Password</h2>
          <p style={{ color: '#7d8faa', fontSize: '13px', marginBottom: '22px' }}>
            Keep your account secure with a strong password.
          </p>

          <form onSubmit={handleChangePassword}>

            {/* Current password */}
            <div style={{ marginBottom: '20px' }}>
              <label style={labelStyle}>Current Password</label>
              <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                <input
                  name="currentPassword"
                  type={showPasswords.current ? 'text' : 'password'}
                  value={form.currentPassword}
                  onChange={handleChange}
                  placeholder="Your current password"
                  style={{ ...inputStyle, paddingRight: '48px' }}
                  onFocus={e => e.target.style.borderColor = 'rgba(79,142,247,0.5)'}
                  onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.08)'}
                />
                <EyeToggle show={showPasswords.current} onToggle={() => setShowPasswords(p => ({ ...p, current: !p.current }))} />
              </div>
            </div>

            {/* New password */}
            <div style={{ marginBottom: '20px' }}>
              <label style={labelStyle}>New Password</label>
              <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                <input
                  name="newPassword"
                  type={showPasswords.new ? 'text' : 'password'}
                  value={form.newPassword}
                  onChange={handleChange}
                  placeholder="Min. 6 characters"
                  style={{ ...inputStyle, paddingRight: '48px' }}
                  onFocus={e => e.target.style.borderColor = 'rgba(79,142,247,0.5)'}
                  onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.08)'}
                />
                <EyeToggle show={showPasswords.new} onToggle={() => setShowPasswords(p => ({ ...p, new: !p.new }))} />
              </div>
              {/* Strength bar */}
              {form.newPassword.length > 0 && (
                <div style={{ marginTop: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ flex: 1, height: '3px', borderRadius: '2px', background: '#1a2235', overflow: 'hidden' }}>
                    <div style={{
                      height: '100%', borderRadius: '2px',
                      width: form.newPassword.length < 6 ? '33%' : form.newPassword.length < 10 ? '66%' : '100%',
                      background: form.newPassword.length < 6 ? '#f56565' : form.newPassword.length < 10 ? '#f59e0b' : '#2dd98f',
                      transition: 'all 0.3s ease',
                    }} />
                  </div>
                  <span style={{
                    fontSize: '11px',
                    color: form.newPassword.length < 6 ? '#f56565' : form.newPassword.length < 10 ? '#f59e0b' : '#2dd98f',
                  }}>
                    {form.newPassword.length < 6 ? 'Too short' : form.newPassword.length < 10 ? 'Good' : 'Strong'}
                  </span>
                </div>
              )}
            </div>

            {/* Confirm password */}
            <div style={{ marginBottom: '28px' }}>
              <label style={labelStyle}>Confirm New Password</label>
              <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                <input
                  name="confirmPassword"
                  type={showPasswords.confirm ? 'text' : 'password'}
                  value={form.confirmPassword}
                  onChange={handleChange}
                  placeholder="Repeat new password"
                  style={{
                    ...inputStyle, paddingRight: '48px',
                    borderColor: form.confirmPassword && form.newPassword !== form.confirmPassword
                      ? 'rgba(245,101,101,0.5)' : undefined,
                  }}
                  onFocus={e => e.target.style.borderColor = 'rgba(79,142,247,0.5)'}
                  onBlur={e => e.target.style.borderColor =
                    form.confirmPassword && form.newPassword !== form.confirmPassword
                      ? 'rgba(245,101,101,0.5)'
                      : 'rgba(255,255,255,0.08)'
                  }
                />
                <EyeToggle show={showPasswords.confirm} onToggle={() => setShowPasswords(p => ({ ...p, confirm: !p.confirm }))} />
              </div>
              {form.confirmPassword && form.newPassword !== form.confirmPassword && (
                <p style={{ fontSize: '12px', color: '#f56565', marginTop: '6px' }}>
                  ✕ Passwords do not match
                </p>
              )}
              {form.confirmPassword && form.newPassword === form.confirmPassword && form.confirmPassword.length > 0 && (
                <p style={{ fontSize: '12px', color: '#2dd98f', marginTop: '6px' }}>
                  ✓ Passwords match
                </p>
              )}
            </div>

            {/* Buttons */}
            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                type="button"
                onClick={() => setForm(prev => ({ ...prev, currentPassword: '', newPassword: '', confirmPassword: '' }))}
                style={{
                  flex: 1, padding: '13px', borderRadius: '10px', fontSize: '15px',
                  color: '#7d8faa', background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.08)', fontWeight: '500',
                }}
              >Clear</button>
              <button type="submit" disabled={saving} style={{
                flex: 2, padding: '13px', borderRadius: '10px', fontSize: '15px',
                fontFamily: 'Syne, sans-serif', fontWeight: '600', color: 'white',
                background: saving ? 'rgba(245,101,101,0.3)' : 'linear-gradient(135deg, #f56565, #e53e3e)',
                border: 'none', cursor: saving ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s ease',
              }}
                onMouseEnter={e => { if (!saving) e.currentTarget.style.transform = 'translateY(-1px)'; }}
                onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
              >
                {saving ? 'Updating...' : '🔒 Update Password'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ── Account info box ── */}
      <div style={{
        marginTop: '20px', background: '#0d1220', borderRadius: '14px',
        padding: '18px 20px', border: '1px solid rgba(255,255,255,0.07)',
        display: 'flex', gap: '16px', flexWrap: 'wrap', alignItems: 'center',
      }}>
        <div style={{ flex: 1 }}>
          <p style={{ fontSize: '12px', color: '#3d4f66', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '4px' }}>Account</p>
          <p style={{ fontSize: '13px', color: '#7d8faa' }}>
            Your data is private and protected. Never shared or sold.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
          <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#2dd98f', display: 'inline-block' }} />
          <span style={{ fontSize: '13px', color: '#2dd98f' }}>Secure</span>
        </div>
      </div>
    </div>
  );
}

// ── Small reusable eye toggle ──
function EyeToggle({ show, onToggle }) {
  return (
    <button type="button" onClick={onToggle} style={{
      position: 'absolute', right: '14px',
      background: 'none', border: 'none', cursor: 'pointer',
      color: show ? '#4f8ef7' : '#3d4f66', fontSize: '18px',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      transition: 'color 0.2s ease', padding: '4px',
    }}
      onMouseEnter={e => e.currentTarget.style.color = '#4f8ef7'}
      onMouseLeave={e => e.currentTarget.style.color = show ? '#4f8ef7' : '#3d4f66'}
    >
      {show ? (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
          <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
          <line x1="1" y1="1" x2="23" y2="23"/>
        </svg>
      ) : (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
          <circle cx="12" cy="12" r="3"/>
        </svg>
      )}
    </button>
  );
}