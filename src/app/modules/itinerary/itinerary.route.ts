import { Router } from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { ItineraryValidation } from './itinerary.validation';
import { ItineraryController } from './itinerary.controller';
import requireAuth from '../../middlewares/checkAuth';
import { user_role } from '../../../../generated/prisma';

const router: Router = Router();

router.post(
    '/',
    requireAuth(user_role.USER, user_role.ADMIN),
    validateRequest(ItineraryValidation.createItineraryValidationSchema),
    ItineraryController.createItinerary
);

router.get(
    '/my-itineraries',
    requireAuth(user_role.USER, user_role.ADMIN),
    ItineraryController.getMyItineraries
);

router.get(
    '/trending-destinations',
    ItineraryController.getTrendingDestinations
);

router.post(
    '/parse-prompt',
    requireAuth(user_role.USER, user_role.ADMIN),
    validateRequest(ItineraryValidation.parsePromptValidationSchema),
    ItineraryController.parsePrompt
);

router.get(
    '/:id',
    requireAuth(user_role.USER, user_role.ADMIN),
    ItineraryController.getSingleItinerary
);


export const ItineraryRoutes: Router = router;
