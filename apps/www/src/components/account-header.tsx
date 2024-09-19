"use client";

import { truncateEthAddress } from "@genuineundead/core";
import { Skeleton } from "@genuineundead/ui/components/skeleton";
import { useAccount, useEnsName } from "wagmi";
import { AccountAvatar } from "./account-avatar";
import Particles from "./particles";


export function AccountHeader() {
  const { address, isConnecting } = useAccount();
  const { data: ensNameData, isLoading: ensIsLoading, isError } = useEnsName({
    address,
  });

  return (
    <section className="overflow-hidden">
      <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
        <Particles className="absolute inset-0 -z-10" />

        <div
          className="pointer-events-none absolute inset-0 -z-10 overflow-hidden rounded-b-[3rem] bg-indigo-900/20 lg:-mx-28"
          aria-hidden="true"
        ></div>

        <div className="pb-12 pt-44 md:pt-56">
          {/* Hero content */}
          <div className="mx-auto flex max-w-3xl flex-col items-center justify-end text-center">
            <AccountAvatar />

            <div className="mt-4">
              {isConnecting || (ensIsLoading && !isError)  ? (
                <Skeleton className="h-8 w-[200px]" />
              ) : (
                <p className="text-xl font-bold leading-none sm:text-3xl">
                  {ensNameData ? (
                    ensNameData
                  ) : address ? (
                    truncateEthAddress(address)
                  ) : (
                    <></>
                  )}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}