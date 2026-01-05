"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { LiveRates } from "@/components/live-rates";

export function RateDisplay() {
  return (
    <LiveRates>
      {({ rates, error }) => {
        if (error || !rates) {
          return (
            <Card>
              <CardHeader>
                <CardTitle>Live Exchange Rates</CardTitle>
                <CardDescription>Unable to load rates</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-red-600 text-sm">{error}</p>
              </CardContent>
            </Card>
          );
        }

        const { BUY_RATE, SELL_RATE, updatedAt } = rates;

        const lastUpdate = new Date(updatedAt).toLocaleTimeString("en-GB", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          timeZone: "GMT",
        });

        return (
          <Card>
            <CardHeader>
              <CardTitle>Live Exchange Rates</CardTitle>
              <CardDescription>
                Last updated: {lastUpdate} GMT
              </CardDescription>
            </CardHeader>

            <CardContent>
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2">Pair</th>
                    <th className="text-right py-2 text-green-600">BUY</th>
                    <th className="text-right py-2 text-red-600">SELL</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b">
                    <td className="py-3">NGN / GHS</td>
                    <td className="text-right font-bold text-green-600">
                      ₦{BUY_RATE}
                    </td>
                    <td className="text-right font-bold text-red-600">
                      ₦{SELL_RATE}
                    </td>
                  </tr>
                </tbody>
              </table>

              <div className="mt-4 text-xs text-muted-foreground">
                ⚠️ Rates update automatically from Google Sheets.
              </div>
            </CardContent>
          </Card>
        );
      }}
    </LiveRates>
  );
}
