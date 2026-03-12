import { Prisma } from "@prisma/client";
import prisma from "../lib/prisma";
import { uploadToCloudinary } from "./cloudinary.service";
import { NotFoundError } from "../lib/errors";
import { PaginationQuery, PaginatedResult, paginate } from "../lib/pagination";
import { CreatePhotoInput } from "../types";

export class PhotoService {
  async findAll(query: PaginationQuery): Promise<PaginatedResult<any>> {
    const [photos, totalItems] = await Promise.all([
      prisma.photo.findMany({
        include: {
          _count: { select: { comments: true } },
        },
        orderBy: { createdAt: "desc" },
        skip: query.skip,
        take: query.limit,
      }),
      prisma.photo.count(),
    ]);

    return paginate(photos, totalItems, query);
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
    try {
      return await prisma.photo.delete({
        where: { id },
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === "P2025"
      ) {
        throw new NotFoundError(`Photo with id "${id}" not found`);
      }
      throw error;
    }
  }
}
