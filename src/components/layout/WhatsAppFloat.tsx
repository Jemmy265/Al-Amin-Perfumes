import { useEffect, useState } from "react";
import { waLink } from "../../domain/whatsapp";
import { useStore } from "../../state/StoreProvider";
import { Icon } from "../ui/Icon";

/** Floating WhatsApp button. On phones it tucks away while the hero buttons or
    the contact section are visible (they have their own call to action), and at
    the footer credits, so it never covers them — see .wa-float.is-tucked in sections.css. */
export function WhatsAppFloat() {
  const { settings } = useStore();
  const [tucked, setTucked] = useState(true);

  const [phone, setPhone] = useState(() => matchMedia("(max-width: 640px)").matches);
  useEffect(() => {
    const mq = matchMedia("(max-width: 640px)");
    const on = () => setPhone(mq.matches);
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);

  useEffect(() => {
    // Phones: also tuck next to the hero buttons and the contact section. All sizes: tuck at the footer credits.
    const targets = [...(phone ? [document.querySelector(".hero-actions"), document.getElementById("contact")] : []), document.querySelector(".footer-credits")].filter(Boolean) as Element[];
    if (!targets.length || !("IntersectionObserver" in window)) { setTucked(false); return; }
    const visible = new Set<Element>();
    const io = new IntersectionObserver((entries) => {
      for (const e of entries) { if (e.isIntersecting) visible.add(e.target); else visible.delete(e.target); }
      setTucked(visible.size > 0);
    }, { rootMargin: "0px 0px -40px 0px" });
    targets.forEach((t) => io.observe(t));
    return () => io.disconnect();
  }, [phone]);

  return (
    <a className={`wa-float${tucked ? " is-tucked" : ""}`} href={waLink(settings.whatsappNumber, settings.generalWhatsappMessage)}
      target="_blank" rel="noopener" aria-label="تواصل معنا عبر واتساب" tabIndex={tucked ? -1 : undefined}>
      <Icon name="wa" />
    </a>
  );
}
