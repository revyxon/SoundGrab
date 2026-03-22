import { createHashRouter, RouterProvider } from 'react-router-dom'
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClient } from '@/core/query-client'
import { AppShell } from '@/components/layout/AppShell'
import { LandingPage } from '@/pages/LandingPage'
import { SearchPage } from '@/pages/SearchPage'
import { SongPage } from '@/pages/SongPage'
import { AlbumPage } from '@/pages/AlbumPage'
import { ArtistPage } from '@/pages/ArtistPage'
import { PlaylistPage } from '@/pages/PlaylistPage'
import { BatchPage } from '@/pages/BatchPage'
import { HistoryPage } from '@/pages/HistoryPage'
import { SettingsPage } from '@/pages/SettingsPage'
import { AboutPage } from '@/pages/AboutPage'

const router = createHashRouter([
  {
    element: <AppShell />,
    children: [
      { index: true, element: <LandingPage /> },
      { path: 'search', element: <SearchPage /> },
      { path: 'song/:id', element: <SongPage /> },
      { path: 'album/:id', element: <AlbumPage /> },
      { path: 'artist/:id', element: <ArtistPage /> },
      { path: 'playlist/:id', element: <PlaylistPage /> },
      { path: 'batch', element: <BatchPage /> },
      { path: 'history', element: <HistoryPage /> },
      { path: 'settings', element: <SettingsPage /> },
      { path: 'about', element: <AboutPage /> },
    ],
  },
])

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  )
}
