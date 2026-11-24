import { assetUrl } from "../../services/assets";
import { useStore } from "../../state/StoreProvider";
import { useUI } from "../../state/UIProvider";
import { Icon } from "../ui/Icon";

export function SocialLinks({ className = "social" }: { className?: string }) {
  const { settings } = useStore();
  return (
    <div className={className} aria-label="حساباتنا على السوشيال ميديا">
      <a href={settings.social.instagram} target="_blank" rel="noopener" aria-label="إنستجرام"><Icon name="instagram" /></a>
      <a href={settings.social.facebook} target="_blank" rel="noopener" aria-label="فيسبوك"><Icon name="facebook" /></a>
      <a href={settings.social.tiktok} target="_blank" rel="noopener" aria-label="تيك توك"><Icon name="tiktok" /></a>
    </div>
  );
}

export function Footer() {
  const { content, settings } = useStore();
  const { openQuiz } = useUI();
  const f = content.footer;
  return (
    <footer className="site-footer">
      <div className="container footer-grid">
        <div className="footer-brand">
          <img src={assetUrl("assets/logo-light.png")} alt="" width={472} height={567} loading="lazy" />
          <div>
            <p className="footer-name">{f.brandName}</p>
            <p className="footer-slogan display">{content.hero.slogan}</p>
            <p>{f.tagline}</p>
          </div>
        </div>
        <nav className="footer-col" aria-label="روابط سريعة">
          <b>روابط سريعة</b>
          <a href="#products">التشكيلة</a>
          <button type="button" className="link-plain" onClick={openQuiz}>اكتشف عطرك</button>
          <a href="#reviews">آراء العملاء</a>
          <a href="#about">من نحن</a>
        </nav>
        <div className="footer-col">
          <b>خدمة العملاء</b>
          <a href="#faq">أسئلة شائعة</a>
          <a href="#contact">تواصل معنا</a>
          <a href={`tel:${settings.phone}`} dir="ltr" className="ltr-start">{settings.phoneDisplay}</a>
          <span>{content.contact.deliveryNote}</span>
        </div>
        <div className="footer-col">
          <b>تابعنا</b>
          <SocialLinks className="footer-social" />
        </div>
      </div>
      <div className="footer-bottom">
        <div className="container">
          <p>© {new Date().getFullYear()} {f.copyright}</p>
          <span dir="ltr">ALAMIN PERFUMES</span>
        </div>
      </div>
    </footer>
  );
}
