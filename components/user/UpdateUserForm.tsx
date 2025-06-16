"use client";
import React, { useState } from "react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { updateUser } from "@/lib/auth-client";

interface UpdateUserFormProps {
  name: string;
  image: string;
}

export default function UpdateUserForm({ name, image }: UpdateUserFormProps) {
  const [isPending, setIsPending] = useState(false);
  const router = useRouter();

  async function handleSubmit(evt: React.FormEvent<HTMLFormElement>) {
    evt.preventDefault();
    const formData = new FormData(evt.currentTarget as HTMLFormElement);
    const name = String(formData.get("name"));
    const image = String(formData.get("image"));

    if (!name && !image) {
      return toast.error("Please provide at least one field to update");
    }

    await updateUser({
      ...(name && { name }),
      image,
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
          toast.success("User updated successfully");
          (evt.target as HTMLFormElement).reset();
          router.refresh();
        },
      },
    });
  }

  return (
    <form className='max-w-sm w-full space-y-4' onSubmit={handleSubmit}>
      <div className='flex flex-col gap-2'>
        <Label htmlFor='name'>Name</Label>
        <Input id='name' name='name' defaultValue={name} />
      </div>

      <div className='flex flex-col gap-2'>
        <Label htmlFor='image'>Image</Label>
        <Input type='url' id='image' name='image' defaultValue={image} />
      </div>
      <Button type='submit' disabled={isPending}>
        Update User
      </Button>
    </form>
  );
}
