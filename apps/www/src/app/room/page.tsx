import { alchemyClient, Network, Session } from '@genuineundead/core';
import { server } from '@genuineundead/core/sanity/lib/server';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

import ComicReaderPage from '~/components/room';

export default async function Page({ params }: { params: { slug: string } }) {
  // Fetch session or authentication information
  const s = await Session.fromCookie(cookies());

  if (!s.address) return redirect("/");

  // Fetch user data
  const user = await server().fetch(
    `*[_type == 'user' && address == '${s.address}'][0]`,
  );

  if (!user) return redirect("/");

  // Set up Alchemy client for the appropriate network
  const alchemy = alchemyClient.forNetwork(
    process.env.VERCEL_ENV === "production"
      ? Network.ETH_MAINNET
      : Network.ETH_SEPOLIA,
  );

  // Fetch NFTs owned by the user
  const { ownedNfts: nfts } = await alchemy.nft.getNftsForOwner(s.address, {
    contractAddresses: [process.env.NEXT_PUBLIC_GU_ADDRESS!],
  });

  // Render the client component and pass the fetched data as props
  return <ComicReaderPage nfts={nfts} />;
}