import { useState } from "react";

const steps = [
  "gender",
  "preferredFlavor",
  "preferredSize",
  "purchasePriority",
  "deliveryPreference",
  "purchaseFrequency",
];

export default function SurveyModal({ onClose, onSubmit }) {
  const [form, setForm] = useState({
    gender: "",
    preferredFlavor: "",
    preferredSize: "",
    purchasePriority: "",
    deliveryPreference: "",
    purchaseFrequency: "",
  });

  const [step, setStep] = useState(0);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");

  const currentField = steps[step];
  const isLastStep = step === steps.length - 1;

  function handleChange(event) {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));

    setError("");
  }

  function handleNext() {
    if (!form[currentField]) {
      setError("Selecciona una opción para continuar.");
      return;
    }

    setError("");
    setStep((current) => Math.min(current + 1, steps.length - 1));
  }

  function handlePrevious() {
    setError("");
    setStep((current) => Math.max(current - 1, 0));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (!form[currentField]) {
      setError("Selecciona una opción para continuar.");
      return;
    }

    try {
      setSending(true);
      setError("");
      await onSubmit(form);
    } catch (submitError) {
      console.error(submitError);
      setError("No pudimos guardar tu respuesta. Intenta nuevamente.");
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="survey-backdrop">
      <section
        className="survey-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="survey-title"
      >
        <button
          type="button"
          className="survey-close"
          aria-label="Cerrar encuesta"
          onClick={onClose}
        >
          ×
        </button>

        <div className="survey-heading">
          <span>AYÚDANOS A CONOCERTE</span>
          <h2 id="survey-title">¿Cómo sería tu NATIV ideal?</h2>

          <p>
            Pregunta {step + 1} de {steps.length}
          </p>
        </div>

        <div className="survey-progress" aria-hidden="true">
          {steps.map((item, index) => (
            <span
              key={item}
              className={index <= step ? "active" : ""}
            />
          ))}
        </div>

        <form className="survey-form" onSubmit={handleSubmit}>
          {step === 0 && (
            <fieldset>
              <legend>1. ¿Cuál es tu género?</legend>

              <label>
                <input
                  type="radio"
                  name="gender"
                  value="man"
                  checked={form.gender === "man"}
                  onChange={handleChange}
                />
                Hombre
              </label>

              <label>
                <input
                  type="radio"
                  name="gender"
                  value="woman"
                  checked={form.gender === "woman"}
                  onChange={handleChange}
                />
                Mujer
              </label>
            </fieldset>
          )}

          {step === 1 && (
            <fieldset>
              <legend>2. ¿Qué sabor de NATIV te gustaría probar más?</legend>

              <select
                name="preferredFlavor"
                value={form.preferredFlavor}
                onChange={handleChange}
              >
                <option value="">Selecciona una opción</option>
                <option value="chirimoya">Chirimoya</option>
                <option value="achachairu">Achachairú</option>
                <option value="guapuru">Guapurú</option>
                <option value="copoazu">Copoazú</option>
              </select>
            </fieldset>
          )}

          {step === 2 && (
            <fieldset>
              <legend>
                3. ¿Qué presentación comprarías con mayor frecuencia?
              </legend>

              <select
                name="preferredSize"
                value={form.preferredSize}
                onChange={handleChange}
              >
                <option value="">Selecciona una opción</option>
                <option value="200ml">200 ml</option>
                <option value="500ml">500 ml</option>
                <option value="1l">1 litro</option>
                <option value="2l">2 litros</option>
              </select>
            </fieldset>
          )}

          {step === 3 && (
            <fieldset>
              <legend>
                4. ¿Qué valoras más al comprar un yogur artesanal?
              </legend>

              <select
                name="purchasePriority"
                value={form.purchasePriority}
                onChange={handleChange}
              >
                <option value="">Selecciona una opción</option>
                <option value="flavor">El sabor</option>
                <option value="natural_ingredients">
                  Ingredientes naturales
                </option>
                <option value="price">El precio</option>
                <option value="presentation">La presentación</option>
                <option value="bolivian_product">
                  Que sea un producto boliviano
                </option>
              </select>
            </fieldset>
          )}

          {step === 4 && (
            <fieldset>
              <legend>5. ¿Cómo preferirías recibir tu pedido?</legend>

              <select
                name="deliveryPreference"
                value={form.deliveryPreference}
                onChange={handleChange}
              >
                <option value="">Selecciona una opción</option>
                <option value="pickup">Retiro en tienda</option>
                <option value="delivery">Entrega a domicilio</option>
              </select>
            </fieldset>
          )}

          {step === 5 && (
            <fieldset>
              <legend>
                6. ¿Con qué frecuencia crees que comprarías NATIV?
              </legend>

              <select
                name="purchaseFrequency"
                value={form.purchaseFrequency}
                onChange={handleChange}
              >
                <option value="">Selecciona una opción</option>
                <option value="several_week">
                  Varias veces por semana
                </option>
                <option value="weekly">
                  Una vez por semana
                </option>
                <option value="two_three_month">
                  2 a 3 veces al mes
                </option>
                <option value="occasionally">
                  Ocasionalmente
                </option>
              </select>
            </fieldset>
          )}

          {error && (
            <p className="survey-error" role="alert">
              {error}
            </p>
          )}

          <div className="survey-actions">
            {step > 0 && (
              <button
                type="button"
                className="survey-back-button"
                onClick={handlePrevious}
              >
                ← Anterior
              </button>
            )}

            {!isLastStep ? (
              <button
                type="button"
                className="button button-dark survey-next"
                onClick={handleNext}
              >
                Siguiente →
              </button>
            ) : (
              <button
                type="submit"
                className="button button-dark survey-submit"
                disabled={sending}
              >
                {sending ? "Guardando..." : "Enviar respuestas"}
              </button>
            )}
          </div>

          <button
            type="button"
            className="survey-later"
            onClick={onClose}
          >
            Ahora no
          </button>
        </form>
      </section>
    </div>
  );
}