import { MapPin, ExternalLink } from "lucide-react";

const mapsUrl = "https://maps.app.goo.gl/adRgCSdLzaVQRtGU7";

export default function Location() {
  return (
    <section id="ubicacion" className="location-section">
      <div className="location-container">
        <div className="location-copy">
          <span className="location-kicker">Punto de retiro NATIV</span>

          <h2>Cómo llegar</h2>

          <p>
            Si elegiste retiro en tienda, puedes recoger tu pedido directamente
            en nuestro punto NATIV.
          </p>

          <a
            href={mapsUrl}
            target="_blank"
            rel="noreferrer"
            className="location-button"
          >
            <MapPin size={18} />
            Abrir en Google Maps
            <ExternalLink size={16} />
          </a>
        </div>

        <div className="location-map">
         <iframe
  title="Ubicación NATIV"
  src="https://maps.google.com/maps?ll=-17.76472971861917,-63.19192007909826&z=17&t=m&output=embed"
  width="100%"
  height="420"
  style={{ border: 0 }}
  allowFullScreen=""
  loading="lazy"
  referrerPolicy="no-referrer-when-downgrade"
/>
        </div>
      </div>
    </section>
  );
}