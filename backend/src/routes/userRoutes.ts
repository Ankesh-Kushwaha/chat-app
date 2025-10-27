import express, { application } from 'express';
import { userSignup ,userLogin, getUserProfile, getUserFriends, deleteProfile, sendFriendRequest, acceptFriendRequest, declineArequest, getAllPendingRequest, updateProfile, getAllUser} from '../controllers/userController.js';
import { authenticate } from '../middlewares/auth.js';

const router = express.Router();

router.post('/signup',userSignup);
router.post('/login', userLogin);
router.use(authenticate);
router.get('/get-profile/:userId',getUserProfile);
router.get('/get-friends', getUserFriends);
router.get('/all', getAllUser);
router.delete('/delete/:userId', deleteProfile);
router.put('/update/:userId',updateProfile)
router.post('/send/friend-request', sendFriendRequest);
router.post('/accept/friend-request', acceptFriendRequest);
router.post('/decline/friend-request', declineArequest);
router.get('/get-all-pending-request', getAllPendingRequest);

export default router;