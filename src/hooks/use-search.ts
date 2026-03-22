import { useQuery } from '@tanstack/react-query'
import { globalSearch, searchSongs, searchAlbums, searchArtists, searchPlaylists } from '@/services/search.service'

export function useGlobalSearch(query: string) {
  return useQuery({
    queryKey: ['search', 'global', query],
    queryFn: () => globalSearch(query),
    enabled: query.length > 1,
  })
}

export function useSearchSongs(query: string, page = 0, limit = 20) {
  return useQuery({
    queryKey: ['search', 'songs', query, page, limit],
    queryFn: () => searchSongs(query, page, limit),
    enabled: query.length > 1,
  })
}

export function useSearchAlbums(query: string, page = 0, limit = 20) {
  return useQuery({
    queryKey: ['search', 'albums', query, page, limit],
    queryFn: () => searchAlbums(query, page, limit),
    enabled: query.length > 1,
  })
}

export function useSearchArtists(query: string, page = 0, limit = 20) {
  return useQuery({
    queryKey: ['search', 'artists', query, page, limit],
    queryFn: () => searchArtists(query, page, limit),
    enabled: query.length > 1,
  })
}

export function useSearchPlaylists(query: string, page = 0, limit = 20) {
  return useQuery({
    queryKey: ['search', 'playlists', query, page, limit],
    queryFn: () => searchPlaylists(query, page, limit),
    enabled: query.length > 1,
  })
}
