"use server";

import { auth, ErrorCode } from "@/lib/auth";
import { APIError } from "better-auth/api";

export async function SignUpEmailAction(formData: FormData) {
  const name = String(formData.get("name"));
  if (!name) return { error: "Please enter your name" };
  const email = String(formData.get("email"));
  if (!email) return { error: "Please enter your email" };
  const password = String(formData.get("password"));
  if (!password) return { error: "Please enter a password" };

  try {
    await auth.api.signUpEmail({
      body: {
        name,
        email,
        password,
      },
    });

    return { error: null };
  } catch (error) {
    console.error("Sign up error:", error);
    
    if (error instanceof APIError) {
      const errCode = error.body ? (error.body.code as ErrorCode) : "UNKNOWN";

      switch (errCode) {
        case "USER_ALREADY_EXISTS":
          return {
            error: "This email is already registered. Try logging in instead.",
          };
        case "INVALID_EMAIL":
          return { error: "Please enter a valid email address" };
        case "WEAK_PASSWORD":
          return { error: "Password is too weak. Please choose a stronger password" };
        default:
          return { error: error.message || "Registration failed" };
      }
    }

    return { error: "Internal Server Error" };
  }
}