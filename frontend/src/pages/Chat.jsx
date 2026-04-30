import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../lib/api';
import toast from 'react-hot-toast';

const QUICK = [
  'What medicines expire this month?',
  'Do I have any expired medicines?',
  'How to safely dispose expired tablets?',
  'What do I have for fever?',
];

const VOICE_LANGS = [
  { code: 'en-US', label: 'English' },
  { code: 'hi-IN', label: 'हिन्दी' },
  { code: 'bn-IN', label: 'বাংলা' },
  { code: 'te-IN', label: 'తెలుగు' },
  { code: 'ta-IN', label: 'தமிழ்' },
  { code: 'mr-IN', label: 'मराठी' },
  { code: 'gu-IN', label: 'ગુજરાતી' },
  { code: 'kn-IN', label: 'ಕನ್ನಡ' },
  { code: 'ml-IN', label: 'മലയാളം' },
  { code: 'pa-IN', label: 'ਪੰਜਾਬੀ' },
  { code: 'fr-FR', label: 'Français' },
  { code: 'de-DE', label: 'Deutsch' },
  { code: 'es-ES', label: 'Español' },
  { code: 'ar-SA', label: 'العربية' },
  { code: 'zh-CN', label: '中文' },
  { code: 'ja-JP', label: '日本語' },
  { code: 'ko-KR', label: '한국어' },
  { code: 'pt-BR', label: 'Português' },
  { code: 'ru-RU', label: 'Русский' },
];

const STORAGE_KEY = 'medtrack_chat_history';
const LANG_KEY    = 'medtrack_chat_lang';

const INITIAL_MSG = {
  role: 'ai',
  text: "Hello! I'm your MedTrack AI assistant. I know your medicine cabinet and speak your language. Ask me anything! 🌍",
  time: new Date().toISOString(),
  id: 'init',
};

export default function Chat() {
  // ── Load persisted messages from localStorage ──
  const [messages, setMessages] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        // Re-hydrate time strings back to Date-like (we store as ISO string)
        return parsed.map(m => ({ ...m, time: m.time }));
      }
    } catch {}
    return [INITIAL_MSG];
  });

  const [input,        setInput]        = useState('');
  const [loading,      setLoading]      = useState(false);
  const [listening,    setListening]    = useState(false);
  const [holdProgress, setHoldProgress] = useState(0);
  const [voiceLang,    setVoiceLang]    = useState(() => localStorage.getItem(LANG_KEY) || 'en-US');
  const [showLangMenu, setShowLangMenu] = useState(false);
  const [voiceSupport, setVoiceSupport] = useState(false);
  // ── FIX: per-message speaking state (store the id of currently speaking msg) ──
  const [speakingId,   setSpeakingId]   = useState(null);
  const [showInput,    setShowInput]    = useState(true);

  const bottomRef      = useRef(null);
  const inputRef       = useRef(null);
  const recognitionRef = useRef(null);
  const holdTimerRef   = useRef(null);
  const progressRef    = useRef(null);
  const holdStartRef   = useRef(false);

  // ── Persist messages to localStorage whenever they change ──
  useEffect(() => {
    try {
      // Keep last 50 messages to avoid storage overflow
      const toSave = messages.slice(-50);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
    } catch {}
  }, [messages]);

  // ── Persist language preference ──
  useEffect(() => {
    localStorage.setItem(LANG_KEY, voiceLang);
  }, [voiceLang]);

  useEffect(() => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SR) setVoiceSupport(true);
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  // ── FIX: speak with per-message id tracking ──
  const speakText = (text, msgId) => {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = voiceLang;
    u.rate = 0.95;
    u.onstart = () => setSpeakingId(msgId);
    u.onend   = () => setSpeakingId(null);
    u.onerror = () => setSpeakingId(null);
    window.speechSynthesis.speak(u);
  };

  const stopSpeaking = () => {
    window.speechSynthesis?.cancel();
    setSpeakingId(null);
  };

  const startRecognition = () => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) { toast.error('Voice not supported. Use Chrome.'); return; }
    const recognition = new SR();
    recognition.lang = voiceLang;
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.onresult = (event) => {
      const transcript = Array.from(event.results).map(r => r[0].transcript).join('');
      setInput(transcript);
    };
    recognition.onerror = (e) => {
      if (e.error === 'not-allowed') toast.error('Microphone permission denied.');
    };
    recognitionRef.current = recognition;
    recognition.start();
    setListening(true);
  };

  const stopRecognition = () => {
    recognitionRef.current?.stop();
    setListening(false);
  };

  const handleMicPointerDown = (e) => {
    e.preventDefault();
    holdStartRef.current = true;
    setShowInput(false);
    setHoldProgress(0);
    let prog = 0;
    progressRef.current = setInterval(() => {
      prog += 2;
      setHoldProgress(Math.min(prog, 100));
    }, 60);
    holdTimerRef.current = setTimeout(() => {
      if (holdStartRef.current) startRecognition();
    }, 300);
  };

  const handleMicPointerUp = (e) => {
    e.preventDefault();
    const wasHolding = holdStartRef.current;
    holdStartRef.current = false;
    clearTimeout(holdTimerRef.current);
    clearInterval(progressRef.current);
    setHoldProgress(0);
    setShowInput(true);
    if (wasHolding && listening) {
      stopRecognition();
      setTimeout(() => {
        const val = inputRef.current?.value || input;
        if (val && val.trim()) send(val.trim());
      }, 600);
    } else if (wasHolding) {
      if (listening) stopRecognition();
      else startRecognition();
    }
  };

  const send = async (text) => {
    const q = (text !== undefined ? text : input).trim();
    if (!q || loading) return;
    setInput('');
    stopSpeaking();

    const userMsg = { role: 'user', text: q, time: new Date().toISOString(), id: Date.now().toString() };
    setMessages(prev => [...prev, userMsg]);
    setLoading(true);

    try {
      // ── FIX: send last 10 messages as history for context ──
      const historyToSend = messages
        .filter(m => m.id !== 'init')
        .slice(-10)
        .map(m => ({ role: m.role, text: m.text }));

      const res = await api.post('/chat', {
        question: q,
        language: voiceLang,
        history:  historyToSend,
      });

      const answer = res.data.answer;
      const aiMsg  = { role: 'ai', text: answer, time: new Date().toISOString(), id: Date.now().toString() + '_ai' };
      setMessages(prev => [...prev, aiMsg]);

      // Auto speak if voice was used
      if (recognitionRef.current) speakText(answer, aiMsg.id);
    } catch {
      toast.error('Could not get response');
      setMessages(prev => [...prev, {
        role: 'ai', text: "Sorry, I couldn't connect.",
        time: new Date().toISOString(), id: Date.now().toString() + '_err',
      }]);
    } finally {
      setLoading(false);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  };

  // ── Clear chat history ──
  const clearChat = () => {
    if (!confirm('Clear all chat history?')) return;
    const fresh = [{ ...INITIAL_MSG, time: new Date().toISOString(), id: 'init_' + Date.now() }];
    setMessages(fresh);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(fresh));
    toast.success('Chat cleared');
  };

  const formatTime = (t) => {
    try {
      return new Date(t).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
    } catch { return ''; }
  };

  const currentLang = VOICE_LANGS.find(l => l.code === voiceLang)?.label || 'English';

  return (
    <div className="page" style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 60px)', background: '#070b12' }}>

      {/* Header */}
      <div style={{
        padding: '12px 20px', borderBottom: '1px solid rgba(255,255,255,0.06)',
        background: '#0d1220', display: 'flex', alignItems: 'center', gap: '12px', flexShrink: 0,
      }}>
        <Link to="/" style={{ color: '#7d8faa', fontSize: '18px' }}>←</Link>
        <div style={{
          width: '36px', height: '36px', borderRadius: '10px',
          background: 'linear-gradient(135deg, #4f8ef7, #2dd98f)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '17px', flexShrink: 0,
        }}>◈</div>
        <div style={{ flex: 1 }}>
          <h2 style={{ fontFamily: 'Syne, sans-serif', fontSize: '15px', fontWeight: '600', color: '#eef2ff', margin: 0 }}>
            AI Medicine Assistant
          </h2>
          <p style={{ fontSize: '11px', color: '#2dd98f', margin: 0 }}>● Online · Multilingual</p>
        </div>

        {/* Clear chat button */}
        <button onClick={clearChat} style={{
          padding: '5px 12px', borderRadius: '8px', fontSize: '12px',
          color: '#f56565', background: 'rgba(245,101,101,0.07)',
          border: '1px solid rgba(245,101,101,0.18)',
        }}
          onMouseEnter={e => e.currentTarget.style.background = 'rgba(245,101,101,0.14)'}
          onMouseLeave={e => e.currentTarget.style.background = 'rgba(245,101,101,0.07)'}
          title="Clear chat history"
        >🗑 Clear</button>

        {/* Language selector */}
        <div style={{ position: 'relative' }}>
          <button onClick={() => setShowLangMenu(p => !p)} style={{
            padding: '6px 12px', borderRadius: '8px', fontSize: '13px',
            color: '#7d8faa', background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.1)',
            display: 'flex', alignItems: 'center', gap: '6px',
          }}>
            🌍 {currentLang} ▾
          </button>
          {showLangMenu && (
            <div style={{
              position: 'absolute', top: '40px', right: 0,
              background: '#0d1220', border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '12px', padding: '6px', zIndex: 50,
              minWidth: '160px', maxHeight: '300px', overflowY: 'auto',
              boxShadow: '0 20px 40px rgba(0,0,0,0.6)',
            }}>
              {VOICE_LANGS.map(lang => (
                <button key={lang.code}
                  onClick={() => { setVoiceLang(lang.code); setShowLangMenu(false); }}
                  style={{
                    width: '100%', textAlign: 'left', padding: '8px 12px',
                    borderRadius: '8px', fontSize: '13px', border: 'none', cursor: 'pointer',
                    color: voiceLang === lang.code ? '#4f8ef7' : '#7d8faa',
                    background: voiceLang === lang.code ? 'rgba(79,142,247,0.1)' : 'transparent',
                    display: 'block',
                  }}
                >{lang.label}</button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Messages */}
      <div
        style={{ flex: 1, overflowY: 'auto', padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: '10px' }}
        onClick={() => setShowLangMenu(false)}
      >
        {messages.map((msg) => (
          <div key={msg.id} style={{
            display: 'flex', flexDirection: 'column',
            alignItems: msg.role === 'user' ? 'flex-end' : 'flex-start',
            animation: 'fadeUp 0.3s ease both',
            padding: '0 4px',
          }}>
            <span style={{ fontSize: '11px', color: '#3d4f66', marginBottom: '4px' }}>
              {msg.role === 'user' ? 'You' : 'AI Assistant'} · {formatTime(msg.time)}
            </span>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: '8px', flexDirection: msg.role === 'user' ? 'row-reverse' : 'row' }}>
              <div style={{
                maxWidth: 'min(75%, 520px)', minWidth: '80px',
                padding: '10px 14px',
                borderRadius: msg.role === 'user' ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                background: msg.role === 'user' ? 'linear-gradient(135deg, #4f8ef7, #3b7de8)' : '#1a2235',
                border: msg.role === 'ai' ? '1px solid rgba(255,255,255,0.07)' : 'none',
                color: '#eef2ff', fontSize: '15px', lineHeight: '1.65',
                whiteSpace: 'pre-wrap', wordBreak: 'break-word', overflowWrap: 'break-word',
              }}>
                {msg.text}
              </div>

              {/* ── FIX: each button checks speakingId === msg.id ── */}
              {msg.role === 'ai' && (
                <button
                  onClick={() => speakingId === msg.id ? stopSpeaking() : speakText(msg.text, msg.id)}
                  style={{
                    width: '28px', height: '28px', borderRadius: '50%', flexShrink: 0,
                    background: speakingId === msg.id ? 'rgba(79,142,247,0.2)' : 'rgba(255,255,255,0.05)',
                    border: `1px solid ${speakingId === msg.id ? 'rgba(79,142,247,0.4)' : 'rgba(255,255,255,0.1)'}`,
                    color: speakingId === msg.id ? '#4f8ef7' : '#7d8faa',
                    fontSize: '11px', cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    transition: 'all 0.2s ease',
                  }}
                >
                  {speakingId === msg.id ? '■' : '▶'}
                </button>
              )}
            </div>
          </div>
        ))}

        {loading && (
          <div style={{ display: 'flex', alignItems: 'flex-start' }}>
            <div style={{
              padding: '14px 18px', borderRadius: '14px 14px 14px 2px',
              background: '#0d1220', border: '1px solid rgba(255,255,255,0.07)',
              display: 'flex', gap: '6px', alignItems: 'center',
            }}>
              {[0, 1, 2].map(i => (
                <div key={i} style={{
                  width: '6px', height: '6px', borderRadius: '50%',
                  background: '#4f8ef7', animation: `pulse 1.2s ease ${i * 0.2}s infinite`,
                }} />
              ))}
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Quick replies — only show if very few messages */}
      {messages.length <= 2 && (
        <div style={{ padding: '0 20px 12px', display: 'flex', gap: '8px', overflowX: 'auto', flexShrink: 0 }}>
          {QUICK.map(q => (
            <button key={q} onClick={() => send(q)} style={{
              padding: '8px 14px', borderRadius: '20px', whiteSpace: 'nowrap',
              fontSize: '13px', color: '#7d8faa',
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.08)',
              flexShrink: 0,
            }}>{q}</button>
          ))}
        </div>
      )}

      {/* INPUT BAR */}
      <div style={{
        padding: '10px 16px 14px',
        borderTop: '1px solid rgba(255,255,255,0.06)',
        background: '#0d1220', flexShrink: 0,
      }}>
        {listening && (
          <div style={{
            display: 'flex', alignItems: 'center', gap: '10px',
            padding: '10px 16px', marginBottom: '10px',
            background: 'rgba(45,217,143,0.08)', borderRadius: '12px',
            border: '1px solid rgba(45,217,143,0.2)',
          }}>
            <div style={{ display: 'flex', gap: '3px', alignItems: 'center' }}>
              {[1, 2, 3, 4, 5].map((h, i) => (
                <div key={i} style={{
                  width: '3px', borderRadius: '2px', background: '#2dd98f',
                  height: `${h * 4}px`, animation: `pulse 0.6s ease ${i * 0.1}s infinite`,
                }} />
              ))}
            </div>
            <span style={{ fontSize: '13px', color: '#2dd98f', flex: 1 }}>
              Listening in {currentLang}...
            </span>
            <button onClick={stopRecognition} style={{
              fontSize: '12px', color: '#f56565', background: 'none', border: 'none', cursor: 'pointer',
            }}>✕ Stop</button>
          </div>
        )}

        <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-end' }}>
          {showInput && (
            <textarea
              ref={inputRef}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); } }}
              placeholder={`Message in ${currentLang}...`}
              rows={1}
              style={{
                flex: 1, background: '#111827',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: '22px', padding: '12px 18px',
                fontSize: '15px', color: '#eef2ff', resize: 'none',
                maxHeight: '120px', lineHeight: '1.5',
                fontFamily: 'DM Sans, sans-serif',
              }}
              onFocus={e => e.target.style.borderColor = 'rgba(79,142,247,0.4)'}
              onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.08)'}
              onInput={e => {
                e.target.style.height = 'auto';
                e.target.style.height = Math.min(e.target.scrollHeight, 120) + 'px';
              }}
            />
          )}

          {!showInput && (
            <div style={{
              flex: 1, height: '46px', borderRadius: '22px',
              background: 'rgba(45,217,143,0.1)',
              border: '1px solid rgba(45,217,143,0.3)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              gap: '10px', position: 'relative', overflow: 'hidden',
            }}>
              <div style={{
                position: 'absolute', left: 0, top: 0, bottom: 0,
                width: `${holdProgress}%`,
                background: 'rgba(45,217,143,0.15)',
                transition: 'width 0.06s linear',
              }} />
              <span style={{ fontSize: '13px', color: '#2dd98f', zIndex: 1 }}>
                {listening ? '🎤 Recording... release to send' : '⏳ Hold to record...'}
              </span>
            </div>
          )}

          {voiceSupport && !input.trim() ? (
            <button
              onPointerDown={handleMicPointerDown}
              onPointerUp={handleMicPointerUp}
              onPointerLeave={handleMicPointerUp}
              style={{
                width: '46px', height: '46px', borderRadius: '50%', flexShrink: 0,
                background: listening
                  ? 'linear-gradient(135deg, #2dd98f, #1bb87a)'
                  : holdProgress > 0
                  ? 'linear-gradient(135deg, #2dd98f, #1bb87a)'
                  : 'linear-gradient(135deg, #4f8ef7, #3b7de8)',
                border: 'none', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '20px',
                boxShadow: listening
                  ? '0 0 0 6px rgba(45,217,143,0.2), 0 0 0 12px rgba(45,217,143,0.1)'
                  : '0 4px 16px rgba(79,142,247,0.4)',
                transition: 'all 0.2s ease',
                animation: listening ? 'pulse 1s ease infinite' : 'none',
                userSelect: 'none', WebkitUserSelect: 'none', touchAction: 'none',
              }}
            >🎤</button>
          ) : (
            <button onClick={() => send()} disabled={loading || !input.trim()} style={{
              width: '46px', height: '46px', borderRadius: '50%', flexShrink: 0,
              background: loading || !input.trim()
                ? 'rgba(79,142,247,0.3)'
                : 'linear-gradient(135deg, #4f8ef7, #3b7de8)',
              border: 'none', color: 'white', fontSize: '20px',
              cursor: loading || !input.trim() ? 'not-allowed' : 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 4px 16px rgba(79,142,247,0.3)',
              transition: 'all 0.2s ease',
            }}>→</button>
          )}
        </div>

        <p style={{ fontSize: '11px', color: '#3d4f66', marginTop: '8px', textAlign: 'center' }}>
          {voiceSupport
            ? `Hold 🎤 to record · 🌍 ${currentLang} selected · ▶ Tap to hear response`
            : 'Voice requires Chrome or Edge'}
        </p>
      </div>
    </div>
  );
}