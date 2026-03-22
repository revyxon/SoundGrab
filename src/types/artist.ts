import type { ImageQuality, Song } from './song'
import type { AlbumSearchResult } from './album'

export interface Artist {
  id: string
  name: string
  role: string
  type: string
  image: ImageQuality[]
  url: string
}

export interface ArtistDetail {
  id: string
  name: string
  url: string
  type: string
  followerCount: number | null
  fanCount: string | null
  isVerified: boolean | null
  dominantLanguage: string | null
  dominantType: string | null
  bio: unknown[] | null
  dob: string | null
  fb: string | null
  twitter: string | null
  wiki: string | null
  availableLanguages: string[]
  isRadioPresent: boolean | null
  image: ImageQuality[]
  topSongs: Song[]
  topAlbums: AlbumSearchResult[]
  singles: Song[]
}
