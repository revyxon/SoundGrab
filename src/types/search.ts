import type { ImageQuality, SongSearchResult } from './song'
import type { AlbumSearchResult } from './album'
import type { Artist } from './artist'
import type { Playlist } from './playlist'

export interface ApiResponse<T> {
  success: boolean
  data: T
}

export interface PaginatedData<T> {
  total: number
  start: number
  results: T[]
}

export interface GlobalSearchData {
  albums: {
    results: Array<{
      id: string
      title: string
      image: ImageQuality[]
      artist: string
      url: string
      type: string
      description: string
      year: string
      language: string
      songIds: string
    }>
    position: number
  }
  songs: {
    results: SongSearchResult[]
    position: number
  }
  artists: {
    results: Array<{
      id: string
      title: string
      image: ImageQuality[]
      type: string
      description: string
      position: number
    }>
    position: number
  }
  playlists: {
    results: Array<{
      id: string
      title: string
      image: ImageQuality[]
      url: string
      language: string
      type: string
      description: string
    }>
    position: number
  }
  topQuery: {
    results: SongSearchResult[]
    position: number
  }
}

export type SearchSongsData = PaginatedData<import('./song').Song>
export type SearchAlbumsData = PaginatedData<AlbumSearchResult>
export type SearchArtistsData = PaginatedData<Artist>
export type SearchPlaylistsData = PaginatedData<Playlist>
