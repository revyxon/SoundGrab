import { api } from '@/core/api-client'
import type { ApiResponse, ArtistDetail, Song, AlbumSearchResult, PaginatedData } from '@/types'

export async function getArtistById(id: string): Promise<ArtistDetail> {
  const res = await api.get(`api/artists/${id}`, {
    searchParams: { page: 0, songCount: 10, albumCount: 10, sortBy: 'popularity', sortOrder: 'desc' },
  }).json<ApiResponse<ArtistDetail>>()
  return res.data
}

export async function getArtistSongs(
  id: string,
  page = 0,
  sortBy = 'popularity',
  sortOrder = 'desc'
): Promise<PaginatedData<Song>> {
  const res = await api.get(`api/artists/${id}/songs`, {
    searchParams: { page, sortBy, sortOrder },
  }).json<ApiResponse<{ total: number; songs?: Song[]; results?: Song[] }>>()
  
  const songs = res.data.songs || res.data.results || []
  return {
    total: res.data.total || 0,
    results: Array.isArray(songs) ? songs : [],
    start: page * 10
  } as PaginatedData<Song>
}

export async function getArtistAlbums(
  id: string,
  page = 0,
  sortBy = 'popularity',
  sortOrder = 'desc'
): Promise<PaginatedData<AlbumSearchResult>> {
  const res = await api.get(`api/artists/${id}/albums`, {
    searchParams: { page, sortBy, sortOrder },
  }).json<ApiResponse<{ total: number; albums?: AlbumSearchResult[]; results?: AlbumSearchResult[] }>>()
  
  const albums = res.data.albums || res.data.results || []
  return {
    total: res.data.total || 0,
    results: Array.isArray(albums) ? albums : [],
    start: page * 10
  } as PaginatedData<AlbumSearchResult>
}
