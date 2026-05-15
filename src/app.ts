import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import pinoHttp from 'pino-http';
import { toNodeHandler } from 'better-auth/node';
import { auth } from './lib/auth';
import globalRouter from './app/routes';
import { envConfig } from './config';
import globalErrorHandler from './app/middlewares/error';
import notFound from './app/middlewares/notFound';
import { globalRateLimiter } from './app/middlewares/rateLimiter';

const app: Application = express();

// Rate Limiting
app.use(globalRateLimiter);

// Security and Logging
app.use(helmet());
app.use(cors({
  origin: [envConfig.FRONTEND_URL, envConfig.BETTER_AUTH_URL, 'http://localhost:3000'] as string[],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));
app.use(cookieParser());
app.use(pinoHttp({
  ...(envConfig.NODE_ENV === 'development' && {
    transport: {
      target: 'pino-pretty',
      options: {
        colorize: true,
      },
    },
  }),
}));

// Better Auth Handler (Must be before express.json())
// app.all('/api/v1/auth/*', toNodeHandler(auth));

// Body parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API Routes
app.use('/api/v1', globalRouter);

// Health Check
app.get('/', (req: Request, res: Response) => {
  res.status(200).json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Not Found Handler
app.use(notFound);

// Global Error Handler
app.use(globalErrorHandler);

export default app;
