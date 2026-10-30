'use client' // Error boundaries must be Client Components
 
import * as Sentry from '@sentry/nextjs'
import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { AlertTriangle, RotateCcw } from 'lucide-react'
 
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error)
    Sentry.captureException(error)
  }, [error])
 
  return (
    <div className="grid min-h-[60vh] place-items-center px-4 py-12">
      <div className="w-full max-w-md rounded-3xl border bg-card p-8 text-center shadow-sm">
        <span className="mx-auto grid size-14 place-items-center rounded-2xl bg-destructive/10 text-destructive"><AlertTriangle className="size-6" /></span>
        <h2 className="mt-5 text-2xl font-semibold tracking-tight">We hit a snag.</h2>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">Your work is safe. Try loading this page again.</p>
        <Button className="mt-6 rounded-xl" onClick={() => reset()}><RotateCcw className="size-4" /> Try again</Button>
      </div>
    </div>
  )
}
