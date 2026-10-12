import { useEffect, useRef, useState } from "react";
import { Minus, Plus, ShoppingBag, X } from "lucide-react";
import { presentations } from "../data/products.js";
import { getCartTotal, updateCartQuantity } from "../utils/cart.js";
import { formatBolivianos } from "../utils/currency.js";
import { createOrderMessage, createWhatsAppUrl } from "../utils/whatsapp.js";
import { saveOrder } from "../lib/orders.js";

export default function Cart({
  products,
  cart,
  onClose,
  onCartChange,
  whatsapp,
}) {
  const closeButton = useRef(null);
  const cartPanel = useRef(null);

  const [customer, setCustomer] = useState({
    name: "",
    phone: "",
    email: "",
  });

  const [saving, setSaving] = useState(false);
  const [orderError, setOrderError] = useState("");

  const items = cart
    .map((item) => ({
      ...item,
      product: products.find((product) => product.id === item.productId),
      presentation: presentations.find(
        (presentation) => presentation.id === item.presentationId
      ),
    }))
    .filter((item) => item.product && item.presentation);

  const total = getCartTotal(cart, products);

  const message = createOrderMessage(
    cart,
    products,
    presentations,
    whatsapp.greeting
  );

  const orderUrl = cart.length
    ? createWhatsAppUrl(whatsapp.phone, message)
    : null;

  useEffect(() => {
    const previousFocus = document.activeElement;
    const previousOverflow = document.body.style.overflow;

    document.body.style.overflow = "hidden";
    closeButton.current?.focus();

    function handleKeyDown(event) {
      if (event.key === "Escape") {
        onClose();
        return;
      }

      if (event.key !== "Tab") return;

      const focusable = cartPanel.current?.querySelectorAll(
        'a[href], button:not([disabled]), input:not([disabled])'
      );

      if (!focusable?.length) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;

      if (previousFocus instanceof HTMLElement) {
        previousFocus.focus();
      }
    };
  }, [onClose]);

  function handleCustomerChange(event) {
    const { name, value } = event.target;

    setCustomer((current) => ({
      ...current,
      [name]: value,
    }));
  }

  async function handleCheckout(event) {
    event.preventDefault();

    if (!orderUrl || saving) return;

    setSaving(true);
    setOrderError("");

    try {
      await saveOrder({
        customer,
        cart,
        products,
        presentations,
      });

      window.location.href = orderUrl;
    } catch (error) {
      console.error("No se pudo registrar el pedido:", error);

      setOrderError(
        "No pudimos registrar tu pedido. Inténtalo nuevamente."
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <section
      className="cart-panel"
      ref={cartPanel}
      aria-labelledby="cart-title"
    >
      <div className="cart-header">
        <div>
          <p className="eyebrow">Un poquito de nuestra tierra</p>
          <h2 id="cart-title">Tu pedido</h2>
        </div>

        <button
          ref={closeButton}
          className="icon-button"
          type="button"
          onClick={onClose}
          aria-label="Cerrar carrito"
        >
          <X size={20} />
        </button>
      </div>

      {items.length === 0 ? (
        <div className="cart-empty">
          <span className="cart-empty-icon">
            <ShoppingBag size={24} />
          </span>

          <h3>Tu carrito está esperando.</h3>

          <p>Agrega los sabores que quieras descubrir.</p>

          <button
            type="button"
            className="button button-dark"
            onClick={onClose}
          >
            Explorar sabores
          </button>
        </div>
      ) : (
        <>
          <div className="cart-items">
            {items.map(
              ({
                product,
                presentation,
                presentationId,
                quantity,
              }) => (
                <article
                  className="cart-item"
                  key={`${product.id}:${presentationId}`}
                >
                  <span
                    className={`cart-item-swatch swatch-${product.id}`}
                    aria-hidden="true"
                  />

                  <div className="cart-item-copy">
                    <h3>{product.name}</h3>
                    <span>{presentation.label}</span>

                    <span>
                      {Number.isFinite(
                        product.prices[presentationId]
                      )
                        ? formatBolivianos(
                            product.prices[presentationId]
                          )
                        : "Precio por definir"}
                    </span>
                  </div>

                  <div
                    className="quantity-control"
                    aria-label={`Cantidad de ${product.name}, ${presentation.label}`}
                  >
                    <button
                      type="button"
                      aria-label={`Quitar una unidad de ${product.name}, ${presentation.label}`}
                      onClick={() =>
                        onCartChange(
                          updateCartQuantity(
                            cart,
                            product.id,
                            presentationId,
                            quantity - 1
                          )
                        )
                      }
                    >
                      <Minus size={14} />
                    </button>

                    <span aria-live="polite">
                      {quantity}
                    </span>

                    <button
                      type="button"
                      aria-label={`Agregar una unidad de ${product.name}, ${presentation.label}`}
                      onClick={() =>
                        onCartChange(
                          updateCartQuantity(
                            cart,
                            product.id,
                            presentationId,
                            quantity + 1
                          )
                        )
                      }
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                </article>
              )
            )}
          </div>

          <div className="cart-summary">
            {total === null ? (
              <>
                <span>Total</span>
                <strong>Por definir</strong>
              </>
            ) : (
              <>
                <span>Total</span>
                <strong>{formatBolivianos(total)}</strong>
              </>
            )}
          </div>

          <p className="cart-disclaimer">
            Presentaciones, precios y disponibilidad sujetos a
            confirmación. No se realizan pagos en línea.
          </p>

          {orderUrl ? (
            <form
              className="cart-customer-form"
              onSubmit={handleCheckout}
            >
              <h3>Datos para tu pedido</h3>

              <label>
                Nombre
                <input
                  type="text"
                  name="name"
                  value={customer.name}
                  onChange={handleCustomerChange}
                  required
                  minLength={2}
                  autoComplete="name"
                  placeholder="Tu nombre"
                />
              </label>

              <label>
                WhatsApp
                <input
                  type="tel"
                  name="phone"
                  value={customer.phone}
                  onChange={handleCustomerChange}
                  required
                  minLength={7}
                  autoComplete="tel"
                  placeholder="Ej. 75415517"
                />
              </label>

              <label>
                Correo electrónico
                <input
                  type="email"
                  name="email"
                  value={customer.email}
                  onChange={handleCustomerChange}
                  autoComplete="email"
                  placeholder="Opcional"
                />
              </label>

              {orderError && (
                <p
                  className="cart-order-error"
                  role="alert"
                >
                  {orderError}
                </p>
              )}

              <button
                className="button button-dark cart-submit"
                type="submit"
                disabled={saving}
              >
                {saving
                  ? "Registrando pedido..."
                  : "Continuar por WhatsApp"}
                {!saving && (
                  <span aria-hidden="true">↗</span>
                )}
              </button>
            </form>
          ) : (
            <div
              className="whatsapp-unconfigured"
              role="status"
            >
              <strong>
                Pedidos por WhatsApp próximamente
              </strong>

              <span>
                El número oficial de contacto aún no está
                configurado.
              </span>
            </div>
          )}
        </>
      )}
    </section>
  );
}