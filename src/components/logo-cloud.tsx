import { InfiniteSlider } from "@/components/ui/infinite-slider";
import { ProgressiveBlur } from "@/components/ui/progressive-blur";
import Image from "next/image";

export function LogoCloud() {
  return (
    <section className="w-full bg-background pb-16 md:pb-32">
      <div className="group relative m-auto w-full max-w-[380px] px-6 sm:max-w-[540px] md:max-w-[720px] lg:max-w-[960px] xl:max-w-[1140px]">
        <div className="flex flex-col items-center md:flex-row">
          <div className="inline md:w-36 md:border-r md:pr-6">
            <p className="text-end text-sm">Powered by </p>
          </div>
          <div className="relative w-full py-6 md:w-[calc(100%-11rem)]">
            <InfiniteSlider speedOnHover={20} speed={40} gap={112}>
              <div className="flex">
                <Image
                  className="mx-auto h-5 w-auto dark:invert"
                  src="/t3.svg"
                  alt="T3 Stack Logo"
                  height={20}
                  width={26}
                />
              </div>
              <div className="flex">
                <Image
                  className="mx-auto h-5 w-auto dark:invert"
                  src="/shadcn-ui.svg"
                  alt="Shadcn UI Logo"
                  height={20}
                  width={118}
                />
              </div>
              <div className="flex">
                <Image
                  className="mx-auto h-5 w-auto dark:invert"
                  src="/tailwind-css.svg"
                  alt="Tailwind CSS Logo"
                  height={20}
                  width={162}
                />
              </div>
              <div className="flex">
                <Image
                  className="mx-auto h-5 w-auto dark:invert"
                  src="/uploadthing.svg"
                  alt="Uploadthing Logo"
                  height={20}
                  width={117}
                />
              </div>
              <div className="flex">
                <Image
                  className="mx-auto h-5 w-auto dark:invert"
                  src="/nextjs.svg"
                  alt="Next.js Logo"
                  height={20}
                  width={98}
                />
              </div>
              <div className="flex">
                <Image
                  className="mx-auto h-5 w-auto dark:invert"
                  src="/drizzle-orm.svg"
                  alt="Drizzle ORM Logo"
                  height={20}
                  width={141}
                />
              </div>
              <div className="flex">
                <Image
                  className="mx-auto h-5 w-auto dark:invert"
                  src="/clerk.svg"
                  alt="Clerk Logo"
                  height={20}
                  width={78}
                />
              </div>
            </InfiniteSlider>

            <ProgressiveBlur
              className="pointer-events-none absolute left-0 top-0 h-full w-20"
              direction="left"
              blurIntensity={0}
            />
            <ProgressiveBlur
              className="pointer-events-none absolute right-0 top-0 h-full w-20"
              direction="right"
              blurIntensity={0}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
