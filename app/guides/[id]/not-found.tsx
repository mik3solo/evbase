import Link from "next/link"
import { Button } from "@/components/ui/button"
import { BookOpen } from "lucide-react"

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center space-y-6">
      <BookOpen className="h-16 w-16 text-logo-blue opacity-50" />
      <h2 className="text-2xl font-bold text-logo-blue">Guide Not Found</h2>
      <p className="text-zinc-400 max-w-md">
        Sorry, the guide you're looking for doesn't exist or may have been moved.
      </p>
      <Button asChild>
        <Link href="/guides">Browse All Guides</Link>
      </Button>
    </div>
  )
}

