import Highlighter, { HighlighterItem } from "./highlighter";
import Particles from "./particles";
import Scoreboard from "./scoreboard";
import ScrollAnimate from "./scroll-animate";

export default function SectionScoreboard() {

  return (
    <section className="relative">
      {/* Particles animation */}
      <div className="absolute left-1/2 top-0 -z-10 -ml-32 -mt-24 h-80 w-80 -translate-x-1/2">
        <Particles
          className="absolute inset-0 -z-10"
          quantity={6}
          staticity={30}
        />
      </div>

      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="pt-16 md:pt-24">
          <div className="relative pb-12">
            <ScrollAnimate opacity slideDown timing={{ delay: 0, duration: 600 }} threshold={1}>
              <div className="mx-auto mb-4 max-w-xl space-y-4 text-center">
                <h2 className="text-3xl sm:text-4xl font-extrabold">
                  Discover hidden secrets of the universe
                </h2>

                <p className="text-lg">
                  Donec nec justo eget felis facilisis fermentum. Aliquam
                  porttitor mauris sit amet orci. Aenean dignissim pellentesque
                  felis.
                </p>
              </div>
            </ScrollAnimate>
          </div>

          {/* Highlighted boxes */}
          <div className="relative pb-12 md:pb-20">
            {/* Blurred shape */}
            <div
              className="pointer-events-none absolute hidden sm:block bottom-0 left-1/2 -mb-20 -translate-x-1/2 opacity-50 blur-2xl"
              aria-hidden="true"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="434" height="427">
                <defs>
                  <linearGradient
                    id="bs2-a"
                    x1="19.609%"
                    x2="50%"
                    y1="14.544%"
                    y2="100%"
                  >
                    <stop offset="0%" stopColor="#6366F1" />
                    <stop offset="100%" stopColor="#6366F1" stopOpacity="0" />
                  </linearGradient>
                </defs>
                <path
                  fill="url(#bs2-a)"
                  fillRule="evenodd"
                  d="m346 898 461 369-284 58z"
                  transform="translate(-346 -898)"
                />
              </svg>
            </div>
            {/* Grid */}
            <Highlighter className="group grid gap-6 md:grid-cols-12">
              {/* Scoreboard */}
              <div className="md:col-span-7">
                <ScrollAnimate opacity slideUp timing={{ delay: 0, duration: 600 }} threshold={1}>
                  <HighlighterItem>
                    <div className="relative z-20 h-full overflow-hidden rounded-[inherit] bg-slate-900">
                      <div className="flex flex-col">
                        {/* Radial gradient */}
                        <div
                          className="pointer-events-none absolute bottom-0 left-1/2 -z-10 aspect-square w-1/2 -translate-x-1/2 translate-y-1/2"
                          aria-hidden="true"
                        >
                          <div className="translate-z-0 absolute inset-0 rounded-full bg-slate-800 blur-[80px]" />
                        </div>
                        {/* Text */}
                        <div className="order-1 shrink-0 space-y-8 p-6 md:order-none md:p-8">
                          <div className="md:max-w-[480px] ">
                            <h3 className="inline-flex bg-gradient-to-r from-slate-200/60 via-slate-200 to-slate-200/60 bg-clip-text pb-1 text-xl font-bold text-transparent">
                              Scoreboard
                            </h3>
                            <p className="text-slate-400">
                              Lorem ipsum dolor sit amet, consectetur adipiscing
                              elit. Duis nec aliquet massa. Fusce
                            </p>
                          </div>

                          <Scoreboard />
                        </div>
                      </div>
                    </div>
                  </HighlighterItem>
                </ScrollAnimate>
              </div>

              <div className="md:col-span-5">
                <ScrollAnimate opacity slideUp timing={{ delay: 200, duration: 600 }} threshold={1}>
                  <HighlighterItem>
                    <div className="relative z-20 h-full overflow-hidden rounded-[inherit] bg-slate-900">
                      <div className="flex flex-col">
                        {/* Radial gradient */}
                        <div
                          className="pointer-events-none absolute bottom-0 left-1/2 -z-10 aspect-square w-1/2 -translate-x-1/2 translate-y-1/2"
                          aria-hidden="true"
                        >
                          <div className="translate-z-0 absolute inset-0 rounded-full bg-slate-800 blur-[80px]" />
                        </div>
                        {/* Text */}
                        <div className="order-1 shrink-0 p-6 md:order-none md:max-w-[480px] md:p-8">
                          <div>
                            <h3 className="inline-flex bg-gradient-to-r from-slate-200/60 via-slate-200 to-slate-200/60 bg-clip-text pb-1 text-xl font-bold text-transparent">
                              How to get in
                            </h3>
                            <p className="text-slate-400">
                              Lorem ipsum dolor sit amet, consectetur adipiscing
                              elit. Duis nec aliquet massa. Fusce
                            </p>
                          </div>
                          <div className="mt-8">{/* Details here */}</div>
                        </div>
                      </div>
                    </div>
                  </HighlighterItem>
                </ScrollAnimate>
              </div>
            </Highlighter>
          </div>
        </div>
      </div>
    </section >
  );
}
