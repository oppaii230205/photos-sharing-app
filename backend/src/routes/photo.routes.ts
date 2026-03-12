import { Router } from "express";
import { PhotoController } from "../controllers/photo.controller";
import { upload } from "../middleware/upload";

const router = Router();
const photoController = new PhotoController();

// GET /api/v1/photos - Get all photos with comments
router.get("/", photoController.getAll);

// GET /api/v1/photos/:id - Get a single photo with comments
router.get("/:id", photoController.getById);

// POST /api/v1/photos - Upload a new photo
router.post("/", upload.single("photo"), photoController.create);

// DELETE /api/v1/photos/:id - Delete a photo
router.delete("/:id", photoController.delete);

export default router;
