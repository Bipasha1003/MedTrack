import { useState, useCallback, useRef } from 'react';
import { useDropzone } from 'react-dropzone';
import { useNavigate, Link } from 'react-router-dom';
import api from '../lib/api';
import toast from 'react-hot-toast';

export default function Scan() {
  const [scanning, setScanning] = useState(false);
  const [parsed,   setParsed]   = useState(null);
  const [preview,  setPreview]  = useState(null);
  const [saving,   setSaving]   = useState(false);
  const navigate   = useNavigate();

  // Refs for the hidden camera / gallery inputs
  const cameraInputRef  = useRef(null);
  const galleryInputRef = useRef(null);

  // ── Shared handler — works for dropzone, camera, and gallery ──
  const processFile = useCallback(async (file) => {
    if (!file) return;
    setPreview(URL.createObjectURL(file));
    setParsed(null);
    setScanning(true);
    try {
      const fd = new FormData();
      fd.append('image', file);
      const res = await api.post('/scan', fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setParsed(res.data.parsedData);
      toast.success('Label scanned!');
    } catch {
      toast.error('Could not scan. Fill manually.');
    } finally {
      setScanning(false);
    }
  }, []);

  // Dropzone (desktop drag & drop / file picker)
  const onDrop = useCallback((files) => processFile(files[0]), [processFile]);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': [] },
    maxFiles: 1,
    // Disable dropzone's own click on mobile so our buttons handle it
    noClick: false,
  });

  // Camera input change
  const handleCameraChange = (e) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
    e.target.value = ''; // reset so same file can be re-selected
  };

  const handleSave = async () => {
    if (!parsed?.name) { toast.error('Medicine name is required'); return; }
    setSaving(true);
    try {
      await api.post('/medicines', {
        name:       parsed.name,
        dosage:     parsed.dosage,
        category:   parsed.category || 'tablet',
        expiryDate: parsed.expiryDate,
        quantity:   1,
      });
      toast.success('Medicine saved!');
      navigate('/');
    } catch {
      toast.error('Could not save');
    } finally {
      setSaving(false);
    }
  };

  const inputStyle = {
    width: '100%', background: '#111827',
    border: '1px solid rgba(255,255,255,0.08)', borderRadius: '10px',
    padding: '12px 16px', fontSize: '15px', color: '#eef2ff',
  };

  return (
    <div className="page" style={{ padding: '24px 20px', maxWidth: '700px', margin: '0 auto' }}>

      {/* Header */}
      <div style={{ marginBottom: '28px' }}>
        <Link to="/" style={{
          display: 'inline-flex', alignItems: 'center', gap: '6px',
          color: '#7d8faa', fontSize: '14px', marginBottom: '16px',
        }}>← Back to cabinet</Link>
        <h1 style={{
          fontFamily: 'Syne, sans-serif', fontSize: '26px', fontWeight: '700',
          color: '#eef2ff', letterSpacing: '-0.6px', marginBottom: '4px',
        }}>Scan Medicine Label</h1>
        <p style={{ color: '#7d8faa', fontSize: '14px' }}>
          AI reads the label and extracts all details automatically
        </p>
      </div>

      {/* ── Mobile camera / upload buttons ── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>

        {/* Take Photo — opens rear camera on mobile */}
        <button
          onClick={() => cameraInputRef.current?.click()}
          style={{
            padding: '16px 12px', borderRadius: '14px',
            background: 'linear-gradient(135deg, rgba(79,142,247,0.12), rgba(79,142,247,0.06))',
            border: '1px solid rgba(79,142,247,0.25)',
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px',
            cursor: 'pointer', transition: 'all 0.2s ease',
          }}
          onMouseEnter={e => e.currentTarget.style.background = 'linear-gradient(135deg, rgba(79,142,247,0.2), rgba(79,142,247,0.1))'}
          onMouseLeave={e => e.currentTarget.style.background = 'linear-gradient(135deg, rgba(79,142,247,0.12), rgba(79,142,247,0.06))'}
        >
          <div style={{
            width: '48px', height: '48px', borderRadius: '50%',
            background: 'rgba(79,142,247,0.15)',
            border: '1px solid rgba(79,142,247,0.3)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '22px',
          }}>📷</div>
          <div>
            <div style={{ fontSize: '14px', fontWeight: '600', color: '#4f8ef7', fontFamily: 'Syne, sans-serif' }}>
              Take Photo
            </div>
            <div style={{ fontSize: '12px', color: '#7d8faa', marginTop: '2px' }}>
              Open camera
            </div>
          </div>
        </button>

        {/* Upload from gallery */}
        <button
          onClick={() => galleryInputRef.current?.click()}
          style={{
            padding: '16px 12px', borderRadius: '14px',
            background: 'linear-gradient(135deg, rgba(45,217,143,0.1), rgba(45,217,143,0.05))',
            border: '1px solid rgba(45,217,143,0.22)',
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px',
            cursor: 'pointer', transition: 'all 0.2s ease',
          }}
          onMouseEnter={e => e.currentTarget.style.background = 'linear-gradient(135deg, rgba(45,217,143,0.18), rgba(45,217,143,0.1))'}
          onMouseLeave={e => e.currentTarget.style.background = 'linear-gradient(135deg, rgba(45,217,143,0.1), rgba(45,217,143,0.05))'}
        >
          <div style={{
            width: '48px', height: '48px', borderRadius: '50%',
            background: 'rgba(45,217,143,0.12)',
            border: '1px solid rgba(45,217,143,0.28)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '22px',
          }}>🖼️</div>
          <div>
            <div style={{ fontSize: '14px', fontWeight: '600', color: '#2dd98f', fontFamily: 'Syne, sans-serif' }}>
              Upload Photo
            </div>
            <div style={{ fontSize: '12px', color: '#7d8faa', marginTop: '2px' }}>
              From gallery
            </div>
          </div>
        </button>
      </div>

      {/* Hidden inputs */}
      {/* Camera: capture="environment" = rear camera on mobile */}
      <input
        ref={cameraInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleCameraChange}
        style={{ display: 'none' }}
      />
      {/* Gallery: no capture attribute = file picker / gallery */}
      <input
        ref={galleryInputRef}
        type="file"
        accept="image/*"
        onChange={handleCameraChange}
        style={{ display: 'none' }}
      />

      {/* Drag & drop zone — still works on desktop */}
      <div {...getRootProps()} style={{
        border: `2px dashed ${isDragActive ? '#4f8ef7' : 'rgba(255,255,255,0.07)'}`,
        borderRadius: '16px', padding: '20px 24px', textAlign: 'center',
        cursor: 'pointer', marginBottom: '24px',
        background: isDragActive ? 'rgba(79,142,247,0.06)' : 'rgba(255,255,255,0.01)',
        transition: 'all 0.25s ease',
      }}>
        <input {...getInputProps()} />
        <p style={{ fontSize: '13px', color: isDragActive ? '#4f8ef7' : '#3d4f66' }}>
          {isDragActive ? '📂 Drop it here' : '🖥️ Or drag & drop here (desktop)'}
        </p>
      </div>

      {/* Two column layout when preview exists */}
      <div style={{ display: 'grid', gridTemplateColumns: preview ? '1fr 1fr' : '1fr', gap: '20px' }}>

        {/* Preview */}
        {preview && (
          <div>
            <p style={{
              fontSize: '12px', fontWeight: '500', color: '#7d8faa',
              textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '10px',
            }}>Uploaded Image</p>
            <div style={{
              borderRadius: '14px', overflow: 'hidden',
              border: '1px solid rgba(255,255,255,0.08)', background: '#0d1220',
            }}>
              <img
                src={preview} alt="Medicine"
                style={{ width: '100%', display: 'block', maxHeight: '280px', objectFit: 'contain', padding: '12px' }}
              />
            </div>
          </div>
        )}

        {/* Scanning spinner */}
        {scanning && (
          <div style={{
            background: '#0d1220', borderRadius: '14px', padding: '32px',
            border: '1px solid rgba(79,142,247,0.2)',
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
            gap: '16px', minHeight: '200px',
          }}>
            <div style={{
              width: '36px', height: '36px',
              border: '3px solid rgba(79,142,247,0.2)',
              borderTop: '3px solid #4f8ef7',
              borderRadius: '50%', animation: 'spin 0.9s linear infinite',
            }} />
            <p style={{ color: '#4f8ef7', fontSize: '14px', textAlign: 'center' }}>
              AI is reading the label...
            </p>
          </div>
        )}

        {/* Parsed result form */}
        {parsed && !scanning && (
          <div style={{
            background: '#0d1220', borderRadius: '14px', padding: '20px',
            border: '1px solid rgba(45,217,143,0.2)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
              <span style={{ fontSize: '16px' }}>✅</span>
              <p style={{ fontFamily: 'Syne, sans-serif', fontSize: '15px', fontWeight: '600', color: '#2dd98f' }}>
                Review details
              </p>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {[
                { label: 'Name',        key: 'name',       type: 'text', placeholder: 'Medicine name' },
                { label: 'Dosage',      key: 'dosage',     type: 'text', placeholder: '500mg' },
                { label: 'Category',    key: 'category',   type: 'text', placeholder: 'tablet / syrup' },
                { label: 'Expiry Date', key: 'expiryDate', type: 'date', placeholder: '' },
              ].map(f => (
                <div key={f.key}>
                  <label style={{
                    display: 'block', fontSize: '11px', fontWeight: '500',
                    color: '#7d8faa', textTransform: 'uppercase',
                    letterSpacing: '0.6px', marginBottom: '5px',
                  }}>{f.label}</label>
                  <input
                    type={f.type}
                    value={parsed[f.key] || ''}
                    placeholder={f.placeholder}
                    onChange={e => setParsed(prev => ({ ...prev, [f.key]: e.target.value }))}
                    style={{ ...inputStyle, padding: '10px 14px', fontSize: '14px', colorScheme: 'dark' }}
                    onFocus={e => e.target.style.borderColor = 'rgba(45,217,143,0.4)'}
                    onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.08)'}
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Save / Rescan buttons */}
      {parsed && !scanning && (
        <div style={{ marginTop: '20px', display: 'flex', gap: '12px' }}>
          <button
            onClick={() => { setParsed(null); setPreview(null); }}
            style={{
              flex: 1, padding: '13px', borderRadius: '10px', fontSize: '15px',
              color: '#7d8faa', background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.08)', fontWeight: '500',
            }}
          >Rescan</button>
          <button
            onClick={handleSave}
            disabled={saving}
            style={{
              flex: 2, padding: '13px', borderRadius: '10px', fontSize: '15px',
              fontFamily: 'Syne, sans-serif', fontWeight: '600', color: 'white',
              background: saving ? 'rgba(45,217,143,0.3)' : 'linear-gradient(135deg, #2dd98f, #1bb87a)',
              border: 'none', cursor: saving ? 'not-allowed' : 'pointer',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={e => { if (!saving) e.currentTarget.style.transform = 'translateY(-1px)'; }}
            onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
          >
            {saving ? 'Saving...' : '✓ Save Medicine'}
          </button>
        </div>
      )}

      {/* Tips */}
      <div style={{
        marginTop: '32px', background: '#0d1220', borderRadius: '14px',
        padding: '20px', border: '1px solid rgba(255,255,255,0.07)',
      }}>
        <p style={{
          fontSize: '12px', fontWeight: '500', color: '#7d8faa',
          textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '12px',
        }}>Tips for best results</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '10px' }}>
          {[
            { icon: '☀️', text: 'Good lighting' },
            { icon: '🔍', text: 'Expiry date visible' },
            { icon: '📱', text: 'Hold camera steady' },
            { icon: '📐', text: 'Label facing forward' },
          ].map(tip => (
            <div key={tip.text} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ fontSize: '16px' }}>{tip.icon}</span>
              <span style={{ fontSize: '13px', color: '#7d8faa' }}>{tip.text}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}