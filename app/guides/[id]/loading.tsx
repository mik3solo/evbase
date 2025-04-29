export default function Loading() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="h-8 w-32 bg-zinc-800 rounded-md"></div>

      <div className="h-64 w-full bg-zinc-800 rounded-xl"></div>

      <div className="space-y-4">
        <div className="h-1 w-full bg-zinc-800"></div>
        <div className="h-10 w-3/4 bg-zinc-800 rounded-md"></div>
        <div className="h-4 w-32 bg-zinc-800 rounded-md"></div>
        <div className="h-6 w-full bg-zinc-800 rounded-md"></div>
      </div>

      <div className="space-y-4">
        <div className="h-4 w-full bg-zinc-800 rounded-md"></div>
        <div className="h-4 w-full bg-zinc-800 rounded-md"></div>
        <div className="h-4 w-3/4 bg-zinc-800 rounded-md"></div>
        <div className="h-4 w-full bg-zinc-800 rounded-md"></div>
        <div className="h-4 w-5/6 bg-zinc-800 rounded-md"></div>
      </div>
    </div>
  )
}

