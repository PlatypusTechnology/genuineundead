import '@nomicfoundation/hardhat-chai-matchers';
import '@nomicfoundation/hardhat-ethers';
import "@nomicfoundation/hardhat-toolbox";
import '@typechain/hardhat';
import { config as env } from 'dotenv';
import 'hardhat-gas-reporter';
import type { HardhatUserConfig } from "hardhat/config";

env();

const { ALCHEMY_KEY } = process.env;
const { ALCHEMY_KEY_MAINNET } = process.env;

const GOERLI_PRIVATE_KEY = process.env.GOERLI_KEY ?? '';
const GOERLI_PRIVATE_KEY2 = process.env.GOERLI_KEY2 ?? '';
const GOERLI_PRIVATE_KEY3 = process.env.GOERLI_KEY3 ?? '';

const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY ?? '';

const COINMARKETCAP_API_KEY = process.env.COINMARKETCAP_API_KEY!;




const config: HardhatUserConfig = {
  solidity: "0.8.19",
  typechain: {
    outDir: 'typechain'
  },
  solidity: {
    compilers: [
      {
        version: '0.5.10',
        settings: {
          optimizer: {
            enabled: true,
            runs: 99999,
          },
        },
      },
      {
        version: '0.8.19',
        settings: {
          optimizer: {
            enabled: true,
            runs: 10_000,
          },
          viaIR: true,
        },
      },
    ],
  },
  networks: {
    sepolia: {
      chainId: 11155111,
      url: `https://eth-sepolia.g.alchemy.com/v2/${ALCHEMY_KEY}`,
      ...(GOERLI_PRIVATE_KEY.length >0 && {
        accounts: [GOERLI_PRIVATE_KEY, GOERLI_PRIVATE_KEY2, GOERLI_PRIVATE_KEY3]
      })
    },
    // TODO: Setup mainnet for contract deployment

    hardhat: {
      forking: {
        url: 'https://eth-mainnet.g.alchemy.com/v2/' + ALCHEMY_KEY_MAINNET,
      },
    },
  },
  ...(COINMARKETCAP_API_KEY && {
    gasReporter: {
      enabled: true,
      coinmarketcap: COINMARKETCAP_API_KEY,
      gasPrice: 30,
    },

  }),
  ...(ETHERSCAN_API_KEY && {

    etherscan: {
      apiKey: ETHERSCAN_API_KEY,
    }
  }) 
};

export default config;
