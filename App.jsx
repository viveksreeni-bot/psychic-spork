import React, { useState } from 'react'

export default function App() {
  const [q, setQ] = useState('diapers')
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState(null)
  const [error, setError] = useState(null)

  async function search(e) {
    e?.preventDefault()
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(q)}&stores=mock`)
      if (!res.ok) throw new Error('API error')
      const json = await res.json()
      setData(json)
    } catch (err) {
      setError(err.message || 'Failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ fontFamily: 'system-ui, Arial, sans-serif', padding: 16, maxWidth: 900, margin: '0 auto' }}>
      <h1>🛒 Price Tracker (Starter)</h1>
      <form onSubmit={search} style={{ display:'flex', gap:8, marginBottom: 16 }}>
        <input
          value={q}
          onChange={e => setQ(e.target.value)}
          placeholder="Search for products (e.g., diapers, milk, t-shirt)"
          style={{ flex:1, padding:10, borderRadius:8, border:'1px solid #ccc' }}
        />
        <button type="submit" style={{ padding:'10px 16px', borderRadius:8 }}>Search</button>
      </form>

      {loading && <p>Loading...</p>}
      {error && <p style={{ color:'red' }}>{error}</p>}

      {data && (
        <div>
          <p><b>Query:</b> {data.query} • <b>Items:</b> {data.count}</p>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(240px, 1fr))', gap:12 }}>
            {data.results.map((r, idx) => (
              <a key={idx} href={r.url} target="_blank" rel="noreferrer" style={{ textDecoration:'none', color:'inherit' }}>
                <div style={{ border:'1px solid #eee', borderRadius:12, padding:12 }}>
                  <img src={r.image} alt="" style={{ width:'100%', height:140, objectFit:'cover', borderRadius:8 }} />
                  <div style={{ marginTop:8, fontWeight:600 }}>{r.title}</div>
                  <div>{typeof r.price === 'number' ? `$${r.price.toFixed(2)}` : 'See price'}</div>
                  <div style={{ fontSize:12, color:'#666' }}>{r.storeId?.toUpperCase?.() || 'store'}</div>
                </div>
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
