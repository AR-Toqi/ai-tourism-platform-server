import { Router } from 'express';
import { UserController } from './user.controller';
import requireAuth from '../../middlewares/checkAuth';
import validateRequest from '../../middlewares/validateRequest';
import { UserValidation } from './user.validation';
import { upload } from '../../utils/multer';

const router = Router();

router.get(
  '/me',
  requireAuth(),
  UserController.getMe
);

router.get(
  '/stats',
  requireAuth(),
  UserController.getStats
);


router.patch(
  '/me',
  requireAuth(),
  upload.single('image'),
  validateRequest(UserValidation.updateProfileZodSchema),
  UserController.updateMyProfile
);

router.delete(
  '/me',
  requireAuth(),
  UserController.deleteMe
);

export const userRoutes: Router = router;
