import { promises as fs } from "node:fs";
import path from "node:path";
import { getUserId } from "~~/server/utils/auth";
import { validateFile, sanitizeFilename } from "~~/server/utils/upload";
import { ImageService } from "~~/server/utils/services/image";
import { PlantService } from "~~/server/utils/services/plant";

export default defineEventHandler(async (event) => {
  const userId = getUserId(event);
  const plantIdParam = getRouterParam(event, "id");
  const plantId = plantIdParam ? parseInt(plantIdParam) : null;

  if (!plantId || isNaN(plantId)) {
    throw createError({ statusCode: 400, statusMessage: "Valid Plant ID is required" });
  }

  const plant = await PlantService.findById(plantId, userId);
  if (!plant) {
    throw createError({ statusCode: 404, statusMessage: "Plant not found or not authorized" });
  }

  const form = await readMultipartFormData(event);
  if (!form || !form.length) {
    throw createError({ statusCode: 400, statusMessage: "No file uploaded" });
  }

  const file = form.find((f) => f.name === "file" || f.filename);
  if (!file || !file.data || !file.filename) {
    throw createError({ statusCode: 400, statusMessage: "Invalid file upload" });
  }

  validateFile(file);

  const config = useRuntimeConfig();
  const uploadDir = path.resolve(process.cwd(), config.upload.path);

  try {
    await fs.mkdir(uploadDir, { recursive: true });
  } catch {}

  const filename = sanitizeFilename(file.filename);
  const filePath = path.join(uploadDir, filename);

  await fs.writeFile(filePath, file.data as Buffer);

  // URL should be relative to public
  const publicDir = path.resolve(process.cwd(), "public");
  const url = "/" + path.relative(publicDir, filePath).replace(/\\/g, "/");

  const caption = form.find((f) => f.name === "caption")?.data.toString();

  const image = await ImageService.create({
    plantId,
    userId,
    filename,
    url,
    caption,
  });

  return image;
});
