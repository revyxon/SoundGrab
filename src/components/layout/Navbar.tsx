import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Download, Search, Clock, Settings, Layers, Music, Info, Sun, Moon, Menu, X, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useSettingsStore } from '@/stores/settings-store'
import { useDownloadStore } from '@/stores/download-store'
import { cn } from '@/lib/utils'
import { AnimatePresence, motion } from 'framer-motion'

const navLinks = [
  { to: '/search', label: 'Search', icon: Search },
  { to: '/batch', label: 'Batch Downloader', icon: Layers },
  { to: '/history', label: 'Download History', icon: Clock },
  { to: '/settings', label: 'Settings', icon: Settings },
  { to: '/about', label: 'About', icon: Info },
]

export function Navbar() {
  const { pathname } = useLocation()
  const { theme, setTheme } = useSettingsStore()
  const queue = useDownloadStore((s) => s.queue)
  const activeDownloads = queue.filter((d) => d.status === 'downloading' || d.status === 'queued' || d.status === 'tagging').length

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isNavbarVisible, setIsNavbarVisible] = useState(true)
  const [lastScrollY, setLastScrollY] = useState(0)

  // Handle scroll to hide/show navbar
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY
      if (currentScrollY > lastScrollY && currentScrollY > 60) {
        setIsNavbarVisible(false)
      } else if (currentScrollY < lastScrollY) {
        setIsNavbarVisible(true)
      }
      setLastScrollY(currentScrollY)
    }

    // Passive listener for performance
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [lastScrollY])

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false)
  }, [pathname])

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
  }, [isMobileMenuOpen])

  return (
    <>
      <header className={cn(
        "sticky top-0 z-40 w-full border-b border-border bg-background/80 backdrop-blur-md transition-transform duration-300",
        !isNavbarVisible && "-translate-y-full"
      )}>
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-3">
            {/* Mobile Menu Toggle */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden -ml-2 text-muted-foreground hover:text-foreground"
              onClick={() => setIsMobileMenuOpen(true)}
              aria-label="Open menu"
            >
              <Menu className="h-6 w-6" />
            </Button>

            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 font-bold text-foreground hover:text-primary transition-colors">
              <div className="bg-primary/10 p-1.5 rounded-full">
                <Music className="h-5 w-5 text-primary" />
              </div>
              <span className="text-lg tracking-tight">SoundGrab</span>
            </Link>
          </div>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map(({ to, label, icon: Icon }) => {
              const isActive = pathname === to || pathname.startsWith(to + '/')
              return (
                <Link
                  key={to}
                  to={to}
                  className={cn(
                    'flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-full transition-all duration-200',
                    isActive
                      ? 'text-primary bg-primary/10'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {label.split(' ')[0]} {/* Shorter label for desktop */}
                </Link>
              )
            })}
          </nav>

          {/* Right side actions */}
          <div className="flex items-center gap-1 sm:gap-2">
            {/* Download indicator */}
            {activeDownloads > 0 && (
              <Link to="/batch" className="relative group">
                <Button variant="ghost" size="icon" className="hover:bg-primary/10 text-muted-foreground group-hover:text-primary transition-colors">
                  <Download className="h-5 w-5" />
                </Button>
                <Badge className="absolute top-1 right-1 h-4 min-w-4 flex items-center justify-center text-[10px] p-0.5 bg-primary text-primary-foreground border-background border">
                  {activeDownloads}
                </Badge>
              </Link>
            )}

            {/* Theme toggle */}
            <Button
              variant="ghost"
              size="icon"
              className="text-muted-foreground hover:text-foreground"
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Overlay & Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm md:hidden"
              onClick={() => setIsMobileMenuOpen(false)}
            />

            {/* Sidebar Drawer */}
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 left-0 z-50 w-3/4 max-w-sm border-r border-border bg-card shadow-2xl md:hidden flex flex-col"
            >
              {/* Drawer Header */}
              <div className="flex items-center justify-between p-4 border-b border-border">
                <Link to="/" className="flex items-center gap-3">
                  <div className="bg-primary/10 p-2 rounded-full">
                    <Music className="h-6 w-6 text-primary" />
                  </div>
                  <span className="font-bold text-xl tracking-tight">SoundGrab</span>
                </Link>
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-full text-muted-foreground hover:text-foreground hover:bg-muted"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>

              {/* Drawer Links */}
              <div className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
                {navLinks.map(({ to, label, icon: Icon }) => {
                  const isActive = pathname === to || pathname.startsWith(to + '/')
                  return (
                    <Link
                      key={to}
                      to={to}
                      className={cn(
                        'flex items-center justify-between w-full px-4 py-3 rounded-xl transition-all',
                        isActive
                          ? 'bg-primary/10 text-primary font-medium'
                          : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <Icon className={cn("h-5 w-5", isActive ? "text-primary" : "opacity-70")} />
                        <span className="text-base">{label}</span>
                      </div>
                      <ChevronRight className={cn("h-4 w-4 opacity-50 transition-transform", isActive && "translate-x-1 opacity-100")} />
                    </Link>
                  )
                })}
              </div>

              {/* Drawer Footer */}
              <div className="p-4 border-t border-border mt-auto">
                <p className="text-xs text-center text-muted-foreground">
                  SoundGrab Music Platform <br />
                  Version 1.0.0
                </p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
