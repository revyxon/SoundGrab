import { useParams, Link } from 'react-router-dom'
import { Download, Clock, Calendar, Disc3, Globe } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useAlbum } from '@/hooks/use-albums'
import { ImageWithFallback } from '@/components/shared/ImageWithFallback'
import { SongRow } from '@/components/shared/SongRow'
import { PageHeaderSkeleton, SongListSkeleton } from '@/components/shared/Skeletons'
import { EmptyState } from '@/components/shared/EmptyState'
import { downloadManager } from '@/engine/download-manager'
import { formatDuration, formatCount } from '@/lib/utils'

export function AlbumPage() {
  const { id } = useParams<{ id: string }>()
  const { data: album, isLoading, isError, refetch } = useAlbum(id)

  if (isLoading) return <div className="mx-auto max-w-7xl px-4 sm:px-6 py-8"><PageHeaderSkeleton /><SongListSkeleton /></div>
  if (isError || !album) return <EmptyState title="Album not found" action={<Button variant="outline" onClick={() => refetch()}>Retry</Button>} />

  const primaryArtist = album.artists.primary.map((a) => a.name).join(', ') || 'Unknown'
  const totalDuration = album.songs?.reduce((acc, s) => acc + (s.duration || 0), 0) || 0

  const handleDownloadAll = () => {
    if (album.songs) downloadManager.enqueueSongs(album.songs)
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-6 items-start">
        <ImageWithFallback images={album.image} imageQuality="high" alt={album.name} className="h-48 w-48 rounded-lg shrink-0 mx-auto sm:mx-0" />
        <div className="flex-1 min-w-0">
          <Badge variant="outline" className="mb-2 text-xs">Album</Badge>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">{album.name}</h1>
          <p className="mt-1 text-muted-foreground">
            {album.artists.primary.map((a, i) => (
              <span key={a.id}>{i > 0 && ', '}<Link to={`/artist/${a.id}`} className="hover:text-foreground hover:underline transition-colors">{a.name}</Link></span>
            ))}
          </p>
          <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1 text-sm text-muted-foreground">
            {album.year && <span className="flex items-center gap-1.5"><Calendar className="h-3.5 w-3.5" />{album.year}</span>}
            {album.songCount && <span className="flex items-center gap-1.5"><Disc3 className="h-3.5 w-3.5" />{album.songCount} songs</span>}
            {totalDuration > 0 && <span className="flex items-center gap-1.5"><Clock className="h-3.5 w-3.5" />{formatDuration(totalDuration)}</span>}
            {album.language && <span className="flex items-center gap-1.5"><Globe className="h-3.5 w-3.5 capitalize" />{album.language}</span>}
            {album.playCount && <span>{formatCount(album.playCount)} plays</span>}
          </div>
          <div className="mt-5 flex gap-2">
            <Button onClick={handleDownloadAll} className="gap-1.5">
              <Download className="h-4 w-4" /> Download All
            </Button>
          </div>
        </div>
      </div>

      {/* Track list */}
      {album.songs && album.songs.length > 0 && (
        <section className="mt-8">
          <div className="hidden sm:flex items-center gap-3 px-4 py-2 text-xs text-muted-foreground border-b border-border mb-1">
            <span className="w-6 text-right">#</span>
            <span className="w-10" />
            <span className="flex-1">Title</span>
            <span className="hidden sm:block w-12 text-right">Duration</span>
            <span className="w-8" />
          </div>
          {album.songs.map((song, i) => (
            <SongRow key={song.id} song={song} index={i} showAlbum={false} trackNumber={i + 1} />
          ))}
        </section>
      )}
    </div>
  )
}
