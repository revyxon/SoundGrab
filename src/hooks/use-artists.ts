import { useQuery } from '@tanstack/react-query'
import { getArtistById, getArtistSongs, getArtistAlbums } from '@/services/artist.service'

export function useArtist(id: string | undefined) {
  return useQuery({
    queryKey: ['artist', id],
    queryFn: () => getArtistById(id!),
    enabled: !!id,
  })
}

export function useArtistSongs(id: string | undefined, page = 0, sortBy = 'popularity', sortOrder = 'desc') {
  return useQuery({
    queryKey: ['artist', id, 'songs', page, sortBy, sortOrder],
    queryFn: () => getArtistSongs(id!, page, sortBy, sortOrder),
    enabled: !!id,
  })
}

export function useArtistAlbums(id: string | undefined, page = 0) {
  return useQuery({
    queryKey: ['artist', id, 'albums', page],
    queryFn: () => getArtistAlbums(id!, page),
    enabled: !!id,
  })
}
