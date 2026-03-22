import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight } from 'lucide-react'

export interface PaginationControlsProps {
  page: number
  total: number
  pageSize: number
  setPage: (p: number) => void
}

export function PaginationControls({ page, total, pageSize, setPage }: PaginationControlsProps) {
  const totalPages = Math.ceil(total / pageSize)
  if (totalPages <= 1) return null

  const maxPagesToShow = 5
  let start = Math.max(0, page - 2)
  let end = Math.min(totalPages - 1, start + maxPagesToShow - 1)
  
  if (end - start < maxPagesToShow - 1) {
    start = Math.max(0, end - maxPagesToShow + 1)
  }

  const pages = []
  for (let i = start; i <= end; i++) pages.push(i)

  return (
    <div className="flex items-center justify-center gap-1.5 mt-8 mb-4 py-4">
      <Button 
        variant="outline" 
        size="icon" 
        className="h-9 w-9" 
        onClick={() => setPage(page - 1)} 
        disabled={page === 0}
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>
      
      {start > 0 && (
        <>
           <Button variant="ghost" size="icon" className="h-9 w-9" onClick={() => setPage(0)}>1</Button>
           {start > 1 && <span className="px-1 text-muted-foreground/50">...</span>}
        </>
      )}
      
      {pages.map(p => (
        <Button 
           key={p} 
           variant={p === page ? "default" : "ghost"} 
           size="icon"
           className="h-9 w-9 transition-all"
           onClick={() => setPage(p)}
        >
           {p + 1}
        </Button>
      ))}
      
      {end < totalPages - 1 && (
         <>
           {end < totalPages - 2 && <span className="px-1 text-muted-foreground/50">...</span>}
           <Button variant="ghost" size="icon" className="h-9 w-9" onClick={() => setPage(totalPages - 1)}>{totalPages}</Button>
         </>
      )}

      <Button 
        variant="outline" 
        size="icon" 
        className="h-9 w-9" 
        onClick={() => setPage(page + 1)} 
        disabled={page >= totalPages - 1}
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  )
}
