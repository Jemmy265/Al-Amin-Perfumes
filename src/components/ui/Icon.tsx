/* One line-icon set (24px grid, 1.6 stroke) — replaces the mixed emoji of
   the original UI so icons stay consistent with the premium direction. */
import type { ReactNode } from "react";

const WA_PATH = "M17.6 6.32A8.86 8.86 0 0 0 11.94 4c-4.9 0-8.9 4-8.9 8.9 0 1.57.41 3.1 1.19 4.44L3 21l3.77-1.2a8.9 8.9 0 0 0 4.17 1.06h.01c4.9 0 8.9-4 8.9-8.9a8.86 8.86 0 0 0-2.25-5.64Zm-5.66 13.7h-.01a7.4 7.4 0 0 1-3.77-1.03l-.27-.16-2.8.9.9-2.73-.18-.28a7.38 7.38 0 0 1-1.14-3.92c0-4.08 3.32-7.4 7.4-7.4a7.35 7.35 0 0 1 5.23 2.17 7.34 7.34 0 0 1 2.17 5.23c0 4.08-3.33 7.4-7.4 7.4Zm4.06-5.54c-.22-.11-1.31-.65-1.51-.72-.2-.07-.35-.11-.5.11-.15.22-.57.72-.7.87-.13.15-.26.16-.48.06-.22-.11-.94-.35-1.79-1.1-.66-.59-1.11-1.32-1.24-1.54-.13-.22-.01-.34.1-.45.1-.1.22-.26.33-.39.11-.13.15-.22.22-.37.07-.15.04-.28-.02-.39-.06-.11-.5-1.2-.68-1.65-.18-.43-.36-.37-.5-.38h-.43c-.15 0-.39.06-.59.28-.2.22-.78.76-.78 1.85 0 1.09.8 2.14.91 2.29.11.15 1.57 2.4 3.81 3.36.53.23.95.37 1.27.47.53.17 1.02.15 1.4.09.43-.06 1.31-.53 1.49-1.05.19-.51.19-.95.13-1.04-.06-.09-.2-.15-.42-.26Z";

const FILLED = new Set(["wa", "facebook", "tiktok", "phone"]);

const ICONS: Record<string, ReactNode> = {
  wa: <path d={WA_PATH} />,
  facebook: <path d="M14 8h3V4h-3c-2.8 0-4.5 1.8-4.5 4.6V11H7v4h2.5v7h4v-7H16l.5-4h-3V8.8c0-.5.3-.8.8-.8Z" />,
  tiktok: <path d="M16.6 3c.4 2.3 1.8 3.8 4.1 4v3.3c-1.5 0-2.9-.4-4.1-1.2v6.1c0 3.5-2.6 5.8-5.8 5.8-3.3 0-5.8-2.5-5.8-5.6 0-3.4 2.9-6 6.6-5.5v3.4c-1.7-.4-3.3.6-3.3 2.2 0 1.3 1 2.3 2.5 2.3 1.6 0 2.6-1 2.6-2.9V3h3.2Z" />,
  phone: <path d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1C10.6 21 3 13.4 3 4c0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.2.2 2.4.6 3.6.1.4 0 .8-.3 1L6.6 10.8Z" />,
  instagram: <><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.2" cy="6.8" r=".6" fill="currentColor" /></>,
  mail: <><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m3 7 9 6 9-6" /></>,
  bag: <><path d="M5 8h14l-1.2 11.2a2 2 0 0 1-2 1.8H8.2a2 2 0 0 1-2-1.8Z" /><path d="M9 8V6.5a3 3 0 0 1 6 0V8" /></>,
  plus: <path d="M12 5v14M5 12h14" />,
  minus: <path d="M5 12h14" />,
  trash: <path d="M4 7h16M9 7V4.5h6V7M6.5 7l1 13h9l1-13" />,
  link: <><path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1" /><path d="M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1" /></>,
  close: <path d="M6 6l12 12M18 6 6 18" />,
  check: <path d="m5 12.5 4.5 4.5L19 7.5" />,
  search: <><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></>,
  chevron: <path d="m6 9 6 6 6-6" />,
  arrowLeft: <path d="M19 12H5m6-6-6 6 6 6" />,
  arrowRight: <path d="M5 12h14m-6-6 6 6-6 6" />,
  menu: <path d="M4 7h16M4 12h16M4 17h16" />,
  refresh: <path d="M4 12a8 8 0 0 1 14-5.3L20 9M20 4v5h-5M20 12a8 8 0 0 1-14 5.3L4 15m0 5v-5h5" />,
  // admin
  home: <path d="M4 11 12 4l8 7M6 9.5V20h4.5v-5.5h3V20H18V9.5" />,
  grid: <><rect x="4" y="4" width="7" height="7" rx="1" /><rect x="13" y="4" width="7" height="7" rx="1" /><rect x="4" y="13" width="7" height="7" rx="1" /><rect x="13" y="13" width="7" height="7" rx="1" /></>,
  sort: <path d="M8 4v16m0 0-3.5-3.5M8 20l3.5-3.5M16 20V4m0 0-3.5 3.5M16 4l3.5 3.5" />,
  tag: <><path d="M3.5 12.5V5a1.5 1.5 0 0 1 1.5-1.5h7.5l8 8a1.5 1.5 0 0 1 0 2.1l-6.4 6.4a1.5 1.5 0 0 1-2.1 0Z" /><circle cx="8" cy="8" r="1.4" /></>,
  edit: <path d="M4 20h4L19 9a2.1 2.1 0 0 0-3-3L5 17v3ZM14 8l3 3" />,
  eye: <><path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12Z" /><circle cx="12" cy="12" r="3" /></>,
  logout: <path d="M14 4h4.5A1.5 1.5 0 0 1 20 5.5v13a1.5 1.5 0 0 1-1.5 1.5H14M10 16l-4-4 4-4M6 12h10" />,
  camera: <><path d="M4 8.5A1.5 1.5 0 0 1 5.5 7h2.2L9.2 5h5.6l1.5 2h2.2A1.5 1.5 0 0 1 20 8.5v9a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 4 17.5Z" /><circle cx="12" cy="12.5" r="3.5" /></>,
  image: <><rect x="3.5" y="4.5" width="17" height="15" rx="1.5" /><circle cx="9" cy="10" r="1.8" /><path d="m4 18 5.5-5 4 3.5 2.5-2 4 3.5" /></>,
  arrowUp: <path d="M12 19V5m-6 6 6-6 6 6" />,
  arrowDown: <path d="M12 5v14m-6-6 6 6 6-6" />,
  grip: <><circle cx="9" cy="6" r="1.2" /><circle cx="15" cy="6" r="1.2" /><circle cx="9" cy="12" r="1.2" /><circle cx="15" cy="12" r="1.2" /><circle cx="9" cy="18" r="1.2" /><circle cx="15" cy="18" r="1.2" /></>,
  external: <path d="M14 4h6v6M20 4l-9 9M18 14v4.5a1.5 1.5 0 0 1-1.5 1.5h-11A1.5 1.5 0 0 1 4 18.5v-11A1.5 1.5 0 0 1 5.5 6H10" />,
  alert: <><path d="M12 3.5 2.5 20h19Z" /><path d="M12 10v4.5M12 17.2v.3" /></>,
  doc: <><path d="M6 3.5h8l4 4V20a.5.5 0 0 1-.5.5h-11A.5.5 0 0 1 6 20Z" /><path d="M14 3.5V8h4M9 12h6M9 15.5h6" /></>,
  pin: <path d="M12 21s-6.5-6-6.5-11a6.5 6.5 0 0 1 13 0c0 5-6.5 11-6.5 11Z" />,
  // notes pyramid
  top: <><circle cx="12" cy="12" r="8" /><path d="M12 4v16M4 12h16" /></>,
  heart: <path d="M12 20s-7-4.3-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.7-7 10-7 10Z" />,
  base: <><ellipse cx="12" cy="6" rx="6" ry="2.5" /><path d="M6 6v12c0 1.4 2.7 2.5 6 2.5s6-1.1 6-2.5V6" /></>,
  // benefits
  star: <path d="M12 3l2.6 5.3 5.9.9-4.3 4.1 1 5.8L12 16.4 6.8 19.1l1-5.8L3.5 9.2l5.9-.9Z" />,
  drop: <path d="M12 3c-4 3-7 6-7 10a7 7 0 0 0 14 0c0-4-3-7-7-10Z" />,
  truck: <><path d="M3 7h11v9H3zM14 10h4l3 3v3h-7z" /><circle cx="7" cy="17.5" r="1.8" /><circle cx="17.5" cy="17.5" r="1.8" /></>,
  chat: <path d="M20 12a8 8 0 0 1-11.8 7L4 20l1-4.2A8 8 0 1 1 20 12Z" />,
  // quiz options
  man: <><circle cx="12" cy="7" r="3.5" /><path d="M5 21v-1.5A5.5 5.5 0 0 1 10.5 14h3a5.5 5.5 0 0 1 5.5 5.5V21" /></>,
  woman: <><circle cx="12" cy="7" r="3.5" /><path d="M8.5 7c0 4-1.5 5-2.5 6M15.5 7c0 4 1.5 5 2.5 6M5 21l1.6-4.3A4 4 0 0 1 10.4 14h3.2a4 4 0 0 1 3.8 2.7L19 21" /></>,
  gift: <><rect x="4" y="9" width="16" height="11" rx="1" /><path d="M3 9h18M12 9v11M12 9S10.5 4 8 4.5 7.5 9 12 9Zm0 0s1.5-5 4-4.5S16.5 9 12 9Z" /></>,
  sun: <><circle cx="12" cy="12" r="4" /><path d="M12 2.5v2.5M12 19v2.5M2.5 12H5M19 12h2.5M5.3 5.3l1.8 1.8M16.9 16.9l1.8 1.8M5.3 18.7l1.8-1.8M16.9 7.1l1.8-1.8" /></>,
  moon: <path d="M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5Z" />,
  sparkle: <path d="M12 3c.6 4.2 2.8 6.4 7 7-4.2.6-6.4 2.8-7 7-.6-4.2-2.8-6.4-7-7 4.2-.6 6.4-2.8 7-7ZM19 16c.3 1.6 1 2.3 2.5 2.5-1.5.2-2.2.9-2.5 2.5-.3-1.6-1-2.3-2.5-2.5 1.5-.2 2.2-.9 2.5-2.5Z" />,
  wave: <path d="M3 9c2 0 2-1.5 4.5-1.5S10 9 12 9s2-1.5 4.5-1.5S19 9 21 9M3 14c2 0 2-1.5 4.5-1.5S10 14 12 14s2-1.5 4.5-1.5S19 14 21 14M3 19c2 0 2-1.5 4.5-1.5S10 19 12 19s2-1.5 4.5-1.5S19 19 21 19" />,
  vanilla: <><path d="M6 20C9 14 13 8 19 4" /><path d="M8.5 15.5c-1.5-1-2-3-1-4.5M12 10.5c-1.5-1-2-3-1-4.5M10.5 17.5c1 1.5 3 2 4.5 1M14 12.5c1 1.5 3 2 4.5 1" /></>,
  tree: <path d="M12 3 6 11h3l-4 6h14l-4-6h3ZM12 17v4" />,
  flower: <><circle cx="12" cy="10" r="2.2" /><path d="M12 7.8C10.3 4.5 12 3 12 3s1.7 1.5 0 4.8ZM14.2 10c3.3-1.7 4.8 0 4.8 0s-1.5 1.7-4.8 0ZM9.8 10C6.5 11.7 5 10 5 10s1.5-1.7 4.8 0ZM12 12.2c1.7 3.3 0 4.8 0 4.8s-1.7-1.5 0-4.8ZM12 17v4" /></>,
  leaf: <path d="M5 19c0-8 5-14 15-14 0 10-6 15-14 15M5 19l7-7" />,
  halfMoon: <><circle cx="12" cy="12" r="8" /><path d="M12 4a8 8 0 0 1 0 16Z" fill="currentColor" stroke="none" /></>,
  flame: <path d="M12 21a6 6 0 0 0 6-6c0-4-3-6-4-10-2 2-2.5 4-2 6-1.5-.5-2.5-2-2.5-3.5C7.5 9.5 6 12 6 15a6 6 0 0 0 6 6Z" />,
};

export type IconName = keyof typeof ICONS | string;

export function Icon({ name, size, className = "" }: { name: IconName; size?: number; className?: string }) {
  const filled = FILLED.has(name);
  return (
    <svg
      viewBox="0 0 24 24"
      className={`icon${filled ? " icon-fill" : ""} ${className}`}
      width={size}
      height={size}
      aria-hidden="true"
      focusable="false"
    >
      {ICONS[name] ?? null}
    </svg>
  );
}
