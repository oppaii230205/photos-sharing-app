import prisma from "../lib/prisma";

interface CreateCommentInput {
  photoId: string;
  content: string;
  author?: string;
}

export class CommentService {
  async create(data: CreateCommentInput) {
    // TODO: Implement with Prisma
    return prisma.comment.create({
      data: {
        content: data.content,
        author: data.author || "Anonymous",
        photoId: data.photoId,
      },
    });
  }

  async delete(id: string) {
    // TODO: Implement with Prisma
    return prisma.comment.delete({
      where: { id },
    });
  }
}
