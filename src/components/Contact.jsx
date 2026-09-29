import { ArrowUpRight, Facebook, Instagram, Mail, MapPin, MessageCircle, Music2 } from "lucide-react";
import { createWhatsAppUrl } from "../utils/whatsapp.js";

export default function Contact({ config }) {
  const whatsappUrl = createWhatsAppUrl(config.whatsapp.phone, config.whatsapp.greeting);
  const configuredContacts = [
    config.contact.email && {
      href: `mailto:${config.contact.email}`,
      label: config.contact.email,
      icon: Mail,
    },
    config.contact.instagram && {
      href: `https://instagram.com/${config.contact.instagram.replace(/^@/, "")}`,
      label: `@${config.contact.instagram.replace(/^@/, "")}`,
      icon: Instagram,
      external: true,
    },
    config.contact.tiktok && {
      href: `https://www.tiktok.com/@${config.contact.tiktok.replace(/^@/, "")}`,
      label: `@${config.contact.tiktok.replace(/^@/, "")}`,
      icon: Music2,
      external: true,
    },
    config.contact.facebook && {
      href: `https://www.facebook.com/${config.contact.facebook.replace(/^@/, "")}`,
      label: config.contact.facebook,
      icon: Facebook,
      external: true,
    },
    whatsappUrl && {
      href: whatsappUrl,
      label: "WhatsApp",
      icon: MessageCircle,
      external: true,
    },
  ].filter(Boolean);
  return (
    <section className="contact section-pad" id="contacto" aria-labelledby="contact-title">
      <div className="section-wrap contact-grid"><div><p className="eyebrow"><span className="eyebrow-line" />Conversemos</p><h2 id="contact-title">Lo bueno<br />se comparte.</h2><p className="contact-description">¿Quieres saber más sobre nuestros sabores o coordinar un pedido? Pronto habilitaremos nuestros canales de contacto.</p><div className="contact-location"><MapPin size={17} aria-hidden="true" /><span><strong>Nos encuentras en</strong>{config.location}</span></div></div>
        <div className="contact-card"><span className="contact-card-overline">ESTAMOS PREPARANDO</span><h3>Un canal directo<br /><em>para ti.</em></h3><p>Los datos de contacto oficiales se publicarán aquí cuando estén disponibles.</p>
          {configuredContacts.length > 0 ? <div className="contact-configured">
            {configuredContacts.map(({ href, label, icon: Icon, external }) => <a className="contact-placeholder" key={href} href={href} target={external ? "_blank" : undefined} rel={external ? "noreferrer" : undefined}><Icon size={16} aria-hidden="true" /> {label} <ArrowUpRight size={16} aria-hidden="true" /></a>)}
          </div> : <div className="contact-placeholder">Contacto directo próximamente <ArrowUpRight size={16} aria-hidden="true" /></div>}
          <span className="contact-footnote">{configuredContacts.length > 0 ? "Canales oficiales de NATIV." : "Sin datos de contacto configurados por ahora."}</span></div>
      </div>
    </section>
  );
}
