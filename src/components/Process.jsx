import { Box, PackageCheck, Sprout, Truck, UtensilsCrossed } from "lucide-react";

const steps = [
  { number: "01", title: "Elegimos", text: "Seleccionamos frutas con atención a su carácter y a lo que cada una tiene para contar.", icon: Sprout },
  { number: "02", title: "Preparamos", text: "Cada fruta se prepara con cuidado para conservar su identidad en cada receta.", icon: UtensilsCrossed },
  { number: "03", title: "Creamos", text: "Elaboramos nuestro yogur de manera artesanal, paso a paso y sin prisa.", icon: PackageCheck },
  { number: "04", title: "Envasamos", text: "Preparamos cada envase con cuidado antes de compartirlo.", icon: Box },
  { number: "05", title: "Entregamos", text: "Coordinamos la entrega para que llegue a tu mesa.", icon: Truck },
];

export default function Process() {
  return (
    <section className="process section-pad" id="proceso" aria-labelledby="process-title">
      <div className="section-wrap">
        <div className="process-heading"><p className="eyebrow">Del origen a tu mesa</p><h2 id="process-title">El cuidado está<br /><em>en cada paso.</em></h2><p>Lo artesanal no es un atajo. Es prestar atención, una y otra vez.</p></div>
        <div className="process-steps">
          {steps.map(({ number, title, text, icon: Icon }) => (
            <article className="process-step" key={number}>
              <span className="step-number">{number}</span><span className="step-icon"><Icon size={21} strokeWidth={1.5} aria-hidden="true" /></span>
              <h3>{title}</h3><p>{text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
