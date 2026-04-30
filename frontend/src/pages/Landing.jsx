import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';

const features = [
  {
    icon: '◎',
    title: 'AI Label Scanner',
    desc: 'Take a photo of any medicine box. AI reads the label and fills in all details — name, dosage, and expiry date — in seconds.',
    color: '#4f8ef7',
    bg: 'rgba(79,142,247,0.08)',
    border: 'rgba(79,142,247,0.15)',
  },
  {
    icon: '⬡',
    title: 'Expiry Dashboard',
    desc: 'All your medicines in one place, color-coded by urgency. See what is expired, expiring soon, and what is safe at a glance.',
    color: '#2dd98f',
    bg: 'rgba(45,217,143,0.08)',
    border: 'rgba(45,217,143,0.15)',
  },
  {
    icon: '◈',
    title: 'AI Chat Assistant',
    desc: 'Ask anything in your language. "Do I have something for fever?" Your AI knows your exact medicine cabinet.',
    color: '#f59e0b',
    bg: 'rgba(245,158,11,0.08)',
    border: 'rgba(245,158,11,0.15)',
  },
  {
    icon: '✉',
    title: 'Daily Email Alerts',
    desc: 'Get automatic email reminders before your medicines expire. Stay safe without opening the app every day.',
    color: '#f56565',
    bg: 'rgba(245,101,101,0.08)',
    border: 'rgba(245,101,101,0.15)',
  },
  {
    icon: '🔒',
    title: 'Secure & Private',
    desc: 'Your medicine data is yours alone. Protected with industry-standard JWT authentication. Never shared or sold.',
    color: '#a78bfa',
    bg: 'rgba(167,139,250,0.08)',
    border: 'rgba(167,139,250,0.15)',
  },
  {
    icon: '📱',
    title: 'Works Everywhere',
    desc: 'Fully responsive — works perfectly on your phone, tablet, or desktop. No app download needed, just open your browser.',
    color: '#2dd98f',
    bg: 'rgba(45,217,143,0.08)',
    border: 'rgba(45,217,143,0.15)',
  },
];

const steps = [
  { num: '01', title: 'Create your free account', desc: 'Sign up in 30 seconds with your name and email. No credit card, no hidden charges, no spam.' },
  { num: '02', title: 'Add your medicines', desc: 'Scan the label with your camera or type it in manually. AI reads and fills all the details for you automatically.' },
  { num: '03', title: 'Get alerts before expiry', desc: 'Receive daily email reminders. Ask AI questions about your medicines anytime, in any language.' },
  { num: '04', title: 'Never worry again', desc: 'MedTrack watches your medicine cabinet 24/7 so you and your family always stay safe.' },
];

export default function Landing() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', fn);
    return () => window.removeEventListener('scroll', fn);
  }, []);

  const scrollTo = (id) => {
    setMobileMenuOpen(false);
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const navLinkStyle = {
    fontSize: '14px', color: '#7d8faa', background: 'none',
    border: 'none', cursor: 'pointer', padding: '4px 0',
    transition: 'color 0.2s ease', fontFamily: 'DM Sans, sans-serif',
  };

  return (
    <div style={{ background: '#070b12', color: '#eef2ff', fontFamily: 'DM Sans, sans-serif', overflowX: 'hidden' }}>

      {/* Background orbs — fixed */}
      <div style={{ position: 'fixed', top: '-200px', right: '-100px', width: '600px', height: '600px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(79,142,247,0.4), transparent 70%)', filter: 'blur(80px)', pointerEvents: 'none', zIndex: 0, opacity: 0.3 }} />
      <div style={{ position: 'fixed', bottom: '-100px', left: '-100px', width: '500px', height: '500px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(45,217,143,0.3), transparent 70%)', filter: 'blur(80px)', pointerEvents: 'none', zIndex: 0, opacity: 0.3 }} />

      {/* ═══════════════════════════════════ */}
      {/* FIXED STICKY NAVBAR                */}
      {/* ═══════════════════════════════════ */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 200,
        height: '64px',
        display: 'flex', alignItems: 'center',
        padding: '0 5%',
        justifyContent: 'space-between',
        background: scrolled ? 'rgba(7,11,18,0.95)' : 'rgba(7,11,18,0.6)',
        backdropFilter: 'blur(24px)',
        borderBottom: scrolled ? '1px solid rgba(255,255,255,0.07)' : '1px solid transparent',
        transition: 'all 0.3s ease',
        boxShadow: scrolled ? '0 4px 30px rgba(0,0,0,0.3)' : 'none',
      }}>

        {/* Logo */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
          <img src="/icon.png" alt="MedTrack" style={{ width: '40px', height: '40px', objectFit: 'contain' }} />
          <span style={{ fontFamily: 'Syne, sans-serif', fontWeight: '700', fontSize: '18px', letterSpacing: '-0.4px' }}>
            <span style={{ color: '#4f8ef7' }}>Med</span><span style={{ color: '#2dd98f' }}>Track</span>
          </span>
        </Link>

        {/* Desktop nav links */}
        <div style={{ display: 'flex', gap: '32px', alignItems: 'center' }}
          className="hide-mobile">
          {[
            { label: 'Home',         id: 'home' },
            { label: 'Features',     id: 'features' },
            { label: 'How it works', id: 'how-it-works' },
            { label: 'Contact',      id: 'contact' },
          ].map(link => (
            <button key={link.id} onClick={() => scrollTo(link.id)} style={navLinkStyle}
              onMouseEnter={e => e.currentTarget.style.color = '#eef2ff'}
              onMouseLeave={e => e.currentTarget.style.color = '#7d8faa'}
            >{link.label}</button>
          ))}
        </div>

        {/* Auth buttons */}
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <Link to="/login">
            <button style={{
              padding: '8px 18px', borderRadius: '8px', fontSize: '14px',
              color: '#7d8faa', background: 'transparent',
              border: '1px solid rgba(255,255,255,0.1)',
              cursor: 'pointer', transition: 'all .2s',
              fontFamily: 'DM Sans, sans-serif',
            }}
              onMouseEnter={e => { e.currentTarget.style.color = '#eef2ff'; e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; }}
              onMouseLeave={e => { e.currentTarget.style.color = '#7d8faa'; e.currentTarget.style.background = 'transparent'; }}
            >Log in</button>
          </Link>
          <Link to="/register">
            <button style={{
              padding: '9px 22px', borderRadius: '9px', fontSize: '14px',
              fontFamily: 'Syne, sans-serif', fontWeight: '600', color: '#fff',
              background: 'linear-gradient(135deg,#4f8ef7,#3b7de8)',
              boxShadow: '0 4px 20px rgba(79,142,247,0.35)',
              border: 'none', cursor: 'pointer', transition: 'all .2s',
            }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 8px 28px rgba(79,142,247,0.5)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 20px rgba(79,142,247,0.35)'; }}
            >Get started free →</button>
          </Link>

          {/* Mobile menu toggle */}
          <button
            className="hide-desktop"
            onClick={() => setMobileMenuOpen(p => !p)}
            style={{
              width: '36px', height: '36px', borderRadius: '8px',
              background: 'rgba(255,255,255,0.06)',
              border: '1px solid rgba(255,255,255,0.1)',
              color: '#eef2ff', fontSize: '16px', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
          >{mobileMenuOpen ? '✕' : '☰'}</button>
        </div>
      </nav>

      {/* Mobile menu dropdown */}
      {mobileMenuOpen && (
        <div className="hide-desktop" style={{
          position: 'fixed', top: '64px', left: 0, right: 0,
          background: 'rgba(7,11,18,0.97)', backdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(255,255,255,0.07)',
          zIndex: 199, padding: '16px 5%',
          display: 'flex', flexDirection: 'column', gap: '4px',
        }}>
          {[
            { label: 'Home',         id: 'home' },
            { label: 'Features',     id: 'features' },
            { label: 'How it works', id: 'how-it-works' },
            { label: 'Contact',      id: 'contact' },
          ].map(link => (
            <button key={link.id} onClick={() => scrollTo(link.id)} style={{
              ...navLinkStyle, padding: '12px 0', fontSize: '15px',
              borderBottom: '1px solid rgba(255,255,255,0.05)',
              textAlign: 'left', width: '100%',
            }}>
              {link.label}
            </button>
          ))}
        </div>
      )}

      {/* ═══════════════════════════════════ */}
      {/* HERO SECTION                        */}
      {/* ═══════════════════════════════════ */}
      <section id="home" style={{
        position: 'relative', zIndex: 1,
        minHeight: '100vh',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        textAlign: 'center',
        padding: 'clamp(100px, 15vw, 140px) 5% clamp(60px, 10vw, 100px)',
        animation: 'fadeUp 0.5s ease both',
      }}>

        {/* Badge */}
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: '8px',
          padding: '6px 16px', borderRadius: '20px',
          background: 'rgba(45,217,143,0.1)', border: '1px solid rgba(45,217,143,0.25)',
          fontSize: '13px', color: '#2dd98f', marginBottom: '28px',
        }}>
          <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#2dd98f', display: 'inline-block', animation: 'pulse 2s ease infinite' }} />
          AI-Powered · Free to use · No credit card needed
        </div>

        {/* Headline — clean and professional */}
        <h1 style={{
          fontFamily: 'Syne, sans-serif',
          fontSize: 'clamp(36px, 6.5vw, 68px)',
          fontWeight: '800',
          letterSpacing: '-2px',
          lineHeight: 1.1,
          maxWidth: '820px',
          marginBottom: '20px',
          color: '#eef2ff',
        }}>
          Your family's medicine cabinet,{' '}
          <span style={{
            background: 'linear-gradient(135deg, #4f8ef7, #2dd98f)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}>
            always safe.
          </span>
        </h1>

        {/* Subheading */}
        <p style={{
          fontSize: 'clamp(15px, 2vw, 18px)',
          color: '#7d8faa',
          maxWidth: '520px',
          lineHeight: '1.7',
          marginBottom: '36px',
        }}>
          Scan medicine labels with your camera, track expiry dates, get daily email alerts, and ask AI anything — all in one free app.
        </p>

        {/* CTA buttons */}
        <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap', justifyContent: 'center', marginBottom: '60px' }}>
          <Link to="/register">
            <button style={{
              padding: '14px 32px', borderRadius: '12px', fontSize: '15px',
              fontFamily: 'Syne, sans-serif', fontWeight: '600', color: '#fff',
              background: 'linear-gradient(135deg,#4f8ef7,#3b7de8)',
              boxShadow: '0 8px 30px rgba(79,142,247,0.4)',
              border: 'none', cursor: 'pointer', transition: 'all .2s',
            }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 14px 40px rgba(79,142,247,0.5)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 8px 30px rgba(79,142,247,0.4)'; }}
            >✚ Create free account</button>
          </Link>
          <Link to="/login">
            <button style={{
              padding: '14px 32px', borderRadius: '12px', fontSize: '15px',
              fontWeight: '500', color: '#eef2ff',
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.13)',
              cursor: 'pointer', transition: 'all .2s',
            }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; }}
            >Sign in →</button>
          </Link>
        </div>

        {/* App preview mockup */}
        <div style={{
          width: '100%', maxWidth: '760px',
          background: '#0d1220', borderRadius: '20px',
          border: '1px solid rgba(255,255,255,0.1)',
          overflow: 'hidden',
          boxShadow: '0 40px 100px rgba(0,0,0,0.6)',
        }}>
          {/* Browser bar */}
          <div style={{ background: '#111827', padding: '12px 18px', display: 'flex', alignItems: 'center', gap: '8px', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
            <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#f56565' }} />
            <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#f59e0b' }} />
            <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#2dd98f' }} />
            <span style={{ fontSize: '12px', color: '#3d4f66', marginLeft: '8px' }}>My Medicine Cabinet · MedTrack</span>
          </div>
          {/* Mock content */}
          <div style={{ padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div>
                <div style={{ fontFamily: 'Syne, sans-serif', fontSize: '18px', fontWeight: '700', color: '#eef2ff' }}>My Medicine Cabinet</div>
                <div style={{ fontSize: '13px', color: '#7d8faa', marginTop: '2px' }}>6 medicines tracked</div>
              </div>
              <button style={{ padding: '8px 16px', borderRadius: '8px', fontSize: '13px', color: '#fff', background: 'linear-gradient(135deg,#4f8ef7,#3b7de8)', fontFamily: 'Syne, sans-serif', fontWeight: '600', border: 'none' }}>+ Add</button>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '10px', marginBottom: '16px' }}>
              {[{ val: '1', lbl: 'Expired', color: '#f56565' }, { val: '2', lbl: 'Expiring Soon', color: '#f59e0b' }, { val: '3', lbl: 'Good', color: '#2dd98f' }].map(s => (
                <div key={s.lbl} style={{ borderRadius: '12px', padding: '14px', textAlign: 'center', background: `${s.color}18`, border: `1px solid ${s.color}33` }}>
                  <div style={{ fontFamily: 'Syne, sans-serif', fontSize: '26px', fontWeight: '700', color: s.color }}>{s.val}</div>
                  <div style={{ fontSize: '12px', color: '#7d8faa', marginTop: '5px' }}>{s.lbl}</div>
                </div>
              ))}
            </div>
            {[
              { name: 'Amoxicillin 500mg', info: '📦 Qty: 12 · 📅 15 Jan 2025', badge: 'Expired', color: '#f56565' },
              { name: 'Paracetamol 650mg', info: '📦 Qty: 20 · 📅 18 May 2026', badge: '18d left', color: '#f59e0b' },
              { name: 'Vitamin D3 Drops', info: '📦 Qty: 1 · 📅 10 Dec 2026', badge: '224d left', color: '#2dd98f' },
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

      {/* ═══════════════════════════════════ */}
      {/* FEATURES SECTION                   */}
      {/* ═══════════════════════════════════ */}
      <section id="features" style={{ position: 'relative', zIndex: 1, padding: 'clamp(60px,10vw,100px) 5%', maxWidth: '1100px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 'clamp(40px,6vw,64px)' }}>
          <p style={{ fontSize: '12px', fontWeight: '500', textTransform: 'uppercase', letterSpacing: '1.5px', color: '#4f8ef7', marginBottom: '12px' }}>Features</p>
          <h2 style={{ fontFamily: 'Syne, sans-serif', fontSize: 'clamp(26px,4vw,40px)', fontWeight: '700', letterSpacing: '-1px', lineHeight: 1.15, color: '#eef2ff' }}>
            Everything your medicine cabinet needs
          </h2>
          <p style={{ color: '#7d8faa', fontSize: '16px', marginTop: '12px', maxWidth: '480px', margin: '12px auto 0' }}>
            Built for Indian families, designed to keep everyone safe.
          </p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
          {features.map(f => (
            <div key={f.title} style={{
              background: '#0d1220', borderRadius: '18px', padding: '28px 24px',
              border: `1px solid ${f.border}`,
              transition: 'all .25s ease', cursor: 'default',
            }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.background = '#111827'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.background = '#0d1220'; }}
            >
              <div style={{
                width: '48px', height: '48px', borderRadius: '14px',
                background: f.bg, border: `1px solid ${f.border}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '22px', color: f.color, marginBottom: '18px',
              }}>{f.icon}</div>
              <div style={{ fontFamily: 'Syne, sans-serif', fontSize: '17px', fontWeight: '600', marginBottom: '8px', color: '#eef2ff' }}>{f.title}</div>
              <div style={{ fontSize: '14px', color: '#7d8faa', lineHeight: '1.65' }}>{f.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ═══════════════════════════════════ */}
      {/* HOW IT WORKS SECTION               */}
      {/* ═══════════════════════════════════ */}
      <section id="how-it-works" style={{ position: 'relative', zIndex: 1, padding: 'clamp(60px,10vw,100px) 5%', background: 'rgba(255,255,255,0.02)' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 'clamp(40px,6vw,64px)' }}>
            <p style={{ fontSize: '12px', fontWeight: '500', textTransform: 'uppercase', letterSpacing: '1.5px', color: '#2dd98f', marginBottom: '12px' }}>How it works</p>
            <h2 style={{ fontFamily: 'Syne, sans-serif', fontSize: 'clamp(26px,4vw,40px)', fontWeight: '700', letterSpacing: '-1px', lineHeight: 1.15, color: '#eef2ff' }}>
              Up and running in minutes
            </h2>
            <p style={{ color: '#7d8faa', fontSize: '16px', marginTop: '12px' }}>
              No complicated setup. Just sign up and start tracking.
            </p>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {steps.map((step, i) => (
              <div key={step.num} style={{
                display: 'flex', gap: '20px', alignItems: 'flex-start',
                background: '#0d1220', borderRadius: '16px', padding: '24px',
                border: '1px solid rgba(255,255,255,0.07)',
                transition: 'border-color 0.2s ease',
              }}
                onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(79,142,247,0.25)'}
                onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)'}
              >
                <div style={{
                  width: '48px', height: '48px', borderRadius: '12px', flexShrink: 0,
                  background: `rgba(79,142,247,${0.08 + i * 0.04})`,
                  border: '1px solid rgba(79,142,247,0.25)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontFamily: 'Syne, sans-serif', fontWeight: '700', fontSize: '15px', color: '#4f8ef7',
                }}>{step.num}</div>
                <div>
                  <h3 style={{ fontFamily: 'Syne, sans-serif', fontSize: '17px', fontWeight: '600', color: '#eef2ff', marginBottom: '6px' }}>{step.title}</h3>
                  <p style={{ fontSize: '14px', color: '#7d8faa', lineHeight: '1.65', margin: 0 }}>{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════ */}
      {/* CTA SECTION                         */}
      {/* ═══════════════════════════════════ */}
      <section style={{ position: 'relative', zIndex: 1, padding: 'clamp(60px,10vw,100px) 5%' }}>
        <div style={{
          maxWidth: '700px', margin: '0 auto', textAlign: 'center',
          background: 'linear-gradient(135deg, rgba(79,142,247,0.08), rgba(45,217,143,0.06))',
          borderRadius: '28px', padding: 'clamp(40px,6vw,72px) clamp(24px,5vw,64px)',
          border: '1px solid rgba(79,142,247,0.15)',
        }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>💊</div>
          <h2 style={{ fontFamily: 'Syne, sans-serif', fontSize: 'clamp(24px,4vw,36px)', fontWeight: '700', letterSpacing: '-1px', marginBottom: '12px', color: '#eef2ff' }}>
            Keep your family safe from expired medicines
          </h2>
          <p style={{ fontSize: '16px', color: '#7d8faa', marginBottom: '32px', lineHeight: '1.7' }}>
            Free forever. Works on any device. Takes 30 seconds to set up.
          </p>
          <div style={{ display: 'flex', gap: '14px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/register">
              <button style={{
                padding: '15px 36px', borderRadius: '12px', fontSize: '15px',
                fontFamily: 'Syne, sans-serif', fontWeight: '600', color: '#fff',
                background: 'linear-gradient(135deg,#4f8ef7,#3b7de8)',
                boxShadow: '0 8px 30px rgba(79,142,247,0.4)',
                border: 'none', cursor: 'pointer', transition: 'all .2s',
              }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 14px 40px rgba(79,142,247,0.5)'; }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 8px 30px rgba(79,142,247,0.4)'; }}
              >Get started — it's free →</button>
            </Link>
            <Link to="/login">
              <button style={{
                padding: '15px 28px', borderRadius: '12px', fontSize: '15px',
                fontWeight: '500', color: '#eef2ff',
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.13)',
                cursor: 'pointer', transition: 'all .2s',
              }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
                onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
              >Already have an account</button>
            </Link>
          </div>
          <p style={{ marginTop: '20px', fontSize: '13px', color: '#3d4f66' }}>
            Free forever · No credit card · Takes 30 seconds
          </p>
        </div>
      </section>

      {/* ═══════════════════════════════════ */}
      {/* CONTACT SECTION                     */}
      {/* ═══════════════════════════════════ */}
      <section id="contact" style={{ position: 'relative', zIndex: 1, padding: 'clamp(60px,10vw,80px) 5%', background: 'rgba(255,255,255,0.015)' }}>
        <div style={{ maxWidth: '600px', margin: '0 auto', textAlign: 'center' }}>
          <p style={{ fontSize: '12px', fontWeight: '500', textTransform: 'uppercase', letterSpacing: '1.5px', color: '#4f8ef7', marginBottom: '12px' }}>Contact</p>
          <h2 style={{ fontFamily: 'Syne, sans-serif', fontSize: 'clamp(24px,4vw,36px)', fontWeight: '700', letterSpacing: '-1px', marginBottom: '12px', color: '#eef2ff' }}>
            We're here to help
          </h2>
          <p style={{ color: '#7d8faa', fontSize: '16px', lineHeight: '1.7', marginBottom: '32px' }}>
            Have a question, suggestion, or need support? Reach out and we'll get back to you within 24 hours.
          </p>
          <a href="mailto:meditrackerexpire@gmail.com" style={{
            display: 'inline-flex', alignItems: 'center', gap: '10px',
            padding: '14px 28px', borderRadius: '12px',
            background: 'rgba(79,142,247,0.1)', border: '1px solid rgba(79,142,247,0.25)',
            color: '#4f8ef7', fontSize: '15px', fontWeight: '500',
            textDecoration: 'none', transition: 'all 0.2s ease',
          }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(79,142,247,0.18)'}
            onMouseLeave={e => e.currentTarget.style.background = 'rgba(79,142,247,0.1)'}
          >
            ✉ meditrackerexpire@gmail.com
          </a>
        </div>
      </section>

      {/* ═══════════════════════════════════ */}
      {/* FOOTER                              */}
      {/* ═══════════════════════════════════ */}
      <footer style={{ position: 'relative', zIndex: 1, borderTop: '1px solid rgba(255,255,255,0.07)' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', padding: 'clamp(40px,6vw,60px) 5% 32px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '40px' }}>
          {/* Brand */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
              <img src="/icon.png" alt="MedTrack" style={{ width: '36px', height: '36px', objectFit: 'contain' }} />
              <span style={{ fontFamily: 'Syne, sans-serif', fontWeight: '700', fontSize: '17px' }}>
                <span style={{ color: '#4f8ef7' }}>Med</span><span style={{ color: '#2dd98f' }}>Track</span>
              </span>
            </div>
            <p style={{ fontSize: '14px', color: '#7d8faa', lineHeight: '1.7', maxWidth: '240px' }}>
              Never use an expired medicine again. Your smart, free medicine cabinet.
            </p>
          </div>
          {/* Product links */}
          <div>
            <h4 style={{ fontFamily: 'Syne, sans-serif', fontSize: '13px', fontWeight: '600', color: '#eef2ff', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '16px' }}>Product</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {[{ label: 'Dashboard', to: '/' }, { label: 'Scan Label', to: '/scan' }, { label: 'Add Medicine', to: '/add' }, { label: 'AI Chat', to: '/chat' }].map(l => (
                <Link key={l.label} to={l.to} style={{ fontSize: '14px', color: '#7d8faa', transition: 'color .2s', textDecoration: 'none' }}
                  onMouseEnter={e => e.currentTarget.style.color = '#eef2ff'}
                  onMouseLeave={e => e.currentTarget.style.color = '#7d8faa'}
                >{l.label}</Link>
              ))}
            </div>
          </div>
          {/* Quick nav */}
          <div>
            <h4 style={{ fontFamily: 'Syne, sans-serif', fontSize: '13px', fontWeight: '600', color: '#eef2ff', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '16px' }}>Navigate</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {[
                { label: 'Home',         id: 'home' },
                { label: 'Features',     id: 'features' },
                { label: 'How it works', id: 'how-it-works' },
                { label: 'Contact',      id: 'contact' },
              ].map(l => (
                <button key={l.id} onClick={() => scrollTo(l.id)} style={{ fontSize: '14px', color: '#7d8faa', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left', padding: 0, fontFamily: 'DM Sans, sans-serif', transition: 'color .2s' }}
                  onMouseEnter={e => e.currentTarget.style.color = '#eef2ff'}
                  onMouseLeave={e => e.currentTarget.style.color = '#7d8faa'}
                >{l.label}</button>
              ))}
            </div>
          </div>
          {/* Contact */}
          <div>
            <h4 style={{ fontFamily: 'Syne, sans-serif', fontSize: '13px', fontWeight: '600', color: '#eef2ff', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '16px' }}>Contact</h4>
            <a href="mailto:meditrackerexpire@gmail.com" style={{ fontSize: '14px', color: '#7d8faa', textDecoration: 'none', transition: 'color .2s', display: 'block', marginBottom: '10px' }}
              onMouseEnter={e => e.currentTarget.style.color = '#eef2ff'}
              onMouseLeave={e => e.currentTarget.style.color = '#7d8faa'}
            >meditrackerexpire@gmail.com</a>
            <div style={{ background: 'rgba(79,142,247,0.08)', border: '1px solid rgba(79,142,247,0.18)', borderRadius: '10px', padding: '12px 14px', marginTop: '8px' }}>
              <div style={{ fontSize: '12px', color: '#4f8ef7', fontWeight: '500', marginBottom: '4px' }}>Support hours</div>
              <div style={{ fontSize: '13px', color: '#7d8faa' }}>Mon–Sat, 9am–6pm IST</div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '20px 5%', borderTop: '1px solid rgba(255,255,255,0.06)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
          <span style={{ fontSize: '13px', color: '#3d4f66' }}>© 2026 MedTrack. All rights reserved. Made with ♥ in India.</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#2dd98f', display: 'inline-block', animation: 'pulse 2s ease infinite' }} />
            <span style={{ fontSize: '13px', color: '#3d4f66' }}>All systems operational</span>
          </div>
        </div>
      </footer>

      <style>{`
        @keyframes fadeUp { from { opacity: 0; transform: translateY(24px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }
        @media (max-width: 768px) { .hide-mobile { display: none !important; } }
        @media (min-width: 769px) { .hide-desktop { display: none !important; } }
      `}</style>
    </div>
  );
}