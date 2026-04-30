import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../lib/api';
import toast from 'react-hot-toast';

function getStatus(expiryDate) {
  const days = Math.ceil((new Date(expiryDate) - new Date()) / 86400000);
  if (days < 0)   return { label: 'Expired',        color: '#f56565', bg: 'rgba(245,101,101,0.1)',  border: 'rgba(245,101,101,0.2)',  days };
  if (days <= 7)  return { label: `${days}d left`,  color: '#f56565', bg: 'rgba(245,101,101,0.1)',  border: 'rgba(245,101,101,0.2)',  days };
  if (days <= 30) return { label: `${days}d left`,  color: '#f59e0b', bg: 'rgba(245,158,11,0.1)',   border: 'rgba(245,158,11,0.2)',   days };
  return               { label: `${days}d left`,  color: '#2dd98f', bg: 'rgba(45,217,143,0.1)',  border: 'rgba(45,217,143,0.2)',  days };
}

function MedicineCard({ medicine, onDelete }) {
  const status = getStatus(medicine.expiryDate);
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    if (!confirm(`Delete ${medicine.name}?`)) return;
    setDeleting(true);
    await onDelete(medicine.id);
    setDeleting(false);
  };

  return (
    <div style={{
      background: '#0d1220', borderRadius: '14px', padding: '20px',
      border: `1px solid rgba(255,255,255,0.07)`,
      borderLeft: `3px solid ${status.color}`,
      transition: 'all 0.2s ease',
      animation: 'fadeUp 0.3s ease both',
    }}
      onMouseEnter={e => e.currentTarget.style.background = '#111827'}
      onMouseLeave={e => e.currentTarget.style.background = '#0d1220'}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px' }}>
        {/* Left info */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px', flexWrap: 'wrap' }}>
            <h3 style={{ fontFamily: 'Syne, sans-serif', fontSize: '16px', fontWeight: '600', color: '#eef2ff', margin: 0 }}>
              {medicine.name}
            </h3>
            {medicine.dosage && (
              <span style={{
                fontSize: '12px', padding: '2px 10px', borderRadius: '20px',
                background: 'rgba(79,142,247,0.1)', color: '#4f8ef7',
                border: '1px solid rgba(79,142,247,0.2)',
              }}>{medicine.dosage}</span>
            )}
            {medicine.category && (
              <span style={{
                fontSize: '12px', padding: '2px 10px', borderRadius: '20px',
                background: 'rgba(255,255,255,0.05)', color: '#7d8faa',
                border: '1px solid rgba(255,255,255,0.08)',
                textTransform: 'capitalize',
              }}>{medicine.category}</span>
            )}
          </div>
          <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '13px', color: '#7d8faa' }}>
              📦 Qty: <strong style={{ color: '#eef2ff' }}>{medicine.quantity}</strong>
            </span>
            <span style={{ fontSize: '13px', color: '#7d8faa' }}>
              📅 {new Date(medicine.expiryDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
            </span>
          </div>
        </div>

        {/* Right status + delete */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '10px', flexShrink: 0 }}>
          <span style={{
            fontSize: '13px', fontWeight: '600', padding: '4px 12px',
            borderRadius: '20px', color: status.color,
            background: status.bg, border: `1px solid ${status.border}`,
            whiteSpace: 'nowrap',
          }}>{status.label}</span>
          <button onClick={handleDelete} disabled={deleting} style={{
            fontSize: '12px', padding: '4px 12px', borderRadius: '6px',
            color: '#f56565', background: 'transparent',
            border: '1px solid rgba(245,101,101,0.2)',
            opacity: deleting ? 0.5 : 1, cursor: deleting ? 'not-allowed' : 'pointer',
            transition: 'all 0.2s ease',
          }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(245,101,101,0.1)'}
            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
          >
            {deleting ? '...' : 'Delete'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading]     = useState(true);
  const [filter, setFilter]       = useState('all');

  useEffect(() => { fetchMedicines(); }, []);

  const fetchMedicines = async () => {
    try {
      const res = await api.get('/medicines');
      setMedicines(res.data);
    } catch { toast.error('Could not load medicines'); }
    finally { setLoading(false); }
  };

  const deleteMedicine = async (id) => {
    try {
      await api.delete(`/medicines/${id}`);
      setMedicines(prev => prev.filter(m => m.id !== id));
      toast.success('Deleted');
    } catch { toast.error('Could not delete'); }
  };

  const counts = {
    all:     medicines.length,
    expired: medicines.filter(m => Math.ceil((new Date(m.expiryDate) - new Date()) / 86400000) < 0).length,
    warning: medicines.filter(m => { const d = Math.ceil((new Date(m.expiryDate) - new Date()) / 86400000); return d >= 0 && d <= 30; }).length,
    good:    medicines.filter(m => Math.ceil((new Date(m.expiryDate) - new Date()) / 86400000) > 30).length,
  };

  const filtered = medicines.filter(m => {
    const d = Math.ceil((new Date(m.expiryDate) - new Date()) / 86400000);
    if (filter === 'expired') return d < 0;
    if (filter === 'warning') return d >= 0 && d <= 30;
    if (filter === 'good')    return d > 30;
    return true;
  });

  return (
    <div className="page" style={{ padding: '24px 20px', maxWidth: '900px', margin: '0 auto' }}>

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '28px', gap: '16px', flexWrap: 'wrap' }}>
        <div>
          <h1 style={{ fontFamily: 'Syne, sans-serif', fontSize: '26px', fontWeight: '700', color: '#eef2ff', letterSpacing: '-0.6px', marginBottom: '4px' }}>
            My Medicine Cabinet
          </h1>
          <p style={{ color: '#7d8faa', fontSize: '14px' }}>
            {medicines.length === 0 ? 'No medicines yet. Add your first one.' : `${medicines.length} medicine${medicines.length > 1 ? 's' : ''} tracked`}
          </p>
        </div>
        <div style={{ display: 'flex', gap: '10px', flexShrink: 0 }}>
          <Link to="/scan">
            <button style={{
              padding: '10px 20px', borderRadius: '10px', fontSize: '14px',
              fontWeight: '500', color: '#4f8ef7',
              background: 'rgba(79,142,247,0.1)', border: '1px solid rgba(79,142,247,0.25)',
              display: 'flex', alignItems: 'center', gap: '6px',
            }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(79,142,247,0.18)'}
              onMouseLeave={e => e.currentTarget.style.background = 'rgba(79,142,247,0.1)'}
            >◎ Scan</button>
          </Link>
          <Link to="/add">
            <button style={{
              padding: '10px 20px', borderRadius: '10px', fontSize: '14px',
              fontFamily: 'Syne, sans-serif', fontWeight: '600', color: 'white',
              background: 'linear-gradient(135deg, #4f8ef7, #3b7de8)',
              border: 'none', display: 'flex', alignItems: 'center', gap: '6px',
            }}
              onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-1px)'}
              onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
            >+ Add Medicine</button>
          </Link>
        </div>
      </div>

      {/* Stats row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '24px' }}>
        {[
          { label: 'Expired',       value: counts.expired, color: '#f56565', bg: 'rgba(245,101,101,0.08)', border: 'rgba(245,101,101,0.15)' },
          { label: 'Expiring Soon', value: counts.warning, color: '#f59e0b', bg: 'rgba(245,158,11,0.08)',  border: 'rgba(245,158,11,0.15)'  },
          { label: 'Good',          value: counts.good,    color: '#2dd98f', bg: 'rgba(45,217,143,0.08)', border: 'rgba(45,217,143,0.15)' },
        ].map(stat => (
          <div key={stat.label} style={{
            background: stat.bg, borderRadius: '14px', padding: '18px 20px',
            border: `1px solid ${stat.border}`, textAlign: 'center',
          }}>
            <div style={{ fontFamily: 'Syne, sans-serif', fontSize: '28px', fontWeight: '700', color: stat.color, lineHeight: 1 }}>{stat.value}</div>
            <div style={{ fontSize: '13px', color: '#7d8faa', marginTop: '6px' }}>{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Filter tabs */}
      <div style={{ display: 'flex', gap: '6px', marginBottom: '20px', flexWrap: 'wrap' }}>
        {[
          { key: 'all',     label: `All (${counts.all})` },
          { key: 'expired', label: `Expired (${counts.expired})` },
          { key: 'warning', label: `Warning (${counts.warning})` },
          { key: 'good',    label: `Good (${counts.good})` },
        ].map(tab => (
          <button key={tab.key} onClick={() => setFilter(tab.key)} style={{
            padding: '7px 18px', borderRadius: '20px', fontSize: '13.5px',
            fontWeight: filter === tab.key ? '500' : '400',
            color: filter === tab.key ? '#eef2ff' : '#7d8faa',
            background: filter === tab.key ? 'rgba(79,142,247,0.15)' : 'rgba(255,255,255,0.04)',
            border: filter === tab.key ? '1px solid rgba(79,142,247,0.3)' : '1px solid rgba(255,255,255,0.07)',
            transition: 'all 0.2s ease',
          }}>{tab.label}</button>
        ))}
      </div>

      {/* Medicine list */}
      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {[1, 2, 3].map(i => (
            <div key={i} className="skeleton" style={{ height: '90px', borderRadius: '14px' }} />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div style={{
          textAlign: 'center', padding: '64px 24px',
          background: '#0d1220', borderRadius: '20px',
          border: '1px solid rgba(255,255,255,0.07)',
        }}>
          <div style={{ fontSize: '48px', marginBottom: '16px', opacity: 0.4 }}>💊</div>
          <h3 style={{ fontFamily: 'Syne, sans-serif', fontSize: '18px', color: '#7d8faa', marginBottom: '8px' }}>
            {filter === 'all' ? 'No medicines yet' : `No ${filter} medicines`}
          </h3>
          <p style={{ color: '#3d4f66', fontSize: '14px', marginBottom: '24px' }}>
            {filter === 'all' ? 'Add your first medicine to get started' : 'Switch to All to see everything'}
          </p>
          {filter === 'all' && (
            <Link to="/add">
              <button style={{
                padding: '12px 28px', borderRadius: '10px',
                fontFamily: 'Syne, sans-serif', fontWeight: '600',
                color: 'white', fontSize: '15px',
                background: 'linear-gradient(135deg, #4f8ef7, #3b7de8)',
                border: 'none',
              }}>Add First Medicine</button>
            </Link>
          )}
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {filtered.map(med => (
            <MedicineCard key={med.id} medicine={med} onDelete={deleteMedicine} />
          ))}
        </div>
      )}

      {/* Quick action bar at bottom if medicines exist */}
      {medicines.length > 0 && (
        <div style={{
          marginTop: '32px', padding: '16px 20px',
          background: '#0d1220', borderRadius: '14px',
          border: '1px solid rgba(255,255,255,0.07)',
          display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap',
        }}>
          <span style={{ fontSize: '13px', color: '#7d8faa', flex: 1 }}>Need help with your medicines?</span>
          <Link to="/chat">
            <button style={{
              padding: '8px 18px', borderRadius: '8px', fontSize: '13px',
              color: '#eef2ff', fontWeight: '500',
              background: 'rgba(255,255,255,0.06)',
              border: '1px solid rgba(255,255,255,0.1)',
            }}>Ask AI Assistant →</button>
          </Link>
        </div>
      )}
    </div>
  );
}
