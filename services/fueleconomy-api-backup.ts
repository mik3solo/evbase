/**
 * Service for interacting with the fueleconomy.gov API
 */

// Base URL for the API
const API_BASE_URL = "https://www.fueleconomy.gov/ws/rest"

// Fallback data in case the API is unavailable
const FALLBACK_YEARS = [2024, 2023, 2022, 2021, 2020, 2019, 2018]
const FALLBACK_MAKES = ["Tesla", "Ford", "Chevrolet", "Nissan", "Toyota", "Honda", "Hyundai", "Kia"]
const FALLBACK_MODELS: Record<string,string[]> = {
  Tesla: ["Model 3", "Model Y", "Model S", "Model X"],
  Ford: ["Mustang Mach-E", "F-150 Lightning", "Escape", "Explorer"],
  Chevrolet: ["Bolt EV", "Bolt EUV", "Silverado EV", "Equinox"],
  Nissan: ["Leaf", "Ariya", "Altima", "Sentra"],
  Toyota: ["Prius Prime", "bZ4X", "RAV4 Prime", "Camry"],
  Honda: ["Accord", "Civic", "CR-V", "Clarity"],
  Hyundai: ["IONIQ 5", "Kona Electric", "Santa Fe", "Tucson"],
  Kia: ["EV6", "Niro EV", "Soul EV", "Sportage"],
}

// Types for API responses
export interface VehicleMenuOption {
  value: number
  text: string
}

export interface VehicleOption {
  id: number;
  label: string;   // The descriptive “text” from the API
  make: string;
  model: string;
  year: number;
}

export interface VehicleDetails {
  id: number
  make: string
  model: string
  year: number
  atvtype?: string
  fuelType: string
  fuelType1?: string
  UCity?: number
  UHighway?: number
  youSaveSpend?: number
  fuelCost08?: number
  rangeA?: number
  phevBlended?: boolean
  evMotor?: string
  batteryCapacity?: number
  cylinders?: string
  displacement?: string
  drive?: string
  transmission?: string
  chargeTime?: number
  startStop?: string
  mfrCode?: string
  trany?: string
  VClass?: string
  pv2?: number // Annual petroleum consumption (barrels)
  pv4?: number // Annual tailpipe CO2 (grams/mile)
  ghgScore?: number
  ghgScoreA?: number
}

// Helper: normalize a make/model key (case‐insensitive)
function normalizeKey(key: string): string {
  return key.charAt(0).toUpperCase() + key.slice(1).toLowerCase()
}

// Fetch JSON with proper headers, return null on failure
async function fetchJson(url: string): Promise<any|null> {
  try {
    const resp = await fetch(url, { headers: { Accept: "application/json" } })
    if (!resp.ok) throw new Error(`HTTP ${resp.status}`)
    return await resp.json()
  } catch (e) {
    console.error(`Error fetching JSON from ${url}:`, e)
    return null
  }
}

// getYears()
export async function getYears(): Promise<number[]> {
  const data = await fetchJson(`${API_BASE_URL}/vehicle/menu/year`)
  if (data?.menuItem) {
    const items = Array.isArray(data.menuItem) ? data.menuItem : [data.menuItem]
    return items.map((item: VehicleMenuOption) => Number(item.value))
  }
  console.warn("Using fallback years data")
  return FALLBACK_YEARS
}

// getMakes(year)
export async function getMakes(year: number): Promise<string[]> {
  const data = await fetchJson(`${API_BASE_URL}/vehicle/menu/make?year=${year}`)
  if (data?.menuItem) {
    const items = Array.isArray(data.menuItem) ? data.menuItem : [data.menuItem]
    return items.map((item: VehicleMenuOption) => item.text)
  }
  console.warn("Using fallback makes data")
  return FALLBACK_MAKES
}

// getModels(year, make)
export async function getModels(year: number, make: string): Promise<string[]> {
  const data = await fetchJson(
    `${API_BASE_URL}/vehicle/menu/model?year=${year}&make=${encodeURIComponent(make)}`
  )
  if (data?.menuItem) {
    const items = Array.isArray(data.menuItem) ? data.menuItem : [data.menuItem]
    return items.map((item: VehicleMenuOption) => item.text)
  }
  console.warn("Using fallback models for:", make)
  const key = normalizeKey(make)
  return FALLBACK_MODELS[key] || []
}

// getOptions(year, make, model)
interface OptionWithText {
  id: number;
  label: string;    // the raw “text” (e.g. “Auto (S5), 4 cyl, 1.5 L”)
  make: string;
  model: string;
  year: number;
}

export async function getOptions(
  year: number,
  make: string,
  model: string
): Promise<OptionWithText[]> {
  const data = await fetchJson(
    `${API_BASE_URL}/vehicle/menu/options?year=${year}` +
    `&make=${encodeURIComponent(make)}` +
    `&model=${encodeURIComponent(model)}`
  );

  if (data?.menuItem) {
    const items = Array.isArray(data.menuItem)
      ? data.menuItem
      : [data.menuItem];

    return items.map((item: VehicleMenuOption) => ({
      id: Number(item.value),
      label: item.text,   // <-- grab the descriptive “text”
      make,
      model,
      year,
    }));
  }

  console.warn(`No options found for ${year} ${make} ${model}`);
  return [];
}

// getVehicleDetails(id)
export async function getVehicleDetails(id: number): Promise<VehicleDetails | null> {
  try {
    const data = await fetchJson(`${API_BASE_URL}/vehicle/${id}`);
    if (!data) return null;

    return {
      id: Number(data.id),
      make: data.make,
      model: data.model,
      year: Number(data.year),
      atvtype: data.atvtype,
      fuelType: data.fuelType,
      fuelType1: data.fuelType1,
      UCity: Number(data.city08U) || Number(data.city08),
      UHighway: Number(data.highway08U) || Number(data.highway08),
      youSaveSpend: Number(data.youSaveSpend),
      fuelCost08: Number(data.fuelCost08),
      rangeA: Number(data.rangeA) || 0,
      batteryCapacity: Number(data.batteryKwh) || 0,
      phevBlended: data.phevBlended === "true",
      evMotor: data.evMotor,
      chargeTime: Number(data.chargeTime) || 0,
      startStop: data.startStop,
      mfrCode: data.mfrCode,
      trany: data.trany,
      VClass: data.VClass,
      pv2: Number(data.pv2),
      pv4: Number(data.pv4),
      ghgScore: Number(data.ghgScore),
      ghgScoreA: Number(data.ghgScoreA),
    };
  } catch (err) {
    // If the server returns HTTP 500 (or network fails), you’ll land here.
    console.warn(`⚠️ FEULECONOMY API threw when fetching vehicle/${id}:`, err);
    return null; // indicate “no details available”
  }  
}

// searchVehicles(year?, make?, model?)
export async function searchVehicles(
  year?: number,
  make?: string,
  model?: string
): Promise<VehicleOption[]> {
  let url = `${API_BASE_URL}/vehicles/search?`
  if (year) url += `year=${year}&`
  if (make) url += `make=${encodeURIComponent(make)}&`
  if (model) url += `model=${encodeURIComponent(model)}&`

  const data = await fetchJson(url)
  if (data?.vehicle) {
    const list = Array.isArray(data.vehicle) ? data.vehicle : [data.vehicle]
    return list.map((v: any) => ({
      id: Number(v.id),
      make: v.make,
      model: v.model,
      year: Number(v.year),
    }))
  }
  console.error("Search vehicles returned no data")
  return []
}

// getElectricVehicles(year)
export async function getElectricVehicles(year: number): Promise<VehicleOption[]> {
  try {
    const makes = await getMakes(year)
    let allEVs: VehicleOption[] = []

    for (const mk of makes) {
      const data = await fetchJson(
        `${API_BASE_URL}/vehicles/search?year=${year}` +
        `&make=${encodeURIComponent(mk)}` +
        `&fuelType=Electricity`
      )
      if (data?.vehicle) {
        const list = Array.isArray(data.vehicle) ? data.vehicle : [data.vehicle]
        allEVs = allEVs.concat(
          list.map((v: any) => ({
            id: Number(v.id),
            make: v.make,
            model: v.model,
            year: Number(v.year),
          }))
        )
      }
    }
    return allEVs
  } catch (e) {
    console.error("Error fetching electric vehicles:", e)
    return []
  }
}

// Determine if a vehicle is electric based on atvtype & fuel fields
export function isElectricVehicle(vehicle: VehicleDetails): boolean {
  const atv = vehicle.atvtype?.toLowerCase() || ""
  if (atv.includes("ev") || atv.includes("phev") || atv.includes("bev")) {
    return true
  }
  if (vehicle.fuelType === "Electricity" || vehicle.fuelType1 === "Electricity") {
    return true
  }
  if ((vehicle.batteryCapacity || 0) > 0 || !!vehicle.evMotor) {
    return true
  }
  return false
}

// Calculate EV efficiency in miles/kWh
export function calculateEVEfficiency(vehicle: VehicleDetails): number {
  if (vehicle.rangeA && vehicle.batteryCapacity && vehicle.batteryCapacity > 0) {
    return vehicle.rangeA / vehicle.batteryCapacity
  }
  return 3.5
}

// Get MPG for gas vehicles
export function getGasMPG(vehicle: VehicleDetails): number {
  if (vehicle.UCity && vehicle.UHighway) {
    return (vehicle.UCity + vehicle.UHighway) / 2
  }
  return 25
}

// Get annual fuel cost
export function getAnnualFuelCost(vehicle: VehicleDetails): number {
  return vehicle.fuelCost08 || 0
}

// Get CO2 emissions (g/mile)
export function getCO2Emissions(vehicle: VehicleDetails): number {
  return vehicle.youSaveSpend !== undefined ? -vehicle.youSaveSpend : 0
}

// Estimate tax credit for EVs
export function getEstimatedTaxCredit(vehicle: VehicleDetails): number {
  if (isElectricVehicle(vehicle) && vehicle.rangeA && vehicle.rangeA > 200) {
    return 7500
  }
  if (vehicle.phevBlended && vehicle.batteryCapacity) {
    if (vehicle.batteryCapacity >= 10) return 4000
    if (vehicle.batteryCapacity >= 5) return 2000
  }
  return 0
}