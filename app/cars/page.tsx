"use client"

import { useState } from "react"
import { EVCard } from "@/components/ev-card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { evCars } from "@/data/ev-cars"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function CarsPage() {
  const [search, setSearch] = useState("")
  const [makeFilter, setMakeFilter] = useState("all")
  const [sortBy, setSortBy] = useState("name")

  const makes = Array.from(new Set(evCars.map((car) => car.make)))

  const filteredCars = evCars
    .filter(
      (car) =>
        car.name.toLowerCase().includes(search.toLowerCase()) && (makeFilter === "all" || car.make === makeFilter),
    )
    .sort((a, b) => {
      switch (sortBy) {
        case "price-asc":
          return a.msrp - b.msrp
        case "price-desc":
          return b.msrp - a.msrp
        case "range":
          return b.range - a.range
        default:
          return a.name.localeCompare(b.name)
      }
    })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold mb-4 text-logo-blue">Browse EVs...</h1>
        <p className="text-muted-foreground">
          Check out available electric vehicles in the market.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <div>
          <Label htmlFor="search">Search</Label>
          <Input id="search" placeholder="Search EVs..." value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <div>
          <Label htmlFor="make">Make</Label>
          <Select value={makeFilter} onValueChange={setMakeFilter}>
            <SelectTrigger id="make">
              <SelectValue placeholder="Select make" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Makes</SelectItem>
              {makes.map((make) => (
                <SelectItem key={make} value={make}>
                  {make}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="sort">Sort By</Label>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger id="sort">
              <SelectValue placeholder="Sort by..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="name">Name</SelectItem>
              <SelectItem value="price-asc">Price: Low to High</SelectItem>
              <SelectItem value="price-desc">Price: High to Low</SelectItem>
              <SelectItem value="range">Range</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredCars.map((car) => (
          <EVCard key={car.id} car={car} />
        ))}
      </div>
    </div>
  )
}

