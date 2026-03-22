import type { ImageQuality, ArtistMini, Song } from './song'

export interface AlbumDetail {
  id: string
  name: string
  description: string
  year: number | null
  type: string
  playCount: number | null
  language: string
  explicitContent: boolean
  artists: {
    primary: ArtistMini[]
    featured: ArtistMini[]
    all: ArtistMini[]
  }
  songCount: number | null
  url: string
  image: ImageQuality[]
  songs: Song[] | null
}

export interface AlbumSearchResult {
  id: string
  name: string
  description: string
  year: number | null
  type: string
  playCount: number | null
  language: string
  explicitContent: boolean
  artists: {
    primary: ArtistMini[]
    featured: ArtistMini[]
    all: ArtistMini[]
  }
  url: string
  image: ImageQuality[]
}
