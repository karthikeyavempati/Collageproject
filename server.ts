import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";
import { createApp } from "./src/api/app.js";

dotenv.config();

const PORT = process.env.PORT ? Number(process.env.PORT) : 3000;

async function startServer() {
  const app = express();

  // Mount all /api/* routes from the shared app used by the Vercel function.
  app.use(createApp());

  // --- VITE MIDDLEWARE / PRODUCTION SERVING ---
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`PM Internship Scheme Backend Server running on http://0.0.0.0:${PORT}`);
    console.log(`AI model: ${process.env.GEMMA_MODEL || "gemma-4-31b-it"}`);
  });
}

startServer().catch((err) => {
  console.error("Failed to start server:", err);
});
