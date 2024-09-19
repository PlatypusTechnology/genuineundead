"use client";

import { useSIWE } from "connectkit";
import AccountCenter from "./account-center";
import { ConnectButton } from "./connect-button";

export default function AccountMenu() {

    const { isSignedIn } = useSIWE();


    return (
        <>
            {isSignedIn && (
                <AccountCenter />
            )}
            <div className="flex">
                <ConnectButton size="sm" variant="secondary" />
            </div>
        </>


    )
}