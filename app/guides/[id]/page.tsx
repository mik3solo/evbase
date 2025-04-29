import { createClient } from "@supabase/supabase-js"
import { notFound } from "next/navigation"
import Link from "next/link"
import { ChevronLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"

// Force dynamic rendering, no caching.
export const dynamic = "force-dynamic";
export const revalidate = 0;

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default async function GuidePage({ params }: { params: { id: string } }) {
  const { data: guide, error } = await supabase
    .from("ev_guides")
    .select("id, created_at, title, date, category, excerpt, image, content")
    .eq("id", params.id)
    .single()

  if (error || !guide) {
    notFound()
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/guides" className="flex items-center gap-1 text-logo-blue">
            <ChevronLeft className="h-4 w-4" />
            Back to Guides
          </Link>
        </Button>
      </div>

      <div className="space-y-6">
        <div className="relative h-64 md:h-80 w-full overflow-hidden rounded-xl">
          <img
            src={guide.image}
            alt={guide.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute top-4 right-4 bg-logo-blue/90 text-white text-sm px-3 py-1 rounded-full">
            {guide.category}
          </div>
        </div>

        <div className="space-y-4">
          <div
            className="h-1 w-full"
            style={{ backgroundColor: "#77b2de" }}
          />

          <h1 className="text-3xl font-bold text-logo-blue font-heading">{guide.title}</h1>

          <div className="flex items-center text-sm text-zinc-500">
            <time>{new Date(guide.date).toLocaleDateString()}</time>
          </div>

        </div>

        <div className="prose prose-invert prose-blue max-w-none">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {guide.content}
          </ReactMarkdown>
        </div>
      </div>
    </div>
  )
}