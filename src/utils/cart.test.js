import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { business } from "../config/business.js";
import { presentations, products } from "../data/products.js";
import {
  addToCart,
  getCartCount,
  getCartTotal,
  persistCart,
  restoreCart,
  updateCartQuantity,
} from "./cart.js";
import { createOrderMessage, createWhatsAppUrl } from "./whatsapp.js";

test("catalog exposes four flavors and four stable, visible presentation options", () => {
  assert.equal(products.length, 4);
  assert.deepEqual(
    presentations.map(({ id, volume, container }) => [id, volume, container]),
    [
      ["200ml", "200 ml", "Tarrina"],
      ["500ml", "500 ml", "Botella"],
      ["1l", "1 L", "Botella grande"],
      ["2l", "2 L", "Bidón"],
    ],
  );
  assert.deepEqual(
    presentations.map(({ image }) => image),
    [
      "/images/products/nativ-200ml.webp",
      "/images/products/nativ-500ml.webp",
      "/images/products/nativ-1l.webp",
      "/images/products/nativ-2l.webp",
    ],
  );
  for (const product of products) {
    assert.deepEqual(Object.keys(product.prices), presentations.map(({ id }) => id));
    assert.ok(Object.values(product.prices).every((price) => price === null));
    assert.match(product.image, /^\/images\/fruits\/.*\.webp$/);
  }
});

test("merges the same flavor and presentation but keeps different sizes separate", () => {
  const original = [];
  const first = addToCart(original, "chirimoya", "500ml", 3);
  const second = addToCart(first, "chirimoya", "500ml", 2);
  const third = addToCart(second, "chirimoya", "1l", 1);

  assert.deepEqual(original, []);
  assert.deepEqual(first, [{ productId: "chirimoya", presentationId: "500ml", quantity: 3 }]);
  assert.deepEqual(second, [{ productId: "chirimoya", presentationId: "500ml", quantity: 5 }]);
  assert.deepEqual(third, [
    { productId: "chirimoya", presentationId: "500ml", quantity: 5 },
    { productId: "chirimoya", presentationId: "1l", quantity: 1 },
  ]);
  assert.equal(getCartCount(third), 6);
  assert.equal(addToCart(third, "chirimoya", "1l", Number.MAX_SAFE_INTEGER), third);
});

test("updates or removes only the selected flavor and presentation", () => {
  const cart = [
    { productId: "chirimoya", presentationId: "500ml", quantity: 2 },
    { productId: "chirimoya", presentationId: "1l", quantity: 1 },
  ];

  assert.deepEqual(updateCartQuantity(cart, "chirimoya", "500ml", 4), [
    { productId: "chirimoya", presentationId: "500ml", quantity: 4 },
    { productId: "chirimoya", presentationId: "1l", quantity: 1 },
  ]);
  assert.deepEqual(updateCartQuantity(cart, "chirimoya", "500ml", 0), [
    { productId: "chirimoya", presentationId: "1l", quantity: 1 },
  ]);
  assert.equal(addToCart(cart, "chirimoya", "500ml", 0), cart);
});

test("calculates totals per exact presentation and waits for every selected price", () => {
  const cart = [
    { productId: "chirimoya", presentationId: "500ml", quantity: 2 },
    { productId: "chirimoya", presentationId: "1l", quantity: 1 },
  ];
  assert.equal(getCartTotal(cart, products), null);

  const priced = products.map((product) =>
    product.id === "chirimoya"
      ? { ...product, prices: { ...product.prices, "500ml": 12.5, "1l": 20 } }
      : product,
  );
  assert.equal(getCartTotal(cart, priced), 45);
  assert.equal(getCartTotal(cart, products), null);
});

test("keeps unconfirmed contact details empty and only the known general location", () => {
  assert.equal(business.location, "Santa Cruz, Bolivia");
  assert.equal(business.whatsapp.phone, "");
  assert.equal(business.contact.email, "");
  assert.equal(business.contact.instagram, "");
  assert.equal(business.contact.tiktok, "");
  assert.equal(business.contact.facebook, "");
});

test("persists versioned variants and restores only valid flavor/presentation pairs", () => {
  const values = new Map();
  const storage = {
    getItem: (key) => values.get(key) ?? null,
    setItem: (key, value) => values.set(key, value),
  };
  const cart = [
    { productId: "chirimoya", presentationId: "500ml", quantity: 2 },
    { productId: "chirimoya", presentationId: "500ml", quantity: 1 },
    { productId: "chirimoya", presentationId: "unknown", quantity: 1 },
    { productId: "unknown", presentationId: "1l", quantity: 1 },
    { productId: "copoazu", presentationId: "2l", quantity: -1 },
  ];

  assert.deepEqual(persistCart(storage, cart), { error: null });
  assert.deepEqual(JSON.parse(values.get("nativ-cart")), {
    version: 2,
    items: cart,
  });
  assert.deepEqual(restoreCart(storage, products), {
    cart: [{ productId: "chirimoya", presentationId: "500ml", quantity: 3 }],
    error: null,
  });
});

test("rejects obsolete or corrupt cart storage with a clear recovery message", () => {
  const corrupt = { getItem: () => "{" };
  const obsolete = { getItem: () => JSON.stringify([{ productId: "chirimoya", quantity: 2 }]) };
  const unavailable = {
    getItem: () => null,
    setItem: () => { throw new Error("quota"); },
  };

  assert.match(restoreCart(corrupt, products).error, /recuperar/);
  assert.match(restoreCart(obsolete, products).error, /antigua/);
  assert.match(persistCart(unavailable, []).error, /guardar/);
});

test("formats order lines with flavor and selected presentation, includes only a configured total", () => {
  const cart = [{ productId: "chirimoya", presentationId: "500ml", quantity: 2 }];
  const greeting = "Hola, NATIV. Quisiera hacer este pedido:";
  const withoutPrices = createOrderMessage(cart, products, presentations, greeting);
  assert.match(withoutPrices, /• Chirimoya — Botella · 500 ml × 2/);
  assert.doesNotMatch(withoutPrices, /Total:/);
  assert.match(withoutPrices, /¡Gracias!/);

  const priced = products.map((product) =>
    product.id === "chirimoya"
      ? { ...product, prices: { ...product.prices, "500ml": 10 } }
      : product,
  );
  assert.match(createOrderMessage(cart, priced, presentations, greeting), /Total: Bs\s?20/);
});

test("never creates a WhatsApp link without a configured number", () => {
  assert.equal(createWhatsAppUrl("", "pedido"), null);
  assert.equal(createWhatsAppUrl(undefined, "pedido"), null);
  assert.match(createWhatsAppUrl("+591 700 10000", "hola NATIV"), /^https:\/\/wa\.me\/59170010000\?text=/);
});

test("keeps the flavor showcase informational and centralizes add-to-cart in the configurator", async () => {
  const [flavors, flavorCard, configurator] = await Promise.all([
    readFile(new URL("../components/Flavors.jsx", import.meta.url), "utf8"),
    readFile(new URL("../components/FlavorCard.jsx", import.meta.url), "utf8"),
    readFile(new URL("../components/OrderSection.jsx", import.meta.url), "utf8"),
  ]);

  assert.doesNotMatch(flavors, /onAdd|quantity|<button\b/i);
  assert.doesNotMatch(flavorCard, /onAdd|<button\b|<select\b|quantity|presentation|price/i);
  assert.match(configurator, /onAdd\(selectedProduct,\s*selectedPresentation\.id,\s*quantity\)/);
  assert.match(configurator, /presentations\.map/);
});
