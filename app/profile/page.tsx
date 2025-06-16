import ChangePasswordForm from "@/components/auth/ChangePasswordForm";
import { ReturnButton } from "@/components/common/ReturnButton";
import SignOutButton from "@/components/auth/SignOutButton";
import { Button } from "@/components/ui/button";
import UpdateUserForm from "@/components/user/UpdateUserForm";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";
import React from "react";

export default async function page() {
  const headersLists = await headers();
  const session = await auth.api.getSession({
    headers: headersLists,
  });

  if (!session) redirect("/auth/sign-in");

  const FULL_POST_ACCESS = await auth.api.userHasPermission({
    headers: headersLists,
    body: {
      permission: {
        posts: ["update", "delete"],
      },
    },
  });

  return (
    <div className='px-8 py-16 container mx-auto max-w-screen-lg space-y-8'>
      <div className='space-y-8'>
        <ReturnButton href='/' label='Home' />
        <h1 className='text-3xl font-bold'>Profile Page</h1>
      </div>
      <div className='flex items-center gap-2'>
        {session.user.role === "ADMIN" && (
          <Button size={"sm"} asChild>
            <Link href={"/admin/dashboard"}>Admin Dashboard</Link>
          </Button>
        )}

        <SignOutButton />

        <div className='text-2xl font-bold'>Permissions</div>
        <div className='space-x-4'>
          <Button size={"sm"}>Manage Own Posts</Button>
          <Button size={"sm"} disabled={!FULL_POST_ACCESS.success}>
            Manage All Posts
          </Button>
        </div>
      </div>

      {session.user.image ? (
        <img
          src={session.user.image}
          alt='User Image'
          className='size-24 border border-primary rounded-md object-cover'
        />
      ) : (
        <div className='size-24 border border-primary rounded-md bg-primary text-primary-foreground flex items-center justify-center'>
          <span className='text-lg font-bold uppercase'>
            {session.user.name.slice(0, 2)}
          </span>
        </div>
      )}

      <pre className='text-sm overflow-clip'>
        {JSON.stringify(session, null, 2)}
      </pre>

      <div className='space-y-4 p-4 rounded-b-md border border-t-8 border-blue-600'>
        <h2 className='text-2xl font-bold'>Update User</h2>

        <UpdateUserForm
          name={session.user.name}
          image={session.user.image ?? ""}
        />
      </div>
      <div className='space-y-4 p-4 rounded-b-md border border-t-8 border-red-600'>
        <h2 className='text-2xl font-bold'>Change Password</h2>

        <ChangePasswordForm />
      </div>
    </div>
  );
}
