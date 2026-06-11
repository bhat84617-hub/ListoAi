import { useState } from 'react'

const CATEGORIES = [
  "Women Clothing", "Men Clothing", "Kids Clothing", "Sarees", "Kurtis",
  "Footwear", "Jewellery", "Home Decor", "Kitchen & Dining", "Electronics",
  "Beauty & Health", "Bags & Accessories", "Sports & Fitness", "Toys & Games", "Other"
]

const PLATFORMS = [
  {
    id: 'meesho',
    name: 'Meesho',
    color: '#9333ea',
    bg: '#faf5ff',
    border: '#e9d5ff',
    emoji: '🛍️',
    hint: 'Short & punchy — resellers ke liye',
    descKey: 'short'
  },
  {
    id: 'amazon',
    name: 'Amazon',
    color: '#f97316',
    bg: '#fff7ed',
    border: '#fed7aa',
    emoji: '📦',
    hint: 'Detailed & SEO-friendly',
    descKey: 'long'
  },
  {
    id: 'flipkart',
    name: 'Flipkart',
    color: '#2563eb',
    bg: '#eff6ff',
    border: '#bfdbfe',
    emoji: '🛒',
    hint: 'Clear aur confident',
    descKey: 'flipkart'
  },
  {
    id: 'general',
    name: 'All Platforms',
    color: '#059669',
    bg: '#f0fdf4',
    border: '#bbf7d0',
    emoji: '🌐',
    hint: 'Universal description',
    descKey: 'general'
  }
]

const STATS = [
  { num: '15L+', label: 'Meesho Sellers' },
  { num: '5 sec', label: 'Mein Description' },
  { num: '4', label: 'Platforms Support' },
  { num: '100%', label: 'Free to Use' },
]

export default function App() {
  const [form, setForm] = useState({ name: '', category: '', f1: '', f2: '', f3: '' })
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [copied, setCopied] = useState('')
  const [lang, setLang] = useState('english')
  const [activePlatform, setActivePlatform] = useState('meesho')

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
      ? 'Write ALL descriptions in Hindi language using Devanagari script.'
      : 'Write ALL descriptions in English.'

    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          category: form.category,
          features,
          lang: langInstruction
        })
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Something went wrong')
      setResult(data)
      setActivePlatform('meesho')
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
    <div style={{ minHeight: '100vh', background: '#0f172a', fontFamily: "'Inter', -apple-system, sans-serif" }}>

      {/* NAV */}
      <nav style={{
        background: 'rgba(15,23,42,0.95)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(249,115,22,0.2)',
        padding: '0 24px',
        height: '64px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'sticky',
        top: 0,
        zIndex: 100,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '36px', height: '36px', borderRadius: '10px',
            background: 'linear-gradient(135deg, #f97316, #ef4444)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '18px'
          }}>✨</div>
          <span style={{ fontSize: '22px', fontWeight: 900, color: 'white', letterSpacing: '-0.5px' }}>
            Listo<span style={{ color: '#f97316' }}>AI</span>
          </span>
          <span style={{
            background: 'rgba(249,115,22,0.15)', color: '#f97316',
            fontSize: '10px', fontWeight: 700, padding: '3px 8px',
            borderRadius: '20px', border: '1px solid rgba(249,115,22,0.3)'
          }}>BETA</span>
        </div>
        <span style={{ fontSize: '13px', color: 'rgba(255,255,255,0.5)', fontWeight: 500 }}>
          🇮🇳 Indian Sellers ke liye
        </span>
      </nav>

      {/* HERO */}
      <section style={{
        padding: '72px 24px 80px',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden',
        background: 'linear-gradient(180deg, #0f172a 0%, #1e1b4b 100%)'
      }}>
        {/* Glow blobs */}
        <div style={{
          position: 'absolute', top: '-100px', left: '50%', transform: 'translateX(-50%)',
          width: '600px', height: '400px', borderRadius: '50%',
          background: 'radial-gradient(ellipse, rgba(249,115,22,0.15) 0%, transparent 70%)',
          pointerEvents: 'none'
        }} />

        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: '8px',
          background: 'rgba(249,115,22,0.1)', border: '1px solid rgba(249,115,22,0.25)',
          borderRadius: '50px', padding: '6px 16px', marginBottom: '24px'
        }}>
          <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#22c55e', display: 'inline-block' }}/>
          <span style={{ color: '#f97316', fontSize: '13px', fontWeight: 600 }}>
            Meesho • Amazon • Flipkart • All Platforms
          </span>
        </div>

        <h1 style={{
          color: 'white', fontSize: 'clamp(32px, 6vw, 60px)',
          fontWeight: 900, lineHeight: 1.1, marginBottom: '20px',
          letterSpacing: '-1px'
        }}>
          Perfect Product Listing<br />
          <span style={{
            background: 'linear-gradient(135deg, #f97316, #ef4444)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'
          }}>5 Second Mein</span>
        </h1>

        <p style={{
          color: 'rgba(255,255,255,0.6)', fontSize: '18px',
          maxWidth: '520px', margin: '0 auto 40px', lineHeight: 1.6
        }}>
          Product ka naam aur features daalo — AI instantly
          title, description, aur image prompt bana deta hai.
          English ya Hindi — dono mein.
        </p>

        {/* Stats */}
        <div style={{
          display: 'flex', justifyContent: 'center', gap: '40px',
          flexWrap: 'wrap', marginBottom: '0'
        }}>
          {STATS.map(s => (
            <div key={s.num} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '28px', fontWeight: 900, color: '#f97316' }}>{s.num}</div>
              <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)', fontWeight: 500 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* PLATFORM SHOWCASE */}
      <section style={{
        padding: '64px 24px',
        background: '#0f172a',
        borderTop: '1px solid rgba(255,255,255,0.06)'
      }}>
        <div style={{ maxWidth: '900px', margin: '0 auto', textAlign: 'center' }}>
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '12px', fontWeight: 700, letterSpacing: '2px', marginBottom: '16px', textTransform: 'uppercase' }}>
            Supported Platforms
          </p>
          <h2 style={{ color: 'white', fontSize: '28px', fontWeight: 800, marginBottom: '12px' }}>
            Har Platform ke liye Alag Description
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '15px', marginBottom: '48px' }}>
            Ek baar generate karo — Meesho, Amazon, Flipkart, sab ke liye alag-alag optimized content milega
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px' }}>
            {[
              { name: 'Meesho', emoji: '🛍️', color: '#9333ea', desc: 'Short punchy descriptions for resellers', users: '15L+ sellers' },
              { name: 'Amazon', emoji: '📦', color: '#f97316', desc: 'SEO-rich detailed product content', users: '10L+ sellers' },
              { name: 'Flipkart', emoji: '🛒', color: '#2563eb', desc: 'Clear confident product copy', users: '5L+ sellers' },
              { name: 'All Platforms', emoji: '🌐', color: '#059669', desc: 'Universal listing for any platform', users: 'Every seller' },
            ].map(p => (
              <div key={p.name} style={{
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: '16px', padding: '24px 16px',
                transition: 'all 0.2s',
                cursor: 'default'
              }}>
                <div style={{
                  width: '48px', height: '48px', borderRadius: '14px',
                  background: `${p.color}20`, border: `1px solid ${p.color}40`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '24px', margin: '0 auto 12px'
                }}>{p.emoji}</div>
                <div style={{ fontWeight: 700, color: 'white', fontSize: '15px', marginBottom: '6px' }}>{p.name}</div>
                <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)', lineHeight: 1.5, marginBottom: '10px' }}>{p.desc}</div>
                <div style={{
                  fontSize: '11px', fontWeight: 700, color: p.color,
                  background: `${p.color}15`, padding: '3px 10px',
                  borderRadius: '20px', display: 'inline-block'
                }}>{p.users}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* MAIN TOOL */}
      <section style={{
        padding: '0 24px 80px',
        background: 'linear-gradient(180deg, #0f172a 0%, #0f172a 100%)'
      }}>
        <div style={{ maxWidth: '720px', margin: '0 auto' }}>

          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <h2 style={{ color: 'white', fontSize: '28px', fontWeight: 800, marginBottom: '8px' }}>
              Abhi Try Karo — Free Hai
            </h2>
            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '15px' }}>
              Product details daalo, language chuno, generate karo
            </p>
          </div>

          {/* LANGUAGE TOGGLE */}
          <div style={{
            display: 'flex', background: 'rgba(255,255,255,0.06)',
            borderRadius: '16px', padding: '4px', marginBottom: '20px',
            border: '1px solid rgba(255,255,255,0.08)'
          }}>
            {[
              { key: 'english', label: '🇬🇧 English', sub: 'For wider reach' },
              { key: 'hindi', label: '🇮🇳 हिंदी', sub: 'Indian sellers ke liye' }
            ].map(l => (
              <button key={l.key} onClick={() => setLang(l.key)} style={{
                flex: 1, padding: '12px', borderRadius: '13px', border: 'none',
                background: lang === l.key ? 'linear-gradient(135deg, #f97316, #ef4444)' : 'transparent',
                color: lang === l.key ? 'white' : 'rgba(255,255,255,0.4)',
                fontWeight: 700, fontSize: '14px', cursor: 'pointer',
                transition: 'all 0.2s', fontFamily: 'inherit'
              }}>
                {l.label}
                <div style={{ fontSize: '11px', fontWeight: 400, marginTop: '2px', opacity: 0.8 }}>{l.sub}</div>
              </button>
            ))}
          </div>

          {/* FORM */}
          <div style={{
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: '24px', padding: '32px 28px',
          }}>
            <label style={labelStyle}>Product ka Naam *</label>
            <input name="name" value={form.name} onChange={handleChange}
              placeholder="e.g. Banarasi Silk Saree, Cotton Kurti, Gold Earrings..."
              style={inputStyle} />

            <label style={{ ...labelStyle, marginTop: '18px' }}>Category *</label>
            <select name="category" value={form.category} onChange={handleChange}
              style={{ ...inputStyle, background: '#1e293b', cursor: 'pointer' }}>
              <option value="">-- Category select karo --</option>
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>

            <label style={{ ...labelStyle, marginTop: '18px' }}>Product Ki Khasiyat *</label>
            <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.3)', marginBottom: '12px' }}>
              3 cheezein likho jo tumhara product special banati hain
            </p>

            {[
              { name: 'f1', ph: 'Material kya hai? — e.g. Pure cotton, Silk, Polyester' },
              { name: 'f2', ph: 'Koi khaas quality? — e.g. Washable, Stretchable, Lightweight' },
              { name: 'f3', ph: 'Koi extra benefit? — e.g. Blouse included, Gift packaging' },
            ].map((f, i) => (
              <div key={f.name} style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '10px' }}>
                <span style={{
                  width: '30px', height: '30px', borderRadius: '50%', flexShrink: 0,
                  background: 'rgba(249,115,22,0.15)', border: '1px solid rgba(249,115,22,0.3)',
                  color: '#f97316', fontSize: '12px', fontWeight: 800,
                  display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>{i + 1}</span>
                <input name={f.name} value={form[f.name]} onChange={handleChange}
                  placeholder={f.ph}
                  style={{ ...inputStyle, flex: 1, marginBottom: 0 }} />
              </div>
            ))}

            {error && (
              <div style={{
                background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)',
                borderRadius: '10px', padding: '12px 16px', marginTop: '16px',
                fontSize: '13px', color: '#fca5a5'
              }}>⚠️ {error}</div>
            )}

            <button onClick={generate} disabled={loading} style={{
              width: '100%', padding: '16px', borderRadius: '14px', marginTop: '20px',
              background: loading ? 'rgba(255,255,255,0.06)' : 'linear-gradient(135deg, #f97316, #ef4444)',
              color: loading ? 'rgba(255,255,255,0.3)' : 'white',
              border: 'none', fontSize: '16px', fontWeight: 700,
              cursor: loading ? 'not-allowed' : 'pointer',
              boxShadow: loading ? 'none' : '0 8px 24px rgba(249,115,22,0.35)',
              fontFamily: 'inherit', transition: 'all 0.2s', letterSpacing: '0.3px'
            }}>
              {loading ? '⏳ AI Generate kar raha hai...' : `✨ ${lang === 'hindi' ? 'हिंदी में' : 'English में'} Generate Karo`}
            </button>
          </div>

          {/* RESULTS */}
          {result && (
            <div style={{ marginTop: '24px' }}>

              {/* Success bar */}
              <div style={{
                background: 'linear-gradient(135deg, rgba(34,197,94,0.15), rgba(16,185,129,0.15))',
                border: '1px solid rgba(34,197,94,0.3)',
                borderRadius: '14px', padding: '14px 20px', marginBottom: '20px',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between'
              }}>
                <span style={{ color: '#86efac', fontWeight: 700, fontSize: '14px' }}>
                  ✅ Listing ready hai! Platform choose karo aur copy karo.
                </span>
                <button onClick={reset} style={{
                  background: 'rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.6)',
                  border: 'none', borderRadius: '8px', padding: '5px 12px',
                  fontSize: '12px', cursor: 'pointer', fontWeight: 600, fontFamily: 'inherit'
                }}>Nayi Listing</button>
              </div>

              {/* SEO Title */}
              <div style={{
                background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: '16px', padding: '18px 20px', marginBottom: '16px'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                  <div>
                    <span style={{ fontWeight: 700, fontSize: '13px', color: 'white' }}>🏷️ SEO Title</span>
                    <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.3)', marginTop: '2px' }}>Har platform ke liye best title</div>
                  </div>
                  <button onClick={() => copy('title', result.title)} style={copyBtnStyle(copied === 'title')}>
                    {copied === 'title' ? '✓ Copied!' : 'Copy'}
                  </button>
                </div>
                <p style={{ margin: 0, fontSize: '15px', color: 'rgba(255,255,255,0.85)', lineHeight: 1.6, fontWeight: 600 }}>
                  {result.title}
                </p>
              </div>

              {/* Platform Tabs */}
              <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '12px', fontWeight: 600, marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '1px' }}>
                Platform Description Choose Karo
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px', marginBottom: '16px' }}>
                {PLATFORMS.map(p => (
                  <button key={p.id} onClick={() => setActivePlatform(p.id)} style={{
                    padding: '12px', borderRadius: '12px', border: 'none', cursor: 'pointer',
                    background: activePlatform === p.id ? p.color : 'rgba(255,255,255,0.04)',
                    border: activePlatform === p.id ? `1px solid ${p.color}` : '1px solid rgba(255,255,255,0.08)',
                    color: activePlatform === p.id ? 'white' : 'rgba(255,255,255,0.5)',
                    fontWeight: 700, fontSize: '13px', fontFamily: 'inherit',
                    transition: 'all 0.2s'
                  }}>
                    {p.emoji} {p.name}
                  </button>
                ))}
              </div>

              {/* Active Platform Description */}
              {activePlatformData && (
                <div style={{
                  background: 'rgba(255,255,255,0.04)',
                  border: `1px solid ${activePlatformData.color}40`,
                  borderRadius: '16px', padding: '20px',
                  boxShadow: `0 0 30px ${activePlatformData.color}10`
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                    <div>
                      <span style={{ fontWeight: 700, fontSize: '14px', color: 'white' }}>
                        {activePlatformData.emoji} {activePlatformData.name} Description
                      </span>
                      <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.35)', marginTop: '3px' }}>
                        {activePlatformData.hint}
                      </div>
                    </div>
                    <button
                      onClick={() => copy(activePlatform, result[activePlatformData.descKey] || result.short)}
                      style={copyBtnStyle(copied === activePlatform, activePlatformData.color)}
                    >
                      {copied === activePlatform ? '✓ Copied!' : 'Copy'}
                    </button>
                  </div>
                  <p style={{ margin: 0, fontSize: '14px', color: 'rgba(255,255,255,0.75)', lineHeight: 1.8 }}>
                    {result[activePlatformData.descKey] || result.short}
                  </p>
                </div>
              )}

              {/* Image Prompt */}
              <div style={{
                background: 'rgba(124,58,237,0.08)', border: '1px solid rgba(124,58,237,0.25)',
                borderRadius: '16px', padding: '20px', marginTop: '16px'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                  <div>
                    <span style={{ fontWeight: 700, fontSize: '14px', color: 'white' }}>🎨 AI Image Prompt</span>
                    <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.35)', marginTop: '3px' }}>
                      Bing Image Creator ya Leonardo AI mein paste karo
                    </div>
                  </div>
                  <button onClick={() => copy('img', result.imagePrompt)} style={copyBtnStyle(copied === 'img', '#7c3aed')}>
                    {copied === 'img' ? '✓ Copied!' : 'Copy'}
                  </button>
                </div>
                <p style={{ margin: '0 0 16px 0', fontSize: '13px', color: 'rgba(255,255,255,0.5)', lineHeight: 1.7, fontStyle: 'italic' }}>
                  {result.imagePrompt}
                </p>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {[
                    { name: 'Bing Image Creator', url: 'https://www.bing.com/images/create' },
                    { name: 'Leonardo AI', url: 'https://app.leonardo.ai' },
                    { name: 'Adobe Firefly', url: 'https://firefly.adobe.com' },
                  ].map(t => (
                    <a key={t.name} href={t.url} target="_blank" rel="noopener noreferrer" style={{
                      background: 'rgba(124,58,237,0.15)', color: '#a78bfa',
                      padding: '5px 12px', borderRadius: '8px', fontSize: '12px',
                      fontWeight: 600, textDecoration: 'none', border: '1px solid rgba(124,58,237,0.2)'
                    }}>↗ {t.name}</a>
                  ))}
                </div>
              </div>

              <button onClick={generate} disabled={loading} style={{
                width: '100%', padding: '13px', borderRadius: '14px', marginTop: '16px',
                background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.6)',
                border: '1px solid rgba(255,255,255,0.1)', fontSize: '14px',
                fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit'
              }}>
                🔄 Dobara Generate Karo
              </button>
            </div>
          )}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section style={{
        padding: '80px 24px',
        background: '#070d1a',
        borderTop: '1px solid rgba(255,255,255,0.06)'
      }}>
        <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
          <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '12px', fontWeight: 700, letterSpacing: '2px', marginBottom: '12px', textTransform: 'uppercase' }}>
            Process
          </p>
          <h2 style={{ color: 'white', fontSize: '28px', fontWeight: 800, marginBottom: '48px' }}>
            3 Steps Mein Done
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '24px' }}>
            {[
              { step: '01', icon: '📦', title: 'Product Details Daalo', desc: 'Naam, category, aur 3 features likho — bas itna kaafi hai' },
              { step: '02', icon: '🤖', title: 'AI Generate Karta Hai', desc: 'Gemini AI 5 second mein perfect listing banata hai — 4 platforms ke liye' },
              { step: '03', icon: '📋', title: 'Copy Karo, Paste Karo', desc: 'Apna platform choose karo, description copy karo, listing post karo' },
            ].map(s => (
              <div key={s.step} style={{
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.06)',
                borderRadius: '20px', padding: '28px 20px', textAlign: 'left'
              }}>
                <div style={{ fontSize: '11px', fontWeight: 800, color: '#f97316', letterSpacing: '2px', marginBottom: '16px' }}>
                  STEP {s.step}
                </div>
                <div style={{ fontSize: '32px', marginBottom: '12px' }}>{s.icon}</div>
                <div style={{ fontWeight: 700, color: 'white', fontSize: '15px', marginBottom: '8px' }}>{s.title}</div>
                <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.4)', lineHeight: 1.6 }}>{s.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{
        background: '#070d1a',
        borderTop: '1px solid rgba(255,255,255,0.06)',
        padding: '32px 24px',
        textAlign: 'center'
      }}>
        <div style={{ marginBottom: '12px' }}>
          <span style={{ fontSize: '20px', fontWeight: 900, color: 'white' }}>
            Listo<span style={{ color: '#f97316' }}>AI</span>
          </span>
        </div>
        <p style={{ color: 'rgba(255,255,255,0.25)', fontSize: '13px', margin: 0 }}>
          Made with ❤️ for Indian Sellers · v1.0 · © 2026 ListoAI
        </p>
      </footer>
    </div>
  )
}

const labelStyle = {
  display: 'block', fontSize: '13px', fontWeight: 600,
  color: 'rgba(255,255,255,0.6)', marginBottom: '8px'
}

const inputStyle = {
  width: '100%', padding: '13px 16px', borderRadius: '12px',
  border: '1px solid rgba(255,255,255,0.1)', fontSize: '14px',
  outline: 'none', color: 'white', background: '#1e293b',
  marginBottom: '0', transition: 'border-color 0.2s',
  boxSizing: 'border-box'
}

const copyBtnStyle = (active, color = '#f97316') => ({
  background: active ? '#22c55e' : `${color}20`,
  color: active ? 'white' : color,
  border: `1px solid ${active ? '#22c55e' : color}40`,
  borderRadius: '8px', padding: '6px 14px', fontSize: '12px',
  cursor: 'pointer', fontWeight: 700, whiteSpace: 'nowrap',
  marginLeft: '12px', transition: 'all 0.2s', fontFamily: 'inherit'
})
