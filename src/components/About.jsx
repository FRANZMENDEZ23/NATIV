import { ArrowUpRight, MapPin } from "lucide-react";


export default function About() {
  return (
    <section className="about section-pad" id="historia" aria-labelledby="about-title">
      <div className="section-wrap about-grid">
        <div className="about-art">
<div className="about-art-frame">
  <img
    src={`${import.meta.env.BASE_URL}images/brand/nativ-raiz.webp`}
    alt="Frutas tropicales de Santa Cruz utilizadas en NATIV"
    className="about-root-image"
  />
</div>          <div className="about-caption"><span>SANTA CRUZ · BOLIVIA</span><strong>Hecho con raíces.</strong></div>
          <div className="about-side-label">UNA HISTORIA DE AQUÍ</div>
        </div>
        <div className="about-copy">
          <p className="eyebrow"><span className="eyebrow-line" />Nuestra raíz, nuestro orgullo</p>
          <h2 id="about-title">Nacimos de una idea sencilla: <em>lo nuestro merece ser celebrado.</em></h2>
          <p>En Bolivia, cada fruta guarda un lugar, un recuerdo y una manera de compartir. En Santa Cruz, esos sabores son parte de nuestra mesa y de nuestra identidad.</p>
          <p>NATIV es una marca artesanal que mira a su tierra con orgullo. Queremos acercar frutas de aquí a nuevos momentos, con cuidado en cada paso y sin apurar lo bueno.</p>
          <div className="about-location"><MapPin size={16} aria-hidden="true" /> Santa Cruz, Bolivia</div>
          <a className="text-link" href="#proceso">Así lo hacemos <ArrowUpRight size={16} /></a>
        </div>
      </div>
    </section>
  );
}
