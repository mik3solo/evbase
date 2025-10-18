/**
 * Service for interacting with the fueleconomy.gov API
 */

import { parseStringPromise } from "xml2js"

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
  atvType?: string
  comb08?: number
  combE?: number
  fuelType: string
  fuelType1?: string
  UCity?: number
  UHighway?: number
  youSaveSpend?: number
  fuelCost08?: number
  range?: number
  rangeA?: number
  phevBlended?: boolean
  evMotor?: string
  cylinders?: string
  displacement?: string
  drive?: string
  transmission?: string
  charge240?: number
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

// Helpers for xml2js shapes
function getMenuItemsNode(obj: any) {
  // xml2js with explicitArray:false yields { menuItems: { menuItem: [...] } }
  // Some older code paths expect { menuItem: [...] }
  return obj?.menuItems?.menuItem ?? obj?.menuItem ?? null
}

function getVehiclesNode(obj: any) {
  // Search endpoints return { vehicles: { vehicle: [...] } }
  // but we may also receive a flattened { vehicle: [...] }
  return obj?.vehicles?.vehicle ?? obj?.vehicle ?? null
}

// Fetch JSON with proper headers, return null on failure
async function fetchXml(url: string): Promise<any | null> {
  try {
    const resp = await fetch(url, { headers: { Accept: "application/xml" } })
    if (!resp.ok) throw new Error(`HTTP ${resp.status}`)
    const text = await resp.text()
    const result = await parseStringPromise(text, { explicitArray: false })
    return result
  } catch (e) {
    console.error(`Error fetching/parsing XML from ${url}:`, e)
    return null
  }
}

// getYears()
export async function getYears(): Promise<number[]> {
  const data = await fetchXml(`${API_BASE_URL}/vehicle/menu/year`)
  const menu = getMenuItemsNode(data)
  if (menu) {
    const items = Array.isArray(menu) ? menu : [menu]
    return items.map((item: VehicleMenuOption) => Number(item.value))
  }
  console.warn("Using fallback years data", { raw: data })
  return FALLBACK_YEARS
}

// getMakes(year)
export async function getMakes(year: number): Promise<string[]> {
  const data = await fetchXml(`${API_BASE_URL}/vehicle/menu/make?year=${year}`)
  const menu = getMenuItemsNode(data)
  if (menu) {
    const items = Array.isArray(menu) ? menu : [menu]
    return items.map((item: VehicleMenuOption) => item.text)
  }
  console.warn("Using fallback makes data", { raw: data })
  return FALLBACK_MAKES
}

// getModels(year, make)
export async function getModels(year: number, make: string): Promise<string[]> {
  const data = await fetchXml(
    `${API_BASE_URL}/vehicle/menu/model?year=${year}&make=${encodeURIComponent(make)}`
  )
  const menu = getMenuItemsNode(data)
  if (menu) {
    const items = Array.isArray(menu) ? menu : [menu]
    return items.map((item: VehicleMenuOption) => item.text)
  }
  console.warn("Using fallback models for:", make, { raw: data })
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
  const data = await fetchXml(
    `${API_BASE_URL}/vehicle/menu/options?year=${year}` +
    `&make=${encodeURIComponent(make)}` +
    `&model=${encodeURIComponent(model)}`
  );

  const menu = getMenuItemsNode(data)
  if (menu) {
    const items = Array.isArray(menu) ? menu : [menu]
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
    const response = await fetch(`${API_BASE_URL}/vehicle/${id}`, {
      headers: { Accept: "application/xml" }
    })
    if (!response.ok) throw new Error("HTTP error")

    const xml = await response.text()
    const result = await parseStringPromise(xml)
    const raw = result.vehicle

    return {
      id: id,
      make: raw.make?.[0] || "Unknown",
      model: raw.model?.[0] || "Unknown",
      year: Number(raw.year?.[0]) || 0,
      atvType: raw.atvType?.[0],
      comb08: Number(raw.comb08?.[0]),
      combE: Number(raw.combE?.[0]),
      fuelType: raw.fuelType?.[0],
      fuelType1: raw.fuelType1?.[0],
      UCity: Number(raw.city08U?.[0] || raw.city08?.[0]),
      UHighway: Number(raw.highway08U?.[0] || raw.highway08?.[0]),
      youSaveSpend: Number(raw.youSaveSpend?.[0]),
      fuelCost08: Number(raw.fuelCost08?.[0]),
      range: Number(raw.range?.[0]) || 0,
      rangeA: Number(raw.rangeA?.[0]) || 0,
      phevBlended: raw.phevBlended?.[0] === "true",
      evMotor: raw.evMotor?.[0],
      charge240: Number(raw.charge240?.[0]),
      startStop: raw.startStop?.[0],
      mfrCode: raw.mfrCode?.[0],
      trany: raw.trany?.[0],
      drive: raw.drive?.[0],
      displacement: raw.displ?.[0],
      transmission: raw.transmission?.[0],
      VClass: raw.VClass?.[0],
      pv2: Number(raw.pv2?.[0]),
      pv4: Number(raw.pv4?.[0]),
      ghgScore: Number(raw.ghgScore?.[0]),
      ghgScoreA: Number(raw.ghgScoreA?.[0])
    }
  } catch (err) {
    console.warn(`⚠️ API threw while fetching vehicle/${id}:`, err)
    return null
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

  const data = await fetchXml(url)
  const nodes = getVehiclesNode(data)
  if (nodes) {
    const list = Array.isArray(nodes) ? nodes : [nodes]
    return list.map((v: any) => ({
      id: Number(v.id),
      make: v.make,
      model: v.model,
      year: Number(v.year),
      label: `${Number(v.year)} ${String(v.make)} ${String(v.model)}`,
    }))
  }
  console.error("Search vehicles returned no data", { raw: data })
  return []
}

// getElectricVehicles(year)
export async function getElectricVehicles(year: number): Promise<VehicleOption[]> {
  try {
    const makes = await getMakes(year)
    let allEVs: VehicleOption[] = []

    for (const mk of makes) {
      const data = await fetchXml(
        `${API_BASE_URL}/vehicles/search?year=${year}` +
        `&make=${encodeURIComponent(mk)}` +
        `&fuelType=Electricity`
      )
      const nodes = getVehiclesNode(data)
      if (nodes) {
        const list = Array.isArray(nodes) ? nodes : [nodes]
        allEVs = allEVs.concat(
          list.map((v: any) => ({
            id: Number(v.id),
            make: v.make,
            model: v.model,
            year: Number(v.year),
            label: `${Number(v.year)} ${String(v.make)} ${String(v.model)}`,
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

// Determine if a vehicle is electric based on atvType & fuel fields
export function isElectricVehicle(vehicle: VehicleDetails): boolean {
  const atv = vehicle.atvType?.toLowerCase() || ""
  if (atv.includes("ev") || atv.includes("bev")) {
    return true
  }
  if (vehicle.fuelType === "Electricity" || vehicle.fuelType1 === "Electricity") {
    return true
  }
  return false
}

// Calculate EV efficiency in miles/kWh
export function calculateEVEfficiency(vehicle: VehicleDetails): number {
  if (vehicle.range && vehicle.comb08 && vehicle.combE > 0) {
    return (100 / vehicle.combE)
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
  if (vehicle.phevBlended) {
    return 4000
  }
  return 0
}