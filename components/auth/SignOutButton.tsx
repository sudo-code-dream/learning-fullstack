"use client";
import React, { useState } from "react";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import { signOut } from "@/lib/auth-client";
import { toast } from "sonner";

const SignOutButton = () => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  async function handleLogout() {
    await signOut({
      fetchOptions: {
        onRequest: () => {
          setIsLoading(true);
        },
        onResponse: () => {
          setIsLoading(false);
        },
        onError: (ctx) => {
          toast.error(ctx.error.message);
        },
        onSuccess: () => {
          toast.success("You have been logged out");
          router.push("/auth/sign-in");
        },
      },
    });
  }

  return (
    <Button
      onClick={handleLogout}
      size={"sm"}
      variant={"destructive"}
      disabled={isLoading}>
      Logout
    </Button>
  );
};

export default SignOutButton;
