import Link from "next/link"
import { Twitter, Linkedin, Facebook } from "lucide-react"

export function Footer() {
  return (
    <footer className="border-t py-12 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <h3 className="text-base font-semibold mb-2 text-primary">About EVplugged</h3>
            <p className="text-sm text-muted-foreground">
              Your one-stop resource for everything related to electric vehicles.
            </p>
          </div>
          <div>
            <h3 className="text-base font-semibold mb-2 text-primary">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/news" className="text-sm text-muted-foreground hover:text-primary">
                  EV News
                </Link>
              </li>
              <li>
                <Link href="/cars" className="text-sm text-muted-foreground hover:text-primary">
                  EV Cars
                </Link>
              </li>
              <li>
                <Link href="/calculator" className="text-sm text-muted-foreground hover:text-primary">
                  Cost Calculator
                </Link>
              </li>
              <li>
                <Link href="/listings" className="text-sm text-muted-foreground hover:text-primary">
                  EV Listings
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-base font-semibold mb-2 text-primary">Legal</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/terms" className="text-sm text-muted-foreground hover:text-primary">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-sm text-muted-foreground hover:text-primary">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-base font-semibold mb-2 text-primary">Connect</h3>
            <div className="flex space-x-4">
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary"
              >
                <Twitter size={20} />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary"
              >
                <Linkedin size={20} />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary"
              >
                <Facebook size={20} />
              </a>
            </div>
          </div>
        </div>
        <div className="mt-8 text-center text-sm text-muted-foreground">© 2023 EVplugged. All rights reserved.</div>
      </div>
    </footer>
  )
}

