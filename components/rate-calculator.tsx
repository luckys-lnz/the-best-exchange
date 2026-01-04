"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const PROFIT = 10;
const SHEET_JSON_URL =
  "https://docs.google.com/document/d/e/2PACX-1vT5vJkS26lFaw6LeONnKi2SH2d9JsuirTR97Z2wm6X_9gtpXRq85P0FpxnqkrqxLZbjFmOdgl9uJ_ZM/pub";

type Rates = { BUY_RATE: number; SELL_RATE: number };

async function fetchSheetRates(): Promise<Rates> {
  const res = await fetch(SHEET_JSON_URL);
  if (!res.ok) throw new Error("Failed to fetch sheet");

  const text = await res.text();
  const json = JSON.parse(text.substring(text.indexOf("{"), text.lastIndexOf("}") + 1));

  let BUY_RATE = 0;
  let SELL_RATE = 0;

  json.table.rows.forEach((row: any) => {
    const key = row.c[0]?.v;
    const value = Number(row.c[1]?.v);
    if (key === "BUY_RATE") BUY_RATE = value;
    if (key === "SELL_RATE") SELL_RATE = value;
  });

  if (!BUY_RATE || !SELL_RATE) throw new Error("Invalid sheet data");

  return { BUY_RATE, SELL_RATE };
}

export function RateCalculator() {
  const [desiredAmount, setDesiredAmount] = useState("");
  const [fromCurrency, setFromCurrency] = useState("NGN");
  const [toCurrency, setToCurrency] = useState("GHS");
  const [result, setResult] = useState<number | null>(null);
  const [rates, setRates] = useState<Rates | null>(null);
  const [error, setError] = useState("");

  // Fetch rates on mount and every 60 seconds
  useEffect(() => {
    const loadRates = async () => {
      try {
        const data = await fetchSheetRates();
        setRates(data);
        setError("");
      } catch {
        setRates(null);
        setError("Unable to fetch current rates.");
      }
    };

    loadRates();
    const interval = setInterval(loadRates, 60_000);
    return () => clearInterval(interval);
  }, []);

  const BUY_RATE = rates ? rates.BUY_RATE - PROFIT : 0;
  const SELL_RATE = rates ? rates.SELL_RATE + PROFIT : 0;

  const handleCalculate = () => {
    if (!rates) {
      setResult(null);
      return;
    }

    const desired = Number(desiredAmount);
    if (!desired || isNaN(desired)) {
      setResult(null);
      return;
    }

    let toSend;
    if (fromCurrency === "NGN" && toCurrency === "GHS") toSend = desired * SELL_RATE;
    else if (fromCurrency === "GHS" && toCurrency === "NGN") toSend = desired / BUY_RATE;
    else toSend = desired;

    setResult(Number(toSend.toFixed(2)));
  };

  const handleSwapCurrency = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
    setResult(null);
    setDesiredAmount("");
  };

  return (
    <Card className="border-[color:var(--border)] bg-[color:var(--card)] shadow-sm transition-colors">
      <CardHeader className="border-b border-[color:var(--sidebar-border)]">
        <CardTitle className="text-[color:var(--card-foreground)]">
          Calculate Amount
        </CardTitle>
        <CardDescription className="text-[color:var(--muted-foreground)]">
          How much to send for desired amount
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4 pt-6">
        {/* Show error if rates are not available */}
        {error && <p className="text-red-600 font-semibold">{error}</p>}

        {/* From Currency */}
        <div>
          <label className="text-xs font-semibold text-[color:var(--muted-foreground)] mb-2 block uppercase">
            From
          </label>
          <Select value={fromCurrency} onValueChange={setFromCurrency} disabled={!rates}>
            <SelectTrigger className="border-[color:var(--border)] bg-[color:var(--card)] text-[color:var(--card-foreground)]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="NGN">NGN (Nigerian Naira)</SelectItem>
              <SelectItem value="GHS">GHS (Ghanaian Cedi)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* To Currency */}
        <div>
          <label className="text-xs font-semibold text-[color:var(--muted-foreground)] mb-2 block uppercase">
            To
          </label>
          <Select value={toCurrency} onValueChange={setToCurrency} disabled={!rates}>
            <SelectTrigger className="border-[color:var(--border)] bg-[color:var(--card)] text-[color:var(--card-foreground)]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="GHS">GHS (Ghanaian Cedi)</SelectItem>
              <SelectItem value="NGN">NGN (Nigerian Naira)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Swap Button */}
        <Button
          onClick={handleSwapCurrency}
          variant="outline"
          className="w-full text-emerald-600 border-[color:var(--border)] hover:bg-[color:var(--muted)] bg-[color:var(--card)] text-[color:var(--card-foreground)]"
          disabled={!rates}
        >
          ⇄ Swap
        </Button>

        {/* Amount Input */}
        <div>
          <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2 block uppercase">
            Amount to Receive
          </label>
          <Input
            type="number"
            placeholder="0.00"
            value={desiredAmount}
            onChange={(e) => setDesiredAmount(e.target.value)}
            className="border-[color:var(--border)] bg-[color:var(--card)] text-[color:var(--card-foreground)] placeholder:text-[color:var(--muted-foreground)]"
            disabled={!rates}
          />
        </div>

        {/* Calculate Button */}
        <Button
          onClick={handleCalculate}
          className="w-full bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-600 dark:hover:bg-emerald-700 text-white font-semibold shadow-none"
          disabled={!rates}
        >
          Calculate
        </Button>

        {/* Display Result */}
        {result !== null && rates && (
          <div className="mt-4 p-4 rounded border border-[color:var(--border)] bg-[color:var(--muted)]">
            <p className="text-xs text-[color:var(--muted-foreground)] uppercase mb-1">
              You need to send
            </p>
            <p className="text-2xl font-bold text-[color:var(--card-foreground)]">
              {result.toFixed(2)}{" "}
              <span className="text-base text-[color:var(--muted-foreground)]">
                {fromCurrency}
              </span>
            </p>
          </div>
        )}

        {/* Show placeholder "-" if rates not loaded and no error */}
        {!rates && !error && <p className="text-gray-500 font-semibold">-</p>}
      </CardContent>
    </Card>
  );
}
