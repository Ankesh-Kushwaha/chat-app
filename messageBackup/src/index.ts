import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectToDataBase from './config.js';
import chatHistoryRouter from './route.js';
import { main } from './worker.js';

dotenv.config();

const PORT = process.env.PORT || 3001;

const app = express();

app.use(express.json());
app.use(cors());

await connectToDataBase();

app.get('/health', (req, res) => {
  res.status(200).json('server is healthy ✅');
});

app.use('/chat', chatHistoryRouter);
//main().catch((err) => console.error('Worker startup error:', err));

app.listen(PORT, () => {
  console.log(`✅ API server is running on port ${PORT}`);
});
