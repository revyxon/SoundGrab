import { Link } from 'react-router-dom'
import type { Song } from '@/types'
import { formatDuration } from '@/lib/utils'
import { ImageWithFallback } from './ImageWithFallback'
import { DownloadButton } from './DownloadButton'
import { Badge } from '@/components/ui/badge'

interface SongRowProps {
  song: Song
  index?: number
  showAlbum?: boolean
  showImage?: boolean
  trackNumber?: number
}

export function SongRow({ song, index, showAlbum = true, showImage = true, trackNumber }: SongRowProps) {
  const primaryArtists = song.artists?.primary ?? []
  const maxQuality = song.downloadUrl?.[song.downloadUrl.length - 1]?.quality || '—'

  return (
    <div className="group flex items-center gap-3 px-4 py-2.5 hover:bg-muted/50 transition-colors rounded-md">
      {/* Index */}
      {index !== undefined && (
        <span className="w-6 text-right text-xs text-muted-foreground tabular-nums">
          {index + 1}
        </span>
      )}

      {/* Cover art */}
      {showImage && (
        <Link to={`/song/${song.id}`} className="shrink-0">
          <ImageWithFallback
            images={song.image}
            imageQuality="low"
            alt={song.name}
            className="h-10 w-10 rounded-md"
          />
        </Link>
      )}

      {/* Song info */}
      <div className="flex-1 min-w-0">
        <Link to={`/song/${song.id}`} className="block">
          <p className="text-sm font-medium text-foreground truncate hover:text-primary transition-colors">
            {song.name}
          </p>
        </Link>
        <p className="text-xs text-muted-foreground truncate">
          {primaryArtists.map((a, i) => (
            <span key={a.id}>
              {i > 0 && ', '}
              <Link to={`/artist/${a.id}`} className="hover:text-foreground transition-colors">
                {a.name}
              </Link>
            </span>
          ))}
        </p>
      </div>

      {/* Album */}
      {showAlbum && song.album?.id && (
        <Link
          to={`/album/${song.album.id}`}
          className="hidden md:block w-40 text-xs text-muted-foreground truncate hover:text-foreground transition-colors"
        >
          {song.album.name}
        </Link>
      )}

      {/* Duration */}
      <span className="hidden sm:block w-12 text-right text-xs text-muted-foreground tabular-nums">
        {formatDuration(song.duration)}
      </span>

      {/* Quality badge */}
      <Badge variant="outline" className="hidden lg:inline-flex text-[10px] px-1.5">
        {maxQuality}
      </Badge>

      {/* Download */}
      <DownloadButton song={song} trackNumber={trackNumber} />
    </div>
  )
}
