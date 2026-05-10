import { Router } from 'express';
import { ContentManagerController } from './content-manager.controller';
import { ContentManagerValidation } from './content-manager.validation';
import validateRequest from '../../middlewares/validateRequest';
import requireAuth from '../../middlewares/checkAuth';
import { user_role } from '../../../../generated/prisma';
import { upload } from '../../utils/multer';

const router: Router = Router();

// Ensure all routes are protected by CONTENT_MANAGER (or ADMIN) role
router.use(requireAuth(user_role.CONTENT_MANAGER, user_role.ADMIN));

// Update destination text details
router.patch(
    '/destinations/:id',
    validateRequest(ContentManagerValidation.updateDestinationValidationSchema),
    ContentManagerController.updateDestinationDetails
);

// Update destination cover image
router.patch(
    '/destinations/:id/cover',
    upload.single('coverImage'),
    ContentManagerController.updateDestinationCoverImage
);

// Add destination gallery images
router.post(
    '/destinations/:id/images',
    upload.array('images', 10), // Allow up to 10 images at once
    ContentManagerController.addDestinationImages
);

// Update specific gallery image (file + optional metadata)
router.patch(
    '/destinations/images/:imageId',
    upload.single('image'),
    // Note: since it's multipart/form-data, we might need a custom parser or just let multer parse body
    // validateRequest won't work easily out of the box with multipart if fields are json strings,
    // but simple text fields can be validated.
    // validateRequest(ContentManagerValidation.updateDestinationImageValidationSchema),
    ContentManagerController.updateDestinationGalleryImage
);

// Delete specific gallery image
router.delete(
    '/destinations/images/:imageId',
    ContentManagerController.deleteDestinationGalleryImage
);

export const ContentManagerRoutes: Router = router;
