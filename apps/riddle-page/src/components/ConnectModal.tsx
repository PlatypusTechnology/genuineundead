"use client";

import { ConnectButton } from "@genuineundead/ui";
import { useSIWE } from "connectkit";
import { useRouter } from 'next/navigation';
import { useEffect, useRef } from "react";
import Modal from "./Modal";

export default function ConnectModal() {
    const router = useRouter();
    const { isSignedIn } = useSIWE();
    const prevIsSignedIn = useRef(isSignedIn); // Use ref to keep track of previous isSignedIn value

    useEffect(() => {
        // Check if the value has changed
        if (prevIsSignedIn.current !== isSignedIn) {
            prevIsSignedIn.current = isSignedIn; // Update the ref value

            // Add a delay before refreshing the page
            const timeoutId = setTimeout(() => {
                window.location.reload(); // Reload the page when isSignedIn changes
            }, 1000); // 1-second delay

            // Cleanup the timeout if the component unmounts before the timeout completes
            return () => clearTimeout(timeoutId);
        }
    }, [isSignedIn, router]);

    return (
        <Modal isOpen={!isSignedIn} onClose={() => { }}>
            <ConnectButton />
        </Modal>
    );
}