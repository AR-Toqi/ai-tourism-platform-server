import { Request, Response, CookieOptions } from 'express';
import { envConfig } from '../../config';

const setCookie = (
  res: Response,
  key: string,
  value: string,
  options?: CookieOptions
) => {
  const isProduction = envConfig.NODE_ENV === 'production';
  const isLocalhost = envConfig.FRONTEND_URL.includes('localhost');

  const defaultOptions: CookieOptions = {
    httpOnly: true,
    // Force cross-site support if we are testing from localhost to a deployed server
    secure: isProduction || isLocalhost,
    sameSite: (isProduction || isLocalhost) ? 'none' : 'lax',
    path: '/',
  };

  res.cookie(key, value, { ...defaultOptions, ...options });
};

const getCookie = (req: Request, key: string) => {
  return req.cookies[key];
};

const clearCookie = (res: Response, key: string, options?: CookieOptions) => {
  const isProduction = envConfig.NODE_ENV === 'production';
  const isLocalhost = envConfig.FRONTEND_URL.includes('localhost');

  const defaultOptions: CookieOptions = {
    httpOnly: true,
    secure: isProduction || isLocalhost,
    sameSite: (isProduction || isLocalhost) ? 'none' : 'lax',
    path: '/',
  };

  res.clearCookie(key, { ...defaultOptions, ...options });
};

export const CookieUtils = {
  setCookie,
  getCookie,
  clearCookie,
};
