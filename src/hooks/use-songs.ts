import { useQuery } from '@tanstack/react-query'
import { getSongById, getSongsByIds, getSongSuggestions } from '@/services/song.service'

export function useSong(id: string | undefined) {
  return useQuery({
    queryKey: ['song', id],
    queryFn: () => getSongById(id!),
    enabled: !!id,
    select: (data) => data[0],
  })
}

export function useSongsByIds(ids: string[]) {
  return useQuery({
    queryKey: ['songs', ids],
    queryFn: () => getSongsByIds(ids),
    enabled: ids.length > 0,
  })
}

export function useSongSuggestions(id: string | undefined, limit = 10) {
  return useQuery({
    queryKey: ['song', id, 'suggestions', limit],
    queryFn: () => getSongSuggestions(id!, limit),
    enabled: !!id,
  })
}
