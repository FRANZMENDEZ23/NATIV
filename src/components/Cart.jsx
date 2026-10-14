import { useEffect, useRef, useState } from "react";
import { Minus, Plus, ShoppingBag, X } from "lucide-react";
import { presentations } from "../data/products.js";
import { getCartTotal, updateCartQuantity } from "../utils/cart.js";
import { formatBolivianos } from "../utils/currency.js";
import { createOrderMessage, createWhatsAppUrl } from "../utils/whatsapp.js";
import { saveOrder } from "../lib/orders.js";

const deliveryLabels = {
  pickup: "Retiro en tienda",
  delivery: "Envío a domicilio",
};

const paymentLabels = {
  qr: "Código QR",
  cash: "Efectivo",
  card_in_person: "Tarjeta en persona",
};

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

  const [delivery, setDelivery] = useState({
    method: "pickup",
    address: "",
    reference: "",
  });

  const [paymentMethod, setPaymentMethod] = useState("qr");
  const [saving, setSaving] = useState(false);
  const [orderError, setOrderError] = useState("");

  const items = cart
    .map((item) => ({
      ...item,
      product: products.find(
        (product) => product.id === item.productId
      ),
      presentation: presentations.find(
        (presentation) =>
          presentation.id === item.presentationId
      ),
    }))
    .filter((item) => item.product && item.presentation);

  const total = getCartTotal(cart, products);

  const whatsappConfigured =
    cart.length > 0 && Boolean(whatsapp.phone);

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

      const focusable =
        cartPanel.current?.querySelectorAll(
          'a[href], button:not([disabled]), input:not([disabled]), textarea:not([disabled])'
        );

      if (!focusable?.length) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (
        event.shiftKey &&
        document.activeElement === first
      ) {
        event.preventDefault();
        last.focus();
      } else if (
        !event.shiftKey &&
        document.activeElement === last
      ) {
        event.preventDefault();
        first.focus();
      }
    }

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener(
        "keydown",
        handleKeyDown
      );

      document.body.style.overflow =
        previousOverflow;

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

  function handleDeliveryMethod(method) {
    setDelivery((current) => ({
      ...current,
      method,
    }));

    if (
      method === "delivery" &&
      paymentMethod === "card_in_person"
    ) {
      setPaymentMethod("qr");
    }
  }

  function handleDeliveryChange(event) {
    const { name, value } = event.target;

    setDelivery((current) => ({
      ...current,
      [name]: value,
    }));
  }

  async function handleCheckout(event) {
    event.preventDefault();

    if (!whatsappConfigured || saving) return;

    if (
      delivery.method === "delivery" &&
      delivery.address.trim().length < 5
    ) {
      setOrderError(
        "Escribe una dirección válida para el envío."
      );
      return;
    }

    setSaving(true);
    setOrderError("");

    try {
      const savedOrder = await saveOrder({
        customer,
        cart,
        products,
        presentations,
        delivery,
        paymentMethod,
      });

      const baseMessage = createOrderMessage(
        cart,
        products,
        presentations,
        whatsapp.greeting
      );

      const extraMessage = [
        "",
        `Pedido: ${
          savedOrder?.order_number || "NATIV"
        }`,
        `Entrega: ${deliveryLabels[delivery.method]}`,
        `Pago: ${paymentLabels[paymentMethod]}`,
        delivery.method === "delivery"
          ? `Dirección: ${delivery.address.trim()}`
          : null,
        delivery.method === "delivery" &&
        delivery.reference.trim()
          ? `Referencia: ${delivery.reference.trim()}`
          : null,
        "",
        "El pedido ya fue confirmado en la web. Quisiera coordinar los detalles de entrega y pago.",
      ]
        .filter(Boolean)
        .join("\n");

      const finalMessage = `${baseMessage}\n${extraMessage}`;

      const orderUrl = createWhatsAppUrl(
        whatsapp.phone,
        finalMessage
      );

      window.location.href = orderUrl;
    } catch (error) {
      console.error(
        "No se pudo registrar el pedido:",
        error
      );

      setOrderError(
        "No pudimos confirmar tu pedido. Inténtalo nuevamente."
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
          <p className="eyebrow">
            Un poquito de nuestra tierra
          </p>

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

          <p>
            Agrega los sabores que quieras descubrir.
          </p>

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

                    <span>
                      {presentation.label}
                    </span>

                    <span>
                      {Number.isFinite(
                        product.prices[presentationId]
                      )
                        ? formatBolivianos(
                            product.prices[
                              presentationId
                            ]
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

                    <span>{quantity}</span>

                    <button
                      type="button"
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
                <strong>
                  {formatBolivianos(total)}
                </strong>
              </>
            )}
          </div>

          {whatsappConfigured ? (
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
                  placeholder="Opcional"
                />
              </label>

              <div className="checkout-section">
                <h3>¿Cómo recibirás tu pedido?</h3>

                <div className="checkout-options">
                  <label className="checkout-option">
                    <input
                      type="radio"
                      name="deliveryMethod"
                      checked={
                        delivery.method === "pickup"
                      }
                      onChange={() =>
                        handleDeliveryMethod("pickup")
                      }
                    />

                    <span>
                      <strong>
                        Retiro en tienda
                      </strong>
                      <small>
                        Recoge tu pedido directamente
                        en NATIV.
                      </small>
                    </span>
                  </label>

                  <label className="checkout-option">
                    <input
                      type="radio"
                      name="deliveryMethod"
                      checked={
                        delivery.method === "delivery"
                      }
                      onChange={() =>
                        handleDeliveryMethod(
                          "delivery"
                        )
                      }
                    />

                    <span>
                      <strong>
                        Envío a domicilio
                      </strong>
                      <small>
                        Recibe NATIV en la dirección
                        que indiques.
                      </small>
                    </span>
                  </label>
                </div>
              </div>

              {delivery.method === "delivery" && (
                <div className="delivery-fields">
                  <label>
                    Dirección de entrega
                    <input
                      type="text"
                      name="address"
                      value={delivery.address}
                      onChange={
                        handleDeliveryChange
                      }
                      required
                      placeholder="Calle, avenida, número, zona..."
                    />
                  </label>

                  <label>
                    Referencia
                    <input
                      type="text"
                      name="reference"
                      value={delivery.reference}
                      onChange={
                        handleDeliveryChange
                      }
                      placeholder="Ej. Portón verde, frente a..."
                    />
                  </label>
                </div>
              )}

              <div className="checkout-section">
                <h3>Método de pago</h3>

                <div className="checkout-options">
                  <label className="checkout-option">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="qr"
                      checked={
                        paymentMethod === "qr"
                      }
                      onChange={() =>
                        setPaymentMethod("qr")
                      }
                    />

                    <span>
                      <strong>Código QR</strong>
                      <small>
                        Coordina el pago mediante QR.
                      </small>
                    </span>
                  </label>

                  <label className="checkout-option">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="cash"
                      checked={
                        paymentMethod === "cash"
                      }
                      onChange={() =>
                        setPaymentMethod("cash")
                      }
                    />

                    <span>
                      <strong>Efectivo</strong>
                      <small>
                        {delivery.method === "pickup"
                          ? "Paga al recoger tu pedido."
                          : "Paga al recibir tu pedido."}
                      </small>
                    </span>
                  </label>

                  {delivery.method === "pickup" && (
                    <label className="checkout-option">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="card_in_person"
                        checked={
                          paymentMethod ===
                          "card_in_person"
                        }
                        onChange={() =>
                          setPaymentMethod(
                            "card_in_person"
                          )
                        }
                      />

                      <span>
                        <strong>
                          Tarjeta en persona
                        </strong>
                        <small>
                          Paga con tarjeta cuando
                          recojas tu pedido.
                        </small>
                      </span>
                    </label>
                  )}
                </div>
              </div>

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
                  ? "Confirmando compra..."
                  : "Confirmar compra"}

                {!saving && (
                  <span aria-hidden="true">↗</span>
                )}
              </button>

              <p className="checkout-note">
                Después de confirmar, te llevaremos a
                WhatsApp para coordinar los detalles
                finales de entrega y pago.
              </p>
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
                El número oficial de contacto aún no
                está configurado.
              </span>
            </div>
          )}
        </>
      )}
    </section>
  );
}