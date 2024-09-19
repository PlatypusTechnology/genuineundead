import { FlashlightZone } from "./flashlight-zone";
import Particles from "./particles";

export function SectionSpotlight() {
  return (
    <section className="pt-32 relative">
      <div className="absolute tpp-0 z-50 h-36 w-full bg-gradient-to-t from-transparent to-background pointer-events-none" ></div>

      <FlashlightZone
        imgSrc="/images/temp-spotlight.png"
      >
        <Particles className="absolute inset-0 h-full w-full" />
      </FlashlightZone>

      <div className="absolute bottom-0 z-50 h-36 w-full bg-gradient-to-b from-transparent to-background  pointer-events-none" ></div>
    </section>
  );
}
