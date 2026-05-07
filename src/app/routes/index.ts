import { Router } from 'express';

const router = Router();

const moduleRoutes = [
  // { path: '/destinations', route: destinationRoutes },
];

moduleRoutes.forEach((route) => {
  // router.use(route.path, route.route);
});

export default router;
