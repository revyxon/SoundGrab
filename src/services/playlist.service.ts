import { api } from '@/core/api-client'
import type { ApiResponse, PlaylistDetail } from '@/types'

export async function getPlaylistById(id: string, page = 0, limit = 50): Promise<PlaylistDetail> {
  const res = await api.get('api/playlists', { searchParams: { id, page, limit } }).json<ApiResponse<PlaylistDetail>>()
  return res.data
}

export async function getPlaylistByLink(link: string, page = 0, limit = 50): Promise<PlaylistDetail> {
  const res = await api.get('api/playlists', { searchParams: { link, page, limit } }).json<ApiResponse<PlaylistDetail>>()
  return res.data
}
