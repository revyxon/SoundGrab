import { useQuery } from '@tanstack/react-query'
import { getPlaylistById } from '@/services/playlist.service'

export function usePlaylist(id: string | undefined) {
  return useQuery({
    queryKey: ['playlist', id],
    queryFn: () => getPlaylistById(id!),
    enabled: !!id,
  })
}
