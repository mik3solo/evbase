"use client"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Search, BookOpen } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default function GuidesPage() {
  const [guides, setGuides] = useState<any[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchGuides = async () => {
      try {
        const { data, error } = await supabase
          .from("ev_guides")
          .select("*")
          .order("date", { ascending: false })

        if (error) throw error

        setGuides(data)
      } catch (err) {
        console.error("❌ Error fetching guides:", err)
        setError("Failed to load EV guides. Please try again later.")
      } finally {
        setLoading(false)
      }
    }

    fetchGuides()
  }, [])

  const filteredGuides = guides.filter(
    (guide) =>
      guide.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      guide.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
      guide.category.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <h1 className="text-2xl font-bold text-logo-blue">Curated for you...</h1>
        <p className="text-muted-foreground">
          Comprehensive EV resources
        </p>
        <div className="relative w-full">
          <Input
            type="text"
            placeholder="Search guides..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 bg-background/50 border-zinc-800/50 text-sm text-white placeholder-zinc-500 focus:border-logo-blue/50 focus:ring-1 focus:ring-logo-blue/50 rounded-2xl"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-500" size={16} />
        </div>
      </div>

      {loading ? (
        <p className="text-center text-zinc-400">Loading guides...</p>
      ) : error ? (
        <p className="text-center text-red-500">{error}</p>
      ) : filteredGuides.length === 0 ? (
        <div className="text-center py-12">
          <BookOpen className="h-12 w-12 mx-auto text-muted-foreground opacity-20 mb-4" />
          <p className="text-zinc-400">No guides found matching your search criteria.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredGuides.map((guide) => (
            <Card
              key={guide.id}
              className="overflow-hidden bg-background/80 backdrop-blur-md border-zinc-800/50 hover:border-logo-blue/50 hover:bg-logo-blue/5 transition-all"
            >
              <Link href={`/guides/${guide.id}`} className="block">
                <div className="relative h-48">
                  <img
                    src={guide.image || "/placeholder.svg"}
                    alt={guide.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 right-2 bg-logo-blue/90 text-white text-xs px-2 py-1 rounded-full">
                    {guide.category}
                  </div>
                </div>

                <CardContent className="p-5">
                  <div
                    className="h-1 w-full mb-3"
                    style={{ backgroundColor: "#77b2de" }}
                  />

                  <h3 className="text-xl font-bold text-white hover:text-logo-blue transition-colors font-heading mb-2">
                    {guide.title}
                  </h3>

                  <time className="text-sm text-zinc-500 block mb-3">{guide.date}</time>

                  <p className="text-sm text-zinc-400 mb-4">{guide.excerpt}</p>

                  <div className="flex justify-end">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-logo-blue hover:text-logo-blue/80 hover:bg-logo-blue/10"
                    >
                      Read Full Guide
                    </Button>
                  </div>
                </CardContent>
              </Link>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}