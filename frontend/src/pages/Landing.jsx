import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';

const features = [
  { icon: '◎', title: 'AI Label Scanner', desc: 'Take a photo of any medicine box. AI reads the label and fills in all details — name, dosage, and expiry date — in seconds.', color: '#4f8ef7', bg: 'rgba(79,142,247,0.08)', border: 'rgba(79,142,247,0.15)' },
  { icon: '⬡', title: 'Expiry Dashboard', desc: 'All your medicines in one place, color-coded by urgency. See what is expired, expiring soon, and what is safe at a glance.', color: '#2dd98f', bg: 'rgba(45,217,143,0.08)', border: 'rgba(45,217,143,0.15)' },
  { icon: '◈', title: 'AI Chat Assistant', desc: 'Ask anything in your language. "Do I have something for fever?" Your AI knows your exact medicine cabinet.', color: '#f59e0b', bg: 'rgba(245,158,11,0.08)', border: 'rgba(245,158,11,0.15)' },
  { icon: '✉', title: 'Daily Email Alerts', desc: 'Get automatic email reminders before your medicines expire. Stay safe without opening the app every day.', color: '#f56565', bg: 'rgba(245,101,101,0.08)', border: 'rgba(245,101,101,0.15)' },
  { icon: '🔒', title: 'Secure & Private', desc: 'Your medicine data is yours alone. Protected with industry-standard JWT authentication. Never shared or sold.', color: '#a78bfa', bg: 'rgba(167,139,250,0.08)', border: 'rgba(167,139,250,0.15)' },
  { icon: '📱', title: 'Works Everywhere', desc: 'Fully responsive — works perfectly on your phone, tablet, or desktop. No app download needed, just open your browser.', color: '#2dd98f', bg: 'rgba(45,217,143,0.08)', border: 'rgba(45,217,143,0.15)' },
];

const steps = [
  { num: '01', title: 'Create your free account', desc: 'Sign up in 30 seconds with your name and email. No credit card, no hidden charges, no spam.' },
  { num: '02', title: 'Add your medicines', desc: 'Scan the label with your camera or type it in manually. AI reads and fills all the details for you automatically.' },
  { num: '03', title: 'Get alerts before expiry', desc: 'Receive daily email reminders. Ask AI questions about your medicines anytime, in any language.' },
  { num: '04', title: 'Never worry again', desc: 'MedTrack watches your medicine cabinet 24/7 so you and your family always stay safe.' },
];

// ── SVG Social Icons ──
const LinkedInIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
  </svg>
);
const TwitterXIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
  </svg>
);
const InstagramIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/>
  </svg>
);
const GitHubIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
  </svg>
);
const YouTubeIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
  </svg>
);

const SOCIALS = [
  { Icon: LinkedInIcon,  href: 'https://www.linkedin.com/in/bipasha-mondal-59aa60244/', title: 'LinkedIn',  color: '#0A66C2' },
  { Icon: TwitterXIcon,  href: 'https://x.com/Bipasha51258342',                          title: 'Twitter/X', color: '#ffffff' },
  { Icon: InstagramIcon, href: 'https://instagram.com',                                  title: 'Instagram', color: '#E1306C' },
  { Icon: GitHubIcon,    href: 'https://github.com/Bipasha1003/MedTrack',                title: 'GitHub',    color: '#ffffff' },
  { Icon: YouTubeIcon,   href: 'https://youtube.com',                                    title: 'YouTube',   color: '#FF0000' },
];

// ── Footer heading with line that stays within its column ──
function FooterHeading({ children }) {
  return (
    <div style={{ marginBottom: '20px' }}>
      <h4 style={{
        fontFamily: 'Outfit, sans-serif',
        fontSize: '15px', fontWeight: '700',
        color: '#eef2ff',
        textTransform: 'uppercase',
        letterSpacing: '1.8px',
        marginBottom: '10px',
        margin: 0,
        paddingBottom: '10px',
      }}>{children}</h4>
      <div style={{
        height: '1px',
        width: '100%',
        background: 'linear-gradient(to right, rgba(79,142,247,0.6), rgba(45,217,143,0.2) 50%, transparent)',
        marginBottom: '0',
      }} />
    </div>
  );
}

const scrollTo = (id) => {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
};

export default function Landing() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', fn);
    return () => window.removeEventListener('scroll', fn);
  }, []);

  const navLinkStyle = {
    fontSize: '14px', color: '#7d8faa', background: 'none',
    border: 'none', cursor: 'pointer', padding: '4px 0',
    transition: 'color 0.2s ease', fontFamily: 'Plus Jakarta Sans, sans-serif',
  };

  return (
    <div style={{ background: '#070b12', color: '#eef2ff', fontFamily: 'Plus Jakarta Sans, sans-serif', overflowX: 'hidden' }}>

      {/* BG orbs */}
      <div style={{ position: 'fixed', top: '-200px', right: '-100px', width: '600px', height: '600px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(79,142,247,0.4), transparent 70%)', filter: 'blur(80px)', pointerEvents: 'none', zIndex: 0, opacity: 0.3 }} />
      <div style={{ position: 'fixed', bottom: '-100px', left: '-100px', width: '500px', height: '500px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(45,217,143,0.3), transparent 70%)', filter: 'blur(80px)', pointerEvents: 'none', zIndex: 0, opacity: 0.3 }} />

      {/* ── NAVBAR ── */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 200,
        height: '64px', display: 'flex', alignItems: 'center',
        padding: '0 5%', justifyContent: 'space-between',
        background: scrolled ? 'rgba(7,11,18,0.95)' : 'rgba(7,11,18,0.6)',
        backdropFilter: 'blur(24px)',
        borderBottom: scrolled ? '1px solid rgba(255,255,255,0.07)' : '1px solid transparent',
        transition: 'all 0.3s ease',
        boxShadow: scrolled ? '0 4px 30px rgba(0,0,0,0.3)' : 'none',
      }}>
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
          <img src="/icon.png" alt="MedTrack" style={{ width: '40px', height: '40px', objectFit: 'contain' }} />
          <span style={{ fontFamily: 'Outfit, sans-serif', fontWeight: '700', fontSize: '22px', letterSpacing: '-0.4px' }}>
            <span style={{ color: '#4f8ef7' }}>Med</span><span style={{ color: '#2dd98f' }}>Track</span>
          </span>
        </Link>

        <div style={{ display: 'flex', gap: '36px', alignItems: 'center' }} className="hide-mobile">
          {[{ label: 'Home', id: 'home' }, { label: 'Features', id: 'features' }, { label: 'How it works', id: 'how-it-works' }, { label: 'Contact', id: 'contact' }].map(link => (
            <button key={link.id} onClick={() => scrollTo(link.id)} style={{
              fontSize: '16px', fontWeight: '500', color: '#c8d6e8',
              background: 'none', border: 'none', cursor: 'pointer', padding: '4px 0',
              fontFamily: 'Plus Jakarta Sans, sans-serif',
              transition: 'color 0.2s ease',
            }}
              onMouseEnter={e => e.currentTarget.style.color = '#ffffff'}
              onMouseLeave={e => e.currentTarget.style.color = '#c8d6e8'}
            >{link.label}</button>
          ))}
        </div>

        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <Link to="/login">
            <button style={{ padding: '8px 18px', borderRadius: '8px', fontSize: '15px', color: '#7d8faa', background: 'transparent', border: '1px solid rgba(255,255,255,0.1)', cursor: 'pointer', transition: 'all .2s', fontFamily: 'Plus Jakarta Sans, sans-serif' }}
              onMouseEnter={e => { e.currentTarget.style.color = '#eef2ff'; e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; }}
              onMouseLeave={e => { e.currentTarget.style.color = '#abbbd3'; e.currentTarget.style.background = 'transparent'; }}
            >Log in</button>
          </Link>
          <Link to="/register">
            <button style={{ padding: '9px 22px', borderRadius: '9px', fontSize: '15px', fontFamily: 'Outfit, sans-serif', fontWeight: '600', color: '#fff', background: 'linear-gradient(135deg,#4f8ef7,#3b7de8)', boxShadow: '0 4px 20px rgba(79,142,247,0.35)', border: 'none', cursor: 'pointer', transition: 'all .2s' }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 8px 28px rgba(79,142,247,0.5)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 20px rgba(79,142,247,0.35)'; }}
            >Get started free →</button>
          </Link>
          <button className="hide-desktop" onClick={() => setMobileMenuOpen(p => !p)}
            style={{ width: '36px', height: '36px', borderRadius: '8px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: '#eef2ff', fontSize: '16px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >{mobileMenuOpen ? '✕' : '☰'}</button>
        </div>
      </nav>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="hide-desktop" style={{ position: 'fixed', top: '64px', left: 0, right: 0, background: 'rgba(7,11,18,0.97)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(255,255,255,0.07)', zIndex: 199, padding: '16px 5%', display: 'flex', flexDirection: 'column', gap: '4px' }}>
          {[{ label: 'Home', id: 'home' }, { label: 'Features', id: 'features' }, { label: 'How it works', id: 'how-it-works' }, { label: 'Contact', id: 'contact' }].map(link => (
            <button key={link.id} onClick={() => { scrollTo(link.id); setMobileMenuOpen(false); }} style={{ ...navLinkStyle, padding: '12px 0', fontSize: '15px', borderBottom: '1px solid rgba(255,255,255,0.05)', textAlign: 'left', width: '100%' }}>{link.label}</button>
          ))}
        </div>
      )}

      {/* ── HERO ── */}
      <section id="home" style={{ position: 'relative', zIndex: 1, minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: 'clamp(100px,15vw,140px) 5% clamp(60px,10vw,100px)', animation: 'fadeUp 0.5s ease both' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 16px', borderRadius: '20px', background: 'rgba(45,217,143,0.1)', border: '1px solid rgba(45,217,143,0.25)', fontSize: '13px', color: '#2dd98f', marginBottom: '28px' }}>
          <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#2dd98f', display: 'inline-block', animation: 'pulse 2s ease infinite' }} />
          AI-Powered · Free to use · Trusted by families
        </div>
        <h1 style={{ fontFamily: 'Outfit, sans-serif', fontSize: 'clamp(36px,6.5vw,68px)', fontWeight: '750', letterSpacing: '-2px', lineHeight: 1.1, maxWidth: '820px', marginBottom: '20px', color: '#eef2ff' }}>
          Your family's medicine cabinet,{' '}
          <span style={{ background: 'linear-gradient(135deg, #4f8ef7, #2dd98f)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>always safe.</span>
        </h1>
        <p style={{ fontSize: 'clamp(15px,2vw,18px)', color: '#bbc6d6', maxWidth: '520px', lineHeight: '1.7', marginBottom: '36px' }}>
          Scan medicine labels with your camera, track expiry dates, get daily email alerts, and ask AI anything — all in one free app.
        </p>
        <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap', justifyContent: 'center', marginBottom: '60px' }}>
          <Link to="/register">
            <button style={{ padding: '14px 32px', borderRadius: '12px', fontSize: '15px', fontFamily: 'Outfit, sans-serif', fontWeight: '600', color: '#fff', background: 'linear-gradient(135deg,#4f8ef7,#3b7de8)', boxShadow: '0 8px 30px rgba(79,142,247,0.4)', border: 'none', cursor: 'pointer', transition: 'all .2s' }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 14px 40px rgba(79,142,247,0.5)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 8px 30px rgba(79,142,247,0.4)'; }}
            >✚ Create free account</button>
          </Link>
          <Link to="/login">
            <button style={{ padding: '14px 32px', borderRadius: '12px', fontSize: '15px', fontWeight: '500', color: '#eef2ff', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.13)', cursor: 'pointer', transition: 'all .2s' }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
              onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
            >Sign in →</button>
          </Link>
        </div>

        {/* App mockup */}
        <div style={{ width: '100%', maxWidth: '760px', background: '#0d1220', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.1)', overflow: 'hidden', boxShadow: '0 40px 100px rgba(0,0,0,0.6)' }}>
          <div style={{ background: '#111827', padding: '12px 18px', display: 'flex', alignItems: 'center', gap: '8px', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
            <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#f56565' }} />
            <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#f59e0b' }} />
            <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#2dd98f' }} />
            <span style={{ fontSize: '12px', color: '#3d4f66', marginLeft: '8px' }}>My Medicine Cabinet · MedTrack</span>
          </div>
          <div style={{ padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div>
                <div style={{ fontFamily: 'Outfit, sans-serif', fontSize: '18px', fontWeight: '700', color: '#eef2ff' }}>My Medicine Cabinet</div>
                <div style={{ fontSize: '13px', color: '#7d8faa', marginTop: '2px' }}>6 medicines tracked</div>
              </div>
              <button style={{ padding: '8px 16px', borderRadius: '8px', fontSize: '13px', color: '#fff', background: 'linear-gradient(135deg,#4f8ef7,#3b7de8)', fontFamily: 'Outfit, sans-serif', fontWeight: '600', border: 'none' }}>+ Add</button>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '10px', marginBottom: '16px' }}>
              {[{ val: '1', lbl: 'Expired', color: '#f56565' }, { val: '2', lbl: 'Expiring Soon', color: '#f59e0b' }, { val: '3', lbl: 'Good', color: '#2dd98f' }].map(s => (
                <div key={s.lbl} style={{ borderRadius: '12px', padding: '14px', textAlign: 'center', background: `${s.color}18`, border: `1px solid ${s.color}33` }}>
                  <div style={{ fontFamily: 'Outfit, sans-serif', fontSize: '26px', fontWeight: '700', color: s.color }}>{s.val}</div>
                  <div style={{ fontSize: '12px', color: '#7d8faa', marginTop: '5px' }}>{s.lbl}</div>
                </div>
              ))}
            </div>
            {[
              { name: 'Amoxicillin 500mg', info: '📦 Qty: 12 · 📅 15 Jan 2025', badge: 'Expired',   color: '#f56565' },
              { name: 'Paracetamol 650mg', info: '📦 Qty: 20 · 📅 18 May 2026', badge: '18d left',  color: '#f59e0b' },
              { name: 'Vitamin D3 Drops',  info: '📦 Qty: 1  · 📅 10 Dec 2026', badge: '224d left', color: '#2dd98f' },
            ].map(m => (
              <div key={m.name} style={{ background: '#111827', borderRadius: '12px', padding: '14px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderLeft: `3px solid ${m.color}`, marginBottom: '8px' }}>
                <div>
                  <div style={{ fontWeight: '500', fontSize: '14px', color: '#eef2ff' }}>{m.name}</div>
                  <div style={{ fontSize: '12px', color: '#7d8faa', marginTop: '2px' }}>{m.info}</div>
                </div>
                <span style={{ fontSize: '12px', fontWeight: '600', padding: '4px 12px', borderRadius: '20px', background: `${m.color}18`, color: m.color, border: `1px solid ${m.color}33` }}>{m.badge}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section id="features" style={{ position: 'relative', zIndex: 1, padding: 'clamp(6px,10vw,100px) 5%', maxWidth: '1100px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 'clamp(40px,6vw,64px)' }}>
          <p style={{ fontSize: '15px', fontWeight: '500', textTransform: 'uppercase', letterSpacing: '1.5px', color: '#4f8ef7', marginBottom: '20px' }}>Features</p>
          <h2 style={{ fontFamily: 'Outfit, sans-serif', fontSize: 'clamp(26px,4vw,40px)', fontWeight: '700', letterSpacing: '-1px', lineHeight: 1.15, color: '#eef2ff' }}>Everything your medicine cabinet needs</h2>
          <p style={{ color: '#7d8faa', fontSize: '18px', marginTop: '12px', maxWidth: '500px', margin: '12px auto 0' }}>Built for Indian families, designed to keep everyone safe.</p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
          {features.map(f => (
            <div key={f.title} style={{ background: '#0d1220', borderRadius: '18px', padding: '28px 24px', border: `1px solid ${f.border}`, transition: 'all .25s ease', cursor: 'default' }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.background = '#111827'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.background = '#0d1220'; }}
            >
              <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: f.bg, border: `1px solid ${f.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px', color: f.color, marginBottom: '18px' }}>{f.icon}</div>
              <div style={{ fontFamily: 'Outfit, sans-serif', fontSize: '17px', fontWeight: '600', marginBottom: '8px', color: '#eef2ff' }}>{f.title}</div>
              <div style={{ fontSize: '14px', color: '#7d8faa', lineHeight: '1.65' }}>{f.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section id="how-it-works" style={{ position: 'relative', zIndex: 1, padding: 'clamp(60px,10vw,100px) 5%', background: 'rgba(255,255,255,0.02)' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 'clamp(40px,6vw,64px)' }}>
            <p style={{ fontSize: '15px', fontWeight: '500', textTransform: 'uppercase', letterSpacing: '1.5px', color: '#2dd98f', marginBottom: '20px' }}>How it works</p>
            <h2 style={{ fontFamily: 'Outfit, sans-serif', fontSize: 'clamp(26px,4vw,40px)', fontWeight: '700', letterSpacing: '-1px', lineHeight: 1.15, color: '#eef2ff' }}>Up and running in minutes</h2>
            <p style={{ color: '#7d8faa', fontSize: '18px', marginTop: '12px' }}>No complicated setup. Just sign up and start tracking.</p>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {steps.map((step, i) => (
              <div key={step.num} style={{ display: 'flex', gap: '20px', alignItems: 'flex-start', background: '#0d1220', borderRadius: '16px', padding: '24px', border: '1px solid rgba(255,255,255,0.07)', transition: 'border-color 0.2s ease' }}
                onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(79,142,247,0.25)'}
                onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)'}
              >
                <div style={{ width: '48px', height: '48px', borderRadius: '12px', flexShrink: 0, background: `rgba(79,142,247,${0.08 + i * 0.04})`, border: '1px solid rgba(79,142,247,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Outfit, sans-serif', fontWeight: '700', fontSize: '15px', color: '#4f8ef7' }}>{step.num}</div>
                <div>
                  <h3 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '17px', fontWeight: '600', color: '#eef2ff', marginBottom: '6px' }}>{step.title}</h3>
                  <p style={{ fontSize: '14px', color: '#7d8faa', lineHeight: '1.65', margin: 0 }}>{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={{ position: 'relative', zIndex: 1, padding: 'clamp(60px,10vw,100px) 5%' }}>
        <div style={{ maxWidth: '700px', margin: '0 auto', textAlign: 'center', background: 'linear-gradient(135deg, rgba(79,142,247,0.08), rgba(45,217,143,0.06))', borderRadius: '28px', padding: 'clamp(40px,6vw,72px) clamp(24px,5vw,64px)', border: '1px solid rgba(79,142,247,0.15)' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>💊</div>
          <h2 style={{ fontFamily: 'Outfit, sans-serif', fontSize: 'clamp(24px,4vw,36px)', fontWeight: '700', letterSpacing: '-1px', marginBottom: '12px', color: '#eef2ff' }}>Keep your family safe from expired medicines</h2>
          <p style={{ fontSize: '16px', color: '#7d8faa', marginBottom: '32px', lineHeight: '1.7' }}>Free forever. Works on any device. Takes 30 seconds to set up.</p>
          <div style={{ display: 'flex', gap: '14px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/register">
              <button style={{ padding: '15px 36px', borderRadius: '12px', fontSize: '15px', fontFamily: 'Outfit, sans-serif', fontWeight: '600', color: '#fff', background: 'linear-gradient(135deg,#4f8ef7,#3b7de8)', boxShadow: '0 8px 30px rgba(79,142,247,0.4)', border: 'none', cursor: 'pointer', transition: 'all .2s' }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 14px 40px rgba(79,142,247,0.5)'; }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 8px 30px rgba(79,142,247,0.4)'; }}
              >Get started — it's free →</button>
            </Link>
            <Link to="/login">
              <button style={{ padding: '15px 28px', borderRadius: '12px', fontSize: '15px', fontWeight: '500', color: '#eef2ff', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.13)', cursor: 'pointer', transition: 'all .2s' }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
                onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
              >Already have an account</button>
            </Link>
          </div>
          <p style={{ marginTop: '20px', fontSize: '13px', color: '#3d4f66' }}>Free forever · Takes 30 seconds to set up</p>
        </div>
      </section>

      {/* ── CONTACT ── */}
      <section id="contact" style={{ position: 'relative', zIndex: 1, padding: 'clamp(60px,10vw,80px) 5%', background: 'rgba(255,255,255,0.015)' }}>
        <div style={{ maxWidth: '600px', margin: '0 auto', textAlign: 'center' }}>
          <p style={{ fontSize: '16px', fontWeight: '500', textTransform: 'uppercase', letterSpacing: '1.5px', color: '#4f8ef7', marginBottom: '20px' }}>Contact</p>
          <h2 style={{ fontFamily: 'Outfit, sans-serif', fontSize: 'clamp(24px,4vw,36px)', fontWeight: '700', letterSpacing: '-1px', marginBottom: '12px', color: '#eef2ff' }}>We're here to help</h2>
          <p style={{ color: '#7d8faa', fontSize: '18px', lineHeight: '1.7', marginBottom: '32px' }}>Have a question, suggestion, or need support? Reach out and we'll get back to you within 24 hours.</p>
          <a href="mailto:meditrackerexpire@gmail.com" style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', padding: '14px 28px', borderRadius: '12px', background: 'rgba(79,142,247,0.1)', border: '1px solid rgba(79,142,247,0.25)', color: '#4f8ef7', fontSize: '15px', fontWeight: '500', textDecoration: 'none', transition: 'all 0.2s ease' }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(79,142,247,0.18)'}
            onMouseLeave={e => e.currentTarget.style.background = 'rgba(79,142,247,0.1)'}
          >✉ meditrackerexpire@gmail.com</a>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════ */}
      {/* ── FOOTER ──────────────────────────────────────────────── */}
      {/* ══════════════════════════════════════════════════════════ */}
      <footer style={{ position: 'relative', zIndex: 1, width: '100%', background: '#060a10', borderTop: '1px solid rgba(255,255,255,0.08)', overflow: 'hidden' }}>

        <div style={{ position: 'absolute', bottom: 0, left: '50%', transform: 'translateX(-50%)', width: '80vw', height: '260px', background: 'radial-gradient(ellipse at center bottom, rgba(79,142,247,0.05) 0%, transparent 70%)', pointerEvents: 'none' }} />

        {/* Top CTA banner */}
        <div style={{ width: '100%', boxSizing: 'border-box', background: 'linear-gradient(100deg, #0d1e3a 0%, #091a12 50%, #0d1e3a 100%)', borderBottom: '1px solid rgba(255,255,255,0.07)', padding: '22px 5%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '7px', padding: '5px 14px', borderRadius: '99px', background: 'rgba(45,217,143,0.12)', border: '1px solid rgba(45,217,143,0.3)' }}>
              <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#2dd98f', display: 'inline-block', animation: 'pulse 2s ease infinite' }} />
              <span style={{ fontSize: '14px', fontWeight: '700', color: '#2dd98f', letterSpacing: '1px', textTransform: 'uppercase' }}>Free Forever</span>
            </div>
            <span style={{ fontSize: '18px', fontWeight: '600', color: '#eef2ff', fontFamily: 'Outfit, sans-serif' }}>MedTrack — 100% free. Always.</span>
          </div>
          <Link to="/register">
            <button style={{ padding: '10px 26px', borderRadius: '9px', fontSize: '16px', fontFamily: 'Outfit, sans-serif', fontWeight: '700', color: '#fff', background: 'linear-gradient(135deg, #4f8ef7, #2dd98f)', border: 'none', cursor: 'pointer', whiteSpace: 'nowrap', boxShadow: '0 4px 18px rgba(79,142,247,0.38)', transition: 'all .2s' }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 8px 28px rgba(79,142,247,0.5)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 18px rgba(79,142,247,0.38)'; }}
            >Get started now →</button>
          </Link>
        </div>

        {/* Main grid */}
        <div style={{ width: '100%', boxSizing: 'border-box', padding: '56px 5% 44px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: '48px 40px' }}>

          {/* Brand + Social */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
              <img src="/icon.png" alt="MedTrack" style={{ width: '38px', height: '38px', objectFit: 'contain' }} />
              <span style={{ fontFamily: 'Outfit, sans-serif', fontWeight: '750', fontSize: '20px', letterSpacing: '-0.5px' }}>
                <span style={{ color: '#4f8ef7' }}>Med</span><span style={{ color: '#2dd98f' }}>Track</span>
              </span>
            </div>
            <p style={{ fontSize: '16px', color: '#a5b2c6', lineHeight: '1.8', marginBottom: '22px', maxWidth: '220px' }}>
              Never use an expired medicine again. Smart, AI-powered medicine cabinet for your entire family.
            </p>
            <p style={{ fontSize: '13px', fontWeight: '700', color: '#4f8ef7', textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: '12px' }}>Follow Us</p>
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              {SOCIALS.map(({ Icon, href, title, color }) => (
                <a key={title} href={href} target="_blank" rel="noopener noreferrer" title={title}
                  style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#7d8faa', textDecoration: 'none', transition: 'all 0.2s ease' }}
                  onMouseEnter={e => { e.currentTarget.style.background = `${color}22`; e.currentTarget.style.borderColor = `${color}55`; e.currentTarget.style.color = color; e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = `0 6px 20px ${color}33`; }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; e.currentTarget.style.color = '#7d8faa'; e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}
                ><Icon /></a>
              ))}
            </div>
          </div>

          <div>
            <FooterHeading>User Area</FooterHeading>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '13px' }}>
              {[
                { label: 'Dashboard',    icon: '⬡', to: '/dashboard' },
                { label: 'Scan Label',   icon: '◎', to: '/scan' },
                { label: 'Add Medicine', icon: '+', to: '/add' },
                { label: 'AI Chat',      icon: '◈', to: '/chat' },
                { label: 'My Profile',   icon: '👤', to: '/profile' },
              ].map(l => (
                <Link key={l.to} to={l.to}
                  style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '14px', color: '#7d8faa', textDecoration: 'none', transition: 'all .2s ease' }}
                  onMouseEnter={e => { e.currentTarget.style.color = '#eef2ff'; e.currentTarget.style.paddingLeft = '4px'; }}
                  onMouseLeave={e => { e.currentTarget.style.color = '#7d8faa'; e.currentTarget.style.paddingLeft = '0'; }}
                >
                  <span style={{ fontSize: '14px', width: '16px', textAlign: 'center', color: '#4f8ef7', flexShrink: 0 }}>{l.icon}</span>
                  {l.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Navigate */}
          <div>
            <FooterHeading>Navigate</FooterHeading>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '13px' }}>
              {[{ label: 'Home', id: 'home' }, { label: 'Features', id: 'features' }, { label: 'How it works', id: 'how-it-works' }, { label: 'Contact', id: 'contact' }].map(l => (
                <button key={l.id} onClick={() => scrollTo(l.id)}
                  style={{ fontSize: '14px', color: '#7d8faa', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left', padding: 0, fontFamily: 'Plus Jakarta Sans, sans-serif', transition: 'all .2s ease' }}
                  onMouseEnter={e => { e.currentTarget.style.color = '#eef2ff'; e.currentTarget.style.paddingLeft = '4px'; }}
                  onMouseLeave={e => { e.currentTarget.style.color = '#7d8faa'; e.currentTarget.style.paddingLeft = '0'; }}
                >{l.label}</button>
              ))}
            </div>
            <div style={{ marginTop: '28px', background: 'linear-gradient(135deg, rgba(79,142,247,0.1), rgba(45,217,143,0.07))', border: '1px solid rgba(79,142,247,0.2)', borderRadius: '12px', padding: '14px 16px' }}>
              <div style={{ fontSize: '13px', fontWeight: '700', color: '#eef2ff', marginBottom: '4px' }}>🤖 AI-Powered</div>
              <div style={{ fontSize: '12px', color: '#7d8faa', lineHeight: '1.6' }}>Scan · Chat · Alerts<br />All in one place</div>
            </div>
          </div>

          {/* Contact Us */}
          <div>
            <FooterHeading>Contact Us</FooterHeading>
            <a href="mailto:meditrackerexpire@gmail.com"
              style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '13px', borderRadius: '11px', marginBottom: '10px', background: 'rgba(79,142,247,0.07)', border: '1px solid rgba(79,142,247,0.18)', textDecoration: 'none', transition: 'all .2s' }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(79,142,247,0.15)'; e.currentTarget.style.borderColor = 'rgba(79,142,247,0.35)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'rgba(79,142,247,0.07)'; e.currentTarget.style.borderColor = 'rgba(79,142,247,0.18)'; }}
            >
              <span style={{ fontSize: '18px' }}>✉</span>
              <div>
                <div style={{ fontSize: '13px', color: '#4f8ef7', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '2px' }}>Email</div>
                <div style={{ fontSize: '13px', color: '#c8d6e8', wordBreak: 'break-all' }}>meditrackerexpire@gmail.com</div>
              </div>
            </a>
            <a href="tel:+916290747227"
              style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '13px', borderRadius: '11px', marginBottom: '10px', background: 'rgba(45,217,143,0.07)', border: '1px solid rgba(45,217,143,0.18)', textDecoration: 'none', transition: 'all .2s' }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(45,217,143,0.14)'; e.currentTarget.style.borderColor = 'rgba(45,217,143,0.35)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'rgba(45,217,143,0.07)'; e.currentTarget.style.borderColor = 'rgba(45,217,143,0.18)'; }}
            >
              <span style={{ fontSize: '18px' }}>📞</span>
              <div>
                <div style={{ fontSize: '13px', color: '#2dd98f', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '2px' }}>Support</div>
                <div style={{ fontSize: '13px', color: '#c8d6e8' }}>+91 62907 47227</div>
              </div>
            </a>
            <div style={{ display: 'flex', gap: '8px' }}>
              <div style={{ flex: 1, padding: '11px', borderRadius: '10px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}>
                <div style={{ fontSize: '13px', color: '#4f8ef7', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '4px' }}>🕐 Hours</div>
                <div style={{ fontSize: '12px', color: '#c8d6e8', lineHeight: '1.6' }}>Mon–Sat<br />9am – 6pm IST</div>
              </div>
              <div style={{ flex: 1, padding: '11px', borderRadius: '10px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}>
                <div style={{ fontSize: '13px', color: '#2dd98f', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '4px' }}>📍 Location</div>
                <div style={{ fontSize: '12px', color: '#c8d6e8', lineHeight: '1.6' }}>Kolkata<br />West Bengal, IN</div>
              </div>
            </div>
          </div>
        </div>

        {/* Gradient divider */}
        <div style={{ width: '100%', height: '1px', background: 'linear-gradient(to right, transparent, rgba(255,255,255,0.1) 20%, rgba(255,255,255,0.1) 80%, transparent)' }} />

        {/* Bottom bar */}
        <div style={{ width: '100%', boxSizing: 'border-box', padding: '20px 5%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
          <span style={{ fontSize: '14px', color: '#3d4f66' }}>
            © 2026 <strong style={{ color: '#7d8faa', fontFamily: 'Outfit, sans-serif' }}>MedTrack</strong>. All rights reserved. Made with ♥ in India.
          </span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
            <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#2dd98f', display: 'inline-block', animation: 'pulse 2s ease infinite' }} />
            <span style={{ fontSize: '14px', color: '#3d4f66', fontWeight: '500' }}>All systems operational</span>
          </div>
          <div style={{ display: 'flex', gap: '20px' }}>
            {['Privacy Policy', 'Terms of Service', 'Cookie Policy'].map(l => (
              <a key={l} href="#"
                style={{ fontSize: '14px', color: '#3d4f66', textDecoration: 'none', transition: 'color .2s', fontWeight: '500' }}
                onMouseEnter={e => e.currentTarget.style.color = '#eef2ff'}
                onMouseLeave={e => e.currentTarget.style.color = '#3d4f66'}
              >{l}</a>
            ))}
          </div>
        </div>
      </footer>

      <style>{`
        @keyframes fadeUp { from { opacity: 0; transform: translateY(24px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes pulse  { 0%,100%{opacity:1} 50%{opacity:0.4} }
        @media (max-width: 768px) { .hide-mobile  { display: none !important; } }
        @media (min-width: 769px) { .hide-desktop { display: none !important; } }
      `}</style>
    </div>
  );
}