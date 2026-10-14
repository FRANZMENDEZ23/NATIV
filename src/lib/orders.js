import { supabase } from "./supabase.js";

const SESSION_KEY = "nativ_session_id";

function getSessionId() {
  let sessionId = window.localStorage.getItem(SESSION_KEY);

  if (!sessionId) {
    sessionId = crypto.randomUUID();
    window.localStorage.setItem(SESSION_KEY, sessionId);
  }

  return sessionId;
}

export async function saveOrder({
  customer,
  cart,
  products,
  presentations,
  delivery,
  paymentMethod,
}) {
  const items = cart
    .map(({ productId, presentationId, quantity }) => {
      const product = products.find((item) => item.id === productId);
      const presentation = presentations.find(
        (item) => item.id === presentationId
      );

      if (!product || !presentation) return null;

     return {
  flavor: product.id === "maracuya" ? "guapuru" : product.id,
  size: presentation.id,
  quantity,
  unit_price: Number.isFinite(product.prices[presentationId])
    ? product.prices[presentationId]
    : null,
  product_code: product.codes?.[presentationId] || null,
};
    })
    .filter(Boolean);

  if (!items.length) {
    throw new Error("El pedido no contiene productos.");
  }
const sessionId = getSessionId();
  const { data, error } = await supabase.rpc("create_web_order_v3", {
    p_full_name: customer.name.trim(),
    p_phone: customer.phone.trim(),
    p_email: customer.email?.trim() || null,
    p_nit: customer.nit?.trim() || null,
    p_session_id: sessionId,
    p_items: items,
    p_total_amount: null,
    p_delivery_method: delivery.method,
    p_delivery_address:
      delivery.method === "delivery"
        ? delivery.address.trim()
        : null,
    p_delivery_reference:
      delivery.method === "delivery"
        ? delivery.reference?.trim() || null
        : null,
    p_payment_method: paymentMethod,
  });

  if (error) {
  throw error;
}

const savedOrder = data?.[0] || null;

if (savedOrder?.order_id) {
  try {
    const { error: emailError } = await supabase.functions.invoke(
      "send-order-confirmation",
      {
        body: {
          order_id: savedOrder.order_id,
          session_id: sessionId,
        },
      }
    );

    if (emailError) {
      console.warn(
        "El pedido se guardó, pero no se pudo enviar el correo:",
        emailError
      );
    }
  } catch (emailError) {
    console.warn(
      "El pedido se guardó, pero ocurrió un error al enviar el correo:",
      emailError
    );
  }
}

return savedOrder;
   
}