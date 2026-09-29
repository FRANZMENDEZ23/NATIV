export default function FlavorCard({ product, index }) {
  const imageSource = `${import.meta.env.BASE_URL}${product.image.replace(/^\//, "")}`;

  return (
    <article className={`flavor-card flavor-${product.id}`}>
      <div className="flavor-card-art">
        <span className="flavor-number">0{index + 1}</span>

        <img
          className="flavor-photo"
          src={imageSource}
          alt={`${product.name}, fruta usada para el sabor del yogur NATIV`}
          loading="lazy"
          onError={(e) => {
            e.currentTarget.style.display = "none";
          }}
        />
      </div>

      <div className="flavor-card-copy">
        <div className="flavor-title-row">
          <h3>{product.name}</h3>
        </div>

        <p className="flavor-description">
          {product.description}
        </p>
      </div>
    </article>
  );
}