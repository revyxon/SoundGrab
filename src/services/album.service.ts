import { api } from '@/core/api-client'
import type { ApiResponse, AlbumDetail } from '@/types'

export async function getAlbumById(id: string): Promise<AlbumDetail> {
  const res = await api.get('api/albums', { searchParams: { id } }).json<ApiResponse<AlbumDetail>>()
  return res.data
}

export async function getAlbumByLink(link: string): Promise<AlbumDetail> {
  const res = await api.get('api/albums', { searchParams: { link } }).json<ApiResponse<AlbumDetail>>()
  return res.data
}
