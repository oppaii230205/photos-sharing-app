import { PrismaClient } from "@prisma/client";
import prisma from "../lib/prisma";

interface CreatePhotoInput {
  filename: string;
  originalName: string;
  url: string;
  caption?: string;
}

export class PhotoService {
  async findAll() {
    // TODO: Implement with Prisma - include comments, order by newest
    return prisma.photo.findMany({
      include: { comments: true },
      orderBy: { createdAt: "desc" },
    });
  }

  async findById(id: string) {
    // TODO: Implement with Prisma
    return prisma.photo.findUnique({
      where: { id },
      include: { comments: { orderBy: { createdAt: "desc" } } },
    });
  }

  async create(data: CreatePhotoInput) {
    // TODO: Implement with Prisma
    return prisma.photo.create({
      data: {
        filename: data.filename,
        originalName: data.originalName,
        url: data.url,
        caption: data.caption,
      },
    });
  }

  async delete(id: string) {
    // TODO: Implement with Prisma - also delete associated comments
    return prisma.photo.delete({
      where: { id },
    });
  }
}
