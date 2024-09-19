import { cn } from "@genuineundead/core";

import type { Token } from "types";
import type { Comic } from "~/lib/comics";
import { ComicCard } from "./comic-card";
import { TokenCard } from "./token-card";

interface ComicHighlightGridProps {
  token?: Token;
  comic?: Comic;
  className?: string;
  tokenCardClassName?: string;
}

export function ComicHighlightGrid({
  token,
  comic,
  className,
  tokenCardClassName,
}: ComicHighlightGridProps) {
  return (
    <div className={cn("flex items-center justify-center", className)}>
      <div className="relative flex h-32 w-32 items-center justify-center sm:h-48 sm:w-48">
        {/* Halo effect */}
        <svg
          className="pointer-events-none absolute inset-0 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transform blur-md will-change-transform"
          width="380"
          height="380"
          viewBox="0 0 480 480"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="pulse-a" x1="50%" x2="50%" y1="100%" y2="0%">
              <stop offset="0%" stopColor="#A855F7" />
              <stop offset="76.382%" stopColor="#FAF5FF" />
              <stop offset="100%" stopColor="#6366F1" />
            </linearGradient>
          </defs>
          <g fillRule="evenodd">
            <path
              className="pulse"
              fill="url(#pulse-a)"
              fillRule="evenodd"
              d="M240,0 C372.5484,0 480,107.4516 480,240 C480,372.5484 372.5484,480 240,480 C107.4516,480 0,372.5484 0,240 C0,107.4516 107.4516,0 240,0 Z M240,88.8 C156.4944,88.8 88.8,156.4944 88.8,240 C88.8,323.5056 156.4944,391.2 240,391.2 C323.5056,391.2 391.2,323.5056 391.2,240 C391.2,156.4944 323.5056,88.8 240,88.8 Z"
            />
            <path
              className="pulse pulse-1"
              fill="url(#pulse-a)"
              fillRule="evenodd"
              d="M240,0 C372.5484,0 480,107.4516 480,240 C480,372.5484 372.5484,480 240,480 C107.4516,480 0,372.5484 0,240 C0,107.4516 107.4516,0 240,0 Z M240,88.8 C156.4944,88.8 88.8,156.4944 88.8,240 C88.8,323.5056 156.4944,391.2 240,391.2 C323.5056,391.2 391.2,323.5056 391.2,240 C391.2,156.4944 323.5056,88.8 240,88.8 Z"
            />
            <path
              className="pulse pulse-2"
              fill="url(#pulse-a)"
              fillRule="evenodd"
              d="M240,0 C372.5484,0 480,107.4516 480,240 C480,372.5484 372.5484,480 240,480 C107.4516,480 0,372.5484 0,240 C0,107.4516 107.4516,0 240,0 Z M240,88.8 C156.4944,88.8 88.8,156.4944 88.8,240 C88.8,323.5056 156.4944,391.2 240,391.2 C323.5056,391.2 391.2,323.5056 391.2,240 C391.2,156.4944 323.5056,88.8 240,88.8 Z"
            />
          </g>
        </svg>
        {/* Grid */}
        <div className="pointer-events-none absolute inset-0 left-1/2 top-1/2 h-[200px] w-[200px] -translate-x-1/2 -translate-y-1/2 transform overflow-hidden rounded-full [mask-image:_radial-gradient(black,_transparent_60%)] sm:h-[500px] sm:w-[500px]">
          <div className="h-[200%] animate-endless">
            <div className="absolute inset-0 opacity-20 blur-[2px] [background:_repeating-linear-gradient(transparent,_transparent_48px,_theme(colors.white)_48px,_theme(colors.white)_49px)]" />
            <div className="absolute inset-0 [background:_repeating-linear-gradient(transparent,_transparent_48px,_theme(colors.purple.500)_48px,_theme(colors.purple.500)_49px)]" />
            <div className="absolute inset-0 opacity-20 blur-[2px] [background:_repeating-linear-gradient(90deg,transparent,_transparent_48px,_theme(colors.white)_48px,_theme(colors.white)_49px)]" />
            <div className="absolute inset-0 [background:_repeating-linear-gradient(90deg,transparent,_transparent_48px,_theme(colors.purple.500)_48px,_theme(colors.purple.500)_49px)]" />
          </div>
        </div>

        <div className="relative flex">
          {comic ?  (
            <ComicCard
              comic={comic}
              className={cn("w-44 rotate-12 sm:w-56", tokenCardClassName)}
            />

          ) : token? (
            <TokenCard
            token={token}
            className={cn("w-44 rotate-12 sm:w-56", tokenCardClassName)}
          />
          ):''}
        </div>
      </div>
    </div>
  );
}
