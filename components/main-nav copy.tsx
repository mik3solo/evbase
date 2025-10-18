"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Search, Phone } from "lucide-react"
import { SearchModal } from "@/components/search-modal"
import { ContactDropdown } from "@/components/contact-dropdown"

export function MainNav() {
  const pathname = usePathname()
  const [searchOpen, setSearchOpen] = useState(false)
  const [contactOpen, setContactOpen] = useState(false)

  return (
    <div className="flex items-center gap-6">
      <nav className="hidden md:flex items-center rounded-full bg-electric-blue/[0.05] backdrop-blur-sm px-6 py-2 border border-electric-blue/10">
        <Link
          href="/"
          className={cn(
            "px-3 py-1.5 text-md transition-colors hover:text-logo-blue rounded-full font-heading",
            pathname === "/" ? "bg-white/5 text-foreground" : "text-muted-foreground",
          )}
        >
          Home
        </Link>
        <Link
          href="/news"
          className={cn(
            "px-3 py-1.5 text-md transition-colors hover:text-logo-blue rounded-full font-heading",
            pathname === "/news" ? "bg-white/5 text-foreground" : "text-muted-foreground",
          )}
        >
          News
        </Link>
        <Link
          href="/cars"
          className={cn(
            "px-3 py-1.5 text-md transition-colors hover:text-logo-blue rounded-full font-heading",
            pathname === "/cars" ? "bg-white/5 text-foreground" : "text-muted-foreground",
          )}
        >
          Cars
        </Link>
        <Link
          href="/cost-calculator"
          className={cn(
            "px-3 py-1.5 text-md transition-colors hover:text-logo-blue rounded-full font-heading",
            pathname === "/cost-calculator" ? "bg-white/5 text-foreground" : "text-muted-foreground",
          )}
        >
          Cost Calculator
        </Link>
        <Link
          href="/guides"
          className={cn(
            "px-3 py-1.5 text-md transition-colors hover:text-logo-blue rounded-full font-heading",
            pathname === "/guides" ? "bg-white/5 text-foreground" : "text-muted-foreground",
          )}
        >
          Guides
        </Link>
      </nav>
      <div className="flex items-center gap-2 relative">
        <Button
          variant="ghost"
          size="icon"
          className="text-muted-foreground hover:text-foreground transition-colors"
          onClick={() => setSearchOpen(true)}
        >
          <Search className="h-5 w-5" />
          <span className="sr-only">Search</span>
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className={`transition-colors ${contactOpen ? "text-logo-blue" : "text-muted-foreground hover:text-foreground"}`}
          onClick={() => setContactOpen(!contactOpen)}
        >
          <Phone className="h-5 w-5" />
          <span className="sr-only">Contact</span>
        </Button>

        {/* Search Modal */}
        <SearchModal open={searchOpen} onOpenChange={setSearchOpen} />

        {/* Contact Dropdown */}
        <ContactDropdown open={contactOpen} onOpenChange={setContactOpen} />
      </div>
    </div>
  )
}

