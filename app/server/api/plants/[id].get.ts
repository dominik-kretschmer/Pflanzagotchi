import { getPrisma } from "../../utils/prisma"

export default defineEventHandler(async (event) => {
    const id = Number(event.context.params!.id)
    const prisma = getPrisma()

    return prisma.plant.findUnique({
        where: { id },
        include: { sensorData: true }
    })
})
