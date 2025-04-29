"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Search, ChevronDown, ChevronUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { createClient } from "@supabase/supabase-js"

// Initialize Supabase Client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default function NewsPage() {
  const [newsArticles, setNewsArticles] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [expandedArticle, setExpandedArticle] = useState<number | null>(null)

  const searchParams = useSearchParams()

  useEffect(() => {
    async function fetchNews() {
      try {
        const { data, error } = await supabase
          .from("news_articles")
          .select("id, title, date, excerpt, image, source, sourceUrl") // Ensure sourceUrl is included
          .order("date", { ascending: false });
  
        if (error) throw error;
  
        console.log("📰 Fetched articles:", data); // Debugging line
        setNewsArticles(data);
      } catch (err) {
        setError("Failed to fetch news. Please try again later.");
        console.error("❌ Error fetching news:", err);
      } finally {
        setLoading(false);
      }
    }
  
    fetchNews();
  }, []);

  useEffect(() => {
    const articleIndex = searchParams.get("article")
    if (articleIndex) {
      setExpandedArticle(Number.parseInt(articleIndex))
      window.history.replaceState({}, "", "/news") // Clear URL parameter
    }
  }, [searchParams])

  // **Filter articles based on search input**
  const filteredArticles = newsArticles.filter(
    (article) =>
      article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      article.excerpt.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const toggleArticle = (id: number) => {
    setExpandedArticle(expandedArticle === id ? null : id)
  }

  // After newsArticles are set, scroll to hash if present
  useEffect(() => {
    if (!loading && newsArticles.length) {
      const hash = window.location.hash
      if (hash) {
        const el = document.querySelector(hash)
        if (el) {
          el.scrollIntoView({ behavior: "smooth", block: "start" })
          // remove hash from URL so re-renders don’t keep scrolling
          window.history.replaceState(null, "", window.location.pathname)
        }
      }
    }
  }, [loading, newsArticles])

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <h1 className="text-2xl font-bold text-logo-blue">Stay in the Know...</h1>
        <div className="relative w-full">
          <Input
            type="text"
            placeholder="Search news..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 bg-background/50 border-zinc-800/50 text-sm text-white placeholder-zinc-500 focus:border-logo-blue/50 focus:ring-1 focus:ring-logo-blue/50 rounded-2xl"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-500" size={16} />
        </div>
      </div>

      {loading ? (
        <p className="text-center text-zinc-400">Loading news articles...</p>
      ) : error ? (
        <p className="text-center text-red-500">{error}</p>
      ) : (
        <div className="space-y-6">
          {filteredArticles.length === 0 ? (
            <p className="text-center text-zinc-400">No articles found.</p>
          ) : (
            filteredArticles.map((article) => (
              <div
                key={article.id}
                id={`article-${article.id}`}
                className="group p-6 rounded-2xl border border-zinc-800/50 transition-all overflow-hidden"
              >
                <div className="flex flex-col md:flex-row items-center">
                  <div className="w-full md:w-1/2 h-48 md:h-64 relative mb-4 md:mb-0">
                    <img
                      src={article.image || "/placeholder.svg"}
                      alt={article.title}
                      className="w-full h-full object-cover rounded-lg"
                    />
                  </div>
                  <div className="w-full md:w-1/2 md:pl-6">
                    <article className="space-y-3">
                      <div
                        className="h-1 w-full mb-2"
                        style={{
                          backgroundColor: article.id % 2 === 0 ? "#2596be" : "#2596be",
                        }}
                      />
                      <h3 className="text-xl font-bold text-white transition-colors font-heading">
                        {article.title}
                      </h3>
                      <div className="flex items-center space-x-2 text-sm">
                        <time className="text-zinc-500">{article.date}</time>
                        <span className="text-zinc-400 italic">{article.source}</span>
                      </div>
                      <p className="text-md text-zinc-400">{article.excerpt}</p>
                      <p className="text-sm text-zinc-400 whitespace-pre-wrap mt-2">
                          <a
                            className="text-logo-blue hover:text-logo-blue/80"
                            href={article.sourceUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            Read full article
                          </a>
                        </p>
                    </article>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  )
}