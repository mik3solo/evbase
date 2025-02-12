import "./globals.css"
import { Inter, Poppins } from "next/font/google"
import { MainNav } from "@/components/main-nav"
import { Logo } from "@/components/logo"
import { Footer } from "@/components/footer"
import type React from "react"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
})

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["500", "700"],
  variable: "--font-poppins",
})

export const metadata = {
  title: "EVplugged - Your EV Resource",
  description: "Find the latest electric vehicle insights, news, and listings—all in one place.",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${inter.variable} ${poppins.variable} dark`}>
      <body className="font-sans min-h-screen bg-[#0A0A0B]">
        <div className="relative min-h-screen">
          <div
            className="absolute inset-0 bg-gradient-to-b from-blue-500/5 to-transparent pointer-events-none"
            style={{ clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)" }}
          />
          <div className="relative">
            <header className="px-8 py-4">
              <div className="max-w-5xl mx-auto flex items-center justify-between">
                <Logo />
                <MainNav />
              </div>
            </header>
            <main className="px-8 py-8">
              <div className="max-w-5xl mx-auto">
                <div className="rounded-3xl bg-gradient-to-b from-blue-900/10 via-black/20 to-blue-900/10 backdrop-blur-sm p-8">
                  {children}
                </div>
              </div>
            </main>
            <Footer />
          </div>
        </div>
      </body>
    </html>
  )
}



import './globals.css'