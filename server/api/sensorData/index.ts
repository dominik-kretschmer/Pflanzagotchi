import { prisma } from '~~/lib/prisma'

export default defineEventHandler(async (event) => {
    const method = event.method

    if (method === 'GET') {
        try {
            return await prisma.sensorData.findMany({
                include: {
                    plant: true
                }
            })
        } catch (err) {
            console.error('Error fetching sensor data', err)
            throw createError({
                statusCode: 500,
                statusMessage: 'Failed to fetch sensor data'
            })
        }
    }

    if (method === 'POST') {
        try {
            const body = await readBody(event)
            return await prisma.sensorData.create({
                data: body
            })
        } catch (err) {
            console.error('Error creating sensor data', err)
            throw createError({
                statusCode: 500,
                statusMessage: 'Failed to create sensor data'
            })
        }
    }
})
