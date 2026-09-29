import { useCallback, useEffect, useState } from "react";
import { presentations, products } from "./data/products.js";
import { business } from "./config/business.js";
import { addToCart, getCartCount, persistCart, restoreCart } from "./utils/cart.js";
import Navbar from "./components/Navbar.jsx";
import Hero from "./components/Hero.jsx";
import Flavors from "./components/Flavors.jsx";
import About from "./components/About.jsx";
import Process from "./components/Process.jsx";
import Benefits from "./components/Benefits.jsx";
import FeaturedProduct from "./components/FeaturedProduct.jsx";
import OrderSection from "./components/OrderSection.jsx";
import Testimonials from "./components/Testimonials.jsx";
import Contact from "./components/Contact.jsx";
import Footer from "./components/Footer.jsx";
import Cart from "./components/Cart.jsx";

export default function App() {
  const [initialCart] = useState(() =>
    restoreCart(() => window.localStorage, products),
  );
  const [cart, setCart] = useState(initialCart.cart);
  const [cartOpen, setCartOpen] = useState(false);
  const [notice, setNotice] = useState(initialCart.error || "");
  const closeCart = useCallback(() => setCartOpen(false), []);

  useEffect(() => {
    const result = persistCart(() => window.localStorage, cart);
    if (result.error) {
      setNotice(result.error);
      window.setTimeout(() => setNotice(""), 4000);
    }
  }, [cart]);

  function handleAdd(product, presentationId, quantity = 1) {
    setCart((current) => addToCart(current, product.id, presentationId, quantity));
    const presentation = presentations.find((item) => item.id === presentationId);
    setNotice(`Pedido actualizado: ${product.name} · ${presentation?.label ?? ""} × ${quantity}`);
    window.setTimeout(() => setNotice(""), 2600);
  }

  return (
    <>
      <a className="skip-link" href="#contenido">Saltar al contenido</a>
      <Navbar cartCount={getCartCount(cart)} onCartClick={() => setCartOpen(true)} />
      <main id="contenido">
        <Hero />
        <Flavors products={products} />
        <About />
        <Process />
        <Benefits />
        <FeaturedProduct />
        <OrderSection products={products} presentations={presentations} onAdd={handleAdd} />
        <Testimonials />
        <Contact config={business} />
      </main>
      <Footer config={business} />
      {notice && <div className="toast" role="status" aria-live="polite">{notice}</div>}
      {cartOpen && (
        <div className="cart-backdrop" onMouseDown={(event) => {
          if (event.target === event.currentTarget) setCartOpen(false);
        }}>
          <div className="cart-dialog" role="dialog" aria-modal="true" aria-labelledby="cart-title">
            <Cart
              products={products}
              cart={cart}
              onClose={closeCart}
              onCartChange={setCart}
              whatsapp={business.whatsapp}
            />
          </div>
        </div>
      )}
    </>
  );
}
