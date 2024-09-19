import type { Config } from "tailwindcss";
import tailwindAnimatePlugin from "tailwindcss-animate";
import { fontFamily } from "tailwindcss/defaultTheme";


export default {
  darkMode: ["class"],
  content: [""],
  mode: 'jit',
  theme: {
    container: {
      center: true,
      padding: "1rem",
      screens: {
        "2xl": "1280px",
      },
    },
    extend: {
      colors: {
        section: "#100721",
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: `var(--radius)`,
        md: `calc(var(--radius) - 2px)`,
        sm: "calc(var(--radius) - 4px)",
      },
      fontFamily: {
        sans: ["var(--font-sans)", ...fontFamily.sans],
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        endless: {
          "0%": { transform: "translateY(0)" },
          "100%": { transform: "translateY(-245px)" },
        },
        pingM: {
          "50%" :{ transform: "scale(1.2)" },
          "100%" :{ transform: "scale(1)" },
        },
        shake:{
          "0%, 100%": {
            transform: "translateX(0)"
          },
          "10%, 30%, 50%, 70%, 90%": {
            transform: "translateX(-10px)"
          },
          "20%, 40%, 60%, 80%": {
            transform: "translateX(10px)"
          }
        }
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        endless: "endless 20s linear infinite",
        pingM: "pingM 1s cubic-bezier(0,0,0.2,1) infinite",
        shake: 'shake 1s ease-in-out ',
      },
    },
  },
  plugins: [tailwindAnimatePlugin],
} satisfies Config;