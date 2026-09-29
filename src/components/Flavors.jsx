import { ArrowUpRight } from "lucide-react";
import FlavorCard from "./FlavorCard.jsx";

export default function Flavors({ products }) {
  return (
    <section className="flavors section-pad" id="sabores" aria-labelledby="flavors-title">
      <div className="section-wrap">
        <div className="section-heading flavors-heading">
          <div><p className="eyebrow">Una tierra, muchos sabores</p><h2 id="flavors-title">Fruta de verdad.<br /><em>Momentos para saborear.</em></h2></div>
          <p>Cuatro frutas con identidad propia, reunidas en un yogur que celebra lo nuestro.</p>
        </div>
        <div className="flavor-grid">
          {products.map((product, index) => <FlavorCard key={product.id} product={product} index={index} />)}
        </div>
        <div className="flavors-foot"><span>01 — 04 / Nuestros sabores</span><a className="text-link" href="#pedidos">Arma tu pedido <ArrowUpRight size={16} /></a></div>
      </div>
    </section>
  );
}
