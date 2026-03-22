import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { QualityValue } from '@/core/config'
import { DEFAULT_QUALITY, DEFAULT_FILE_NAME_PATTERN, MAX_CONCURRENT_DOWNLOADS } from '@/core/config'

export type Theme = 'dark' | 'light' | 'system'

interface SettingsState {
  theme: Theme
  defaultQuality: QualityValue
  fileNamePattern: string
  autoTag: boolean
  concurrentDownloads: number
  setTheme: (theme: Theme) => void
  setDefaultQuality: (quality: QualityValue) => void
  setFileNamePattern: (pattern: string) => void
  setAutoTag: (enabled: boolean) => void
  setConcurrentDownloads: (count: number) => void
  resetSettings: () => void
}

const initialState = {
  theme: 'dark' as Theme,
  defaultQuality: DEFAULT_QUALITY,
  fileNamePattern: DEFAULT_FILE_NAME_PATTERN,
  autoTag: true,
  concurrentDownloads: MAX_CONCURRENT_DOWNLOADS,
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      ...initialState,
      setTheme: (theme) => {
        set({ theme })
        applyTheme(theme)
      },
      setDefaultQuality: (defaultQuality) => set({ defaultQuality }),
      setFileNamePattern: (fileNamePattern) => set({ fileNamePattern }),
      setAutoTag: (autoTag) => set({ autoTag }),
      setConcurrentDownloads: (concurrentDownloads) => set({ concurrentDownloads: Math.min(5, Math.max(1, concurrentDownloads)) }),
      resetSettings: () => set(initialState),
    }),
    {
      name: 'soundgrab-settings',
      onRehydrateStorage: () => (state) => {
        if (state) applyTheme(state.theme)
      },
    }
  )
)

function applyTheme(theme: Theme) {
  const root = document.documentElement
  if (theme === 'system') {
    const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    root.classList.toggle('light', !isDark)
  } else {
    root.classList.toggle('light', theme === 'light')
  }
}
