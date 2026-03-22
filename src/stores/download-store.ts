import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { QualityValue } from '@/core/config'

export type DownloadStatus = 'queued' | 'downloading' | 'tagging' | 'complete' | 'failed'

export interface DownloadItem {
  id: string
  songId: string
  songName: string
  artistName: string
  albumName: string
  quality: QualityValue
  status: DownloadStatus
  progress: number
  error?: string
  retryCount: number
  timestamp: number
  coverUrl?: string
  duration?: number | null
  year?: string | null
}

export interface DownloadHistoryItem {
  id: string
  songId: string
  songName: string
  artistName: string
  albumName: string
  quality: QualityValue
  timestamp: number
  coverUrl?: string
}

interface DownloadState {
  queue: DownloadItem[]
  history: DownloadHistoryItem[]

  enqueue: (item: Omit<DownloadItem, 'id' | 'status' | 'progress' | 'retryCount' | 'timestamp'>) => string
  updateProgress: (id: string, progress: number) => void
  updateStatus: (id: string, status: DownloadStatus, error?: string) => void
  removeFromQueue: (id: string) => void
  clearCompleted: () => void
  retryFailed: (id: string) => void
  retryAllFailed: () => void
  clearQueue: () => void

  addToHistory: (item: Omit<DownloadHistoryItem, 'id' | 'timestamp'>) => void
  removeFromHistory: (id: string) => void
  clearHistory: () => void

  isInQueue: (songId: string) => boolean
  isInHistory: (songId: string) => boolean
  getActiveCount: () => number
}

let idCounter = 0
const genId = () => `dl_${Date.now()}_${idCounter++}`

export const useDownloadStore = create<DownloadState>()(
  persist(
    (set, get) => ({
      queue: [],
      history: [],

      enqueue: (item) => {
        const id = genId()
        set((state) => ({
          queue: [
            ...state.queue,
            {
              ...item,
              id,
              status: 'queued' as DownloadStatus,
              progress: 0,
              retryCount: 0,
              timestamp: Date.now(),
            },
          ],
        }))
        return id
      },

      updateProgress: (id, progress) => {
        set((state) => ({
          queue: state.queue.map((item) =>
            item.id === id ? { ...item, progress: Math.min(100, progress) } : item
          ),
        }))
      },

      updateStatus: (id, status, error) => {
        set((state) => ({
          queue: state.queue.map((item) =>
            item.id === id ? { ...item, status, error, progress: status === 'complete' ? 100 : item.progress } : item
          ),
        }))
      },

      removeFromQueue: (id) => {
        set((state) => ({
          queue: state.queue.filter((item) => item.id !== id),
        }))
      },

      clearCompleted: () => {
        set((state) => ({
          queue: state.queue.filter((item) => item.status !== 'complete'),
        }))
      },

      retryFailed: (id) => {
        set((state) => ({
          queue: state.queue.map((item) =>
            item.id === id && item.status === 'failed'
              ? { ...item, status: 'queued' as DownloadStatus, progress: 0, error: undefined, retryCount: item.retryCount + 1 }
              : item
          ),
        }))
      },

      retryAllFailed: () => {
        set((state) => ({
          queue: state.queue.map((item) =>
            item.status === 'failed'
              ? { ...item, status: 'queued' as DownloadStatus, progress: 0, error: undefined, retryCount: item.retryCount + 1 }
              : item
          ),
        }))
      },

      clearQueue: () => set({ queue: [] }),

      addToHistory: (item) => {
        set((state) => ({
          history: [
            { ...item, id: genId(), timestamp: Date.now() },
            ...state.history,
          ].slice(0, 500),
        }))
      },

      removeFromHistory: (id) => {
        set((state) => ({
          history: state.history.filter((item) => item.id !== id),
        }))
      },

      clearHistory: () => set({ history: [] }),

      isInQueue: (songId) => get().queue.some((item) => item.songId === songId && item.status !== 'failed'),
      isInHistory: (songId) => get().history.some((item) => item.songId === songId),
      getActiveCount: () => get().queue.filter((item) => item.status === 'downloading' || item.status === 'tagging').length,
    }),
    {
      name: 'soundgrab-downloads',
      partialize: (state) => ({ history: state.history }),
    }
  )
)
