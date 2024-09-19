import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@genuineundead/core";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
        outline: "text-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export interface GradientBadgeProps
  extends React.HTMLAttributes<HTMLDivElement> {}

function GradientBadge({ className, ...props }: GradientBadgeProps) {
  return (
    <div className="relative inline-flex before:absolute before:inset-0 before:bg-purple-500 before:blur-md">
      <div
        className={cn(
          "inline-flex items-center justify-center rounded-full border border-transparent text-sm font-medium transition duration-150 ease-in-out",
          "group relative px-2.5 py-0.5 text-slate-300 shadow transition duration-150 ease-in-out [background:linear-gradient(theme(colors.purple.500),_theme(colors.purple.500))_padding-box,_linear-gradient(theme(colors.purple.500),_theme(colors.purple.200)_75%,_theme(colors.transparent)_100%)_border-box] before:pointer-events-none before:absolute before:inset-0 before:rounded-full before:bg-slate-800/50 hover:text-white",
          className,
        )}
        {...props}
      >
        <span className="relative inline-flex items-center">
          {props.children}
        </span>
      </div>
    </div>
  );
}

export { Badge, badgeVariants, GradientBadge };
