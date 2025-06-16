"use client";
import React, { useState } from "react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { changePasswordAction } from "@/actions/ChangePassword.action";
import { toast } from "sonner";

export default function ChangePasswordForm() {
  const [isPending, setIsPending] = useState(false);

  async function handleSubmit(evt: React.FormEvent<HTMLFormElement>) {
    evt.preventDefault();
    setIsPending(true);
    const formData = new FormData(evt.currentTarget as HTMLFormElement);

    const { error } = await changePasswordAction(formData);

    if (error) {
      toast.error(error);
    } else {
      toast.success("Password changed successfully");
      (evt.target as HTMLFormElement).reset();
    }
    setIsPending(false);
  }

  return (
    <form className='max-w-sm w-full space-y-4' onSubmit={handleSubmit}>
      <div className='flex flex-col gap-2'>
        <Label htmlFor='currentPassword'>Current Password</Label>
        <Input type='password' id='currentPassword' name='currentPassword' />
      </div>

      <div className='flex flex-col gap-2'>
        <Label htmlFor='newPassword'>New Password</Label>
        <Input type='password' id='newPassword' name='newPassword' />
      </div>
      <Button type='submit' disabled={isPending}>
        Change Password
      </Button>
    </form>
  );
}
