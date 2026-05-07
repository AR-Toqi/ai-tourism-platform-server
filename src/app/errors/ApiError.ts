class ApiError extends Error {
  statusCode: number;
  code: string;
  details: any;

  constructor(statusCode: number, message: string | undefined, code: string = 'INTERNAL_SERVER_ERROR', details: any = {}) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

export default ApiError;
