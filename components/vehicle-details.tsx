"use client"

import { useState, useEffect } from "react"
import { Battery, Gauge, DollarSign, Zap, Fuel, AlertCircle } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import * as FuelEconomyAPI from "@/services/fueleconomy-api"

interface VehicleDetailsProps {
  vehicleId: number | null
  vehicleType: "ev" | "gas"
  onDetailsLoaded: (details: FuelEconomyAPI.VehicleDetails | null) => void
}

export function VehicleDetails({ vehicleId, vehicleType, onDetailsLoaded }: VehicleDetailsProps) {
  const [details, setDetails] = useState<FuelEconomyAPI.VehicleDetails | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!vehicleId) {
      setDetails(null)
      onDetailsLoaded(null)
      return
    }

    const fetchVehicleDetails = async () => {
      setLoading(true)
      setError(null)

      try {
        const vehicleDetails = await FuelEconomyAPI.getVehicleDetails(vehicleId)

        if (vehicleDetails) {
          const isEV = FuelEconomyAPI.isElectricVehicle(vehicleDetails)

          // Verify the vehicle type matches what we expect
          if ((vehicleType === "ev" && isEV) || (vehicleType === "gas" && !isEV)) {
            setDetails(vehicleDetails)
            onDetailsLoaded(vehicleDetails)
          } else {
            setError(
              `This is ${isEV ? "an electric" : "a gas"} vehicle. Please select ${vehicleType === "ev" ? "an electric" : "a gas"} vehicle.`,
            )
            setDetails(null)
            onDetailsLoaded(null)
          }
        } else {
          setError("Failed to load vehicle details.")
          setDetails(null)
          onDetailsLoaded(null)
        }
      } catch (err) {
        setError("An error occurred while loading vehicle details.")
        console.error(err)
        setDetails(null)
        onDetailsLoaded(null)
      } finally {
        setLoading(false)
      }
    }

    fetchVehicleDetails()
  }, [vehicleId, vehicleType, onDetailsLoaded])

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-6 w-3/4" />
        <div className="grid grid-cols-2 gap-4">
          <Skeleton className="h-20" />
          <Skeleton className="h-20" />
          <Skeleton className="h-20" />
          <Skeleton className="h-20" />
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-4 rounded-lg bg-red-900/20 border border-red-900/30 text-red-400 flex items-start">
        <AlertCircle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
        <div>
          <p className="font-medium">Error loading vehicle details</p>
          <p className="text-sm">{error}</p>
        </div>
      </div>
    )
  }

  if (!details) {
    return (
      <div className="p-4 rounded-lg bg-zinc-800/30 border border-zinc-700/30 text-zinc-400 text-center">
        <p>Select a vehicle to view details</p>
      </div>
    )
  }

  // Calculate efficiency metrics
  const isEV = FuelEconomyAPI.isElectricVehicle(details)
  const evEfficiency = isEV ? FuelEconomyAPI.calculateEVEfficiency(details) : 0
  const gasMPG = !isEV ? FuelEconomyAPI.getGasMPG(details) : 0
  const annualFuelCost = FuelEconomyAPI.getAnnualFuelCost(details)
  const co2Emissions = FuelEconomyAPI.getCO2Emissions(details)
  const taxCredit = isEV ? FuelEconomyAPI.getEstimatedTaxCredit(details) : 0

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">
        {details.year} {details.make} {details.model}
      </h3>

      <div className="grid grid-cols-2 gap-4">
        {/* Efficiency */}
        <div className="p-3 rounded-lg bg-zinc-800/30 border border-zinc-700/30">
          <div className="flex items-center text-zinc-400 mb-1">
            {isEV ? (
              <>
                <Zap className="h-4 w-4 mr-1" />
                <span className="text-xs">Efficiency</span>
              </>
            ) : (
              <>
                <Fuel className="h-4 w-4 mr-1" />
                <span className="text-xs">Fuel Economy</span>
              </>
            )}
          </div>
          <div className="font-medium">
            {isEV ? (
              <>
                {evEfficiency.toFixed(1)} <span className="text-sm text-zinc-400">miles/kWh</span>
              </>
            ) : (
              <>
                {gasMPG.toFixed(0)} <span className="text-sm text-zinc-400">MPG</span>
              </>
            )}
          </div>
        </div>

        {/* Range or Fuel Type */}
        <div className="p-3 rounded-lg bg-zinc-800/30 border border-zinc-700/30">
          <div className="flex items-center text-zinc-400 mb-1">
            <Gauge className="h-4 w-4 mr-1" />
            <span className="text-xs">{isEV ? "Range" : "Fuel Type"}</span>
          </div>
          <div className="font-medium">
            {isEV ? (
              <>
                {details.rangeA || "N/A"} <span className="text-sm text-zinc-400">miles</span>
              </>
            ) : (
              <>{details.fuelType || "Gasoline"}</>
            )}
          </div>
        </div>

        {/* Annual Fuel Cost */}
        <div className="p-3 rounded-lg bg-zinc-800/30 border border-zinc-700/30">
          <div className="flex items-center text-zinc-400 mb-1">
            <DollarSign className="h-4 w-4 mr-1" />
            <span className="text-xs">Annual Fuel Cost</span>
          </div>
          <div className="font-medium">${annualFuelCost.toFixed(0)}</div>
        </div>

        {/* Battery or CO2 */}
        <div className="p-3 rounded-lg bg-zinc-800/30 border border-zinc-700/30">
          <div className="flex items-center text-zinc-400 mb-1">
            {isEV ? (
              <>
                <Battery className="h-4 w-4 mr-1" />
                <span className="text-xs">Battery</span>
              </>
            ) : (
              <>
                <AlertCircle className="h-4 w-4 mr-1" />
                <span className="text-xs">CO2 Emissions</span>
              </>
            )}
          </div>
          <div className="font-medium">
            {isEV ? (
              <>
                {details.evMotor || "N/A"} <span className="text-sm text-zinc-400">kWh</span>
              </>
            ) : (
              <>
                {co2Emissions} <span className="text-sm text-zinc-400">g/mile</span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Additional Details */}
      <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-zinc-400">Transmission:</span>
          <span>{details.transmission || details.trany || "N/A"}</span>
        </div>

        {!isEV && (
          <>
            <div className="flex justify-between">
              <span className="text-zinc-400">Cylinders:</span>
              <span>{details.cylinders || "N/A"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-400">Displacement:</span>
              <span>{details.displacement || "N/A"}</span>
            </div>
          </>
        )}

        <div className="flex justify-between">
          <span className="text-zinc-400">Drive:</span>
          <span>{details.drive || "N/A"}</span>
        </div>

        {isEV && (
          <>
            <div className="flex justify-between">
              <span className="text-zinc-400">Charge Time:</span>
              <span>{details.charge240 ? `${details.charge240} hours` : "N/A"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-400">Est. Tax Credit:</span>
              <span>${taxCredit.toFixed(0)}</span>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
