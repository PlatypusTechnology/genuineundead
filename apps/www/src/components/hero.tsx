/* eslint-disable @typescript-eslint/require-await */
import { cn } from "@genuineundead/core";
import { GradientBadge } from "@genuineundead/ui/components/badge";
import { Button } from "@genuineundead/ui/components/button";
import Image from "next/image";
import Link from "next/link";
import type { Comic } from "types";
import { ComicCard } from "./comic-card";
import Particles from "./particles";
import ScrollAnimate from "./scroll-animate";


const HeroCard = ({
  comic,
  className,
}: {
  comic: Comic;
  className?: string;
}) => {
  return (
    <div
      className={cn(
        "relative flex h-full w-44 flex-none scale-95 items-center overflow-hidden shadow transition-all duration-200 ease-in-out hover:rotate-0 hover:scale-100 dark:bg-transparent md:w-72",
        className,
      )}
    >
      <ComicCard comic={comic} />
    </div>
  );
};

async function HeroCards({ comics }: { comics: Comic[] }) {

  return (
    <section>

      <div className="flex justify-center whitespace-nowrap">
        <HeroCard comic={comics[0]!} className="-rotate-12" />
        <HeroCard comic={comics[comics.length > 1 ? 1 : 0]!} className="-ml-20 -mt-10 rotate-12" />
      </div>


      <div className="relative py-32">
        <div className="container">
          <ScrollAnimate opacity slideDown timing={{ delay: 200, duration: 600 }} threshold={0.5}>
            <div className="mx-auto  mb-4 max-w-xl space-y-4 text-center">
              <h2 className="text-4xl font-extrabold">A search for the truth</h2>

              <p className="text-lg">
                Donec nec justo eget felis facilisis fermentum. Aliquam porttitor
                mauris sit amet orci. Aenean dignissim pellentesque felis.
              </p>
              <Link href={`/reader/${comics[0]?.slug.current}`}>
                <Button variant="outline" className="mt-8">Read the first edition</Button>
              </Link>
            </div>
          </ScrollAnimate>
        </div>
      </div>
    </section>
  );
}

export function SectionHero({ comics }: { comics: Comic[] }) {
  return (
    <section className="overflow-hidden">
      <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
        <Particles className="absolute inset-0 -z-10" />
        <div className="absolute w-full h-full left-0">
          <ScrollAnimate opacity slideDown timing={{ delay: 0, duration: 600 }} threshold={0} rotateIn scaleDown>
            <div
              className="pointer-events-none absolute inset-0 -z-10 overflow-hidden rounded-b-[3rem] bg-purple-900/20 lg:-mx-28"
              aria-hidden="true"
            >
              <div className="absolute bottom-0 left-1/2 -z-10 -translate-x-1/2">
                <Image
                  src={"/images/glow-bottom.svg"}
                  className="max-w-none"
                  width={2146}
                  height={400}
                  priority
                  alt="Hero Illustration"
                />
              </div>
            </div>
          </ScrollAnimate>

        </div>

        <div className="pb-32 pt-44 md:pb-64 md:pt-56 relative">
          {/* Hero content */}
          <ScrollAnimate opacity slideUp timing={{ delay: 200, duration: 600 }} scaleUp threshold={0.5}>

            <div className="mx-auto max-w-3xl text-center">
              <div className="mb-6">

                <GradientBadge>Read the first edition</GradientBadge>

              </div>

              <h1 className="bg-gradient-to-r from-slate-100/60 via-slate-100 to-slate-100/60 bg-clip-text pb-4 text-4xl font-extrabold text-transparent sm:text-5xl">
                The Undead gets reborn
              </h1>

              <p className="mx-auto mb-8 max-w-xl text-xl text-slate-300">
                Donec nec justo eget felis facilisis fermentum. Aliquam porttitor
                mauris sit amet orci. Aenean dignissim.
              </p>

              <div className="mx-auto max-w-xs space-y-4 sm:inline-flex sm:max-w-none sm:justify-center sm:space-x-4 sm:space-y-0">
                <Link href={`/reader/${comics[0]?.slug.current}`}>
                  <Button>Get started</Button>
                </Link>

              </div>
            </div>
          </ScrollAnimate>
        </div>

      </div>

      <div className="relative mx-auto -mt-10 max-w-6xl px-4 sm:-mt-10 sm:px-6 md:-mt-28">
        <ScrollAnimate opacity slideUp timing={{ delay: 300, duration: 1000 }} scaleUp threshold={0}>
          <HeroCards comics={comics} />
        </ScrollAnimate>
      </div>
    </section>
  );
}