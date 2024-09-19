import type { Config } from "tailwindcss";

import baseConfig from "@genuineundead/tailwind-config";

export default {
  content: ["./src/**/*.{ts,tsx}", "../../packages/**/*.{ts,tsx}"],
  presets: [baseConfig],
  theme: {
    extend: {
      keyframes: {
        'float-random': {
          '0%': { transform: 'translate(0, 0)' },
          '25%': { transform: 'translate(-5px, 10px)' },
          '50%': { transform: 'translate(5px, -10px)' },
          '75%': { transform: 'translate(-5px, -5px)' },
          '100%': { transform: 'translate(0, 0)' },
        },
      },
      animation: {
        'float-random': 'float-random 5s ease-in-out infinite',
      },
    }
  }
} satisfies Config;
