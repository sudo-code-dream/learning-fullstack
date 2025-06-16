import { ResetPasswordForm } from "@/components/auth/ResetPasswordForm";
import { ReturnButton } from "@/components/common/ReturnButton";
import Link from "next/link";
import { redirect } from "next/navigation";
import React from "react";

interface PasswordResetPageProps {
  searchParams: Promise<{ token: string }>;
}

export default async function PasswordResetPage({
  searchParams,
}: PasswordResetPageProps) {
  const token = (await searchParams).token;

  if (!token) {
    redirect("/auth/sign-in");
  }

  return (
    <div className='px-8 py-16 container mx-auto max-w-screen-lg space-y-8'>
      <div className='space-y-8'>
        <ReturnButton href='/' label='Home' />
        <h1 className='text-3xl font-bold'>Enter new password</h1>
      </div>

      <div className='space-y-4'>
        <p className='text-muted-foreground text-sm'>
          Please enter your new password below. Make sure it meets the security
          requirements.
        </p>
        <ResetPasswordForm token={token} />

        <p className='text-muted-foreground text-sm'>
          Don&apos;t have an account?{" "}
          <Link href='/auth/sign-up' className='hover:text-foreground'>
            Sign Up
          </Link>
        </p>
        <hr className='max-w-sm' />
      </div>
    </div>
  );
}
