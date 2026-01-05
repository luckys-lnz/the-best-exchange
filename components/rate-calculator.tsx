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

import { useLiveRates } from "@/hooks/useLiveRates"
import { PROFIT } from "@/lib/constants"
type Rates = { BUY_RATE: number; SELL_RATE: number };

export function RateCalculator() {
  const [desiredAmount, setDesiredAmount] = useState("");
  const [fromCurrency, setFromCurrency] = useState("NGN");
  const [toCurrency, setToCurrency] = useState("GHS");
  const [result, setResult] = useState<number | null>(null);
  const [rates, setRates] = useState<Rates | null>(null);
  const [error, setError] = useState("");

  const { rates: liveRates, loading, error: loadError } = useLiveRates({
    pollInterval: 60_000,
  })

  useEffect(() => {
    setRates(liveRates)
  }, [liveRates])

  useEffect(() => {
    if (loadError) setError(loadError)
    else setError("")
  }, [loadError])

  const effectiveRates = rates
    ? {
        BUY: rates.BUY_RATE - PROFIT,
        SELL: rates.SELL_RATE + PROFIT,
      }
    : null;

  const handleCalculate = () => {
  if (!effectiveRates) return;

  const desired = Number(desiredAmount);
  if (!desired || isNaN(desired)) return;

  let calculated: number;

  // User wants GHS, sending NGN
  if (fromCurrency === "NGN" && toCurrency === "GHS") {
    // desired GHS → calculate required NGN
    calculated = desired * effectiveRates.SELL;
  }

  // User wants NGN, sending GHS
  else if (fromCurrency === "GHS" && toCurrency === "NGN") {
    // desired NGN → calculate required GHS
    calculated = desired / effectiveRates.BUY;
  }

  else {
    calculated = desired;
  }

  setResult(Number(calculated.toFixed(2)));
};


  const handleSwapCurrency = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
    setResult(null);
    setDesiredAmount("");
  };

  return (
    <Card className="border-border bg-card shadow-sm transition-colors">
      <CardHeader className="border-b border-sidebar-border">
        <CardTitle className="text-card-foreground">
          Calculate Amount
        </CardTitle>
        <CardDescription className="text-muted-foreground">
          How much to send for desired amount
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4 pt-6">
        {/* Show error if rates are not available */}
        {error && <p className="text-red-600 font-semibold">{error}</p>}

        {/* From Currency */}
        <div>
          <label className="text-xs font-semibold text-muted-foreground mb-2 block uppercase">
            From
          </label>
          <Select
              value={fromCurrency}
              onValueChange={setFromCurrency}
              disabled={!rates || loading}
            >
            <SelectTrigger className="border-border bg-card text-card-foreground">
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
          <label className="text-xs font-semibold text-muted-foreground mb-2 block uppercase">
            To
          </label>
          <Select
              value={toCurrency}
              onValueChange={setToCurrency}
              disabled={!rates || loading}
            >
            <SelectTrigger className="border-border bg-card text-card-foreground">
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
          className="w-full text-emerald-600 border-border hover:bg-muted bg-card"
          disabled={!rates || loading}
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
            className="border-border bg-card text-card-foreground placeholder:text-muted-foreground"
            disabled={!rates || loading}
          />
        </div>

        {/* Calculate Button */}
        <Button
          onClick={handleCalculate}
          className="w-full bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-600 dark:hover:bg-emerald-700 text-white font-semibold shadow-none"
          disabled={!rates || loading}
        >
          Calculate
        </Button>

        {/* Display Result */}
        {result !== null && rates && (
          <div className="mt-4 p-4 rounded border border-border bg-muted">
            <p className="text-xs text-muted-foreground uppercase mb-1">
              You need to send
            </p>
            <p className="text-2xl font-bold text-card-foreground">
              {result.toFixed(2)}{" "}
              <span className="text-base text-muted-foreground">
                {fromCurrency}
              </span>
            </p>
          </div>
        )}

        {/* Show placeholder "-" if rates not loaded and no error */}
        {!rates && !error && loading && (
          <p className="text-gray-500 font-semibold">Loading rates…</p>
        )}
      </CardContent>
    </Card>
  );
}
