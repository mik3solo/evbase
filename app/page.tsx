"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { createClient } from "@supabase/supabase-js"
import { ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"

// If you already have a category → color map, keep it; otherwise define one:
const categoryColors: Record<string, string> = {
  Buying: "#77b2de",
  Charging: "#20B2AA",
  Maintenance: "#FFB347",
  Seasonal: "#F7766B",
  Travel: "#A29BFE",
  // ...etc
}

// Initialize Supabase Client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default function Home() {
  // News state
  const [newsArticles, setNewsArticles] = useState<any[]>([])
  const [loadingNews, setLoadingNews] = useState(true)
  const [newsError, setNewsError] = useState<string | null>(null)

  // Guides state
  const [evGuidesList, setEvGuidesList] = useState<any[]>([])
  const [loadingGuides, setLoadingGuides] = useState(true)
  const [guidesError, setGuidesError] = useState<string | null>(null)

  // Fetch latest 6 news
  useEffect(() => {
    async function fetchNews() {
      try {
        const { data, error } = await supabase
          .from("news_articles")
          .select("*")
          .order("date", { ascending: false })
          .limit(6)

        if (error) throw error
        setNewsArticles(data)
      } catch (err) {
        console.error("Error fetching news:", err)
        setNewsError("Failed to load news articles.")
      } finally {
        setLoadingNews(false)
      }
    }
    fetchNews()
  }, [])

  // Fetch latest 4 guides
  useEffect(() => {
    async function fetchGuides() {
      try {
        const { data, error } = await supabase
          .from("ev_guides")
          .select("id, title, date, category, excerpt, image")
          .order("date", { ascending: false })
          .limit(4)

        if (error) throw error
        setEvGuidesList(data)
      } catch (err) {
        console.error("Error fetching guides:", err)
        setGuidesError("Failed to load EV guides.")
      } finally {
        setLoadingGuides(false)
      }
    }
    fetchGuides()
  }, [])

  return (
    <div className="space-y-12">
      <section className="text-center space-y-4">
        <h1 className="text-3xl font-bold tracking-tight font-heading text-logo-blue gradient-text">The Ultimate Hub for EVs</h1>
        <p className="text-lg text-zinc-400 max-w-2xl mx-auto">
          Discover EV Insights, Browse Vehicles, and Estimate Savings.
        </p>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link
          href="/cars"
          className="group p-8 rounded-2xl border border-zinc-800/50 hover:border-logo-blue/50 hover:bg-electric-blue/5 transition-all card-hover-effect"
        >
          <div className="space-y-4">
            <div className="space-y-2">
              <Badge variant="secondary" className="bg-zinc-800/50">
                Featured
              </Badge>
              <h2 className="text-2xl font-bold text-white font-heading">Explore Cars</h2>
            </div>
            <div className="w-16 h-16 relative">
              <Image
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-J1thbXHD9YxgBYx355dMPNwlvknoLn.png"
                alt="EV Cars"
                width={64}
                height={64}
                className="object-contain"
              />
            </div>
            <p className="text-md text-zinc-400">Explore our electric vehicles database.</p>
          </div>
        </Link>

        <Link
          href="/guides"
          className="group p-8 rounded-2xl border border-zinc-800/50 hover:border-logo-blue/50 hover:bg-electric-blue/5 transition-all card-hover-effect"
        >
          <div className="space-y-4">
            <div className="space-y-2">
              <Badge variant="secondary" className="bg-zinc-800/50">
                Resources
              </Badge>
              <h2 className="text-2xl font-bold text-white font-heading">EV Guides</h2>
            </div>
            <div className="w-16 h-16 relative">
              <Image
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-LvVk1HVJR8fudIDTyHgsuXgrvobmkP.png"
                alt="EV Guides"
                width={64}
                height={64}
                className="object-contain scale-[0.7]"
              />
            </div>
            <p className="text-md text-zinc-400">Comprehensive EV guides for your needs.</p>
          </div>
        </Link>

        <Link
          href="/cost-calculator"
          className="group p-8 rounded-2xl border border-zinc-800/50 hover:border-logo-blue/50 hover:bg-electric-blue/5 transition-all card-hover-effect"
        >
          <div className="space-y-4">
            <div className="space-y-2">
              <Badge variant="secondary" className="bg-zinc-800/50">
                Tools
              </Badge>
              <h2 className="text-2xl font-bold text-white font-heading">Cost Calculator</h2>
            </div>
            <div className="w-16 h-16 relative">
              <Image
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-8UHN8dkfZdL9lAmQGCCQPKz2KZqQu5.png"
                alt="Cost Calculator"
                width={64}
                height={64}
                className="object-contain scale-[0.6]"
              />
            </div>
            <p className="text-md text-zinc-400">Estimate the cost of EV ownership.</p>
          </div>
        </Link>
      </div>

      {/* News & Guides split */}
      <div className="grid grid-cols-1 gap-8">
        {/* News Section */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white font-heading">Latest News</h2>
            <Link href="/news" className="text-logo-blue hover:text-logo-blue/80 text-md">
              View all news
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {loadingNews ? (
              <p className="text-zinc-400">Loading news...</p>
            ) : newsError ? (
              <p className="text-red-500">{newsError}</p>
            ) : (
              newsArticles.map((article, i) => (
                <div
                  key={i}
                  className="group flex flex-col items-center p-6 rounded-2xl border border-zinc-800/50 transition-all overflow-hidden"
                >
                  <Link href={`/news#article-${article.id}`} className="w-full h-48 mb-4 block">
                    <img
                      src={article.image || "/placeholder.svg"}
                      alt={article.title}
                      className="w-full h-full object-cover rounded-lg"
                    />
                  </Link>
              
                  <div className="w-full">
                    <article className="space-y-3">
                      <div
                        className="h-1 w-full mb-2"
                        style={{ backgroundColor: i % 2 === 0 ? "#77b2de" : "#FCC737" }}
                      />
                      <Link href={`/news#article-${article.id}`} className="block">
                        <h3 className="text-xl font-bold text-white group-hover:text-logo-blue transition-colors font-heading">
                          {article.title}
                        </h3>
                      </Link>
                      <time className="text-sm text-zinc-500">{article.date}</time>
                      <div className="pt-2">
                        <Link href={`/news#article-${article.id}`}>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-logo-blue hover:text-logo-blue/80 hover:bg-logo-blue/10 flex items-center gap-1 px-0"
                          >
                            Read More <ChevronRight className="h-4 w-4" />
                          </Button>
                        </Link>
                      </div>
                    </article>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>

        {/* Guides Section */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white font-heading">Guides</h2>
            <Link href="/guides" className="text-electric-blue hover:text-logo-blue/80 text-sm font-medium">
              View all guides
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {loadingGuides ? (
              <p className="text-zinc-400">Loading guides...</p>
            ) : guidesError ? (
              <p className="text-red-500">{guidesError}</p>
            ) : (
              evGuidesList.map((guide, i) => {
                const categoryColor = categoryColors[guide.category] || "#2596be"
                return (
                  <div
                    key={guide.id}
                    className="group flex flex-col items-center p-6 rounded-2xl border border-zinc-800/50 transition-all overflow-hidden"
                  >
                    
                    <Link href={`/guides/${guide.id}`} className="w-full h-48 mb-4 block">
                      <img
                        src={guide.image || "/placeholder.svg"}
                        alt={guide.title}
                        className="w-full h-full object-cover rounded-lg"
                      />
                    </Link>
            
                    <div className="w-full">
                      <article className="space-y-3">
                        <div
                          className="h-1 w-full mb-2"
                          style={{ backgroundColor: categoryColor }}
                        />
                        <Link href={`/guides/${guide.id}`} className="block">
                          <h3 className="text-xl font-bold text-white group-hover:text-logo-blue transition-colors font-heading">
                            {guide.title}
                          </h3>
                        </Link>
                        <time className="text-sm text-zinc-500">{guide.date}</time>
                        <div className="pt-1">
                          <Link href={`/guides/${guide.id}`}>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-logo-blue hover:text-logo-blue/80 hover:bg-logo-blue/10 flex items-center gap-1 px-0"
                            >
                              Read Guide <ChevronRight className="h-3 w-3" />
                            </Button>
                          </Link>
                        </div>
                      </article>
                    </div>
                    
                  </div>
                )
              })
            )}
          </div>
        </section>
      </div>
    </div>
  )
}