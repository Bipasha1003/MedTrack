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
import Navbar      from './components/Navbar';
import Profile from './pages/Profile';

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
    <>
      <Navbar />
      {children}
    </>
  );
}

function PublicRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (user) return <Navigate to="/dashboard" replace />;
  return children;
}

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
  // Logged in → Dashboard, Guest → Landing page
  if (user) return <Navigate to="/dashboard" replace />;
  return <Landing />;
}

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
          {/* '/' shows Landing for guests, redirects to /dashboard for logged-in users */}
          <Route path="/"          element={<HomeRoute />} />

          {/* Public routes — redirect to /dashboard if already logged in */}
          <Route path="/login"     element={<PublicRoute><Login /></PublicRoute>} />
          <Route path="/register"  element={<PublicRoute><Register /></PublicRoute>} />

          {/* Protected routes — redirect to '/' if not logged in */}
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