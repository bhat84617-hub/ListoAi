import { useState, useEffect, useRef } from 'react'

const CATEGORIES = [
  "Women Clothing", "Men Clothing", "Kids Clothing", "Sarees", "Kurtis",
  "Footwear", "Jewellery", "Home Decor", "Kitchen & Dining", "Electronics",
  "Beauty & Health", "Bags & Accessories", "Sports & Fitness", "Toys & Games", "Other"
]

const PLATFORMS = [
  { id: 'meesho', name: 'Meesho', emoji: '🛍️', color: '#a855f7', hint: 'Short & punchy for resellers', descKey: 'short' },
  { id: 'amazon', name: 'Amazon', emoji: '📦', color: '#f97316', hint: 'SEO-rich detailed listing', descKey: 'long' },
  { id: 'flipkart', name: 'Flipkart', emoji: '🛒', color: '#3b82f6', hint: 'Clear & confident copy', descKey: 'flipkart' },
  { id: 'general', name: 'All Platforms', emoji: '🌐', color: '#10b981', hint: 'Universal description', descKey: 'general' },
]

function GlassCard({ children, style = {}, glowColor }) {
  return (
    <div style={{
      background: 'rgba(255,255,255,0.45)',
      backdropFilter: 'blur(30px)',
      WebkitBackdropFilter: 'blur(30px)',
      border: '1px solid rgba(255,255,255,0.75)',
      borderRadius: '24px',
      boxShadow: glowColor
        ? `0 8px 32px rgba(0,0,0,0.08), inset 0 1px 0 rgba(255,255,255,0.9), 0 0 40px ${glowColor}`
        : '0 8px 32px rgba(0,0,0,0.08), inset 0 1px 0 rgba(255,255,255,0.9)',
      ...style
    }}>
      {children}
    </div>
  )
}

function GlassButton({ children, onClick, disabled, primary, color = '#a855f7', style = {} }) {
  const [pressed, setPressed] = useState(false)
  const [hovered, setHovered] = useState(false)

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => { setHovered(false); setPressed(false) }}
      onMouseDown={() => setPressed(true)}
      onMouseUp={() => setPressed(false)}
      onTouchStart={() => setPressed(true)}
      onTouchEnd={() => setPressed(false)}
      style={{
        background: disabled
          ? 'rgba(255,255,255,0.3)'
          : primary
            ? `linear-gradient(135deg, ${color}, ${color}bb)`
            : 'rgba(255,255,255,0.5)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        border: primary ? `1px solid ${color}60` : '1px solid rgba(255,255,255,0.8)',
        borderRadius: '16px',
        color: disabled ? 'rgba(0,0,0,0.2)' : primary ? 'white' : '#1a1a2e',
        fontWeight: 700,
        cursor: disabled ? 'not-allowed' : 'pointer',
        fontFamily: 'inherit',
        boxShadow: pressed
          ? 'inset 0 2px 8px rgba(0,0,0,0.15)'
          : hovered && !disabled
            ? primary
              ? `0 8px 24px ${color}50, inset 0 1px 0 rgba(255,255,255,0.4)`
              : '0 8px 20px rgba(0,0,0,0.12), inset 0 1px 0 rgba(255,255,255,1)'
            : primary
              ? `0 4px 16px ${color}30, inset 0 1px 0 rgba(255,255,255,0.3)`
              : '0 4px 12px rgba(0,0,0,0.06), inset 0 1px 0 rgba(255,255,255,0.9)',
        transform: pressed ? 'scale(0.97)' : hovered && !disabled ? 'scale(1.02)' : 'scale(1)',
        transition: 'all 0.15s cubic-bezier(0.34, 1.56, 0.64, 1)',
        ...style
      }}
    >
      {children}
    </button>
  )
}

function GlassInput({ name, value, onChange, placeholder, isSelect, children }) {
  const [focused, setFocused] = useState(false)
  const baseStyle = {
    width: '100%',
    padding: '13px 18px',
    borderRadius: '16px',
    background: focused ? 'rgba(255,255,255,0.7)' : 'rgba(255,255,255,0.45)',
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    border: focused ? '1px solid rgba(168,85,247,0.5)' : '1px solid rgba(255,255,255,0.8)',
    color: '#1a1a2e',
    fontSize: '14px',
    outline: 'none',
    boxShadow: focused
      ? '0 0 0 3px rgba(168,85,247,0.1), inset 0 2px 4px rgba(0,0,0,0.04)'
      : 'inset 0 2px 4px rgba(0,0,0,0.04), 0 2px 8px rgba(0,0,0,0.04)',
    transition: 'all 0.2s ease',
    fontFamily: 'inherit',
    boxSizing: 'border-box',
  }
  if (isSelect) return (
    <select name={name} value={value} onChange={onChange}
      onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
      style={{ ...baseStyle, cursor: 'pointer', background: focused ? 'rgba(255,255,255,0.8)' : 'rgba(255,255,255,0.5)' }}>
      {children}
    </select>
  )
  return (
    <input name={name} value={value} onChange={onChange} placeholder={placeholder}
      onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
      style={baseStyle} />
  )
}

function CopyButton({ text, id, copied, onCopy, color = '#a855f7' }) {
  const active = copied === id
  return (
    <GlassButton onClick={() => onCopy(id, text)} primary={active} color={active ? '#22c55e' : color}
      style={{ padding: '7px 16px', fontSize: '12px', borderRadius: '10px', flexShrink: 0, marginLeft: '12px' }}>
      {active ? '✓ Copied!' : 'Copy'}
    </GlassButton>
  )
}

export default function App() {
  const [form, setForm] = useState({ name: '', category: '', f1: '', f2: '', f3: '' })
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [copied, setCopied] = useState('')
  const [lang, setLang] = useState('english')
  const [activePlatform, setActivePlatform] = useState('meesho')
  const resultRef = useRef(null)

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const generate = async () => {
    if (!form.name.trim() || !form.category || !form.f1.trim()) {
      setError('Product name, category aur pehla feature zaroori hai.')
      return
    }
    setError('')
    setLoading(true)
    setResult(null)
    const features = [form.f1, form.f2, form.f3].filter(Boolean).join(', ')
    const langInstruction = lang === 'hindi'
      ? 'Write ALL descriptions in Hindi using Devanagari script.'
      : 'Write ALL descriptions in English.'
    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: form.name, category: form.category, features, lang: langInstruction })
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Something went wrong')
      setResult(data)
      setActivePlatform('meesho')
      setTimeout(() => resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100)
    } catch (err) {
      setError(err.message || 'Kuch gadbad ho gayi. Dobara try karo.')
    }
    setLoading(false)
  }

  const copy = (key, text) => {
    navigator.clipboard.writeText(text)
    setCopied(key)
    setTimeout(() => setCopied(''), 2000)
  }

  const reset = () => { setForm({ name: '', category: '', f1: '', f2: '', f3: '' }); setResult(null); setError('') }
  const activePlatformData = PLATFORMS.find(p => p.id === activePlatform)

  return (
    <div style={{ minHeight: '100vh', fontFamily: "'Inter', -apple-system, sans-serif", position: 'relative', overflowX: 'hidden' }}>

      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { margin: 0; }
        @keyframes floatOrb1 { 0%{transform:translate(0,0) scale(1)} 50%{transform:translate(30px,-40px) scale(1.1)} 100%{transform:translate(-20px,20px) scale(0.95)} }
        @keyframes floatOrb2 { 0%{transform:translate(0,0) scale(1)} 50%{transform:translate(-40px,30px) scale(1.05)} 100%{transform:translate(25px,-25px) scale(1.08)} }
        @keyframes floatOrb3 { 0%{transform:translate(0,0) scale(1)} 50%{transform:translate(20px,40px) scale(0.92)} 100%{transform:translate(-30px,-20px) scale(1.05)} }
        @keyframes floatOrb4 { 0%{transform:translate(0,0) scale(1)} 50%{transform:translate(-25px,-35px) scale(1.08)} 100%{transform:translate(35px,15px) scale(0.96)} }
        @keyframes spin { 0%{transform:rotate(0deg)} 100%{transform:rotate(360deg)} }
        @keyframes fadeUp { 0%{opacity:0;transform:translateY(20px)} 100%{opacity:1;transform:translateY(0)} }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }
        input::placeholder { color: rgba(100,100,120,0.45); }
        select option { background: white; color: #1a1a2e; }
      `}</style>

      {/* BACKGROUND */}
      <div style={{ position: 'fixed', inset: 0, zIndex: 0, overflow: 'hidden' }}>
        {/* Base gradient — light creamy */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(135deg, #f0e8ff 0%, #e8f4ff 30%, #fff0f8 60%, #e8fff4 100%)'
        }} />
        {/* Colorful orbs */}
        <div style={{ position:'absolute', width:'500px', height:'500px', borderRadius:'50%', left:'5%', top:'5%', background:'radial-gradient(circle, rgba(168,85,247,0.35), rgba(139,92,246,0.15) 60%, transparent 80%)', filter:'blur(60px)', animation:'floatOrb1 12s ease-in-out infinite' }} />
        <div style={{ position:'absolute', width:'600px', height:'600px', borderRadius:'50%', right:'0%', top:'20%', background:'radial-gradient(circle, rgba(56,189,248,0.3), rgba(14,165,233,0.12) 60%, transparent 80%)', filter:'blur(70px)', animation:'floatOrb2 15s ease-in-out infinite' }} />
        <div style={{ position:'absolute', width:'450px', height:'450px', borderRadius:'50%', left:'30%', bottom:'10%', background:'radial-gradient(circle, rgba(249,115,22,0.25), rgba(251,146,60,0.1) 60%, transparent 80%)', filter:'blur(60px)', animation:'floatOrb3 10s ease-in-out infinite' }} />
        <div style={{ position:'absolute', width:'400px', height:'400px', borderRadius:'50%', right:'20%', bottom:'30%', background:'radial-gradient(circle, rgba(16,185,129,0.25), rgba(52,211,153,0.1) 60%, transparent 80%)', filter:'blur(55px)', animation:'floatOrb4 13s ease-in-out infinite' }} />
        <div style={{ position:'absolute', width:'350px', height:'350px', borderRadius:'50%', left:'50%', top:'15%', background:'radial-gradient(circle, rgba(236,72,153,0.2), transparent 70%)', filter:'blur(50px)', animation:'floatOrb2 9s ease-in-out infinite reverse' }} />
      </div>

      {/* NAV */}
      <nav style={{
        position: 'sticky', top: 0, zIndex: 100,
        padding: '0 24px', height: '64px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        background: 'rgba(255,255,255,0.4)',
        backdropFilter: 'blur(30px)',
        WebkitBackdropFilter: 'blur(30px)',
        borderBottom: '1px solid rgba(255,255,255,0.7)',
        boxShadow: '0 2px 20px rgba(0,0,0,0.06)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '38px', height: '38px', borderRadius: '12px',
            background: 'linear-gradient(135deg, #f97316, #a855f7)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '18px', boxShadow: '0 4px 12px rgba(168,85,247,0.35)'
          }}>✨</div>
          <span style={{ fontSize: '22px', fontWeight: 900, color: '#1a1a2e', letterSpacing: '-0.5px' }}>
            Listo<span style={{ background: 'linear-gradient(135deg, #f97316, #a855f7)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>AI</span>
          </span>
          <span style={{
            background: 'rgba(168,85,247,0.12)', color: '#a855f7',
            fontSize: '10px', fontWeight: 700, padding: '3px 8px',
            borderRadius: '20px', border: '1px solid rgba(168,85,247,0.25)', letterSpacing: '1px'
          }}>BETA</span>
        </div>
        <div style={{
          background: 'rgba(255,255,255,0.6)', border: '1px solid rgba(255,255,255,0.8)',
          backdropFilter: 'blur(20px)', borderRadius: '20px',
          padding: '6px 14px', fontSize: '12px', color: '#666', fontWeight: 500,
          boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
        }}>🇮🇳 Indian Sellers ke liye</div>
      </nav>

      <div style={{ position: 'relative', zIndex: 1 }}>

        {/* HERO */}
        <section style={{ padding: '80px 24px 70px', textAlign: 'center' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            background: 'rgba(255,255,255,0.5)', border: '1px solid rgba(255,255,255,0.8)',
            backdropFilter: 'blur(20px)', borderRadius: '50px',
            padding: '7px 18px', marginBottom: '28px',
            boxShadow: '0 4px 16px rgba(0,0,0,0.06)'
          }}>
            <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#22c55e', display: 'inline-block', animation: 'pulse 2s infinite' }} />
            <span style={{ color: '#444', fontSize: '13px', fontWeight: 600 }}>Meesho • Amazon • Flipkart • All Platforms</span>
          </div>

          <h1 style={{
            color: '#1a1a2e', fontSize: 'clamp(36px, 7vw, 68px)',
            fontWeight: 900, lineHeight: 1.05, marginBottom: '20px',
            letterSpacing: '-2px', animation: 'fadeUp 0.5s ease both'
          }}>
            Perfect Listing<br />
            <span style={{ background: 'linear-gradient(135deg, #f97316 0%, #a855f7 50%, #3b82f6 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              5 Second Mein
            </span>
          </h1>

          <p style={{ color: '#666', fontSize: '17px', maxWidth: '480px', margin: '0 auto 44px', lineHeight: 1.7, animation: 'fadeUp 0.5s 0.1s ease both' }}>
            Product details daalo — AI instantly title, description aur image prompt bana deta hai. English ya Hindi — dono mein.
          </p>

          {/* Stats */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', flexWrap: 'wrap' }}>
            {[
              { n: '15L+', l: 'Meesho Sellers' },
              { n: '5 sec', l: 'Generation Time' },
              { n: '4', l: 'Platforms' },
              { n: '2', l: 'Languages' },
            ].map(s => (
              <div key={s.n} style={{
                background: 'rgba(255,255,255,0.5)', border: '1px solid rgba(255,255,255,0.8)',
                backdropFilter: 'blur(20px)', borderRadius: '20px',
                padding: '16px 22px', minWidth: '100px',
                boxShadow: '0 4px 20px rgba(0,0,0,0.06), inset 0 1px 0 rgba(255,255,255,0.9)'
              }}>
                <div style={{ fontSize: '26px', fontWeight: 900, color: '#1a1a2e' }}>{s.n}</div>
                <div style={{ fontSize: '11px', color: '#888', fontWeight: 500, marginTop: '2px' }}>{s.l}</div>
              </div>
            ))}
          </div>
        </section>

        {/* PLATFORM CARDS */}
        <section style={{ padding: '0 24px 70px' }}>
          <div style={{ maxWidth: '900px', margin: '0 auto' }}>
            <p style={{ textAlign: 'center', color: '#aaa', fontSize: '11px', fontWeight: 700, letterSpacing: '3px', textTransform: 'uppercase', marginBottom: '32px' }}>SUPPORTED PLATFORMS</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))', gap: '12px' }}>
              {[
                { name: 'Meesho', emoji: '🛍️', color: '#a855f7', users: '15L+ sellers', desc: 'Short punchy descriptions for resellers' },
                { name: 'Amazon', emoji: '📦', color: '#f97316', users: '10L+ sellers', desc: 'SEO-rich detailed product content' },
                { name: 'Flipkart', emoji: '🛒', color: '#3b82f6', users: '5L+ sellers', desc: 'Clear confident product copy' },
                { name: 'All Platforms', emoji: '🌐', color: '#10b981', users: 'Every seller', desc: 'Universal listing for any platform' },
              ].map(p => (
                <GlassCard key={p.name} style={{ padding: '24px 18px', textAlign: 'center' }}>
                  <div style={{
                    width: '52px', height: '52px', borderRadius: '16px', margin: '0 auto 12px',
                    background: `linear-gradient(135deg, ${p.color}25, ${p.color}10)`,
                    border: `1px solid ${p.color}35`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '26px', boxShadow: `0 4px 16px ${p.color}20`
                  }}>{p.emoji}</div>
                  <div style={{ fontWeight: 800, color: '#1a1a2e', fontSize: '15px', marginBottom: '6px' }}>{p.name}</div>
                  <div style={{ fontSize: '12px', color: '#888', lineHeight: 1.5, marginBottom: '12px' }}>{p.desc}</div>
                  <div style={{ fontSize: '11px', fontWeight: 700, color: p.color, background: `${p.color}12`, padding: '4px 12px', borderRadius: '20px', border: `1px solid ${p.color}25`, display: 'inline-block' }}>{p.users}</div>
                </GlassCard>
              ))}
            </div>
          </div>
        </section>

        {/* MAIN TOOL */}
        <section style={{ padding: '0 24px 100px' }}>
          <div style={{ maxWidth: '680px', margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: '32px' }}>
              <h2 style={{ color: '#1a1a2e', fontSize: '30px', fontWeight: 900, letterSpacing: '-0.5px', marginBottom: '8px' }}>Abhi Try Karo</h2>
              <p style={{ color: '#888', fontSize: '15px' }}>Free hai — koi account nahi chahiye</p>
            </div>

            {/* Language Toggle */}
            <GlassCard style={{ padding: '5px', marginBottom: '14px', display: 'flex', gap: '4px' }}>
              {[
                { key: 'english', label: '🇬🇧 English', sub: 'Wider reach ke liye' },
                { key: 'hindi', label: '🇮🇳 हिंदी', sub: 'Indian sellers ke liye' }
              ].map(l => (
                <button key={l.key} onClick={() => setLang(l.key)} style={{
                  flex: 1, padding: '12px 16px', borderRadius: '20px', border: 'none',
                  background: lang === l.key ? 'linear-gradient(135deg, #f97316, #a855f7)' : 'transparent',
                  color: lang === l.key ? 'white' : '#888',
                  fontWeight: 700, fontSize: '14px', cursor: 'pointer', fontFamily: 'inherit',
                  transition: 'all 0.25s cubic-bezier(0.34,1.56,0.64,1)',
                  boxShadow: lang === l.key ? '0 4px 16px rgba(168,85,247,0.3), inset 0 1px 0 rgba(255,255,255,0.3)' : 'none',
                  transform: lang === l.key ? 'scale(1.02)' : 'scale(1)'
                }}>
                  <div>{l.label}</div>
                  <div style={{ fontSize: '10px', fontWeight: 400, opacity: 0.8, marginTop: '2px' }}>{l.sub}</div>
                </button>
              ))}
            </GlassCard>

            {/* Form */}
            <GlassCard style={{ padding: '30px 26px' }}>
              <h3 style={{ color: '#1a1a2e', fontWeight: 800, fontSize: '17px', marginBottom: '22px' }}>📦 Product Details</h3>

              <label style={lbl}>Product ka Naam *</label>
              <GlassInput name="name" value={form.name} onChange={handleChange} placeholder="e.g. Banarasi Silk Saree, Cotton Kurti..." />

              <label style={{ ...lbl, marginTop: '14px' }}>Category *</label>
              <GlassInput name="category" value={form.category} onChange={handleChange} isSelect>
                <option value="">-- Category select karo --</option>
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </GlassInput>

              <label style={{ ...lbl, marginTop: '14px' }}>Product Ki Khasiyat *</label>
              <p style={{ fontSize: '12px', color: '#aaa', marginBottom: '10px' }}>3 cheezein likho jo tumhara product special banati hain</p>

              {[
                { name: 'f1', ph: 'Material kya hai? — e.g. Pure cotton, Silk' },
                { name: 'f2', ph: 'Koi khaas quality? — e.g. Washable, Lightweight' },
                { name: 'f3', ph: 'Koi extra benefit? — e.g. Blouse included' },
              ].map((f, i) => (
                <div key={f.name} style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                  <div style={{
                    width: '30px', height: '30px', borderRadius: '50%', flexShrink: 0,
                    background: 'linear-gradient(135deg, rgba(249,115,22,0.2), rgba(168,85,247,0.2))',
                    border: '1px solid rgba(168,85,247,0.3)',
                    color: '#a855f7', fontSize: '12px', fontWeight: 800,
                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                  }}>{i + 1}</div>
                  <div style={{ flex: 1 }}><GlassInput name={f.name} value={form[f.name]} onChange={handleChange} placeholder={f.ph} /></div>
                </div>
              ))}

              {error && (
                <div style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: '12px', padding: '12px 16px', marginTop: '14px', fontSize: '13px', color: '#ef4444' }}>
                  ⚠️ {error}
                </div>
              )}

              <GlassButton onClick={generate} disabled={loading} primary color="#a855f7"
                style={{ width: '100%', padding: '15px', fontSize: '16px', borderRadius: '16px', marginTop: '18px', letterSpacing: '0.3px' }}>
                {loading ? (
                  <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
                    <span style={{ width: '17px', height: '17px', border: '2px solid rgba(255,255,255,0.3)', borderTop: '2px solid white', borderRadius: '50%', display: 'inline-block', animation: 'spin 0.8s linear infinite' }} />
                    AI Generate kar raha hai...
                  </span>
                ) : `✨ ${lang === 'hindi' ? 'हिंदी में' : 'English में'} Generate Karo`}
              </GlassButton>
            </GlassCard>

            {/* RESULTS */}
            {result && (
              <div ref={resultRef} style={{ marginTop: '16px', animation: 'fadeUp 0.4s ease both' }}>
                <div style={{ background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.25)', backdropFilter: 'blur(20px)', borderRadius: '16px', padding: '13px 18px', marginBottom: '14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ color: '#16a34a', fontWeight: 700, fontSize: '14px' }}>✅ Listing ready hai!</span>
                  <GlassButton onClick={reset} style={{ padding: '6px 14px', fontSize: '12px', borderRadius: '10px' }}>🔄 Nayi Listing</GlassButton>
                </div>

                <GlassCard style={{ padding: '20px', marginBottom: '12px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '13px', color: '#1a1a2e' }}>🏷️ SEO Title</div>
                      <div style={{ fontSize: '11px', color: '#aaa', marginTop: '2px' }}>Har platform ke liye</div>
                    </div>
                    <CopyButton text={result.title} id="title" copied={copied} onCopy={copy} />
                  </div>
                  <p style={{ margin: 0, fontSize: '15px', color: '#1a1a2e', fontWeight: 700, lineHeight: 1.5 }}>{result.title}</p>
                </GlassCard>

                <p style={{ color: '#aaa', fontSize: '11px', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '8px' }}>Platform Choose Karo</p>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: '8px', marginBottom: '12px' }}>
                  {PLATFORMS.map(p => (
                    <GlassButton key={p.id} onClick={() => setActivePlatform(p.id)} primary={activePlatform === p.id} color={p.color}
                      style={{ padding: '12px', fontSize: '13px', borderRadius: '14px' }}>
                      {p.emoji} {p.name}
                    </GlassButton>
                  ))}
                </div>

                {activePlatformData && (
                  <GlassCard glowColor={activePlatformData.color + '25'} style={{ padding: '20px', marginBottom: '12px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                      <div>
                        <div style={{ fontWeight: 700, fontSize: '14px', color: '#1a1a2e' }}>{activePlatformData.emoji} {activePlatformData.name} Description</div>
                        <div style={{ fontSize: '11px', color: '#aaa', marginTop: '2px' }}>{activePlatformData.hint}</div>
                      </div>
                      <CopyButton text={result[activePlatformData.descKey] || result.short} id={activePlatform} copied={copied} onCopy={copy} color={activePlatformData.color} />
                    </div>
                    <p style={{ margin: 0, fontSize: '14px', color: '#374151', lineHeight: 1.8 }}>{result[activePlatformData.descKey] || result.short}</p>
                  </GlassCard>
                )}

                <GlassCard style={{ padding: '20px', border: '1px solid rgba(168,85,247,0.2)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '14px', color: '#1a1a2e' }}>🎨 AI Image Prompt</div>
                      <div style={{ fontSize: '11px', color: '#aaa', marginTop: '2px' }}>Free image tools mein paste karo</div>
                    </div>
                    <CopyButton text={result.imagePrompt} id="img" copied={copied} onCopy={copy} color="#a855f7" />
                  </div>
                  <p style={{ margin: '0 0 14px', fontSize: '13px', color: '#888', lineHeight: 1.7, fontStyle: 'italic' }}>{result.imagePrompt}</p>
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    {[
                      { name: 'Bing Image Creator', url: 'https://www.bing.com/images/create' },
                      { name: 'Leonardo AI', url: 'https://app.leonardo.ai' },
                      { name: 'Adobe Firefly', url: 'https://firefly.adobe.com' },
                    ].map(t => (
                      <a key={t.name} href={t.url} target="_blank" rel="noopener noreferrer" style={{ background: 'rgba(168,85,247,0.1)', color: '#a855f7', padding: '5px 12px', borderRadius: '8px', fontSize: '12px', fontWeight: 600, textDecoration: 'none', border: '1px solid rgba(168,85,247,0.2)' }}>↗ {t.name}</a>
                    ))}
                  </div>
                </GlassCard>

                <GlassButton onClick={generate} disabled={loading} style={{ width: '100%', padding: '13px', fontSize: '14px', borderRadius: '14px', marginTop: '10px' }}>
                  🔄 Dobara Generate Karo
                </GlassButton>
              </div>
            )}
          </div>
        </section>

        {/* HOW IT WORKS */}
        <section style={{ padding: '70px 24px', borderTop: '1px solid rgba(255,255,255,0.5)' }}>
          <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
            <p style={{ color: '#bbb', fontSize: '11px', fontWeight: 700, letterSpacing: '3px', textTransform: 'uppercase', marginBottom: '12px' }}>HOW IT WORKS</p>
            <h2 style={{ color: '#1a1a2e', fontSize: '28px', fontWeight: 900, letterSpacing: '-0.5px', marginBottom: '40px' }}>3 Steps Mein Done</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px' }}>
              {[
                { step: '01', icon: '📦', title: 'Details Daalo', desc: 'Naam, category, aur 3 features — bas itna kaafi hai' },
                { step: '02', icon: '🤖', title: 'AI Generate Karta Hai', desc: 'Gemini AI 5 second mein 4 platforms ke liye listing banata hai' },
                { step: '03', icon: '📋', title: 'Copy & Paste Karo', desc: 'Platform choose karo, copy karo, listing post karo' },
              ].map(s => (
                <GlassCard key={s.step} style={{ padding: '26px 20px', textAlign: 'left' }}>
                  <div style={{ fontSize: '11px', fontWeight: 800, color: '#a855f7', letterSpacing: '2px', marginBottom: '14px' }}>STEP {s.step}</div>
                  <div style={{ fontSize: '32px', marginBottom: '12px' }}>{s.icon}</div>
                  <div style={{ fontWeight: 800, color: '#1a1a2e', fontSize: '15px', marginBottom: '7px' }}>{s.title}</div>
                  <div style={{ fontSize: '13px', color: '#888', lineHeight: 1.6 }}>{s.desc}</div>
                </GlassCard>
              ))}
            </div>
          </div>
        </section>

        {/* FOOTER */}
        <footer style={{ borderTop: '1px solid rgba(255,255,255,0.5)', padding: '28px 24px', textAlign: 'center', background: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(20px)' }}>
          <span style={{ fontSize: '18px', fontWeight: 900, color: '#1a1a2e' }}>
            Listo<span style={{ background: 'linear-gradient(135deg, #f97316, #a855f7)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>AI</span>
          </span>
          <p style={{ color: '#aaa', fontSize: '12px', margin: '6px 0 0' }}>Made with ❤️ for Indian Sellers · v1.0 · © 2026 ListoAI</p>
        </footer>
      </div>
    </div>
  )
}

const lbl = { display: 'block', fontSize: '13px', fontWeight: 600, color: '#666', marginBottom: '7px' }
