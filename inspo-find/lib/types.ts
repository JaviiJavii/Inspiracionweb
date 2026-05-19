export interface Result {
  title: string
  source: string
  url: string
  description: string
  tags: string[]
  emoji: string
  type: 'inspiration' | 'template' | 'tool'
  style: string
  price: 'free' | 'freemium' | 'paid' | 'open-source'
  savedAt?: number
}

export interface SearchResponse {
  analysis: string
  keywords: string[]
  results: Result[]
}

export type ViewMode = 'grid' | 'list'
export type PreviewSrc = 'microlink' | 'thumbio'
export type FilterType = 'all' | 'inspiration' | 'template' | 'tool'
export type FilterPrice = 'all' | 'free' | 'freemium' | 'paid'
export type SortMode = 'rel' | 'tpl' | 'ins' | 'free'
