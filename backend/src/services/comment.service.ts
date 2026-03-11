import { Prisma } from "@prisma/client";
import prisma from "../lib/prisma";
import { NotFoundError } from "../lib/errors";

interface CreateCommentInput {
  photoId: string;
  content: string;
  author?: string;
}

export class CommentService {
  /**
   * Get all comments for a specific photo, ordered chronologically.
   */
  async findByPhotoId(photoId: string) {
    return prisma.comment.findMany({
      where: { photoId },
      orderBy: { createdAt: "asc" },
    });
  }

  /**
   * Create a comment on a photo.
   * Validates that the referenced photo exists before inserting.
   */
  async create(data: CreateCommentInput) {
    const photo = await prisma.photo.findUnique({
      where: { id: data.photoId },
      select: { id: true },
    });

    if (!photo) {
      throw new NotFoundError(`Photo with id "${data.photoId}" not found`);
    }

    return prisma.comment.create({
      data: {
        content: data.content,
        author: data.author || "Anonymous",
        photoId: data.photoId,
      },
    });
  }

  /**
   * Delete a comment by id.
   * Throws NotFoundError if the comment doesn't exist.
   */
  async delete(id: string) {
    try {
      return await prisma.comment.delete({
        where: { id },
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === "P2025"
      ) {
        throw new NotFoundError(`Comment with id "${id}" not found`);
      }
      throw error;
    }
  }
}

export { NotFoundError };
