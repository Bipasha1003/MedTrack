import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../lib/api';
import toast from 'react-hot-toast';

export default function AddMedicine() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: '', dosage: '', category: 'tablet', quantity: 1, expiryDate: '',
  });

  const handleChange = (e) => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.expiryDate) { toast.error('Name and expiry date are required'); return; }
    setLoading(true);
    try {
      await api.post('/medicines', form);
      toast.success('Medicine added!');
      navigate('/');
    } catch { toast.error('Could not add medicine'); }
    finally { setLoading(false); }
  };

  const inputStyle = {
    width: '100%', background: '#111827',
    border: '1px solid rgba(255,255,255,0.08)', borderRadius: '10px',
    padding: '13px 16px', fontSize: '15px', color: '#eef2ff',
    transition: 'border-color 0.2s ease',
  };

  const labelStyle = {
    display: 'block', fontSize: '12px', fontWeight: '500', color: '#7d8faa',
    marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.8px',
  };

  const categories = ['tablet', 'capsule', 'syrup', 'cream', 'injection', 'drops', 'inhaler', 'other'];

  return (
    <div className="page" style={{ padding: '24px 20px', maxWidth: '600px', margin: '0 auto' }}>

      {/* Header */}
      <div style={{ marginBottom: '28px' }}>
        <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#7d8faa', fontSize: '14px', marginBottom: '16px' }}>
          ← Back to cabinet
        </Link>
        <h1 style={{ fontFamily: 'Syne, sans-serif', fontSize: '26px', fontWeight: '700', color: '#eef2ff', letterSpacing: '-0.6px', marginBottom: '4px' }}>
          Add Medicine
        </h1>
        <p style={{ color: '#7d8faa', fontSize: '14px' }}>Fill in the details or use scan to auto-fill</p>
      </div>

      {/* Scan shortcut */}
      <Link to="/scan">
        <div style={{
          background: 'rgba(79,142,247,0.08)', borderRadius: '12px', padding: '14px 18px',
          border: '1px solid rgba(79,142,247,0.2)', marginBottom: '24px',
          display: 'flex', alignItems: 'center', gap: '12px',
          cursor: 'pointer', transition: 'all 0.2s ease',
        }}
          onMouseEnter={e => e.currentTarget.style.background = 'rgba(79,142,247,0.14)'}
          onMouseLeave={e => e.currentTarget.style.background = 'rgba(79,142,247,0.08)'}
        >
          <span style={{ fontSize: '22px' }}>◎</span>
          <div>
            <div style={{ fontSize: '14px', fontWeight: '500', color: '#4f8ef7' }}>Scan medicine label</div>
            <div style={{ fontSize: '13px', color: '#7d8faa' }}>Take a photo and let AI fill the details automatically</div>
          </div>
          <span style={{ marginLeft: 'auto', color: '#4f8ef7', fontSize: '18px' }}>→</span>
        </div>
      </Link>

      {/* Form */}
      <div style={{
        background: '#0d1220', borderRadius: '20px', padding: '28px',
        border: '1px solid rgba(255,255,255,0.07)',
      }}>
        <form onSubmit={handleSubmit}>
          {/* Name */}
          <div style={{ marginBottom: '20px' }}>
            <label style={labelStyle}>Medicine Name *</label>
            <input name="name" value={form.name} onChange={handleChange}
              placeholder="e.g. Paracetamol, Amoxicillin" required style={inputStyle}
              onFocus={e => e.target.style.borderColor = 'rgba(79,142,247,0.5)'}
              onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.08)'}
            />
          </div>

          {/* Dosage + Category row */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
            <div>
              <label style={labelStyle}>Dosage</label>
              <input name="dosage" value={form.dosage} onChange={handleChange}
                placeholder="e.g. 500mg, 10ml" style={inputStyle}
                onFocus={e => e.target.style.borderColor = 'rgba(79,142,247,0.5)'}
                onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.08)'}
              />
            </div>
            <div>
              <label style={labelStyle}>Category</label>
              <select name="category" value={form.category} onChange={handleChange} style={{
                ...inputStyle,
                cursor: 'pointer',
                appearance: 'none',
                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%237d8faa' d='M6 8L1 3h10z'/%3E%3C/svg%3E")`,
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'right 14px center',
                paddingRight: '36px',
              }}>
                {categories.map(c => (
                  <option key={c} value={c} style={{ background: '#111827', textTransform: 'capitalize' }}>
                    {c.charAt(0).toUpperCase() + c.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Quantity + Expiry row */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '28px' }}>
            <div>
              <label style={labelStyle}>Quantity</label>
              <input name="quantity" type="number" min="1" value={form.quantity} onChange={handleChange} style={inputStyle}
                onFocus={e => e.target.style.borderColor = 'rgba(79,142,247,0.5)'}
                onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.08)'}
              />
            </div>
            <div>
              <label style={labelStyle}>Expiry Date *</label>
              <input name="expiryDate" type="date" value={form.expiryDate} onChange={handleChange} required style={{
                ...inputStyle,
                colorScheme: 'dark',
              }}
                onFocus={e => e.target.style.borderColor = 'rgba(79,142,247,0.5)'}
                onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.08)'}
              />
            </div>
          </div>

          {/* Buttons */}
          <div style={{ display: 'flex', gap: '12px' }}>
            <button type="button" onClick={() => navigate('/')} style={{
              flex: 1, padding: '13px', borderRadius: '10px', fontSize: '15px',
              color: '#7d8faa', background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.08)', fontWeight: '500',
            }}>Cancel</button>
            <button type="submit" disabled={loading} style={{
              flex: 2, padding: '13px', borderRadius: '10px', fontSize: '15px',
              fontFamily: 'Syne, sans-serif', fontWeight: '600', color: 'white',
              background: loading ? 'rgba(79,142,247,0.4)' : 'linear-gradient(135deg, #4f8ef7, #3b7de8)',
              border: 'none', cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'all 0.2s ease',
            }}
              onMouseEnter={e => { if (!loading) e.currentTarget.style.transform = 'translateY(-1px)'; }}
              onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
            >
              {loading ? 'Saving...' : '✓ Save Medicine'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
