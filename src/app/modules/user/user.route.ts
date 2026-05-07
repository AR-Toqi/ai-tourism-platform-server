import { Router } from 'express';
import { UserController } from './user.controller';
import requireAuth from '../../middlewares/checkAuth';
import validateRequest from '../../middlewares/validateRequest';
import { UserValidation } from './user.validation';

const router = Router();

router.get(
  '/me',
  requireAuth(),
  UserController.getMe
);

router.patch(
  '/me',
  requireAuth(),
  validateRequest(UserValidation.updateProfileZodSchema),
  UserController.updateMyProfile
);

router.delete(
  '/me',
  requireAuth(),
  UserController.deleteMe
);

export const userRoutes: Router = router;
