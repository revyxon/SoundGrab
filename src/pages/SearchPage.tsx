import { useState, useEffect } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { Search, X, Clock } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { SongRow } from '@/components/shared/SongRow'
import { AlbumCard } from '@/components/shared/AlbumCard'
import { ArtistCard } from '@/components/shared/ArtistCard'
import { PlaylistCard } from '@/components/shared/PlaylistCard'
import { EmptyState } from '@/components/shared/EmptyState'
import { SongListSkeleton, CardGridSkeleton } from '@/components/shared/Skeletons'
import { useSearchSongs, useSearchAlbums, useSearchArtists, useSearchPlaylists } from '@/hooks/use-search'
import { useDebounce } from '@/hooks/use-debounce'
import { useSearchStore } from '@/stores/search-store'

export function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const initialQuery = searchParams.get('q') || ''
  const [query, setQuery] = useState(initialQuery)
  const [tab, setTab] = useState(searchParams.get('tab') || 'songs')
  const [page, setPage] = useState(0)
  const debouncedQuery = useDebounce(query, 300)

  const { recentSearches, addRecentSearch, removeRecentSearch } = useSearchStore()

  useEffect(() => {
    if (debouncedQuery) {
      setSearchParams({ q: debouncedQuery, tab }, { replace: true })
      addRecentSearch(debouncedQuery)
      setPage(0)
    }
  }, [debouncedQuery, tab])

  const songsQuery = useSearchSongs(debouncedQuery, page, 20)
  const albumsQuery = useSearchAlbums(debouncedQuery, page, 20)
  const artistsQuery = useSearchArtists(debouncedQuery, page, 20)
  const playlistsQuery = useSearchPlaylists(debouncedQuery, page, 20)

  const handleClear = () => {
    setQuery('')
    setSearchParams({}, { replace: true })
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-6 animate-fade-in">
      {/* Search bar */}
      <div className="relative max-w-2xl mx-auto mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search songs, albums, artists, playlists..."
          className="pl-9 pr-9 h-11 bg-surface"
          autoFocus
          id="search-input"
        />
        {query && (
          <button onClick={handleClear} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer">
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Recent searches (when no query) */}
      {!debouncedQuery && recentSearches.length > 0 && (
        <div className="max-w-2xl mx-auto mb-8">
          <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">Recent Searches</h3>
          <div className="flex flex-wrap gap-2">
            {recentSearches.map((s) => (
              <button
                key={s}
                onClick={() => setQuery(s)}
                className="group flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-md bg-muted hover:bg-muted/80 text-foreground transition-colors cursor-pointer"
              >
                <Clock className="h-3 w-3 text-muted-foreground" />
                {s}
                <span
                  onClick={(e) => { e.stopPropagation(); removeRecentSearch(s) }}
                  className="ml-1 text-muted-foreground hover:text-foreground"
                >
                  <X className="h-3 w-3" />
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* No query state */}
      {!debouncedQuery && (
        <EmptyState
          icon={<Search className="h-12 w-12" />}
          title="Search for music"
          description="Type a song name, artist, or album to start searching"
        />
      )}

      {/* Results */}
      {debouncedQuery && (
        <Tabs value={tab} onValueChange={setTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="songs">
              Songs {songsQuery.data && `(${songsQuery.data.total})`}
            </TabsTrigger>
            <TabsTrigger value="albums">
              Albums {albumsQuery.data && `(${albumsQuery.data.total})`}
            </TabsTrigger>
            <TabsTrigger value="artists">
              Artists {artistsQuery.data && `(${artistsQuery.data.total})`}
            </TabsTrigger>
            <TabsTrigger value="playlists">
              Playlists {playlistsQuery.data && `(${playlistsQuery.data.total})`}
            </TabsTrigger>
          </TabsList>

          {/* Songs */}
          <TabsContent value="songs">
            {songsQuery.isLoading && <SongListSkeleton />}
            {songsQuery.isError && (
              <EmptyState title="Failed to load" description="Something went wrong" action={<Button variant="outline" onClick={() => songsQuery.refetch()}>Retry</Button>} />
            )}
            {songsQuery.data && songsQuery.data.results.length === 0 && (
              <EmptyState title="No songs found" description={`No results for "${debouncedQuery}"`} />
            )}
            {songsQuery.data && songsQuery.data.results.length > 0 && (
              <div>
                {/* Table header */}
                <div className="hidden sm:flex items-center gap-3 px-4 py-2 text-xs text-muted-foreground border-b border-border mb-1">
                  <span className="w-10" />
                  <span className="flex-1">Title</span>
                  <span className="hidden md:block w-40">Album</span>
                  <span className="hidden sm:block w-12 text-right">Duration</span>
                  <span className="hidden lg:block w-16">Quality</span>
                  <span className="w-8" />
                </div>
                {songsQuery.data.results.map((song, i) => (
                  <SongRow key={song.id} song={song} index={i} />
                ))}
                {songsQuery.data.total > (page + 1) * 20 && (
                  <div className="flex justify-center mt-4">
                    <Button variant="outline" onClick={() => setPage((p) => p + 1)}>Load More</Button>
                  </div>
                )}
              </div>
            )}
          </TabsContent>

          {/* Albums */}
          <TabsContent value="albums">
            {albumsQuery.isLoading && <CardGridSkeleton />}
            {albumsQuery.data && albumsQuery.data.results.length === 0 && (
              <EmptyState title="No albums found" description={`No results for "${debouncedQuery}"`} />
            )}
            {albumsQuery.data && albumsQuery.data.results.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
                {albumsQuery.data.results.map((album) => (
                  <AlbumCard key={album.id} album={album} />
                ))}
              </div>
            )}
          </TabsContent>

          {/* Artists */}
          <TabsContent value="artists">
            {artistsQuery.isLoading && <CardGridSkeleton count={6} />}
            {artistsQuery.data && artistsQuery.data.results.length === 0 && (
              <EmptyState title="No artists found" description={`No results for "${debouncedQuery}"`} />
            )}
            {artistsQuery.data && artistsQuery.data.results.length > 0 && (
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-2">
                {artistsQuery.data.results.map((artist) => (
                  <ArtistCard key={artist.id} artist={artist} />
                ))}
              </div>
            )}
          </TabsContent>

          {/* Playlists */}
          <TabsContent value="playlists">
            {playlistsQuery.isLoading && <CardGridSkeleton />}
            {playlistsQuery.data && playlistsQuery.data.results.length === 0 && (
              <EmptyState title="No playlists found" description={`No results for "${debouncedQuery}"`} />
            )}
            {playlistsQuery.data && playlistsQuery.data.results.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
                {playlistsQuery.data.results.map((playlist) => (
                  <PlaylistCard key={playlist.id} playlist={playlist} />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      )}
    </div>
  )
}
