import { Router } from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { DestinationValidation } from './destination.validation';
import { DestinationController } from './destination.controller';
import requireAuth, { optionalAuth } from '../../middlewares/checkAuth';
import { user_role } from '../../../../generated/prisma';

const router: Router = Router();

router.post(
    '/',
    requireAuth(user_role.ADMIN, user_role.CONTENT_MANAGER),
    validateRequest(DestinationValidation.createDestinationValidationSchema),
    DestinationController.createDestination
);

router.get('/', optionalAuth(), DestinationController.getAllDestinations);

router.get('/:slug', optionalAuth(), DestinationController.getSingleDestination);

export const DestinationRoutes: Router = router;
