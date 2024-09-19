import { alchemyClient, Network, Session } from "@genuineundead/core";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@genuineundead/ui";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@genuineundead/ui/components/tabs";
import { cookies } from "next/dist/client/components/headers";
import Image from "next/image";
import { redirect } from "next/navigation";
import { AccountHeader } from "~/components/account-header";
import ClientRoom from "~/components/client-room";
import { ProfileForm } from "~/components/profile-form";

import { server } from "~/sanity/lib/server";

export const dynamic = "force-dynamic";

const placeholderImage =
  "https://img-cdn.magiceden.dev/rs:fill:800:0:0/plain/https://www.larvalabs.com/cryptopunks/cryptopunk1628.png";

const address = process.env.NEXT_PUBLIC_GU_ADDRESS;

function getMagicEdenLink(nftId: number | string) {
  return `https://magiceden.io/item-details/ethereum/${address}/${nftId.toString()}`;
}

function getOpenSeaLink(nftId: number | string) {
  return `https://opensea.io/assets/ethereum/${address}/${nftId.toString()}`;
}


export default async function AccountPage() {
  const s = await Session.fromCookie(cookies());

  if (!s.address) return redirect("/");

  const user = await server().fetch(
    `*[_type == 'user' && address == '${s.address}'][0]`,
  );

  if (!user) return redirect("/");
  const alchemy = alchemyClient.forNetwork(
    process.env.VERCEL_ENV === "production"
      ? Network.ETH_MAINNET
      : Network.ETH_SEPOLIA,
  );

  const { ownedNfts: nfts } = await alchemy.nft.getNftsForOwner(s.address, {
    contractAddresses: [process.env.NEXT_PUBLIC_GU_ADDRESS!],
  });

  return (
    <div className="relative min-h-screen">
      <AccountHeader />

      <section className="py-16">
        <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
          <div className="flex w-full items-center justify-center">
            <Tabs defaultValue="account" className="w-full">
              <div className="mx-auto w-fit">
                <TabsList className="mx-auto mb-8">
                  <TabsTrigger value="account">Account</TabsTrigger>
                  <TabsTrigger value="inventory">Inventory</TabsTrigger>
                  <TabsTrigger value="room">Room</TabsTrigger>
                </TabsList>
              </div>

              <TabsContent value="account" className="mx-auto w-full max-w-md">
                <ProfileForm address={s.address} user={user} />
              </TabsContent>

              <TabsContent
                value="inventory"
                className="mx-auto w-full max-w-2xl"
              >
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>#</TableHead>
                      <TableHead>
                        <span className="sr-only">NFT Image</span>
                      </TableHead>
                      <TableHead>NFT #</TableHead>
                      <TableHead>Links</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {nfts.map((nft, index) => (
                      <TableRow key={nft.tokenId}>
                        <TableCell>{index + 1}</TableCell>
                        <TableCell>
                          <Image
                            src={nft.media[0] ? nft.media[0].gateway : placeholderImage}
                            alt={`NFT ${nft.tokenId}`}
                            className="rounded-md"
                            width={64}
                            height={64}
                            quality={90}
                            priority
                          />
                        </TableCell>
                        <TableCell>{nft.tokenId}</TableCell>
                        <TableCell>
                          <div className="inline-flex gap-4">
                            <a
                              href={getMagicEdenLink(nft.tokenId)}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-500 hover:underline"
                            >
                              <svg
                                viewBox="0 0 27 16"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                                color="#E42575"
                                width={24}
                                height={24}
                                className="size-5"
                              >
                                <path
                                  d="M18.8759 4.07353L20.4363 5.90687C20.6149 6.11279 20.7733 6.28217 20.8373 6.37849C21.304 6.84225 21.5656 7.46902 21.5653 8.12214C21.5214 8.89268 21.0193 9.41744 20.5542 9.97873L19.4623 11.2607L18.8928 11.925C18.8723 11.9479 18.8592 11.9762 18.8549 12.0064C18.8506 12.0366 18.8554 12.0674 18.8686 12.0949C18.8819 12.1225 18.9031 12.1456 18.9295 12.1615C18.956 12.1773 18.9865 12.1851 19.0175 12.184H24.7096C25.579 12.184 26.6743 12.9147 26.6103 14.024C26.6085 14.5282 26.4045 15.0112 26.0427 15.3678C25.681 15.7243 25.1908 15.9253 24.6792 15.9271H15.7653C15.1789 15.9271 13.6017 15.9902 13.1602 14.6451C13.0663 14.364 13.0535 14.0628 13.1232 13.7749C13.2515 13.3493 13.4545 12.9491 13.723 12.5926C14.1713 11.9283 14.6566 11.2641 15.1351 10.6197C15.7518 9.77613 16.3854 8.9591 17.0089 8.0989C17.031 8.0709 17.043 8.03642 17.043 8.00092C17.043 7.96542 17.031 7.93094 17.0089 7.90294L14.7442 5.24594C14.7294 5.22668 14.7103 5.21105 14.6884 5.20029C14.6665 5.18954 14.6423 5.18394 14.6178 5.18394C14.5933 5.18394 14.5691 5.18954 14.5472 5.20029C14.5253 5.21105 14.5062 5.22668 14.4914 5.24594C13.8848 6.053 11.2292 9.62667 10.663 10.3507C10.0968 11.0747 8.70159 11.1146 7.92984 10.3507L4.38787 6.84678C4.36524 6.82441 4.33638 6.80916 4.30495 6.80298C4.27352 6.79679 4.24093 6.79995 4.21133 6.81205C4.18172 6.82415 4.15642 6.84464 4.13865 6.87093C4.12089 6.89722 4.11144 6.92812 4.11152 6.95971V13.6985C4.11986 14.1767 3.97616 14.6455 3.70058 15.0392C3.425 15.4329 3.03133 15.7318 2.57475 15.8939C2.28301 15.994 1.97122 16.0238 1.66538 15.981C1.35954 15.9382 1.06852 15.824 0.81657 15.6479C0.564624 15.4717 0.359058 15.2388 0.217014 14.9684C0.0749705 14.6981 0.000564258 14.3982 0 14.0938V1.97782C0.0203051 1.54119 0.179723 1.12198 0.455602 0.77974C0.731481 0.437504 1.10979 0.189657 1.53676 0.0714183C1.90302 -0.0247429 2.28856 -0.0237807 2.65431 0.0742068C3.02007 0.172194 3.35304 0.363725 3.61949 0.62939L9.06556 6.00318C9.08186 6.01951 9.1016 6.0321 9.12339 6.04006C9.14517 6.04802 9.16847 6.05117 9.19163 6.04927C9.21478 6.04736 9.23723 6.04046 9.25738 6.02906C9.27753 6.01765 9.29488 6.00201 9.30821 5.98326L13.1771 0.705779C13.3559 0.491534 13.58 0.318396 13.8338 0.198491C14.0876 0.078586 14.365 0.0148124 14.6464 0.0116362H24.7096C24.985 0.0120836 25.2571 0.0704765 25.5077 0.182911C25.7584 0.295345 25.9818 0.459228 26.163 0.663599C26.3442 0.86797 26.4791 1.10812 26.5585 1.36798C26.638 1.62785 26.6602 1.90144 26.6238 2.17045C26.5529 2.63712 26.3126 3.0626 25.9476 3.36798C25.5826 3.67335 25.1175 3.83789 24.6388 3.83108H19.004C18.9757 3.83176 18.9481 3.83991 18.924 3.85468C18.9 3.86945 18.8804 3.8903 18.8673 3.91506C18.8543 3.93982 18.8482 3.96758 18.8497 3.99545C18.8512 4.02332 18.8602 4.05029 18.8759 4.07353Z"
                                  fill="currentColor"
                                />
                              </svg>
                            </a>
                            <a
                              href={getOpenSeaLink(nft.tokenId)}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-500 hover:underline"
                            >
                              <span className="sr-only">OpenSea</span>
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 360 360"
                                fill="none"
                                width={24}
                                height={24}
                                className="size-5"
                              >
                                <g clipPath="url(#clip0_2_57)">
                                  <g clipPath="url(#clip1_2_57)">
                                    <path
                                      d="M252.072 212.292C245.826 220.662 232.686 234.558 225.378 234.558H191.412V212.274H218.466C222.336 212.274 226.026 210.708 228.69 207.954C242.586 193.554 250.614 176.418 250.614 158.04C250.614 126.684 227.178 98.964 191.394 82.26V67.284C191.394 60.84 186.174 55.62 179.73 55.62C173.286 55.62 168.066 60.84 168.066 67.284V73.494C158.04 70.56 147.42 68.328 136.332 67.05C154.692 86.994 165.906 113.67 165.906 142.92C165.906 169.146 156.942 193.23 141.876 212.31H168.066V234.63H129.726C124.542 234.63 120.33 230.436 120.33 225.234V215.478C120.33 213.768 118.944 212.364 117.216 212.364H66.672C65.682 212.364 64.836 213.174 64.836 214.164C64.8 254.088 96.39 284.058 134.172 284.058H240.822C266.382 284.058 277.812 251.298 292.788 230.454C298.602 222.39 312.552 215.91 316.782 214.11C317.556 213.786 318.006 213.066 318.006 212.22V199.26C318.006 197.946 316.71 196.956 315.432 197.316C315.432 197.316 253.782 211.482 253.062 211.68C252.342 211.896 252.072 212.31 252.072 212.31V212.292Z"
                                      fill="white"
                                    />
                                    <path
                                      d="M146.16 142.83C146.16 122.724 139.266 104.22 127.746 89.586L69.732 189.972H132.138C141.012 176.436 146.178 160.236 146.178 142.848L146.16 142.83Z"
                                      fill="white"
                                    />
                                    <path
                                      d="M181.566 -5.19844e-06C80.91 -0.828005 -0.82799 80.91 1.00604e-05 181.566C0.84601 279.306 80.694 359.172 178.416 359.982C279.072 360.846 360.846 279.072 359.982 178.416C359.172 80.712 279.306 0.845995 181.566 -5.19844e-06ZM127.746 89.586C139.266 104.22 146.16 122.742 146.16 142.83C146.16 160.236 140.994 176.436 132.12 189.954H69.714L127.728 89.568L127.746 89.586ZM318.006 199.242V212.202C318.006 213.048 317.556 213.768 316.782 214.092C312.552 215.892 298.602 222.372 292.788 230.436C277.812 251.28 266.382 284.04 240.822 284.04H134.172C96.408 284.04 64.818 254.07 64.836 214.146C64.836 213.156 65.682 212.346 66.672 212.346H117.216C118.962 212.346 120.33 213.75 120.33 215.46V225.216C120.33 230.4 124.524 234.612 129.726 234.612H168.066V212.292H141.876C156.942 193.212 165.906 169.128 165.906 142.902C165.906 113.652 154.692 86.976 136.332 67.032C147.438 68.328 158.058 70.542 168.066 73.476V67.266C168.066 60.822 173.286 55.602 179.73 55.602C186.174 55.602 191.394 60.822 191.394 67.266V82.242C227.178 98.946 250.614 126.666 250.614 158.022C250.614 176.418 242.568 193.536 228.69 207.936C226.026 210.69 222.336 212.256 218.466 212.256H191.412V234.54H225.378C232.704 234.54 245.844 220.644 252.072 212.274C252.072 212.274 252.342 211.86 253.062 211.644C253.782 211.428 315.432 197.28 315.432 197.28C316.728 196.92 318.006 197.91 318.006 199.224V199.242Z"
                                      fill="#0086FF"
                                    />
                                  </g>
                                </g>
                                <defs>
                                  <clipPath id="clip0_2_57">
                                    <rect
                                      width={360}
                                      height={360}
                                      fill="white"
                                    />
                                  </clipPath>
                                  <clipPath id="clip1_2_57">
                                    <rect
                                      width={360}
                                      height={360}
                                      fill="white"
                                    />
                                  </clipPath>
                                </defs>
                              </svg>
                            </a>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                  <TableFooter>
                    <TableRow>
                      <TableCell colSpan={4}>
                        Total owned: {nfts.length}
                      </TableCell>
                    </TableRow>
                  </TableFooter>
                </Table>
              </TabsContent>

              <TabsContent value="room">
                <ClientRoom />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </section>
    </div>
  );
}
