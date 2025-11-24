import { getPrisma } from "../../utils/prisma"

export default defineEventHandler(async (event) => {
    const plantId = Number(event.context.params!.plant_id)
    const prisma = getPrisma()

    return prisma.sensorData.findMany({
        where: { plant_id: plantId },
        orderBy: { timestamp: "desc" }
    })
})
