import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { LiveRates } from "@/components/live-rates"

export async function RateDisplay() {
  const lastUpdate = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  return (
    <LiveRates>
      {({ rates, error }) => {
        if (error || !rates) {
          return (
            <Card className="border border-border bg-card shadow-sm transition-colors">
              <CardHeader className="border-b border-sidebar-border">
                <CardTitle className="text-card-foreground text-xl">Live Exchange Rates</CardTitle>
                <CardDescription className="text-muted-foreground">Last Updated: {lastUpdate}</CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <p className="text-muted-foreground">Unable to fetch live rates. Please try again later.</p>
                {error && <p className="text-xs text-red-600 mt-2">Error: {error}</p>}
              </CardContent>
            </Card>
          )
        }

        const { BUY_RATE, SELL_RATE } = rates

        return (
          <Card className="border border-border bg-card shadow-sm transition-colors">
            <CardHeader className="border-b border-sidebar-border">
              <CardTitle className="text-card-foreground text-xl">Live Exchange Rates</CardTitle>
              <CardDescription className="text-muted-foreground">
                Last Updated: {lastUpdate} • Updated at 8:00 AM GMT
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
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
                        <div className="text-lg font-bold text-green-600">#{BUY_RATE}</div>
                        <div className="text-xs text-green-600/70 mt-1">(1 GHS)</div>
                      </td>
                      <td className="text-right py-4 px-4">
                        <div className="text-lg font-bold text-red-600">#{SELL_RATE}</div>
                        <div className="text-xs text-red-600/70 mt-1">(1 GHS)</div>
                      </td>
                      <td className="text-right py-4 px-4 text-muted-foreground">+0.45%</td>
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
        )
      }}
    </LiveRates>
  )
}
