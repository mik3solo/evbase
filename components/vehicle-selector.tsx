"use client"

import { useState, useEffect } from "react"
import { Check, ChevronsUpDown, Car, AlertCircle, Info } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"
import * as FuelEconomyAPI from "@/services/fueleconomy-api"

interface VehicleSelectorProps {
  vehicleType: "ev" | "gas"
  onVehicleSelect: (vehicleId: number | null) => void
  className?: string
}

export function VehicleSelector({ vehicleType, onVehicleSelect, className }: VehicleSelectorProps) {
  // State for the selection process
  const [years, setYears] = useState<number[]>([])
  const [selectedYear, setSelectedYear] = useState<number | null>(null)
  const [makes, setMakes] = useState<string[]>([])
  const [selectedMake, setSelectedMake] = useState<string | null>(null)
  const [models, setModels] = useState<string[]>([])
  const [selectedModel, setSelectedModel] = useState<string | null>(null)
  const [options, setOptions] = useState<FuelEconomyAPI.VehicleOption[]>([])

  // State for the combobox
  const [open, setOpen] = useState(false)
  const [selectedVehicle, setSelectedVehicle] = useState<FuelEconomyAPI.VehicleOption | null>(null)

  // Loading states
  const [loadingYears, setLoadingYears] = useState(true)
  const [loadingMakes, setLoadingMakes] = useState(false)
  const [loadingModels, setLoadingModels] = useState(false)
  const [loadingOptions, setLoadingOptions] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Add a state for tracking if we're using fallback data
  const [usingFallbackData, setUsingFallbackData] = useState(false)

  // Fetch years on component mount
  useEffect(() => {
    const fetchYears = async () => {
      setLoadingYears(true)
      setError(null)
      try {
        const yearsData = await FuelEconomyAPI.getYears()
        // Check if we're likely using fallback data (exact match with fallback years)
        if (yearsData.length === 7 && yearsData[0] === 2024 && yearsData[6] === 2018) {
          setUsingFallbackData(true)
        }

        // Sort years in descending order (newest first)
        setYears(yearsData.sort((a, b) => b - a))
        // Default to the most recent year
        if (yearsData.length > 0) {
          setSelectedYear(yearsData[0])
        }
      } catch (err) {
        setError("Failed to load years. Please try again.")
        console.error(err)
      } finally {
        setLoadingYears(false)
      }
    }

    fetchYears()
  }, [])

  // Fetch makes when year changes
  useEffect(() => {
    if (!selectedYear) return

    const fetchMakes = async () => {
      setLoadingMakes(true)
      setError(null)
      setSelectedMake(null)
      setMakes([])
      setModels([])
      setOptions([])
      setSelectedVehicle(null)

      try {
        const makesData = await FuelEconomyAPI.getMakes(selectedYear)
        setMakes(makesData.sort())
      } catch (err) {
        setError("Failed to load makes. Please try again.")
        console.error(err)
      } finally {
        setLoadingMakes(false)
      }
    }

    fetchMakes()
  }, [selectedYear])

  // Fetch models when make changes
  useEffect(() => {
    if (!selectedYear || !selectedMake) return

    const fetchModels = async () => {
      setLoadingModels(true)
      setError(null)
      setSelectedModel(null)
      setModels([])
      setOptions([])
      setSelectedVehicle(null)

      try {
        const modelsData = await FuelEconomyAPI.getModels(selectedYear, selectedMake)
        setModels(modelsData.sort())
      } catch (err) {
        setError("Failed to load models. Please try again.")
        console.error(err)
      } finally {
        setLoadingModels(false)
      }
    }

    fetchModels()
  }, [selectedYear, selectedMake])

  // Fetch options when model changes
  useEffect(() => {
    if (!selectedYear || !selectedMake || !selectedModel) return

    const fetchOptions = async () => {
      setLoadingOptions(true)
      setError(null)
      setOptions([])
      setSelectedVehicle(null)

      try {
        const optionsData = await FuelEconomyAPI.getOptions(selectedYear, selectedMake, selectedModel)
        setOptions(optionsData)

        console.log("⚙️ fetched optionsData:", optionsData)
        console.log("⚙️ after setOptions, options state (should match above):", optionsData)

        // If there's only one option, select it automatically
        if (optionsData.length === 1) {
          handleVehicleSelect(optionsData[0])
        }
      } catch (err) {
        setError("Failed to load vehicle options. Please try again.")
        console.error(err)
      } finally {
        setLoadingOptions(false)
      }
    }

    fetchOptions()
  }, [selectedYear, selectedMake, selectedModel])

  // Handle vehicle selection
  const handleVehicleSelect = async (vehicle: FuelEconomyAPI.VehicleOption | null) => {
    setSelectedVehicle(vehicle)
    setOpen(false)

    if (vehicle) {
      // Fetch full vehicle details to determine if it's the right type (EV or gas)
      try {
        const details = await FuelEconomyAPI.getVehicleDetails(vehicle.id)
        
        if (details) {
          const isEV = FuelEconomyAPI.isElectricVehicle(details)

          // Check if the selected vehicle matches the expected type
          if ((vehicleType === "ev" && isEV) || (vehicleType === "gas" && !isEV)) {
            onVehicleSelect(vehicle.id)
          } else {
            setError(
              `This is ${isEV ? "an electric" : "a gas"} vehicle. Please select ${vehicleType === "ev" ? "an electric" : "a gas"} vehicle.`,
            )
            setSelectedVehicle(null)
            onVehicleSelect(null)
          }
        } else {
          setError("Failed to load vehicle details. Please try again.")
          onVehicleSelect(null)
        }
      } catch (err) {
        setError("Failed to verify vehicle type. Please try again.")
        console.error(err)
        onVehicleSelect(null)
      }
    } else {
      onVehicleSelect(null)
    }
  }

  return (
    <div className={cn("space-y-4", className)}>
      <div className="flex flex-col gap-4">
        {/* Year Selector */}
        <div>
          <Label htmlFor="year-select">Year</Label>
          {loadingYears ? (
            <Skeleton className="h-10 w-full" />
          ) : (
            <Select value={selectedYear?.toString() || ""} onValueChange={(value) => setSelectedYear(Number(value))}>
              <SelectTrigger id="year-select">
                <SelectValue placeholder="Select Year" />
              </SelectTrigger>
              <SelectContent>
                {years.map((year) => (
                  <SelectItem key={year} value={year.toString()}>
                    {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>

        {/* Make Selector */}
        <div>
          <Label htmlFor="make-select">Make</Label>
          {loadingMakes ? (
            <Skeleton className="h-10 w-full" />
          ) : (
            <Select
              value={selectedMake || ""}
              onValueChange={setSelectedMake}
              disabled={!selectedYear || makes.length === 0}
            >
              <SelectTrigger id="make-select">
                <SelectValue placeholder="Select Make" />
              </SelectTrigger>
              <SelectContent>
                {makes.map((make) => (
                  <SelectItem key={make} value={make}>
                    {make}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>

        {/* Model Selector */}
        <div>
          <Label htmlFor="model-select">Model</Label>
          {loadingModels ? (
            <Skeleton className="h-10 w-full" />
          ) : (
            <Select
              value={selectedModel || ""}
              onValueChange={setSelectedModel}
              disabled={!selectedMake || models.length === 0}
            >
              <SelectTrigger id="model-select">
                <SelectValue placeholder="Select Model" />
              </SelectTrigger>
              <SelectContent>
                {models.map((model) => (
                  <SelectItem key={model} value={model}>
                    {model}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>
      </div>

      {/* Vehicle Options Combobox */}
      {selectedModel && (
        <div>
          <Label htmlFor="vehicle-select">Vehicle Options</Label>
          {loadingOptions ? (
            <Skeleton className="h-10 w-full" />
          ) : (
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={open}
                  className="w-full justify-between"
                  disabled={options.length === 0}
                >
                  {selectedVehicle ? (
                    <span className="flex items-center">
                      <Car className="mr-2 h-4 w-4" />
                      {selectedVehicle.year} {selectedVehicle.make} {selectedVehicle.model}
                    </span>
                  ) : (
                    "Select vehicle options..."
                  )}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-full p-0">
                <Command>
                  <CommandInput placeholder="Search vehicle options..." />
                  <CommandEmpty>No vehicle options found.</CommandEmpty>
                  <CommandList>
                    <CommandGroup>
                      {options.map((vehicle) => (
                        <CommandItem
                          key={vehicle.id}
                          value={vehicle.id.toString()}
                          onSelect={() => handleVehicleSelect(vehicle)}
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              selectedVehicle?.id === vehicle.id ? "opacity-100" : "opacity-0",
                            )}
                          />
                          {vehicle.label}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          )}
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="flex items-center text-red-500 text-sm">
          <AlertCircle className="h-4 w-4 mr-2" />
          {error}
        </div>
      )}

      {usingFallbackData && (
        <div className="flex items-center text-amber-500 text-sm mt-2">
          <Info className="h-4 w-4 mr-2" />
          Using offline vehicle data. Some features may be limited.
        </div>
      )}

      {/* Selected Vehicle Display */}
      {selectedVehicle && (
        <div className="p-4 rounded-lg bg-zinc-800/50 border border-zinc-700/50">
          <div className="flex items-center">
            <Car className="h-5 w-5 mr-2 text-logo-blue" />
            <span className="font-medium">
              {selectedVehicle.year} {selectedVehicle.make} {selectedVehicle.model}
            </span>
          </div>
        </div>
      )}
    </div>
  )
}
