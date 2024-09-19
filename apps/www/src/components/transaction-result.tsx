import { Button } from "@genuineundead/ui"
import { useWaitForTransaction } from "wagmi"

export default function TransactionResult({ hash }: { hash: `0x${string}` }) {
    const { data, isError, isLoading } = useWaitForTransaction({
        hash,
    })

    return (
        <Button className={`w-full ${data ? 'bg-green-500' : isError ? `bg-red-800` : 'bg-white'}`} size="lg" disabled={!data}>
            {data ? 'You successfully minted!' : isLoading ? "Your mint is on the way..." : isError ? 'Transaction failed' : 'Unknown error'}
        </Button>
    )
}