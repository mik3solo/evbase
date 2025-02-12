"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

export function MainNav() {
  const pathname = usePathname()

  return (
    <div className="flex items-center gap-6">
      <nav className="hidden md:flex items-center rounded-full bg-white/[0.02] backdrop-blur-sm px-6 py-2">
        <Link
          href="/"
          className={cn(
            "px-3 py-1.5 text-sm transition-colors hover:text-logo-blue rounded-full font-heading",
            pathname === "/" ? "bg-white/5 text-foreground" : "text-muted-foreground",
          )}
        >
          Home
        </Link>
        <Link
          href="/news"
          className={cn(
            "px-3 py-1.5 text-sm transition-colors hover:text-logo-blue rounded-full font-heading",
            pathname === "/news" ? "bg-white/5 text-foreground" : "text-muted-foreground",
          )}
        >
          News
        </Link>
        <Link
          href="/cars"
          className={cn(
            "px-3 py-1.5 text-sm transition-colors hover:text-logo-blue rounded-full font-heading",
            pathname === "/cars" ? "bg-white/5 text-foreground" : "text-muted-foreground",
          )}
        >
          Cars
        </Link>
        <Link
          href="/calculator"
          className={cn(
            "px-3 py-1.5 text-sm transition-colors hover:text-logo-blue rounded-full font-heading",
            pathname === "/calculator" ? "bg-white/5 text-foreground" : "text-muted-foreground",
          )}
        >
          Calculator
        </Link>
        <Link
          href="/listings"
          className={cn(
            "px-3 py-1.5 text-sm transition-colors hover:text-logo-blue rounded-full font-heading",
            pathname === "/listings" ? "bg-white/5 text-foreground" : "text-muted-foreground",
          )}
        >
          Listings
        </Link>
      </nav>
      <Button variant="ghost" className="text-muted-foreground hover:text-foreground transition-colors">
        Contact Us
      </Button>
    </div>
  )
}

