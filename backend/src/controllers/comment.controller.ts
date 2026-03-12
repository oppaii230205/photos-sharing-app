import { Request, Response, NextFunction } from "express";
import { CommentService } from "../services/comment.service";
import { ApiResponse } from "../lib/apiResponse";
import { BadRequestError, NotFoundError } from "../lib/errors";

const commentService = new CommentService();

export class CommentController {
  async getByPhotoId(
    req: Request<{ photoId: string }>,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const comments = await commentService.findByPhotoId(req.params.photoId);
      ApiResponse.ok(res, comments, "Comments retrieved successfully");
    } catch (error) {
      next(error);
    }
  }

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const { photoId, content, author } = req.body;

      if (!photoId || !content || !String(content).trim()) {
        throw new BadRequestError("photoId and content are required");
      }

      const comment = await commentService.create({
        photoId,
        content: String(content).trim(),
        author: author ? String(author).trim() : undefined,
      });

      ApiResponse.created(res, comment, "Comment added successfully");
    } catch (error) {
      next(error);
    }
  }

  async delete(
    req: Request<{ id: string }>,
    res: Response,
    next: NextFunction,
  ) {
    try {
      await commentService.delete(req.params.id);
      ApiResponse.noContent(res);
    } catch (error) {
      next(error);
    }
  }
}
