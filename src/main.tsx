import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App'

// Initialize theme from stored settings
const stored = localStorage.getItem('soundgrab-settings')
if (stored) {
  try {
    const parsed = JSON.parse(stored)
    const theme = parsed?.state?.theme
    if (theme === 'light') {
      document.documentElement.classList.add('light')
    } else if (theme === 'system') {
      const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      if (!isDark) document.documentElement.classList.add('light')
    }
  } catch {
    // ignore
  }
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
