/* House presets over React Bits components, so every section animates the
   same way: content rises gently and un-blurs as it scrolls into view. */
import type { ReactNode } from "react";
import AnimatedContent from "../components/reactbits/AnimatedContent";
import SplitText from "../components/reactbits/SplitText";

type RevealProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
  distance?: number;
  /** > 0 animates each direct child in turn (grids, lists). */
  stagger?: number;
  trigger?: "scroll" | "mount";
  id?: string;
};

export function Reveal({ children, className, delay = 0, distance = 36, stagger = 0, trigger = "scroll", id }: RevealProps) {
  return (
    <AnimatedContent
      id={id}
      className={className}
      distance={distance}
      duration={1.1}
      ease="power3.out"
      blur={stagger ? 0 : 6}
      threshold={0.12}
      delay={delay}
      stagger={stagger}
      trigger={trigger}
    >
      {children}
    </AnimatedContent>
  );
}

/** Word-by-word reveal for Arabic display headings. Splits by WORDS only —
 *  splitting Arabic into characters would break the letter joining. */
export function RevealText({
  text, className = "", delay = 70, trigger = "view",
}: { text: string; className?: string; delay?: number; trigger?: "view" | "load" }) {
  return (
    <SplitText
      text={text}
      tag="span"
      className={`reveal-text ${className}`}
      splitType="words"
      effect="blur"
      delay={delay}
      duration={1.1}
      threshold={0.15}
      rootMargin="-40px"
      textAlign="inherit"
      trigger={trigger}
    />
  );
}
