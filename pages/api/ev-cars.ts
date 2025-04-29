import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export default async function handler(req, res) {
  if (req.method === "GET") {
    try {
      const evCars = await prisma.eV_Car.findMany({
        orderBy: { createdAt: "desc" },
      })

      res.status(200).json(evCars)
    } catch (error) {
      console.error("Error fetching EV cars:", error)
      res.status(500).json({ error: "Internal server error" })
    }
  } else {
    res.status(405).json({ error: "Method not allowed" })
  }
}