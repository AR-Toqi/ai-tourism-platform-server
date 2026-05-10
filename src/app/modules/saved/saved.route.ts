import { Router } from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { SavedValidation } from './saved.validation';
import { SavedController } from './saved.controller';
import requireAuth from '../../middlewares/checkAuth';
import { user_role } from '../../../../generated/prisma';

const router: Router = Router();

router.post(
    '/destination',
    requireAuth(user_role.USER),
    validateRequest(SavedValidation.toggleSavedDestinationValidationSchema),
    SavedController.toggleSavedDestination
);

router.post(
    '/itinerary',
    requireAuth(user_role.USER),
    validateRequest(SavedValidation.toggleSavedItineraryValidationSchema),
    SavedController.toggleSavedItinerary
);

router.get(
    '/',
    requireAuth(user_role.USER),
    SavedController.getMySavedItems
);

export const SavedRoutes: Router = router;
