import express from 'express';
import { getRoomMessageHistory } from './model/controllers.js';
const router = express.Router();
router.get('/chathistory/:roomId', getRoomMessageHistory);
export default router;
//# sourceMappingURL=route.js.map