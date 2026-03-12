import { Request, Response } from "express";
import { CommentService } from "../services/comment.service";
import { ApiResponse } from "../lib/apiResponse";
import { catchAsync } from "../lib/catchAsync";
import { BadRequestError } from "../lib/errors";

const commentService = new CommentService();

export class CommentController {
  getByPhotoId = catchAsync<{ photoId: string }>(async (req, res) => {
    const comments = await commentService.findByPhotoId(req.params.photoId);
    ApiResponse.ok(res, comments, "Comments retrieved successfully");
  });

  create = catchAsync(async (req: Request, res: Response) => {
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
  });

  delete = catchAsync<{ id: string }>(async (req, res) => {
    await commentService.delete(req.params.id);
    ApiResponse.noContent(res);
  });
}
