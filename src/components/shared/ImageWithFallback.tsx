import { useState } from 'react'
import { cn, getImageUrl } from '@/lib/utils'

interface ImageWithFallbackProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  images?: { quality: string; url: string }[]
  imageQuality?: 'low' | 'medium' | 'high'
  fallbackClassName?: string
}

export function ImageWithFallback({
  images,
  imageQuality = 'medium',
  src,
  alt,
  className,
  fallbackClassName,
  ...props
}: ImageWithFallbackProps) {
  const [hasError, setHasError] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)

  const imgSrc = src || getImageUrl(images, imageQuality)

  if (!imgSrc || hasError) {
    return (
      <div className={cn('flex items-center justify-center bg-muted text-muted-foreground', fallbackClassName || className)}>
        <svg className="h-6 w-6 opacity-40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2z" />
        </svg>
      </div>
    )
  }

  return (
    <div className={cn('relative overflow-hidden', className)}>
      {!isLoaded && <div className="absolute inset-0 animate-skeleton bg-muted" />}
      <img
        src={imgSrc}
        alt={alt}
        className={cn('h-full w-full object-cover transition-opacity duration-300', isLoaded ? 'opacity-100' : 'opacity-0')}
        loading="lazy"
        onLoad={() => setIsLoaded(true)}
        onError={() => setHasError(true)}
        {...props}
      />
    </div>
  )
}
