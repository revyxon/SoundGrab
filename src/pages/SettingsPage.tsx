import { Sun, Moon, Monitor, FileText, Palette, Database, RotateCcw, Zap, Server } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useSettingsStore, type Theme } from '@/stores/settings-store'
import { useDownloadStore } from '@/stores/download-store'
import { QUALITY_OPTIONS, FILE_NAME_PATTERNS, type QualityValue } from '@/core/config'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

export function SettingsPage() {
  const settings = useSettingsStore()
  const { history, clearHistory } = useDownloadStore()

  const themes: { value: Theme; label: string; icon: React.ReactNode }[] = [
    { value: 'light', label: 'Light', icon: <Sun className="h-4 w-4" /> },
    { value: 'dark', label: 'Dark', icon: <Moon className="h-4 w-4" /> },
    { value: 'system', label: 'Auto', icon: <Monitor className="h-4 w-4" /> },
  ]

  const handleExportHistory = () => {
    const blob = new Blob([JSON.stringify(history, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'soundgrab-history.json'
    a.click()
    URL.revokeObjectURL(url)
    toast.success('History exported successfully')
  }

  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 py-12 md:py-20 animate-fade-in bg-background">
      
      {/* Header */}
      <header className="mb-12">
        <h1 className="text-3xl md:text-4xl font-extrabold text-foreground tracking-tight mb-2">
          Preferences
        </h1>
        <p className="text-base text-muted-foreground">
          Customize your experience, tune download behaviors, and manage your local data.
        </p>
      </header>

      <div className="space-y-12">
        
        {/* APPEARANCE */}
        <section>
          <div className="flex items-center gap-3 mb-4 pb-2 border-b border-border/50">
            <Palette className="h-4 w-4 text-primary" />
            <h2 className="text-lg font-bold text-foreground tracking-tight">Appearance</h2>
          </div>
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between py-2 gap-4">
             <div>
                <p className="text-sm font-semibold text-foreground">Theme Preference</p>
                <p className="text-sm text-muted-foreground">Select how the application looks.</p>
             </div>
            <div className="flex items-center p-1 bg-muted/40 rounded-lg border border-border/50 shrink-0">
              {themes.map(({ value, label, icon }) => (
                <button
                  key={value}
                  onClick={() => settings.setTheme(value)}
                  className={cn(
                    'flex items-center gap-2 px-4 py-1.5 rounded-md text-sm font-medium transition-all',
                    settings.theme === value 
                      ? 'bg-background shadow-sm text-primary border border-border/40' 
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted/80 border border-transparent'
                  )}
                >
                  {icon}
                  {label}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* DOWNLOAD BEHAVIOR */}
        <section>
          <div className="flex items-center gap-3 mb-4 pb-2 border-b border-border/50">
            <Zap className="h-4 w-4 text-primary" />
            <h2 className="text-lg font-bold text-foreground tracking-tight">Download Engine</h2>
          </div>

          <div className="flex flex-col gap-6 py-2">
            
            {/* Auto ID3 Tagging */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <p className="text-sm font-semibold text-foreground">Auto Metadata Injection</p>
                <p className="text-sm text-muted-foreground">Automatically embed ID3 tags and cover art.</p>
              </div>
              <button
                onClick={() => settings.setAutoTag(!settings.autoTag)}
                className={cn(
                  'relative w-11 h-6 rounded-full transition-colors cursor-pointer shrink-0 outline-none',
                  settings.autoTag ? 'bg-primary' : 'bg-muted-foreground/30'
                )}
              >
                <span className={cn(
                  'absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-background shadow-sm transition-transform duration-200 ease-in-out',
                  settings.autoTag ? 'translate-x-5' : 'translate-x-0'
                )} />
              </button>
            </div>

            {/* Concurrent Downloads */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
               <div>
                <p className="text-sm font-semibold text-foreground">Concurrent Workers</p>
                <p className="text-sm text-muted-foreground">Number of parallel downloads allowed.</p>
              </div>
              <div className="flex items-center p-1 bg-muted/40 rounded-lg border border-border/50 shrink-0">
                {[1, 2, 3, 4, 5].map((n) => (
                  <button
                    key={n}
                    onClick={() => settings.setConcurrentDownloads(n)}
                    className={cn(
                      'w-10 h-7 rounded-md text-sm font-bold transition-all',
                      settings.concurrentDownloads === n 
                        ? 'bg-background shadow-sm text-primary border border-border/40' 
                        : 'text-muted-foreground hover:text-foreground hover:bg-muted/80 border border-transparent'
                    )}
                  >
                    {n}
                  </button>
                ))}
              </div>
            </div>

            {/* Default Quality */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <p className="text-sm font-semibold text-foreground">Default Audio Quality</p>
                <p className="text-sm text-muted-foreground">The preferred bitrate used for single-click downloads.</p>
              </div>
              <div className="flex flex-wrap items-center p-1 bg-muted/40 rounded-lg border border-border/50 shrink-0">
                {QUALITY_OPTIONS.map(({ value, label }) => (
                  <button
                    key={value}
                    onClick={() => settings.setDefaultQuality(value)}
                    className={cn(
                      'px-3 py-1.5 rounded-md text-sm font-semibold transition-all',
                      settings.defaultQuality === value 
                        ? 'bg-background shadow-sm text-primary border border-border/40' 
                        : 'text-muted-foreground hover:text-foreground hover:bg-muted/80 border border-transparent'
                    )}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

          </div>
        </section>

        {/* FILE NAMING */}
        <section>
          <div className="flex items-center gap-3 mb-4 pb-2 border-b border-border/50">
            <FileText className="h-4 w-4 text-primary" />
            <h2 className="text-lg font-bold text-foreground tracking-tight">File Naming Formats</h2>
          </div>

          <div className="flex flex-col gap-2 py-2">
            {FILE_NAME_PATTERNS.map(({ value, label }) => {
              const isSelected = settings.fileNamePattern === value
              return (
                <button
                  key={value}
                  onClick={() => settings.setFileNamePattern(value)}
                  className="flex flex-col sm:flex-row sm:items-center justify-between py-3 px-3 -mx-3 rounded-lg hover:bg-muted/30 transition-colors text-left group"
                >
                  <div className="flex items-center gap-3 mb-1 sm:mb-0">
                    <div className={cn(
                      "w-4 h-4 rounded-full border flex items-center justify-center shrink-0",
                      isSelected ? "border-primary" : "border-muted-foreground"
                    )}>
                       {isSelected && <div className="w-2 h-2 rounded-full bg-primary" />}
                    </div>
                    <span className={cn("text-sm font-semibold", isSelected ? "text-foreground" : "text-muted-foreground group-hover:text-foreground")}>
                      {label}
                    </span>
                  </div>
                  <code className="text-xs bg-muted/50 px-2 py-1 rounded font-mono text-muted-foreground ml-7 sm:ml-0 overflow-hidden text-ellipsis whitespace-nowrap max-w-full">
                    {value}
                  </code>
                </button>
              )
            })}
          </div>
        </section>

        {/* DATA MANAGEMENT */}
        <section>
           <div className="flex items-center gap-3 mb-4 pb-2 border-b border-border/50">
            <Server className="h-4 w-4 text-muted-foreground" />
            <h2 className="text-lg font-bold text-foreground tracking-tight">Data Management</h2>
          </div>
          
          <div className="flex flex-wrap gap-3 py-2">
            <Button 
              variant="outline" 
              onClick={handleExportHistory} 
              className="text-sm bg-transparent border-border hover:bg-muted w-full sm:w-auto"
            >
              <Database className="h-4 w-4 mr-2 text-primary" />
              Export History ({history.length})
            </Button>
            
            <Button 
              variant="outline" 
              onClick={() => { clearHistory(); toast.success('History cleared permanently') }} 
              className="text-sm bg-transparent border-border text-destructive hover:bg-destructive/10 hover:text-destructive w-full sm:w-auto"
            >
              Clear History
            </Button>
            
            <Button 
              variant="ghost" 
              onClick={() => { settings.resetSettings(); toast.success('Settings restored defaults') }} 
              className="text-sm text-muted-foreground hover:text-foreground w-full sm:w-auto sm:ml-auto"
            >
              <RotateCcw className="h-3.5 w-3.5 mr-2 opacity-70" /> Reset Defaults
            </Button>
          </div>
        </section>

      </div>
    </div>
  )
}
