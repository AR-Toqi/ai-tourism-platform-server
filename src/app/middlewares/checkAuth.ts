import { NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status';
import ApiError from '../errors/AppError';
import catchAsync from '../utils/catchAsync';
import { auth } from '../../lib/auth';
import { user_role } from '../../generated/prisma';
import { tokenHelpers } from '../utils/token';

const requireAuth = (...requiredRoles: user_role[]) => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    let user = null;

    // 1. Prepare headers for Better Auth
    // If Authorization is just "Bearer" or empty, we remove it to avoid confusing Better Auth
    const headers = new Headers(req.headers as any);
    const authHeader = req.headers.authorization;
    if (authHeader === 'Bearer' || authHeader === 'Bearer ') {
      headers.delete('authorization');
    }

    // 2. Try to get session using Better Auth
    const session = await auth.api.getSession({
      headers: headers,
    });

    if (session && session.user) {
      user = session.user;
    } else {
      // 3. Fallback: Check if we can verify a token manually (either BE session or our JWT)
      let token = '';

      // Try to get token from Authorization header
      if (authHeader && authHeader.startsWith('Bearer ')) {
        token = authHeader.split(' ')[1] || '';
      }

      // If no header token, try to get from cookies
      if (!token || token.trim() === '') {
        token = req.cookies['accessToken'] || req.cookies['better-auth.session_token'] || '';
      }

      if (token && token.trim() !== '') {
        // A. Try to verify as our custom JWT first
        try {
          const decoded = tokenHelpers.verifyAccessToken(token);
          if (decoded) {
            user = decoded;
          }
        } catch (jwtError) {
          // B. If not a JWT, it might be a raw Better Auth session token
          // We already tried getSession, but maybe it needs a direct check
          const dbSession = await auth.api.getSession({
            headers: new Headers({
              Authorization: `Bearer ${token}`
            })
          });
          if (dbSession && dbSession.user) {
            user = dbSession.user;
          }
        }
      }
    }

    if (!user) {
      throw new ApiError(httpStatus.UNAUTHORIZED, 'You are not authorized');
    }

    // Attach user to request object
    (req as any).user = user;

    // 3. Check Roles if provided
    if (requiredRoles.length && !requiredRoles.includes(user.role as user_role)) {
      throw new ApiError(httpStatus.FORBIDDEN, 'Forbidden access');
    }

    next();
  });
};

export default requireAuth;
