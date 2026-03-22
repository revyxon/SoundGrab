import { Link } from 'react-router-dom'
import type { AlbumSearchResult, AlbumDetail } from '@/types'
import { ImageWithFallback } from './ImageWithFallback'

interface AlbumCardProps {
  album: AlbumSearchResult | AlbumDetail
}

export function AlbumCard({ album }: AlbumCardProps) {
  const primaryArtist = album.artists.primary.map((a) => a.name).join(', ') || 'Unknown'

  return (
    <Link
      to={`/album/${album.id}`}
      className="group flex flex-col gap-2 p-3 rounded-lg border border-transparent hover:border-border hover:bg-muted/30 transition-all"
    >
      <ImageWithFallback
        images={album.image}
        imageQuality="medium"
        alt={album.name}
        className="aspect-square w-full rounded-md"
      />
      <div className="min-w-0">
        <p className="text-sm font-medium text-foreground truncate group-hover:text-primary transition-colors">
          {album.name}
        </p>
        <p className="text-xs text-muted-foreground truncate mt-0.5">
          {primaryArtist}
          {album.year && <span> · {album.year}</span>}
        </p>
      </div>
    </Link>
  )
}
