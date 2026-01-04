"use client"

import { useEffect, useState } from "react"

const CAROUSEL_ITEMS = [
  {
    title: "Real-Time Exchange Rates",
    description: "Accurate live FX rates updated in real time across markets",
    bgColor:
      "bg-gradient-to-r from-slate-950 via-blue-950 to-blue-900",
  },
  {
    title: "Secure & Transparent",
    description: "Institution-grade security with full pricing transparency",
    bgColor:
      "bg-gradient-to-r from-blue-950 via-cyan-950 to-teal-900",
  },
  {
    title: "Best Market Rates",
    description: "Competitive FX pricing aligned with global liquidity",
    bgColor:
      "bg-gradient-to-r from-slate-950 via-indigo-950 to-sky-900",
  },
]

export function HeroCarousel() {
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % CAROUSEL_ITEMS.length)
    }, 5000)

    return () => clearInterval(timer)
  }, [])

    return (
      <div className="relative h-56 sm:h-60 overflow-hidden rounded-xl border border-border shadow-xl">
      {CAROUSEL_ITEMS.map((item, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            index === current ? "opacity-100" : "opacity-0"
          }`}
        >
          <div
            className={`${item.bgColor} relative h-full flex flex-col justify-center items-center text-center px-6`}
          >
            {/* subtle trading glow */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.08),transparent_60%)]" />

            {/* grid overlay for forex terminal feel */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-size-[40px_40px]" />

            <h2 className="relative text-3xl font-semibold tracking-tight text-white mb-2">
              {item.title}
            </h2>

            <p className="relative text-white/70 text-sm max-w-xl">
              {item.description}
            </p>
          </div>
        </div>
      ))}

      {/* indicators */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
        {CAROUSEL_ITEMS.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrent(index)}
            aria-label={`Slide ${index + 1}`}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              index === current
                ? "bg-cyan-400 w-8 shadow-[0_0_10px_rgba(34,211,238,0.8)]"
                : "bg-white/30 w-2"
            }`}
          />
        ))}
      </div>
    </div>
  )
}
