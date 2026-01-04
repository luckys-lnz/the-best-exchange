"use client"

import { useEffect, useState, useRef, useCallback } from "react"

type Rates = {
  BUY_RATE: number
  SELL_RATE: number
}

export function useLiveRates({ pollInterval = 60_000 } = {}) {
  const [rates, setRates] = useState<Rates | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const intervalRef = useRef<number | null>(null)

  const fetchRates = useCallback(async () => {
    try {
      setLoading(true)
      const res = await fetch("/api/rates", { cache: "no-store" })
      if (!res.ok) throw new Error("Failed to fetch rates")
      const data = await res.json()
      setRates(data)
      setError(null)
    } catch (e) {
      setError("Unable to fetch current rates.")
      setRates(null)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchRates()
    if (pollInterval > 0) {
      intervalRef.current = window.setInterval(fetchRates, pollInterval)
      return () => {
        if (intervalRef.current) window.clearInterval(intervalRef.current)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetchRates, pollInterval])

  return { rates, loading, error, refresh: fetchRates }
}
