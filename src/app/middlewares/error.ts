import { ErrorRequestHandler } from 'express';
import { envConfig } from '../../config/index';

const globalErrorHandler: ErrorRequestHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Something went wrong';
  let code = err.code || 'INTERNAL_SERVER_ERROR';
  let details = err.details || {};

  // Handle Zod Errors
  if (err.name === 'ZodError') {
    statusCode = 400;
    message = 'Validation Error';
    code = 'VALIDATION_ERROR';
    details = err.errors;
  }

  res.status(statusCode).json({
    success: false,
    error: {
      code,
      message,
      details,
      stack: envConfig.NODE_ENV === 'development' ? err.stack : undefined,
    },
  });
};

export default globalErrorHandler;
