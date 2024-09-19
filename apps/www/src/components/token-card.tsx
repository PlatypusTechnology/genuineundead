import { cn } from "@genuineundead/core";
import Image from "next/image";
import type { Token } from "types";
import { urlForImage } from "~/sanity/lib/image";

export function TokenCard({
  token,
  className,
}: {
  token: Token;
  className?: string;
}) {
  return (
    <div className={cn("relative max-w-xs", className)}>
      <div className="relative z-0 h-full w-full">
        <Image
          src="/card-bg.png"
          alt="Background"
          width={1002}
          height={1628}
          className="absolute inset-0 aspect-[1/1.4142] h-full w-full"
        />

        <div className="pt-4.5 relative z-10 w-full overflow-hidden px-4 pb-0 sm:pb-2 pt-4 sm:px-7 sm:pt-7">
          <Image
            src={urlForImage(token.tokenImage).url()}
            width={250}
            height={407}
            alt={token.name}
            className="rounded-xl"
          />
        </div>

        <div className="pb-7 sm:pb-10">
          <div className="relative z-10 px-4 text-left sm:px-7">
            <span className="font-mono text-[10px] font-semibold uppercase tracking-wide text-white sm:text-xs">
              {token.tokenId}
            </span>
          </div>

          <div className="relative z-10 px-4 text-left sm:px-7">
            <h3 className="text-sm font-semibold text-white sm:text-lg md:text-xl">
              {token.name}
            </h3>
          </div>
        </div>
      </div>
    </div>
  );
}