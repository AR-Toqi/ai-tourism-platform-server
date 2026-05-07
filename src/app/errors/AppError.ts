class AppError extends Error {
  statusCode: number;
  code: string;
  stack: string;

  constructor(statusCode: number, message: string | undefined, code: string = 'INTERNAL_SERVER_ERROR', stack: string = '') {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.stack = stack;

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

export default AppError;
