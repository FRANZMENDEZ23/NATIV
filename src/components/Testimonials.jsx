import { MessageCircle } from "lucide-react";

export default function Testimonials() {
  return (
    <section className="testimonials section-pad" aria-labelledby="testimonials-title">
      <div className="section-wrap testimonials-inner"><span className="testimonial-icon"><MessageCircle size={21} aria-hidden="true" /></span><p className="eyebrow">Voces de nuestra comunidad</p><h2 id="testimonials-title">Queremos saber<br /><em>qué te pareció.</em></h2><p className="testimonial-pending">Muy pronto compartiremos aquí las experiencias reales de quienes prueben NATIV.</p><span className="pending-label">Testimonios pendientes de recopilar</span></div>
    </section>
  );
}
