import { useState } from 'react'
import { Link as LinkIcon, Download, Trash2, RotateCcw, CheckCircle, XCircle, Loader2, Clock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { EmptyState } from '@/components/shared/EmptyState'
import { ImageWithFallback } from '@/components/shared/ImageWithFallback'
import { useDownloadStore } from '@/stores/download-store'
import { downloadManager } from '@/engine/download-manager'
import { getSongByLink } from '@/services/song.service'
import { getAlbumByLink } from '@/services/album.service'
import { getPlaylistByLink } from '@/services/playlist.service'
import type { Song } from '@/types'
import { toast } from 'sonner'

export function BatchPage() {
  const [links, setLinks] = useState('')
  const [resolving, setResolving] = useState(false)
  const [resolvedSongs, setResolvedSongs] = useState<Song[]>([])
  const queue = useDownloadStore((s) => s.queue)

  const handleResolve = async () => {
    const urls = links.split('\n').map((l) => l.trim()).filter(Boolean)
    if (urls.length === 0) return

    setResolving(true)
    const songs: Song[] = []

    for (const url of urls) {
      try {
        if (url.includes('/song/')) {
          const result = await getSongByLink(url)
          songs.push(...result)
        } else if (url.includes('/album/')) {
          const album = await getAlbumByLink(url)
          if (album.songs) songs.push(...album.songs)
        } else if (url.includes('/playlist/') || url.includes('/featured/')) {
          const playlist = await getPlaylistByLink(url)
          if (playlist.songs) songs.push(...playlist.songs)
        } else {
          // Try as song link
          const result = await getSongByLink(url)
          songs.push(...result)
        }
      } catch {
        toast.error(`Failed to resolve: ${url.substring(0, 50)}...`)
      }
    }

    setResolvedSongs(songs)
    setResolving(false)
    if (songs.length > 0) toast.success(`Resolved ${songs.length} tracks`)
  }

  const handleDownloadAll = () => {
    downloadManager.enqueueSongs(resolvedSongs)
    toast.success(`Queued ${resolvedSongs.length} tracks for download`)
  }

  const statusIcon = (status: string) => {
    switch (status) {
      case 'queued': return <Clock className="h-3.5 w-3.5 text-muted-foreground" />
      case 'downloading': case 'tagging': return <Loader2 className="h-3.5 w-3.5 text-primary animate-spin" />
      case 'complete': return <CheckCircle className="h-3.5 w-3.5 text-success" />
      case 'failed': return <XCircle className="h-3.5 w-3.5 text-destructive" />
      default: return null
    }
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-8 animate-fade-in">
      <h1 className="text-2xl font-bold text-foreground">Batch Download</h1>
      <p className="mt-1 text-sm text-muted-foreground">Paste multiple JioSaavn links to download them all at once</p>

      {/* Link input */}
      <div className="mt-6">
        <textarea
          value={links}
          onChange={(e) => setLinks(e.target.value)}
          placeholder={'Paste JioSaavn links here (one per line)\n\nhttps://www.jiosaavn.com/song/...\nhttps://www.jiosaavn.com/album/...\nhttps://www.jiosaavn.com/playlist/...'}
          className="w-full h-36 rounded-lg border border-input bg-transparent px-4 py-3 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring resize-none font-mono"
          id="batch-input"
        />
        <div className="mt-3 flex gap-2">
          <Button onClick={handleResolve} disabled={resolving || !links.trim()} className="gap-1.5">
            {resolving ? <Loader2 className="h-4 w-4 animate-spin" /> : <LinkIcon className="h-4 w-4" />}
            {resolving ? 'Resolving...' : 'Resolve Links'}
          </Button>
          {resolvedSongs.length > 0 && (
            <Button onClick={handleDownloadAll} variant="secondary" className="gap-1.5">
              <Download className="h-4 w-4" /> Download All ({resolvedSongs.length})
            </Button>
          )}
        </div>
      </div>

      {/* Resolved songs */}
      {resolvedSongs.length > 0 && (
        <section className="mt-8">
          <h2 className="text-base font-semibold text-foreground mb-3">Resolved Tracks ({resolvedSongs.length})</h2>
          <div className="space-y-1 rounded-lg border border-border overflow-hidden">
            {resolvedSongs.map((song, i) => {
              const qi = queue.find((q) => q.songId === song.id)
              return (
                <div key={`${song.id}-${i}`} className="flex items-center gap-3 px-4 py-2.5 hover:bg-muted/30 transition-colors">
                  <ImageWithFallback images={song.image} imageQuality="low" alt={song.name} className="h-9 w-9 rounded shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">{song.name}</p>
                    <p className="text-xs text-muted-foreground truncate">
                      {song.artists.primary.map((a) => a.name).join(', ')}
                    </p>
                  </div>
                  {qi && (
                    <div className="flex items-center gap-2">
                      {statusIcon(qi.status)}
                      {qi.status === 'downloading' && <Progress value={qi.progress} className="w-20 h-1" />}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </section>
      )}

      {/* Active queue */}
      {queue.length > 0 && (
        <section className="mt-8">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-base font-semibold text-foreground">Download Queue ({queue.length})</h2>
            <div className="flex gap-2">
              <Button variant="ghost" size="sm" onClick={() => useDownloadStore.getState().retryAllFailed()}>
                <RotateCcw className="h-3.5 w-3.5 mr-1" /> Retry Failed
              </Button>
              <Button variant="ghost" size="sm" onClick={() => useDownloadStore.getState().clearCompleted()}>
                <Trash2 className="h-3.5 w-3.5 mr-1" /> Clear Done
              </Button>
            </div>
          </div>
          <div className="space-y-1 rounded-lg border border-border overflow-hidden">
            {queue.map((item) => (
              <div key={item.id} className="flex items-center gap-3 px-4 py-2.5">
                <ImageWithFallback src={item.coverUrl} alt={item.songName} className="h-9 w-9 rounded shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">{item.songName}</p>
                  <p className="text-xs text-muted-foreground truncate">{item.artistName}</p>
                </div>
                <Badge variant={item.status === 'complete' ? 'success' : item.status === 'failed' ? 'destructive' : 'outline'} className="text-[10px] capitalize">
                  {item.status}
                </Badge>
                {(item.status === 'downloading' || item.status === 'tagging') && (
                  <Progress value={item.progress} className="w-20 h-1" />
                )}
                {item.status === 'failed' && (
                  <Button variant="ghost" size="icon-sm" onClick={() => { useDownloadStore.getState().retryFailed(item.id); downloadManager.processQueue() }}>
                    <RotateCcw className="h-3.5 w-3.5" />
                  </Button>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {resolvedSongs.length === 0 && queue.length === 0 && (
        <EmptyState
          icon={<LinkIcon className="h-12 w-12" />}
          title="No tracks yet"
          description="Paste JioSaavn links above and click Resolve to get started"
          className="mt-8"
        />
      )}
    </div>
  )
}
