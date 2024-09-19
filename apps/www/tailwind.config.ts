import type { Config } from "tailwindcss";

import baseConfig from "@genuineundead/tailwind-config";

export default {
  content: ["./src/**/*.{ts,tsx}", "../../packages/**/*.{ts,tsx}"],
  presets: [baseConfig],
} satisfies Config;
