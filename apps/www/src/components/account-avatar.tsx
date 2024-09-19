"use client";

import { useAccount, useEnsAvatar, useEnsName } from "wagmi";
import { cn } from "@genuineundead/core";
import { Avatar, AvatarFallback, AvatarImage } from "@genuineundead/ui";
import { Skeleton } from "@genuineundead/ui/components/skeleton";
import { Icons } from "./icons";

export function AccountAvatar({
  sizeClassName = "h-16 w-16 sm:h-20 sm:w-20",
  fallbackIconClassName = "h-8 w-8 sm:h-10 sm:w-10",
  fallbackTextClassName = "text-2xl font-bold",
}: {
  fallbackTextClassName?: string;
  sizeClassName?: string;
  fallbackIconClassName?: string;
}) {
  const { address, isConnecting } = useAccount();
  const { data: ensNameData, isLoading: ensIsLoading } = useEnsName({
    address,
  });
  const { data: ensAvatarData, isLoading: ensAvatarIsLoading } = useEnsAvatar({
    name: ensNameData,
  });

  return (
    <>
      {isConnecting || ensIsLoading || ensAvatarIsLoading ? (
        <Skeleton className={cn("rounded-full", sizeClassName)} />
      ) : (
        <Avatar className={cn(sizeClassName)}>
          <>
            <AvatarImage src={ensAvatarData ?? undefined} />
            <AvatarFallback className={fallbackTextClassName}>
              <Icons.icon className={fallbackIconClassName} />
            </AvatarFallback>
          </>
        </Avatar>
      )}
    </>
  );
}
