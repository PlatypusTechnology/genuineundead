// Importing env files here to validate on build
import "./src/env.mjs";

// @Chris - Note: To import other env files, you can do so like this:
// import "@genuineundead/auth/env.mjs";

/** @type {import("next").NextConfig} */
const config = {
  experimental: {
    serverActions: true,
  },
  reactStrictMode: false,
  /** Enables hot reloading for local packages without a build step */
  transpilePackages: ["@genuineundead/ui", "@genuineundead/core"],
  /** We already do linting and typechecking as separate tasks in CI */
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },

  webpack: (config) => {
    config.resolve.fallback = { fs: false, net: false, tls: false };
    config.externals.push("pino-pretty", "lokijs", "encoding");

    return config;
  },
  images: {
    domains: ["cdn.sanity.io", "img-cdn.magiceden.dev"],
  },
};

export default config;
