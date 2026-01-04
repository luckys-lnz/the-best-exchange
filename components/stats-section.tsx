import { Card, CardContent } from "@/components/ui/card"

const STATS = [
  { label: "Daily Volume", value: "GHS 700k+" },
  { label: "Liquidity", value: "Premium" },
  { label: "Avg. Speed", value: "< 2mins" },
  { label: "Success Rate", value: "99.8%" },
]

export function StatsSection() {
  return (
    <div className="grid gap-4 md:grid-cols-4">
      {STATS.map((stat) => (
        <Card
          key={stat.label}
          className="border border-[color:var(--border)] bg-[color:var(--card)] shadow-sm transition-colors"
        >
          <CardContent className="pt-6 text-center">
            <p className="text-[color:var(--muted-foreground)] text-xs mb-2 font-semibold uppercase">{stat.label}</p>
            <p className="text-2xl font-bold text-[color:var(--card-foreground)]">{stat.value}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
