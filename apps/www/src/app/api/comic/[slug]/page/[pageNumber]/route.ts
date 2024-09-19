 
import { alchemyClient, Network, Session } from "@genuineundead/core";
import type { SanityAsset } from "@sanity/image-url/lib/types/types";

import type { NextRequest } from "next/server";
import type { Page, Token } from "types";

import { urlForImage } from "~/sanity/lib/image";
import { server } from "~/sanity/lib/server";

export const dynamic = "force-dynamic";
export async function GET(
  req: NextRequest,
  {
    params: { slug, pageNumber },
  }: { params: { slug: string; pageNumber: string } },
) {
  const data = await server().fetch<{pages: Page}>(
    "*[_type == 'comic' && slug.current == '" +
      slug +
      "'][0]{ pages[-" + (Number(pageNumber)) + "]{ ..., tokens[]-> }  }",
  );


  const session = await Session.fromRequest(req);
  if (!data?.pages) return Response.error();
  

  const url = urlForImage(data.pages as SanityAsset);
  let isGated: boolean = data.pages.gated;
  const alchemy = alchemyClient.forNetwork(
    process.env.VERCEL_ENV === "production"
      ? Network.ETH_MAINNET
      : Network.ETH_SEPOLIA,
  );

  if (isGated && session?.address ) {
    const tokensToOwn: Token[] | undefined = data.pages.tokens;


    if (!tokensToOwn) {
      isGated = !(await alchemy.nft.verifyNftOwnership(
        session.address,
        process.env.NEXT_PUBLIC_GU_ADDRESS!,
      ));
    } else {
      const tokens = await alchemy.nft.getNftsForOwner(session.address, {
        contractAddresses: [process.env.NEXT_PUBLIC_GU_ADDRESS!],
      });
      isGated = !tokens.ownedNfts.some((nft) =>
        Boolean(tokensToOwn.find( t => t.tokenId === Number(nft.tokenId)))
      );
    }
  }
  const finalUrl = data.pages.gated && isGated ? url.blur(300) : url;
  const response = await fetch(finalUrl.width(800).url());
  return new Response(response.body, {
    headers: {
      ...response.headers, // copy the previous headers
    },
  });
}
