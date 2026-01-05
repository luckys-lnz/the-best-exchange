"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { LiveRates } from "@/components/live-rates";
import { Badge } from "@/components/ui/badge";

export function RateDisplay() {
  return (
    <LiveRates>
      {({ rates, error, isLoading }) => (
        <Card className="max-w-xl mx-auto shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-xl">
                Live Exchange Rates
              </CardTitle>
              <CardDescription className="mt-1">
                {isLoading
                  ? "Updating rates…"
                  : `Updated at ${new Date(
                      rates!.updatedAt
                    ).toLocaleTimeString("en-GB")} GMT`}
              </CardDescription>
            </div>

            <Badge
              variant="outline"
              className={
                isLoading
                  ? "text-muted-foreground"
                  : "border-green-500 text-green-600"
              }
            >
              {isLoading ? "SYNCING" : "LIVE"}
            </Badge>
          </CardHeader>

          <CardContent className="space-y-4">
            {/* Loading State */}
            {isLoading && (
              <div className="grid grid-cols-2 gap-4">
                <SkeletonCard label="BUY" />
                <SkeletonCard label="SELL" />
              </div>
            )}

            {/* Error State */}
            {!isLoading && error && (
              <p className="text-sm text-red-600 text-center">
                {error}
              </p>
            )}

            {/* Rates */}
            {!isLoading && rates && (
              <div className="grid grid-cols-2 gap-4">
                <RateBox
                  label="BUY"
                  value={rates.BUY_RATE}
                  color="green"
                />
                <RateBox
                  label="SELL"
                  value={rates.SELL_RATE}
                  color="red"
                />
              </div>
            )}

            <p className="text-xs text-muted-foreground text-center pt-2">
              Rates update in real-time. Final amount may vary.
            </p>
          </CardContent>
        </Card>
      )}
    </LiveRates>
  );
}

/* ---------------- Components ---------------- */

function RateBox({
  label,
  value,
  color,
}: {
  label: string;
  value: number;
  color: "green" | "red";
}) {
  return (
    <div className="rounded-lg border p-4 text-center">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p
        className={`mt-1 text-2xl font-bold ${
          color === "green" ? "text-green-600" : "text-red-600"
        }`}
      >
        ₦{value}
      </p>
      <p className="text-xs text-muted-foreground mt-1">
        per 1 GHS
      </p>
    </div>
  );
}

function SkeletonCard({ label }: { label: string }) {
  return (
    <div className="rounded-lg border p-4 text-center space-y-2">
      <p className="text-xs text-muted-foreground">{label}</p>
      <div className="h-8 bg-muted animate-pulse rounded" />
      <div className="h-3 w-20 mx-auto bg-muted animate-pulse rounded" />
    </div>
  );
}
