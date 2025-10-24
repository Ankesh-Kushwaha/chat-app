import express from 'express';
import { userSignup, userLogin, getUserProfile, getUserFriends, deleteProfile } from '../controllers/userController.js';
const router = express.Router();
router.post('/signup', userSignup);
router.post('/login', userLogin);
router.get('/get-profile/:id', getUserProfile);
router.get('/get-friends', getUserFriends);
router.delete('/delete/:id', deleteProfile);
export default router;
//# sourceMappingURL=userRoutes.js.map