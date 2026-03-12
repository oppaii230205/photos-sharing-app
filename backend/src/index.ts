import dotenv from "dotenv";
dotenv.config();

import app from "./app";
import { env } from "./config";
import prisma from "./lib/prisma";

const PORT = env.PORT;

const server = app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

// Graceful shutdown: close DB connections before exiting
const shutdown = async () => {
  console.log("\nShutting down gracefully…");
  server.close(() => {
    console.log("HTTP server closed");
  });
  await prisma.$disconnect();
  console.log("Database connection closed");
  process.exit(0);
};

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
