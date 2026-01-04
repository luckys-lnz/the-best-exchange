import { Header } from "@/components/header"
import { HeroCarousel } from "@/components/hero-carousel"
import { RateDisplay } from "@/components/rate-display"
import { RateConvert } from "@/components/rate-convert"
import { RateCalculator } from "@/components/rate-calculator"
import { ContactSection } from "@/components/contact-section"
import { StatsSection } from "@/components/stats-section"

export default function Home() {
  return (
    <main className="min-h-screen transition-colors">
      <Header />
      <HeroCarousel />
      <div className="container mx-auto px-4 py-12 max-w-6xl space-y-16">
        <RateDisplay />
        <div className="grid gap-8 md:grid-cols-2">
          <RateConvert />
          <RateCalculator />
        </div>
        <StatsSection />
        <ContactSection />
      </div>
    </main>
  )
}
