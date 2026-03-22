import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function decodeHtmlEntities(text: string | null | undefined): string {
  if (!text) return ''
  const textArea = document.createElement('textarea')
  textArea.innerHTML = text
  return textArea.value
}


export function formatDuration(seconds: number | null | undefined): string {
  if (!seconds) return '--:--'
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins}:${secs.toString().padStart(2, '0')}`
}

export function formatCount(count: number | null | undefined): string {
  if (!count) return '0'
  if (count >= 1_000_000_000) return `${(count / 1_000_000_000).toFixed(1)}B`
  if (count >= 1_000_000) return `${(count / 1_000_000).toFixed(1)}M`
  if (count >= 1_000) return `${(count / 1_000).toFixed(1)}K`
  return count.toString()
}

export function getImageUrl(images: { quality: string; url: string }[] | undefined, quality: 'low' | 'medium' | 'high' = 'medium'): string {
  if (!images || images.length === 0) return ''
  const qualityMap: Record<string, number> = { '50x50': 0, '150x150': 1, '500x500': 2 }
  const targetIdx = quality === 'low' ? 0 : quality === 'medium' ? 1 : 2
  return images[Math.min(targetIdx, images.length - 1)]?.url ?? images[0]?.url ?? ''
}

export function estimateFileSize(durationSeconds: number | null | undefined, qualityKbps: number): string {
  if (!durationSeconds) return '~? MB'
  const bytes = (qualityKbps * 1000 * durationSeconds) / 8
  const mb = bytes / (1024 * 1024)
  if (mb < 1) return `~${Math.round(mb * 1024)} KB`
  return `~${mb.toFixed(1)} MB`
}

export function sanitizeFilename(name: string): string {
  return name
    .replace(/[<>:"/\\|?*\x00-\x1f]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
}
