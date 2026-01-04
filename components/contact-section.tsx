"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useToast } from '@/hooks/use-toast'

export function ContactSection() {
  const year = new Date().getFullYear()

  const { toast } = useToast()

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      const t = toast({ title: 'Copied', description: text })
      // auto dismiss after 1.8s
      setTimeout(() => t.dismiss(), 1800)
    } catch (e) {
      toast({ title: 'Copy failed', description: 'Unable to copy number' })
    }
  }

  return (
    <Card className="border-border bg-card shadow-sm transition-colors mt-16">
      <CardHeader className="border-b border-sidebar-border">
        <CardTitle className="text-card-foreground text-xl">Get Started</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6 pt-6">
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <p className="text-slate-600 dark:text-slate-400 mb-3 text-sm font-medium">WhatsApp Support</p>
            <Button
              asChild
              className="w-full"
            >
              <a href="https://wa.me/233204531903" target="_blank" rel="noopener noreferrer">
                Contact on WhatsApp
              </a>
            </Button>
          </div>

          <div>
            <p className="text-slate-600 dark:text-slate-400 mb-3 text-sm font-medium">Email Support</p>
            <Button
              asChild
              className="w-full"
            >
              <a href="mailto:chaoticstanza2020@gmail.com">Send Email</a>
            </Button>
          </div>
        </div>

        <div className="pt-4 border-t border-sidebar-border">
          <p className="text-center text-muted-foreground text-xs">
            Response time: Within minutes during business hours
          </p>
        </div>
        
        <div className="pt-4">
          <h3 className="text-sm font-semibold text-muted-foreground mb-2">Phone Support</h3>
          <ul className="space-y-2 text-center">
            <li>
              <a href="tel:0204531903" className="text-card-foreground underline">0204531903</a>
              <button type="button" onClick={() => copyToClipboard('0204531903')} className="ml-3 text-muted-foreground text-xs">Copy</button>
            </li>
            <li>
              <a href="tel:0552641890" className="text-card-foreground underline">055 264 1890</a>
              <button type="button" onClick={() => copyToClipboard('0552641890')} className="ml-3 text-muted-foreground text-xs">Copy</button>
            </li>
            <li>
              <a href="tel:0539323110" className="text-card-foreground underline">0539323110</a>
              <button type="button" onClick={() => copyToClipboard('0539323110')} className="ml-3 text-muted-foreground text-xs">Copy</button>
            </li>
          </ul>
        </div>

        <div className="pt-6 border-t border-sidebar-border">
          <p className="text-center text-muted-foreground text-xs">© {year} The Best Exchange. All rights reserved.</p>
        </div>
      </CardContent>
    </Card>
  )
}
