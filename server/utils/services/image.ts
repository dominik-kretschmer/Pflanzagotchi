import { prisma } from "~~/lib/prisma";

export const ImageService = {
  async findByPlantId(plantId: number) {
    return await prisma.plantImage.findMany({
      where: { plantId },
      orderBy: { uploadedAt: "desc" },
    });
  },

  async findById(id: number) {
    return await prisma.plantImage.findUnique({
      where: { id },
    });
  },

  async create(data: {
    plantId: number;
    userId: number;
    filename: string;
    url: string;
    caption?: string;
  }) {
    return await prisma.plantImage.create({
      data,
    });
  },

  async delete(id: number, userId: number) {
    // Note: Caller is responsible for deleting the physical file
    return await prisma.plantImage.delete({
      where: { id, userId },
    });
  },
};
