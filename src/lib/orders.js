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
        unit_price: null,
      };
    })
    .filter(Boolean);

  if (!items.length) {
    throw new Error("El pedido no contiene productos.");
  }

  const { data, error } = await supabase.rpc("create_web_order", {
    p_full_name: customer.name.trim(),
    p_phone: customer.phone.trim(),
    p_email: customer.email?.trim() || null,
    p_session_id: getSessionId(),
    p_items: items,
    p_total_amount: null,
  });

  if (error) {
    throw error;
  }

  return data?.[0] || null;
}