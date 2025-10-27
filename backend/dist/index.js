import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import http from "http";
import { databaseConnection } from "./utils/db/db.js";
import { SignalingServer } from "./ws/wsmanager.js";
import userRouter from "./routes/userRoutes.js";
import CommunityRouter from "./routes/community.js";
dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;
// Database connection
databaseConnection();
app.use(cors());
app.use(express.json());
// Health check
app.use("/health", (req, res) => {
    res.status(200).json("Server is healthy!");
});
// API routes
app.use("/api/user", userRouter);
app.use("/api/community", CommunityRouter);
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
//# sourceMappingURL=index.js.map