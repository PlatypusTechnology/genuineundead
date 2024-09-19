import { Network } from "alchemy-sdk";
import { AlchemyMultichainClient } from "./mutlichainAlchemy";

// Default config to use for all networks.
const defaultConfig = {
  apiKey: process.env.NEXT_PUBLIC_ALCHEMY_MAINNET_KEY,
  network: Network.ETH_MAINNET,
};

// Include optional setting overrides for specific networks.
const overrides = {
  [Network.ETH_SEPOLIA]: {
    apiKey: process.env.NEXT_PUBLIC_ALCHEMY_SEPOLIA_KEY,
    maxRetries: 10,
  },
};

export const alchemyClient = new AlchemyMultichainClient(
  defaultConfig,
  overrides,
);

export { Network };
