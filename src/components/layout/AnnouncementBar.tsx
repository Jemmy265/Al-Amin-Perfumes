import { fmt, maxActivePercent } from "../../domain/pricing";
import { useStore } from "../../state/StoreProvider";
import { RichText } from "../ui/RichText";

export function AnnouncementBar() {
  const { content, settings } = useStore();
  const discount = maxActivePercent(settings);
  const vars = { freeMin: fmt(settings.freeShipping.min), discount };
  // A line about an offer that isn't running right now is hidden instead of showing "0%".
  const lines = content.announcements.filter((a) =>
    !(a.includes("{discount}") && !discount) && !(a.includes("{freeMin}") && !settings.freeShipping.enabled));
  if (!lines.length) return null;
  return (
    <div className="announcement">
      <div className="container announcement-inner">
        {lines.map((a, i) => (
          <span key={i} className="announcement-item"><RichText text={a} vars={vars} /></span>
        ))}
      </div>
    </div>
  );
}
