"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const PROFIT = 10
const SHEET_JSON_URL =
  "https://docs.google.com/document/d/e/2PACX-1vT5vJkS26lFaw6LeONnKi2SH2d9JsuirTR97Z2wm6X_9gtpXRq85P0FpxnqkrqxLZbjFmOdgl9uJ_ZM/pub"

type Rates = { BUY_RATE: number; SELL_RATE: number }

async function fetchSheetRates(): Promise<Rates> {
  const res = await fetch(SHEET_JSON_URL)
  if (!res.ok) throw new Error("Failed to fetch sheet")

  const text = await res.text()
  // strip Google's wrapper
  const json = JSON.parse(text.substring(text.indexOf("{"), text.lastIndexOf("}") + 1))

  let BUY_RATE = 0
  let SELL_RATE = 0

  json.table.rows.forEach((row: any) => {
    const key = row.c[0]?.v
    const value = Number(row.c[1]?.v)
    if (key === "BUY_RATE") BUY_RATE = value
    if (key === "SELL_RATE") SELL_RATE = value
  })

  if (!BUY_RATE || !SELL_RATE) throw new Error("Invalid sheet data")

  return { BUY_RATE, SELL_RATE }
}

export function RateConvert() {
  const [amount, setAmount] = useState("")
  const [fromCurrency, setFromCurrency] = useState("NGN")
  const [toCurrency, setToCurrency] = useState("GHS")
  const [result, setResult] = useState<number | null>(null)
  const [rates, setRates] = useState<Rates | null>(null)
  const [error, setError] = useState("")

  // Fetch rates on mount and every 60 seconds
  useEffect(() => {
    const loadRates = async () => {
      try {
        const data = await fetchSheetRates()
        setRates(data)
        setError("")
      } catch {
        setRates(null)
        setError("Unable to fetch current rates.")
      }
    }

    loadRates()
    const interval = setInterval(loadRates, 60_000)
    return () => clearInterval(interval)
  }, [])

  const handleConvert = () => {
    if (!rates) {
      setResult(null)
      return
    }

    const numAmount = Number(amount)
    if (!numAmount || isNaN(numAmount)) {
      setResult(null)
      return
    }

    // Apply profit adjustments
    const BUY_RATE = rates.BUY_RATE - PROFIT
    const SELL_RATE = rates.SELL_RATE + PROFIT

    let converted
    if (fromCurrency === "NGN" && toCurrency === "GHS") converted = numAmount / SELL_RATE
    else if (fromCurrency === "GHS" && toCurrency === "NGN") converted = numAmount * BUY_RATE
    else converted = numAmount

    setResult(Number(converted.toFixed(2)))
  }

  const handleSwapCurrency = () => {
    setFromCurrency(toCurrency)
    setToCurrency(fromCurrency)
    setResult(null)
    setAmount("")
  }

  return (
    <Card className="border-[color:var(--border)] bg-[color:var(--card)] shadow-sm transition-colors">
      <CardHeader className="border-b border-[color:var(--sidebar-border)]">
        <CardTitle>Convert</CardTitle>
        <CardDescription>Exchange between currencies instantly</CardDescription>
      </CardHeader>

      <CardContent className="space-y-4 pt-6">
        {/* Show error if rates are not available */}
        {error && <p className="text-red-600 font-semibold">{error}</p>}

        {/* From Currency */}
        <Select value={fromCurrency} onValueChange={setFromCurrency} disabled={!rates}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="NGN">NGN (Nigerian Naira)</SelectItem>
            <SelectItem value="GHS">GHS (Ghanaian Cedi)</SelectItem>
          </SelectContent>
        </Select>

        {/* To Currency */}
        <Select value={toCurrency} onValueChange={setToCurrency} disabled={!rates}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="GHS">GHS (Ghanaian Cedi)</SelectItem>
            <SelectItem value="NGN">NGN (Nigerian Naira)</SelectItem>
          </SelectContent>
        </Select>

        <Button onClick={handleSwapCurrency} variant="outline" disabled={!rates}>⇄ Swap</Button>

        <Input
          type="number"
          placeholder="0.00"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          disabled={!rates}
        />

        <Button onClick={handleConvert} disabled={!rates}>Convert</Button>

        {/* Display Result */}
        {result !== null && (
          <div>
            <p>{result.toFixed(2)} {toCurrency}</p>
          </div>
        )}

        {/* Show "-" if rates are not loaded */}
        {!rates && !error && <p className="text-gray-500 font-semibold">-</p>}
      </CardContent>
    </Card>
  )
}
