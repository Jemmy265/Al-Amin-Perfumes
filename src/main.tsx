import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { App } from "./App";
import "./styles/tokens.css";
import "./styles/base.css";
import "./styles/layout.css";
import "./styles/sections.css";
import "./styles/product.css";
import "./styles/sheets.css";
import { prefersReducedMotion } from "./motion/gsap";

// Elements that animate in start hidden only when motion is allowed.
if (!prefersReducedMotion()) document.documentElement.classList.add("motion");

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
