"use client"

import { useState } from "react"
import { notFound } from "next/navigation"
import { newsArticles } from "@/data/news-articles"

export default function NewsArticlePage({ params }: { params: { id: string } }) {
  const [isExpanded, setIsExpanded] = useState(false)
  const articleIndex = Number.parseInt(params.id) - 1
  const article = newsArticles[articleIndex]

  if (!article) {
    notFound()
  }

  return (
    <div className="space-y-8">
      <div
        className="group p-6 rounded-2xl border border-zinc-800/50 hover:border-logo-blue/50 hover:bg-logo-blue/5 transition-all overflow-hidden cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
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
                  backgroundColor: articleIndex % 2 === 0 ? "#2596be" : "#20B2AA",
                }}
              />
              <h3 className="text-xl font-bold text-white group-hover:text-logo-blue transition-colors font-heading">
                {article.title}
              </h3>
              <time className="text-sm text-zinc-500">{article.date}</time>
              <p className="text-sm text-zinc-400">{article.excerpt}</p>
            </article>
          </div>
        </div>
        <div
          className={`mt-4 overflow-hidden transition-all duration-300 ease-in-out ${
            isExpanded ? "max-h-[1000px] opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <p className="text-sm text-zinc-400 whitespace-pre-wrap">{article.content}</p>
        </div>
      </div>
    </div>
  )
}

