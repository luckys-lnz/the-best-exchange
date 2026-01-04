"use client"

import * as React from "react"

interface ThemeProviderProps {
  children: React.ReactNode
  attribute?: string
  defaultTheme?: string
  storageKey?: string
}

export function ThemeProvider({
  children,
  attribute = "class",
  defaultTheme = "system",
  storageKey = "theme",
}: ThemeProviderProps) {
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)

    const savedTheme = localStorage.getItem(storageKey) || defaultTheme
    const isDark =
      savedTheme === "dark" || (savedTheme === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches)

    const html = document.documentElement
    if (isDark) {
      html.classList.add("dark")
    } else {
      html.classList.remove("dark")
    }
  }, [storageKey, defaultTheme])

  if (!mounted) {
    return <>{children}</>
  }

  return <>{children}</>
}
