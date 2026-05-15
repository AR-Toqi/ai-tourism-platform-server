import { Router } from 'express';
import { userRoutes } from '../modules/user/user.route';
import { authRoutes } from '../modules/auth/auth.route';
import { DestinationRoutes } from '../modules/destination/destination.route';
import { ItineraryRoutes } from '../modules/itinerary/itinerary.route';
import { ReviewRoutes } from '../modules/review/review.route';
import { SavedRoutes } from '../modules/saved/saved.route';
import { AIChatRoutes } from '../modules/aiChat/aiChat.route';
import { AdminRoutes } from '../modules/admin/admin.route';
import { ContentManagerRoutes } from '../modules/content-manager/content-manager.route';
import { strictRateLimiter } from '../middlewares/rateLimiter';

const router: Router = Router();

const moduleRoutes = [
  { path: '/admin', route: AdminRoutes },
  { path: '/auth', route: authRoutes, middleware: strictRateLimiter },
  { path: '/users', route: userRoutes },
  { path: '/destinations', route: DestinationRoutes },
  { path: '/itineraries', route: ItineraryRoutes },
  { path: '/reviews', route: ReviewRoutes },
  { path: '/saved', route: SavedRoutes },
  { path: '/ai-chat', route: AIChatRoutes, middleware: strictRateLimiter },
  { path: '/content-manager', route: ContentManagerRoutes },
];

moduleRoutes.forEach((route) => {
  if (route.middleware) {
    router.use(route.path, route.middleware, route.route);
  } else {
    router.use(route.path, route.route);
  }
});

export default router;
