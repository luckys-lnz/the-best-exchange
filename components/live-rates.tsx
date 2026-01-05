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
  children: (data: { rates: Rates | null; error: string }) => React.ReactNode;
}) {
  const [rates, setRates] = useState<Rates | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;

    const fetchRates = async () => {
      try {
        const res = await fetch("/api/rates", { cache: "no-store" });
        if (!res.ok) throw new Error("Failed to fetch rates");

        const data = await res.json();

        if (mounted) {
          setRates(data);
          setError("");
        }
      } catch (err: any) {
        if (mounted) {
          setRates(null);
          setError(err.message || "Unable to fetch live rates");
        }
      }
    };

    fetchRates();
    const interval = setInterval(fetchRates, 10_000); // 🔥 10s polling

    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, []);

  return <>{children({ rates, error })}</>;
}
