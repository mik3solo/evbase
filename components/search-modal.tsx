"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, X } from "lucide-react"
import { evCars } from "@/data/ev-cars"
import { newsArticles } from "@/data/news-articles"
import Link from "next/link"

interface SearchResult {
  type: "car" | "news"
  title: string
  url: string
}

export function SearchModal({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const [searchTerm, setSearchTerm] = useState("")
  const [results, setResults] = useState<SearchResult[]>([])
  const inputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()

  // Focus input when modal opens
  useEffect(() => {
    if (open && inputRef.current) {
      setTimeout(() => {
        inputRef.current?.focus()
      }, 100)
    }
  }, [open])

  // Search functionality
  useEffect(() => {
    if (searchTerm.length < 2) {
      setResults([])
      return
    }

    const term = searchTerm.toLowerCase()

    // Search cars
    const carResults = evCars
      .filter(
        (car) =>
          car.name.toLowerCase().includes(term) ||
          car.make.toLowerCase().includes(term) ||
          car.model.toLowerCase().includes(term),
      )
      .map((car) => ({
        type: "car" as const,
        title: `${car.make} ${car.model} ${car.year}`,
        url: `/cars?search=${encodeURIComponent(car.name)}`,
      }))

    // Search news
    const newsResults = newsArticles
      .filter(
        (article) =>
          article.title.toLowerCase().includes(term) ||
          (article.content && article.content.toLowerCase().includes(term)),
      )
      .map((article, index) => ({
        type: "news" as const,
        title: article.title,
        url: `/news?article=${index}`,
      }))

    setResults([...carResults, ...newsResults].slice(0, 8))
  }, [searchTerm])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      onOpenChange(false)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (results.length > 0) {
      router.push(results[0].url)
      onOpenChange(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-background border-zinc-800">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-logo-blue">Search EVplugged</h2>
            <Button variant="ghost" size="icon" onClick={() => onOpenChange(false)}>
              <X className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </Button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-500" size={16} />
              <Input
                ref={inputRef}
                type="text"
                placeholder="Search for cars, news, and more..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={handleKeyDown}
                className="pl-10 pr-4 py-2 bg-background/50 border-zinc-800/50 text-sm text-white placeholder-zinc-500 focus:border-logo-blue/50 focus:ring-1 focus:ring-logo-blue/50 rounded-2xl"
              />
            </div>
          </form>

          {results.length > 0 && (
            <div className="mt-4 space-y-2">
              <h3 className="text-sm font-medium text-zinc-400">Results</h3>
              <ul className="space-y-1">
                {results.map((result, i) => (
                  <li key={i}>
                    <Link
                      href={result.url}
                      className="flex items-center p-2 rounded-lg hover:bg-logo-blue/10 transition-colors"
                      onClick={() => onOpenChange(false)}
                    >
                      <span
                        className={`mr-2 text-xs px-2 py-1 rounded ${
                          result.type === "car" ? "bg-blue-900/30 text-blue-400" : "bg-green-900/30 text-green-400"
                        }`}
                      >
                        {result.type === "car" ? "Car" : "News"}
                      </span>
                      <span className="text-sm text-white">{result.title}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {searchTerm.length >= 2 && results.length === 0 && (
            <div className="text-center py-4">
              <p className="text-zinc-400">No results found for "{searchTerm}"</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}

