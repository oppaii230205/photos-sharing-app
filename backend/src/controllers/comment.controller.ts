import { Request, Response, NextFunction } from "express";
import { CommentService } from "../services/comment.service";

const commentService = new CommentService();

export class CommentController {
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const { photoId, content, author } = req.body;

      if (!photoId || !content) {
        res.status(400).json({ error: "photoId and content are required" });
        return;
      }

      const comment = await commentService.create({ photoId, content, author });
      res.status(201).json(comment);
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
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
}
