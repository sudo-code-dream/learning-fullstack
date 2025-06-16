"use client";

import React, { useState } from "react";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { sendVerificationEmail } from "@/lib/auth-client";

export const SendEmailVerificationForm = () => {
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);

  async function handleSubmit(evt: React.FormEvent<HTMLFormElement>) {
    evt.preventDefault();
    const formData = new FormData(evt.currentTarget as HTMLFormElement);
    const email = String(formData.get("email"));

    if (!email) return toast.error("Please enter a valid email");

    await sendVerificationEmail({
      email,
      callbackURL: "/auth/verify",
      fetchOptions: {
        onRequest: () => {
          setIsPending(true);
        },
        onResponse: () => {
          setIsPending(false);
        },
        onError: (ctx) => {
          toast.error(ctx.error.message);
        },
        onSuccess: () => {
          toast.success("Verification email sent");
          router.push("/auth/verify/success");
        },
      },
    });
  }

  return (
    <div className='container mx-auto max-w-6xl min-h-[80vh] items-center flex flex-col justify-center space-y-8'>
      <div className='space-y-8'>
        <h1 className='text-3xl font-bold'>Email Verification</h1>
      </div>

      <form onSubmit={handleSubmit} className='max-w-sm w-full space-y-4'>
        <div className='flex flex-col gap-2'>
          <Label htmlFor='email'>Email</Label>
          <Input type='email' id='email' name='email' />
        </div>
        <Button type='submit' disabled={isPending}>
          Resend Verification
        </Button>
      </form>
    </div>
  );
};
