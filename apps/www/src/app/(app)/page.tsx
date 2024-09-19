import { SectionHero } from "~/components/hero";
import { SectionComicHighlight } from "~/components/section-comic-highlight";
import SectionScoreboard from "~/components/section-scoreboard";
import { SectionSpotlight } from "~/components/section-spotlight";
import { getComics } from "~/lib/comics";

export default async function HomePage() {
  const comics = await getComics();
  return (
    <div className="relative min-h-screen">
      <SectionHero comics={comics}/>
      <SectionComicHighlight comic={comics[0]!} />
      <SectionSpotlight />
      <SectionScoreboard />
    </div>
  );
}