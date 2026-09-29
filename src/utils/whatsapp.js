import { getCartTotal } from "./cart.js";
import { formatBolivianos } from "./currency.js";

export function createWhatsAppUrl(phone, message) {
  const normalizedPhone = String(phone || "").replace(/\D/g, "");
  if (!normalizedPhone) return null;
  return `https://wa.me/${normalizedPhone}?text=${encodeURIComponent(message)}`;
}

export function createOrderMessage(cart, productList, presentationList, greeting) {
  const lines = cart.map(({ productId, presentationId, quantity }) => {
    const product = productList.find((item) => item.id === productId);
    const presentation = presentationList.find((item) => item.id === presentationId);
    return product && presentation
      ? `• ${product.name} — ${presentation.label} × ${quantity}`
      : null;
  }).filter(Boolean);
  const total = getCartTotal(cart, productList);
  const formattedTotal = total === null ? null : formatBolivianos(total);
  return [
    greeting,
    "",
    ...lines,
    ...(formattedTotal ? ["", `Total: ${formattedTotal}`] : []),
    "",
    "¡Gracias!",
  ].join("\n");
}
