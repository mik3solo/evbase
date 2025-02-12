"use client"

import Link from "next/link"
import Image from "next/image"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"

export default function Home() {
  return (
    <div className="space-y-12">
      <section className="text-center space-y-4">
        <h1 className="text-3xl font-bold tracking-tight font-heading text-logo-blue">The Ultimate Hub for EVs</h1>
        <p className="text-lg text-zinc-400 max-w-2xl mx-auto">
          Discover EV Insights, Compare Cars, and Find the Best EV Deals.
        </p>
        <div className="max-w-md mx-auto">
          <div className="relative">
            <Input
              type="search"
              placeholder="Search EV models or articles..."
              className="w-full pl-10 pr-4 py-2 bg-black/20"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-400" size={18} />
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link
          href="/cars"
          className="group p-8 rounded-2xl border border-zinc-800/50 hover:border-logo-blue/50 hover:bg-logo-blue/5 transition-all"
        >
          <div className="space-y-4">
            <div className="space-y-2">
              <Badge variant="secondary" className="bg-zinc-800/50">
                Featured
              </Badge>
              <h2 className="text-xl font-bold text-white font-heading">Explore Cars</h2>
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
            <p className="text-sm text-zinc-400">Explore our comprehensive database of electric vehicles.</p>
          </div>
        </Link>

        <Link
          href="/listings"
          className="group p-8 rounded-2xl border border-zinc-800/50 hover:border-logo-blue/50 hover:bg-logo-blue/5 transition-all"
        >
          <div className="space-y-4">
            <div className="space-y-2">
              <Badge variant="secondary" className="bg-zinc-800/50">
                Market
              </Badge>
              <h2 className="text-xl font-bold text-white font-heading">Current Listings</h2>
            </div>
            <div className="w-16 h-16 relative">
              <Image
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-LvVk1HVJR8fudIDTyHgsuXgrvobmkP.png"
                alt="EV Listings"
                width={64}
                height={64}
                className="object-contain scale-[0.7]"
              />
            </div>
            <p className="text-sm text-zinc-400">Browse and compare available electric vehicles in the market.</p>
          </div>
        </Link>

        <Link
          href="/calculator"
          className="group p-8 rounded-2xl border border-zinc-800/50 hover:border-logo-blue/50 hover:bg-logo-blue/5 transition-all"
        >
          <div className="space-y-4">
            <div className="space-y-2">
              <Badge variant="secondary" className="bg-zinc-800/50">
                Tools
              </Badge>
              <h2 className="text-xl font-bold text-white font-heading">Cost Estimator</h2>
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
            <p className="text-sm text-zinc-400">Estimate the total cost of ownership for electric vehicles.</p>
          </div>
        </Link>
      </div>

      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white font-heading">Latest News</h2>
          <Link href="/news" className="text-logo-blue hover:text-logo-blue/80 text-sm">
            View all news
          </Link>
        </div>
        <div className="space-y-6">
          {[
            {
              title: "New EV Tax Credits Announced",
              date: "2023-06-01",
              excerpt:
                "The government has announced new tax credits for electric vehicle purchases, aiming to boost adoption rates.",
              image:
                "https://images.unsplash.com/photo-1593941707882-a5bba14938c7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80",
            },
            {
              title: "Tesla Unveils Next-Gen Charging Stations",
              date: "2023-05-28",
              excerpt:
                "Tesla's new charging stations promise faster charging times and improved compatibility with non-Tesla vehicles.",
              image:
                "https://images.unsplash.com/photo-1633025094151-6fc996255e28?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1742&q=80",
            },
            {
              title: "Ford Doubles Down on Electric F-150 Production",
              date: "2023-05-25",
              excerpt:
                "In response to high demand, Ford is significantly increasing production of its electric F-150 Lightning.",
              image:
                "https://images.unsplash.com/photo-1612831197310-ff5cf7a211b6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80",
            },
          ].map((article, i) => (
            <Link
              key={i}
              href={`/news/${i + 1}`}
              className="group flex items-center p-6 rounded-2xl border border-zinc-800/50 hover:border-logo-blue/50 hover:bg-logo-blue/5 transition-all overflow-hidden"
            >
              <div className="flex-1 pr-6">
                <article className="space-y-3">
                  <h3 className="text-xl font-bold text-white group-hover:text-logo-blue transition-colors font-heading">
                    {article.title}
                  </h3>
                  <time className="text-sm text-zinc-500">{article.date}</time>
                  <p className="text-sm text-zinc-400">{article.excerpt}</p>
                </article>
              </div>
              <div className="w-1/3 h-48 relative">
                <Image
                  src={article.image || "/placeholder.svg"}
                  alt={article.title}
                  layout="fill"
                  objectFit="cover"
                  className="rounded-lg news-image-fade"
                />
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  )
}

