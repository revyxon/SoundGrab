import { api } from '@/core/api-client'
import type { ApiResponse, GlobalSearchData, SearchSongsData, SearchAlbumsData, SearchArtistsData, SearchPlaylistsData } from '@/types'

export async function globalSearch(query: string): Promise<GlobalSearchData> {
  const res = await api.get('api/search', { searchParams: { query } }).json<ApiResponse<GlobalSearchData>>()
  return res.data
}

export async function searchSongs(query: string, page = 0, limit = 20): Promise<SearchSongsData> {
  const res = await api.get('api/search/songs', { searchParams: { query, page, limit } }).json<ApiResponse<SearchSongsData>>()
  return res.data
}

export async function searchAlbums(query: string, page = 0, limit = 20): Promise<SearchAlbumsData> {
  const res = await api.get('api/search/albums', { searchParams: { query, page, limit } }).json<ApiResponse<SearchAlbumsData>>()
  return res.data
}

export async function searchArtists(query: string, page = 0, limit = 20): Promise<SearchArtistsData> {
  const res = await api.get('api/search/artists', { searchParams: { query, page, limit } }).json<ApiResponse<SearchArtistsData>>()
  return res.data
}

export async function searchPlaylists(query: string, page = 0, limit = 20): Promise<SearchPlaylistsData> {
  const res = await api.get('api/search/playlists', { searchParams: { query, page, limit } }).json<ApiResponse<SearchPlaylistsData>>()
  return res.data
}
