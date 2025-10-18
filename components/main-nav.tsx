"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Search, Phone, Menu, X } from "lucide-react"
import { SearchModal } from "@/components/search-modal"
import { ContactDropdown } from "@/components/contact-dropdown"

export function MainNav() {
  const pathname = usePathname()
  const [searchOpen, setSearchOpen] = useState(false)
  const [contactOpen, setContactOpen] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <div className="flex items-center gap-6">
      {/* Desktop Navigation */}
      <nav className="hidden md:flex items-center rounded-full bg-electric-blue/[0.05] backdrop-blur-sm px-6 py-2 border border-electric-blue/10">
        <Link
          href="/"
          className={cn(
            "px-3 py-1.5 text-md transition-colors hover:text-electric-blue rounded-full font-heading",
            pathname === "/" ? "bg-electric-blue/10 text-foreground" : "text-muted-foreground",
          )}
        >
          Home
        </Link>
        <Link
          href="/news"
          className={cn(
            "px-3 py-1.5 text-md transition-colors hover:text-electric-blue rounded-full font-heading",
            pathname === "/news" ? "bg-electric-blue/10 text-foreground" : "text-muted-foreground",
          )}
        >
          News
        </Link>
        <Link
          href="/cars"
          className={cn(
            "px-3 py-1.5 text-md transition-colors hover:text-electric-blue rounded-full font-heading",
            pathname === "/cars" ? "bg-electric-blue/10 text-foreground" : "text-muted-foreground",
          )}
        >
          Cars
        </Link>
        <Link
          href="/cost-calculator"
          className={cn(
            "px-3 py-1.5 text-md transition-colors hover:text-electric-blue rounded-full font-heading",
            pathname === "/cost-calculator" ? "bg-electric-blue/10 text-foreground" : "text-muted-foreground",
          )}
        >
          Cost Calculator
        </Link>
        <Link
          href="/guides"
          className={cn(
            "px-3 py-1.5 text-md transition-colors hover:text-electric-blue rounded-full font-heading",
            pathname === "/guides" ? "bg-electric-blue/10 text-foreground" : "text-muted-foreground",
          )}
        >
          Guides
        </Link>
      </nav>

      {/* Mobile Navigation */}
      <div className="flex md:hidden items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          className="text-muted-foreground hover:text-electric-blue transition-colors"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          <span className="sr-only">Toggle menu</span>
        </Button>
      </div>

      {/* Desktop Action Buttons */}
      <div className="hidden md:flex items-center gap-2 relative">
        <Button
          variant="ghost"
          size="icon"
          className="text-muted-foreground hover:text-electric-blue transition-colors"
          onClick={() => setSearchOpen(true)}
        >
          <Search className="h-5 w-5" />
          <span className="sr-only">Search</span>
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className={`transition-colors ${contactOpen ? "text-electric-blue" : "text-muted-foreground hover:text-electric-blue"}`}
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

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="fixed inset-0 bg-black/20 backdrop-blur-sm" onClick={() => setMobileMenuOpen(false)} />
          <div className="fixed top-0 right-0 h-full w-64 bg-background border-l shadow-lg">
            <div className="flex items-center justify-between p-4 border-b">
              <span className="font-heading font-semibold">Menu</span>
              <Button variant="ghost" size="icon" onClick={() => setMobileMenuOpen(false)}>
                <X className="h-5 w-5" />
              </Button>
            </div>
            <nav className="flex flex-col p-4 space-y-2">
              <Link
                href="/"
                className={cn(
                  "px-3 py-2 text-md transition-colors hover:text-electric-blue rounded-md font-heading",
                  pathname === "/" ? "bg-electric-blue/10 text-foreground" : "text-muted-foreground",
                )}
                onClick={() => setMobileMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                href="/news"
                className={cn(
                  "px-3 py-2 text-md transition-colors hover:text-electric-blue rounded-md font-heading",
                  pathname === "/news" ? "bg-electric-blue/10 text-foreground" : "text-muted-foreground",
                )}
                onClick={() => setMobileMenuOpen(false)}
              >
                News
              </Link>
              <Link
                href="/cars"
                className={cn(
                  "px-3 py-2 text-md transition-colors hover:text-electric-blue rounded-md font-heading",
                  pathname === "/cars" ? "bg-electric-blue/10 text-foreground" : "text-muted-foreground",
                )}
                onClick={() => setMobileMenuOpen(false)}
              >
                Cars
              </Link>
              <Link
                href="/cost-calculator"
                className={cn(
                  "px-3 py-2 text-md transition-colors hover:text-electric-blue rounded-md font-heading",
                  pathname === "/cost-calculator" ? "bg-electric-blue/10 text-foreground" : "text-muted-foreground",
                )}
                onClick={() => setMobileMenuOpen(false)}
              >
                Cost Calculator
              </Link>
              <Link
                href="/guides"
                className={cn(
                  "px-3 py-2 text-md transition-colors hover:text-electric-blue rounded-md font-heading",
                  pathname === "/guides" ? "bg-electric-blue/10 text-foreground" : "text-muted-foreground",
                )}
                onClick={() => setMobileMenuOpen(false)}
              >
                Guides
              </Link>
              <div className="border-t pt-4 mt-4 space-y-2">
                <Button
                  variant="ghost"
                  className="w-full justify-start text-muted-foreground hover:text-electric-blue"
                  onClick={() => {
                    setSearchOpen(true)
                    setMobileMenuOpen(false)
                  }}
                >
                  <Search className="h-4 w-4 mr-2" />
                  Search
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start text-muted-foreground hover:text-electric-blue"
                  onClick={() => {
                    setContactOpen(true)
                    setMobileMenuOpen(false)
                  }}
                >
                  <Phone className="h-4 w-4 mr-2" />
                  Contact
                </Button>
              </div>
            </nav>
          </div>
        </div>
      )}

      {/* Mobile Search Modal */}
      <SearchModal open={searchOpen} onOpenChange={setSearchOpen} />

      {/* Mobile Contact Dropdown */}
      <ContactDropdown open={contactOpen} onOpenChange={setContactOpen} />
    </div>
  )
}
