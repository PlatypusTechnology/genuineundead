"use client";

import Particles from '@genuineundead/ui/components/particles';
import ConnectModal from './ConnectModal';
import Lock from './Lock';

type LockData = Record<string, { // Lock ID
    unlockedAt: string; // Unix timestamp
    transactionId: string;
}>;

export default function Locks({ lockData }: { lockData: LockData }) {



    return (
        <>
            <ConnectModal />
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 h-screen max-h-screen">
                <div className='absolute h-full w-full'>

                    <Particles className='h-full w-full' />
                </div>
                <div className="h-[300px] p-2 my-auto">
                    <Lock lockId={'1'} height={1071}
                        width={857} open={Boolean(lockData['lock1'])} />
                </div>
                <div className="h-[300px] p-2 my-auto">
                    <Lock lockId={'2'} height={1071}
                        width={857} open={Boolean(lockData['lock2'])} />
                </div>
                <div className="h-[300px] p-2 my-auto">
                    <Lock lockId={'3'} height={1071}
                        width={857} open={Boolean(lockData['lock3'])} />
                </div>
                <div className="h-[300px] p-2 my-auto">
                    <Lock lockId={'4'} height={1071}
                        width={857} open={Boolean(lockData['lock4'])} />
                </div>
            </div>
        </>
    );
}