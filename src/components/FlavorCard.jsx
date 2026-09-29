import { useState } from "react";

export default function FlavorCard({ product, index }) {
  const [imageUnavailable, setImageUnavailable] = useState(false);
  const imageSource = `${import.meta.env.BASE_URL}${product.image.replace(/^\//, "")}`;

  return (
    <article className={`flavor-card flavor-${product.id}`}>
      <div className="flavor-card-art">
        <span className="flavor-number">0{index + 1}</span>
        <div className="flavor-image-fallback" aria-hidden="true">
          <span className="flavor-fallback-monogram">{product.name.slice(0, 1)}</span>
          <span>Fotografía NATIV</span>
        </div>
        {!imageUnavailable && (
          <img
            className="flavor-photo"
            src={imageSource}
            alt={`${product.name}, fruta usada para el sabor del yogur NATIV`}
            loading="lazy"
            onError={() => setImageUnavailable(true)}
          />
        )}
      </div>
      <div className="flavor-card-copy">
        <div className="flavor-title-row"><h3>{product.name}</h3></div>
        <p className="flavor-description">{product.description}</p>
      </div>
    </article>
  );
}
