import { NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status';
import ApiError from '../errors/AppError';
import catchAsync from '../utils/catchAsync';
import { auth } from '../../lib/auth';
import { user_role } from '../../generated/prisma';

const requireAuth = (...requiredRoles: user_role[]) => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    // 1. Get the session using Better Auth
    const session = await auth.api.getSession({
      headers: new Headers(req.headers as any),
    });

    if (!session || !session.user) {
      throw new ApiError(httpStatus.UNAUTHORIZED, 'You are not authorized');
    }

    // Attach user to request object
    (req as any).user = session.user;

    // 2. Check Roles if provided
    if (requiredRoles.length && !requiredRoles.includes(session.user.role as user_role)) {
      throw new ApiError(httpStatus.FORBIDDEN, 'Forbidden access');
    }

    next();
  });
};

export default requireAuth;
