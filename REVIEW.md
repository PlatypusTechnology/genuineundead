# Genuine undead
reviewed by Paulo Martins (@paulovelho) on September/2024

## initial installing issues:
- missing packages:
Package `@genuineundead/eslint-config` version used was `"^0.2.0"`
There are no npm registrations of such packages. When contacted, developers replied that there were no packages from `@genuineundead` missing.
After some digging, content for this package was found inside `tooling/prettier`.
Every instance of `"@genuineundead/eslint-config": "^0.2.0"` was then replaced with `"@genuineundead/eslint-config": "workspace:^"`, that would be correctly resolved by `pnpm`

- missing connections:
A lot of different services are required to run the project.
The variables were added to `.env` file:
	- **Sanity**: created a new account and set `NEXT_PUBLIC_SANITY_PROJECT_ID` and `NEXT_PUBLIC_SANITY_DATASET` was set as `production`. `SANITY_API_TOKEN` was also filled from this service.
	- **Wallet Connect**: `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID` set. Couldn't find where to get `NEXT_PUBLIC_GU_ADDRESS` info.
	- **Alchemy**: Did create a new account and set `NEXT_PUBLIC_ALCHEMY_ID`. Coudln't find where to get `NEXT_PUBLIC_ALCHEMY_MAINNET_KEY` and `NEXT_PUBLIC_ALCHEMY_SEPOLIA_KEY`.

- vercel deploy:
Vercel deploy failed because `package.json` errors. I executed the recommended fix (running `pnpm install --no-frozen-lockfile`) and pushed back to the github account I created and linked with vercel. Still, redeploy didn't happen.

## dev running issues:
- missing content:
Sanity is empty. Therefore there are no content available, what threw error through the project. I included some null-checkers in the pages `comic-card.tsx` and `section-comic-highlight.tsx` and managed to run the project locally, but with empty content only.

## development highlights:
- good structure:
Structure is fine and well managed. Code is clean and lints are used. Previous developers did a good work on this.

- new technologies:
Most libraries versions are last-build or close-to-last. No heavy packages updates are required.

## development concerns:
- missing scope and documentation:
There are no clear scopes or requests. There are no clear missing tasks.
There are no workflows, staging/dev environments and development stories.

- a lot of external dependencies:
A single project that requires at least three external services to work (Sanity, Alchemy and WalletConnect). No previous account from dependencies are provided, so configuring external services is an extra challenge.

- missing content and structure:
Without a content - and, specially, without content structure, will be hard to find out how the data will arrive to the project and, therefore, implement any changes.

- react:
Project is built in react. Some learning curve might be expected, once it's not my main javascript framework.

