import { ArrowDownRight, ArrowUpRight } from "lucide-react";

export default function Hero() {
  const imageSource = `${import.meta.env.BASE_URL}images/hero/nativ-hero.webp`;
  return (
    <section className="hero section-wrap" id="inicio" aria-labelledby="hero-title">
      <div className="hero-copy">
        <p className="eyebrow"><span className="eyebrow-line" />Hecho despacio, hecho de aquí</p>
        <h1 id="hero-title">Yogur artesanal<br />con el sabor de<br /><span>nuestra tierra.</span></h1>
        <p className="hero-description">Frutas que cuentan historias. Sabores auténticos de Bolivia, transformados con cariño en algo para disfrutar sin apuro.</p>
        <div className="hero-actions">
          <a className="button button-dark" href="#sabores">Explorar sabores <ArrowUpRight size={17} aria-hidden="true" /></a>
          <a className="text-link" href="#historia">Conoce NATIV <ArrowDownRight size={16} aria-hidden="true" /></a>
        </div>
        <div className="hero-note"><span className="note-dot" />Una pequeña marca con raíces grandes.</div>
      </div>
      <div className="hero-visual">
        <img
          className="hero-photo"
          src={imageSource}
          alt="Envases NATIV y frutas bolivianas"
          onError={(event) => {
            event.currentTarget.hidden = true;
            event.currentTarget.nextElementSibling.hidden = false;
          }}
        />
        <p className="hero-photo-fallback" hidden>Una imagen de nuestros sabores, muy pronto.</p>
        <div className="hero-stamp"><span>DE NUESTRA</span><strong>TIERRA</strong><span>CON CARIÑO · SCZ</span></div>
        <p className="hero-package-sizes">200 ml <span>·</span> 500 ml <span>·</span> 1 L <span>·</span> 2 L</p>
        <div className="hero-fruit-caption">
          <strong>Sabores que son de aquí</strong>
          <span>Chirimoya <i>·</i> Achachairú <i>·</i> Maracuyá <i>·</i> Copoazú</span>
        </div>
        <div className="hero-scroll"><ArrowDownRight size={14} aria-hidden="true" /><span>DESCUBRE</span></div>
      </div>
    </section>
  );
}
