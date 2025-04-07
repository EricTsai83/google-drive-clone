import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { TextEffect } from "@/components/ui/text-effect";
import { AnimatedGroup } from "@/components/motion/animated-group";
import { LogoCloud } from "@/components/logo-cloud";
import { GetStartedButton } from "@/components/get-started-button";
import { Footer } from "@/components/footer";
import { ModeToggle } from "@/components/mode-toggle";

const transitionVariants = {
  item: {
    hidden: {
      opacity: 0,
      filter: "blur(12px)",
      y: 12,
    },
    visible: {
      opacity: 1,
      filter: "blur(0px)",
      y: 0,
      transition: {
        type: "spring",
        bounce: 0.3,
        duration: 1.5,
      },
    },
  },
};

export default function HomePage() {
  return (
    <>
      <main>
        <section>
          <div className="relative mx-auto max-w-6xl px-6 pt-32 lg:pt-48 lg:pb-16">
            <div className="relative z-10 mx-auto max-w-4xl text-center">
              <TextEffect
                preset="fade-in-blur"
                speedSegment={0.3}
                as="h1"
                className="text-4xl font-medium text-balance sm:text-5xl md:text-6xl"
              >
                Google Drive Clone, But Worse
              </TextEffect>
              <TextEffect
                per="line"
                preset="fade-in-blur"
                speedSegment={0.3}
                delay={0.5}
                as="p"
                className="mx-auto mt-12 max-w-2xl text-lg text-pretty"
              >
                Learn from Theo, the best software dev nerd in the world.
              </TextEffect>

              <AnimatedGroup
                variants={{
                  container: {
                    visible: {
                      transition: {
                        staggerChildren: 0.05,
                        delayChildren: 0.75,
                      },
                    },
                  },
                  ...transitionVariants,
                }}
                className="mt-12"
              >
                <form
                  action={async () => {
                    "use server";

                    const session = await auth();

                    if (!session.userId) {
                      return redirect("/sign-in");
                    }

                    return redirect("/drive");
                  }}
                  className="mx-auto max-w-sm"
                >
                  <div className="shadow shadow-zinc-950/5">
                    <GetStartedButton />
                  </div>
                </form>
              </AnimatedGroup>
            </div>
          </div>
        </section>
        <div className="mt-24 w-full">
          <LogoCloud />
        </div>
      </main>

      <Footer />
      <div className="absolute right-6 bottom-6 z-10">
        <ModeToggle />
      </div>
    </>
  );
}
