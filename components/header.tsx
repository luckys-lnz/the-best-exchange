"use client"

import { Button } from "@/components/ui/button"

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-sidebar-border bg-sidebar/90 backdrop-blur transition-colors">
      <div className="container mx-auto max-w-6xl px-4 py-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          {/* Brand */}
          <div className="flex flex-col">
            <span className="text-2xl font-semibold tracking-tight bg-linear-to-r from-blue-700 via-cyan-600 to-sky-600 bg-clip-text text-transparent">
              THE BEST EXCHANGE RATE
            </span>

            <span className="text-xs uppercase tracking-widest text-slate-500 dark:text-slate-400 mt-1">
              Forex • FX Transfer • Live Rates
            </span>
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-3 mt-3 sm:mt-0">
            <Button asChild size="sm">
              <a href="https://wa.me/233204531903" target="_blank" rel="noopener noreferrer" aria-label="Contact on WhatsApp">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="size-4 mr-2 inline-block" fill="currentColor" aria-hidden>
                  <path d="M20.52 3.48A11.88 11.88 0 0 0 12 .5C6.21.5 1.5 5.21 1.5 11c0 1.94.51 3.84 1.48 5.52L.5 23.5l6.9-1.82A11.88 11.88 0 0 0 12 22.5c5.79 0 10.5-4.71 10.5-10.5 0-1.98-.55-3.83-1.98-5.52zM12 20.25c-1.4 0-2.78-.36-3.98-1.04l-.29-.17-4.1 1.08 1.08-3.99-.17-.29A8.25 8.25 0 1 1 20.25 11 8.22 8.22 0 0 1 12 20.25z" />
                  <path d="M17.13 14.03c-.28-.14-1.64-.81-1.9-.91-.26-.11-.45-.14-.64.14-.18.28-.7.91-.86 1.1-.16.18-.32.2-.6.07-.28-.14-1.18-.43-2.25-1.39-.83-.74-1.39-1.66-1.55-1.93-.16-.28-.02-.43.12-.57.12-.12.28-.32.42-.48.14-.16.18-.28.28-.47.09-.18.05-.34-.02-.48-.07-.14-.64-1.54-.88-2.11-.23-.55-.47-.47-.64-.48-.17-.01-.36-.01-.55-.01s-.48.07-.73.34c-.25.27-.98.96-.98 2.34s1.01 2.72 1.15 2.91c.14.18 1.98 3.02 4.8 4.23 1.44.62 2.56.99 3.44 1.27.99.31 1.89.27 2.6.16.79-.12 1.64-.67 1.87-1.32.23-.65.23-1.21.16-1.33-.07-.12-.26-.18-.55-.32z" />
                </svg>
                Contact on WhatsApp
              </a>
            </Button>
            {/* <ThemeToggle /> */}
          </div>
        </div>

          <p className="mt-2 text-sm text-muted-foreground max-w-xl">
          Professional currency exchange with real-time forex pricing and
          transparent market rates.
        </p>
      </div>
    </header>
  )
}
