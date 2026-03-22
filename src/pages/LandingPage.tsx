import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, Download, Tag, Layers, Clock, Sparkles, Zap, Music2, ShieldCheck, ChevronDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { motion, AnimatePresence, type Variants } from 'framer-motion'

const features = [
  { icon: Download, title: 'High Fidelity Audio', desc: 'Experience studio-quality 320kbps M4A downloads natively encoded from the source without lossy transcoding.' },
  { icon: Tag, title: 'Metadata & ID3 Tags', desc: 'Every track is perfectly tagged with high-res Album Art, Artist, Year, and structural metadata for iTunes and native players.' },
  { icon: Layers, title: 'Batch Downloader', desc: 'Paste up to 50 links at once and watch our multi-threaded engine queue, tag, and download them simultaneously.' },
  { icon: Sparkles, title: 'Smart Auto-Naming', desc: 'We structure your files cleanly. Choose your own patterns like "{artist} - {title}" and never deal with messy filenames again.' },
  { icon: Clock, title: 'Intelligent History', desc: 'Your entire download history is locally persisted. Re-download tracks anytime with a single click without searching.' },
  { icon: ShieldCheck, title: 'Privacy First', desc: 'No accounts, no trackers, no ads. All metadata processing and queuing happens strictly in your browser.' },
]

const faqs = [
  { q: "What format are the downloaded songs?", a: "Songs are downloaded in their native M4A (AAC) format directly from the CDNs to preserve 100% of the original quality without lossy re-encoding." },
  { q: "Is the metadata compatible with Apple Music/iTunes?", a: "Yes. We use advanced client-side multiplexing to inject native Apple 'ilst' metadata atoms, meaning album art and tags work perfectly across all top-tier players." },
  { q: "How many songs can I download at once?", a: "There are no arbitrary limits. Our batch downloader handles dozens of links concurrently, and you can adjust the parallel download limit in Settings." },
  { q: "Is this tool completely free?", a: "Yes, SoundGrab is a passion project built for the community. It is 100% free with absolutely zero ads or tracking." }
]

const FADE_UP: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } }
}

export function LandingPage() {
  const [query, setQuery] = useState('')
  const [activeFaq, setActiveFaq] = useState<number | null>(0)
  const navigate = useNavigate()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query.trim())}`)
    }
  }

  return (
    <div className="relative overflow-hidden selection:bg-primary/30">
      
      {/* Background Glow Effects */}
      <div className="pointer-events-none absolute inset-0 flex justify-center overflow-hidden z-0">
        <div className="absolute -top-[20%] left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-primary/20 rounded-full blur-[120px] opacity-50 dark:opacity-20 animate-pulse transition-opacity duration-1000" />
        <div className="absolute top-[40%] -right-[20%] w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-[100px] opacity-40 dark:opacity-20" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6">
        
        {/* HERO SECTION */}
        <motion.section 
          initial="hidden" animate="visible" variants={{
            visible: { transition: { staggerChildren: 0.1 } }
          }}
          className="py-24 sm:py-32 lg:pb-40 text-center flex flex-col items-center justify-center min-h-[85vh]"
        >
          <motion.div variants={FADE_UP} className="mb-6 flex space-x-2">
            <Badge variant="secondary" className="px-3 py-1 font-medium bg-primary/10 text-primary border-primary/20 backdrop-blur-sm">
              <Sparkles className="w-3.5 h-3.5 mr-1" />
              v1.0 Now Live
            </Badge>
          </motion.div>

          <motion.h1 variants={FADE_UP} className="text-5xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-foreground max-w-4xl mx-auto leading-[1.1]">
            The Ultimate Music
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-500 pb-2">
              Downloading Experience.
            </span>
          </motion.h1>

          <motion.p variants={FADE_UP} className="mt-6 text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto font-medium">
            Studio-quality 320kbps M4A tracks, perfectly sliced metadata, gorgeous album art, and an incredibly fast multi-threaded queue.
          </motion.p>

          <motion.form variants={FADE_UP} onSubmit={handleSearch} className="mt-10 w-full max-w-2xl mx-auto relative z-20">
            <div className="relative flex w-full items-center overflow-hidden rounded-full border border-border/80 bg-background/95 backdrop-blur-md p-1.5 shadow-sm transition-all focus-within:border-primary/40 focus-within:ring-4 focus-within:ring-primary/10">
              <div className="pl-4 pr-2 text-muted-foreground transition-colors">
                <Search className="h-5 w-5 opacity-70" />
              </div>
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search for any song, album, or artist..."
                className="flex-1 border-0 bg-transparent px-2 text-base shadow-none focus-visible:ring-0 h-12 md:h-14 font-medium placeholder:text-muted-foreground/80 focus-visible:bg-transparent"
                autoFocus
                id="hero-search"
                autoComplete="off"
              />
              <Button 
                type="submit" 
                size="lg" 
                className="h-12 md:h-14 rounded-full px-7 md:px-9 font-medium text-sm md:text-base shadow-none hover:opacity-90 transition-transform active:scale-95"
              >
                Search
              </Button>
            </div>
          </motion.form>

          <motion.div variants={FADE_UP} className="mt-8 flex flex-wrap justify-center gap-2 items-center text-sm text-muted-foreground font-medium">
            <span>Trending:</span>
            {['Arijit Singh', 'Rockstar', 'Ed Sheeran', 'The Weeknd'].map((tag) => (
              <button 
                key={tag} 
                onClick={() => { setQuery(tag); navigate(`/search?q=${encodeURIComponent(tag)}`) }}
                className="hover:text-primary transition-colors cursor-pointer px-2 py-1 bg-muted/50 rounded-md hover:bg-muted"
              >
                {tag}
              </button>
            ))}
          </motion.div>
        </motion.section>

        {/* TRUST BAR */}
        <section className="border-y border-border/50 bg-muted/10 backdrop-blur-sm -mx-4 sm:-mx-6 px-4 sm:px-6 py-10 mb-24">
          <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center divide-x divide-border/50">
            {[
              { label: 'Audio Engine', val: 'Native M4A' },
              { label: 'Quality Config', val: 'Up to 320kbps' },
              { label: 'ID3 Tags', val: '100% Embedded' },
              { label: 'Ad-Free', val: 'Forever' },
            ].map((s, i) => (
              <div key={i} className={cn("flex flex-col items-center", i % 2 !== 0 && "border-none md:border-l")}>
                <span className="text-xs uppercase tracking-wider text-muted-foreground font-semibold mb-1">{s.label}</span>
                <span className="text-lg md:text-xl font-bold text-foreground">{s.val}</span>
              </div>
            ))}
          </div>
        </section>

        {/* BENTO FEATURES */}
        <section className="py-20">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">Engineered for Perfection</h2>
            <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">Skip the generic MP3 converters. We built a native client-side processing engine that guarantees pristine audio quality and flawless metadata.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, idx) => (
              <motion.div 
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="group relative p-8 rounded-2xl border border-border/50 bg-card/50 overflow-hidden hover:bg-card hover:border-border transition-colors duration-300"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="relative z-10">
                  <div className="mb-5 inline-flex p-3 rounded-xl bg-primary/10 text-primary ring-1 ring-primary/20">
                    <feature.icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold text-foreground mb-3">{feature.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{feature.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* HOW IT WORKS (Visual Timeline) */}
        <section className="py-24 border-t border-border/30">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-foreground">How It Works</h2>
          </div>
          <div className="max-w-4xl mx-auto relative">
            <div className="absolute top-1/2 left-0 w-full h-0.5 bg-border/50 -translate-y-1/2 hidden md:block" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative z-10">
              {[
                { step: '01', title: 'Find Your Music', desc: 'Search for any global track, album, or artist instantly via our high-speed API.', icon: Search },
                { step: '02', title: 'Queue It Up', desc: 'Add dozens of songs to the batch queue. Adjust quality settings on the fly.', icon: Layers },
                { step: '03', title: 'Download & Play', desc: 'The engine fetches tracks, writes native metadata, and saves them locally.', icon: Download },
              ].map((s) => (
                <div key={s.step} className="bg-background pt-8 px-6 text-center">
                  <div className="mx-auto w-16 h-16 rounded-2xl bg-muted border border-border flex items-center justify-center -translate-y-16 shadow-lg shadow-background relative">
                    <div className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm ring-4 ring-background">
                      {s.step}
                    </div>
                    <s.icon className="w-6 h-6 text-foreground" />
                  </div>
                  <h3 className="text-lg font-bold text-foreground -mt-8 mb-2">{s.title}</h3>
                  <p className="text-sm text-muted-foreground">{s.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ SECTION */}
        <section className="py-24 border-t border-border/30 max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground">Frequently Asked Questions</h2>
          </div>
          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <div key={i} className="border border-border/50 rounded-2xl bg-card overflow-hidden">
                <button 
                  onClick={() => setActiveFaq(activeFaq === i ? null : i)}
                  className="flex items-center justify-between w-full p-5 text-left font-semibold text-lg hover:text-primary transition-colors"
                >
                  {faq.q}
                  <ChevronDown className={cn("w-5 h-5 transition-transform duration-300", activeFaq === i && "rotate-180")} />
                </button>
                <AnimatePresence>
                  {activeFaq === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className="p-5 pt-0 text-muted-foreground leading-relaxed">
                        {faq.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </section>

        {/* BOTTOM CTA */}
        <section className="py-20 mb-20">
          <div className="relative rounded-3xl overflow-hidden bg-muted/30 border border-border px-6 py-16 sm:px-16 sm:py-24 text-center">
            <div className="absolute inset-0 bg-gradient-to-b from-primary/10 to-transparent opacity-50" />
            <div className="relative z-10 max-w-2xl mx-auto">
              <Zap className="w-12 h-12 text-primary mx-auto mb-6" />
              <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-6">Stop settling for low quality.</h2>
              <p className="text-lg text-muted-foreground mb-10">
                Start building your offline music library today with perfect metadata and studio-quality sound.
              </p>
              <Button size="xl" className="h-16 px-10 rounded-2xl text-lg font-bold shadow-2xl shadow-primary/20 hover:scale-105 transition-transform" onClick={() => navigate('/search')}>
                Start Downloading Free
              </Button>
            </div>
          </div>
        </section>

      </div>
    </div>
  )
}

