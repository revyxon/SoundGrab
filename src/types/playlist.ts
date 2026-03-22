import type { ImageQuality, Song } from './song'

export interface Playlist {
  id: string
  name: string
  type: string
  image: ImageQuality[]
  url: string
  songCount: number | null
  language: string
  explicitContent: boolean
  description?: string
}

export interface PlaylistDetail extends Playlist {
  songs: Song[] | null
}
