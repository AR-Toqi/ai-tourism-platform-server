import { Request, Response, CookieOptions } from 'express';
import { envConfig } from '../../config';

const setCookie = (
  res: Response,
  key: string,
  value: string,
  options?: CookieOptions
) => {
  const isProduction = envConfig.NODE_ENV === 'production';

  const defaultOptions: CookieOptions = {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? 'none' : 'lax',
    path: '/',
  };

  res.cookie(key, value, { ...defaultOptions, ...options });
};

const getCookie = (req: Request, key: string) => {
  return req.cookies[key];
};

const clearCookie = (res: Response, key: string, options?: CookieOptions) => {
  const isProduction = envConfig.NODE_ENV === 'production';

  const defaultOptions: CookieOptions = {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? 'none' : 'lax',
    path: '/',
  };

  res.clearCookie(key, { ...defaultOptions, ...options });
};

export const CookieUtils = {
  setCookie,
  getCookie,
  clearCookie,
};
