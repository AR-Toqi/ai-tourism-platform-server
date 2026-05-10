import { Router } from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { AIChatValidation } from './aiChat.validation';
import { AIChatController } from './aiChat.controller';
import requireAuth from '../../middlewares/checkAuth';
import { user_role } from '../../../../generated/prisma';

const router: Router = Router();

router.post(
    '/',
    requireAuth(user_role.USER, user_role.ADMIN, user_role.CONTENT_MANAGER),
    validateRequest(AIChatValidation.createChatValidationSchema),
    AIChatController.createChat
);

router.post(
    '/send',
    requireAuth(user_role.USER, user_role.ADMIN, user_role.CONTENT_MANAGER),
    validateRequest(AIChatValidation.sendMessageValidationSchema),
    AIChatController.sendMessage
);

router.get(
    '/my-chats',
    requireAuth(user_role.USER, user_role.ADMIN, user_role.CONTENT_MANAGER),
    AIChatController.getMyChats
);

router.get(
    '/:chatId/messages',
    requireAuth(user_role.USER, user_role.ADMIN, user_role.CONTENT_MANAGER),
    AIChatController.getChatMessages
);

export const AIChatRoutes: Router = router;
