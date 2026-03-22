import { api } from '@/core/api-client'
import type { ApiResponse, Song } from '@/types'

export async function getSongById(id: string): Promise<Song[]> {
  const res = await api.get(`api/songs/${id}`).json<ApiResponse<Song[]>>()
  return res.data
}

export async function getSongsByIds(ids: string[]): Promise<Song[]> {
  const res = await api.get('api/songs', { searchParams: { ids: ids.join(',') } }).json<ApiResponse<Song[]>>()
  return res.data
}

export async function getSongByLink(link: string): Promise<Song[]> {
  const res = await api.get('api/songs', { searchParams: { link } }).json<ApiResponse<Song[]>>()
  return res.data
}

export async function getSongSuggestions(id: string, limit = 10): Promise<Song[]> {
  const res = await api.get(`api/songs/${id}/suggestions`, { searchParams: { limit } }).json<ApiResponse<Song[]>>()
  return res.data
}
