import FormData from "form-data";
import { env } from "../config";
import { CloudinaryUploadResponse } from "../types";

/**
 * Uploads an image file buffer to the Cloudinary proxy service.
 * Returns the public Cloudinary image URL.
 */
export async function uploadToCloudinary(
  file: Express.Multer.File,
): Promise<string> {
  const form = new FormData();
  form.append("id", Date.now().toString());
  form.append("image", file.buffer, {
    filename: file.originalname,
    contentType: file.mimetype,
  });

  const response = await fetch(env.CLOUDINARY_UPLOAD_URL, {
    method: "POST",
    body: form as any,
    headers: form.getHeaders(),
  });

  if (!response.ok) {
    throw new Error(`Cloudinary upload failed with status ${response.status}`);
  }

  const data = (await response.json()) as CloudinaryUploadResponse;

  if (data.code !== 1000) {
    throw new Error(`Cloudinary upload error: ${data.message}`);
  }

  return data.result.image;
}
