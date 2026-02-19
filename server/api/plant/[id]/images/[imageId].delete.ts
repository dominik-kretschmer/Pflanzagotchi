import { promises as fs } from "node:fs";
import path from "node:path";
import { getUserId } from "~~/server/utils/auth";
import { ImageService } from "~~/server/utils/services/image";

export default defineEventHandler(async (event) => {
  const userId = getUserId(event);
  const imageIdParam = getRouterParam(event, "imageId");
  const imageId = imageIdParam ? parseInt(imageIdParam) : null;

  if (!imageId || isNaN(imageId)) {
    throw createError({ statusCode: 400, statusMessage: "Valid Image ID is required" });
  }

  const image = await ImageService.findById(imageId);
  if (!image || image.userId !== userId) {
    throw createError({ statusCode: 404, statusMessage: "Image not found or not authorized" });
  }

  // Delete physical file
  const config = useRuntimeConfig();
  const filePath = path.resolve(process.cwd(), config.upload.path, image.filename);
  
  try {
    await fs.unlink(filePath);
  } catch (err) {
    console.error(`Failed to delete file ${filePath}`, err);
    // Continue deleting DB record even if file is missing
  }

  await ImageService.delete(imageId, userId);

  return { success: true };
});
