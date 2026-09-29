import { ArrowUpRight, Leaf } from "lucide-react";

export default function Footer({ config }) {
  const contacts = [
    config.contact.email && { label: config.contact.email, href: `mailto:${config.contact.email}` },
    config.contact.instagram && { label: `@${config.contact.instagram.replace(/^@/, "")}`, href: `https://instagram.com/${config.contact.instagram.replace(/^@/, "")}` },
    config.contact.tiktok && { label: `TikTok @${config.contact.tiktok.replace(/^@/, "")}`, href: `https://www.tiktok.com/@${config.contact.tiktok.replace(/^@/, "")}` },
    config.contact.facebook && { label: `Facebook ${config.contact.facebook}`, href: `https://www.facebook.com/${config.contact.facebook.replace(/^@/, "")}` },
  ].filter(Boolean);
  return (
    <footer className="site-footer"><div className="section-wrap"><div className="footer-top"><a className="brand footer-brand" href="#inicio"><span className="brand-mark"><Leaf size={19} aria-hidden="true" /></span><span>NATIV<span className="brand-period">.</span></span></a><p>{config.tagline}</p><a className="footer-backtop" href="#inicio">Volver arriba <ArrowUpRight size={15} /></a></div><div className="footer-bottom"><span>© {new Date().getFullYear()} NATIV. Hecho con raíces.</span><span>{config.location}</span><a href="#pedidos">Descubre nuestros sabores <span aria-hidden="true">↗</span></a>{contacts.map((contact) => <a key={contact.href} href={contact.href} target={contact.href.startsWith("http") ? "_blank" : undefined} rel={contact.href.startsWith("http") ? "noreferrer" : undefined}>{contact.label}</a>)}</div></div></footer>
  );
}
