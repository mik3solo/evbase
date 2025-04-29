import Link from "next/link"

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <h2 className="text-2xl font-bold text-logo-blue mb-4">Article Not Found</h2>
      <p className="text-zinc-400 mb-6">Sorry, the article you're looking for doesn't exist.</p>
      <Link
        href="/news"
        className="text-logo-blue hover:text-logo-blue/80 transition-colors underline underline-offset-4"
      >
        Back to News
      </Link>
    </div>
  )
}

