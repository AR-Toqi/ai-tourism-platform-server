import { Router } from 'express';
import requireAuth from '../../middlewares/checkAuth';
import { user_role } from '../../../../generated/prisma';
import validateRequest from '../../middlewares/validateRequest';
import { AdminValidation } from './admin.validation';
import { AdminController } from './admin.controller';

const router: Router = Router();

// Dashboard
router.get(
    '/dashboard-stats',
    requireAuth(user_role.ADMIN),
    AdminController.getDashboardStats
);

// Admin Profile Self-Management
router.put(
    '/profile',
    requireAuth(user_role.ADMIN),
    validateRequest(AdminValidation.updateAdminProfileValidationSchema),
    AdminController.updateAdminProfile
);

// User Management & Moderation
router.get(
    '/users/normal',
    requireAuth(user_role.ADMIN),
    AdminController.getNormalUsers
);

router.get(
    '/users/content-managers',
    requireAuth(user_role.ADMIN),
    AdminController.getContentManagers
);

router.put(
    '/users/:id/status',
    requireAuth(user_role.ADMIN),
    validateRequest(AdminValidation.updateStatusValidationSchema),
    AdminController.changeUserStatus
);

router.put(
    '/users/:id/role',
    requireAuth(user_role.ADMIN),
    validateRequest(AdminValidation.updateRoleValidationSchema),
    AdminController.changeUserRole
);

router.delete(
    '/users/:id',
    requireAuth(user_role.ADMIN),
    AdminController.softDeleteUser
);

// Platform Oversight (Itineraries)
router.get(
    '/itineraries',
    requireAuth(user_role.ADMIN),
    AdminController.getAllItineraries
);

router.get(
    '/itineraries/:id',
    requireAuth(user_role.ADMIN),
    AdminController.getItineraryById
);

router.get(
    '/reviews',
    requireAuth(user_role.ADMIN),
    AdminController.getAllReviews
);

export const AdminRoutes: Router = router;
