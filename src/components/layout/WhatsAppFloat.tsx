import { waLink } from "../../domain/whatsapp";
import { useStore } from "../../state/StoreProvider";
import { Icon } from "../ui/Icon";

export function WhatsAppFloat() {
  const { settings } = useStore();
  return (
    <a className="wa-float" href={waLink(settings.whatsappNumber, settings.generalWhatsappMessage)} target="_blank" rel="noopener" aria-label="تواصل معنا عبر واتساب">
      <Icon name="wa" />
    </a>
  );
}
