import { prisma } from '~/lib/prisma'

export default defineEventHandler(async (event) => {
    const method = event.method

    if (method === 'GET') {
        try {
            return await prisma.plant.findMany({
                include: {
                    sensorData: true
                }
            })
        } catch (err) {
            console.error('Error fetching plants', err)
            throw createError({
                statusCode: 500,
                statusMessage: 'Failed to fetch plants'
            })
        }
    }

    if (method === 'POST') {
        try {
            const body = await readBody(event)
            return await prisma.plant.create({
                data: body
            })
        } catch (err) {
            console.error('Error creating plant', err)
            throw createError({
                statusCode: 500,
                statusMessage: 'Failed to create plant'
            })
        }
    }
})