export const env = {
  PORT: parseInt(process.env.PORT || "4000", 10),
  DATABASE_URL: process.env.DATABASE_URL || "",
  NODE_ENV: process.env.NODE_ENV || "development",
  CLOUDINARY_UPLOAD_URL:
    process.env.CLOUDINARY_UPLOAD_URL ||
    "https://file-service-cdal.onrender.com/api/v1/file/uploads",
};
