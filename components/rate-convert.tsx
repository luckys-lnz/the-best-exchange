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

export function RateConvert() {
  const [amount, setAmount] = useState("");
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

  const handleConvert = () => {
    if (!effectiveRates) return;

    const numAmount = Number(amount);
    if (!numAmount || isNaN(numAmount)) return;

    let converted: number;

    // NGN → GHS (user sends NGN)
    if (fromCurrency === "NGN" && toCurrency === "GHS") {
      converted = numAmount / effectiveRates.SELL;
    }
    // GHS → NGN (user sends GHS)
    else if (fromCurrency === "GHS" && toCurrency === "NGN") {
      converted = numAmount * effectiveRates.BUY;
    } else {
      converted = numAmount;
    }

    setResult(Number(converted.toFixed(2)));
  };

  const handleSwapCurrency = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
    setResult(null);
    setAmount("");
  };

  return (
    <Card className="border-border bg-card shadow-sm transition-colors">
      <CardHeader className="border-b border-sidebar-border">
        <CardTitle>Convert</CardTitle>
        <CardDescription>Exchange between currencies instantly</CardDescription>
      </CardHeader>

      <CardContent className="space-y-4 pt-6">
        {/* Show error if rates are not available */}
        {error && <p className="text-red-600 font-semibold">{error}</p>}

        {/* From Currency */}
        <Select
          value={fromCurrency}
          onValueChange={setFromCurrency}
          disabled={!rates || loading}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="NGN">NGN (Nigerian Naira)</SelectItem>
            <SelectItem value="GHS">GHS (Ghanaian Cedi)</SelectItem>
          </SelectContent>
        </Select>

        {/* To Currency */}
        <Select
          value={toCurrency}
          onValueChange={setToCurrency}
          disabled={!rates || loading}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="GHS">GHS (Ghanaian Cedi)</SelectItem>
            <SelectItem value="NGN">NGN (Nigerian Naira)</SelectItem>
          </SelectContent>
        </Select>

        <Button
          onClick={handleSwapCurrency}
          variant="outline"
          disabled={!rates || loading}
        >
          ⇄ Swap
        </Button>

        <Input
          type="number"
          placeholder="0.00"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          disabled={!rates || loading}
        />

        <Button onClick={handleConvert} disabled={!rates || loading}>
          Convert
        </Button>

        {/* Display Result */}
        {result !== null && (
          <div>
            <p>
              {result.toFixed(2)} {toCurrency}
            </p>
          </div>
        )}

        {/* Show "-" if rates are not loaded */}
        {!rates && !error && loading && (
          <p className="text-gray-500 font-semibold">Loading rates…</p>
        )}
      </CardContent>
    </Card>
  );
}
