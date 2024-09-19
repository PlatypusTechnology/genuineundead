import { Network } from 'alchemy-sdk';
import { mainnet, sepolia } from 'viem/chains';

// Define constants for network IDs
const SEPOLIA_NETWORK_ID = 11155111;
const MAINNET_NETWORK_ID = 1;

const idToChainMap: Record<number, typeof sepolia | typeof mainnet> = {
  [SEPOLIA_NETWORK_ID]: sepolia,
  [MAINNET_NETWORK_ID]: mainnet,
};

export const chainFromId = (networkId: string | number) => {
  return idToChainMap[Number(networkId)] ?? null;
};

const idToNetworkMap: Record<number, Network> = {
  [SEPOLIA_NETWORK_ID]: Network.ETH_SEPOLIA,
  [MAINNET_NETWORK_ID]: Network.ETH_MAINNET,
};

export const networkFromId = (networkId: string | number): Network | null => {
  return idToNetworkMap[Number(networkId)] ?? null;
};