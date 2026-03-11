import { Request, Response, NextFunction } from "express";
import { CommentService } from "../services/comment.service";
import { NotFoundError } from "../lib/errors";

const commentService = new CommentService();

export class CommentController {
  async getByPhotoId(
    req: Request<{ photoId: string }>,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const comments = await commentService.findByPhotoId(req.params.photoId);
      res.json(comments);
    } catch (error) {
      next(error);
    }
  }

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const { photoId, content, author } = req.body;

      if (!photoId || !content || !String(content).trim()) {
        res.status(400).json({ error: "photoId and content are required" });
        return;
      }

      const comment = await commentService.create({
        photoId,
        content: String(content).trim(),
        author: author ? String(author).trim() : undefined,
      });

      res.status(201).json(comment);
    } catch (error) {
      if (error instanceof NotFoundError) {
        res.status(404).json({ error: error.message });
        return;
      }
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
      res.status(204).send();
    } catch (error) {
      if (error instanceof NotFoundError) {
        res.status(404).json({ error: error.message });
        return;
      }
      next(error);
    }
  }
}
