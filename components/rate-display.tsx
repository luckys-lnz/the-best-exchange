"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const PROFIT = 10;
const SHEET_JSON_URL =
  "https://docs.google.com/document/d/e/2PACX-1vT5vJkS26lFaw6LeONnKi2SH2d9JsuirTR97Z2wm6X_9gtpXRq85P0FpxnqkrqxLZbjFmOdgl9uJ_ZM/pub";

type Rates = { buy?: number; sell?: number };

export function RateDisplay() {
  const [rates, setRates] = useState<Rates>({});
  const [prevRates, setPrevRates] = useState<Rates>({});
  const [error, setError] = useState("");

  const lastUpdate = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  async function fetchRates() {
    try {
      const res = await fetch(SHEET_JSON_URL);
      if (!res.ok) throw new Error("Failed to fetch sheet");

      const text = await res.text();
      const json = JSON.parse(text.substring(text.indexOf("{"), text.lastIndexOf("}") + 1));

      const newRates: Rates = {};
      json.table.rows.forEach((row: any) => {
        const key = row.c[0]?.v;
        const value = Number(row.c[1]?.v);
        if (key === "BUY_RATE") newRates.buy = value - PROFIT;
        if (key === "SELL_RATE") newRates.sell = value + PROFIT;
      });

      if (!newRates.buy || !newRates.sell) throw new Error("Invalid sheet data");

      setPrevRates(rates);
      setRates(newRates);
      setError("");
    } catch (e) {
      console.error("Failed to fetch sheet rates", e);
      setPrevRates(rates);
      setRates({});
      setError("Unable to fetch current rates. Please try again later.");
    }
  }

  useEffect(() => {
    fetchRates();
    const interval = setInterval(fetchRates, 60_000); // refresh every 60 seconds
    return () => clearInterval(interval);
  }, []);

  const calcChange = (newR?: number, oldR?: number) =>
    newR !== undefined && oldR !== undefined && oldR !== 0 ? ((newR - oldR) / oldR) * 100 : 0;

  const buyChange = calcChange(rates.buy, prevRates.buy);
  const sellChange = calcChange(rates.sell, prevRates.sell);

  return (
    <Card className="border-[color:var(--border)] bg-[color:var(--card)] shadow-sm transition-colors">
      <CardHeader className="border-b border-[color:var(--sidebar-border)]">
        <CardTitle className="text-card-foreground text-xl">Live Exchange Rates</CardTitle>
        <CardDescription className="text-[color:var(--muted-foreground)]">
          Last Updated: {lastUpdate} • Updated at 8:00 AM GMT
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        {error && <p className="text-red-600 font-semibold mb-2">{error}</p>}

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-4 font-semibold text-muted-foreground text-sm">Pair</th>
                <th className="text-right py-3 px-4 font-semibold text-green-600 text-sm">BUY</th>
                <th className="text-right py-3 px-4 font-semibold text-red-600 text-sm">SELL</th>
                <th className="text-right py-3 px-4 font-semibold text-muted-foreground text-sm">24H Change</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-border hover:bg-muted transition">
                <td className="py-4 px-4 font-medium text-card-foreground">NGN/GHS</td>
                <td className="text-right py-4 px-4">
                  <div className="text-lg font-bold text-green-600">
                    {rates.buy !== undefined ? `#${rates.buy}` : "-"}
                  </div>
                  <div className="text-xs text-green-600/70 mt-1">(1 GHS)</div>
                </td>
                <td className="text-right py-4 px-4">
                  <div className="text-lg font-bold text-red-600 dark:text-red-400">
                    {rates.sell !== undefined ? `#${rates.sell}` : "-"}
                  </div>
                  <div className="text-xs text-red-600/70 dark:text-red-400/70 mt-1">(1 GHS)</div>
                </td>
                <td
                  className={`text-right py-4 px-4 font-semibold ${
                    sellChange >= 0 ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {rates.sell !== undefined && prevRates.sell !== undefined
                    ? `${sellChange >= 0 ? "+" : ""}${sellChange.toFixed(2)}%`
                    : "-"}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="mt-4 p-3 rounded bg-muted border border-border">
          <p className="text-muted-foreground text-sm">
            ⚠️ Rates update in real-time. Final amount may vary based on market conditions.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
