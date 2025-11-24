import { getPrisma } from "../utils/prisma"

export default defineEventHandler(async (event) => {
    const body = await readBody(event)
    const prisma = getPrisma()

    return prisma.plant.create({
        data: body
    })
})
