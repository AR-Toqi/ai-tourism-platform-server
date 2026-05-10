import jwt, { JwtPayload, Secret } from 'jsonwebtoken';
import { Response, CookieOptions } from 'express';
import { envConfig } from '../../config';
import { CookieUtils } from './cookie';

const generateToken = (
    payload: JwtPayload,
    secret: Secret,
    expiresIn: string,
) => {
    return jwt.sign(payload, secret, {
        expiresIn: expiresIn as any,
    });
};

const verifyToken = (token: string, secret: Secret) => {
    return jwt.verify(token, secret) as JwtPayload;
};

const getAccessToken = (payload: JwtPayload) => {
    return generateToken(payload, envConfig.JWT_ACCESS_SECRET as string, envConfig.JWT_ACCESS_EXPIRES_IN as string);
};

const getRefreshToken = (payload: JwtPayload) => {
    return generateToken(payload, envConfig.JWT_REFRESH_SECRET as string, envConfig.JWT_REFRESH_EXPIRES_IN as string);
};

const setAccessTokenCookie = (res: Response, accessToken: string) => {
    const isProduction = envConfig.NODE_ENV === 'production';
    CookieUtils.setCookie(res, 'accessToken', accessToken, {
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction ? 'none' : 'lax',
        path: '/',
        maxAge: 60 * 60 * 24 * 1000 // 1 day
    })
};

const setBetterAuthSessionCookie = (res: Response, token: string) => {
    const isProduction = envConfig.NODE_ENV === 'production';
    CookieUtils.setCookie(res, "better-auth.session_token", token, {
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction ? 'none' : 'lax',
        path: '/',
        maxAge: 60 * 60 * 24 * 1000,
    });
}

const setRefreshTokenCookie = (res: Response, refreshToken: string) => {
    const isProduction = envConfig.NODE_ENV === 'production';
    CookieUtils.setCookie(res, 'refreshToken', refreshToken, {
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction ? 'none' : 'lax',
        path: '/',
        maxAge: 60 * 60 * 24 * 7 * 1000 // 7 days
    })
};


const clearAllCookies = (res: Response) => {
    const isProduction = envConfig.NODE_ENV === 'production';
    const options: CookieOptions = {
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction ? 'none' : 'lax',
        path: '/',
        expires: new Date(0), 
    };
    
    res.cookie('accessToken', '', options);
    res.cookie('refreshToken', '', options);
    res.cookie('better-auth.session_token', '', options);
    
    res.clearCookie('accessToken', options);
    res.clearCookie('refreshToken', options);
    res.clearCookie('better-auth.session_token', options);
};





const verifyAccessToken = (token: string) => {
    return verifyToken(token, envConfig.JWT_ACCESS_SECRET as string);
};

const verifyRefreshToken = (token: string) => {
    return verifyToken(token, envConfig.JWT_REFRESH_SECRET as string);
};

export const tokenHelpers = {
    generateToken,
    verifyToken,
    getAccessToken,
    getRefreshToken,
    verifyAccessToken,
    verifyRefreshToken,
    setAccessTokenCookie,
    setRefreshTokenCookie,
    setBetterAuthSessionCookie,
    clearAllCookies
}

