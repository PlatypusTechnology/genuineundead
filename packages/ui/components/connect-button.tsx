"use client";

import { ConnectKitButton, useSIWE } from "connectkit";
import { Wallet } from "lucide-react";
import { Button, ButtonProps } from "./button";


export function ConnectButton(props: ButtonProps) {
    const { isSignedIn, signIn, isLoading } = useSIWE();
    return (
        <ConnectKitButton.Custom>
            {({ isConnected, show, truncatedAddress, ensName }) => {
                return (
                    <Button onClick={() => isConnected && !isSignedIn ? signIn() : show?.()} {...props}>
                        <Wallet className="mr-1.5 h-5 w-5" />
                        {isLoading ? 'Signing in...' : isConnected ? !isSignedIn ? 'Sign in' : ensName ?? truncatedAddress : "Sign in"}
                    </Button>
                );
            }}
        </ConnectKitButton.Custom>
    );
}
