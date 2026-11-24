import { assetUrl } from "../../services/assets";
import { useStore } from "../../state/StoreProvider";
import { useUI } from "../../state/UIProvider";
import { Icon } from "../ui/Icon";
import { normalizeSections } from "../../shared/content";
import type { SectionId } from "../../types/content";

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
  const visible = new Set(normalizeSections(content.sections).filter((s) => s.visible).map((s) => s.id));
  const show = (id: SectionId) => visible.has(id);
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
          {show("catalog") && <a href="#products">التشكيلة</a>}
          <button type="button" className="link-plain" onClick={openQuiz}>اكتشف عطرك</button>
          {show("reviews") && <a href="#reviews">آراء العملاء</a>}
          {show("about") && <a href="#about">من نحن</a>}
        </nav>
        <div className="footer-col">
          <b>خدمة العملاء</b>
          {show("faq") && <a href="#faq">أسئلة شائعة</a>}
          {show("contact") && <a href="#contact">تواصل معنا</a>}
          <a href={`tel:${settings.phone}`} dir="ltr" className="ltr-start">{settings.phoneDisplay}</a>
          <span>{content.contact.deliveryNote}</span>
        </div>
        <div className="footer-col">
          <b>تابعنا</b>
          <SocialLinks className="footer-social" />
        </div>
      </div>
      <div className="footer-bottom">
        {/* Row 1 — developer credits (right, RTL start) · brand (left) */}
        <div className="container footer-bottom-row">
          <p className="footer-credits">
            <span className="footer-credits-intro">تصميم وتطوير الموقع بواسطة</span>{" "}
            <span className="footer-credits-names">
              <a href="https://wa.me/201022317589" target="_blank" rel="noopener noreferrer" aria-label="يوسف محمود — تواصل عبر واتساب (يفتح في نافذة جديدة)">يوسف محمود</a>
              {" و "}
              <a href="https://www.linkedin.com/in/mohamed-gamal-2ab673247/" target="_blank" rel="noopener noreferrer" aria-label="محمد جمال — حساب لينكدإن (يفتح في نافذة جديدة)">محمد جمال</a>
            </span>
          </p>
          <span className="footer-brand-en" dir="ltr">ALAMIN PERFUMES</span>
        </div>
        {/* Row 2 — copyright */}
        <div className="container footer-copyright">
          <p>© {new Date().getFullYear()} {f.copyright}</p>
        </div>
      </div>
    </footer>
  );
}
