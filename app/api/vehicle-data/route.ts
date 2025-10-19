import { NextResponse } from "next/server"
import path from "path"
import fs from "fs"
import Papa from "papaparse"

export const dynamic = "force-dynamic"

export async function GET() {
  const csvPath = path.join(process.cwd(), "public/vehicleData.csv")
  const file = fs.readFileSync(csvPath, "utf8")
  const parsed = Papa.parse(file, { header: true, skipEmptyLines: true })
  return NextResponse.json(parsed.data)
}
