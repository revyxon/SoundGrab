import { useParams, Link } from 'react-router-dom'
import { useState, useRef, useEffect } from 'react'
import { Clock, Disc3, Calendar, Globe, Headphones, CheckCircle2, Music, Play, Pause, Download, PlayCircle, PauseCircle, Share2, Copy } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'
import { useSong, useSongSuggestions } from '@/hooks/use-songs'
import { useArtist } from '@/hooks/use-artists'
import { ImageWithFallback } from '@/components/shared/ImageWithFallback'
import { DownloadButton } from '@/components/shared/DownloadButton'
import { SongRow } from '@/components/shared/SongRow'
import { PageHeaderSkeleton } from '@/components/shared/Skeletons'
import { EmptyState } from '@/components/shared/EmptyState'
import { QUALITY_OPTIONS } from '@/core/config'
import type { QualityValue } from '@/core/config'
import { formatDuration, formatCount, estimateFileSize, decodeHtmlEntities } from '@/lib/utils'
import { useSettingsStore } from '@/stores/settings-store'
import { cn } from '@/lib/utils'

function formatTime(seconds: number) {
  if (isNaN(seconds)) return '0:00'
  const m = Math.floor(seconds / 60)
  const s = Math.floor(seconds % 60)
  return `${m}:${s.toString().padStart(2, '0')}`
}

export function SongPage() {
  const { id } = useParams<{ id: string }>()
  const { data: song, isLoading, isError, refetch } = useSong(id)
  
  // Use artist's top songs as a robust fallback since API suggestions route is currently unstable
  const primaryArtistId = song?.artists.primary?.[0]?.id
  const { data: artistDetails } = useArtist(primaryArtistId || undefined)
  const { data: directSuggestions } = useSongSuggestions(id, 8)
  
  const suggestions = (directSuggestions && directSuggestions.length > 0) 
    ? directSuggestions 
    : (artistDetails?.topSongs?.filter(s => s.id !== id).slice(0, 8) || [])
  const defaultQuality = useSettingsStore((s) => s.defaultQuality)
  const [selectedQuality, setSelectedQuality] = useState<QualityValue>(defaultQuality)

  // Audio Player State
  const [isPlaying, setIsPlaying] = useState(false)
  const [progress, setProgress] = useState(0)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause()
      }
    }
  }, [id])

  if (isLoading) return <div className="mx-auto max-w-7xl px-4 sm:px-6 py-12"><PageHeaderSkeleton /></div>
  if (isError || !song) return (
    <EmptyState title="Song not found" description="We couldn't load this song" action={<Button variant="outline" onClick={() => refetch()}>Retry</Button>} />
  )

  const decodedSongName = decodeHtmlEntities(song.name)
  const decodedAlbumName = song.album.name ? decodeHtmlEntities(song.album.name) : undefined
  
  // Always try to play the best quality (320kbps) for preview
  const previewUrl = song.downloadUrl.find(d => d.quality === '320kbps')?.url || 
                    song.downloadUrl.find(d => d.quality === '160kbps')?.url || 
                    song.downloadUrl[0]?.url

  const togglePlay = () => {
    if (!audioRef.current) return
    if (isPlaying) {
      audioRef.current.pause()
    } else {
      audioRef.current.play()
    }
    setIsPlaying(!isPlaying)
  }

  const handleTimeUpdate = () => {
    if (!audioRef.current) return
    setCurrentTime(audioRef.current.currentTime)
    setDuration(audioRef.current.duration)
    setProgress((audioRef.current.currentTime / audioRef.current.duration) * 100)
  }

  const handleAudioEnded = () => {
    setIsPlaying(false)
    setProgress(0)
    setCurrentTime(0)
    if (audioRef.current) {
      audioRef.current.currentTime = 0
    }
  }

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value)
    if (audioRef.current && duration) {
      const seekTime = (value / 100) * duration
      audioRef.current.currentTime = seekTime
      setCurrentTime(seekTime)
      setProgress(value)
    }
  }

  return (
    <div className="min-h-screen pb-24 animate-fade-in bg-background">
      
      {/* Hidden Audio Element */}
      {previewUrl && (
        <audio 
          ref={audioRef} 
          src={previewUrl} 
          onTimeUpdate={handleTimeUpdate}
          onEnded={handleAudioEnded}
          onLoadedMetadata={() => setDuration(audioRef.current?.duration || 0)}
          preload="metadata"
        />
      )}

      <div className="mx-auto max-w-7xl px-4 sm:px-6 pt-8 md:pt-12">
        
        {/* Main Content: Left Art, Right Details */}
        <div className="flex flex-col md:flex-row gap-8 lg:gap-12 items-start mb-12">
          
          {/* Left Column: Cover Art */}
          <div className="w-full md:w-[320px] lg:w-[400px] shrink-0 group relative mx-auto md:mx-0">
             <ImageWithFallback
                images={song.image}
                imageQuality="high"
                alt={decodedSongName}
                className="w-full aspect-square object-cover rounded-2xl shadow-md border border-border/50"
              />
          </div>

          {/* Right Column: Title and Downloads */}
          <div className="flex-1 w-full min-w-0 pt-2 flex flex-col justify-center">
            <div className="flex items-center justify-between mb-4">
              <Badge variant="outline" className="w-fit text-[10px] sm:text-xs font-semibold uppercase tracking-widest text-muted-foreground border-border bg-transparent">
                {song.type || 'Single Track'}
              </Badge>
              
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8 text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors rounded-full"
                title="Share this song"
                onClick={() => {
                  const shareData = {
                    title: `SoundGrab - ${decodedSongName}`,
                    text: `Listen to ${decodedSongName} by ${song.artists.primary.map(a => decodeHtmlEntities(a.name)).join(', ')}`,
                    url: window.location.href,
                  }
                  if (navigator.share) {
                    navigator.share(shareData).catch(console.error)
                  } else {
                    navigator.clipboard.writeText(window.location.href)
                    toast.success('Link copied to clipboard')
                  }
                }}
              >
                <Share2 className="h-4 w-4" />
              </Button>
            </div>
            
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-foreground tracking-tight leading-tight mb-2">
              {decodedSongName}
            </h1>
            
            <div className="text-lg md:text-xl font-medium text-muted-foreground mb-4">
              {song.artists.primary.length > 0 ? (
                song.artists.primary.map((a, i) => (
                  <span key={a.id}>
                    {i > 0 && <span className="mx-2 opacity-30">•</span>}
                    <Link to={`/artist/${a.id}`} className="hover:text-foreground transition-colors hover:underline">
                      {decodeHtmlEntities(a.name)}
                    </Link>
                  </span>
                ))
              ) : (
                <span>Unknown Artist</span>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm font-medium text-muted-foreground mb-8">
              {decodedAlbumName && (
                <Link to={`/album/${song.album.id}`} className="flex items-center gap-1.5 hover:text-foreground transition-colors">
                  <Disc3 className="h-4 w-4" />
                  <span className="truncate max-w-[200px]">{decodedAlbumName}</span>
                </Link>
              )}
              {song.duration && (
                <div className="flex items-center gap-1.5">
                  <Clock className="h-4 w-4" />
                  <span>{formatDuration(song.duration)}</span>
                </div>
              )}
              {song.year && (
                <div className="flex items-center gap-1.5">
                  <Calendar className="h-4 w-4" />
                  <span>{song.year}</span>
                </div>
              )}
              {song.playCount && (
                <div className="flex items-center gap-1.5">
                  <Headphones className="h-4 w-4" />
                  <span>{formatCount(song.playCount)}</span>
                </div>
              )}
            </div>

            {/* AUDIO PLAYER CARD */}
            <div className="bg-card/40 border border-border/80 rounded-xl p-4 sm:p-5 mb-10 w-full max-w-xl">
               <div className="flex items-center gap-4">
                  <button 
                    onClick={togglePlay}
                    className="w-12 h-12 shrink-0 bg-primary text-primary-foreground rounded-full flex items-center justify-center hover:scale-105 active:scale-95 transition-transform shadow-md"
                  >
                    {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5 ml-0.5" />}
                  </button>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center text-xs font-medium text-muted-foreground mb-2">
                      <span className="w-10 tabular-nums">{formatTime(currentTime)}</span>
                      <span className="truncate px-2 flex-1 text-center font-semibold text-foreground">{decodedSongName}</span>
                      <span className="w-10 tabular-nums text-right">{formatTime(duration)}</span>
                    </div>
                    {/* Native Range Slider */}
                    <div className="relative group cursor-pointer flex items-center h-4">
                      {/* Custom track background */}
                      <div className="absolute left-0 right-0 h-1.5 bg-muted rounded-full pointer-events-none" />
                      {/* Active progress track */}
                      <div 
                        className="absolute left-0 h-1.5 bg-primary rounded-full pointer-events-none transition-all duration-100 ease-linear" 
                        style={{ width: `${progress}%` }} 
                      />
                      {/* Actual input slider overlaying everything, clear opacity but capturing events */}
                      <input 
                        type="range" 
                        min="0" 
                        max="100" 
                        value={progress || 0}
                        onChange={handleSeek}
                        className="w-full absolute inset-0 opacity-0 cursor-pointer"
                      />
                      {/* Custom thumb (purely visual, syncs with progress) */}
                      <div 
                        className="absolute h-3 w-3 bg-white border border-primary/20 rounded-full shadow-sm pointer-events-none transition-transform group-hover:scale-110" 
                        style={{ left: `calc(${progress}% - 6px)` }}
                      />
                    </div>
                  </div>
               </div>
            </div>

            {/* Download Options */}
            <div>
              <h2 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
                <Download className="h-5 w-5 text-primary" /> Select Standard
              </h2>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {QUALITY_OPTIONS.map(({ value, label, kbps, description }) => {
                  const isAvailable = song.downloadUrl.some((d) => d.quality === value)
                  const isSelected = selectedQuality === value

                  return (
                    <button
                      key={value}
                      onClick={() => isAvailable && setSelectedQuality(value)}
                      disabled={!isAvailable}
                      className={cn(
                        "relative flex flex-col items-start p-4 text-left border rounded-xl transition-all duration-200",
                        isSelected 
                          ? "border-primary bg-primary/[0.04] ring-1 ring-primary/20" 
                          : isAvailable 
                            ? "border-border/60 bg-transparent hover:border-primary/40 hover:bg-muted/50" 
                            : "border-border/30 opacity-40 cursor-not-allowed grayscale bg-transparent"
                      )}
                    >
                      <div className="flex items-center justify-between w-full mb-1">
                        <span className={cn("text-xs font-bold uppercase tracking-wider", isSelected ? "text-primary" : "text-muted-foreground")}>
                          {description}
                        </span>
                        {isSelected && <CheckCircle2 className="h-3.5 w-3.5 text-primary" />}
                      </div>
                      
                      <div className={cn("text-base font-extrabold mb-3", isSelected ? "text-foreground" : "text-foreground/80")}>
                        {label}
                      </div>

                      <div className="flex items-center justify-between w-full mt-auto pt-2 border-t border-border/40">
                         <span className="text-[10px] font-mono text-muted-foreground bg-muted/50 px-1.5 py-0.5 rounded">
                           {estimateFileSize(song.duration, kbps)}
                         </span>
                         {!isAvailable && <span className="text-[9px] font-bold text-destructive/70 uppercase">Missing</span>}
                      </div>
                    </button>
                  )
                })}
              </div>

              <div className="mt-8">
                <DownloadButton 
                  song={song} 
                  quality={selectedQuality} 
                  showLabel 
                  className="w-full sm:w-auto h-13 rounded-xl px-10 text-base font-bold transition-all shadow-lg shadow-primary/10 active:scale-[0.97]"
                />
              </div>
            </div>

          </div>
        </div>

        {/* BOTTOM METADATA AND SUGGESTIONS */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mt-16 pt-10 border-t border-border/50">
           {/* Advanced Metadata */}
           <section className="lg:col-span-2">
              <h3 className="text-lg font-bold text-foreground mb-4">Track Information</h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-y-6 gap-x-4 text-sm bg-card/30 p-6 rounded-xl border border-border/50">
                <div className="flex flex-col">
                  <span className="text-muted-foreground text-[10px] uppercase tracking-wider mb-1 font-semibold">Release Date</span>
                  <span className="font-medium text-foreground">{song.releaseDate || song.year || 'Unknown'}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-muted-foreground text-[10px] uppercase tracking-wider mb-1 font-semibold">Language</span>
                  <span className="font-medium text-foreground capitalize">{song.language || 'Unknown'}</span>
                </div>
                <div className="flex flex-col col-span-2">
                  <span className="text-muted-foreground text-[10px] uppercase tracking-wider mb-1 font-semibold">Label</span>
                  <span className="font-medium text-foreground line-clamp-1">{decodeHtmlEntities(song.label || 'Unknown')}</span>
                </div>
                <div className="flex flex-col col-span-2 sm:col-span-4">
                  <span className="text-muted-foreground text-[10px] uppercase tracking-wider mb-1 font-semibold">Copyright</span>
                  <span className="text-foreground text-xs leading-relaxed">{decodeHtmlEntities(song.copyright || 'None provided')}</span>
                </div>
              </div>
           </section>

          {/* Sidebar Area */}
          {suggestions && suggestions.length > 0 && (
            <div className="lg:col-span-1">
              <h2 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
                <Music className="h-5 w-5 text-primary" /> Similar Tracks
              </h2>
              <div className="space-y-0.5">
                {suggestions.map((s, i) => (
                  <SongRow key={s.id} song={s} index={i} />
                ))}
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  )
}
