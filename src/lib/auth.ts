import { betterAuth } from 'better-auth';
import { prismaAdapter } from 'better-auth/adapters/prisma';
import { envConfig } from '../config';
import { prisma } from './prisma';

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: 'postgresql',
  }),
  emailAndPassword: {
    enabled: true,
  },

  emailVerification: {
    sendOnSignUp: true,
    sendOnSignIn: true,
    autoSignInAfterVerification: true,
  },
  // socialProviders: {
  //   google: {
  //     clientId: envConfig.GOOGLE_CLIENT_ID || '',
  //     clientSecret: envConfig.GOOGLE_CLIENT_SECRET || '',
  //   },
  // },
  secret: envConfig.BETTER_AUTH_SECRET,
  baseURL: envConfig.BETTER_AUTH_URL,
  user: {
    additionalFields: {
      role: {
        type: 'string',
        required: false,
        defaultValue: 'USER',
      },
      status: {
        type: 'string',
        required: false,
        defaultValue: 'ACTIVE',
      },
      isDeleted: {
        type: 'boolean',
        required: false,
        defaultValue: false,
      },
      deletedAt: {
        type: 'date',
        required: false,
        defaultValue: null
      },
    },
  },
});
