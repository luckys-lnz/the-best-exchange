// "use client"

// import { useState, useEffect } from "react"
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// import { Input } from "@/components/ui/input"
// import { Button } from "@/components/ui/button"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// // --- CONFIG ---
// const PROFIT = 10 // NGN profit applied: +PROFIT on SELL, -PROFIT on BUY

// // --- HELPER: Fetch rates from Google Sheets ---
// async function getRates() {
//   const SHEET_URL = "https://docs.google.com/spreadsheets/d/YOUR_SHEET_ID/gviz/tq?tqx=out:json"

//   try {
//     const res = await fetch(SHEET_URL)
//     const text = await res.text()

//     // Parse JSON from Google wrapper
//     const json = JSON.parse(text.substring(text.indexOf("{"), text.lastIndexOf("}") + 1))
//     const rates: Record<string, number> = {}

//     json.table.rows.forEach((row: any) => {
//       const key = row.c[0].v
//       const value = Number(row.c[1].v)
//       rates[key] = value
//     })

//     return rates
//   } catch (e) {
//     console.error("Failed to fetch rates from Google Sheets:", e)
//     // Fallback rates
//     return {
//       BUY_RATE: 131,
//       SELL_RATE: 118,
//     }
//   }
// }

// // --- HELPER: Adjust rates for profit ---
// function getAdjustedRates(rawRates: { BUY_RATE: number; SELL_RATE: number }) {
//   return {
//     BUY_RATE: rawRates.BUY_RATE - PROFIT,   // user sells GHS → platform profit
//     SELL_RATE: rawRates.SELL_RATE + PROFIT, // user buys GHS → platform profit
//   }
// }

// // --- MAIN COMPONENT ---
// export default function Forex() {
//   const [rates, setRates] = useState({ BUY_RATE: 131, SELL_RATE: 118 })
//   const [fromCurrency, setFromCurrency] = useState("NGN")
//   const [toCurrency, setToCurrency] = useState("GHS")
//   const [amount, setAmount] = useState("")
//   const [result, setResult] = useState<number | null>(null)
//   const [mode, setMode] = useState<"convert" | "calculator">("convert") // switch between modes

//   // Load rates from Google Sheets
//   useEffect(() => {
//     getRates().then(setRates)
//   }, [])

//   const { BUY_RATE, SELL_RATE } = getAdjustedRates(rates)

//   // --- Conversion logic ---
//   const handleConvert = () => {
//     const num = Number(amount)
//     if (!num || isNaN(num)) return setResult(null)

//     let converted: number
//     if (fromCurrency === "NGN" && toCurrency === "GHS") {
//       converted = num / SELL_RATE
//     } else if (fromCurrency === "GHS" && toCurrency === "NGN") {
//       converted = num * BUY_RATE
//     } else {
//       converted = num
//     }

//     setResult(Number(converted.toFixed(2)))
//   }

//   // --- Calculator logic ---
//   const handleCalculate = () => {
//     const desired = Number(amount)
//     if (!desired || isNaN(desired)) return setResult(null)

//     let toSend: number
//     if (fromCurrency === "NGN" && toCurrency === "GHS") {
//       toSend = desired * SELL_RATE
//     } else if (fromCurrency === "GHS" && toCurrency === "NGN") {
//       toSend = desired / BUY_RATE
//     } else {
//       toSend = desired
//     }

//     setResult(Number(toSend.toFixed(2)))
//   }

//   const handleSwap = () => {
//     setFromCurrency(toCurrency)
//     setToCurrency(fromCurrency)
//     setAmount("")
//     setResult(null)
//   }

//   return (
//     <Card className="border-[color:var(--border)] bg-[color:var(--card)] shadow-sm transition-colors">
//       <CardHeader className="border-b border-[color:var(--sidebar-border)]">
//         <CardTitle className="text-[color:var(--card-foreground)]">
//           {mode === "convert" ? "Convert Currency" : "Calculate Amount"}
//         </CardTitle>
//         <CardDescription className="text-[color:var(--muted-foreground)]">
//           {mode === "convert"
//             ? "See how much you'll receive after conversion"
//             : "Calculate how much you need to send"}
//         </CardDescription>
//       </CardHeader>

//       <CardContent className="space-y-4 pt-6">
//         {/* MODE SWITCH */}
//         <div className="flex gap-2">
//           <Button
//             onClick={() => { setMode("convert"); setResult(null); setAmount("") }}
//             variant={mode === "convert" ? "default" : "outline"}
//             className="flex-1"
//           >
//             Convert
//           </Button>
//           <Button
//             onClick={() => { setMode("calculator"); setResult(null); setAmount("") }}
//             variant={mode === "calculator" ? "default" : "outline"}
//             className="flex-1"
//           >
//             Calculator
//           </Button>
//         </div>

//         {/* FROM */}
//         <div>
//           <label className="text-xs font-semibold text-[color:var(--muted-foreground)] mb-2 block uppercase">From</label>
//           <Select value={fromCurrency} onValueChange={setFromCurrency}>
//             <SelectTrigger className="border-[color:var(--border)] bg-[color:var(--card)] text-[color:var(--card-foreground)]">
//               <SelectValue />
//             </SelectTrigger>
//             <SelectContent>
//               <SelectItem value="NGN">NGN (Nigerian Naira)</SelectItem>
//               <SelectItem value="GHS">GHS (Ghanaian Cedi)</SelectItem>
//             </SelectContent>
//           </Select>
//         </div>

//         {/* TO */}
//         <div>
//           <label className="text-xs font-semibold text-[color:var(--muted-foreground)] mb-2 block uppercase">To</label>
//           <Select value={toCurrency} onValueChange={setToCurrency}>
//             <SelectTrigger className="border-[color:var(--border)] bg-[color:var(--card)] text-[color:var(--card-foreground)]">
//               <SelectValue />
//             </SelectTrigger>
//             <SelectContent>
//               <SelectItem value="GHS">GHS (Ghanaian Cedi)</SelectItem>
//               <SelectItem value="NGN">NGN (Nigerian Naira)</SelectItem>
//             </SelectContent>
//           </Select>
//         </div>

//         <Button
//           onClick={handleSwap}
//           variant="outline"
//           className="w-full text-emerald-600 border-[color:var(--border)] hover:bg-[color:var(--muted)] bg-[color:var(--card)] text-[color:var(--card-foreground)]"
//         >
//           ⇄ Swap
//         </Button>

//         {/* Amount input */}
//         <div>
//           <label className="text-xs font-semibold text-[color:var(--muted-foreground)] mb-2 block uppercase">
//             {mode === "convert" ? "Amount to convert" : "Amount to receive"}
//           </label>
//           <Input
//             type="number"
//             placeholder="0.00"
//             value={amount}
//             onChange={(e) => setAmount(e.target.value)}
//             className="border-[color:var(--border)] bg-[color:var(--card)] text-[color:var(--card-foreground)] placeholder:text-[color:var(--muted-foreground)]"
//           />
//         </div>

//         {/* Action button */}
//         <Button
//           onClick={mode === "convert" ? handleConvert : handleCalculate}
//           className="w-full bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-600 dark:hover:bg-emerald-700 text-white font-semibold shadow-none"
//         >
//           {mode === "convert" ? "Convert" : "Calculate"}
//         </Button>

//         {/* Result */}
//         {result !== null && (
//           <div className="mt-4 p-4 rounded border border-[color:var(--border)] bg-[color:var(--muted)]">
//             <p className="text-xs text-[color:var(--muted-foreground)] uppercase mb-1">
//               {mode === "convert" ? "You will receive" : "You need to send"}
//             </p>
//             <p className="text-2xl font-bold text-[color:var(--card-foreground)]">
//               {result.toFixed(2)} <span className="text-base text-[color:var(--muted-foreground)]">{mode === "convert" ? toCurrency : fromCurrency}</span>
//             </p>
//           </div>
//         )}

//         {/* Display current adjusted rates */}
//         <div className="mt-4 text-xs text-[color:var(--muted-foreground)] uppercase">
//           Current Rates: BUY = {BUY_RATE} NGN, SELL = {SELL_RATE} NGN
//         </div>
//       </CardContent>
//     </Card>
//   )
// }
