import { useEffect, useState } from "react";
import { LogOut, RefreshCw } from "lucide-react";
import { supabase } from "../lib/supabase.js";

const statusLabels = {
  confirmed: "Confirmado",
  preparing: "Preparando",
  ready_for_pickup: "Listo para retirar",
  out_for_delivery: "En camino",
  delivered: "Entregado",
  cancelled: "Cancelado",
  pending_whatsapp: "Pendiente en WhatsApp",
};

const paymentLabels = {
  qr: "Código QR",
  cash: "Efectivo",
  card_in_person: "Tarjeta en persona",
};

const deliveryLabels = {
  pickup: "Retiro en tienda",
  delivery: "Envío a domicilio",
};
function getNextOrderAction(order) {
  if (order.status === "confirmed") {
    return {
      label: "Preparar pedido",
      status: "preparing",
    };
  }

 if (order.status === "preparing") {
  if (order.delivery_method === "pickup") {
    return {
      label: "Marcar como listo para retirar",
      status: "ready_for_pickup",
    };
  }

    if (order.delivery_method === "delivery") {
      return {
        label: "Enviar pedido",
        status: "out_for_delivery",
      };
    }
  }

  if (
    order.status === "ready_for_pickup" ||
    order.status === "out_for_delivery"
  ) {
    return {
      label: "Marcar como entregado",
      status: "delivered",
    };
  }

  return null;
}

export default function AdminPanel() {
  const [session, setSession] = useState(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loginLoading, setLoginLoading] = useState(false);
  const [updatingId, setUpdatingId] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;

    supabase.auth.getSession().then(({ data }) => {
      if (!mounted) return;
      setSession(data.session);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (session) {
      loadOrders();
    } else {
      setOrders([]);
    }
  }, [session]);

  async function handleLogin(event) {
    event.preventDefault();

    setLoginLoading(true);
    setError("");

    const { error: loginError } =
      await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

    if (loginError) {
      setError("Correo o contraseña incorrectos.");
    }

    setLoginLoading(false);
  }

  async function handleLogout() {
    await supabase.auth.signOut();
  }

  async function loadOrders() {
    setLoading(true);
    setError("");

    const { data, error: ordersError } = await supabase
      .from("orders")
      .select(`
        id,
        order_number,
        status,
        delivery_method,
        delivery_address,
        delivery_reference,
        payment_method,
        payment_status,
        total_amount,
        currency,
        created_at,
        customers (
          full_name,
          phone,
          email
        ),
        order_items (
          id,
          flavor,
          size,
          quantity,
          unit_price
        )
      `)
      .order("created_at", { ascending: false });

    if (ordersError) {
      console.error(ordersError);
      setError(
        "No se pudieron cargar los pedidos. Verifica que esta cuenta tenga permiso de administrador."
      );
      setOrders([]);
    } else {
      setOrders(data || []);
    }

    setLoading(false);
  }

  async function updateOrder(orderId, changes) {
    setUpdatingId(orderId);
    setError("");

    const { error: updateError } = await supabase.rpc(
      "admin_update_order_status",
      {
        p_order_id: orderId,
        p_status: changes.status ?? null,
        p_payment_status: changes.paymentStatus ?? null,
      }
    );

    if (updateError) {
      console.error(updateError);
      setError("No se pudo actualizar el pedido.");
    } else {
      await loadOrders();
    }

    setUpdatingId(null);
  }

  if (loading && !session) {
    return (
      <main className="admin-page">
        <p>Cargando panel...</p>
      </main>
    );
  }

  if (!session) {
    return (
      <main className="admin-page">
        <section className="admin-login">
          <p className="eyebrow">NATIV · Administración</p>

          <h1>Panel de pedidos</h1>

          <p>
            Inicia sesión con tu cuenta administrativa para revisar
            los pedidos realizados desde la página web.
          </p>

          <form onSubmit={handleLogin}>
            <label>
              Correo electrónico
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                autoComplete="email"
                required
              />
            </label>

            <label>
              Contraseña
              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                autoComplete="current-password"
                required
              />
            </label>

            {error && (
              <p className="admin-error" role="alert">
                {error}
              </p>
            )}

            <button
              className="button button-dark"
              type="submit"
              disabled={loginLoading}
            >
              {loginLoading ? "Ingresando..." : "Ingresar"}
            </button>
          </form>
        </section>
      </main>
    );
  }

  return (
    <main className="admin-page">
      <header className="admin-header">
        <div>
          <p className="eyebrow">NATIV · Administración</p>
          <h1>Pedidos</h1>
          <p>{session.user.email}</p>
        </div>

        <div className="admin-actions">
          <button
            type="button"
            className="button"
            onClick={loadOrders}
            disabled={loading}
          >
            <RefreshCw size={16} />
            Actualizar
          </button>

          <button
            type="button"
            className="button"
            onClick={handleLogout}
          >
            <LogOut size={16} />
            Salir
          </button>
        </div>
      </header>

      {error && (
        <p className="admin-error" role="alert">
          {error}
        </p>
      )}

      {loading ? (
        <p>Cargando pedidos...</p>
      ) : orders.length === 0 ? (
        <section className="admin-empty">
          <h2>No hay pedidos todavía</h2>
          <p>
            Los pedidos registrados desde la web aparecerán aquí.
          </p>
        </section>
      ) : (
        <section className="admin-orders">
          {orders.map((order) => (
            <article className="admin-order-card" key={order.id}>
              <div className="admin-order-top">
                <div>
                  <span className="admin-order-number">
                    {order.order_number}
                  </span>

                  <h2>
                    {order.customers?.full_name ||
                      "Cliente sin nombre"}
                  </h2>
                </div>

                <span
                  className={`admin-status admin-status-${order.status}`}
                >
                  {statusLabels[order.status] || order.status}
                </span>
              </div>

              <div className="admin-customer">
                <span>
                  <strong>WhatsApp:</strong>{" "}
                  {order.customers?.phone || "—"}
                </span>

                <span>
                  <strong>Correo:</strong>{" "}
                  {order.customers?.email || "—"}
                </span>

                <span>
                  <strong>Fecha:</strong>{" "}
                  {new Date(order.created_at).toLocaleString("es-BO")}
                </span>
              </div>

              <div className="admin-order-meta">
                <div>
                  <strong>Entrega</strong>
                  <span>
                    {deliveryLabels[order.delivery_method] || "—"}
                  </span>
                </div>

                <div>
                  <strong>Pago</strong>
                  <span>
                    {paymentLabels[order.payment_method] || "—"}
                  </span>
                </div>

                <div>
                  <strong>Estado del pago</strong>
                  <span>
                    {order.payment_status === "paid"
                      ? "Pagado"
                      : "Pendiente"}
                  </span>
                </div>
              </div>

              {order.delivery_method === "delivery" && (
                <div className="admin-delivery-address">
                  <strong>Dirección:</strong>{" "}
                  {order.delivery_address || "—"}

                  {order.delivery_reference && (
                    <>
                      <br />
                      <strong>Referencia:</strong>{" "}
                      {order.delivery_reference}
                    </>
                  )}
                </div>
              )}

              <div className="admin-items">
                {(order.order_items || []).map((item) => (
                  <div className="admin-item" key={item.id}>
                    <span>
                      {item.flavor} · {item.size}
                    </span>

                    <strong>x{item.quantity}</strong>
                  </div>
                ))}
              </div>

              <div className="admin-order-total">
                <span>Total</span>

                <strong>
                  {order.total_amount == null
                    ? "Por definir"
                    : `${order.total_amount} Bs`}
                </strong>
              </div>

              
                <div className="admin-quick-actions">
  {getNextOrderAction(order) && (
    <button
      type="button"
      className="button button-dark admin-main-action"
      disabled={updatingId === order.id}
      onClick={() => {
        const nextAction = getNextOrderAction(order);

        updateOrder(order.id, {
          status: nextAction.status,
        });
      }}
    >
      {getNextOrderAction(order).label}
    </button>
  )}

  {order.payment_status !== "paid" && (
    <button
      type="button"
      className="button admin-payment-action"
      disabled={updatingId === order.id}
      onClick={() =>
        updateOrder(order.id, {
          paymentStatus: "paid",
        })
      }
    >
      ✓ Marcar como pagado
    </button>
  )}

  {order.payment_status === "paid" && (
    <span className="admin-paid-badge">
      ✓ Pago recibido
    </span>
  )}
  {order.status === "delivered" && (
  <span className="admin-completed-badge">
    ✓ Pedido completado
  </span>
)}

  {order.status !== "cancelled" &&
    order.status !== "delivered" && (
      <button
        type="button"
        className="admin-cancel-action"
        disabled={updatingId === order.id}
        onClick={() => {
          const confirmed = window.confirm(
            "¿Seguro que deseas cancelar este pedido?"
          );

          if (confirmed) {
            updateOrder(order.id, {
              status: "cancelled",
            });
          }
        }}
      >
        Cancelar pedido
      </button>
    )}
</div>

              {updatingId === order.id && (
                <p className="admin-updating">
                  Actualizando pedido...
                </p>
              )}
            </article>
          ))}
        </section>
      )}
    </main>
  );
}