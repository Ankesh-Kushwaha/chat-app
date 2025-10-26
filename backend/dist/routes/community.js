import express from 'express';
import { authenticate } from '../middlewares/auth.js';
import { createCommunity, DeleteCommunity, GetALLCommunity, GetALLCommunityUser, GetSingleCommunity, JoinACommunity, LeaveCommunity } from '../controllers/community.js';
const router = express.Router();
router.use(authenticate);
router.post('/create', createCommunity);
router.delete('/delete/:communityId', DeleteCommunity);
router.get('/get/all', GetALLCommunity);
router.get('/get-all-user', GetALLCommunityUser);
router.get('/get/:communityId', GetSingleCommunity);
router.post('/leave', LeaveCommunity);
router.post('/join', JoinACommunity);
export default router;
//# sourceMappingURL=community.js.map