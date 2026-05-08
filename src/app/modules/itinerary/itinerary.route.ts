import { Router } from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { ItineraryValidation } from './itinerary.validation';
import { ItineraryController } from './itinerary.controller';
import requireAuth from '../../middlewares/checkAuth';
import { user_role } from '../../../generated/prisma';

const router: Router = Router();

router.post(
    '/',
    requireAuth(user_role.USER, user_role.ADMIN, user_role.CONTENT_MANAGER),
    validateRequest(ItineraryValidation.createItineraryValidationSchema),
    ItineraryController.createItinerary
);

router.get(
    '/my-itineraries',
    requireAuth(user_role.USER, user_role.ADMIN, user_role.CONTENT_MANAGER),
    ItineraryController.getMyItineraries
);

router.get(
    '/:id',
    requireAuth(user_role.USER, user_role.ADMIN, user_role.CONTENT_MANAGER),
    ItineraryController.getSingleItinerary
);

export const ItineraryRoutes: Router = router;
