"use client";

import type { SIWEConfig } from "connectkit";
import { ConnectKitProvider, SIWEProvider, getDefaultConfig } from "connectkit";
import { appConfig } from "node_modules/@genuineundead/core";

import type { FC, PropsWithChildren } from "react";
import { SiweMessage } from "siwe";
import { WagmiConfig, createConfig, mainnet, sepolia } from "wagmi";




const siweConfig = {
  getNonce: async () => {
    const res = await fetch(`/api/siwe`, { method: "PUT" });
    if (!res.ok) throw new Error("Failed to fetch SIWE nonce");

    return res.text();
  },
  createMessage: ({ nonce, address, chainId }) => {
    return new SiweMessage({
      nonce,
      chainId,
      address,
      version: "1",
      uri: window.location.origin,
      domain: window.location.host,
      statement: "Sign In With Ethereum to prove you control this wallet.",
    }).prepareMessage();
  },
  verifyMessage: ({ message, signature }) => {
    return fetch(`/api/siwe`, {
      method: "POST",
      body: JSON.stringify({ message, signature }),
      headers: { "Content-Type": "application/json" },
    }).then((res) => res.ok);
  },
  getSession: async () => {
    const res = await fetch(`/api/siwe`);
    if (!res.ok) throw new Error("Failed to fetch SIWE session");

    const { address, chainId } = await res.json();
    return address && chainId ? { address, chainId } : null;
  },
  signOut: () => fetch(`/api/siwe`, { method: "DELETE" }).then((res) => res.ok),
} satisfies SIWEConfig;

const wagmiConfig = createConfig(
  getDefaultConfig({
    appName: appConfig.name,
    alchemyId: process.env.NEXT_PUBLIC_ALCHEMY_ID,
    walletConnectProjectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID!,
    chains: [process.env.VERCEL_ENV === 'production' ? mainnet : sepolia]
  }),
);

const Web3Provider: FC<PropsWithChildren<{}>> = ({ children }: any) => (
  <WagmiConfig config={wagmiConfig}>
    <SIWEProvider {...siweConfig}>
      <ConnectKitProvider>{children}</ConnectKitProvider>
    </SIWEProvider>
  </WagmiConfig>
);

export default Web3Provider;
