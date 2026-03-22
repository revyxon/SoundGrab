import { Clock, Download, Trash2, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { EmptyState } from '@/components/shared/EmptyState'
import { ImageWithFallback } from '@/components/shared/ImageWithFallback'
import { useDownloadStore } from '@/stores/download-store'
import { downloadManager } from '@/engine/download-manager'
import { getSongById } from '@/services/song.service'
import { formatDistanceToNow } from 'date-fns'
import { useState } from 'react'
import { toast } from 'sonner'

export function HistoryPage() {
  const { history, removeFromHistory, clearHistory } = useDownloadStore()
  const [filter, setFilter] = useState('')

  const filtered = filter
    ? history.filter(
        (h) =>
          h.songName.toLowerCase().includes(filter.toLowerCase()) ||
          h.artistName.toLowerCase().includes(filter.toLowerCase())
      )
    : history

  const handleRedownload = async (songId: string) => {
    try {
      const songs = await getSongById(songId)
      if (songs[0]) {
        await downloadManager.enqueueSong(songs[0])
        toast.success('Queued for re-download')
      }
    } catch {
      toast.error('Failed to re-download')
    }
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-8 animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Download History</h1>
          <p className="text-sm text-muted-foreground mt-1">{history.length} downloads tracked</p>
        </div>
        {history.length > 0 && (
          <Button variant="ghost" size="sm" onClick={clearHistory} className="text-muted-foreground gap-1.5">
            <Trash2 className="h-3.5 w-3.5" /> Clear All
          </Button>
        )}
      </div>

      {/* Filter */}
      {history.length > 5 && (
        <div className="relative max-w-sm mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            placeholder="Filter history..."
            className="pl-9"
          />
        </div>
      )}

      {history.length === 0 && (
        <EmptyState
          icon={<Clock className="h-12 w-12" />}
          title="No download history"
          description="Your downloaded songs will appear here"
        />
      )}

      {filtered.length > 0 && (
        <div className="rounded-lg border border-border overflow-hidden">
          {/* Table header */}
          <div className="hidden sm:grid grid-cols-[1fr_auto_auto_auto] gap-4 px-4 py-2.5 text-xs text-muted-foreground bg-muted/30 border-b border-border">
            <span>Song</span>
            <span className="w-16 text-center">Quality</span>
            <span className="w-28 text-right">Downloaded</span>
            <span className="w-20" />
          </div>

          {filtered.map((item) => (
            <div key={item.id} className="grid grid-cols-1 sm:grid-cols-[1fr_auto_auto_auto] gap-2 sm:gap-4 items-center px-4 py-3 border-b border-border last:border-b-0 hover:bg-muted/20 transition-colors">
              <div className="flex items-center gap-3 min-w-0">
                <ImageWithFallback src={item.coverUrl} alt={item.songName} className="h-10 w-10 rounded shrink-0" />
                <div className="min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">{item.songName}</p>
                  <p className="text-xs text-muted-foreground truncate">{item.artistName}</p>
                </div>
              </div>
              <Badge variant="outline" className="justify-self-center text-[10px]">{item.quality}</Badge>
              <span className="text-xs text-muted-foreground text-right">
                {formatDistanceToNow(item.timestamp, { addSuffix: true })}
              </span>
              <div className="flex gap-1 justify-end">
                <Button variant="ghost" size="icon-sm" onClick={() => handleRedownload(item.songId)} title="Re-download">
                  <Download className="h-3.5 w-3.5" />
                </Button>
                <Button variant="ghost" size="icon-sm" onClick={() => removeFromHistory(item.id)} title="Remove">
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
