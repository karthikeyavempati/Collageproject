import dotenv from "dotenv";
dotenv.config();

import { createApp } from "../src/api/app.js";

// Vercel's Node.js runtime accepts a plain (req, res) handler.
// An Express app instance IS such a handler, so we can export it directly -
// no need for extra adapters like serverless-http.
const app = createApp();

export default app;
