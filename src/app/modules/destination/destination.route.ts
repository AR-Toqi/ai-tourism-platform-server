import { Router } from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { DestinationValidation } from './destination.validation';
import { DestinationController } from './destination.controller';
import requireAuth from '../../middlewares/checkAuth';
import { user_role } from '../../../generated/prisma';

const router: Router = Router();

router.post(
    '/',
    requireAuth(user_role.ADMIN, user_role.CONTENT_MANAGER),
    validateRequest(DestinationValidation.createDestinationValidationSchema),
    DestinationController.createDestination
);

router.get('/', DestinationController.getAllDestinations);

router.get('/:slug', DestinationController.getSingleDestination);

export const DestinationRoutes: Router = router;
