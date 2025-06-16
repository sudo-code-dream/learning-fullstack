"use client";
import { ReturnButton } from "@/components/common/ReturnButton";
import { SignInOAuthButton } from "@/components/auth/SignInOAuthButton";
import SignUpForm from "@/components/auth/SignUpForm";
import Link from "next/link";
import React from "react";

const page = () => {
  return (
    <div className='px-8 py-16 container mx-auto max-w-screen-lg space-y-8'>
      <div className='space-y-8'>
        <ReturnButton href='/' label='Home' />
        <h1 className='text-3xl font-bold'>Register</h1>
      </div>
      <div className='space-y-4'>
        <SignUpForm />
        <p className='text-muted-foreground text-sm'>
          Already have an account?{" "}
          <Link href='/auth/sign-in' className='hover:text-foreground'>
            Sign In
          </Link>
        </p>
        <hr className='max-w-sm' />
      </div>
      <div className='flex flex-col max-w-sm gap-4'>
        <SignInOAuthButton signUp provider='google' />
        <SignInOAuthButton signUp provider='github' />
      </div>
    </div>
  );
};

export default page;
