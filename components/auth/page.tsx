"use client";
import MagicLinkLoginForm from "@/components/auth/MagicLinkLoginForm";
import { ReturnButton } from "@/components/common/ReturnButton";
import SignInForm from "@/components/auth/SignInForm";
import { SignInOAuthButton } from "@/components/auth/SignInOAuthButton";
import Link from "next/link";
import React from "react";

const SignIn = () => {
  return (
    <div className='px-8 py-16 container mx-auto max-w-screen-lg space-y-8'>
      <div className='space-y-8'>
        <ReturnButton href='/' label='Home' />
        <h1 className='text-3xl font-bold'>Sign In</h1>
      </div>

      <div className='space-y-4'>
        <MagicLinkLoginForm />
        <SignInForm />

        <p className='text-muted-foreground text-sm'>
          Don&apos;t have an account?{" "}
          <Link href='/auth/sign-up' className='hover:text-foreground'>
            Sign Up
          </Link>
        </p>
        <hr className='max-w-sm' />
      </div>

      <div className='flex flex-col max-w-sm gap-4'>
        <SignInOAuthButton provider='google' />
        <SignInOAuthButton provider='github' />
      </div>
    </div>
  );
};

export default SignIn;
