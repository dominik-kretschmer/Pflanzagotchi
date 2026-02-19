import path from "node:path";

export const ALLOWED_MIME_TYPES = ["image/jpeg", "image/png", "image/webp"];

export function validateFile(file: { type?: string; data: Buffer }) {
  const config = useRuntimeConfig();
  const { maxSize } = config.upload;

  if (file.type && !ALLOWED_MIME_TYPES.includes(file.type)) {
    throw createError({
      statusCode: 400,
      statusMessage: "Invalid file type. Allowed types: JPEG, PNG, WebP",
    });
  }

  if (file.data.length > maxSize) {
    throw createError({
      statusCode: 400,
      statusMessage: `File too large. Maximum size is ${maxSize / (1024 * 1024)}MB`,
    });
  }
}

export function sanitizeFilename(filename: string): string {
  const ext = path.extname(filename);
  const base = path.basename(filename, ext);
  const safeBase = base.replace(/[^a-z0-9_-]/gi, "_").toLowerCase();
  const unique = `${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
  return `${unique}_${safeBase}${ext}`;
}
