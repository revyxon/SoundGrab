import { Outlet } from 'react-router-dom'
import { Navbar } from './Navbar'
import { Footer } from './Footer'
import { Toaster } from 'sonner'

export function AppShell() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <Toaster
        position="bottom-right"
        toastOptions={{
          className: 'bg-card text-card-foreground border-border',
        }}
      />
    </div>
  )
}
