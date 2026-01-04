import { getRates } from '@/lib/getRates'

type Rates = {
  BUY_RATE: number
  SELL_RATE: number
}

type Props = {
  children: (rates: Rates) => React.ReactNode
}

export async function LiveRates({ children }: Props) {
  const rates = await getRates()
  return <>{children(rates)}</>
}
