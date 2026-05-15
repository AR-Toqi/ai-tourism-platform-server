import { rateLimit } from 'express-rate-limit';

/**
 * Global rate limiter for all API routes.
 * Limits each IP to 100 requests per 15 minutes.
 */
export const globalRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  message: {
    status: 429,
    message: 'Too many requests from this IP, please try again after 15 minutes',
  },
});

/**
 * Stricter rate limiter for authentication and high-resource routes (e.g., AI chat).
 * Limits each IP to 10 requests per 15 minutes.
 */
export const strictRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 10, // Limit each IP to 10 requests per `window`
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    status: 429,
    message: 'Too many attempts from this IP, please try again after 15 minutes',
  },
});
