import { getRates } from '@/lib/getRates'

type Rates = {
  BUY_RATE: number
  SELL_RATE: number
}

type ChildArg = {
  rates: Rates | null
  error?: string
}

type Props = {
  children: (arg: ChildArg) => React.ReactNode
}

export async function LiveRates({ children }: Props) {
  try {
    const rates = await getRates()
    return <>{children({ rates })}</>
  } catch (err: any) {
    console.error("LiveRates fetch failed:", err)
    return <>{children({ rates: null, error: err?.message ?? "Failed to fetch rates" })}</>
  }
}
