import { Button } from "@genuineundead/ui/components/button";
import Image from "next/image";
import Link from "next/link";
import type { Comic, Token } from "types";
import Particles from "~/components/particles";
import { server } from "~/sanity/lib/server";
import { ComicHighlightGrid } from "./comic-highlight-grid";
import ScrollAnimate from "./scroll-animate";

export async function SectionComicHighlight({ comic }: { comic: Comic }) {
  const token = await server().fetch<Token>(`*[_type == 'token' ][0]`);
  return (
    <section>
      <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
        {/* Illustration */}
        <div className="absolute w-full h-full left-0">


          <ScrollAnimate opacity slideUp timing={{ delay: 0, duration: 600 }} scaleUp rotateIn threshold={0.5}>
            <div
              className="pointer-events-none absolute inset-0 -z-10 overflow-hidden rounded-t-[3rem] bg-gradient-to-b from-purple-900/30 to-background lg:-mx-28"
              aria-hidden="true"
            >
              <div className="absolute left-1/2 top-0 -z-10 -translate-x-1/2">
                <Image
                  src="/images/glow-top.svg"
                  className="max-w-none"
                  width={1404}
                  height={658}
                  alt="Features Illustration"
                />
              </div>
            </div>
          </ScrollAnimate>
        </div>

        <div className="pb-12 pt-16 md:pb-20 md:pt-52">
          <div>
            {/* Section content */}
            <div className="mx-auto flex max-w-xl flex-col space-y-8 space-y-reverse md:max-w-none md:flex-row md:space-x-8 md:space-y-0 lg:space-x-16 xl:space-x-20 relative">
              {/* Content */}

              <div className="order-1 max-md:text-center md:order-none md:w-7/12 lg:w-1/2 relative">
                <ScrollAnimate opacity slideUp scaleUp timing={{ delay: 200, duration: 700 }}>
                  {/* Content #1 */}
                  <div>
                    <div className="inline-flex pb-3 font-medium">
                      Lorem ipsum dolor sit amet
                    </div>
                  </div>

                  <h3 className="mb-4 text-3xl font-extrabold">
                    A search for the truth
                  </h3>

                  <p className="text-lg text-slate-400">
                    Donec nec justo eget felis facilisis fermentum. Aliquam
                    porttitor mauris sit amet orci. Aenean dignissim pellentesque
                    felis.
                  </p>

                  <div className="mt-8 max-w-xs space-y-2 max-md:mx-auto sm:space-x-4">
                    <Link href={`/mint/${token?.tokenId}`}>
                      <Button>Own a piece</Button>
                    </Link>
                    <Link href={`/reader/${comic?.slug?.current}`}>
                      <Button variant="outline">Read the first edition</Button>
                    </Link>
                  </div>
                </ScrollAnimate>
              </div>
              {/* Image */}
              <div className="md:w-5/12 lg:w-1/2"

              >
                <div className="relative -mt-12 py-24" >
                  {/* Particles animation */}
                  <Particles
                    className="absolute inset-0 -z-10"
                    quantity={8}
                    staticity={30}
                  />
                  <ScrollAnimate opacity slideUp timing={{ delay: 400, duration: 700 }}>

                    <ComicHighlightGrid comic={comic} />
                  </ScrollAnimate>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}