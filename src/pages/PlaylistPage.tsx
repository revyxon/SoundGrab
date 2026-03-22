import { useParams } from 'react-router-dom'
import { Download, Music } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { usePlaylist } from '@/hooks/use-playlists'
import { ImageWithFallback } from '@/components/shared/ImageWithFallback'
import { SongRow } from '@/components/shared/SongRow'
import { PageHeaderSkeleton, SongListSkeleton } from '@/components/shared/Skeletons'
import { EmptyState } from '@/components/shared/EmptyState'
import { downloadManager } from '@/engine/download-manager'

export function PlaylistPage() {
  const { id } = useParams<{ id: string }>()
  const { data: playlist, isLoading, isError, refetch } = usePlaylist(id)

  if (isLoading) return <div className="mx-auto max-w-7xl px-4 sm:px-6 py-8"><PageHeaderSkeleton /><SongListSkeleton /></div>
  if (isError || !playlist) return <EmptyState title="Playlist not found" action={<Button variant="outline" onClick={() => refetch()}>Retry</Button>} />

  const handleDownloadAll = () => {
    if (playlist.songs) downloadManager.enqueueSongs(playlist.songs)
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-8 animate-fade-in">
      <div className="flex flex-col sm:flex-row gap-6 items-start">
        <ImageWithFallback images={playlist.image} imageQuality="high" alt={playlist.name} className="h-48 w-48 rounded-lg shrink-0 mx-auto sm:mx-0" />
        <div className="flex-1 min-w-0">
          <Badge variant="outline" className="mb-2 text-xs">Playlist</Badge>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">{playlist.name}</h1>
          {playlist.description && <p className="mt-1 text-sm text-muted-foreground">{playlist.description}</p>}
          <div className="mt-3 flex gap-4 text-sm text-muted-foreground">
            {playlist.songCount != null && <span className="flex items-center gap-1.5"><Music className="h-3.5 w-3.5" />{playlist.songCount} songs</span>}
            {playlist.language && <span className="capitalize">{playlist.language}</span>}
          </div>
          <div className="mt-5 flex gap-2">
            <Button onClick={handleDownloadAll} className="gap-1.5">
              <Download className="h-4 w-4" /> Download All
            </Button>
          </div>
        </div>
      </div>

      {playlist.songs && playlist.songs.length > 0 && (
        <section className="mt-8 space-y-0.5">
          {playlist.songs.map((song, i) => (
            <SongRow key={song.id} song={song} index={i} />
          ))}
        </section>
      )}
    </div>
  )
}
