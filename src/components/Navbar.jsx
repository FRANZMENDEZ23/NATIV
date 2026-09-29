import { useState } from "react";
import { Leaf, Menu, ShoppingBag, X } from "lucide-react";

const links = [
  ["Sabores", "#sabores"],
  ["Nuestra historia", "#historia"],
  ["Así lo hacemos", "#proceso"],
  ["Pedidos", "#pedidos"],
];

export default function Navbar({ cartCount, onCartClick }) {
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <header className="site-header">
      <nav className="nav-shell" aria-label="Navegación principal">
        <a className="brand" href="#inicio" aria-label="NATIV, inicio">
          <span className="brand-mark"><Leaf size={20} strokeWidth={1.8} aria-hidden="true" /></span>
          <span>NATIV<span className="brand-period">.</span></span>
        </a>
        <div className={`nav-links ${menuOpen ? "is-open" : ""}`}>
          {links.map(([label, href]) => (
            <a href={href} key={href} onClick={() => setMenuOpen(false)}>{label}</a>
          ))}
        </div>
        <div className="nav-actions">
          <button className="nav-cart" type="button" onClick={onCartClick} aria-label={`Abrir carrito, ${cartCount} productos`}>
            <ShoppingBag size={18} aria-hidden="true" /><span>Mi pedido</span>
            {cartCount > 0 && <span className="cart-count">{cartCount}</span>}
          </button>
          <button className="menu-toggle" type="button" onClick={() => setMenuOpen(!menuOpen)} aria-expanded={menuOpen} aria-label={menuOpen ? "Cerrar menú" : "Abrir menú"}>
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </nav>
    </header>
  );
}
