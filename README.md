# Genuine Undead Turborepo

## About

Here's a quick overview of what's included in this Turborepo.

## About

Here's a quick overview of what's included in this Turborepo.

```
.github
  └─ workflows
        └─ CI with pnpm cache setup
.vscode
  └─ Recommended extensions and settings for VSCode users
apps
  ├─ www
  |   ├─ Next.js 13
  |   ├─ React 18
  |   └─ Tailwind CSS
  └─ riddle-page
      └─ Page for entering riddle secrets
packages
  ├─ ui
  |   └─ shared UI components
  ├─ contracts
  |   └─ Ethereum contracts
  └─ core
      └─ Utilities and helpers shared amongst apps
tooling
  ├─ eslint
  |   └─ shared, fine-grained, eslint presets
  ├─ prettier
  |   └─ shared prettier configuration
  ├─ tailwind
  |   └─ shared tailwind configuration
  └─ typescript
      └─ shared tsconfig you can extend from
```

## Quick Start

To get it running, follow the steps below:

### Setup env variables

```bash
# You can get the SANITY_PROJECT_ID and SANITY_DATASET from the Sanity.io dashboard
NEXT_PUBLIC_SANITY_PROJECT_ID=""
NEXT_PUBLIC_SANITY_DATASET=""
SANITY_API_TOKEN=""
# You can get the NEXT_PUBLIC_ALCHEMY_ID from the Alchemy.com dashboard
NEXT_PUBLIC_ALCHEMY_ID=""
NEXT_PUBLIC_ALCHEMY_MAINNET_KEY=""
NEXT_PUBLIC_ALCHEMY_SEPOLIA_KEY=""
# You can get the walletconnect project id from the walletconnect dashboard
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=""
NEXT_PUBLIC_GU_ADDRESS=""
# You can generate a new SESSION_SECRET using `openssl rand -hex 32`
SESSION_SECRET=""

```

### 1. Setup dependencies

```bash
# Install dependencies
pnpm i

# Configure environment variables
# There is an `.env.example` in the root directory you can use for reference
cp .env.example .env
```

### 3. When it's time to add a new package

To add a new package, simply run `pnpm turbo gen init` in the monorepo root. This will prompt you for a package name as well as if you want to install any dependencies to the new package (of course you can also do this yourself later).

The generator sets up the `package.json`, `tsconfig.json` and a `index.ts`, as well as configures all the necessary configurations for tooling around your package such as formatting, linting and typechecking. When the package is created, you're ready to go build out the package.

## Deployment

### www

#### Deploy to Vercel

Let's deploy the Next.js application to [Vercel](https://vercel.com). If you've never deployed a Turborepo app there, don't worry, the steps are quite straightforward. You can also read the [official Turborepo guide](https://vercel.com/docs/concepts/monorepos/turborepo) on deploying to Vercel.

1. Create a new project on Vercel, select the `apps/www` folder as the root directory. Vercel will automatically detect that this is a Next.js app in a Turborepo and configure the build settings for you.

2. Done! The app should successfully deploy. Assign your domain and use that instead of `localhost` for the `url` in the Expo app so that your Expo app can communicate with your backend when you are not in development.

To deployt the ridde-page app, you can follow the same steps as above.

### Deploying the Ethereum contracts

To deploy the Ethereum contracts, you can use [Hardhat](https://hardhat.org/). The contracts are located in the `packages/contracts` folder. You can deploy them to a testnet or mainnet by running the following commands:

```bash
# Select contracts package
cd packages/contracts

# Compile the contracts
pnpm hardhat compile

# Deploy the contracts
pnpm hardhat run scripts/deployGU.ts --network <network>
```

# Studio Dashboard

The Studio is the part of the app where you can add or modify content.

## Tokens

To create a new token, head to the Studio and select the "Tokens" menu. You can create new token metadata by clicking on the icon (<img src="images/icon.png" height="20px" />).

The name is the token name that will appear on marketplaces, and the token ID is the same as the released token. Token metadata can be fully customised using the "Attributes" field, it follows the [OpenSea Metadata Standard](https://docs.opensea.io/docs/metadata-standards) guidelines

### Token Metadata

Token metadata is generated off-chain and can be modified at any time using the Studio under the "Tokens" section. When deploying the contract, ensure that the URL for the token metadata is correctly set to `{yourdomain.io}/api/token/{id}`.

This endpoint generates JSON-formatted metadata based on the data stored in the Studio.

## Comics

Comics are a set of images that make up the 3D rendered book. The slug represents the unique identifier and will define the URL where you can read the comic. Pages should be listed in descending order in the array.

### Using Token Gating in the Reader

To enable token gating, you must first set up the comic instance at `/studio`. Once that’s completed, create the token instances that correspond to the comic pages. Afterward, you can apply token gating to selected pages within the comic instance and, if necessary, link these pages to the tokens you previously created. Pages marked as `gated = true` will be restricted and can only be unlocked if the user possesses any token from the GUS collection. If a specific token is designated, only that token will unlock the page.

![Token gated page](token_gated.png)

## Users

This section should not be modified as it contains all the data necessary to run the scoreboard and user profiles. Please ignore.
