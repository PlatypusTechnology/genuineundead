import { createPublicClient, http } from "viem";
import { mainnet, sepolia } from "viem/chains";

const chainClient = createPublicClient({ 
    chain: process.env.NEXT_PUBLIC_VERCEL_ENV === 'production' ? mainnet : sepolia,
    transport: http()
  })

  export { chainClient };
