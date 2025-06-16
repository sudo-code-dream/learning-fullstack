import { ExternalLink, MailWarning, TriangleAlertIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button, buttonVariants } from "@/components/ui/button";
import { redirect } from "next/navigation";

interface PageProps {
  searchParams: Promise<{ error: string }>;
}

export default async function Page({ searchParams }: PageProps) {
  const error = (await searchParams).error;

  if (!error) redirect("/profile");

  return (
    <section className='relative overflow-hidden py-32 max-auto flex items-center justify-center'>
      <div className='absolute inset-x-0 top-0 flex h-full w-full items-center justify-center opacity-100'>
        <img
          alt='background'
          src='https://deifkwefumgah.cloudfront.net/shadcnblocks/block/patterns/square-alt-grid.svg'
          className='[mask-image:radial-gradient(75%_75%_at_center,white,transparent)] opacity-90'
        />
      </div>
      <div className='relative z-10 container'>
        <div className='mx-auto flex max-w-5xl flex-col items-center'>
          <div className='flex flex-col items-center gap-6 text-center'>
            <div className='rounded-xl bg-background/30 p-4 shadow-sm backdrop-blur-sm'>
              <img
                src='https://deifkwefumgah.cloudfront.net/shadcnblocks/block/block-1.svg'
                alt='logo'
                className='h-16'
              />
            </div>
            <div>
              <h1 className='mb-6 text-2xl font-bold tracking-tight text-pretty lg:text-5xl'>
                {error === "invalid_token" || error === "token_expired"
                  ? "Invalid Token"
                  : error === "email_not_verified"
                  ? "Email not verified"
                  : "We weren't able to verify your account. Please try again."}
                <span className='text-primary flex items-center justify-center'>
                  {error === "invalid_token" || error === "token_expired" ? (
                    <TriangleAlertIcon size={"30"} />
                  ) : (
                    <MailWarning />
                  )}
                </span>
              </h1>
              <p className='mx-auto max-w-3xl text-muted-foreground lg:text-xl'>
                {error === "invalid_token" || error === "token_expired"
                  ? "This link is no longer valid or has already been used. Please request a new one."
                  : error === "email_not_verified"
                  ? "Please verify your email to continue, or request a new one."
                  : "We weren't able to verify your account. Please try again"}
              </p>
            </div>
            <div className='mt-6 flex justify-center gap-3'>
              <Button className='shadow-sm w-[6.5rem] transition-shadow hover:shadow'>
                <a href='/auth/verify/mail'> Verify </a>
              </Button>
              <Button variant='outline' className='group'>
                Learn more{" "}
                <ExternalLink className='ml-2 h-4 transition-transform group-hover:translate-x-0.5' />
              </Button>
            </div>
            <div className='mt-20 flex flex-col items-center gap-5'>
              <p className='font-medium text-muted-foreground lg:text-left'>
                Built with open-source technologies
              </p>
              <div className='flex flex-wrap items-center justify-center gap-4'>
                <a
                  href='#'
                  className={cn(
                    buttonVariants({ variant: "outline" }),
                    "group flex aspect-square h-12 items-center justify-center p-0"
                  )}>
                  <img
                    src='https://deifkwefumgah.cloudfront.net/shadcnblocks/block/logos/shadcn-ui-icon.svg'
                    alt='shadcn/ui logo'
                    className='h-6 saturate-0 transition-all group-hover:saturate-100'
                  />
                </a>
                <a
                  href='#'
                  className={cn(
                    buttonVariants({ variant: "outline" }),
                    "group flex aspect-square h-12 items-center justify-center p-0"
                  )}>
                  <img
                    src='https://deifkwefumgah.cloudfront.net/shadcnblocks/block/logos/typescript-icon.svg'
                    alt='TypeScript logo'
                    className='h-6 saturate-0 transition-all group-hover:saturate-100'
                  />
                </a>

                <a
                  href='#'
                  className={cn(
                    buttonVariants({ variant: "outline" }),
                    "group flex aspect-square h-12 items-center justify-center p-0"
                  )}>
                  <img
                    src='https://deifkwefumgah.cloudfront.net/shadcnblocks/block/logos/nextjs-icon.svg'
                    alt='React logo'
                    className='h-6 saturate-0 transition-all group-hover:saturate-100'
                  />
                </a>
                <a
                  href='#'
                  className={cn(
                    buttonVariants({ variant: "outline" }),
                    "group flex aspect-square h-12 items-center justify-center p-0"
                  )}>
                  <img
                    src='https://deifkwefumgah.cloudfront.net/shadcnblocks/block/logos/tailwind-icon.svg'
                    alt='Tailwind CSS logo'
                    className='h-6 saturate-0 transition-all group-hover:saturate-100'
                  />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
