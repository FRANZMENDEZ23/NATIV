import { useEffect, useRef, useState } from "react";
import { Minus, Plus, ShoppingBasket } from "lucide-react";
import { formatBolivianos } from "../utils/currency.js";

function getImageSource(imagePath) {
  return `${import.meta.env.BASE_URL}${imagePath.replace(/^\/+/, "")}`;
}

export default function OrderSection({ products, presentations, onAdd }) {
  const [productId, setProductId] = useState(products[0]?.id ?? "");
  const [presentationId, setPresentationId] = useState(presentations[0]?.id ?? "");
  const [quantity, setQuantity] = useState(1);
  const [photoUnavailable, setPhotoUnavailable] = useState(false);
  const sectionRef = useRef(null);
  const selectedProduct = products.find((product) => product.id === productId) ?? products[0];
  const selectedPresentation = presentations.find(
    (presentation) => presentation.id === presentationId,
  ) ?? presentations[0];

  useEffect(() => {
    const imageSources = new Set(
      [
        ...products.flatMap((product) => Object.values(product.presentationImages ?? {})),
        ...presentations.map((presentation) => presentation.image),
      ]
        .filter((imagePath) => typeof imagePath === "string" && imagePath.length > 0)
        .map(getImageSource),
    );

    const preloadImages = () => {
      imageSources.forEach((imageSource) => {
        const image = new Image();
        image.src = imageSource;
      });
    };

    if (!("IntersectionObserver" in window) || !sectionRef.current) {
      preloadImages();
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          preloadImages();
          observer.disconnect();
        }
      },
      { rootMargin: "300px" },
    );

    observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, [products, presentations]);

  if (!selectedProduct || !selectedPresentation) return null;

  const productImage =
    selectedProduct?.presentationImages?.[selectedPresentation.id] ||
    selectedPresentation.image;
  const imageSource = getImageSource(productImage);
  const price = selectedProduct.prices[presentationId];

  function chooseProduct(id) {
    setProductId(id);
    setPhotoUnavailable(false);
  }

  function choosePresentation(id) {
    setPresentationId(id);
    setPhotoUnavailable(false);
  }

  return (
    <section ref={sectionRef} className="orders section-pad" id="pedidos" aria-labelledby="orders-title">
      <div className="section-wrap">
        <div className="section-heading order-heading">
          <div>
            <p className="eyebrow">Tu próximo favorito</p>
            <h2 id="orders-title">Arma tu pedido<br /><em>a tu manera.</em></h2>
          </div>
          <p>Elige el sabor, la presentación y la cantidad. Nosotros nos encargamos del resto.</p>
        </div>
        <div className="configurator">
          <div
            className={`configurator-image-panel ${photoUnavailable ? "is-placeholder" : ""}`}
            aria-label={`Vista del envase NATIV, ${selectedPresentation.label}`}
          >
            {!photoUnavailable && (
              <img
                className="configurator-package-photo"
                src={imageSource}
                alt={`Envase NATIV de ${selectedPresentation.label}`}
                loading="eager"
                fetchPriority="high"
                onError={() => setPhotoUnavailable(true)}
              />
            )}
            {photoUnavailable && (
              <div className="configurator-package-fallback" role="img" aria-label={`Fotografía oficial del envase ${selectedPresentation.label}, próximamente`}>
                <span className="configurator-fallback-brand">NATIV.</span>
                <span>Fotografía oficial próximamente</span>
              </div>
            )}
            <div className="configurator-image-caption">
              <span>LA PRESENTACIÓN QUE ELEGISTE</span>
              <strong>{selectedPresentation.volume}</strong>
              <span>{selectedPresentation.container}</span>
            </div>
          </div>
          <div className="configurator-options">
            <fieldset className="configurator-step">
              <legend className="configurator-step-title"><span>PASO 1</span><strong>Elige tu sabor</strong></legend>
              <div className="flavor-options" role="group" aria-label="Sabores de yogur">
                {products.map((product) => (
                  <button
                    className={`flavor-option ${product.id === productId ? "is-selected" : ""}`}
                    key={product.id}
                    type="button"
                    aria-pressed={product.id === productId}
                    onClick={() => chooseProduct(product.id)}
                  >
                    <span className={`flavor-option-swatch swatch-${product.id}`} aria-hidden="true" />
                    <span>{product.name}</span>
                  </button>
                ))}
              </div>
            </fieldset>

            <fieldset className="configurator-step">
              <legend className="configurator-step-title"><span>PASO 2</span><strong>Elige presentación</strong></legend>
              <div className="presentation-options" role="group" aria-label="Presentaciones">
                {presentations.map((presentation) => (
                  <button
                    className={`presentation-option ${presentation.id === presentationId ? "is-selected" : ""}`}
                    key={presentation.id}
                    type="button"
                    aria-pressed={presentation.id === presentationId}
                    onClick={() => choosePresentation(presentation.id)}
                  >
                    <span className={`presentation-option-vessel vessel-${presentation.shape}`} aria-hidden="true" />
                    <strong>{presentation.volume}</strong>
                    <span>{presentation.container}</span>
                  </button>
                ))}
              </div>
              <p className="selected-price" aria-live="polite">{Number.isFinite(price) && price >= 0 ? formatBolivianos(price) : "Precio por definir"}</p>
            </fieldset>

            <fieldset className="configurator-step">
              <legend className="configurator-step-title"><span>PASO 3</span><strong>¿Cuántos quieres?</strong></legend>
              <div className="configurator-quantity">
                <button
                  type="button"
                  aria-label="Quitar una unidad"
                  disabled={quantity <= 1}
                  onClick={() => setQuantity((current) => Math.max(1, current - 1))}
                ><Minus size={16} aria-hidden="true" /></button>
                <output aria-live="polite" aria-label={`Cantidad: ${quantity}`}>{quantity}</output>
                <button
                  type="button"
                  aria-label="Agregar una unidad a la cantidad"
                  disabled={quantity >= Number.MAX_SAFE_INTEGER}
                  onClick={() => setQuantity((current) => Math.min(Number.MAX_SAFE_INTEGER, current + 1))}
                ><Plus size={16} aria-hidden="true" /></button>
              </div>
            </fieldset>

            <div className="configurator-submit">
              <p><strong>{selectedProduct.name}</strong><span>{selectedPresentation.label}</span></p>
              <button
                className="button button-dark configurator-add"
                type="button"
                onClick={() => onAdd(selectedProduct, selectedPresentation.id, quantity)}
              >
                <ShoppingBasket size={17} aria-hidden="true" />
                <span>PASO 4 · Agregar a mi pedido</span>
              </button>
            </div>
          </div>
        </div>
        <p className="configurator-note">Sin pagos en línea. Confirmamos disponibilidad y entrega personalmente.</p>
      </div>
    </section>
  );
}
