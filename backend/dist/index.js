import { SignalingServer } from "./ws/wsmanager.js";
import express from 'express';
import dotenv from 'dotenv';
dotenv.config();
import cors from 'cors';
import { databaseConnection } from "./utils/db/db.js";
const app = express();
const PORT = process.env.PORT || 3000;
import userRouter from './routes/userRoutes.js';
databaseConnection();
app.use(cors());
app.use(express.json());
app.use('/api/user', userRouter);
app.listen(PORT, () => {
    SignalingServer.getInstance();
    console.log(`server is running on the port:http://localhost:${PORT}`);
});
//# sourceMappingURL=index.js.map