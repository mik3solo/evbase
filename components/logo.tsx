import Image from "next/image"
import Link from "next/link"

export function Logo() {
  return (
    <Link href="/" className="flex items-center space-x-2">
      <div className="relative w-8 h-8">
        <Image
          src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/epluggedlogo-I6jqbSh83gtNVGQiknU2YfmpGBJYVR.png"
          alt="EVplugged Logo"
          fill
          className="object-contain"
          priority
        />
      </div>
      <span className="font-heading font-bold text-xl text-primary">EVplugged</span>
    </Link>
  )
}

