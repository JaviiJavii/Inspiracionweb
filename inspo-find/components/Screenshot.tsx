'use client'
import { useState } from 'react'
import { PreviewSrc } from '@/lib/types'

interface Props {
  url: string
  emoji: string
  alt: string
  height?: number
  previewSrc: PreviewSrc
  className?: string
}

const BG = [
  'linear-gradient(135deg,#0e0e0e,#1c1c1c)',
  'linear-gradient(135deg,#f5f0eb,#dfd5c8)',
  'linear-gradient(135deg,#0a1628,#102040)',
  'linear-gradient(135deg,#1a0a2e,#2d1060)',
  'linear-gradient(135deg,#eef2ff,#d8e4ff)',
  'linear-gradient(135deg,#0a2e1a,#103828)',
  'linear-gradient(135deg,#2a0a1a,#441030)',
  'linear-gradient(135deg,#f8f8f4,#e8e8e4)',
]

function getBg(url: string) {
  let hash = 0
  for (let i = 0; i < url.length; i++) hash = (hash * 31 + url.charCodeAt(i)) & 0xffffffff
  return BG[Math.abs(hash) % BG.length]
}

export default function Screenshot({ url, emoji, alt, height = 130, previewSrc, className = '' }: Props) {
  const [status, setStatus] = useState<'loading' | 'ok' | 'error'>('loading')
  const bg = getBg(url)
  const proxyUrl = `/api/screenshot?url=${encodeURIComponent(url)}&src=${previewSrc}`

  return (
    <div
      className={className}
      style={{ height, background: bg, position: 'relative', overflow: 'hidden', flexShrink: 0 }}
    >
      {status === 'loading' && (
        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="spinner" />
        </div>
      )}
      {status === 'error' && (
        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: height > 100 ? 32 : 20 }}>
          {emoji}
        </div>
      )}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={proxyUrl}
        alt={alt}
        onLoad={() => setStatus('ok')}
        onError={() => setStatus('error')}
        style={{
          width: '100%', height: '100%', objectFit: 'cover',
          opacity: status === 'ok' ? 1 : 0,
          transition: 'opacity .3s ease, transform .4s ease',
          display: 'block',
        }}
        onMouseEnter={(e) => { (e.target as HTMLImageElement).style.transform = 'scale(1.04)' }}
        onMouseLeave={(e) => { (e.target as HTMLImageElement).style.transform = 'scale(1)' }}
      />
    </div>
  )
}
