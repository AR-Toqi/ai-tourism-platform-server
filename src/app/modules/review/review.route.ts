import { Router } from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { ReviewValidation } from './review.validation';
import { ReviewController } from './review.controller';
import requireAuth from '../../middlewares/checkAuth';
import { user_role } from '../../../generated/prisma';

const router: Router = Router();

router.post(
    '/',
    requireAuth(user_role.USER, user_role.ADMIN, user_role.CONTENT_MANAGER),
    validateRequest(ReviewValidation.createReviewValidationSchema),
    ReviewController.createReview
);

router.get(
    '/:destinationId',
    ReviewController.getDestinationReviews
);

router.delete(
    '/:id',
    requireAuth(user_role.USER, user_role.ADMIN, user_role.CONTENT_MANAGER),
    ReviewController.deleteReview
);

export const ReviewRoutes: Router = router;
