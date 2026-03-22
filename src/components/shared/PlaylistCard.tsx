import { Link } from 'react-router-dom'
import type { Playlist } from '@/types'
import { ImageWithFallback } from './ImageWithFallback'

interface PlaylistCardProps {
  playlist: Playlist
}

export function PlaylistCard({ playlist }: PlaylistCardProps) {
  return (
    <Link
      to={`/playlist/${playlist.id}`}
      className="group flex flex-col gap-2 p-3 rounded-lg border border-transparent hover:border-border hover:bg-muted/30 transition-all"
    >
      <ImageWithFallback
        images={playlist.image}
        imageQuality="medium"
        alt={playlist.name}
        className="aspect-square w-full rounded-md"
      />
      <div className="min-w-0">
        <p className="text-sm font-medium text-foreground truncate group-hover:text-primary transition-colors">
          {playlist.name}
        </p>
        <p className="text-xs text-muted-foreground mt-0.5">
          {playlist.songCount != null ? `${playlist.songCount} songs` : playlist.language}
        </p>
      </div>
    </Link>
  )
}
