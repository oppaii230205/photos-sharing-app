import { Router } from "express";
import { CommentController } from "../controllers/comment.controller";

const router = Router();
const commentController = new CommentController();

// POST /api/comments - Add a comment to a photo
router.post("/", commentController.create);

// DELETE /api/comments/:id - Delete a comment
router.delete("/:id", commentController.delete);

export default router;
