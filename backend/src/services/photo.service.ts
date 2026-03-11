import prisma from "../lib/prisma";
import { uploadToCloudinary } from "./cloudinary.service";

interface CreatePhotoInput {
  file: Express.Multer.File;
  caption?: string;
}

export class PhotoService {
  async findAll() {
    return prisma.photo.findMany({
      include: {
        comments: {
          orderBy: { createdAt: "asc" },
        },
      },
      orderBy: { createdAt: "desc" },
    });
  }

  async findById(id: string) {
    return prisma.photo.findUnique({
      where: { id },
      include: {
        comments: {
          orderBy: { createdAt: "asc" },
        },
      },
    });
  }

  async create(data: CreatePhotoInput) {
    const imageUrl = await uploadToCloudinary(data.file);

    return prisma.photo.create({
      data: {
        originalName: data.file.originalname,
        url: imageUrl,
        caption: data.caption,
      },
      include: { comments: true },
    });
  }

  async delete(id: string) {
    return prisma.photo.delete({
      where: { id },
    });
  }
}
