import { Link } from 'react-router-dom'
import type { Song } from '@/types'
import { formatDuration, decodeHtmlEntities } from '@/lib/utils'
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
    <div className="group flex items-center gap-2 md:gap-4 px-1 sm:px-4 py-3 hover:bg-muted/50 transition-colors rounded-lg">
      {/* Index */}
      {index !== undefined && (
        <span className="w-5 md:w-8 text-right text-xs md:text-sm text-muted-foreground tabular-nums">
          {index + 1}
        </span>
      )}

      {/* Cover art */}
      {showImage && (
        <Link to={`/song/${song.id}`} className="shrink-0 overflow-hidden shadow-sm hover:shadow-md transition-shadow rounded-md">
          <ImageWithFallback
            images={song.image}
            imageQuality="high"
            alt={decodeHtmlEntities(song.name)}
            className="h-12 w-12 md:h-14 md:w-14 object-cover"
          />
        </Link>
      )}

      {/* Song info */}
      <div className="flex-1 min-w-0 pr-4">
        <Link to={`/song/${song.id}`} className="block">
          <p className="text-base font-semibold text-foreground truncate hover:text-primary transition-colors">
            {decodeHtmlEntities(song.name)}
          </p>
        </Link>
        <p className="text-xs md:text-sm text-muted-foreground truncate mt-0.5">
          {primaryArtists.map((a, i) => (
            <span key={a.id}>
              {i > 0 && ', '}
              <Link to={`/artist/${a.id}`} className="hover:text-foreground transition-colors">
                {decodeHtmlEntities(a.name)}
              </Link>
            </span>
          ))}
        </p>
      </div>

      {/* Album */}
      {showAlbum && song.album?.id && (
        <Link
          to={`/album/${song.album.id}`}
          className="hidden md:block w-32 lg:w-48 text-sm text-muted-foreground truncate hover:text-foreground transition-colors"
        >
          {decodeHtmlEntities(song.album.name)}
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
