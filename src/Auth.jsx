import { useState } from 'react'
import { supabase } from './supabase'

function GlassInput({ type, placeholder, value, onChange }) {
  const [focused, setFocused] = useState(false)
  return (
    <input
      type={type} value={value} onChange={onChange} placeholder={placeholder}
      onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
      style={{
        width: '100%', padding: '13px 18px', borderRadius: '16px',
        background: focused ? 'rgba(255,255,255,0.7)' : 'rgba(255,255,255,0.45)',
        backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
        border: focused ? '1px solid rgba(168,85,247,0.5)' : '1px solid rgba(255,255,255,0.8)',
        color: '#1a1a2e', fontSize: '14px', outline: 'none',
        boxShadow: focused ? '0 0 0 3px rgba(168,85,247,0.1)' : 'inset 0 2px 4px rgba(0,0,0,0.04)',
        transition: 'all 0.2s', fontFamily: 'inherit', boxSizing: 'border-box',
        marginBottom: '12px', display: 'block'
      }}
    />
  )
}

export default function Auth() {
  const [mode, setMode] = useState('login') // login | signup | forgot
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const handleAuth = async () => {
    if (!email || !password) { setError('Email aur password zaroori hai.'); return }
    if (mode === 'signup' && !name) { setError('Naam zaroori hai.'); return }
    if (password.length < 6) { setError('Password kam se kam 6 characters ka hona chahiye.'); return }

    setError(''); setSuccess(''); setLoading(true)

    try {
      if (mode === 'signup') {
        const { error } = await supabase.auth.signUp({
          email, password,
          options: { data: { full_name: name } }
        })
        if (error) throw error
        setSuccess('Account ban gaya! Email check karo verification ke liye.')
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password })
        if (error) throw error
      }
    } catch (err) {
      setError(err.message || 'Kuch gadbad ho gayi.')
    }
    setLoading(false)
  }

  const handleForgot = async () => {
    if (!email) { setError('Email daalo pehle.'); return }
    setLoading(true); setError('')
    const { error } = await supabase.auth.resetPasswordForEmail(email)
    if (error) setError(error.message)
    else setSuccess('Password reset link email pe bhej diya!')
    setLoading(false)
  }

  return (
    <div style={{ minHeight: '100vh', fontFamily: "'Inter', sans-serif", position: 'relative', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        @keyframes floatOrb1 { 0%{transform:translate(0,0) scale(1)} 50%{transform:translate(30px,-40px) scale(1.1)} 100%{transform:translate(-20px,20px) scale(0.95)} }
        @keyframes floatOrb2 { 0%{transform:translate(0,0)} 50%{transform:translate(-40px,30px) scale(1.05)} 100%{transform:translate(25px,-25px)} }
        @keyframes floatOrb3 { 0%{transform:translate(0,0)} 50%{transform:translate(20px,40px) scale(0.92)} 100%{transform:translate(-30px,-20px)} }
        @keyframes fadeUp { 0%{opacity:0;transform:translateY(20px)} 100%{opacity:1;transform:translateY(0)} }
        @keyframes spin { 0%{transform:rotate(0deg)} 100%{transform:rotate(360deg)} }
        input::placeholder { color: rgba(100,100,120,0.4); }
      `}</style>

      {/* Background */}
      <div style={{ position: 'fixed', inset: 0, zIndex: 0 }}>
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, #f0e8ff 0%, #e8f4ff 35%, #fff0f8 65%, #e8fff4 100%)' }} />
        <div style={{ position:'absolute', width:'500px', height:'500px', borderRadius:'50%', left:'5%', top:'5%', background:'radial-gradient(circle, rgba(168,85,247,0.35), transparent 70%)', filter:'blur(60px)', animation:'floatOrb1 12s ease-in-out infinite' }} />
        <div style={{ position:'absolute', width:'600px', height:'600px', borderRadius:'50%', right:'0%', top:'20%', background:'radial-gradient(circle, rgba(56,189,248,0.3), transparent 70%)', filter:'blur(70px)', animation:'floatOrb2 15s ease-in-out infinite' }} />
        <div style={{ position:'absolute', width:'450px', height:'450px', borderRadius:'50%', left:'30%', bottom:'5%', background:'radial-gradient(circle, rgba(249,115,22,0.25), transparent 70%)', filter:'blur(60px)', animation:'floatOrb3 10s ease-in-out infinite' }} />
      </div>

      <div style={{ position: 'relative', zIndex: 1, width: '100%', maxWidth: '420px', padding: '24px', animation: 'fadeUp 0.5s ease both' }}>

        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
            <div style={{ width: '42px', height: '42px', borderRadius: '14px', background: 'linear-gradient(135deg, #f97316, #a855f7)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', boxShadow: '0 4px 16px rgba(168,85,247,0.35)' }}>✨</div>
            <span style={{ fontSize: '28px', fontWeight: 900, color: '#1a1a2e', letterSpacing: '-0.5px' }}>
              Listo<span style={{ background: 'linear-gradient(135deg, #f97316, #a855f7)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>AI</span>
            </span>
          </div>
          <p style={{ color: '#888', fontSize: '14px' }}>Indian Sellers ke liye AI Listing Tool</p>
        </div>

        {/* Card */}
        <div style={{
          background: 'rgba(255,255,255,0.5)', backdropFilter: 'blur(30px)',
          WebkitBackdropFilter: 'blur(30px)', border: '1px solid rgba(255,255,255,0.8)',
          borderRadius: '28px', padding: '32px 28px',
          boxShadow: '0 8px 40px rgba(0,0,0,0.08), inset 0 1px 0 rgba(255,255,255,0.9)'
        }}>
          {/* Tabs */}
          {mode !== 'forgot' && (
            <div style={{ display: 'flex', background: 'rgba(255,255,255,0.4)', borderRadius: '16px', padding: '4px', marginBottom: '24px', border: '1px solid rgba(255,255,255,0.7)' }}>
              {['login', 'signup'].map(m => (
                <button key={m} onClick={() => { setMode(m); setError(''); setSuccess('') }} style={{
                  flex: 1, padding: '10px', borderRadius: '13px', border: 'none',
                  background: mode === m ? 'linear-gradient(135deg, #f97316, #a855f7)' : 'transparent',
                  color: mode === m ? 'white' : '#888', fontWeight: 700, fontSize: '14px',
                  cursor: 'pointer', fontFamily: 'inherit',
                  transition: 'all 0.2s cubic-bezier(0.34,1.56,0.64,1)',
                  boxShadow: mode === m ? '0 4px 12px rgba(168,85,247,0.3)' : 'none'
                }}>
                  {m === 'login' ? '🔑 Login' : '✨ Sign Up'}
                </button>
              ))}
            </div>
          )}

          {mode === 'forgot' && (
            <div style={{ marginBottom: '20px' }}>
              <button onClick={() => { setMode('login'); setError(''); setSuccess('') }} style={{ background: 'none', border: 'none', color: '#a855f7', fontWeight: 700, cursor: 'pointer', fontSize: '14px', fontFamily: 'inherit' }}>← Wapas Login</button>
              <h3 style={{ color: '#1a1a2e', fontWeight: 800, fontSize: '18px', marginTop: '8px' }}>Password Reset</h3>
            </div>
          )}

          {mode === 'signup' && (
            <GlassInput type="text" placeholder="Tumhara naam" value={name} onChange={e => setName(e.target.value)} />
          )}

          <GlassInput type="email" placeholder="Email address" value={email} onChange={e => setEmail(e.target.value)} />

          {mode !== 'forgot' && (
            <GlassInput type="password" placeholder="Password (min 6 characters)" value={password} onChange={e => setPassword(e.target.value)} />
          )}

          {error && <div style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: '10px', padding: '10px 14px', marginBottom: '12px', fontSize: '13px', color: '#ef4444' }}>⚠️ {error}</div>}
          {success && <div style={{ background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.2)', borderRadius: '10px', padding: '10px 14px', marginBottom: '12px', fontSize: '13px', color: '#16a34a' }}>✅ {success}</div>}

          <button
            onClick={mode === 'forgot' ? handleForgot : handleAuth}
            disabled={loading}
            style={{
              width: '100%', padding: '14px', borderRadius: '14px',
              background: loading ? 'rgba(168,85,247,0.3)' : 'linear-gradient(135deg, #f97316, #a855f7)',
              color: 'white', border: 'none', fontSize: '15px', fontWeight: 700,
              cursor: loading ? 'not-allowed' : 'pointer', fontFamily: 'inherit',
              boxShadow: '0 4px 16px rgba(168,85,247,0.3)', transition: 'all 0.2s',
              marginBottom: '16px'
            }}
          >
            {loading ? (
              <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                <span style={{ width: '16px', height: '16px', border: '2px solid rgba(255,255,255,0.3)', borderTop: '2px solid white', borderRadius: '50%', display: 'inline-block', animation: 'spin 0.8s linear infinite' }} />
                Loading...
              </span>
            ) : mode === 'login' ? '🔑 Login Karo' : mode === 'signup' ? '✨ Account Banao' : '📧 Reset Link Bhejo'}
          </button>

          {mode === 'login' && (
            <div style={{ textAlign: 'center' }}>
              <button onClick={() => { setMode('forgot'); setError(''); setSuccess('') }} style={{ background: 'none', border: 'none', color: '#a855f7', fontSize: '13px', cursor: 'pointer', fontFamily: 'inherit', fontWeight: 600 }}>
                Password bhool gaye?
              </button>
            </div>
          )}
        </div>

        {/* Free plan note */}
        <div style={{ textAlign: 'center', marginTop: '20px' }}>
          <p style={{ color: '#888', fontSize: '12px', lineHeight: 1.6 }}>
            Free plan: <strong>5 generations/month</strong><br />
            Pro plan: <strong>₹99/month — Unlimited</strong>
          </p>
        </div>
      </div>
    </div>
  )
}
