import { Router, Request, Response } from 'express';
import multer from 'multer';
const upload = multer({ storage: multer.memoryStorage() });
const router = Router();

import { signUp, signIn, changePassword, deleteUser, getUserById, updateUserProfile,
     forgotPassword, resetPassword, getUserProfileImage } from '../controllers/user.controller';

router.post('/signup', upload.single('profileImg'), signUp);
router.post('/signin', signIn);

router.delete('/user', deleteUser);
router.get('/user/:userId', getUserById);
router.put('/user/:userId/edit', upload.single('profileImg'), updateUserProfile);
router.get('/user/:userId/profile-image', getUserProfileImage);

router.post('/change-password', changePassword);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password/:token', resetPassword);

// Ruta para mostrar el formulario de restablecimiento de contraseña
router.get('/reset-password/:token', async (req: Request, res: Response) => {
    const { token } = req.params;
    // Renderiza la vista y pasa el token
    res.render('reset-password', { token });
  });

export default router;