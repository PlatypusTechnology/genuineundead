
"use client";

import { GU_ABI } from '@genuineundead/contracts';
import { Button } from "@genuineundead/ui";
import { useSIWE } from 'connectkit';
import type { Token } from "types";
import { formatEther } from 'viem';
import { useAccount, useContractWrite, usePrepareContractWrite } from "wagmi";
import { ConnectButton } from './connect-button';
import TransactionResult from './transaction-result';

export default function MintBox({ token, price }: { token: Token, price: string }) {




    const { config } = usePrepareContractWrite({
        address: process.env.NEXT_PUBLIC_GU_ADDRESS! as `0x${string}`,
        abi: GU_ABI,
        functionName: 'mint',
        args: [token.tokenId, 1],
        value: BigInt(price),
        enabled: true,
    })


    const { data, isLoading, isSuccess, write, isError } = useContractWrite(config);
    const acc = useAccount();
    const { isSignedIn } = useSIWE();

    return (
        <>



            <p className="text-lg text-slate-400">
                {token.description}
            </p>

            <div className="mt-8 space-y-2 sm:space-x-4">
                {(isSuccess && data) && (
                    <TransactionResult hash={data.hash} />
                )}{!data && (
                    <>
                        {
                            !acc || !isSignedIn ? (
                                <ConnectButton className='w-full' />
                            ) : (
                                <div className='relative'>
                                    <Button className={`${isLoading ? 'animate-pulse' : ''} w-full z-10 transition-all ${isError ? `bg-red-400 animate-shake` : 'bg-white'}`} size="lg" disabled={!write || BigInt(price) === BigInt(0)} onClick={() => write?.()}>
                                        {isLoading || (isSuccess && !data) ? "Your mint is on the way..." : isSuccess ? 'You minted an edition!' : isError ? 'Transaction failed' : BigInt(price) === BigInt(0) ? 'Loading...' : `Mint 1 for ${formatEther(BigInt(price), 'wei')} ETH`}
                                    </Button>
                                </div>)
                        }
                    </>
                )}
            </div>
        </>
    )
}