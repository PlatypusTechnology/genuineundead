import { cn, truncateEthAddress } from "@genuineundead/core";
import { Avatar, AvatarFallback, AvatarImage } from "@genuineundead/ui/components/avatar";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@genuineundead/ui/components/tooltip";
import { server } from "~/sanity/lib/server";

interface UserType {
  metadata?: {
    points?: number
  };
  address: string;
  username?: string;
  discordId?: string;
  twitterId?: string;
}

function ScoreboardListItem({
  avatar,
  nickname,
  address,
  score,
  className,
}: {
  avatar?: string;
  nickname?: string;
  score: number;
  address: string;
  className?: string;
}) {
  const avatarName = nickname ?? address ?? '0x0000000';

  return (
    <div className={cn("flex items-center", className)}>
      <Avatar className="h-12 w-12">
        <AvatarImage src={avatar} alt="Avatar" />
        <AvatarFallback>{avatarName.slice(0, 2)}</AvatarFallback>
      </Avatar>

      <div className="ml-4 mt-1 space-y-2 font-mono">
        <p className="text-base font-medium leading-none">
          {nickname ?? "Anon"}
        </p>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <p className="cursor-pointer text-sm text-muted-foreground">
                {truncateEthAddress(address)}
              </p>
            </TooltipTrigger>
            <TooltipContent>{address}</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      <div className="ml-auto font-medium">{score} pts</div>
    </div>
  );
}

export default async function Scoreboard() {
  const leaderboard = await server().fetch<UserType[]>("*[_type == 'user' && metadata.points > 0] | order(metadata.points desc) [0...9]");
  return (
    <div className="space-y-4">
      {leaderboard.map((user) =>
        <ScoreboardListItem key={user.address} address={user.address ?? '0x0000'} nickname={user.username} score={Number(user.metadata?.points ?? 0)} />
      )}

    </div>
  );
}