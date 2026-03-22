export interface ImageQuality {
  quality: string
  url: string
}

export interface DownloadUrl {
  quality: string
  url: string
}

export interface ArtistMini {
  id: string
  name: string
  role: string
  type: string
  image: ImageQuality[]
  url: string
}

export interface Album {
  id: string | null
  name: string | null
  url: string | null
}

export interface Song {
  id: string
  name: string
  type: string
  year: string | null
  releaseDate: string | null
  duration: number | null
  label: string | null
  explicitContent: boolean
  playCount: number | null
  language: string
  hasLyrics: boolean
  lyricsId: string | null
  url: string
  copyright: string | null
  album: Album
  artists: {
    primary: ArtistMini[]
    featured: ArtistMini[]
    all: ArtistMini[]
  }
  image: ImageQuality[]
  downloadUrl: DownloadUrl[]
}

export interface SongSearchResult {
  id: string
  title: string
  image: ImageQuality[]
  album: string
  url: string
  type: string
  description: string
  primaryArtists: string
  singers: string
  language: string
}
