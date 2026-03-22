import { Music } from 'lucide-react'

export function Footer() {
  return (
    <footer className="border-t border-border bg-background py-6 mt-auto">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Music className="h-4 w-4 text-primary" />
            <span>SoundGrab</span>
            <span className="text-border">•</span>
            <span>Music Downloader</span>
          </div>
          <div className="flex items-center gap-4">
            <span>
              Powered by{' '}
              <a
                href="https://saavn.dev"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                JioSaavn API
              </a>
            </span>
          </div>
        </div>
      </div>
    </footer>
  )
}
