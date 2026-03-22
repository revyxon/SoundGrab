import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface SearchState {
  recentSearches: string[]
  addRecentSearch: (query: string) => void
  removeRecentSearch: (query: string) => void
  clearRecentSearches: () => void
}

export const useSearchStore = create<SearchState>()(
  persist(
    (set) => ({
      recentSearches: [],
      addRecentSearch: (query) => {
        set((state) => ({
          recentSearches: [
            query,
            ...state.recentSearches.filter((q) => q !== query),
          ].slice(0, 10),
        }))
      },
      removeRecentSearch: (query) => {
        set((state) => ({
          recentSearches: state.recentSearches.filter((q) => q !== query),
        }))
      },
      clearRecentSearches: () => set({ recentSearches: [] }),
    }),
    { name: 'soundgrab-search' }
  )
)
