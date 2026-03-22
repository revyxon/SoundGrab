import { useState } from 'react'
import { Download, Check, Loader2, RotateCcw } from 'lucide-react'
import { Button, type ButtonProps } from '@/components/ui/button'
import { useDownloadStore } from '@/stores/download-store'
import { downloadManager } from '@/engine/download-manager'
import type { Song } from '@/types'
import type { QualityValue } from '@/core/config'
import { cn } from '@/lib/utils'

interface DownloadButtonProps extends Omit<ButtonProps, 'onClick'> {
  song: Song
  quality?: QualityValue
  trackNumber?: number
  showLabel?: boolean
}

export function DownloadButton({ song, quality, trackNumber, showLabel = false, className, size = 'icon-sm', ...props }: DownloadButtonProps) {
  const [justCompleted, setJustCompleted] = useState(false)
  const queueItem = useDownloadStore((s) => s.queue.find((d) => d.songId === song.id))
  const isInHistory = useDownloadStore((s) => s.isInHistory(song.id))

  const status = queueItem?.status
  const isActive = status === 'downloading' || status === 'tagging'
  const isQueued = status === 'queued'
  const isFailed = status === 'failed'
  const isComplete = status === 'complete' || justCompleted

  const handleClick = async () => {
    if (isActive || isQueued) return

    if (isFailed && queueItem) {
      useDownloadStore.getState().retryFailed(queueItem.id)
      downloadManager.processQueue()
      return
    }

    await downloadManager.enqueueSong(song, quality, trackNumber)
    setJustCompleted(false)
  }

  const icon = isActive ? (
    <Loader2 className="h-3.5 w-3.5 animate-spin" />
  ) : isComplete ? (
    <Check className="h-3.5 w-3.5" />
  ) : isFailed ? (
    <RotateCcw className="h-3.5 w-3.5" />
  ) : (
    <Download className="h-3.5 w-3.5" />
  )

  const label = isActive ? 'Downloading...' : isQueued ? 'Queued' : isComplete ? 'Downloaded' : isFailed ? 'Retry' : isInHistory ? 'Re-download' : 'Download'

  return (
    <Button
      variant={isComplete ? 'secondary' : isFailed ? 'destructive' : 'default'}
      size={showLabel ? 'default' : size}
      className={cn('gap-1.5', className)}
      onClick={handleClick}
      disabled={isActive || isQueued}
      {...props}
    >
      {icon}
      {showLabel && <span className="text-sm">{label}</span>}
    </Button>
  )
}
