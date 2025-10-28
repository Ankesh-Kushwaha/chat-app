import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import http from "http";
import { databaseConnection } from "./utils/db/db.js";
import { SignalingServer } from "./ws/wsmanager.js";
import userRouter from "./routes/userRoutes.js";
import CommunityRouter from "./routes/community.js";
import path from 'path';

import type { Request, Response } from "express";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const __dirname= path.resolve();

// Database connection
databaseConnection();

app.use(cors());
app.use(express.json());

// Health check
app.use("/health", (req: Request, res: Response) => {
  res.status(200).json("Server is healthy!");
});

// API routes
app.use("/api/user", userRouter);
app.use("/api/community", CommunityRouter);

if (process.env.NODE_ENV ==="production") {
  app.use(express.static(path.join(__dirname, '../frontend/dist')));
  app.get(/.*/, (_, res) => {
    res.sendFile(path.join(__dirname, '../frontend/dist/index.html'));
  });
}

// Create HTTP server
const server = http.createServer(app);

// Attach WebSocket server to the HTTP server
SignalingServer.getInstance(server)
  .then(() => console.log("[SignalingServer] Initialized"))
  .catch((err) => console.error("SignalingServer error:", err));

// Start server
server.listen(PORT, () => {
  console.log(`Server running on port: ${PORT}`);
});
