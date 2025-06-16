import { ExternalLink, TriangleAlertIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button, buttonVariants } from "@/components/ui/button";

interface PageProps {
  searchParams: Promise<{ error: string }>;
}

export default async function Page({ searchParams }: PageProps) {
  const sp = await searchParams;

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
                Login Error{" "}
                <span className='text-primary flex items-center justify-center'>
                  <TriangleAlertIcon size={"30"} />
                </span>
              </h1>
              <p className='mx-auto max-w-3xl text-muted-foreground lg:text-xl'>
                {sp.error === "account_not_linked"
                  ? "We couldn’t authenticate your account. It looks like this account is already linked to a different sign-in method."
                  : "We weren't able to authenticate your account. Please try again or use a different login method"}
              </p>
            </div>
            <div className='mt-6 flex justify-center gap-3'>
              <Button className='shadow-sm w-[6.5rem] transition-shadow hover:shadow'>
                <a href='/auth/sign-in'> Login </a>
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
                    src='https://deifkwefumgah.cloudfront.net/shadcnblocks/block/logos/react-icon.svg'
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
