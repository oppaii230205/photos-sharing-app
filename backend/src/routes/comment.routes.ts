import { Router } from "express";
import { CommentController } from "../controllers/comment.controller";

const router = Router();
const commentController = new CommentController();

// GET /api/v1/comments/photo/:photoId - Get all comments for a photo
router.get("/photo/:photoId", commentController.getByPhotoId);

// POST /api/v1/comments - Add a comment to a photo
router.post("/", commentController.create);

// DELETE /api/v1/comments/:id - Delete a comment
router.delete("/:id", commentController.delete);

export default router;
