import { Router } from "express";
import photoRoutes from "./photo.routes";
import commentRoutes from "./comment.routes";

const router = Router();

router.use("/photos", photoRoutes);
router.use("/comments", commentRoutes);

// Health check
router.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

export default router;
