import { Heart, Leaf, Map, Sparkles } from "lucide-react";

const values = [
  { icon: Leaf, title: "Sabores con origen", text: "Frutas que forman parte de la diversidad de nuestra tierra." },
  { icon: Heart, title: "Hecho con cuidado", text: "Un proceso artesanal donde cada paso importa." },
  { icon: Map, title: "Identidad boliviana", text: "Una marca nacida para celebrar lo que somos." },
  { icon: Sparkles, title: "Algo distinto", text: "Combinaciones que convierten lo cotidiano en un pequeño descubrimiento." },
];

export default function Benefits() {
  return (
    <section className="benefits section-pad" aria-labelledby="benefits-title">
      <div className="section-wrap">
        <div className="benefits-intro"><p className="eyebrow">Lo que nos mueve</p><h2 id="benefits-title">No se trata solo<br />de yogur. <em>Se trata de pertenecer.</em></h2></div>
        <div className="benefit-grid">{values.map(({ icon: Icon, title, text }, index) => (
          <article className="benefit-item" key={title}><span className="benefit-icon"><Icon size={22} strokeWidth={1.5} aria-hidden="true" /></span><span className="benefit-index">0{index + 1}</span><h3>{title}</h3><p>{text}</p></article>
        ))}</div>
      </div>
    </section>
  );
}
