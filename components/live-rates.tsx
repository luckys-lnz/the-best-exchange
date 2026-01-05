"use client";

import { useEffect, useState } from "react";

type Rates = {
  BUY_RATE: number;
  SELL_RATE: number;
  updatedAt: number;
};

export function LiveRates({
  children,
}: {
  children: (state: {
    rates: Rates | null;
    error: string | null;
    isLoading: boolean;
  }) => React.ReactNode;
}) {
  const [rates, setRates] = useState<Rates | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  async function fetchRates() {
    setIsLoading(true);      // 🔑 HIDE OLD RATES IMMEDIATELY
    setError(null);

    try {
      const res = await fetch("/api/rates", {
        cache: "no-store",
      });

      if (!res.ok) throw new Error("Failed to fetch rates");

      const data = await res.json();
      setRates(data);
    } catch (err: any) {
      setError(err.message);
      setRates(null);
    } finally {
      setIsLoading(false);   // 🔑 REVEAL ONLY WHEN DONE
    }
  }

  useEffect(() => {
    fetchRates();

    const interval = setInterval(fetchRates, 60_000); // 1 min refresh
    return () => clearInterval(interval);
  }, []);

  return <>{children({ rates, error, isLoading })}</>;
}
