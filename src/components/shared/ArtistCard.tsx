import { Link } from 'react-router-dom'
import type { Artist } from '@/types'
import { ImageWithFallback } from './ImageWithFallback'

interface ArtistCardProps {
  artist: Artist
}

export function ArtistCard({ artist }: ArtistCardProps) {
  return (
    <Link
      to={`/artist/${artist.id}`}
      className="group flex flex-col items-center gap-2 p-3 rounded-lg hover:bg-muted/30 transition-all"
    >
      <ImageWithFallback
        images={artist.image}
        imageQuality="medium"
        alt={artist.name}
        className="h-20 w-20 rounded-full"
      />
      <div className="text-center min-w-0 w-full">
        <p className="text-sm font-medium text-foreground truncate group-hover:text-primary transition-colors">
          {artist.name}
        </p>
        {artist.role && (
          <p className="text-xs text-muted-foreground capitalize">{artist.role}</p>
        )}
      </div>
    </Link>
  )
}
