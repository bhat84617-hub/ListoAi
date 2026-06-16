import { useState, useEffect, useRef } from 'react'
import { supabase } from './supabase'
import Auth from './Auth'

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
      background: 'rgba(255,255,255,0.45)', backdropFilter: 'blur(30px)',
      WebkitBackdropFilter: 'blur(30px)', border: '1px solid rgba(255,255,255,0.75)',
      borderRadius: '24px',
      boxShadow: glowColor
        ? `0 8px 32px rgba(0,0,0,0.08), inset 0 1px 0 rgba(255,255,255,0.9), 0 0 30px ${glowColor}`
        : '0 8px 32px rgba(0,0,0,0.08), inset 0 1px 0 rgba(255,255,255,0.9)',
      ...style
    }}>{children}</div>
  )
}

function GlassButton({ children, onClick, disabled, primary, color = '#a855f7', style = {} }) {
  const [pressed, setPressed] = useState(false)
  const [hovered, setHovered] = useState(false)
  return (
    <button onClick={onClick} disabled={disabled}
      onMouseEnter={() => setHovered(true)} onMouseLeave={() => { setHovered(false); setPressed(false) }}
      onMouseDown={() => setPressed(true)} onMouseUp={() => setPressed(false)}
      onTouchStart={() => setPressed(true)} onTouchEnd={() => setPressed(false)}
      style={{
        background: disabled ? 'rgba(255,255,255,0.3)' : primary ? `linear-gradient(135deg, ${color}, ${color}bb)` : 'rgba(255,255,255,0.5)',
        backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
        border: primary ? `1px solid ${color}60` : '1px solid rgba(255,255,255,0.8)',
        borderRadius: '16px', color: disabled ? 'rgba(0,0,0,0.2)' : primary ? 'white' : '#1a1a2e',
        fontWeight: 700, cursor: disabled ? 'not-allowed' : 'pointer', fontFamily: 'inherit',
        boxShadow: pressed ? 'inset 0 2px 8px rgba(0,0,0,0.15)'
          : hovered && !disabled ? primary ? `0 8px 24px ${color}50` : '0 8px 20px rgba(0,0,0,0.12)'
          : primary ? `0 4px 16px ${color}30` : '0 4px 12px rgba(0,0,0,0.06)',
        transform: pressed ? 'scale(0.97)' : hovered && !disabled ? 'scale(1.02)' : 'scale(1)',
        transition: 'all 0.15s cubic-bezier(0.34,1.56,0.64,1)', ...style
      }}>{children}</button>
  )
}

function GlassInput({ name, value, onChange, placeholder, isSelect, children }) {
  const [focused, setFocused] = useState(false)
  const s = {
    width: '100%', padding: '13px 18px', borderRadius: '16px',
    background: focused ? 'rgba(255,255,255,0.7)' : 'rgba(255,255,255,0.45)',
    backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
    border: focused ? '1px solid rgba(168,85,247,0.5)' : '1px solid rgba(255,255,255,0.8)',
    color: '#1a1a2e', fontSize: '14px', outline: 'none',
    boxShadow: focused ? '0 0 0 3px rgba(168,85,247,0.1)' : 'inset 0 2px 4px rgba(0,0,0,0.04)',
    transition: 'all 0.2s', fontFamily: 'inherit', boxSizing: 'border-box',
  }
  if (isSelect) return (
    <select name={name} value={value} onChange={onChange}
      onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
      style={{ ...s, cursor: 'pointer' }}>{children}</select>
  )
  return <input name={name} value={value} onChange={onChange} placeholder={placeholder}
    onFocus={() => setFocused(true)} onBlur={() => setFocused(false)} style={s} />
}

export default function App() {
  const [session, setSession] = useState(null)
  const [userData, setUserData] = useState(null)
  const [authLoading, setAuthLoading] = useState(true)
  const [form, setForm] = useState({ name: '', category: '', f1: '', f2: '', f3: '' })
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [copied, setCopied] = useState('')
  const [lang, setLang] = useState('english')
  const [activePlatform, setActivePlatform] = useState('meesho')
  const [showPricing, setShowPricing] = useState(false)
  const [payLoading, setPayLoading] = useState(false)
  const resultRef = useRef(null)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      if (session) fetchUserData(session.access_token)
      else setAuthLoading(false)
    })
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
      if (session) fetchUserData(session.access_token)
      else { setUserData(null); setAuthLoading(false) }
    })
    return () => subscription.unsubscribe()
  }, [])

  const fetchUserData = async (token) => {
    try {
      const res = await fetch('/api/user', { headers: { Authorization: `Bearer ${token}` } })
      const data = await res.json()
      setUserData(data)
    } catch (e) { console.error(e) }
    setAuthLoading(false)
  }

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const generate = async () => {
    if (!form.name.trim() || !form.category || !form.f1.trim()) {
      setError('Product name, category aur pehla feature zaroori hai.'); return
    }
    setError(''); setLoading(true); setResult(null)

    // Check limit
    const checkRes = await fetch('/api/user', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${session.access_token}` },
      body: JSON.stringify({ action: 'increment' })
    })
    const checkData = await checkRes.json()

    if (checkData.limit) {
      setError('Free limit khatam ho gayi — Pro plan lo unlimited ke liye.')
      setShowPricing(true); setLoading(false); return
    }

    setUserData(checkData)
    const features = [form.f1, form.f2, form.f3].filter(Boolean).join(', ')
    const langInstruction = lang === 'hindi' ? 'Write ALL descriptions in Hindi using Devanagari script.' : 'Write ALL descriptions in English.'

    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: form.name, category: form.category, features, lang: langInstruction })
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Something went wrong')
      setResult(data); setActivePlatform('meesho')
      setTimeout(() => resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100)
    } catch (err) { setError(err.message || 'Kuch gadbad ho gayi.') }
    setLoading(false)
  }

  const startPayment = async () => {
    setPayLoading(true)
    try {
      const res = await fetch('/api/payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${session.access_token}` },
        body: JSON.stringify({ action: 'create_order' })
      })
      const order = await res.json()
      if (!res.ok) throw new Error(order.error)

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency,
        name: 'ListoAI',
        description: 'Pro Plan - Unlimited Generations',
        order_id: order.order_id,
        handler: async (response) => {
          const verifyRes = await fetch('/api/payment', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${session.access_token}` },
            body: JSON.stringify({ action: 'verify_payment', ...response })
          })
          const verifyData = await verifyRes.json()
          if (verifyData.success) {
            await fetchUserData(session.access_token)
            setShowPricing(false)
            alert('🎉 Pro plan activate ho gaya! Ab unlimited generations karo.')
          }
        },
        prefill: { email: session.user.email },
        theme: { color: '#a855f7' }
      }
      const rzp = new window.Razorpay(options)
      rzp.open()
    } catch (err) { alert('Payment error: ' + err.message) }
    setPayLoading(false)
  }

  const copy = (key, text) => {
    navigator.clipboard.writeText(text)
    setCopied(key); setTimeout(() => setCopied(''), 2000)
  }

  const reset = () => { setForm({ name: '', category: '', f1: '', f2: '', f3: '' }); setResult(null); setError('') }
  const activePlatformData = PLATFORMS.find(p => p.id === activePlatform)
  const isPro = userData?.plan === 'pro'
  const genLeft = isPro ? '∞' : Math.max(0, 5 - (userData?.generations_used || 0))

  if (authLoading) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #f0e8ff, #e8f4ff, #fff0f8)' }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ width: '40px', height: '40px', border: '3px solid rgba(168,85,247,0.2)', borderTop: '3px solid #a855f7', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 12px' }} />
        <p style={{ color: '#888', fontSize: '14px' }}>Loading...</p>
      </div>
      <style>{`@keyframes spin{0%{transform:rotate(0deg)}100%{transform:rotate(360deg)}}`}</style>
    </div>
  )

  if (!session) return <Auth />

  return (
    <div style={{ minHeight: '100vh', fontFamily: "'Inter', sans-serif", position: 'relative', overflowX: 'hidden' }}>
      <style>{`
        *{box-sizing:border-box;margin:0;padding:0;}
        @keyframes floatOrb1{0%{transform:translate(0,0) scale(1)}50%{transform:translate(30px,-40px) scale(1.1)}100%{transform:translate(-20px,20px) scale(0.95)}}
        @keyframes floatOrb2{0%{transform:translate(0,0)}50%{transform:translate(-40px,30px) scale(1.05)}100%{transform:translate(25px,-25px)}}
        @keyframes floatOrb3{0%{transform:translate(0,0)}50%{transform:translate(20px,40px) scale(0.92)}100%{transform:translate(-30px,-20px)}}
        @keyframes floatOrb4{0%{transform:translate(0,0)}50%{transform:translate(-25px,-35px) scale(1.08)}100%{transform:translate(35px,15px)}}
        @keyframes spin{0%{transform:rotate(0deg)}100%{transform:rotate(360deg)}}
        @keyframes fadeUp{0%{opacity:0;transform:translateY(20px)}100%{opacity:1;transform:translateY(0)}}
        @keyframes pulse{0%,100%{opacity:1}50%{opacity:0.4}}
        input::placeholder{color:rgba(100,100,120,0.4);}
        select option{background:white;color:#1a1a2e;}
      `}</style>

      {/* Razorpay Script */}
      <script src="https://checkout.razorpay.com/v1/checkout.js" />

      {/* Background */}
      <div style={{ position: 'fixed', inset: 0, zIndex: 0, overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, #f0e8ff 0%, #e8f4ff 35%, #fff0f8 65%, #e8fff4 100%)' }} />
        <div style={{ position:'absolute', width:'500px', height:'500px', borderRadius:'50%', left:'5%', top:'5%', background:'radial-gradient(circle, rgba(168,85,247,0.35), transparent 70%)', filter:'blur(60px)', animation:'floatOrb1 12s ease-in-out infinite' }} />
        <div style={{ position:'absolute', width:'600px', height:'600px', borderRadius:'50%', right:'0%', top:'20%', background:'radial-gradient(circle, rgba(56,189,248,0.3), transparent 70%)', filter:'blur(70px)', animation:'floatOrb2 15s ease-in-out infinite' }} />
        <div style={{ position:'absolute', width:'450px', height:'450px', borderRadius:'50%', left:'30%', bottom:'5%', background:'radial-gradient(circle, rgba(249,115,22,0.25), transparent 70%)', filter:'blur(60px)', animation:'floatOrb3 10s ease-in-out infinite' }} />
        <div style={{ position:'absolute', width:'400px', height:'400px', borderRadius:'50%', right:'20%', bottom:'30%', background:'radial-gradient(circle, rgba(16,185,129,0.25), transparent 70%)', filter:'blur(55px)', animation:'floatOrb4 13s ease-in-out infinite' }} />
      </div>

      {/* NAV */}
      <nav style={{ position:'sticky', top:0, zIndex:100, padding:'0 20px', height:'60px', display:'flex', alignItems:'center', justifyContent:'space-between', background:'rgba(255,255,255,0.4)', backdropFilter:'blur(30px)', WebkitBackdropFilter:'blur(30px)', borderBottom:'1px solid rgba(255,255,255,0.7)', boxShadow:'0 2px 20px rgba(0,0,0,0.06)' }}>
        <div style={{ display:'flex', alignItems:'center', gap:'8px' }}>
          <div style={{ width:'34px', height:'34px', borderRadius:'10px', background:'linear-gradient(135deg, #f97316, #a855f7)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'16px' }}>✨</div>
          <span style={{ fontSize:'20px', fontWeight:900, color:'#1a1a2e', letterSpacing:'-0.5px' }}>
            Listo<span style={{ background:'linear-gradient(135deg, #f97316, #a855f7)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>AI</span>
          </span>
        </div>
        <div style={{ display:'flex', alignItems:'center', gap:'8px' }}>
          {/* Gen counter */}
          <div style={{ background:'rgba(255,255,255,0.6)', border:'1px solid rgba(255,255,255,0.8)', borderRadius:'12px', padding:'5px 12px', fontSize:'12px', fontWeight:700, color: isPro ? '#a855f7' : genLeft === 0 ? '#ef4444' : '#1a1a2e' }}>
            {isPro ? '⚡ Pro' : `${genLeft}/5 free`}
          </div>
          {!isPro && (
            <GlassButton onClick={() => setShowPricing(true)} primary color="#a855f7" style={{ padding:'6px 14px', fontSize:'12px', borderRadius:'10px' }}>
              Upgrade
            </GlassButton>
          )}
          <GlassButton onClick={() => supabase.auth.signOut()} style={{ padding:'6px 12px', fontSize:'12px', borderRadius:'10px' }}>
            Logout
          </GlassButton>
        </div>
      </nav>

      <div style={{ position:'relative', zIndex:1 }}>

        {/* HERO */}
        <section style={{ padding:'60px 24px 50px', textAlign:'center' }}>
          <div style={{ display:'inline-flex', alignItems:'center', gap:'8px', background:'rgba(255,255,255,0.5)', border:'1px solid rgba(255,255,255,0.8)', backdropFilter:'blur(20px)', borderRadius:'50px', padding:'6px 16px', marginBottom:'20px', boxShadow:'0 4px 16px rgba(0,0,0,0.06)' }}>
            <span style={{ width:'6px', height:'6px', borderRadius:'50%', background:'#22c55e', display:'inline-block', animation:'pulse 2s infinite' }} />
            <span style={{ color:'#444', fontSize:'12px', fontWeight:600 }}>Meesho • Amazon • Flipkart • All Platforms</span>
          </div>
          <h1 style={{ color:'#1a1a2e', fontSize:'clamp(32px, 7vw, 60px)', fontWeight:900, lineHeight:1.05, marginBottom:'16px', letterSpacing:'-2px' }}>
            Perfect Listing<br />
            <span style={{ background:'linear-gradient(135deg, #f97316 0%, #a855f7 50%, #3b82f6 100%)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>5 Second Mein</span>
          </h1>
          <p style={{ color:'#666', fontSize:'16px', maxWidth:'440px', margin:'0 auto 32px', lineHeight:1.7 }}>
            Product details daalo — AI instantly title, description aur image prompt banata hai. English ya Hindi — dono mein.
          </p>

          {/* User greeting */}
          <div style={{ display:'inline-block', background:'rgba(255,255,255,0.5)', border:'1px solid rgba(255,255,255,0.8)', borderRadius:'16px', padding:'10px 20px', marginBottom:'0' }}>
            <span style={{ fontSize:'13px', color:'#666' }}>
              👋 Welcome, <strong style={{ color:'#1a1a2e' }}>{userData?.name || session?.user?.email?.split('@')[0]}</strong>
              {isPro ? <span style={{ marginLeft:'8px', color:'#a855f7', fontWeight:700 }}>⚡ Pro</span>
                : <span style={{ marginLeft:'8px', color:'#888' }}>· {genLeft} generations baaki</span>}
            </span>
          </div>
        </section>

        {/* TOOL */}
        <section style={{ padding:'0 24px 80px' }}>
          <div style={{ maxWidth:'660px', margin:'0 auto' }}>

            {/* Lang Toggle */}
            <GlassCard style={{ padding:'4px', marginBottom:'14px', display:'flex', gap:'4px' }}>
              {[
                { key:'english', label:'🇬🇧 English', sub:'Wider reach' },
                { key:'hindi', label:'🇮🇳 हिंदी', sub:'Indian sellers' }
              ].map(l => (
                <button key={l.key} onClick={() => setLang(l.key)} style={{
                  flex:1, padding:'11px 14px', borderRadius:'20px', border:'none',
                  background: lang === l.key ? 'linear-gradient(135deg, #f97316, #a855f7)' : 'transparent',
                  color: lang === l.key ? 'white' : '#888',
                  fontWeight:700, fontSize:'13px', cursor:'pointer', fontFamily:'inherit',
                  transition:'all 0.25s cubic-bezier(0.34,1.56,0.64,1)',
                  boxShadow: lang === l.key ? '0 4px 12px rgba(168,85,247,0.3)' : 'none'
                }}>
                  <div>{l.label}</div>
                  <div style={{ fontSize:'10px', fontWeight:400, opacity:0.8, marginTop:'1px' }}>{l.sub}</div>
                </button>
              ))}
            </GlassCard>

            {/* Form */}
            <GlassCard style={{ padding:'28px 24px' }}>
              <h3 style={{ color:'#1a1a2e', fontWeight:800, fontSize:'16px', marginBottom:'20px' }}>📦 Product Details</h3>

              <label style={lbl}>Product ka Naam *</label>
              <div style={{ marginBottom:'14px' }}><GlassInput name="name" value={form.name} onChange={handleChange} placeholder="e.g. Banarasi Silk Saree, Cotton Kurti..." /></div>

              <label style={lbl}>Category *</label>
              <div style={{ marginBottom:'14px' }}>
                <GlassInput name="category" value={form.category} onChange={handleChange} isSelect>
                  <option value="">-- Category select karo --</option>
                  {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </GlassInput>
              </div>

              <label style={lbl}>Product Ki Khasiyat *</label>
              <p style={{ fontSize:'12px', color:'#aaa', marginBottom:'10px' }}>3 cheezein likho jo tumhara product special banati hain</p>

              {[
                { name:'f1', ph:'Material kya hai? — e.g. Pure cotton, Silk' },
                { name:'f2', ph:'Koi khaas quality? — e.g. Washable, Lightweight' },
                { name:'f3', ph:'Koi extra benefit? — e.g. Blouse included' },
              ].map((f, i) => (
                <div key={f.name} style={{ display:'flex', alignItems:'center', gap:'10px', marginBottom:'10px' }}>
                  <div style={{ width:'28px', height:'28px', borderRadius:'50%', flexShrink:0, background:'linear-gradient(135deg, rgba(249,115,22,0.2), rgba(168,85,247,0.2))', border:'1px solid rgba(168,85,247,0.3)', color:'#a855f7', fontSize:'12px', fontWeight:800, display:'flex', alignItems:'center', justifyContent:'center' }}>{i+1}</div>
                  <div style={{ flex:1 }}><GlassInput name={f.name} value={form[f.name]} onChange={handleChange} placeholder={f.ph} /></div>
                </div>
              ))}

              {error && <div style={{ background:'rgba(239,68,68,0.08)', border:'1px solid rgba(239,68,68,0.2)', borderRadius:'10px', padding:'10px 14px', marginTop:'12px', fontSize:'13px', color:'#ef4444' }}>⚠️ {error} {error.includes('limit') && <button onClick={() => setShowPricing(true)} style={{ background:'none', border:'none', color:'#a855f7', fontWeight:700, cursor:'pointer', fontSize:'13px', fontFamily:'inherit' }}>Pro lo →</button>}</div>}

              <GlassButton onClick={generate} disabled={loading || genLeft === 0 && !isPro} primary color="#a855f7"
                style={{ width:'100%', padding:'14px', fontSize:'15px', borderRadius:'14px', marginTop:'16px' }}>
                {loading ? (
                  <span style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:'8px' }}>
                    <span style={{ width:'16px', height:'16px', border:'2px solid rgba(255,255,255,0.3)', borderTop:'2px solid white', borderRadius:'50%', display:'inline-block', animation:'spin 0.8s linear infinite' }} />
                    AI Generate kar raha hai...
                  </span>
                ) : genLeft === 0 && !isPro ? '🔒 Limit Khatam — Pro Lo' : `✨ ${lang === 'hindi' ? 'हिंदी में' : 'English में'} Generate Karo`}
              </GlassButton>

              {!isPro && (
                <p style={{ textAlign:'center', fontSize:'12px', color:'#aaa', marginTop:'10px' }}>
                  {genLeft} generations baaki · <button onClick={() => setShowPricing(true)} style={{ background:'none', border:'none', color:'#a855f7', fontWeight:700, cursor:'pointer', fontSize:'12px', fontFamily:'inherit' }}>Unlimited ke liye Pro lo ₹99/mo</button>
                </p>
              )}
            </GlassCard>

            {/* RESULTS */}
            {result && (
              <div ref={resultRef} style={{ marginTop:'14px', animation:'fadeUp 0.4s ease both' }}>
                <div style={{ background:'rgba(34,197,94,0.1)', border:'1px solid rgba(34,197,94,0.25)', backdropFilter:'blur(20px)', borderRadius:'14px', padding:'12px 18px', marginBottom:'12px', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
                  <span style={{ color:'#16a34a', fontWeight:700, fontSize:'13px' }}>✅ Listing ready hai!</span>
                  <GlassButton onClick={reset} style={{ padding:'5px 12px', fontSize:'12px', borderRadius:'8px' }}>🔄 Nayi</GlassButton>
                </div>

                <GlassCard style={{ padding:'18px', marginBottom:'10px' }}>
                  <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:'8px' }}>
                    <div>
                      <div style={{ fontWeight:700, fontSize:'13px', color:'#1a1a2e' }}>🏷️ SEO Title</div>
                      <div style={{ fontSize:'11px', color:'#aaa', marginTop:'2px' }}>Har platform ke liye</div>
                    </div>
                    <GlassButton onClick={() => copy('title', result.title)} primary={copied==='title'} color={copied==='title'?'#22c55e':'#a855f7'} style={{ padding:'5px 12px', fontSize:'11px', borderRadius:'8px', marginLeft:'10px' }}>
                      {copied==='title'?'✓ Copied!':'Copy'}
                    </GlassButton>
                  </div>
                  <p style={{ margin:0, fontSize:'14px', color:'#1a1a2e', fontWeight:700, lineHeight:1.5 }}>{result.title}</p>
                </GlassCard>

                <p style={{ color:'#aaa', fontSize:'11px', fontWeight:700, letterSpacing:'2px', textTransform:'uppercase', marginBottom:'8px' }}>Platform Choose Karo</p>
                <div style={{ display:'grid', gridTemplateColumns:'repeat(2,1fr)', gap:'8px', marginBottom:'10px' }}>
                  {PLATFORMS.map(p => (
                    <GlassButton key={p.id} onClick={() => setActivePlatform(p.id)} primary={activePlatform===p.id} color={p.color} style={{ padding:'11px', fontSize:'13px', borderRadius:'12px' }}>
                      {p.emoji} {p.name}
                    </GlassButton>
                  ))}
                </div>

                {activePlatformData && (
                  <GlassCard glowColor={activePlatformData.color+'20'} style={{ padding:'18px', marginBottom:'10px' }}>
                    <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:'10px' }}>
                      <div>
                        <div style={{ fontWeight:700, fontSize:'13px', color:'#1a1a2e' }}>{activePlatformData.emoji} {activePlatformData.name}</div>
                        <div style={{ fontSize:'11px', color:'#aaa', marginTop:'2px' }}>{activePlatformData.hint}</div>
                      </div>
                      <GlassButton onClick={() => copy(activePlatform, result[activePlatformData.descKey]||result.short)} primary={copied===activePlatform} color={copied===activePlatform?'#22c55e':activePlatformData.color} style={{ padding:'5px 12px', fontSize:'11px', borderRadius:'8px', marginLeft:'10px' }}>
                        {copied===activePlatform?'✓ Copied!':'Copy'}
                      </GlassButton>
                    </div>
                    <p style={{ margin:0, fontSize:'14px', color:'#374151', lineHeight:1.8 }}>{result[activePlatformData.descKey]||result.short}</p>
                  </GlassCard>
                )}

                <GlassCard style={{ padding:'18px', border:'1px solid rgba(168,85,247,0.2)' }}>
                  <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:'10px' }}>
                    <div>
                      <div style={{ fontWeight:700, fontSize:'13px', color:'#1a1a2e' }}>🎨 AI Image Prompt</div>
                      <div style={{ fontSize:'11px', color:'#aaa', marginTop:'2px' }}>Free image tools mein paste karo</div>
                    </div>
                    <GlassButton onClick={() => copy('img', result.imagePrompt)} primary={copied==='img'} color={copied==='img'?'#22c55e':'#a855f7'} style={{ padding:'5px 12px', fontSize:'11px', borderRadius:'8px', marginLeft:'10px' }}>
                      {copied==='img'?'✓ Copied!':'Copy'}
                    </GlassButton>
                  </div>
                  <p style={{ margin:'0 0 12px', fontSize:'12px', color:'#888', lineHeight:1.7, fontStyle:'italic' }}>{result.imagePrompt}</p>
                  <div style={{ display:'flex', gap:'6px', flexWrap:'wrap' }}>
                    {[
                      { name:'Bing Image Creator', url:'https://www.bing.com/images/create' },
                      { name:'Leonardo AI', url:'https://app.leonardo.ai' },
                    ].map(t => (
                      <a key={t.name} href={t.url} target="_blank" rel="noopener noreferrer" style={{ background:'rgba(168,85,247,0.1)', color:'#a855f7', padding:'4px 10px', borderRadius:'8px', fontSize:'11px', fontWeight:600, textDecoration:'none', border:'1px solid rgba(168,85,247,0.2)' }}>↗ {t.name}</a>
                    ))}
                  </div>
                </GlassCard>

                <GlassButton onClick={generate} disabled={loading} style={{ width:'100%', padding:'12px', fontSize:'13px', borderRadius:'12px', marginTop:'10px' }}>
                  🔄 Dobara Generate Karo
                </GlassButton>
              </div>
            )}
          </div>
        </section>

        {/* PRICING MODAL */}
        {showPricing && (
          <div style={{ position:'fixed', inset:0, zIndex:200, display:'flex', alignItems:'center', justifyContent:'center', padding:'24px', background:'rgba(0,0,0,0.3)', backdropFilter:'blur(10px)' }} onClick={() => setShowPricing(false)}>
            <div onClick={e => e.stopPropagation()} style={{ background:'rgba(255,255,255,0.7)', backdropFilter:'blur(40px)', WebkitBackdropFilter:'blur(40px)', border:'1px solid rgba(255,255,255,0.9)', borderRadius:'28px', padding:'32px 28px', maxWidth:'380px', width:'100%', boxShadow:'0 20px 60px rgba(0,0,0,0.15)', animation:'fadeUp 0.3s ease both' }}>
              <div style={{ textAlign:'center', marginBottom:'24px' }}>
                <div style={{ fontSize:'40px', marginBottom:'8px' }}>⚡</div>
                <h2 style={{ color:'#1a1a2e', fontSize:'22px', fontWeight:900, marginBottom:'6px' }}>ListoAI Pro</h2>
                <p style={{ color:'#888', fontSize:'14px' }}>Unlimited generations — no limits</p>
              </div>

              <div style={{ background:'rgba(168,85,247,0.06)', border:'1px solid rgba(168,85,247,0.15)', borderRadius:'16px', padding:'20px', marginBottom:'20px' }}>
                <div style={{ display:'flex', alignItems:'baseline', gap:'4px', marginBottom:'12px' }}>
                  <span style={{ fontSize:'36px', fontWeight:900, color:'#1a1a2e' }}>₹99</span>
                  <span style={{ color:'#888', fontSize:'14px' }}>/month</span>
                  <span style={{ marginLeft:'8px', background:'#fef3c7', color:'#92400e', fontSize:'11px', fontWeight:700, padding:'2px 8px', borderRadius:'20px' }}>Early Bird</span>
                </div>
                {['✅ Unlimited generations', '✅ All 4 platforms', '✅ English + Hindi', '✅ AI Image Prompts', '✅ Priority support'].map(f => (
                  <div key={f} style={{ fontSize:'13px', color:'#555', marginBottom:'6px', fontWeight:500 }}>{f}</div>
                ))}
              </div>

              <div style={{ background:'rgba(0,0,0,0.04)', borderRadius:'12px', padding:'12px', marginBottom:'16px', textAlign:'center' }}>
                <span style={{ fontSize:'13px', color:'#888' }}>Free plan: </span>
                <span style={{ fontSize:'13px', color:'#1a1a2e', fontWeight:700 }}>5 generations/month</span>
              </div>

              <GlassButton onClick={startPayment} disabled={payLoading} primary color="#a855f7"
                style={{ width:'100%', padding:'14px', fontSize:'15px', borderRadius:'14px', marginBottom:'10px' }}>
                {payLoading ? '⏳ Loading...' : '💳 ₹99/month — Abhi Upgrade Karo'}
              </GlassButton>

              <button onClick={() => setShowPricing(false)} style={{ width:'100%', padding:'10px', background:'none', border:'none', color:'#aaa', fontSize:'13px', cursor:'pointer', fontFamily:'inherit' }}>
                Baad mein karta hoon
              </button>
            </div>
          </div>
        )}

        {/* Footer */}
        <footer style={{ borderTop:'1px solid rgba(255,255,255,0.5)', padding:'24px', textAlign:'center', background:'rgba(255,255,255,0.2)', backdropFilter:'blur(20px)' }}>
          <span style={{ fontSize:'16px', fontWeight:900, color:'#1a1a2e' }}>
            Listo<span style={{ background:'linear-gradient(135deg, #f97316, #a855f7)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>AI</span>
          </span>
          <p style={{ color:'#aaa', fontSize:'12px', margin:'4px 0 0' }}>Made with ❤️ for Indian Sellers · v1.0</p>
        </footer>
      </div>
    </div>
  )
}

const lbl = { display:'block', fontSize:'13px', fontWeight:600, color:'#555', marginBottom:'6px' }
