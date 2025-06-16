import { betterAuth, type BetterAuthOptions } from "better-auth";
import { APIError } from "better-auth/api";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { nextCookies } from "better-auth/next-js";
import { createAuthMiddleware } from "better-auth/api";
import { admin, customSession, magicLink } from "better-auth/plugins";

import { prisma } from "./prisma";
import { hashPassword, verifyPassword } from "./argon2";
import { getValidDomains, normalizeName } from "./utils";
import { UserRole } from "./generated/prisma";
import { ac, roles } from "@/lib/permissions";
import { sendEmailAction } from "@/actions/SendEmails.action";

// Validate required environment variables
const requiredEnvVars = {
  DATABASE_URL: process.env.DATABASE_URL,
  BETTER_AUTH_SECRET: process.env.BETTER_AUTH_SECRET,
  BETTER_AUTH_URL: process.env.BETTER_AUTH_URL,
  NODEMAILER_USER: process.env.NODEMAILER_USER,
  NODEMAILER_APP_PASSWORD: process.env.NODEMAILER_APP_PASSWORD,
};

// Check for missing environment variables
const missingVars = Object.entries(requiredEnvVars)
  .filter(([key, value]) => !value)
  .map(([key]) => key);

if (missingVars.length > 0) {
  console.error("Missing required environment variables:", missingVars.join(", "));
  if (process.env.NODE_ENV === "production") {
    throw new Error(`Missing required environment variables: ${missingVars.join(", ")}`);
  }
}

const options = {
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 6,
    autoSignIn: false,
    password: {
      hash: hashPassword,
      verify: verifyPassword,
    },
    requireEmailVerification: true,
    sendResetPassword: async ({ user, url }) => {
      try {
        await sendEmailAction({
          to: user.email,
          subject: "Reset Your Password",
          meta: {
            description: "Click the link below to reset your password.",
            link: url,
            button: "Reset Password",
          },
        });
      } catch (error) {
        console.error("Failed to send reset password email:", error);
        throw new APIError("INTERNAL_SERVER_ERROR", {
          message: "Failed to send reset password email",
        });
      }
    },
  },
  emailVerification: {
    sendOnSignUp: true,
    autoSignInAfterVerification: true,
    sendVerificationEmail: async ({ user, url }) => {
      try {
        const link = new URL(url);
        link.searchParams.set("callbackURL", "/auth/verify/");

        await sendEmailAction({
          to: user.email,
          subject: "Verify Your Email Address",
          meta: {
            description:
              "Please verify your email address to complete registration",
            link: String(link),
            button: "Verify my account",
          },
        });
      } catch (error) {
        console.error("Failed to send verification email:", error);
        throw new APIError("INTERNAL_SERVER_ERROR", {
          message: "Failed to send verification email",
        });
      }
    },
  },
  socialProviders: {
    google: {
      clientId: String(process.env.GOOGLE_CLIENT_ID || ""),
      clientSecret: String(process.env.GOOGLE_CLIENT_SECRET || ""),
    },
  },
  hooks: {
    before: createAuthMiddleware(async (ctx) => {
      try {
        if (ctx.path === "/sign-up/email") {
          const email = String(ctx.body.email);
          const domain = email.split("@")[1];

          const VALID_DOMAINS = getValidDomains();
          if (!VALID_DOMAINS.includes(domain)) {
            throw new APIError("BAD_REQUEST", {
              message: "Invalid domain. Please use a valid email",
            });
          }
          return {
            context: {
              ...ctx,
              body: {
                ...ctx.body,
                name: normalizeName(ctx.body.name),
              },
            },
          };
        }
        if (ctx.path === "/sign-in/magic-link") {
          return {
            context: {
              ...ctx,
              body: { ...ctx.body, name: normalizeName(ctx.body.name) },
            },
          };
        }
        if (ctx.path === "/update-user") {
          return {
            context: {
              ...ctx,
              body: { ...ctx.body, name: normalizeName(ctx.body.name) },
            },
          };
        }
      } catch (error) {
        console.error("Auth middleware error:", error);
        throw error;
      }
    }),
  },
  databaseHooks: {
    user: {
      create: {
        before: async (user) => {
          try {
            const ADMIN_EMAILS = process.env.ADMIN_EMAILS?.split(";") ?? [];

            if (ADMIN_EMAILS.includes(user.email)) {
              return { data: { ...user, role: UserRole.ADMIN } };
            }

            return { data: user };
          } catch (error) {
            console.error("Database hook error:", error);
            return { data: user };
          }
        },
      },
    },
  },
  user: {
    additionalFields: {
      role: {
        type: ["USER", "ADMIN"] as Array<UserRole>,
        input: false,
      },
    },
  },
  session: {
    expiresIn: 30 * 24 * 60 * 60,
    cookieCache: {
      enabled: true,
      maxAge: 5 * 60,
    },
  },
  account: {
    accountLinking: {
      enabled: false,
    },
  },
  advanced: {
    database: {
      generateId: false,
    },
  },
  plugins: [
    nextCookies(),
    admin({
      defaultRole: UserRole.USER,
      adminRoles: [UserRole.ADMIN],
      ac,
      roles,
    }),
    magicLink({
      sendMagicLink: async ({ email, url }) => {
        try {
          await sendEmailAction({
            to: email,
            subject: "Magic Link Login",
            meta: {
              description: "Click the link below to log in.",
              link: url,
              button: "Login",
            },
          });
        } catch (error) {
          console.error("Failed to send magic link:", error);
          throw new APIError("INTERNAL_SERVER_ERROR", {
            message: "Failed to send magic link",
          });
        }
      },
    }),
  ],
} satisfies BetterAuthOptions;

export const auth = betterAuth({
  ...options,
  origin: process.env.BETTER_AUTH_URL,
  secret: process.env.BETTER_AUTH_SECRET,
  plugins: [
    ...(options.plugins ?? []),
    customSession(async ({ user, session }) => {
      return {
        session: {
          expiresAt: session.expiresAt,
          token: session.token,
          userAgent: session.userAgent,
        },
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          image: user.image,
          createdAt: user.createdAt,
          role: user.role,
        },
      };
    }, options),
  ],
});

export type ErrorCode = keyof typeof auth.$ERROR_CODES | "UNKNOWN";