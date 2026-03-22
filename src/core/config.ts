export const API_BASE_URL = 'https://saavn.sumit.co'

export const QUALITY_OPTIONS = [
  { value: '48kbps', label: '48 kbps', kbps: 48, description: 'Low' },
  { value: '96kbps', label: '96 kbps', kbps: 96, description: 'Medium' },
  { value: '160kbps', label: '160 kbps', kbps: 160, description: 'High' },
  { value: '320kbps', label: '320 kbps', kbps: 320, description: 'Ultra' },
] as const

export type QualityValue = (typeof QUALITY_OPTIONS)[number]['value']

export const DEFAULT_QUALITY: QualityValue = '320kbps'

export const FILE_NAME_PATTERNS = [
  { value: '{artist} - {title}', label: 'Artist - Title' },
  { value: '{title} - {artist}', label: 'Title - Artist' },
  { value: '{title}', label: 'Title Only' },
  { value: '{artist} - {album} - {title}', label: 'Artist - Album - Title' },
  { value: '{track}. {title}', label: 'Track#. Title' },
] as const

export const DEFAULT_FILE_NAME_PATTERN = '{artist} - {title}'

export const MAX_CONCURRENT_DOWNLOADS = 3
export const MAX_RETRY_COUNT = 3
export const SEARCH_DEBOUNCE_MS = 300
export const SEARCH_PAGE_SIZE = 20
export const SUGGESTIONS_LIMIT = 10
