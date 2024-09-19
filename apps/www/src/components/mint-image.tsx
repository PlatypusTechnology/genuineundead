import { cn } from "@genuineundead/core";
import type { Comic } from "~/lib/comics";
import { comics } from "~/lib/comics";
import { ComicCard } from "./comic-card";

const Card = ({ comic, className }: { comic: Comic; className?: string }) => {
  return (
    <div
      className={cn(
        "relative flex h-full w-44 flex-none scale-95 items-center overflow-hidden shadow transition-all duration-200 ease-in-out hover:rotate-0 hover:scale-100 dark:bg-transparent md:w-72",
        className,
      )}
    >
      <ComicCard comic={comic} />
    </div>
  );
};

export function MintCard() {
  return (
    <section>
      <div className="flex justify-center whitespace-nowrap">
        <Card comic={comics[0]} className="-rotate-12" />
        <Card comic={comics[0]} className="-ml-20 -mt-10 rotate-12" />
      </div>
    </section>
  );
}
