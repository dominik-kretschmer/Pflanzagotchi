/*

export default defineEventHandler(async (event) => {
    console.log("penos")
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
})

*/
