import express from "express";
import cors from "cors";
import morgan from "morgan";
import { errorHandler } from "./middleware/errorHandler";
import { notFoundHandler } from "./middleware/notFoundHandler";
import routes from "./routes";
import { env } from "./config";

const app = express();

// Middleware
app.use(cors());
app.use(morgan(env.NODE_ENV === "production" ? "combined" : "dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API Routes
app.use("/api/v1", routes);

// Catch-all for undefined routes (must be after all routes)
app.use(notFoundHandler);

// Error handling middleware (must be last)
app.use(errorHandler);

export default app;
