export type SerpApiEngine = 'google' | 'google_news' | 'google_maps'

export type EvidenceSourceType = 'google_search' | 'google_news' | 'google_maps' | 'demo' | 'official_market_data'
export type RelevanceLevel = 'high' | 'medium' | 'low'

export interface NormalizedEvidence {
  id: string
  sourceType: EvidenceSourceType
  title: string
  sourceName: string | null
  sourceUrl: string | null
  snippet: string | null
  observedAt: string
  publishedAt: string | null
  cropName: string | null
  location: string | null
  signalType: string
  relevance: RelevanceLevel
  isLive: boolean
  confidence: number | null
}

export interface DiscoveredLead {
  id: string
  name: string
  address: string | null
  city: string | null
  state: string | null
  latitude: number | null
  longitude: number | null
  phone: string | null
  website: string | null
  rating: number | null
  reviewCount: number | null
  category: string | null
  mapsLink: string | null
  sourceType: 'google_maps' | 'google_search' | 'demo'
  observedAt: string
  status: 'CANDIDATE' | 'VERIFIED' | 'REJECTED'
}

export interface SerpApiSearchRequestParams {
  engine: SerpApiEngine
  q: string
  location?: string
  gl?: string
  hl?: string
  tbm?: string
  ll?: string
  num?: number
}

export interface SerpApiResponseMetadata {
  status: string
  created_at?: string
  json_endpoint?: string
  error?: string
}

export interface SerpApiRawResponse {
  search_metadata?: SerpApiResponseMetadata
  error?: string
  organic_results?: Array<{
    title?: string
    link?: string
    snippet?: string
    source?: string
    date?: string
  }>
  news_results?: Array<{
    title?: string
    link?: string
    snippet?: string
    source?: string
    date?: string
    thumbnail?: string
  }>
  local_results?: Array<{
    title?: string
    place_id?: string
    link?: string
    phone?: string
    website?: string
    rating?: number
    reviews?: number
    address?: string
    type?: string
    gps_coordinates?: {
      latitude?: number
      longitude?: number
    }
  }>
}
