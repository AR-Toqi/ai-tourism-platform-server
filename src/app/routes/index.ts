import { Router } from 'express';
import { userRoutes } from '../modules/user/user.route';
import { authRoutes } from '../modules/auth/auth.route';
import { DestinationRoutes } from '../modules/destination/destination.route';
import { ItineraryRoutes } from '../modules/itinerary/itinerary.route';
import { ReviewRoutes } from '../modules/review/review.route';
import { SavedRoutes } from '../modules/saved/saved.route';
import { AIChatRoutes } from '../modules/aiChat/aiChat.route';

const router: Router = Router();

const moduleRoutes = [
  { path: '/auth', route: authRoutes },
  { path: '/users', route: userRoutes },
  { path: '/destinations', route: DestinationRoutes },
  { path: '/itineraries', route: ItineraryRoutes },
  { path: '/reviews', route: ReviewRoutes },
  { path: '/saved', route: SavedRoutes },
  { path: '/ai-chat', route: AIChatRoutes },
];

moduleRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

export default router;
