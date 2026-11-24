import { SocialLinks } from "../components/layout/Footer";
import { Icon } from "../components/ui/Icon";
import { waLink } from "../domain/whatsapp";
import { useStore } from "../state/StoreProvider";
import { Reveal, RevealText } from "../motion";

export function Contact() {
  const { content, settings } = useStore();
  const c = content.contact;
  return (
    <section className="contact" id="contact" aria-labelledby="contact-title">
      <div className="container contact-grid">
        <Reveal className="contact-copy">
          <p className="kicker kicker--light">{c.kicker}</p>
          <h2 id="contact-title" className="display"><RevealText text={c.title} /></h2>
          <p>{c.text}</p>
          <a className="btn btn-gold btn-lg" href={waLink(settings.whatsappNumber, settings.generalWhatsappMessage)} target="_blank" rel="noopener">
            <Icon name="wa" /><span>{c.whatsappCta}</span>
          </a>
        </Reveal>
        <Reveal distance={24} delay={0.2}>
        <ul className="contact-details">
          <li><a href={`tel:${settings.phone}`}><Icon name="phone" /><span dir="ltr">{settings.phoneDisplay}</span></a></li>
          <li><a href={`mailto:${settings.email}`}><Icon name="mail" /><span dir="ltr">{settings.email}</span></a></li>
          <li><span><Icon name="truck" /><span>{c.deliveryNote}</span></span></li>
          <li><SocialLinks /></li>
        </ul>
        </Reveal>
      </div>
    </section>
  );
}
