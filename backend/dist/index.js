import { SignalingServer } from "./ws/wsmanager.js";
import express from 'express';
import dotenv from 'dotenv';
dotenv.config();
import cors from 'cors';
const app = express();
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    SignalingServer.getInstance();
    console.log(`server is running on the port:http://localhost:${PORT}`);
});
//# sourceMappingURL=index.js.map