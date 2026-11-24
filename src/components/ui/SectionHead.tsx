import type { ReactNode } from "react";
import type { SectionHead as Head } from "../../types/content";

export function SectionHead({ head, id, align = "start", aside }: { head: Head; id?: string; align?: "start" | "center"; aside?: ReactNode }) {
  return (
    <div className={`section-head section-head--${align}`} data-reveal>
      <div>
        <p className="kicker">{head.kicker}</p>
        <h2 id={id} className="display">{head.title}</h2>
        {head.text && <p className="section-text">{head.text}</p>}
      </div>
      {aside}
    </div>
  );
}
