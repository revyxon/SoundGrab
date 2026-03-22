import { useParams } from 'react-router-dom'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { useArtist, useArtistSongs, useArtistAlbums } from '@/hooks/use-artists'
import { ImageWithFallback } from '@/components/shared/ImageWithFallback'
import { SongRow } from '@/components/shared/SongRow'
import { AlbumCard } from '@/components/shared/AlbumCard'
import { PageHeaderSkeleton } from '@/components/shared/Skeletons'
import { EmptyState } from '@/components/shared/EmptyState'
import { PaginationControls } from '@/components/shared/PaginationControls'
import { useState, useMemo } from 'react'
import { BadgeCheck, Users, Heart, Globe, ChevronLeft, ChevronRight } from 'lucide-react'

function parseBio(bioArray: unknown[] | null): string {
  if (!bioArray || !Array.isArray(bioArray) || bioArray.length === 0) return ''
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const texts = bioArray.map((b: any) => b.text).filter(Boolean)
  return texts.join('\n\n')
}

function formatCount(num: number | string | null): string {
  if (!num) return '0'
  const val = typeof num === 'string' ? parseInt(num.replace(/,/g, ''), 10) : num
  if (isNaN(val)) return '0'
  if (val >= 1000000) return (val / 1000000).toFixed(1) + 'M'
  if (val >= 1000) return (val / 1000).toFixed(1) + 'K'
  return val.toString()
}

export function ArtistPage() {
  const { id } = useParams<{ id: string }>()
  const { data: artist, isLoading, isError, refetch } = useArtist(id)
  
  const [songsPage, setSongsPage] = useState(0)
  const [albumsPage, setAlbumsPage] = useState(0)
  
  const { data: songsPaginated } = useArtistSongs(id, songsPage)
  const { data: albumsPaginated } = useArtistAlbums(id, albumsPage)

  const parsedBio = useMemo(() => parseBio(artist?.bio ?? null), [artist])

  if (isLoading) return <div className="mx-auto max-w-7xl px-4 sm:px-6 py-12"><PageHeaderSkeleton /></div>
  if (isError || !artist) return <EmptyState title="Artist not found" action={<Button variant="outline" onClick={() => refetch()}>Wait and retry</Button>} />

  const topSongs = artist?.topSongs ?? []
  const singles = artist?.singles ?? []

  return (
    <div className="min-h-screen bg-background text-foreground pb-24 animate-fade-in relative z-0">
      
      {/* 1. HERO BLOCK */}
      <section className="relative px-4 sm:px-6 py-12 md:py-20 border-b border-border/40 overflow-hidden">
        {/* Subtle background glow from artist image */}
        {artist.image?.[2]?.url && (
          <div 
            className="absolute inset-x-0 top-0 h-[400px] opacity-10 bg-cover bg-center -z-10 blur-3xl pointer-events-none"
            style={{ backgroundImage: `url(${artist.image[2].url})` }}
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent -z-10" />

        <div className="mx-auto max-w-6xl flex flex-col md:flex-row gap-8 md:gap-12 items-center md:items-start relative z-10">
          <ImageWithFallback 
            images={artist.image} 
            imageQuality="high" 
            alt={artist.name} 
            className="h-48 w-48 md:h-64 md:w-64 rounded-full object-cover shadow-2xl ring-4 ring-background/50 outline outline-1 outline-border/50 shrink-0 select-none pointer-events-none" 
          />
          
          <div className="text-center md:text-left flex-1 min-w-0">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-muted/50 rounded-md border border-border/40 text-foreground text-[11px] font-bold uppercase tracking-widest mb-4">
              {artist.dominantType || 'Artist'} {artist.isVerified && <BadgeCheck className="h-4 w-4 text-primary ml-1" />}
            </div>
            
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tight mb-6 truncate max-w-full">
              {artist.name}
            </h1>
            
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 md:gap-8 mb-6">
              {artist.followerCount ? (
                <div className="flex items-center gap-2 text-muted-foreground text-sm font-medium">
                  <Users className="h-4 w-4" /> 
                  <span className="text-foreground font-bold">{formatCount(artist.followerCount)}</span> followers
                </div>
              ) : null}
              {artist.fanCount && (
                 <div className="flex items-center gap-2 text-muted-foreground text-sm font-medium">
                  <Heart className="h-4 w-4" /> 
                  <span className="text-foreground font-bold">{formatCount(artist.fanCount)}</span> fans
                </div>
              )}
              {artist.dominantLanguage && (
                 <div className="flex items-center gap-2 text-muted-foreground text-sm font-medium capitalize">
                  <Globe className="h-4 w-4" /> 
                  {artist.dominantLanguage}
                </div>
              )}
            </div>

            {parsedBio && (
              <p className="text-muted-foreground leading-relaxed line-clamp-3 md:line-clamp-4 max-w-3xl text-sm md:text-base">
                {parsedBio}
              </p>
            )}
          </div>
        </div>
      </section>

      {/* 2. MAIN CONTENT TABS */}
      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-12">
        <Tabs defaultValue="songs" className="w-full">
          <TabsList className="w-full sm:w-auto grid grid-cols-3 bg-muted/30 p-1 mb-8">
            <TabsTrigger value="songs" className="font-semibold tracking-wide">Songs</TabsTrigger>
            <TabsTrigger value="albums" className="font-semibold tracking-wide">Albums</TabsTrigger>
            <TabsTrigger value="singles" className="font-semibold tracking-wide">Singles</TabsTrigger>
          </TabsList>

          <TabsContent value="songs" className="mt-0">
            {songsPaginated?.results && songsPaginated.results.length > 0 ? (
              <div className="bg-card/30 border border-border/40 rounded-2xl p-2 sm:p-4">
                <div className="space-y-0.5">
                  {songsPaginated.results.map((song, i) => (
                    <SongRow key={song.id} song={song} index={i + songsPage * 10} />
                  ))}
                </div>
                {songsPaginated.total > 10 && (
                   <PaginationControls 
                     page={songsPage} 
                     total={songsPaginated.total} 
                     pageSize={10} 
                     setPage={setSongsPage} 
                   />
                )}
              </div>
            ) : topSongs && topSongs.length > 0 ? (
              <div className="bg-card/30 border border-border/40 rounded-2xl p-2 sm:p-4">
                <div className="space-y-0.5">
                  {topSongs.map((song, i) => (
                    <SongRow key={song.id} song={song} index={i} />
                  ))}
                </div>
              </div>
            ) : (
              <EmptyState title="No songs found for this artist" />
            )}
          </TabsContent>

          <TabsContent value="albums" className="mt-0">
            {albumsPaginated?.results && albumsPaginated.results.length > 0 ? (
              <div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 lg:gap-4">
                  {albumsPaginated.results.map((album) => (
                    <AlbumCard key={album.id} album={album} />
                  ))}
                </div>
                {albumsPaginated.total > 10 && (
                   <PaginationControls 
                     page={albumsPage} 
                     total={albumsPaginated.total} 
                     pageSize={10} 
                     setPage={setAlbumsPage} 
                   />
                )}
              </div>
            ) : (
              <EmptyState title="No albums found" />
            )}
          </TabsContent>

          <TabsContent value="singles" className="mt-0">
            {singles.length > 0 ? (
              <div className="bg-card/30 border border-border/40 rounded-2xl p-2 sm:p-4">
                <div className="space-y-0.5">
                  {singles.map((song, i) => (
                    <SongRow key={song.id} song={song} index={i} />
                  ))}
                </div>
              </div>
            ) : (
              <EmptyState title="No singles found from this artist" />
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
