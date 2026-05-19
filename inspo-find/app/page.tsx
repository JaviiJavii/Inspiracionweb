'use client'
import { useState, useCallback } from 'react'
import { useLocalStorage } from '@/lib/useLocalStorage'
import { Result, SearchResponse, ViewMode, PreviewSrc, FilterType, FilterPrice, SortMode } from '@/lib/types'
import ResultCard from '@/components/ResultCard'
import DetailModal from '@/components/DetailModal'
import Screenshot from '@/components/Screenshot'

const CHIPS = [
  { label: '📷 Fotógrafo', q: 'portafolio fotógrafo minimalista blanco negro' },
  { label: '🚀 SaaS', q: 'landing page SaaS startup dark mode moderno' },
  { label: '🏛 Arquitectura', q: 'estudio arquitectura editorial lujo minimalista' },
  { label: '✦ Agencia', q: 'agencia creativa bold tipografía grande impactante' },
  { label: '🛍 Ecommerce', q: 'ecommerce moda lujo minimalista premium' },
  { label: '🍽 Restaurante', q: 'restaurante fine dining oscuro elegante' },
  { label: '💻 Dev Portfolio', q: 'developer portfolio dark code aesthetic moderno' },
  { label: '💰 Fintech', q: 'startup fintech app móvil clean dashboard ui' },
]

const LOAD_STEPS = [
  'Analizando intención y estilo...',
  'Identificando categoría y plataformas...',
  'Consultando fuentes de inspiración...',
  'Buscando plantillas y recursos reales...',
  'Evaluando relevancia y calidad...',
  'Generando resultados premium...',
]

export default function Home() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<Result[]>([])
  const [analysis, setAnalysis] = useState('')
  const [keywords, setKeywords] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [loadStep, setLoadStep] = useState(0)
  const [error, setError] = useState('')
  const [view, setView] = useState<ViewMode>('grid')
  const [previewSrc, setPreviewSrc] = useState<PreviewSrc>('microlink')
  const [filterType, setFilterType] = useState<FilterType>('all')
  const [filterPrice, setFilterPrice] = useState<FilterPrice>('all')
  const [sort, setSort] = useState<SortMode>('rel')
  const [detail, setDetail] = useState<Result | null>(null)
  const [activeTab, setActiveTab] = useState<'search' | 'saved' | 'colls'>('search')
  const [saved, setSaved] = useLocalStorage<Result[]>('if_saved', [])
  const [history, setHistory] = useLocalStorage<string[]>('if_hist', [])
  const [colls, setColls] = useLocalStorage<{ name: string; items: Result[] }[]>('if_colls', [
    { name: 'Favoritos', items: [] },
    { name: 'Dark Mode', items: [] },
    { name: 'Referencias', items: [] },
  ])

  const isSaved = (url: string) => saved.some((s) => s.url === url)

  const toggleSave = useCallback((item: Result) => {
    setSaved((prev) =>
      isSaved(item.url) ? prev.filter((s) => s.url !== item.url) : [...prev, { ...item, savedAt: Date.now() }]
    )
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [saved])

  const getFiltered = () => {
    let items = [...results]
    if (filterType !== 'all') items = items.filter((r) => r.type === filterType)
    if (filterPrice !== 'all') items = items.filter((r) => r.price === filterPrice)
    if (sort === 'tpl') items.sort((a) => (a.type === 'template' ? -1 : 1))
    if (sort === 'ins') items.sort((a) => (a.type === 'inspiration' ? -1 : 1))
    if (sort === 'free') items.sort((a) => (a.price === 'free' ? -1 : 1))
    return items
  }

  const doSearch = async (q = query) => {
    if (!q.trim()) return
    setLoading(true)
    setError('')
    setResults([])
    setAnalysis('')
    setKeywords([])
    setLoadStep(0)

    if (!history.includes(q)) setHistory((h) => [q, ...h].slice(0, 8))

    let step = 0
    const iv = setInterval(() => {
      step++
      if (step < LOAD_STEPS.length) setLoadStep(step)
    }, 700)

    try {
      const res = await fetch('/api/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: q }),
      })
      const data: SearchResponse = await res.json()
      if (!res.ok) throw new Error((data as any).error || 'Error en la búsqueda')
      setResults(data.results || [])
      setAnalysis(data.analysis || '')
      setKeywords(data.keywords || [])
    } catch (e: any) {
      setError(e.message || 'Error inesperado')
    } finally {
      clearInterval(iv)
      setLoading(false)
    }
  }

  const filtered = getFiltered()
  const showResults = !loading && !error && results.length > 0
  const showEmpty = !loading && !error && results.length === 0

  return (
    <div className="app">
      {detail && (
        <DetailModal
          item={detail}
          saved={isSaved(detail.url)}
          previewSrc={previewSrc}
          onClose={() => setDetail(null)}
          onSave={() => toggleSave(detail)}
        />
      )}

      {/* TOPBAR */}
      <div className="topbar">
        <div className="brand">
          <div className="brand-icon">✦</div>
          <div>
            <div className="brand-name">inspo<span>.find</span></div>
            <div className="brand-sub">AI-powered web inspiration</div>
          </div>
        </div>
        <div className="topbar-right">
          <div className="preview-toggle">
            <span className="toggle-label">Preview:</span>
            {(['microlink', 'thumbio'] as PreviewSrc[]).map((s) => (
              <button key={s} className={`toggle-btn ${previewSrc === s ? 'on' : ''}`} onClick={() => setPreviewSrc(s)}>
                {s}
              </button>
            ))}
          </div>
          <button className={`icon-btn ${activeTab === 'saved' ? 'active' : ''}`} onClick={() => setActiveTab('saved')}>
            ♥ {saved.length > 0 && <span className="badge">{saved.length}</span>}
          </button>
          <button className="icon-btn" onClick={() => { setResults([]); setQuery(''); setError('') }}>↺</button>
        </div>
      </div>

      {/* TABS */}
      <div className="tabs">
        {(['search', 'saved', 'colls'] as const).map((t) => (
          <div key={t} className={`tab ${activeTab === t ? 'on' : ''}`} onClick={() => setActiveTab(t)}>
            {t === 'search' ? '🔍 Buscar' : t === 'saved' ? '♥ Guardados' : '📁 Colecciones'}
            {t === 'search' && <span className="tab-badge">{results.length}</span>}
            {t === 'saved' && <span className="tab-badge">{saved.length}</span>}
          </div>
        ))}
      </div>

      {/* SEARCH TAB */}
      {activeTab === 'search' && (
        <>
          <div className="search-area">
            <div className="search-row">
              <div className="search-wrap">
                <span className="search-icon">🔍</span>
                <input
                  className="search-input"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && doSearch()}
                  placeholder="Describe el sitio que buscas..."
                />
              </div>
              <button className="search-btn" onClick={() => doSearch()} disabled={loading}>
                ✦ Buscar
              </button>
            </div>
            <div className="chips">
              {CHIPS.map((c) => (
                <div key={c.label} className="chip" onClick={() => { setQuery(c.q); doSearch(c.q) }}>
                  {c.label}
                </div>
              ))}
            </div>
          </div>

          {/* HISTORY */}
          {history.length > 0 && (
            <div className="history-row">
              <span className="hist-label">Recientes:</span>
              {history.map((h) => (
                <div key={h} className="hist-chip" onClick={() => { setQuery(h); doSearch(h) }}>
                  {h}
                </div>
              ))}
            </div>
          )}

          {/* FILTERS */}
          {showResults && (
            <div className="filters">
              <span className="f-label">Tipo:</span>
              {(['all', 'inspiration', 'template', 'tool'] as FilterType[]).map((v) => (
                <button key={v} className={`f-btn ${filterType === v ? 'on' : ''}`} onClick={() => setFilterType(v)}>
                  {v === 'all' ? 'Todo' : v}
                </button>
              ))}
              <div className="f-sep" />
              <span className="f-label">Precio:</span>
              {(['all', 'free', 'freemium', 'paid'] as FilterPrice[]).map((v) => (
                <button key={v} className={`f-btn ${filterPrice === v ? 'on' : ''}`} onClick={() => setFilterPrice(v)}>
                  {v === 'all' ? 'Todo' : v}
                </button>
              ))}
              <div className="view-btns">
                <button className={`v-btn ${view === 'grid' ? 'on' : ''}`} onClick={() => setView('grid')}>⊞</button>
                <button className={`v-btn ${view === 'list' ? 'on' : ''}`} onClick={() => setView('list')}>☰</button>
              </div>
            </div>
          )}

          {/* MAIN */}
          <div className="main">
            {/* LOADING */}
            {loading && (
              <div className="loading-state">
                {LOAD_STEPS.map((s, i) => (
                  <div key={s} className={`load-step ${i < loadStep ? 'done' : i === loadStep ? 'active' : ''}`}>
                    <span className="l-dot" />
                    {s}
                  </div>
                ))}
                <div className="progress-track">
                  <div className="progress-fill" style={{ width: `${8 + (loadStep / LOAD_STEPS.length) * 88}%` }} />
                </div>
              </div>
            )}

            {/* ERROR */}
            {error && <div className="error-box">⚠ {error}</div>}

            {/* EMPTY */}
            {showEmpty && (
              <div className="empty-state">
                <div className="empty-icon">🌐</div>
                <h2 className="empty-title">¿Qué tipo de sitio buscas?</h2>
                <p className="empty-sub">Claude analiza tu descripción y encuentra inspiración real con screenshots en vivo.</p>
                <div className="hint-list">
                  <div className="hint" onClick={() => { setQuery('portafolio minimalista para fotógrafo con fondo oscuro'); doSearch('portafolio minimalista para fotógrafo con fondo oscuro') }}>
                    "portafolio minimalista para fotógrafo con fondo oscuro"
                  </div>
                  <div className="hint" onClick={() => { setQuery('landing page SaaS de productividad estilo linear app'); doSearch('landing page SaaS de productividad estilo linear app') }}>
                    "landing page SaaS de productividad estilo linear app"
                  </div>
                  <div className="hint" onClick={() => { setQuery('estudio de diseño editorial tipografía grande bold'); doSearch('estudio de diseño editorial tipografía grande bold') }}>
                    "estudio de diseño editorial tipografía grande bold"
                  </div>
                </div>
              </div>
            )}

            {/* RESULTS */}
            {showResults && (
              <>
                {analysis && (
                  <div className="ai-box">
                    <div className="ai-label">🤖 Análisis</div>
                    <p className="ai-text">{analysis}</p>
                    <div className="ai-kws">
                      {keywords.map((k) => <span key={k} className="ai-kw">{k}</span>)}
                    </div>
                  </div>
                )}
                <div className="results-header">
                  <div className="res-count"><strong>{filtered.length}</strong> resultados</div>
                  <select className="sort-sel" value={sort} onChange={(e) => setSort(e.target.value as SortMode)}>
                    <option value="rel">Relevancia</option>
                    <option value="tpl">Plantillas primero</option>
                    <option value="ins">Inspiración primero</option>
                    <option value="free">Free primero</option>
                  </select>
                </div>

                {view === 'grid' ? (
                  <div className="results-grid">
                    {filtered.map((item, idx) => (
                      <ResultCard
                        key={item.url}
                        item={item}
                        idx={idx}
                        saved={isSaved(item.url)}
                        previewSrc={previewSrc}
                        onSave={() => toggleSave(item)}
                        onDetail={() => setDetail(item)}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="results-list">
                    {filtered.map((item, idx) => (
                      <div key={item.url} className="list-item">
                        <Screenshot url={item.url} emoji={item.emoji} alt={item.title} height={46} previewSrc={previewSrc} className="list-thumb" />
                        <div>
                          <div className="list-title">{item.title}</div>
                          <div className="list-meta">{item.source} · {item.type} · {item.price}</div>
                        </div>
                        <div className="list-actions">
                          <button className="l-btn" onClick={() => toggleSave(item)}>♡</button>
                          <button className="l-btn" onClick={() => setDetail(item)}>ℹ</button>
                          <a href={item.url} target="_blank" rel="noopener noreferrer" className="l-btn primary">Abrir →</a>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </>
      )}

      {/* SAVED TAB */}
      {activeTab === 'saved' && (
        <div className="main">
          {saved.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">🤍</div>
              <h2 className="empty-title">Sin guardados aún</h2>
              <p className="empty-sub">Guarda resultados con el ícono de corazón en cada card.</p>
            </div>
          ) : (
            <div className="results-grid">
              {saved.map((item, idx) => (
                <ResultCard
                  key={item.url}
                  item={item}
                  idx={idx}
                  saved={true}
                  previewSrc={previewSrc}
                  onSave={() => toggleSave(item)}
                  onDetail={() => setDetail(item)}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* COLLECTIONS TAB */}
      {activeTab === 'colls' && (
        <div className="main">
          <div className="colls-header">
            <h2 style={{ fontSize: 14, fontWeight: 700, letterSpacing: '-0.02em' }}>Mis colecciones</h2>
            <button
              className="search-btn"
              style={{ height: 30, fontSize: 11, padding: '0 0.875rem' }}
              onClick={() => {
                const name = prompt('Nombre de la colección:')
                if (name?.trim()) setColls((c) => [...c, { name: name.trim(), items: [] }])
              }}
            >
              + Nueva
            </button>
          </div>
          <div className="colls-grid">
            {colls.map((c, i) => (
              <div key={i} className="coll-card">
                <div style={{ fontSize: 24, marginBottom: 8 }}>📁</div>
                <div style={{ fontSize: 13, fontWeight: 700, letterSpacing: '-0.02em', marginBottom: 3 }}>{c.name}</div>
                <div style={{ fontSize: 10, color: 'var(--color-text-tertiary)', fontFamily: 'monospace' }}>{c.items.length} items</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
