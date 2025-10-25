import express from 'express';
import { userSignup, userLogin, getUserProfile, getUserFriends, deleteProfile, sendFriendRequest, acceptFriendRequest, declineArequest, getAllPendingRequest, updateProfile } from '../controllers/userController.js';
import { validate } from '../utils/zod/zodVerification.js';
const router = express.Router();
router.post('/signup', userSignup);
router.post('/login', userLogin);
router.get('/get-profile/:userId', getUserProfile);
router.get('/get-friends', getUserFriends);
router.delete('/delete/:userId', deleteProfile);
router.put('/update/:userId', updateProfile);
router.post('/send/friend-request', sendFriendRequest);
router.post('/accept/friend-request', acceptFriendRequest);
router.post('/decline/friend-request', declineArequest);
router.get('/get-all-pending-request', getAllPendingRequest);
export default router;
//# sourceMappingURL=userRoutes.js.map