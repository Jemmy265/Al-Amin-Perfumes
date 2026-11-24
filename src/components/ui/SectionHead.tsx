import type { ReactNode } from "react";
import { Reveal, RevealText } from "../../motion";
import type { SectionHead as Head } from "../../types/content";

export function SectionHead({ head, id, align = "start", aside }: { head: Head; id?: string; align?: "start" | "center"; aside?: ReactNode }) {
  return (
    <div className={`section-head section-head--${align}`}>
      <div>
        <Reveal distance={16}><p className="kicker">{head.kicker}</p></Reveal>
        <h2 id={id} className="display"><RevealText text={head.title} /></h2>
        {head.text && <Reveal delay={0.25} distance={20}><p className="section-text">{head.text}</p></Reveal>}
      </div>
      {aside && <Reveal delay={0.3} distance={20}>{aside}</Reveal>}
    </div>
  );
}
