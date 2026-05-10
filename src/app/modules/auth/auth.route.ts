import { Router } from 'express';
import { AuthController } from './auth.controller';
import requireAuth from '../../middlewares/checkAuth';

const router = Router();

router.post('/register', AuthController.register);
router.post('/login', AuthController.login);
router.post('/refresh-token', AuthController.getNewToken);
router.post('/change-password', requireAuth(), AuthController.changePassword);
router.post('/logout', AuthController.logoutUser);
router.post('/verify-email', AuthController.verifyEmail);
router.post('/forgot-password', AuthController.forgotPassword);
router.post('/reset-password', AuthController.resetPassword);

export const authRoutes: Router = router;
