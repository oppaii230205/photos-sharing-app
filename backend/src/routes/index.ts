import { Router } from "express";
import photoRoutes from "./photo.routes";
import commentRoutes from "./comment.routes";
import { ApiResponse } from "../lib/apiResponse";

const router = Router();

router.use("/photos", photoRoutes);
router.use("/comments", commentRoutes);

// Health check
router.get("/health", (_req, res) => {
  ApiResponse.ok(res, { status: "ok" }, "Service is healthy");
});

export default router;
