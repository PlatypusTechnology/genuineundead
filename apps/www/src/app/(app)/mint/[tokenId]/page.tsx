import { GU_ABI } from '@genuineundead/contracts';
import { chainClient } from "@genuineundead/core";
import { notFound } from "next/navigation";
import type { Token } from "types";
import { ComicHighlightGrid } from "~/components/comic-highlight-grid";
import MintBox from "~/components/mint-box";
import Particles from "~/components/particles";
import ScrollAnimate from '~/components/scroll-animate';
import { SelectMintEdition } from "~/components/select-mint-editiro";
import { ShareButton } from "~/components/share-button";
import { server } from "~/sanity/lib/server";


interface MintPageProps {
  params: {
    tokenId: string;
  };
}

export default async function MintPage({ params: { tokenId } }: MintPageProps) {

  const tokens = await server().fetch<Token[]>(`*[_type == 'token']`);
  const currentToken = tokens.find(t => t.tokenId === Number(tokenId));
  if (!currentToken) return notFound();

  const price = await chainClient.readContract({
    address: process.env.NEXT_PUBLIC_GU_ADDRESS! as `0x${string}`,
    abi: GU_ABI,
    functionName: 'mintPrice'
  }) as bigint

  const supplyCap = (await chainClient.readContract({
    address: process.env.NEXT_PUBLIC_GU_ADDRESS! as `0x${string}`,
    abi: GU_ABI,
    functionName: "_supplyCaps",
    args: [Number(tokenId)],
  })) as bigint;

  const supply = (await chainClient.readContract({
    address: process.env.NEXT_PUBLIC_GU_ADDRESS! as `0x${string}`,
    abi: GU_ABI,
    functionName: "totalSupply",
    args: [Number(tokenId)],
  })) as bigint;


  // TODO: Define max mints/tx/wallet

  return (
    <div className="relative min-h-screen">
      <section className="overflow-hidden min-h-screen">
        <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
          <Particles className="absolute inset-0 -z-10" />

          <div className="pointer-events-none absolute min-h-screen inset-0 -z-10 overflow-hidden  bg-purple-700/20 lg:-mx-28" aria-hidden="true" />

          <div className="pt-56 pb-32 md:pb-56 md:pt-72">
            <div>
              {/* Section content */}
              <div className="mx-auto flex max-w-xl flex-col space-y-8 space-y-reverse md:max-w-none md:flex-row md:space-x-8 md:space-y-0 lg:space-x-16 xl:space-x-20">
                {/* Content */}

                <div className="order-1 md:mt-10 max-md:text-center md:order-none md:w-7/12 lg:w-1/2">
                  <ScrollAnimate opacity scaleUp>


                    <ShareButton buttonProps={{ className: "mb-4" }} />
                    <div className="mb-4 flex flex-col md:flex-row items-center gap-4 ">
                      <h1 className="text-3xl font-extrabold md:text-4xl lg:text-5xl">
                        Page
                      </h1>

                      <SelectMintEdition
                        value={currentToken.tokenId.toString()}
                        editions={tokens.map(t => ({ slug: t.tokenId.toString(), label: `#${t.tokenId.toString()}` }))}
                      />
                    </div>
                    <MintBox token={currentToken} price={String(price)} />
                  </ScrollAnimate>
                </div>

                {/* Image */}
                <div className="md:w-5/12 lg:w-1/2">
                  <ScrollAnimate scaleUp opacity>

                    <div className="relative -mt-12 py-24">
                      {/* Particles animation */}
                      <Particles
                        className="absolute inset-0 -z-10"
                        quantity={8}
                        staticity={30}
                      />

                      <ComicHighlightGrid token={tokens[0]} />
                    </div>
                  </ScrollAnimate>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 md:mt-4 mt-10 sm:grid-cols-2 lg:grid-cols-4">
              <ScrollAnimate slideUp opacity timing={{ delay: 200, duration: 600 }}>
                <div className="rounded-lg border px-4 py-6 sm:px-6 lg:px-8">
                  <p className="text-sm font-medium leading-6 text-muted-foreground">
                    Minted
                  </p>
                  <p className="mt-2 flex items-baseline gap-x-2">
                    <span className="text-4xl font-semibold tracking-tight">
                      {Number(supply)} / {Number(supplyCap)}
                    </span>
                  </p>
                </div>
              </ScrollAnimate>
              <ScrollAnimate slideUp opacity timing={{ delay: 400, duration: 600 }}>
                <div className="rounded-lg border px-4 py-6 sm:px-6 lg:px-8">
                  <p className="text-sm font-medium leading-6 text-muted-foreground">
                    xyz
                  </p>
                  <p className="mt-2 flex items-baseline gap-x-2">
                    <span className="text-4xl font-semibold tracking-tight">
                      100
                    </span>
                    <span className="text-sm text-muted-foreground">mins</span>
                  </p>
                </div>
              </ScrollAnimate>
              <ScrollAnimate slideUp opacity timing={{ delay: 600, duration: 600 }}>
                <div className="rounded-lg border px-4 py-6 sm:px-6 lg:px-8">
                  <p className="text-sm font-medium leading-6 text-muted-foreground">
                    xyz
                  </p>
                  <p className="mt-2 flex items-baseline gap-x-2">
                    <span className="text-4xl font-semibold tracking-tight">
                      3
                    </span>
                  </p>
                </div>
              </ScrollAnimate>
              <ScrollAnimate slideUp opacity timing={{ delay: 800, duration: 600 }}>
                <div className="rounded-lg border px-4 py-6 sm:px-6 lg:px-8">
                  <p className="text-sm font-medium leading-6 text-muted-foreground">
                    xyz
                  </p>

                  <p className="mt-2 flex items-baseline gap-x-2">
                    <span className="text-4xl font-semibold tracking-tight">
                      10
                    </span>
                  </p>
                </div>
              </ScrollAnimate>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}