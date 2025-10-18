import fs from "fs"
import path from "path"
import Papa from "papaparse"

let vehicleData: any[] = []

function loadData() {
  if (vehicleData.length > 0) return vehicleData

  const csvPath = path.join(process.cwd(), "public/data/vehicleData.csv")
  const csv = fs.readFileSync(csvPath, "utf8")
  const parsed = Papa.parse(csv, { header: true, skipEmptyLines: true })
  vehicleData = parsed.data
  return vehicleData
}

export const getLocalVehicleDetails = (id: number) => {
  const data = loadData()
  return data.find((row) => Number(row.id) === id)
}

export const searchVehicles = (type: "ev" | "gas") => {
  const data = loadData()
  return data.filter((v) => {
    const fuel = v.fuelType1?.toLowerCase() || ""
    const isEV = fuel.includes("electric")
    return type === "ev" ? isEV : !isEV
  })
}