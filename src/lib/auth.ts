import { betterAuth } from 'better-auth';
import { prismaAdapter } from 'better-auth/adapters/prisma';
import { envConfig } from '../config';
import { prisma } from './prisma';
import { bearer, emailOTP } from "better-auth/plugins";
import { user_role } from '../generated/prisma';
import { sendEmail } from '../app/utils/sendEmail';

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
      needsPasswordChange: {
        type: 'boolean',
        required: true,
        defaultValue: false,
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

  plugins: [
    bearer(),
    emailOTP({
      overrideDefaultEmailVerification: true,
      async sendVerificationOTP({ email, otp, type }: { email: string, otp: string, type: "email-verification" | "forget-password" | "sign-in" | "change-email" }) {
        if (type === "email-verification") {
          const user = await prisma.user.findUnique({
            where: {
              email,
            }
          })

          if (!user) {
            console.error(`User with email ${email} not found. Cannot send verification OTP.`);
            return;
          }

          // Admin check: Skip sending verification OTP for ADMIN role
          if (user && user.role === user_role.ADMIN) {
            console.log(`User with email ${email} is an admin. Skipping sending verification OTP.`);
            return;
          }

          if (user && !user.emailVerified) {
            await sendEmail({
              to: email,
              subject: "Verify your email",
              templateName: "otp",
              templateData: {
                name: user.name,
                otp,
              }
            })
          }
        } else if (type === "forget-password") {
          const user = await prisma.user.findUnique({
            where: {
              email,
            }
          })

          if (user) {
            await sendEmail({
              to: email,
              subject: "Password Reset OTP",
              templateName: "otp",
              templateData: {
                name: user.name,
                otp,
              }
            })
          }
        }
      },
      expiresIn: 2 * 60, // 2 minutes in seconds
      otpLength: 6,
    })
  ],
  session: {
    expiresIn: 60 * 60 * 60 * 24, // 1 day in seconds
    cookieCache: {
      enabled: true,
      maxAge: 60 * 60 * 60 * 24, // 1 day in seconds
    }
  },
  trustedOrigins: [envConfig.BETTER_AUTH_URL, envConfig.FRONTEND_URL],
  advanced: {
    // disableCSRFCheck: true,
    useSecureCookies: false,
    cookies: {
      state: {
        attributes: {
          sameSite: "none",
          secure: true,
          httpOnly: true,
          path: "/",
        }
      },
      sessionToken: {
        attributes: {
          sameSite: "none",
          secure: true,
          httpOnly: true,
          path: "/",
        }
      }
    }
  }
});
