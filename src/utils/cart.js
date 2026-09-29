const CART_KEY = "nativ-cart";
const CART_VERSION = 2;

function hasValidQuantity(quantity) {
  return Number.isSafeInteger(quantity) && quantity > 0;
}

function itemKey(item) {
  return `${item.productId}:${item.presentationId}`;
}

export function addToCart(cart, productId, presentationId, quantity = 1) {
  if (
    typeof productId !== "string" ||
    !productId ||
    typeof presentationId !== "string" ||
    !presentationId ||
    !hasValidQuantity(quantity)
  ) return cart;
  const found = cart.find(
    (item) => item.productId === productId && item.presentationId === presentationId,
  );
  if (found) {
    if (!Number.isSafeInteger(found.quantity + quantity)) return cart;
    return cart.map((item) =>
      item.productId === productId && item.presentationId === presentationId
        ? { ...item, quantity: item.quantity + quantity }
        : item,
    );
  }
  return [...cart, { productId, presentationId, quantity }];
}

export function updateCartQuantity(cart, productId, presentationId, quantity) {
  if (!Number.isSafeInteger(quantity) || quantity < 0) return cart;
  if (quantity === 0) {
    return cart.filter(
      (item) => item.productId !== productId || item.presentationId !== presentationId,
    );
  }
  return cart.map((item) =>
    item.productId === productId && item.presentationId === presentationId
      ? { ...item, quantity }
      : item,
  );
}

export function getCartCount(cart) {
  return cart.reduce(
    (total, item) => total + (hasValidQuantity(item.quantity) ? item.quantity : 0),
    0,
  );
}

export function getCartTotal(cart, productList) {
  const items = cart.map((item) => ({
    ...item,
    product: productList.find((product) => product.id === item.productId),
  }));
  const configured = items.every(
    ({ product, presentationId, quantity }) =>
      product &&
      Object.hasOwn(product.prices, presentationId) &&
      Number.isFinite(product.prices[presentationId]) &&
      product.prices[presentationId] >= 0 &&
      hasValidQuantity(quantity),
  );
  if (!configured) return null;
  const total = items.reduce(
    (total, item) => total + item.product.prices[item.presentationId] * item.quantity,
    0,
  );
  return Number.isFinite(total) ? total : null;
}

export function restoreCart(storageSource, catalog) {
  try {
    const storage = typeof storageSource === "function" ? storageSource() : storageSource;
    const saved = storage.getItem(CART_KEY);
    if (!saved) return { cart: [], error: null };
    const parsed = JSON.parse(saved);
    if (!parsed || parsed.version !== CART_VERSION || !Array.isArray(parsed.items)) {
      return {
        cart: [],
        error: "Se limpió un pedido guardado con una presentación antigua. Puedes armarlo de nuevo.",
      };
    }
    const catalogById = new Map(catalog.map((product) => [product.id, product]));
    const cart = [];
    for (const item of parsed.items) {
      const product = item && catalogById.get(item.productId);
      if (
        !product ||
        !Object.hasOwn(product.prices, item.presentationId) ||
        !hasValidQuantity(item.quantity)
      ) continue;
      const existing = cart.find((line) => itemKey(line) === itemKey(item));
      if (existing) {
        if (!Number.isSafeInteger(existing.quantity + item.quantity)) continue;
        existing.quantity += item.quantity;
      }
      else cart.push({ productId: item.productId, presentationId: item.presentationId, quantity: item.quantity });
    }
    return { cart, error: null };
  } catch {
    return { cart: [], error: "No se pudo recuperar el pedido guardado en este navegador." };
  }
}

export function persistCart(storageSource, cart) {
  try {
    const storage = typeof storageSource === "function" ? storageSource() : storageSource;
    storage.setItem(CART_KEY, JSON.stringify({ version: CART_VERSION, items: cart }));
    return { error: null };
  } catch {
    return { error: "No se pudo guardar el pedido en este navegador." };
  }
}
