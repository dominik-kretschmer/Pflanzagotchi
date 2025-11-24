import { getPrisma } from "../../utils/prisma"

export default defineEventHandler(async (event) => {
    const id = Number(event.context.params!.id)
    const body = await readBody(event)
    const prisma = getPrisma()

    return prisma.plant.update({
        where: { id },
        data: body
    })
})
