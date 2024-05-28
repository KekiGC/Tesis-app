import { Router } from 'express';
const router = Router();

import { signUp, signIn, changePassword, deleteUser, getUserById } from '../controllers/user.controller';

router.post('/signup', signUp);
router.post('/signin', signIn);
router.post('/change-password', changePassword);
router.delete('/delete-user', deleteUser);
router.get('/user/:userId', getUserById);

export default router;