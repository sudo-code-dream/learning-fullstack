"use client";
import React, { useState } from "react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { SignUpEmailAction } from "@/actions/SignUpEmail.action";

const SignUpForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(evt: React.FormEvent<HTMLFormElement>) {
    evt.preventDefault();

    setIsLoading(true);

    const formData = new FormData(evt.target as HTMLFormElement);

    const { error } = await SignUpEmailAction(formData);
    if (error) {
      toast.error(error);
      setIsLoading(false);
    } else {
      toast.success("Account created successfully. Please verify your email!");
      router.push("/auth/sign-up/success");
    }

    //     name,
    //     email,
    //     password,
    //   },
    //   {
    //     onRequest: () => {
    //       setIsLoading(true);
    //     },
    //     onResponse: () => {
    //       setIsLoading(false);
    //     },
    //     onError: (ctx) => {
    //       toast.error(ctx.error.message);
    //     },
    //     onSuccess: () => {
    //       toast.success("Account created successfully");
    //       router.push("/auth/sign-in");
    //     },
    //   }
    // );
  }

  return (
    <form onSubmit={handleSubmit} className='max-w-sm w-full space-y-4'>
      <div className='space-y-2'>
        <Label htmlFor='name'>Name</Label>
        <Input id='name' name='name' />
      </div>
      <div className='space-y-2'>
        <Label htmlFor='email'>Email</Label>
        <Input type='email' id='email' name='email' />
      </div>
      <div className='space-y-2'>
        <Label htmlFor='password'>Password</Label>
        <Input type='password' id='password' name='password' />
      </div>

      <Button type='submit' className='w-full' disabled={isLoading}>
        Sign Up
      </Button>
    </form>
  );
};

export default SignUpForm;
