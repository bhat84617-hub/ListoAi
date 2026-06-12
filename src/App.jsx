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

function GlassCard({ children, style = {}, glow = false, glowColor = 'rgba(168,85,247,0.3)' }) {
  return (
    <div style={{
      background: 'rgba(255,255,255,0.08)',
      backdropFilter: 'blur(24px)',
      WebkitBackdropFilter: 'blur(24px)',
      border: '1px solid rgba(255,255,255,0.18)',
      borderRadius: '24px',
      boxShadow: glow
        ? `0 8px 32px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.2), 0 0 40px ${glowColor}`
        : '0 8px 32px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.15)',
      ...style
    }}>
      {children}
    </div>
  )
}

function GlassButton({ children, onClick, disabled, primary, color, style = {} }) {
  const [pressed, setPressed] = useState(false)
  const [hovered, setHovered] = useState(false)

  const bg = primary
    ? `linear-gradient(135deg, ${color || '#f97316'}, ${color ? color + 'cc' : '#ef4444'})`
    : 'rgba(255,255,255,0.1)'

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
        background: disabled ? 'rgba(255,255,255,0.05)' : bg,
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        border: primary ? 'none' : '1px solid rgba(255,255,255,0.2)',
        borderRadius: '16px',
        color: disabled ? 'rgba(255,255,255,0.2)' : 'white',
        fontWeight: 700,
        cursor: disabled ? 'not-allowed' : 'pointer',
        fontFamily: 'inherit',
        boxShadow: pressed
          ? 'inset 0 2px 8px rgba(0,0,0,0.3)'
          : hovered && !disabled
            ? `0 8px 24px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.3), 0 0 20px ${color ? color + '60' : 'rgba(249,115,22,0.4)'}`
            : primary
              ? '0 4px 16px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.2)'
              : '0 2px 8px rgba(0,0,0,0.15), inset 0 1px 0 rgba(255,255,255,0.15)',
        transform: pressed ? 'scale(0.97)' : hovered && !disabled ? 'scale(1.02)' : 'scale(1)',
        transition: 'all 0.15s cubic-bezier(0.34, 1.56, 0.64, 1)',
        ...style
      }}
    >
      {children}
    </button>
  )
}

function GlassInput({ name, value, onChange, placeholder, type = 'text', isSelect, children }) {
  const [focused, setFocused] = useState(false)
  const baseStyle = {
    width: '100%',
    padding: '14px 18px',
    borderRadius: '16px',
    background: focused ? 'rgba(255,255,255,0.12)' : 'rgba(255,255,255,0.07)',
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    border: focused ? '1px solid rgba(255,255,255,0.4)' : '1px solid rgba(255,255,255,0.15)',
    color: 'white',
    fontSize: '14px',
    outline: 'none',
    boxShadow: focused
      ? 'inset 0 2px 8px rgba(0,0,0,0.2), 0 0 20px rgba(249,115,22,0.15)'
      : 'inset 0 2px 4px rgba(0,0,0,0.1)',
    transition: 'all 0.2s ease',
    fontFamily: 'inherit',
    boxSizing: 'border-box',
  }

  if (isSelect) return (
    <select name={name} value={value} onChange={onChange}
      onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
      style={{ ...baseStyle, cursor: 'pointer' }}>
      {children}
    </select>
  )

  return (
    <input
      name={name} value={value} onChange={onChange}
      placeholder={placeholder} type={type}
      onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
      style={baseStyle}
    />
  )
}

function CopyButton({ text, id, copied, onCopy, color = '#f97316' }) {
  const active = copied === id
  return (
    <GlassButton
      onClick={() => onCopy(id, text)}
      color={active ? '#22c55e' : color}
      primary={active}
      style={{ padding: '7px 16px', fontSize: '12px', borderRadius: '10px', flexShrink: 0, marginLeft: '12px' }}
    >
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
  const [orbs, setOrbs] = useState([])
  const resultRef = useRef(null)

  // Animated background orbs
  useEffect(() => {
    setOrbs([
      { x: 15, y: 20, size: 400, color: 'rgba(168,85,247,0.25)', dur: 8 },
      { x: 70, y: 60, size: 500, color: 'rgba(249,115,22,0.2)', dur: 11 },
      { x: 40, y: 80, size: 350, color: 'rgba(59,130,246,0.2)', dur: 9 },
      { x: 85, y: 15, size: 300, color: 'rgba(16,185,129,0.18)', dur: 13 },
    ])
  }, [])

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

  const reset = () => {
    setForm({ name: '', category: '', f1: '', f2: '', f3: '' })
    setResult(null)
    setError('')
  }

  const activePlatformData = PLATFORMS.find(p => p.id === activePlatform)

  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0f', fontFamily: "'Inter', -apple-system, sans-serif", position: 'relative', overflowX: 'hidden' }}>

      {/* Animated background orbs */}
      <div style={{ position: 'fixed', inset: 0, zIndex: 0, overflow: 'hidden', pointerEvents: 'none' }}>
        {orbs.map((orb, i) => (
          <div key={i} style={{
            position: 'absolute',
            left: `${orb.x}%`, top: `${orb.y}%`,
            width: orb.size, height: orb.size,
            borderRadius: '50%',
            background: `radial-gradient(circle, ${orb.color}, transparent 70%)`,
            transform: 'translate(-50%, -50%)',
            animation: `float${i} ${orb.dur}s ease-in-out infinite alternate`,
            filter: 'blur(40px)',
          }} />
        ))}
      </div>

      <style>{`
        @keyframes float0 { 0%{transform:translate(-50%,-50%) scale(1)} 100%{transform:translate(-40%,-60%) scale(1.15)} }
        @keyframes float1 { 0%{transform:translate(-50%,-50%) scale(1)} 100%{transform:translate(-60%,-40%) scale(0.9)} }
        @keyframes float2 { 0%{transform:translate(-50%,-50%) scale(1)} 100%{transform:translate(-45%,-55%) scale(1.1)} }
        @keyframes float3 { 0%{transform:translate(-50%,-50%) scale(1)} 100%{transform:translate(-55%,-45%) scale(1.05)} }
        @keyframes shimmer { 0%{opacity:0.5} 50%{opacity:1} 100%{opacity:0.5} }
        @keyframes spin { 0%{transform:rotate(0deg)} 100%{transform:rotate(360deg)} }
        @keyframes fadeUp { 0%{opacity:0;transform:translateY(24px)} 100%{opacity:1;transform:translateY(0)} }
        input::placeholder, select::placeholder { color: rgba(255,255,255,0.25); }
        select option { background: #1a1a2e; color: white; }
        * { box-sizing: border-box; }
      `}</style>

      {/* NAV */}
      <nav style={{
        position: 'sticky', top: 0, zIndex: 100,
        padding: '0 24px', height: '64px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        background: 'rgba(10,10,15,0.7)',
        backdropFilter: 'blur(30px)',
        WebkitBackdropFilter: 'blur(30px)',
        borderBottom: '1px solid rgba(255,255,255,0.08)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '38px', height: '38px', borderRadius: '12px',
            background: 'linear-gradient(135deg, #f97316, #a855f7)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '18px', boxShadow: '0 4px 12px rgba(249,115,22,0.4)'
          }}>✨</div>
          <span style={{ fontSize: '22px', fontWeight: 900, color: 'white', letterSpacing: '-0.5px' }}>
            Listo<span style={{ background: 'linear-gradient(135deg, #f97316, #a855f7)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>AI</span>
          </span>
          <span style={{
            background: 'rgba(249,115,22,0.15)', color: '#f97316',
            fontSize: '10px', fontWeight: 700, padding: '3px 8px',
            borderRadius: '20px', border: '1px solid rgba(249,115,22,0.3)',
            letterSpacing: '1px'
          }}>BETA</span>
        </div>
        <div style={{
          background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: '20px', padding: '6px 14px',
          fontSize: '12px', color: 'rgba(255,255,255,0.5)', fontWeight: 500
        }}>
          🇮🇳 Indian Sellers ke liye
        </div>
      </nav>

      <div style={{ position: 'relative', zIndex: 1 }}>

        {/* HERO */}
        <section style={{ padding: '80px 24px 90px', textAlign: 'center' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)',
            borderRadius: '50px', padding: '7px 18px', marginBottom: '28px'
          }}>
            <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#22c55e', display: 'inline-block', animation: 'shimmer 2s infinite' }} />
            <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: '13px', fontWeight: 600 }}>
              Meesho • Amazon • Flipkart • All Platforms
            </span>
          </div>

          <h1 style={{
            color: 'white', fontSize: 'clamp(36px, 7vw, 68px)',
            fontWeight: 900, lineHeight: 1.05, marginBottom: '22px',
            letterSpacing: '-2px', animation: 'fadeUp 0.6s ease both'
          }}>
            Perfect Listing<br />
            <span style={{
              background: 'linear-gradient(135deg, #f97316 0%, #a855f7 50%, #3b82f6 100%)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
              display: 'inline-block'
            }}>5 Second Mein</span>
          </h1>

          <p style={{
            color: 'rgba(255,255,255,0.5)', fontSize: '18px',
            maxWidth: '500px', margin: '0 auto 48px', lineHeight: 1.7,
            animation: 'fadeUp 0.6s 0.1s ease both'
          }}>
            Product details daalo — AI instantly title, description aur image prompt bana deta hai.
            English ya Hindi — dono mein.
          </p>

          {/* Stats Row */}
          <div style={{
            display: 'flex', justifyContent: 'center', gap: '8px', flexWrap: 'wrap',
            animation: 'fadeUp 0.6s 0.2s ease both'
          }}>
            {[
              { n: '15L+', l: 'Meesho Sellers' },
              { n: '5 sec', l: 'Generation Time' },
              { n: '4', l: 'Platforms' },
              { n: '2', l: 'Languages' },
            ].map(s => (
              <div key={s.n} style={{
                background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)',
                backdropFilter: 'blur(20px)', borderRadius: '16px',
                padding: '14px 20px', minWidth: '100px'
              }}>
                <div style={{ fontSize: '24px', fontWeight: 900, color: 'white', letterSpacing: '-0.5px' }}>{s.n}</div>
                <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.35)', fontWeight: 500, marginTop: '2px' }}>{s.l}</div>
              </div>
            ))}
          </div>
        </section>

        {/* PLATFORM CARDS */}
        <section style={{ padding: '0 24px 80px' }}>
          <div style={{ maxWidth: '900px', margin: '0 auto' }}>
            <p style={{ textAlign: 'center', color: 'rgba(255,255,255,0.25)', fontSize: '11px', fontWeight: 700, letterSpacing: '3px', textTransform: 'uppercase', marginBottom: '40px' }}>
              SUPPORTED PLATFORMS
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))', gap: '12px' }}>
              {[
                { name: 'Meesho', emoji: '🛍️', color: '#a855f7', users: '15L+ sellers', desc: 'Short punchy descriptions for resellers' },
                { name: 'Amazon', emoji: '📦', color: '#f97316', users: '10L+ sellers', desc: 'SEO-rich detailed product content' },
                { name: 'Flipkart', emoji: '🛒', color: '#3b82f6', users: '5L+ sellers', desc: 'Clear confident product copy' },
                { name: 'All Platforms', emoji: '🌐', color: '#10b981', users: 'Every seller', desc: 'Universal listing for any platform' },
              ].map(p => (
                <GlassCard key={p.name} style={{ padding: '24px 20px', textAlign: 'center' }}>
                  <div style={{
                    width: '52px', height: '52px', borderRadius: '16px', margin: '0 auto 14px',
                    background: `linear-gradient(135deg, ${p.color}30, ${p.color}10)`,
                    border: `1px solid ${p.color}40`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '26px', boxShadow: `0 4px 20px ${p.color}20`
                  }}>{p.emoji}</div>
                  <div style={{ fontWeight: 800, color: 'white', fontSize: '15px', marginBottom: '6px' }}>{p.name}</div>
                  <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.35)', lineHeight: 1.5, marginBottom: '12px' }}>{p.desc}</div>
                  <div style={{
                    fontSize: '11px', fontWeight: 700, color: p.color,
                    background: `${p.color}15`, padding: '4px 12px',
                    borderRadius: '20px', border: `1px solid ${p.color}25`, display: 'inline-block'
                  }}>{p.users}</div>
                </GlassCard>
              ))}
            </div>
          </div>
        </section>

        {/* MAIN TOOL */}
        <section style={{ padding: '0 24px 100px' }}>
          <div style={{ maxWidth: '700px', margin: '0 auto' }}>

            <div style={{ textAlign: 'center', marginBottom: '36px' }}>
              <h2 style={{ color: 'white', fontSize: '32px', fontWeight: 900, letterSpacing: '-0.5px', marginBottom: '8px' }}>
                Abhi Try Karo
              </h2>
              <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '15px' }}>Free hai — koi account nahi chahiye</p>
            </div>

            {/* Language Toggle */}
            <GlassCard style={{ padding: '5px', marginBottom: '16px', display: 'flex', gap: '4px' }}>
              {[
                { key: 'english', label: '🇬🇧 English', sub: 'Wider reach ke liye' },
                { key: 'hindi', label: '🇮🇳 हिंदी', sub: 'Indian sellers ke liye' }
              ].map(l => (
                <button key={l.key} onClick={() => setLang(l.key)} style={{
                  flex: 1, padding: '13px 16px', borderRadius: '20px', border: 'none',
                  background: lang === l.key
                    ? 'linear-gradient(135deg, #f97316, #a855f7)'
                    : 'transparent',
                  color: lang === l.key ? 'white' : 'rgba(255,255,255,0.4)',
                  fontWeight: 700, fontSize: '14px', cursor: 'pointer',
                  fontFamily: 'inherit', transition: 'all 0.25s ease',
                  boxShadow: lang === l.key ? '0 4px 16px rgba(249,115,22,0.3), inset 0 1px 0 rgba(255,255,255,0.2)' : 'none'
                }}>
                  <div>{l.label}</div>
                  <div style={{ fontSize: '10px', fontWeight: 400, opacity: 0.75, marginTop: '2px' }}>{l.sub}</div>
                </button>
              ))}
            </GlassCard>

            {/* Form Card */}
            <GlassCard style={{ padding: '32px 28px' }}>
              <h3 style={{ color: 'white', fontWeight: 800, fontSize: '17px', marginBottom: '24px' }}>
                📦 Product Details
              </h3>

              <label style={lbl}>Product ka Naam *</label>
              <GlassInput name="name" value={form.name} onChange={handleChange}
                placeholder="e.g. Banarasi Silk Saree, Cotton Kurti..." />

              <label style={{ ...lbl, marginTop: '16px' }}>Category *</label>
              <GlassInput name="category" value={form.category} onChange={handleChange} isSelect>
                <option value="">-- Category select karo --</option>
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </GlassInput>

              <label style={{ ...lbl, marginTop: '16px' }}>Product Ki Khasiyat *</label>
              <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.25)', marginBottom: '12px' }}>
                3 cheezein likho jo tumhara product special banati hain
              </p>

              {[
                { name: 'f1', ph: 'Material kya hai? — e.g. Pure cotton, Silk' },
                { name: 'f2', ph: 'Koi khaas quality? — e.g. Washable, Lightweight' },
                { name: 'f3', ph: 'Koi extra benefit? — e.g. Blouse included' },
              ].map((f, i) => (
                <div key={f.name} style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '10px' }}>
                  <div style={{
                    width: '32px', height: '32px', borderRadius: '50%', flexShrink: 0,
                    background: 'linear-gradient(135deg, rgba(249,115,22,0.3), rgba(168,85,247,0.3))',
                    border: '1px solid rgba(249,115,22,0.3)',
                    color: 'white', fontSize: '13px', fontWeight: 800,
                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                  }}>{i + 1}</div>
                  <div style={{ flex: 1 }}>
                    <GlassInput name={f.name} value={form[f.name]} onChange={handleChange} placeholder={f.ph} />
                  </div>
                </div>
              ))}

              {error && (
                <div style={{
                  background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)',
                  borderRadius: '12px', padding: '12px 16px', marginTop: '16px',
                  fontSize: '13px', color: '#fca5a5'
                }}>⚠️ {error}</div>
              )}

              <GlassButton
                onClick={generate}
                disabled={loading}
                primary
                color="#f97316"
                style={{ width: '100%', padding: '16px', fontSize: '16px', borderRadius: '16px', marginTop: '20px', letterSpacing: '0.3px' }}
              >
                {loading ? (
                  <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
                    <span style={{ width: '18px', height: '18px', border: '2px solid rgba(255,255,255,0.3)', borderTop: '2px solid white', borderRadius: '50%', display: 'inline-block', animation: 'spin 0.8s linear infinite' }} />
                    AI Generate kar raha hai...
                  </span>
                ) : `✨ ${lang === 'hindi' ? 'हिंदी में' : 'English में'} Generate Karo`}
              </GlassButton>
            </GlassCard>

            {/* RESULTS */}
            {result && (
              <div ref={resultRef} style={{ marginTop: '20px', animation: 'fadeUp 0.4s ease both' }}>

                {/* Success */}
                <div style={{
                  background: 'linear-gradient(135deg, rgba(34,197,94,0.12), rgba(16,185,129,0.08))',
                  border: '1px solid rgba(34,197,94,0.25)', borderRadius: '16px',
                  padding: '14px 20px', marginBottom: '16px',
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between'
                }}>
                  <span style={{ color: '#86efac', fontWeight: 700, fontSize: '14px' }}>
                    ✅ Listing ready hai!
                  </span>
                  <GlassButton onClick={reset} style={{ padding: '6px 14px', fontSize: '12px', borderRadius: '10px' }}>
                    🔄 Nayi Listing
                  </GlassButton>
                </div>

                {/* Title */}
                <GlassCard style={{ padding: '20px', marginBottom: '12px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '13px', color: 'white' }}>🏷️ SEO Title</div>
                      <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.3)', marginTop: '2px' }}>Har platform ke liye</div>
                    </div>
                    <CopyButton text={result.title} id="title" copied={copied} onCopy={copy} />
                  </div>
                  <p style={{ margin: 0, fontSize: '15px', color: 'white', fontWeight: 700, lineHeight: 1.5 }}>{result.title}</p>
                </GlassCard>

                {/* Platform selector */}
                <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '11px', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '10px' }}>
                  Platform Choose Karo
                </p>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: '8px', marginBottom: '12px' }}>
                  {PLATFORMS.map(p => (
                    <GlassButton
                      key={p.id}
                      onClick={() => setActivePlatform(p.id)}
                      primary={activePlatform === p.id}
                      color={p.color}
                      style={{ padding: '12px', fontSize: '13px', borderRadius: '14px' }}
                    >
                      {p.emoji} {p.name}
                    </GlassButton>
                  ))}
                </div>

                {/* Active Platform Description */}
                {activePlatformData && (
                  <GlassCard
                    glow
                    glowColor={activePlatformData.color + '30'}
                    style={{ padding: '22px', marginBottom: '12px' }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                      <div>
                        <div style={{ fontWeight: 700, fontSize: '14px', color: 'white' }}>
                          {activePlatformData.emoji} {activePlatformData.name} Description
                        </div>
                        <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.3)', marginTop: '2px' }}>{activePlatformData.hint}</div>
                      </div>
                      <CopyButton
                        text={result[activePlatformData.descKey] || result.short}
                        id={activePlatform}
                        copied={copied}
                        onCopy={copy}
                        color={activePlatformData.color}
                      />
                    </div>
                    <p style={{ margin: 0, fontSize: '14px', color: 'rgba(255,255,255,0.75)', lineHeight: 1.85 }}>
                      {result[activePlatformData.descKey] || result.short}
                    </p>
                  </GlassCard>
                )}

                {/* Image Prompt */}
                <GlassCard style={{ padding: '22px', border: '1px solid rgba(168,85,247,0.25)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '14px', color: 'white' }}>🎨 AI Image Prompt</div>
                      <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.3)', marginTop: '2px' }}>Free image tools mein paste karo</div>
                    </div>
                    <CopyButton text={result.imagePrompt} id="img" copied={copied} onCopy={copy} color="#a855f7" />
                  </div>
                  <p style={{ margin: '0 0 16px', fontSize: '13px', color: 'rgba(255,255,255,0.4)', lineHeight: 1.7, fontStyle: 'italic' }}>
                    {result.imagePrompt}
                  </p>
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    {[
                      { name: 'Bing Image Creator', url: 'https://www.bing.com/images/create' },
                      { name: 'Leonardo AI', url: 'https://app.leonardo.ai' },
                      { name: 'Adobe Firefly', url: 'https://firefly.adobe.com' },
                    ].map(t => (
                      <a key={t.name} href={t.url} target="_blank" rel="noopener noreferrer" style={{
                        background: 'rgba(168,85,247,0.12)', color: '#c084fc',
                        padding: '5px 12px', borderRadius: '8px', fontSize: '12px',
                        fontWeight: 600, textDecoration: 'none',
                        border: '1px solid rgba(168,85,247,0.2)',
                        transition: 'all 0.15s'
                      }}>↗ {t.name}</a>
                    ))}
                  </div>
                </GlassCard>

                <GlassButton onClick={generate} disabled={loading} style={{ width: '100%', padding: '14px', fontSize: '14px', borderRadius: '14px', marginTop: '12px' }}>
                  🔄 Dobara Generate Karo
                </GlassButton>
              </div>
            )}
          </div>
        </section>

        {/* HOW IT WORKS */}
        <section style={{ padding: '80px 24px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
          <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
            <p style={{ color: 'rgba(255,255,255,0.25)', fontSize: '11px', fontWeight: 700, letterSpacing: '3px', textTransform: 'uppercase', marginBottom: '12px' }}>HOW IT WORKS</p>
            <h2 style={{ color: 'white', fontSize: '30px', fontWeight: 900, letterSpacing: '-0.5px', marginBottom: '48px' }}>3 Steps Mein Done</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
              {[
                { step: '01', icon: '📦', title: 'Details Daalo', desc: 'Naam, category, aur 3 features — bas itna kaafi hai' },
                { step: '02', icon: '🤖', title: 'AI Generate Karta Hai', desc: 'Gemini AI 5 second mein 4 platforms ke liye listing banata hai' },
                { step: '03', icon: '📋', title: 'Copy & Paste Karo', desc: 'Platform choose karo, copy karo, Meesho/Amazon pe paste karo' },
              ].map(s => (
                <GlassCard key={s.step} style={{ padding: '28px 22px', textAlign: 'left' }}>
                  <div style={{ fontSize: '11px', fontWeight: 800, color: '#f97316', letterSpacing: '2px', marginBottom: '16px' }}>STEP {s.step}</div>
                  <div style={{ fontSize: '34px', marginBottom: '14px' }}>{s.icon}</div>
                  <div style={{ fontWeight: 800, color: 'white', fontSize: '15px', marginBottom: '8px' }}>{s.title}</div>
                  <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.4)', lineHeight: 1.6 }}>{s.desc}</div>
                </GlassCard>
              ))}
            </div>
          </div>
        </section>

        {/* FOOTER */}
        <footer style={{ borderTop: '1px solid rgba(255,255,255,0.06)', padding: '32px 24px', textAlign: 'center' }}>
          <div style={{ marginBottom: '10px' }}>
            <span style={{ fontSize: '20px', fontWeight: 900, color: 'white' }}>
              Listo<span style={{ background: 'linear-gradient(135deg, #f97316, #a855f7)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>AI</span>
            </span>
          </div>
          <p style={{ color: 'rgba(255,255,255,0.2)', fontSize: '13px', margin: 0 }}>
            Made with ❤️ for Indian Sellers · v1.0 · © 2026 ListoAI
          </p>
        </footer>
      </div>
    </div>
  )
}

const lbl = {
  display: 'block', fontSize: '13px', fontWeight: 600,
  color: 'rgba(255,255,255,0.5)', marginBottom: '8px'
}
