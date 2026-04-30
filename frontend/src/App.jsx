import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import Landing     from './pages/Landing';
import Login       from './pages/Login';
import Register    from './pages/Register';
import Dashboard   from './pages/Dashboard';
import AddMedicine from './pages/AddMedicine';
import Scan        from './pages/Scan';
import Chat        from './pages/Chat';
import Profile     from './pages/Profile';
import Navbar      from './components/Navbar';

// ─────────────────────────────────────────────
// Mini contact footer — shown on every app page
// ─────────────────────────────────────────────
function AppFooter() {
  return (
    <footer style={{
      borderTop: '1px solid rgba(255,255,255,0.06)',
      background: 'rgba(7,11,18,0.95)',
      backdropFilter: 'blur(20px)',
      padding: '14px 5%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      flexWrap: 'wrap',
      gap: '10px',
      zIndex: 50,
    }}>
      {/* Left — branding */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <img src="/icon.png" alt="MedTrack" style={{ width: '22px', height: '22px', objectFit: 'contain', opacity: 0.8 }} />
        <span style={{ fontFamily: 'Syne, sans-serif', fontWeight: '700', fontSize: '13px' }}>
          <span style={{ color: '#4f8ef7' }}>Med</span>
          <span style={{ color: '#2dd98f' }}>Track</span>
        </span>
        <span style={{ fontSize: '12px', color: '#3d4f66', marginLeft: '4px' }}>
          © 2026
        </span>
      </div>

      {/* Center — contact details */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '20px', flexWrap: 'wrap', justifyContent: 'center' }}>
        {/* Email */}
        <a
          href="mailto:meditrackerexpire@gmail.com"
          style={{
            display: 'flex', alignItems: 'center', gap: '6px',
            fontSize: '12px', color: '#7d8faa', textDecoration: 'none',
            transition: 'color .2s',
          }}
          onMouseEnter={e => e.currentTarget.style.color = '#4f8ef7'}
          onMouseLeave={e => e.currentTarget.style.color = '#7d8faa'}
        >
          <span style={{ fontSize: '13px' }}>✉</span>
          meditrackerexpire@gmail.com
        </a>

        {/* Divider dot */}
        <span style={{ width: '3px', height: '3px', borderRadius: '50%', background: '#3d4f66', display: 'inline-block', flexShrink: 0 }} />

        {/* Phone */}
        <a
          href="tel:+918001234567"
          style={{
            display: 'flex', alignItems: 'center', gap: '6px',
            fontSize: '12px', color: '#7d8faa', textDecoration: 'none',
            transition: 'color .2s',
          }}
          onMouseEnter={e => e.currentTarget.style.color = '#2dd98f'}
          onMouseLeave={e => e.currentTarget.style.color = '#7d8faa'}
        >
          <span style={{ fontSize: '13px' }}>📞</span>
          +91 800 123 4567
        </a>

        {/* Divider dot */}
        <span style={{ width: '3px', height: '3px', borderRadius: '50%', background: '#3d4f66', display: 'inline-block', flexShrink: 0 }} className="hide-mobile" />

        {/* Hours */}
        <span style={{ fontSize: '12px', color: '#3d4f66', display: 'flex', alignItems: 'center', gap: '5px' }} className="hide-mobile">
          <span>🕐</span> Mon–Sat, 9am–6pm IST
        </span>
      </div>

      {/* Right — status */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
        <span style={{
          width: '7px', height: '7px', borderRadius: '50%',
          background: '#2dd98f', display: 'inline-block',
          animation: 'pulse 2s ease infinite',
        }} />
        <span style={{ fontSize: '12px', color: '#3d4f66' }}>Support online</span>
      </div>

      <style>{`
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }
        @media (max-width: 768px) { .hide-mobile { display: none !important; } }
      `}</style>
    </footer>
  );
}

// ─────────────────────────────────────────────
// Protected route wrapper — Navbar + content + AppFooter
// ─────────────────────────────────────────────
function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) return (
    <div style={{
      minHeight: '100vh', display: 'flex',
      alignItems: 'center', justifyContent: 'center',
      background: '#070b12',
    }}>
      <div style={{
        width: '40px', height: '40px',
        border: '3px solid rgba(79,142,247,0.2)',
        borderTop: '3px solid #4f8ef7',
        borderRadius: '50%',
        animation: 'spin 0.9s linear infinite',
      }} />
    </div>
  );

  if (!user) return <Navigate to="/" replace />;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', background: '#070b12' }}>
      <Navbar />
      {/* Page content grows to fill space */}
      <div style={{ flex: 1 }}>
        {children}
      </div>
      {/* Mini contact footer on every app page */}
      <AppFooter />
    </div>
  );
}

// ─────────────────────────────────────────────
// Public route — redirect to dashboard if logged in
// ─────────────────────────────────────────────
function PublicRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (user) return <Navigate to="/dashboard" replace />;
  return children;
}

// ─────────────────────────────────────────────
// Home route — Landing for guests, Dashboard for logged-in
// ─────────────────────────────────────────────
function HomeRoute() {
  const { user, loading } = useAuth();

  if (loading) return (
    <div style={{
      minHeight: '100vh', display: 'flex',
      alignItems: 'center', justifyContent: 'center',
      background: '#070b12',
    }}>
      <div style={{
        width: '40px', height: '40px',
        border: '3px solid rgba(79,142,247,0.2)',
        borderTop: '3px solid #4f8ef7',
        borderRadius: '50%',
        animation: 'spin 0.9s linear infinite',
      }} />
    </div>
  );

  if (user) return <Navigate to="/dashboard" replace />;
  return <Landing />;
}

// ─────────────────────────────────────────────
// App
// ─────────────────────────────────────────────
export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: {
              background: '#0d1220',
              color: '#eef2ff',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '10px',
              fontSize: '14px',
              fontFamily: 'DM Sans, sans-serif',
            },
            success: { iconTheme: { primary: '#2dd98f', secondary: '#0d1220' } },
            error:   { iconTheme: { primary: '#f56565', secondary: '#0d1220' } },
          }}
        />
        <Routes>
          {/* Guest → Landing, Logged in → Dashboard */}
          <Route path="/"          element={<HomeRoute />} />

          {/* Public pages */}
          <Route path="/login"     element={<PublicRoute><Login /></PublicRoute>} />
          <Route path="/register"  element={<PublicRoute><Register /></PublicRoute>} />

          {/* App pages — all get Navbar + mini footer automatically */}
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/add"       element={<ProtectedRoute><AddMedicine /></ProtectedRoute>} />
          <Route path="/scan"      element={<ProtectedRoute><Scan /></ProtectedRoute>} />
          <Route path="/chat"      element={<ProtectedRoute><Chat /></ProtectedRoute>} />
          <Route path="/profile"   element={<ProtectedRoute><Profile /></ProtectedRoute>} />

          {/* Fallback */}
          <Route path="*"          element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}