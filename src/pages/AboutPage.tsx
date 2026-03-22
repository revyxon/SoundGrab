import { Music, Download, Tag, Search, Layers, Zap, ExternalLink, Github, Twitter, Linkedin, CheckCircle2, Heart, Code2, Server, Cpu, Activity, ShieldCheck, FileDown, Route, Coffee } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

const techCategories = [
  {
    category: "Core Engine",
    items: [
      { name: 'React', icon: 'https://cdn.simpleicons.org/react/61DAFB' },
      { name: 'TypeScript', icon: 'https://cdn.simpleicons.org/typescript/3178C6' },
      { name: 'Vite', icon: 'https://cdn.simpleicons.org/vite/646CFF' },
      { name: 'Node.js', icon: 'https://cdn.simpleicons.org/nodedotjs/339933' },
    ]
  },
  {
    category: "State & Data",
    items: [
      { name: 'Zustand', icon: '/zustand-bear.png' },
      { name: 'TanStack Query', icon: 'https://cdn.simpleicons.org/reactquery/FF4154' },
      { name: 'LocalForage', icon: 'https://cdn.simpleicons.org/javascript/F7DF1E' },
    ]
  },
  {
    category: "Architecture & UI",
    items: [
      { name: 'Tailwind CSS', icon: 'https://cdn.simpleicons.org/tailwindcss/06B6D4' },
      { name: 'Radix UI', icon: 'https://cdn.simpleicons.org/radixui' },
      { name: 'Framer Motion', icon: 'https://cdn.simpleicons.org/framer/0055FF' },
      { name: 'Lucide', icon: 'https://cdn.simpleicons.org/lucide' },
    ]
  }
]

const roadmap = [
  { phase: "Phase 1: Foundation", status: "completed", items: ["Custom UI Engine", "JioSaavn API Integration", "Basic Playback & Search"] },
  { phase: "Phase 2: The Core", status: "completed", items: ["Concurrent Download Queues", "Persistent Zustand Stores", "ID3 Tag Injection (browser-id3-writer)"] },
  { phase: "Phase 3: Refinement", status: "completed", items: ["Premium Minimalist Layouts", "Dark/Light Modes", "Dynamic Quality Selection"] },
  { phase: "Phase 4: Expansion", status: "upcoming", items: ["User Accounts & Sync", "Spotify API Integration", "Desktop PWA Support"] },
]

export function AboutPage() {
  return (
    <div className="min-h-screen bg-background text-foreground pb-20 animate-fade-in">
      
      {/* 1. HERO SECTION */}
      <section className="relative pt-24 pb-16 md:pt-32 md:pb-24 overflow-hidden border-b border-border/40">
        <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:32px] -z-10" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent -z-10" />
        
        <div className="mx-auto max-w-5xl px-4 sm:px-6 text-center">
          <Badge variant="outline" className="mb-6 tracking-widest uppercase text-xs font-semibold text-primary border-primary/30 bg-primary/5 px-4 py-1.5">
            Project Overview v1.0
          </Badge>
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6">
            Engineering <span className="text-primary border-b-4 border-primary">SoundGrab</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            A masterclass in modern frontend architecture. We didn't just build a music downloader; we engineered a robust, state-driven media pipeline operating entirely within the browser.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-5xl px-4 sm:px-6 space-y-32 py-16">
        
        {/* 2. THE VISION (Problem vs Solution) */}
        <section>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div>
              <div className="flex items-center gap-3 mb-4">
                 <ShieldCheck className="h-6 w-6 text-destructive" />
                 <h2 className="text-2xl font-bold tracking-tight">The Problem</h2>
              </div>
              <p className="text-muted-foreground leading-relaxed text-lg">
                The ecosystem for downloading high-quality audio has always been plagued by spammy interfaces, extremely aggressive pop-up advertisements, fake download buttons, and severely lacking metadata. Files often end up with chaotic names and no embedded beautiful cover art.
              </p>
            </div>
            
            <div className="bg-card/30 p-8 rounded-3xl border border-border/50 relative overflow-hidden">
               <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 blur-[80px] rounded-full pointer-events-none" />
               <div className="flex items-center gap-3 mb-4 relative z-10">
                 <CheckCircle2 className="h-6 w-6 text-primary" />
                 <h2 className="text-2xl font-bold tracking-tight">The Solution</h2>
              </div>
              <p className="text-foreground leading-relaxed text-lg relative z-10">
                A pristine, ad-free environment. SoundGrab utilizes invisible concurrent web workers to fetch, buffer, inject ID3 tags (titles, artists, album art), and seamlessly drop flawlessly organized MP3/M4A files directly into your local filesystem—safely and beautifully.
              </p>
            </div>
          </div>
        </section>

        {/* 3. TECHNICAL ARCHITECTURE */}
        <section>
          <div className="text-center mb-16">
             <h2 className="text-3xl md:text-4xl font-extrabold mb-4">System Architecture</h2>
             <p className="text-lg text-muted-foreground max-w-2xl mx-auto">How the engine operates under the hood to deliver lightning-fast processing.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
             <div className="p-8 border border-border/50 rounded-2xl bg-card/20 group hover:border-primary/50 transition-colors">
                <Route className="h-8 w-8 text-primary mb-5 group-hover:scale-110 transition-transform" />
                <h3 className="text-xl font-bold mb-3">API Routing Layer</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Utilizes TanStack Query for aggressive caching and stale-while-revalidate data fetching from the JioSaavn backend, ensuring searches and meta-lookups are near-instantaneous upon revisit.
                </p>
             </div>
             <div className="p-8 border border-border/50 rounded-2xl bg-card/20 group hover:border-primary/50 transition-colors">
                <Cpu className="h-8 w-8 text-primary mb-5 group-hover:scale-110 transition-transform" />
                <h3 className="text-xl font-bold mb-3">State Machine</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Zustand acts as our global brain, maintaining active queues, tracking granular byte-level progress, and persisting history to LocalStorage so you never lose your download records.
                </p>
             </div>
             <div className="p-8 border border-border/50 rounded-2xl bg-card/20 group hover:border-primary/50 transition-colors">
                <FileDown className="h-8 w-8 text-primary mb-5 group-hover:scale-110 transition-transform" />
                <h3 className="text-xl font-bold mb-3">Binary Pipeline</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Downloads are entirely processed in-memory as ArrayBuffers. Before saving, <code>browser-id3-writer</code> structurally rewrites the binary to embed high-res JPEG covers and text metadata.
                </p>
             </div>
          </div>
        </section>

        {/* 4. DETAILED TECH STACK */}
        <section>
          <div className="mb-12 flex items-center justify-between border-b border-border/50 pb-6">
             <div>
               <h2 className="text-3xl font-extrabold mb-2">The Stack</h2>
               <p className="text-muted-foreground">The cutting-edge tools empowering this platform.</p>
             </div>
             <Code2 className="h-10 w-10 text-muted-foreground/30 hidden sm:block" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {techCategories.map((cat) => (
              <div key={cat.category}>
                <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground mb-6">
                  {cat.category}
                </h3>
                <div className="space-y-4">
                  {cat.items.map((tech) => (
                    <div key={tech.name} className="flex items-center gap-4 group">
                      <div className="w-10 h-10 rounded-xl bg-card border border-border/60 flex items-center justify-center group-hover:border-primary/40 transition-colors">
                         <img 
                            src={tech.icon} 
                            alt={tech.name} 
                            className="w-5 h-5 object-contain" 
                            onError={(e) => (e.target as HTMLImageElement).style.display = 'none'}
                          />
                      </div>
                      <span className="font-semibold text-foreground group-hover:text-primary transition-colors">
                        {tech.name}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 5. ROADMAP */}
        <section>
          <div className="text-center mb-12">
             <h2 className="text-3xl font-extrabold mb-4">Development Roadmap</h2>
             <p className="text-lg text-muted-foreground">We are constantly evolving the architecture.</p>
          </div>
          
          <div className="max-w-3xl mx-auto space-y-4">
             {roadmap.map((rm, i) => (
               <div key={rm.phase} className="flex flex-col sm:flex-row gap-4 sm:items-center p-6 border border-border/50 rounded-2xl bg-card/10">
                 <div className="sm:w-1/3 shrink-0">
                   <div className="flex items-center gap-2 mb-1">
                      {rm.status === 'completed' 
                        ? <CheckCircle2 className="h-4 w-4 text-green-500" /> 
                        : <Activity className="h-4 w-4 text-primary animate-pulse" />}
                      <span className="font-bold text-lg">{rm.phase}</span>
                   </div>
                   <Badge variant="secondary" className={cn("text-[10px] uppercase font-bold", rm.status === 'completed' ? "text-green-500 bg-green-500/10" : "text-primary bg-primary/10")}>
                     {rm.status}
                   </Badge>
                 </div>
                 <div className="flex-1 text-sm text-muted-foreground">
                   <ul className="list-disc list-inside space-y-1">
                     {rm.items.map(item => <li key={item}>{item}</li>)}
                   </ul>
                 </div>
               </div>
             ))}
          </div>
        </section>

        {/* 6. ENGINEER / AUTHOR PROFILE */}
        <section className="scroll-mt-24 pt-24 border-t border-border/50" id="engineer">
          <div className="flex flex-col md:flex-row gap-12 lg:gap-20 items-start">
            <div className="shrink-0">
               <div className="w-32 h-32 md:w-48 md:h-48 rounded-xl bg-card border border-border/60 flex flex-col items-center justify-center">
                 <span className="text-5xl md:text-7xl font-black text-muted-foreground/20 tracking-tighter">AT</span>
                 <span className="text-[10px] font-mono text-muted-foreground/40 mt-2 uppercase tracking-widest">&lt;developer /&gt;</span>
               </div>
            </div>
            
            <div className="flex-1">
               <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-muted/50 rounded-md border border-border/40 text-foreground text-[11px] font-bold uppercase tracking-widest mb-6">
                 <Server className="h-3.5 w-3.5" /> Lead Architect & Developer
               </div>
               
               <h2 className="text-4xl md:text-5xl font-extrabold text-foreground tracking-tight mb-6">
                 Adarsh Tiwari
               </h2>
               
               <p className="text-lg text-muted-foreground leading-relaxed mb-8 max-w-2xl">
                 I build ruthless, high-performance web applications that demand precision. My philosophy is rooted in brutalist functionality combined with premium, minimalist aesthetics. SoundGrab is the physical manifestation of perfectly managed state and untamed API power.
               </p>
               
               <div className="flex flex-wrap items-center gap-4">
                 <a href="https://github.com/adarshtiwari" target="_blank" rel="noreferrer" className="flex items-center gap-2 px-6 py-2.5 rounded-lg bg-foreground text-background hover:bg-foreground/90 transition-colors font-bold text-sm">
                   <Github className="h-4 w-4" /> GitHub Profile
                 </a>
                 <a href="#" className="flex items-center gap-2 px-6 py-2.5 rounded-lg border border-border/60 hover:bg-muted transition-colors text-foreground font-bold text-sm">
                   <Linkedin className="h-4 w-4" /> LinkedIn
                 </a>
                 <a href="#" className="flex items-center gap-2 px-6 py-2.5 rounded-lg border border-border/60 hover:bg-muted transition-colors text-foreground font-bold text-sm">
                   <Twitter className="h-4 w-4" /> Twitter
                 </a>
               </div>
               
               <p className="mt-10 flex items-center gap-2 text-xs font-mono text-muted-foreground/60 uppercase tracking-widest">
                 <Coffee className="h-3 w-3" /> Fueled by logic and highly caffeinated.
               </p>
            </div>
          </div>
        </section>

      </div>

      {/* FOOTER ACKNOWLEDGEMENT */}
      <footer className="text-center py-12 border-t border-border/30 mt-12 bg-card/5">
        <p className="text-sm font-medium text-muted-foreground flex items-center justify-center gap-1.5 mb-2">
          Engineered with <Heart className="h-4 w-4 text-primary fill-primary/20" /> by Adarsh Tiwari
        </p>
        <p className="text-xs text-muted-foreground/60">
          Core data streams powered by{' '}
          <a href="https://saavn.dev" target="_blank" rel="noopener noreferrer" className="text-foreground hover:text-primary transition-colors inline-flex items-center gap-1 border-b border-border hover:border-primary pb-px">
            JioSaavn API <ExternalLink className="h-3 w-3" />
          </a>
        </p>
        <p className="text-[10px] text-muted-foreground/40 font-mono mt-4 uppercase tracking-widest">
          © {new Date().getFullYear()} SoundGrab Systems. All Rights Reserved.
        </p>
      </footer>
      
    </div>
  )
}
