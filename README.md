<div align="center">
  <img src="public/favicon.svg" alt="SoundGrab Logo" width="120" />
  <h1>SoundGrab 🎶</h1>
  <p><strong>A beautifully crafted, ultra-fast music client & high-fidelity downloader</strong></p>

  <p>
    <a href="#features">Features</a> •
    <a href="#architecture">Architecture</a> •
    <a href="#getting-started">Getting Started</a> •
    <a href="#tech-stack">Tech Stack</a>
  </p>
</div>

---

## 🚀 The Vision

SoundGrab is an exercise in building a **"senior developer" grade application**. We wanted to overcome the clunky interfaces, heavy DOM overhead, and inconsistent metadata tagging of existing music downloaders by creating an absolutely seamless, bare-metal application that feels premium from the first click.

Whether you're streaming at 320kbps, queueing dozens of tracks for parallel downloads, or simply tweaking the appearance, SoundGrab prioritizes performance, flawless UX, and beautiful minimalist design.

---

## ✨ Core Features

- **High-Fidelity Streaming & Downloads**: Stream preview URLs and download pure, high-quality audio formats up to **320kbps (Ultra)**.
- **Native ID3 Metadata Tagging**: Fully integrated in-browser ID3 labeling! When you download a track, it is tagged instantly with Cover Art, Title, Album, Artists, and Year directly within the file binary using `browser-id3-writer`.
- **Parallel Download Engine**: Queue up to *X* concurrent tracks in the background without locking the UI. Progress rings, histories, and states are meticulously tracked in real-time.
- **Beautiful Flat Aesthetic**: Built heavily on spacing, typography, blurred translucent backgrounds, and smooth `framer-motion` variants. No clunky cards—just pure, content-oriented UI.
- **Persistent State**: Utilizing `zustand` and local storage, your theme preferences, download history, customized file-naming configurations, and engine limit settings are instantly restored across sessions.

---

## 🛠️ Architecture Deep-Dive

We designed SoundGrab using a scalable, service-oriented architecture specifically tailored for React:

1. **Service Layer (`services/`)**: Highly modular abstraction for communicating with our API. Instead of dropping fetch calls inside components, each entity (`artist`, `album`, `song`, `search`) has dedicated `.service.ts` functions relying on `ky`.
2. **Caching & Async State (`hooks/`)**: Wrapped native services inside `TanStack Query (React Query)`. We achieve automatic background refetching, query invalidation, and lightning-fast paginated caches.
3. **Download Pipeline (`core/`)**: This isn't just an `<a download>` tag. Our pipeline:
   - Fetches the exact requested stream via a cross-origin HTTP Blob stream.
   - Cleanses string entities (strips HTML characters out of `&quot;`).
   - Fetches the Cover Image and converts it into an ArrayBuffer.
   - Bootstraps `id3-tagger` to inject the byte data natively into the audio buffer.
   - Triggers a secure native browser download via `FileSaver / createObjectURL`.
4. **Theming (`stores/`)**: Custom robust theming system overriding generic Tailwind colors with dynamic CSS Variables, tightly coupled with robust Radix UI accessibility states.

---

## 💻 Tech Stack

- **Framework**: [React 18](https://react.dev/) + [Vite](https://vitejs.dev/)
- **Language**: [TypeScript (Strict Mode)](https://www.typescriptlang.org/)
- **Routing**: React Router v6
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) + [Radix UI primitives](https://www.radix-ui.com/)
- **State Management**: [Zustand](https://github.com/pmndrs/zustand)
- **Data Fetching**: [TanStack Query v5](https://tanstack.com/query/latest) + `ky`
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Icons**: [Lucide React](https://lucide.dev/) + SimpleIcons (CDN)

---

## 📦 Getting Started

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) (v20+) and [pnpm](https://pnpm.io/) installed to ensure strict dependency resolution.

### Development

1. **Clone the repository:**
   ```bash
   git clone https://github.com/revyxon/SoundGrab.git
   cd SoundGrab
   ```

2. **Install Dependencies:**
   ```bash
   pnpm install
   ```

3. **Start the Development Server:**
   ```bash
   pnpm dev
   ```

4. **Navigate to:** `http://localhost:5173`

---

## 🎨 Folder Structure
```text
src/
├── components/   # Reusable UI elements (ui, shared, layouts)
├── core/         # Critical backend systems (download engine, API config)
├── hooks/        # React Query custom hooks for data fetching
├── lib/          # Utilities, helpers, and formatter functions
├── pages/        # Top-level Page Components
├── services/     # Pure API functions (the bridge to TanStack Query)
├── stores/       # Zustand global state (Settings, Downloads, Search)
└── types/        # TypeScript Interfaces & Generics
```

---

<div align="center">
  <i>Crafted with passion for high-tier performance, elegant design, and pure music experiences.</i>
</div>
