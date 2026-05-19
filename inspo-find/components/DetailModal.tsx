'use client'
import Screenshot from './Screenshot'
import { Result, PreviewSrc } from '@/lib/types'

const PRICE_LABEL: Record<string, string> = {
  free: 'FREE', freemium: 'FREE+', paid: 'PAID', 'open-source': 'OSS',
}

interface Props {
  item: Result
  saved: boolean
  previewSrc: PreviewSrc
  onClose: () => void
  onSave: () => void
}

export default function DetailModal({ item, saved, previewSrc, onClose, onSave }: Props) {
  return (
    <div className="overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="detail-card">
        <button className="detail-close" onClick={onClose} aria-label="Cerrar">✕</button>
        <Screenshot url={item.url} emoji={item.emoji} alt={item.title} height={200} previewSrc={previewSrc} />
        <div className="detail-body">
          <div className="detail-meta">
            {item.source} · {item.type} · {PRICE_LABEL[item.price] || 'FREE'}
          </div>
          <h2 className="detail-title">{item.title}</h2>
          <p className="detail-desc">{item.description}</p>
          <div className="card-tags" style={{ marginBottom: '0.75rem' }}>
            {item.tags.map((t) => <span key={t} className="tag">{t}</span>)}
          </div>
          <div className="detail-url-label">URL</div>
          <div className="detail-url">{item.url}</div>
          <div className="detail-actions">
            <button className="btn-secondary" onClick={onSave}>
              {saved ? '♥ Guardado' : '♡ Guardar'}
            </button>
            <a
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary"
            >
              Abrir sitio →
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
