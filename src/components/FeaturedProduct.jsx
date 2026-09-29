import { ArrowUpRight } from "lucide-react";
import FruitArt from "./FruitArt.jsx";

export default function FeaturedProduct() {
  return (
    <section className="featured section-pad" aria-labelledby="featured-title">
      <div className="section-wrap featured-panel">
        <div className="featured-art"><FruitArt fruit="maracuya" /></div>
        <div className="featured-copy"><p className="eyebrow">Una invitación a probar</p><p className="featured-quote" id="featured-title">“Bolivia tiene sabores increíbles. <em>Nosotros los convertimos en NATIV.</em>”</p><span className="featured-rule" /><p className="featured-signoff">Conoce una nueva manera de disfrutar lo nuestro.</p><a className="button button-light" href="#pedidos">Encuentra tu favorito <ArrowUpRight size={17} /></a></div>
        <span className="featured-mark" aria-hidden="true">N.</span>
      </div>
    </section>
  );
}
