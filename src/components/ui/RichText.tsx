import { Fragment, type ReactNode } from "react";
import { useUI } from "../../state/UIProvider";

/** Renders admin-editable copy safely (no HTML): **bold**, {{quiz|text}}, \n. */
export function RichText({ text, vars }: { text: string; vars?: Record<string, string | number> }) {
  const { openQuiz } = useUI();
  let src = text;
  if (vars) for (const [k, v] of Object.entries(vars)) src = src.split(`{${k}}`).join(String(v));

  const lines = src.split("\n");
  return (
    <>
      {lines.map((line, li) => (
        <Fragment key={li}>
          {li > 0 && <br />}
          {line.split(/(\*\*[^*]+\*\*|\{\{quiz\|[^}]+\}\})/g).map((part, i): ReactNode => {
            if (part.startsWith("**")) return <b key={i}>{part.slice(2, -2)}</b>;
            if (part.startsWith("{{quiz|"))
              return <button key={i} type="button" className="link-btn" onClick={openQuiz}>{part.slice(7, -2)}</button>;
            return part;
          })}
        </Fragment>
      ))}
    </>
  );
}
