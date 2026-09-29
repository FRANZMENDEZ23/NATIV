export default function FruitArt({ fruit, className = "" }) {
  return (
    <div className={`fruit-art fruit-art-${fruit} ${className}`} role="img" aria-label={`Ilustración abstracta inspirada en ${fruit}`}>
      <span className="fruit-orbit fruit-orbit-one" />
      <span className="fruit-orbit fruit-orbit-two" />
      <span className="fruit-shape fruit-shape-one" />
      <span className="fruit-shape fruit-shape-two" />
      <span className="fruit-leaf" />
      <span className="fruit-dot fruit-dot-one" />
      <span className="fruit-dot fruit-dot-two" />
      <span className="fruit-dot fruit-dot-three" />
    </div>
  );
}
