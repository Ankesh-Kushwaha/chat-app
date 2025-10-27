import { SignalingServer } from "./ws/wsmanager.js";
import express from 'express';
import dotenv from 'dotenv';
dotenv.config();
import cors from 'cors';
import { databaseConnection } from "./utils/db/db.js";
const app = express();
const PORT = process.env.PORT || 3000;
import userRouter from './routes/userRoutes.js';
import CommunityRouter from './routes/community.js';
databaseConnection();
app.use(cors());
app.use(express.json());
app.use('/heath', (req, res) => {
    res.status(200).json("Hey! Dude server is fucking  healthy!");
});
app.use('/api/user', userRouter);
app.use('/api/community', CommunityRouter);
app.listen(PORT, () => {
    SignalingServer.getInstance();
    console.log(`server is running on the port:http://localhost:${PORT}`);
});
//# sourceMappingURL=index.js.map