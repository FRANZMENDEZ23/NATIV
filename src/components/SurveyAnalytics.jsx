const flavorLabels = {
  chirimoya: "Chirimoya",
  achachairu: "Achachairú",
  guapuru: "Guapurú",
  copoazu: "Copoazú",
};

const sizeLabels = {
  "200ml": "200 ml",
  "500ml": "500 ml",
  "1l": "1 litro",
  "2l": "2 litros",
};

const priorityLabels = {
  flavor: "Sabor",
  natural_ingredients: "Ingredientes naturales",
  price: "Precio",
  presentation: "Presentación",
  bolivian_product: "Producto boliviano",
};

const deliveryLabels = {
  pickup: "Retiro en tienda",
  delivery: "Entrega a domicilio",
};

const frequencyLabels = {
  several_week: "Varias veces por semana",
  weekly: "Una vez por semana",
  two_three_month: "2 a 3 veces al mes",
  occasionally: "Ocasionalmente",
};

function getChartData(responses, field, labels) {
  const total = responses.length;

  return Object.entries(labels).map(([value, label]) => {
    const count = responses.filter(
      (response) => response[field] === value,
    ).length;

    const percentage =
      total === 0 ? 0 : Math.round((count / total) * 100);

    return {
      value,
      label,
      count,
      percentage,
    };
  });
}

function SurveyChart({ title, data }) {
  return (
    <article className="survey-chart-card">
      <h3>{title}</h3>

      <div className="survey-chart-list">
        {data.map((item) => (
          <div className="survey-chart-row" key={item.value}>
            <div className="survey-chart-info">
              <span>{item.label}</span>

              <strong>
                {item.count} · {item.percentage}%
              </strong>
            </div>

            <div className="survey-chart-track">
              <div
                className="survey-chart-bar"
                style={{ width: `${item.percentage}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </article>
  );
}

function GenderSection({
  title,
  responses,
  className,
}) {
  const flavorData = getChartData(
    responses,
    "preferred_flavor",
    flavorLabels,
  );

  const sizeData = getChartData(
    responses,
    "preferred_size",
    sizeLabels,
  );

  const priorityData = getChartData(
    responses,
    "purchase_priority",
    priorityLabels,
  );

  const deliveryData = getChartData(
    responses,
    "delivery_preference",
    deliveryLabels,
  );

  const frequencyData = getChartData(
    responses,
    "purchase_frequency",
    frequencyLabels,
  );

  return (
    <section className={`survey-gender-section ${className}`}>
      <div className="survey-gender-heading">
        <div>
          <p className="eyebrow">
            PREFERENCIAS POR GÉNERO
          </p>

          <h3>{title}</h3>
        </div>

        <div className="survey-gender-total">
          <strong>{responses.length}</strong>
          <span>
            {responses.length === 1
              ? "respuesta"
              : "respuestas"}
          </span>
        </div>
      </div>

      {responses.length === 0 ? (
        <div className="admin-empty">
          <p>
            Todavía no hay respuestas registradas para
            este género.
          </p>
        </div>
      ) : (
        <div className="survey-chart-grid">
          <SurveyChart
            title="Sabor preferido"
            data={flavorData}
          />

          <SurveyChart
            title="Presentación preferida"
            data={sizeData}
          />

          <SurveyChart
            title="¿Qué valoran más?"
            data={priorityData}
          />

          <SurveyChart
            title="Forma de entrega"
            data={deliveryData}
          />

          <SurveyChart
            title="Frecuencia estimada de compra"
            data={frequencyData}
          />
        </div>
      )}
    </section>
  );
}

export default function SurveyAnalytics({
  responses,
  loading,
}) {
  if (loading) {
    return (
      <section className="admin-survey-section">
        <p>Cargando resultados de la encuesta...</p>
      </section>
    );
  }

  const menResponses = responses.filter(
    (response) => response.gender === "man",
  );

  const womenResponses = responses.filter(
    (response) => response.gender === "woman",
  );

  const menPercentage =
    responses.length === 0
      ? 0
      : Math.round(
          (menResponses.length / responses.length) * 100,
        );

  const womenPercentage =
    responses.length === 0
      ? 0
      : Math.round(
          (womenResponses.length / responses.length) * 100,
        );

  return (
    <section className="admin-survey-section">
      <div className="admin-survey-heading">
        <div>
          <p className="eyebrow">
            PREFERENCIAS DE CLIENTES
          </p>

          <h2>Encuesta NATIV</h2>

          <p>
            Resultados obtenidos de los visitantes de la
            página web.
          </p>
        </div>

        <div className="admin-survey-total">
          <strong>{responses.length}</strong>

          <span>
            {responses.length === 1
              ? "respuesta total"
              : "respuestas totales"}
          </span>
        </div>
      </div>

      {responses.length === 0 ? (
        <div className="admin-empty">
          <h3>Aún no hay respuestas</h3>

          <p>
            Las respuestas de la encuesta aparecerán aquí.
          </p>
        </div>
      ) : (
        <>
          <div className="survey-gender-summary">
            <article>
              <span>Hombres</span>

              <strong>
                {menResponses.length}
              </strong>

              <small>
                {menPercentage}% del total
              </small>
            </article>

            <article>
              <span>Mujeres</span>

              <strong>
                {womenResponses.length}
              </strong>

              <small>
                {womenPercentage}% del total
              </small>
            </article>
          </div>

          <GenderSection
            title="Hombres"
            responses={menResponses}
            className="survey-gender-men"
          />

          <GenderSection
            title="Mujeres"
            responses={womenResponses}
            className="survey-gender-women"
          />
        </>
      )}
    </section>
  );
}