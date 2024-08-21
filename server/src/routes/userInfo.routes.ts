import { Router } from 'express';
import { createUserInfo, getUserInfo, updateUserInfo } from '../controllers/userInfo.controller';
import multer from 'multer';

const upload = multer({ storage: multer.memoryStorage() });
const router = Router();

router.post('/user/info', upload.single('firma'), createUserInfo);
router.get('/user/info/:userId', getUserInfo);
router.put('/user/info/:userId/edit', updateUserInfo);

export default router;