import { prisma } from '~~/lib/prisma'

export default defineEventHandler(async (event) => {
    const idParam = getRouterParam(event, 'id')
    const id = idParam ? parseInt(idParam) : null
    const method = event.method

    if (!id || isNaN(id)) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Valid ID is required'
        })
    }

    try {
        if (method === 'GET') {
            const sensorData = await prisma.sensorData.findUnique({
                where: { sensor_data_id: id },
                include: {
                    plant: true
                }
            })

            if (!sensorData) {
                throw createError({ statusCode: 404, statusMessage: 'Sensor data not found' })
            }

            return sensorData
        }

        if (method === 'PUT' || method === 'PATCH') {
            const body = await readBody(event)
            return await prisma.sensorData.update({
                where: { sensor_data_id: id },
                data: body
            })
        }

        if (method === 'DELETE') {
            return await prisma.sensorData.delete({
                where: { sensor_data_id: id }
            })
        }
    } catch (err: any) {
        if (err.code === 'P2025') {
            throw createError({ statusCode: 404, statusMessage: 'Sensor data not found' })
        }

        console.error(`Error handling sensor data operation [${method}]`, err)
        throw createError({
            statusCode: 500,
            statusMessage: 'Internal Server Error'
        })
    }
})
