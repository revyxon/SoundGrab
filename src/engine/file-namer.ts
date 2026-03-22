import type { Song } from '@/types'
import { sanitizeFilename, decodeHtmlEntities } from '@/lib/utils'

interface FileNameParams {
  title: string
  artist: string
  album: string
  track?: number
  year?: string | null
}

export function generateFileName(pattern: string, params: FileNameParams): string {
  const result = pattern
    .replace('{title}', decodeHtmlEntities(params.title) || 'Unknown')
    .replace('{artist}', decodeHtmlEntities(params.artist) || 'Unknown Artist')
    .replace('{album}', decodeHtmlEntities(params.album) || 'Unknown Album')
    .replace('{track}', params.track?.toString().padStart(2, '0') ?? '00')
    .replace('{year}', params.year ?? '')

  return sanitizeFilename(result) + '.m4a'
}

export function getFileNameParams(song: Song, trackNumber?: number): FileNameParams {
  const primaryArtist = song.artists.primary.map((a) => a.name).join(', ') || 'Unknown Artist'

  return {
    title: song.name,
    artist: primaryArtist,
    album: song.album.name || 'Unknown Album',
    track: trackNumber,
    year: song.year,
  }
}

