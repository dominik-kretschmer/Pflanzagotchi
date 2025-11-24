import { getPrisma } from "../utils/prisma"

export default defineEventHandler(async () => {
    const prisma = getPrisma()

    return prisma.sensorData.findMany({
        orderBy: { timestamp: "desc" },
        include: {
            plant: true
        }
    })
})
