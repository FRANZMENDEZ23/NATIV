# NATIV

Sitio web de NATIV, una marca de yogur artesanal inspirada en frutas y sabores de Bolivia. Aplicación SPA responsive, mobile-first, construida con React, Vite, Tailwind CSS y JavaScript.

## Desarrollo

```bash
npm install
npm run dev
```

Genera la versión de producción con `npm run build` y prévisualízala con `npm run preview`.

## Configuración comercial

Edita `src/config/business.js` para definir el número oficial de WhatsApp (con código de país), correo, usuario o página de Instagram, TikTok y Facebook, ubicación y saludo de pedidos. Los cuatro canales empiezan vacíos salvo la ubicación general confirmada, “Santa Cruz, Bolivia”; mientras estén vacíos no generan enlaces. Mientras el número de WhatsApp esté vacío, el sitio no genera enlaces ni simula pedidos enviados.

En `src/data/products.js`, `presentations` es la lista única de presentaciones (200 ml/tarrina, 500 ml/botella, 1 L/botella grande y 2 L/bidón). Configura los precios por sabor y tamaño en `products[].prices`, usando las claves `200ml`, `500ml`, `1l` y `2l`; deja `null` mientras un precio no esté confirmado. El configurador agrega una combinación sabor/presentación al único carrito, guardado en `localStorage`. El subtotal, total y total del mensaje solo aparecen si cada variante seleccionada tiene un precio numérico. La web no procesa pagos. Recopila testimonios reales antes de agregarlos; la sección actual los identifica como pendientes.

Añade exclusivamente fotografías aprobadas, sin cambiar los nombres documentados en `public/images/products/README.md`, `public/images/fruits/README.md` y `public/images/hero/README.md`. Cada espacio muestra un panel neutro si su archivo todavía no existe; no se descargan imágenes externas.

## Despliegue

- **GitHub Pages:** `.github/workflows/pages.yml` instala, prueba, construye y despliega desde `main`. Activa Pages con la fuente **GitHub Actions** en los ajustes del repositorio. La base `/NATIV/` se aplica automáticamente en GitHub Actions; el flujo no se ejecuta desde esta rama.
- **Netlify:** importa el repositorio. `netlify.toml` define `npm run build`, `dist` y Node 22; los redirects de `public/_redirects` mantienen la SPA.

Para una revisión local, usa `npm run dev`. Comprueba producción con `npm test`, `npm run build` y `npm run preview`.
