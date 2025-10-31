"use client"

import { getLocalVehicleDetails } from "@/lib/local-vehicle-data"
import { useState, useEffect } from "react"
import { Calculator, Info } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { VehicleSelector } from "@/components/vehicle-selector"
import { VehicleDetails } from "@/components/vehicle-details"

// Default values
const DEFAULT_VALUES = {
  annualMiles: 15000,
  yearsOwned: 5,
  electricityRate: 0.14, // $/kWh national average
  gasolinePrice: 3.5, // $/gallon
  evEfficiency: 3.5, // miles/kWh
  gasEfficiency: 25, // mpg
  evPrice: 40000,
  gasPrice: 30000,
  evMaintenance: 0.06, // $/mile
  gasMaintenance: 0.1, // $/mile
  evIncentive: 7500,
  evInsurance: 1900, // annual insurance cost (updated)
  gasInsurance: 1700,
  evDepreciationRate: 0.45, // 45% depreciation over ownership period (updated)
  gasDepreciationRate: 0.45,
}

export default function CostEstimatorPage() {
  // State for inputs
  const [annualMiles, setAnnualMiles] = useState(DEFAULT_VALUES.annualMiles)
  const [yearsOwned, setYearsOwned] = useState(DEFAULT_VALUES.yearsOwned)
  const [electricityRate, setElectricityRate] = useState(DEFAULT_VALUES.electricityRate)
  const [gasolinePrice, setGasolinePrice] = useState(DEFAULT_VALUES.gasolinePrice)
  const [evEfficiency, setEvEfficiency] = useState(DEFAULT_VALUES.evEfficiency)
  const [gasEfficiency, setGasEfficiency] = useState(DEFAULT_VALUES.gasEfficiency)
  const [evPrice, setEvPrice] = useState(DEFAULT_VALUES.evPrice)
  const [gasPrice, setGasPrice] = useState(DEFAULT_VALUES.gasPrice)
  const [evMaintenance, setEvMaintenance] = useState(DEFAULT_VALUES.evMaintenance)
  const [gasMaintenance, setGasMaintenance] = useState(DEFAULT_VALUES.gasMaintenance)
  const [evIncentive, setEvIncentive] = useState(DEFAULT_VALUES.evIncentive)
  const [evInsurance, setEvInsurance] = useState(DEFAULT_VALUES.evInsurance)
  const [gasInsurance, setGasInsurance] = useState(DEFAULT_VALUES.gasInsurance)
  const [evDepreciationRate, setEvDepreciationRate] = useState(DEFAULT_VALUES.evDepreciationRate)
  const [gasDepreciationRate, setGasDepreciationRate] = useState(DEFAULT_VALUES.gasDepreciationRate)

  // State for vehicle selection
  const [selectedEvId, setSelectedEvId] = useState<number | null>(null)
  const [selectedGasId, setSelectedGasId] = useState<number | null>(null)
  const [evDetails, setEvDetails] = useState<any | null>(null)
  const [gasDetails, setGasDetails] = useState<any | null>(null)

  // State for UI
  const [activeTab, setActiveTab] = useState<string>("database")

  // State for calculated results
  const [results, setResults] = useState({
    evFuelCost: 0,
    gasFuelCost: 0,
    evMaintenanceCost: 0,
    gasMaintenanceCost: 0,
    evInsuranceCost: 0,
    gasInsuranceCost: 0,
    evTotalCost: 0,
    gasTotalCost: 0,
    savings: 0,
    yearsToBreakEven: 0,
    co2Savings: 0,
    evResidualValue: 0,
    gasResidualValue: 0,
  })

  // State for fetched vehicle data
  const [vehicleData, setVehicleData] = useState<any[]>([])
  const evOnlyVehicles = vehicleData.filter((v) =>
    ["electricity", "electric", "ev", "battery electric"].some(keyword =>
      v.fuelType1?.toLowerCase().includes(keyword)
    )
  )


useEffect(() => {
  if (!selectedEvId || vehicleData.length === 0) return
  const details = vehicleData.find((v) => Number(v.id) === selectedEvId)
  if (details) {
    setEvDetails(details)
    if (details.combE) {
      const efficiencyMilesPerKWh = 100 / Number(details.combE)
      setEvEfficiency(Number(efficiencyMilesPerKWh.toFixed(2)))
    }
  }
}, [selectedEvId, vehicleData])

useEffect(() => {
  if (!selectedGasId || vehicleData.length === 0) return
  const details = vehicleData.find((v) => Number(v.id) === selectedGasId)
  if (details) {
    setGasDetails(details)
    if (details.comb08) {
      setGasEfficiency(Number(details.comb08))
    }
  }
}, [selectedGasId, vehicleData])

  useEffect(() => {
    const fetchVehicleData = async () => {
      try {
        const res = await fetch("/api/vehicle-data")
        const data = await res.json()
        setVehicleData(data)
      } catch (err) {
        console.error("Failed to fetch local vehicle data", err)
      }
    }

    fetchVehicleData()
  }, [])

  // Calculate costs whenever inputs change
  useEffect(() => {
    // Calculate fuel costs
    const totalMiles = annualMiles * yearsOwned
    const evFuelCost = (totalMiles / evEfficiency) * electricityRate
    const gasFuelCost = (totalMiles / gasEfficiency) * gasolinePrice

    // Calculate maintenance costs
    const evMaintenanceCost = totalMiles * evMaintenance
    const gasMaintenanceCost = totalMiles * gasMaintenance

    // Calculate insurance costs
    const evInsuranceCost = evInsurance * yearsOwned
    const gasInsuranceCost = gasInsurance * yearsOwned

    // Calculate residual value (instead of depreciation)
    const evResidualValue = evPrice * (1 - evDepreciationRate)
    const gasResidualValue = gasPrice * (1 - gasDepreciationRate)

    // Calculate total costs (remove depreciation as explicit line item)
    const evTotalCost = evPrice + evFuelCost + evMaintenanceCost + evInsuranceCost - evIncentive - evResidualValue
    const gasTotalCost = gasPrice + gasFuelCost + gasMaintenanceCost + gasInsuranceCost - gasResidualValue

    // Calculate savings
    const savings = gasTotalCost - evTotalCost

    // Calculate years to break even
    const annualSavings =
      gasFuelCost / yearsOwned +
      gasMaintenanceCost / yearsOwned -
      (evFuelCost / yearsOwned + evMaintenanceCost / yearsOwned)
    const initialCostDifference = evPrice - evIncentive - gasPrice
    const yearsToBreakEven = annualSavings > 0 ? initialCostDifference / annualSavings : 999

    // Calculate CO2 savings
    const gasCO2 = gasDetails ? Number(gasDetails.co2TailpipeGpm || 404) : 404
    const evCO2 = evDetails ? Number(evDetails.co2TailpipeGpm || 0) : 0
    const co2Savings = ((gasCO2 - evCO2) * totalMiles) / 1000000

    setResults({
      evFuelCost,
      gasFuelCost,
      evMaintenanceCost,
      gasMaintenanceCost,
      evInsuranceCost,
      gasInsuranceCost,
      evTotalCost,
      gasTotalCost,
      savings,
      yearsToBreakEven: Number.parseFloat(yearsToBreakEven.toFixed(1)),
      co2Savings: Number.parseFloat(co2Savings.toFixed(1)),
      evResidualValue,
      gasResidualValue,
    })
  }, [
    annualMiles,
    yearsOwned,
    electricityRate,
    gasolinePrice,
    evEfficiency,
    gasEfficiency,
    evPrice,
    gasPrice,
    evMaintenance,
    gasMaintenance,
    evIncentive,
    evInsurance,
    gasInsurance,
    evDepreciationRate,
    gasDepreciationRate,
    evDetails,
    gasDetails,
  ])

  const resetToDefaults = () => {
    setAnnualMiles(DEFAULT_VALUES.annualMiles)
    setYearsOwned(DEFAULT_VALUES.yearsOwned)
    setElectricityRate(DEFAULT_VALUES.electricityRate)
    setGasolinePrice(DEFAULT_VALUES.gasolinePrice)
    setEvEfficiency(DEFAULT_VALUES.evEfficiency)
    setGasEfficiency(DEFAULT_VALUES.gasEfficiency)
    setEvPrice(DEFAULT_VALUES.evPrice)
    setGasPrice(DEFAULT_VALUES.gasPrice)
    setEvMaintenance(DEFAULT_VALUES.evMaintenance)
    setGasMaintenance(DEFAULT_VALUES.gasMaintenance)
    setEvIncentive(DEFAULT_VALUES.evIncentive)
    setEvInsurance(DEFAULT_VALUES.evInsurance)
    setGasInsurance(DEFAULT_VALUES.gasInsurance)
    setEvDepreciationRate(DEFAULT_VALUES.evDepreciationRate)
    setGasDepreciationRate(DEFAULT_VALUES.gasDepreciationRate)
    setSelectedEvId(null)
    setSelectedGasId(null)
    setEvDetails(null)
    setGasDetails(null)
  }

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div>
            <h1 className="text-2xl font-bold mb-4 text-logo-blue">Cost of Ownership Calculator (TCO)</h1>
            <p className="text-zinc-400">Compare the total cost of ownership between electric and gas vehicles</p>
          </div>
        </div>
      </div>

      {/* First row: Selectors + Cost Comparison */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 items-start">
        {/* Column 1: EV Selector */}
        <div className="h-full flex flex-col">
          <div className="flex-1 flex flex-col space-y-6">
            <Tabs defaultValue="database" value={activeTab} onValueChange={setActiveTab}>
              <TabsContent value="database" className="space-y-6">
                <div className="space-y-6">
                  {/* EV Selector */}
                  <div className="p-6 rounded-xl border border-zinc-800/50 bg-zinc-900/30">
                    <h2 className="text-xl font-bold mb-4">Electric Vehicle (EV)</h2>
                    <VehicleSelector
                      vehicleType="ev"
                      vehicles={evOnlyVehicles}
                      onVehicleSelect={setSelectedEvId}
                    />
                    {evDetails && (
                      <div className="text-sm text-zinc-400 mt-2">
                        Selected: {evDetails.year} {evDetails.make} {evDetails.model}
                      </div>
                    )}
                    {/* EV Inputs always visible in database tab */}
                    <div className="mt-4 space-y-4">
                      <div>
                        <Label htmlFor="ev-price">EV Purchase Price ($)</Label>
                        <Input
                          id="ev-price"
                          type="text"
                          value={evPrice.toLocaleString()}
                          onChange={(e) => {
                            const numericValue = Number(e.target.value.replace(/,/g, ""));
                            if (!isNaN(numericValue)) setEvPrice(numericValue);
                          }}
                        />
                      </div>
                      <div>
                        <Label htmlFor="ev-efficiency">EV Efficiency (miles/kWh)</Label>
                        <Input
                          id="ev-efficiency"
                          type="number"
                          value={evEfficiency}
                          onChange={(e) => setEvEfficiency(Number(e.target.value))}
                          min={0}
                          step={0.1}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
        {/* Column 2: Gas Selector + Inputs */}
        <div className="h-full flex flex-col">
          <div className="flex-1 flex flex-col space-y-6">
            <Tabs defaultValue="database" value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="hidden" />
              <TabsContent value="database" className="space-y-6">
                <div className="space-y-6">
                  {/* Gas Vehicle Selector */}
                  <div className="p-6 rounded-xl border border-zinc-800/50 bg-zinc-900/30">
                    <h2 className="text-xl font-bold mb-4">Gas Vehicle</h2>
                    <VehicleSelector
                      vehicleType="gas"
                      vehicles={vehicleData.filter((v) => !v.fuelType1?.toLowerCase().includes("electric"))}
                      onVehicleSelect={setSelectedGasId}
                    />
                    {gasDetails && (
                      <div className="text-sm text-zinc-400 mt-2">
                        Selected: {gasDetails.year} {gasDetails.make} {gasDetails.model}
                      </div>
                    )}
                    {/* Gas Inputs always visible in database tab */}
                    <div className="mt-4 space-y-4">
                      <div>
                        <Label htmlFor="gas-price">Gas Vehicle Purchase Price ($)</Label>
                        <Input
                          id="gas-price"
                          type="text"
                          value={gasPrice.toLocaleString()}
                          onChange={(e) => {
                            const numericValue = Number(e.target.value.replace(/,/g, ""));
                            if (!isNaN(numericValue)) setGasPrice(numericValue);
                          }}
                        />
                      </div>
                      <div>
                        <Label htmlFor="gas-efficiency">Gas Vehicle Efficiency (mpg)</Label>
                        <Input
                          id="gas-efficiency"
                          type="number"
                          value={gasEfficiency}
                          onChange={(e) => setGasEfficiency(Number(e.target.value))}
                          min={0}
                          step={0.1}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
        {/* Column 3: Cost Comparison (excluding breakdown) */}
        <div className="h-full flex flex-col">
          <div className="flex-1 flex flex-col space-y-6 pt-2">
            <div className="p-6 rounded-xl border border-zinc-800/50 bg-zinc-900/30">
              <h2 className="text-xl font-bold mb-4">Cost Comparison</h2>
              <div className="space-y-6">
                {/* Vehicle Comparison */}
                <div className="grid grid-cols-2 gap-4 text-sm text-zinc-400">
                  <div>
                    <strong className="text-white">Electric Vehicle:</strong>{" "}
                    {evDetails ? `${evDetails.year} ${evDetails.make} ${evDetails.model}` : "Custom EV"}
                  </div>
                  <div>
                    <strong className="text-white">Gas Vehicle:</strong>{" "}
                    {gasDetails ? `${gasDetails.year} ${gasDetails.make} ${gasDetails.model}` : "Custom Vehicle"}
                  </div>
                </div>
                {/* Total Cost Comparison */}
                <div className="space-y-2">
                  <h3 className="text-sm font-semibold">Total Cost of Ownership ({yearsOwned} Years)</h3>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="p-4 rounded-lg bg-logo-blue/10 border border-logo-blue/20">
                      <div className="text-sm text-zinc-400 mb-1">EV</div>
                      <div className="text-xl font-bold text-white">
                        ${Math.round(results.evTotalCost).toLocaleString()}
                      </div>
                    </div>
                    <div className="p-4 rounded-lg bg-zinc-800/50 border border-zinc-700/20">
                      <div className="text-sm text-zinc-400 mb-1">Gas</div>
                      <div className="text-xl font-bold text-white">
                        ${Math.round(results.gasTotalCost).toLocaleString()}
                      </div>
                    </div>
                  </div>
                </div>
                {/* Savings */}
                <div className="p-4 rounded-lg bg-gradient-to-r from-logo-blue/20 to-logo-blue/5 border border-logo-blue/20">
                  <div className="text-sm text-zinc-400 mb-1">Total Savings with EV</div>
                  <div className={`text-xl font-bold ${results.savings > 0 ? "text-green-400" : "text-red-400"}`}>
                    ${Math.round(results.savings).toLocaleString()}
                  </div>
                  {results.yearsToBreakEven < 100 && (
                    <div className="text-sm text-zinc-400 mt-1">
                      Break-even approx. {results.yearsToBreakEven} years
                    </div>
                  )}
                </div>
                {/* Environmental Impact */}
                <div className="p-4 rounded-lg bg-green-900/20 border border-green-900/30">
                  <div className="text-sm text-zinc-400 mb-1">Environmental Impact</div>
                  <div className="text-sm font-bold text-green-400">
                    {results.co2Savings.toLocaleString()} metric tons CO<sub>2</sub> saved
                  </div>
                  <div className="text-sm text-zinc-400 mt-1">
                    Equivalent to approx. {Math.round(results.co2Savings * 16.5)} trees
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Second row: Advanced Settings + Cost Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 items-start">
        {/* Cost Breakdown (Left) */}
        <div className="p-8 rounded-xl border border-zinc-800/50 bg-zinc-900/30">
          <h3 className="text-lg font-semibold mb-4">Cost Breakdown</h3>
          {/* Move all content inside the original "Cost Breakdown" div here */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-zinc-400">Initial Purchase Price</span>
              <div className="flex gap-4">
                <span className="text-logo-blue w-24 text-right">${evPrice.toLocaleString()}</span>
                <span className="w-24 text-right">${gasPrice.toLocaleString()}</span>
              </div>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-zinc-400">Federal Tax Credit</span>
              <div className="flex gap-4">
                <span className="text-logo-blue w-24 text-right">-${evIncentive.toLocaleString()}</span>
                <span className="w-24 text-right">$0</span>
              </div>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-zinc-400">Fuel Costs</span>
              <div className="flex gap-4">
                <span className="text-logo-blue w-24 text-right">
                  ${Math.round(results.evFuelCost).toLocaleString()}
                </span>
                <span className="w-24 text-right">${Math.round(results.gasFuelCost).toLocaleString()}</span>
              </div>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-zinc-400">Maintenance Costs</span>
              <div className="flex gap-4">
                <span className="text-logo-blue w-24 text-right">
                  ${Math.round(results.evMaintenanceCost).toLocaleString()}
                </span>
                <span className="w-24 text-right">
                  ${Math.round(results.gasMaintenanceCost).toLocaleString()}
                </span>
              </div>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-zinc-400">Insurance Cost</span>
              <div className="flex gap-4">
                <span className="text-logo-blue w-24 text-right">
                  ${Math.round(results.evInsuranceCost).toLocaleString()}
                </span>
                <span className="w-24 text-right">
                  ${Math.round(results.gasInsuranceCost).toLocaleString()}
                </span>
              </div>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-zinc-400">Residual Value After {yearsOwned} Years</span>
              <div className="flex gap-4">
                <span className="text-logo-blue w-24 text-right">${Math.round(results.evResidualValue).toLocaleString()}</span>
                <span className="w-24 text-right">${Math.round(results.gasResidualValue).toLocaleString()}</span>
              </div>
            </div>
            <div className="border-t border-zinc-800 pt-2 mt-2">
              <div className="flex justify-between text-sm font-semibold">
                <span className="text-zinc-300">Total</span>
                <div className="flex gap-4">
                  <span className="text-logo-blue w-24 text-right">
                    ${Math.round(results.evTotalCost).toLocaleString()}
                  </span>
                  <span className="w-24 text-right">${Math.round(results.gasTotalCost).toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Advanced Settings + About (Right) */}
        <div>
          {/* Move the entire Accordion (Advanced Settings) here */}
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="advanced" className="border border-zinc-800/50 rounded-xl overflow-hidden">
              <AccordionTrigger className="px-6 py-4 hover:bg-zinc-900/30 hover:no-underline">
                <span className="text-lg font-semibold">Advanced Settings</span>
              </AccordionTrigger>
              <AccordionContent className="px-6 pb-6 pt-2 bg-zinc-900/30">
                <div className="space-y-4">
                  {/* Usage Information sliders moved here */}
                  <div className="space-y-6">
                    <div>
                      <div className="flex justify-between mb-2">
                        <Label htmlFor="annual-miles">Annual Miles: {annualMiles.toLocaleString()}</Label>
                      </div>
                      <Slider
                        id="annual-miles"
                        min={5000}
                        max={30000}
                        step={1000}
                        value={[annualMiles]}
                        onValueChange={(value) => setAnnualMiles(value[0])}
                      />
                    </div>
                    <div>
                      <div className="flex justify-between mb-2">
                        <Label htmlFor="years-owned">Years of Ownership: {yearsOwned}</Label>
                      </div>
                      <Slider
                        id="years-owned"
                        min={1}
                        max={15}
                        step={1}
                        value={[yearsOwned]}
                        onValueChange={(value) => setYearsOwned(value[0])}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="electricity-rate">Electricity Rate ($/kWh)</Label>
                      <Input
                        id="electricity-rate"
                        type="number"
                        value={electricityRate}
                        onChange={(e) => setElectricityRate(Number(e.target.value))}
                        min={0}
                        step={0.01}
                      />
                    </div>
                    <div>
                      <Label htmlFor="gasoline-price">Gasoline Price ($/gallon)</Label>
                      <Input
                        id="gasoline-price"
                        type="number"
                        value={gasolinePrice}
                        onChange={(e) => setGasolinePrice(Number(e.target.value))}
                        min={0}
                        step={0.01}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="ev-maintenance">EV Maintenance ($/mile)</Label>
                      <Input
                        id="ev-maintenance"
                        type="number"
                        value={evMaintenance}
                        onChange={(e) => setEvMaintenance(Number(e.target.value))}
                        min={0}
                        step={0.01}
                      />
                    </div>
                    <div>
                      <Label htmlFor="gas-maintenance">Gas Maintenance ($/mile)</Label>
                      <Input
                        id="gas-maintenance"
                        type="number"
                        value={gasMaintenance}
                        onChange={(e) => setGasMaintenance(Number(e.target.value))}
                        min={0}
                        step={0.01}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="ev-insurance">EV Insurance ($/year)</Label>
                      <Input
                        id="ev-insurance"
                        type="number"
                        value={evInsurance}
                        onChange={(e) => setEvInsurance(Number(e.target.value))}
                        min={0}
                        step={1}
                      />
                    </div>
                    <div>
                      <Label htmlFor="gas-insurance">Gas Insurance ($/year)</Label>
                      <Input
                        id="gas-insurance"
                        type="number"
                        value={gasInsurance}
                        onChange={(e) => setGasInsurance(Number(e.target.value))}
                        min={0}
                        step={1}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="ev-depreciation-rate">EV Depreciation Rate (%)</Label>
                      <Input
                        id="ev-depreciation-rate"
                        type="number"
                        value={Math.round(evDepreciationRate * 100)}
                        onChange={(e) => setEvDepreciationRate(Number(e.target.value) / 100)}
                        min={0}
                        max={100}
                        step={1}
                      />
                    </div>
                    <div>
                      <Label htmlFor="gas-depreciation-rate">Gas Depreciation Rate (%)</Label>
                      <Input
                        id="gas-depreciation-rate"
                        type="number"
                        value={Math.round(gasDepreciationRate * 100)}
                        onChange={(e) => setGasDepreciationRate(Number(e.target.value) / 100)}
                        min={0}
                        max={100}
                        step={1}
                      />
                    </div>
                  </div>
                  {/* EV Incentive input moved here */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="ev-incentive">EV Tax Credit/Incentives ($)</Label>
                      <Input
                        id="ev-incentive"
                        type="number"
                        value={evIncentive}
                        onChange={(e) => setEvIncentive(Number(e.target.value))}
                        min={0}
                      />
                    </div>
                  </div>
                  <div className="pt-2">
                    <Button variant="outline" size="sm" onClick={resetToDefaults}>
                      Reset to Defaults
                    </Button>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
          {/* About Calculator Section */}
          <div className="mt-3">
            <div className="p-5 rounded-xl border border-zinc-800/50 bg-zinc-900/30">
              <div className="flex items-start gap-3">
                <Info className="w-5 h-5 text-zinc-400 mt-0.5 flex-shrink-0" />
                <div className="space-y-2">
                  <h3 className="text-sm text-zinc-500 font-semibold">About This Calculator</h3>
                  <p className="text-xs text-zinc-500 italic mt-2">
                    This calculator uses data from the U.S. Department of Energy's fueleconomy.gov database to provide
                    comparisons between electric and gasoline vehicles savings on fuel costs and emmissions.
                  </p>
                  <p className="text-xs text-zinc-500 italic mt-2">
                    For the most accurate results, enter vehicle details and adjust the advanced
                    settings to match your vehicle information.
                  </p>
                  <p className="text-xs text-zinc-500 italic mt-2">
                    *Insurance and depreciation rates are based on U.S. national averages (source: iSeeCars, Kelley Blue Book 2024). 
                    Actual values may vary by vehicle, location, and driver profile. For more accuracy, input rates in the Advanced Settings at the bottom.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
