import { getPrisma } from "../utils/prisma"

export default defineEventHandler(async () => {
    const prisma = getPrisma()
    return prisma.plant.findMany({
        include: {
            sensorData: true
        }
    })
})
