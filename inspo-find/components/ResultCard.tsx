'use client'
import Screenshot from './Screenshot'
import { Result, PreviewSrc } from '@/lib/types'

const TYPE_STYLES: Record<string, string> = {
  inspiration: 'bg-green-900/70 text-green-300 border border-green-500/30',
  template: 'bg-blue-900/70 text-blue-300 border border-blue-500/30',
  tool: 'bg-pink-900/70 text-pink-300 border border-pink-500/30',
}

const PRICE_STYLES: Record<string, string> = {
  free: 'bg-green-900/70 text-green-300 border border-green-500/30',
  freemium: 'bg-purple-900/70 text-purple-300 border border-purple-500/30',
  paid: 'bg-yellow-900/70 text-yellow-300 border border-yellow-500/30',
  'open-source': 'bg-blue-900/70 text-blue-300 border border-blue-500/30',
}

const PRICE_LABEL: Record<string, string> = {
  free: 'FREE', freemium: 'FREE+', paid: 'PAID', 'open-source': 'OSS',
}

interface Props {
  item: Result
  idx: number
  saved: boolean
  previewSrc: PreviewSrc
  onSave: () => void
  onDetail: () => void
}

export default function ResultCard({ item, idx, saved, previewSrc, onSave, onDetail }: Props) {
  return (
    <div className="result-card group">
      <div style={{ position: 'relative' }}>
        <Screenshot url={item.url} emoji={item.emoji} alt={item.title} height={130} previewSrc={previewSrc} />
        <span className={`type-badge text-xs font-mono ${TYPE_STYLES[item.type] || TYPE_STYLES.inspiration}`}>
          {item.type}
        </span>
        <button
          onClick={onSave}
          className={`save-btn ${saved ? 'saved' : ''}`}
          aria-label="Guardar"
        >
          {saved ? '♥' : '♡'}
        </button>
        <span className={`price-badge text-xs font-mono ${PRICE_STYLES[item.price] || PRICE_STYLES.free}`}>
          {PRICE_LABEL[item.price] || 'FREE'}
        </span>
      </div>
      <div className="card-body">
        <div className="card-source">{item.source}</div>
        <div className="card-title">{item.title}</div>
        <div className="card-desc">{item.description}</div>
        <div className="card-tags">
          {item.tags.map((t) => <span key={t} className="tag">{t}</span>)}
        </div>
        <div className="card-cta">
          <button className="btn-info" onClick={onDetail} aria-label="Detalle">ℹ</button>
          <a href={item.url} target="_blank" rel="noopener noreferrer" className="btn-open">Abrir →</a>
        </div>
      </div>
    </div>
  )
}
