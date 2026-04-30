import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => { logout(); navigate('/'); };

  const links = [
    { to: '/dashboard', label: 'Cabinet', icon: '⬡' },
    { to: '/scan',      label: 'Scan',    icon: '◎' },
    { to: '/add',       label: 'Add',     icon: '+' },
    { to: '/chat',      label: 'AI Chat', icon: '◈' },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <>
      <nav style={{
        position: 'sticky', top: 0, zIndex: 100,
        background: 'rgba(7,11,18,0.9)',
        backdropFilter: 'blur(24px)',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        height: '60px',
        display: 'flex', alignItems: 'center',
        padding: '0 20px',
        justifyContent: 'space-between',
        gap: '12px',
      }}>

        {/* Logo */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '12px', flexShrink: 0 }}>
          <img
            src="/icon.png"
            alt="MedTrack logo"
            style={{ width: '46px', height: '46px', objectFit: 'contain' }}
          />
          <span style={{
            fontFamily: 'Syne, sans-serif', fontWeight: '700',
            fontSize: '22px', letterSpacing: '-0.5px', lineHeight: 1,
          }}>
            <span style={{ color: '#4f8ef7' }}>Med</span>
            <span style={{ color: '#2dd98f' }}>Track</span>
          </span>
        </Link>

        {/* Desktop nav links */}
        <div className="hide-mobile" style={{
          display: 'flex', gap: '2px',
          background: 'rgba(255,255,255,0.04)',
          borderRadius: '12px', padding: '4px',
          border: '1px solid rgba(255,255,255,0.06)',
        }}>
          {links.map(link => (
            <Link key={link.to} to={link.to} style={{
              display: 'flex', alignItems: 'center', gap: '6px',
              padding: '6px 16px', borderRadius: '8px',
              fontSize: '13.5px', fontWeight: isActive(link.to) ? '500' : '400',
              color: isActive(link.to) ? '#eef2ff' : '#7d8faa',
              background: isActive(link.to) ? 'rgba(79,142,247,0.15)' : 'transparent',
              border: isActive(link.to) ? '1px solid rgba(79,142,247,0.28)' : '1px solid transparent',
              transition: 'all 0.2s ease', whiteSpace: 'nowrap',
            }}>
              <span style={{ fontSize: '12px' }}>{link.icon}</span>
              {link.label}
            </Link>
          ))}
        </div>

        {/* Right side */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0 }}>

          {/* ✅ Clickable user pill → goes to /profile */}
          <Link
            to="/profile"
            className="hide-mobile"
            style={{
              display: 'flex', alignItems: 'center', gap: '8px',
              padding: '5px 12px 5px 6px',
              background: isActive('/profile') ? 'rgba(79,142,247,0.1)' : 'rgba(255,255,255,0.04)',
              borderRadius: '20px',
              border: isActive('/profile') ? '1px solid rgba(79,142,247,0.3)' : '1px solid rgba(255,255,255,0.07)',
              textDecoration: 'none',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.borderColor = 'rgba(79,142,247,0.35)';
              e.currentTarget.style.background = 'rgba(79,142,247,0.08)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.borderColor = isActive('/profile') ? 'rgba(79,142,247,0.3)' : 'rgba(255,255,255,0.07)';
              e.currentTarget.style.background = isActive('/profile') ? 'rgba(79,142,247,0.1)' : 'rgba(255,255,255,0.04)';
            }}
          >
            <div style={{
              width: '26px', height: '26px', borderRadius: '50%',
              background: 'linear-gradient(135deg, #4f8ef7, #2dd98f)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontFamily: 'Syne, sans-serif', fontWeight: '700',
              fontSize: '12px', color: 'white', flexShrink: 0,
            }}>
              {user?.name?.charAt(0)?.toUpperCase() || 'U'}
            </div>
            <span style={{
              fontSize: '13px', color: '#7d8faa',
              maxWidth: '100px', overflow: 'hidden',
              textOverflow: 'ellipsis', whiteSpace: 'nowrap',
            }}>
              {user?.name?.split(' ')[0]}
            </span>
          </Link>

          {/* Logout button */}
          <button onClick={handleLogout} className="hide-mobile" style={{
            padding: '7px 16px', borderRadius: '8px',
            fontSize: '13px', fontWeight: '500', color: '#f56565',
            background: 'rgba(245,101,101,0.08)',
            border: '1px solid rgba(245,101,101,0.2)',
            transition: 'all 0.2s ease',
          }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(245,101,101,0.16)'}
            onMouseLeave={e => e.currentTarget.style.background = 'rgba(245,101,101,0.08)'}
          >Logout</button>

          {/* Mobile hamburger */}
          <button className="hide-desktop" onClick={() => setMenuOpen(!menuOpen)} style={{
            width: '36px', height: '36px', borderRadius: '8px',
            background: 'rgba(255,255,255,0.06)',
            border: '1px solid rgba(255,255,255,0.08)',
            color: '#eef2ff', fontSize: '18px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>{menuOpen ? '✕' : '☰'}</button>
        </div>
      </nav>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="hide-desktop" style={{
          position: 'fixed', top: '60px', left: 0, right: 0, bottom: 0,
          background: 'rgba(7,11,18,0.97)',
          backdropFilter: 'blur(20px)',
          zIndex: 99,
          padding: '24px 20px',
          display: 'flex', flexDirection: 'column', gap: '8px',
          animation: 'fadeIn 0.2s ease',
        }}>
          {links.map(link => (
            <Link key={link.to} to={link.to} onClick={() => setMenuOpen(false)} style={{
              display: 'flex', alignItems: 'center', gap: '14px',
              padding: '14px 18px', borderRadius: '12px',
              fontSize: '16px', fontWeight: isActive(link.to) ? '500' : '400',
              color: isActive(link.to) ? '#eef2ff' : '#7d8faa',
              background: isActive(link.to) ? 'rgba(79,142,247,0.12)' : 'rgba(255,255,255,0.04)',
              border: `1px solid ${isActive(link.to) ? 'rgba(79,142,247,0.25)' : 'rgba(255,255,255,0.06)'}`,
            }}>
              <span style={{ fontSize: '20px' }}>{link.icon}</span>
              {link.label}
            </Link>
          ))}

          {/* Mobile profile link */}
          <Link to="/profile" onClick={() => setMenuOpen(false)} style={{
            display: 'flex', alignItems: 'center', gap: '14px',
            padding: '14px 18px', borderRadius: '12px',
            fontSize: '16px', fontWeight: isActive('/profile') ? '500' : '400',
            color: isActive('/profile') ? '#eef2ff' : '#7d8faa',
            background: isActive('/profile') ? 'rgba(79,142,247,0.12)' : 'rgba(255,255,255,0.04)',
            border: `1px solid ${isActive('/profile') ? 'rgba(79,142,247,0.25)' : 'rgba(255,255,255,0.06)'}`,
          }}>
            <span style={{ fontSize: '20px' }}>👤</span>
            My Profile
          </Link>

          <div style={{
            marginTop: '16px', padding: '14px 18px', borderRadius: '12px',
            background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)',
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          }}>
            <span style={{ color: '#7d8faa', fontSize: '14px' }}>{user?.name}</span>
            <button onClick={handleLogout} style={{ color: '#f56565', fontSize: '14px', background: 'none', border: 'none', cursor: 'pointer' }}>
              Logout
            </button>
          </div>
        </div>
      )}
    </>
  );
}