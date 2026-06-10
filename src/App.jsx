import { useState } from 'react'

const CATEGORIES = [
  "Women Clothing", "Men Clothing", "Kids Clothing", "Sarees", "Kurtis",
  "Footwear", "Jewellery", "Home Decor", "Kitchen & Dining", "Electronics",
  "Beauty & Health", "Bags & Accessories", "Sports & Fitness", "Toys & Games", "Other"
]

const HOW_IT_WORKS = [
  { icon: "📦", title: "Product details daalo", desc: "Name, category aur 3 features likhо" },
  { icon: "✨", title: "AI generate karta hai", desc: "Gemini AI teri listing instantly banata hai" },
  { icon: "📋", title: "Copy karo, paste karo", desc: "Meesho ya Amazon pe seedha use karo" },
]

export default function App() {
  const [form, setForm] = useState({ name: '', category: '', f1: '', f2: '', f3: '' })
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [copied, setCopied] = useState('')
  const [activeTab, setActiveTab] = useState('description')

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const generate = async () => {
    if (!form.name.trim() || !form.category || !form.f1.trim()) {
      setError('Product name, category aur kam se kam pehla feature zaroori hai.')
      return
    }
    setError('')
    setLoading(true)
    setResult(null)

    const features = [form.f1, form.f2, form.f3].filter(Boolean).join(', ')

    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: form.name, category: form.category, features })
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Something went wrong')

      setResult(data)
      setActiveTab('description')
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
    setActiveTab('description')
  }

  return (
    <div style={{ minHeight: '100vh', background: '#fff7f3' }}>

      {/* NAV */}
      <nav style={{
        background: 'white',
        borderBottom: '1px solid #ffe5d9',
        padding: '0 24px',
        height: '60px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'sticky',
        top: 0,
        zIndex: 100,
        boxShadow: '0 1px 12px rgba(255,107,53,0.08)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '22px', fontWeight: 900, color: '#1a1a2e', letterSpacing: '-0.5px' }}>
            Listo<span style={{ color: '#ff6b35' }}>AI</span>
          </span>
          <span style={{
            background: '#fff0eb', color: '#ff6b35', fontSize: '10px',
            fontWeight: 700, padding: '2px 8px', borderRadius: '20px', border: '1px solid #ffd5c8'
          }}>BETA</span>
        </div>
        <span style={{ fontSize: '13px', color: '#888', fontWeight: 500 }}>
          🇮🇳 Made for Indian Sellers
        </span>
      </nav>

      {/* HERO */}
      <section style={{
        background: 'linear-gradient(135deg, #ff6b35 0%, #f7931e 55%, #ffcd3c 100%)',
        padding: '56px 24px 64px',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{
          position: 'absolute', top: '-60px', right: '-60px',
          width: '220px', height: '220px', borderRadius: '50%',
          background: 'rgba(255,255,255,0.08)'
        }} />
        <div style={{
          position: 'absolute', bottom: '-40px', left: '-40px',
          width: '160px', height: '160px', borderRadius: '50%',
          background: 'rgba(255,255,255,0.06)'
        }} />

        <div style={{
          display: 'inline-block', background: 'rgba(255,255,255,0.2)',
          backdropFilter: 'blur(10px)', borderRadius: '50px',
          padding: '6px 18px', marginBottom: '20px',
          border: '1px solid rgba(255,255,255,0.3)'
        }}>
          <span style={{ color: 'white', fontSize: '13px', fontWeight: 600 }}>
            🛍️ Meesho & Amazon Sellers ke liye
          </span>
        </div>

        <h1 style={{
          color: 'white', fontSize: 'clamp(28px, 5vw, 48px)',
          fontWeight: 900, lineHeight: 1.15, marginBottom: '16px',
          textShadow: '0 2px 20px rgba(0,0,0,0.15)'
        }}>
          Perfect Product Listing<br />
          <span style={{ color: '#fff3cc' }}>5 Second Mein</span>
        </h1>

        <p style={{
          color: 'rgba(255,255,255,0.9)', fontSize: '16px',
          maxWidth: '480px', margin: '0 auto 32px', lineHeight: 1.6
        }}>
          Product details daalo — AI automatically title, short description,
          aur long description likh deta hai. Seedha Meesho pe paste karo.
        </p>

        <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', flexWrap: 'wrap' }}>
          {['⚡ Instant Generation', '🆓 Free to Use', '🇮🇳 Indian Sellers ke liye'].map(tag => (
            <span key={tag} style={{
              background: 'rgba(255,255,255,0.22)', color: 'white',
              padding: '6px 16px', borderRadius: '20px', fontSize: '13px',
              fontWeight: 600, border: '1px solid rgba(255,255,255,0.3)'
            }}>{tag}</span>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section style={{ padding: '48px 24px', maxWidth: '800px', margin: '0 auto' }}>
        <h2 style={{ textAlign: 'center', fontSize: '22px', fontWeight: 800, color: '#1a1a2e', marginBottom: '32px' }}>
          Kaise Kaam Karta Hai?
        </h2>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '16px'
        }}>
          {HOW_IT_WORKS.map((step, i) => (
            <div key={i} style={{
              background: 'white', borderRadius: '16px', padding: '24px 20px',
              textAlign: 'center', border: '1px solid #ffe5d9',
              boxShadow: '0 4px 20px rgba(255,107,53,0.06)'
            }}>
              <div style={{ fontSize: '36px', marginBottom: '12px' }}>{step.icon}</div>
              <div style={{ fontWeight: 700, fontSize: '14px', color: '#1a1a2e', marginBottom: '6px' }}>{step.title}</div>
              <div style={{ fontSize: '13px', color: '#888', lineHeight: 1.5 }}>{step.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* MAIN FORM */}
      <section style={{ padding: '0 24px 60px', maxWidth: '680px', margin: '0 auto' }}>

        <div style={{
          background: 'white', borderRadius: '24px', padding: '32px 28px',
          boxShadow: '0 8px 40px rgba(255,107,53,0.12)', border: '1px solid #ffe5d9'
        }}>
          <h2 style={{ fontSize: '18px', fontWeight: 800, color: '#1a1a2e', marginBottom: '24px' }}>
            📦 Product Details
          </h2>

          {/* Product Name */}
          <label style={labelStyle}>Product ka Naam *</label>
          <input
            name="name" value={form.name} onChange={handleChange}
            placeholder="e.g. Banarasi Silk Saree, Cotton Kurti, Gold Earrings..."
            style={inputStyle}
          />

          {/* Category */}
          <label style={{ ...labelStyle, marginTop: '16px' }}>Category *</label>
          <select name="category" value={form.category} onChange={handleChange} style={inputStyle}>
            <option value="">-- Category select karo --</option>
            {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>

          {/* Features */}
          <label style={{ ...labelStyle, marginTop: '16px' }}>Product Ki Khasiyat *</label>
          <p style={{ fontSize: '12px', color: '#aaa', marginBottom: '10px', lineHeight: 1.5 }}>
            3 cheezein likho jo tumhara product special banati hain
          </p>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
            <span style={featureNumStyle}>1</span>
            <input name="f1" value={form.f1} onChange={handleChange}
              placeholder="Material kya hai? — e.g. Pure cotton, Silk, Polyester"
              style={{ ...inputStyle, flex: 1 }} />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
            <span style={featureNumStyle}>2</span>
            <input name="f2" value={form.f2} onChange={handleChange}
              placeholder="Koi khaas quality? — e.g. Washable, Stretchable, Lightweight"
              style={{ ...inputStyle, flex: 1 }} />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
            <span style={featureNumStyle}>3</span>
            <input name="f3" value={form.f3} onChange={handleChange}
              placeholder="Koi extra benefit? — e.g. Blouse included, Gift packaging"
              style={{ ...inputStyle, flex: 1 }} />
          </div>

          {/* Error */}
          {error && (
            <div style={{
              background: '#fff3cd', border: '1px solid #ffc107', borderRadius: '10px',
              padding: '10px 14px', marginTop: '16px', fontSize: '13px', color: '#856404'
            }}>⚠️ {error}</div>
          )}

          {/* Generate Button */}
          <button
            onClick={generate}
            disabled={loading}
            style={{
              width: '100%', padding: '15px', borderRadius: '14px',
              background: loading ? '#e5e7eb' : 'linear-gradient(135deg, #ff6b35, #f7931e)',
              color: loading ? '#9ca3af' : 'white', border: 'none',
              fontSize: '16px', fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer',
              boxShadow: loading ? 'none' : '0 6px 20px rgba(255,107,53,0.35)',
              marginTop: '20px', transition: 'all 0.2s', letterSpacing: '0.2px'
            }}
          >
            {loading ? '⏳ Generate ho raha hai...' : '✨ Listing Generate Karo'}
          </button>
        </div>

        {/* RESULTS */}
        {result && (
          <div style={{ marginTop: '24px' }}>

            {/* Success Banner */}
            <div style={{
              background: 'linear-gradient(135deg, #22c55e, #16a34a)',
              borderRadius: '14px', padding: '14px 20px', marginBottom: '16px',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between'
            }}>
              <span style={{ color: 'white', fontWeight: 700, fontSize: '14px' }}>
                ✅ Listing ready hai! Copy karo aur use karo.
              </span>
              <button onClick={reset} style={{
                background: 'rgba(255,255,255,0.2)', color: 'white', border: 'none',
                borderRadius: '8px', padding: '5px 12px', fontSize: '12px',
                cursor: 'pointer', fontWeight: 600
              }}>Nayi Listing</button>
            </div>

            {/* Tabs */}
            <div style={{
              display: 'flex', background: '#1a1a2e',
              borderRadius: '14px', padding: '4px', marginBottom: '16px'
            }}>
              {[
                { key: 'description', label: '📝 Descriptions' },
                { key: 'image', label: '🖼️ Image Prompt' }
              ].map(tab => (
                <button key={tab.key} onClick={() => setActiveTab(tab.key)} style={{
                  flex: 1, padding: '10px', borderRadius: '11px', border: 'none',
                  background: activeTab === tab.key ? 'white' : 'transparent',
                  color: activeTab === tab.key ? '#ff6b35' : 'rgba(255,255,255,0.6)',
                  fontWeight: 700, fontSize: '14px', cursor: 'pointer',
                  transition: 'all 0.2s'
                }}>
                  {tab.label}
                </button>
              ))}
            </div>

            {activeTab === 'description' && (
              <div>
                {[
                  { key: 'title', icon: '🏷️', label: 'SEO Title', hint: 'Meesho/Amazon listing title ke liye' },
                  { key: 'short', icon: '⚡', label: 'Short Description', hint: 'Meesho ke liye best' },
                  { key: 'long', icon: '📝', label: 'Long Description', hint: 'Amazon ke liye best' },
                ].map(item => (
                  <div key={item.key} style={{
                    background: 'white', borderRadius: '16px', padding: '18px 20px',
                    marginBottom: '12px', border: '1px solid #ffe5d9',
                    boxShadow: '0 4px 20px rgba(255,107,53,0.06)'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                      <div>
                        <span style={{ fontWeight: 700, fontSize: '14px', color: '#1a1a2e' }}>
                          {item.icon} {item.label}
                        </span>
                        <div style={{ fontSize: '11px', color: '#aaa', marginTop: '2px' }}>{item.hint}</div>
                      </div>
                      <button onClick={() => copy(item.key, result[item.key])} style={{
                        background: copied === item.key ? '#22c55e' : '#ff6b35',
                        color: 'white', border: 'none', borderRadius: '8px',
                        padding: '6px 14px', fontSize: '12px', cursor: 'pointer',
                        fontWeight: 600, whiteSpace: 'nowrap', marginLeft: '12px',
                        transition: 'background 0.2s'
                      }}>
                        {copied === item.key ? '✓ Copied!' : 'Copy'}
                      </button>
                    </div>
                    <p style={{ margin: 0, fontSize: '14px', color: '#374151', lineHeight: 1.75 }}>
                      {result[item.key]}
                    </p>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'image' && (
              <div style={{
                background: 'white', borderRadius: '16px', padding: '24px 20px',
                border: '1px solid #ffe5d9', boxShadow: '0 4px 20px rgba(255,107,53,0.06)'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                  <div>
                    <span style={{ fontWeight: 700, fontSize: '14px', color: '#1a1a2e' }}>🎨 AI Image Prompt</span>
                    <div style={{ fontSize: '11px', color: '#aaa', marginTop: '2px' }}>
                      Bing Image Creator ya Adobe Firefly mein paste karo — free hai
                    </div>
                  </div>
                  <button onClick={() => copy('imgPrompt', result.imagePrompt)} style={{
                    background: copied === 'imgPrompt' ? '#22c55e' : '#7c3aed',
                    color: 'white', border: 'none', borderRadius: '8px',
                    padding: '6px 14px', fontSize: '12px', cursor: 'pointer',
                    fontWeight: 600, whiteSpace: 'nowrap', marginLeft: '12px'
                  }}>
                    {copied === 'imgPrompt' ? '✓ Copied!' : 'Copy'}
                  </button>
                </div>

                <div style={{
                  background: '#fafafa', borderRadius: '12px', padding: '14px 16px',
                  border: '1.5px dashed #e5e7eb', marginBottom: '20px'
                }}>
                  <p style={{ margin: 0, fontSize: '13px', color: '#555', lineHeight: 1.7, fontStyle: 'italic' }}>
                    {result.imagePrompt}
                  </p>
                </div>

                <p style={{ fontSize: '13px', color: '#888', marginBottom: '12px', fontWeight: 600 }}>
                  Free image tools jahan ye prompt use kar sakte ho:
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {[
                    { name: '🔵 Bing Image Creator', url: 'https://www.bing.com/images/create', desc: 'Microsoft ka free AI image tool' },
                    { name: '🟠 Adobe Firefly', url: 'https://firefly.adobe.com', desc: 'Adobe ka free generative AI' },
                    { name: '🟣 Leonardo AI', url: 'https://app.leonardo.ai', desc: 'Free credits milte hain daily' },
                  ].map(tool => (
                    <a key={tool.name} href={tool.url} target="_blank" rel="noopener noreferrer" style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                      padding: '12px 14px', borderRadius: '10px', background: '#f8f9fa',
                      border: '1px solid #e5e7eb', textDecoration: 'none',
                      transition: 'border-color 0.2s'
                    }}>
                      <div>
                        <div style={{ fontSize: '13px', fontWeight: 700, color: '#1a1a2e' }}>{tool.name}</div>
                        <div style={{ fontSize: '11px', color: '#888' }}>{tool.desc}</div>
                      </div>
                      <span style={{ fontSize: '18px' }}>→</span>
                    </a>
                  ))}
                </div>
              </div>
            )}

            {/* Regenerate */}
            <button onClick={generate} disabled={loading} style={{
              width: '100%', padding: '13px', borderRadius: '14px',
              background: 'white', color: '#ff6b35',
              border: '2px solid #ff6b35', fontSize: '14px', fontWeight: 700,
              cursor: 'pointer', marginTop: '12px', transition: 'all 0.2s'
            }}>
              🔄 Dobara Generate Karo
            </button>
          </div>
        )}
      </section>

      {/* FOOTER */}
      <footer style={{
        background: '#1a1a2e', padding: '24px',
        textAlign: 'center', color: 'rgba(255,255,255,0.4)', fontSize: '13px'
      }}>
        <span style={{ color: 'white', fontWeight: 800 }}>Listo<span style={{ color: '#ff6b35' }}>AI</span></span>
        <span style={{ margin: '0 8px' }}>·</span>
        Made for Indian Sellers
        <span style={{ margin: '0 8px' }}>·</span>
        v1.0
      </footer>
    </div>
  )
}

const labelStyle = {
  display: 'block', fontSize: '13px', fontWeight: 600,
  color: '#374151', marginBottom: '6px'
}

const inputStyle = {
  width: '100%', padding: '12px 14px', borderRadius: '10px',
  border: '1.5px solid #e5e7eb', fontSize: '14px', outline: 'none',
  marginBottom: '0', transition: 'border-color 0.2s', color: '#1a1a2e',
  background: 'white'
}

const featureNumStyle = {
  width: '28px', height: '28px', borderRadius: '50%',
  background: '#fff0eb', color: '#ff6b35', fontSize: '12px',
  fontWeight: 800, display: 'flex', alignItems: 'center',
  justifyContent: 'center', flexShrink: 0
}
