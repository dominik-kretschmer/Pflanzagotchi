import { prisma } from "~~/lib/prisma";

export const SensorDataService = {
  async findAll() {
    return await prisma.sensorData.findMany({
      include: {
        plant: true,
      },
    });
  },

  async create(data: any) {
    return await prisma.sensorData.create({
      data,
    });
  },

  async findById(id: number) {
    return await prisma.sensorData.findUnique({
      where: { sensor_data_id: id },
      include: {
        plant: true,
      },
    });
  },

  async update(id: number, data: any) {
    return await prisma.sensorData.update({
      where: { sensor_data_id: id },
      data,
    });
  },

  async delete(id: number) {
    return await prisma.sensorData.delete({
      where: { sensor_data_id: id },
    });
  },
};
