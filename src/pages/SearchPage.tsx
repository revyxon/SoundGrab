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
import { PaginationControls } from '@/components/shared/PaginationControls'
import { SongListSkeleton, CardGridSkeleton } from '@/components/shared/Skeletons'
import { useSearchSongs, useSearchAlbums, useSearchArtists, useSearchPlaylists } from '@/hooks/use-search'
import { useDebounce } from '@/hooks/use-debounce'
import { useSearchStore } from '@/stores/search-store'
import { cn } from '@/lib/utils'

export function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const initialQuery = searchParams.get('q') || ''
  const [query, setQuery] = useState(initialQuery)
  const [tab, setTab] = useState(searchParams.get('tab') || 'songs')
  const [page, setPage] = useState(0)
  const debouncedQuery = useDebounce(query, 300)

  // Scroll direction logic for sticky header
  const [isNavbarVisible, setIsNavbarVisible] = useState(true)
  const [lastScrollY, setLastScrollY] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY
      if (currentScrollY > lastScrollY && currentScrollY > 60) {
        setIsNavbarVisible(false)
      } else if (currentScrollY < lastScrollY) {
        setIsNavbarVisible(true)
      }
      setLastScrollY(currentScrollY)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [lastScrollY])

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
    <div className="mx-auto max-w-7xl px-2 sm:px-6 animate-fade-in relative pb-12 pt-6 md:pt-10">
      
      {/* Normal Search Input */}
      <div className="relative max-w-4xl mx-auto px-2 sm:px-0 mb-6 sm:mb-8">
          <Search className="absolute left-5 sm:left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.currentTarget.blur()
              }
            }}
            placeholder="Search songs, albums, artists, playlists..."
            className="pl-9 pr-9 h-12 bg-surface rounded-xl border-border/50 hover:bg-muted/50 transition-colors focus:bg-surface focus:ring-1"
            autoFocus
            id="search-input"
          />
          {query && (
            <button onClick={handleClear} className="absolute right-5 sm:right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer p-1">
              <X className="h-4 w-4" />
            </button>
          )}
      </div>

      {/* Recent searches (when no query) */}
      {!debouncedQuery && recentSearches.length > 0 && (
        <div className="max-w-4xl mx-auto mb-10">
          <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">Recent Searches</h3>
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
        <div className="max-w-5xl mx-auto px-2">
          <Tabs value={tab} onValueChange={setTab}>
            
            {/* Sticky TabsList exclusively for navigation */}
            <div 
              className={cn(
                "sticky z-30 transition-[top] duration-300 left-0 right-0 backdrop-blur-md bg-background/80 py-2 -mx-2 px-2 sm:-mx-6 sm:px-6 mb-4 border-b border-border/30",
                isNavbarVisible ? "top-16" : "top-0"
              )}
            >
              <TabsList className="bg-muted/40 p-1 w-full flex justify-start overflow-x-auto no-scrollbar">
                <TabsTrigger value="songs" className="rounded-md ring-offset-background">Songs {songsQuery.data && `(${songsQuery.data.total})`}</TabsTrigger>
                <TabsTrigger value="albums" className="rounded-md ring-offset-background">Albums {albumsQuery.data && `(${albumsQuery.data.total})`}</TabsTrigger>
                <TabsTrigger value="artists" className="rounded-md ring-offset-background">Artists {artistsQuery.data && `(${artistsQuery.data.total})`}</TabsTrigger>
                <TabsTrigger value="playlists" className="rounded-md ring-offset-background">Playlists {playlistsQuery.data && `(${playlistsQuery.data.total})`}</TabsTrigger>
              </TabsList>
            </div>

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
                {songsQuery.data.results.map((song) => (
                  <SongRow key={song.id} song={song} />
                ))}
              </div>
            )}
            {songsQuery.data && songsQuery.data.total > 20 && (
              <PaginationControls page={page} total={songsQuery.data.total} pageSize={20} setPage={setPage} />
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
            {albumsQuery.data && albumsQuery.data.total > 20 && (
              <PaginationControls page={page} total={albumsQuery.data.total} pageSize={20} setPage={setPage} />
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
            {artistsQuery.data && artistsQuery.data.total > 20 && (
              <PaginationControls page={page} total={artistsQuery.data.total} pageSize={20} setPage={setPage} />
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
            {playlistsQuery.data && playlistsQuery.data.total > 20 && (
              <PaginationControls page={page} total={playlistsQuery.data.total} pageSize={20} setPage={setPage} />
            )}
          </TabsContent>
        </Tabs>
        </div>
      )}
    </div>
  )
}
