import { auth } from "@/lib/auth"; // path to your auth file
import { toNextJsHandler } from "better-auth/next-js";

const origin =
  process.env.BETTER_AUTH_URL || "https://learning-fullstack-ruby.vercel.app";

export const { POST, GET } = toNextJsHandler(auth);
