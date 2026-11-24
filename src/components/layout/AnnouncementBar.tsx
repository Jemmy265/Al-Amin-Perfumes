import { fmt } from "../../domain/pricing";
import { useStore } from "../../state/StoreProvider";
import { RichText } from "../ui/RichText";

export function AnnouncementBar() {
  const { content, settings } = useStore();
  const vars = { freeMin: fmt(settings.freeShippingMin), discount: settings.sizeDiscount.percent };
  return (
    <div className="announcement">
      <div className="container announcement-inner">
        {content.announcements.map((a, i) => (
          <span key={i} className="announcement-item"><RichText text={a} vars={vars} /></span>
        ))}
      </div>
    </div>
  );
}
