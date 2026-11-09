export default function CardResumo(props) {
  // tema: usa o visual do Clientes & Pets (sem ele, fica o visual padrão)
  if (props.tema) return <CardResumoTema {...props} />;
  return <CardResumoPadrao {...props} />;
}

function CardResumoPadrao({
  titulo,
  valor,
  icone,
  corIcone = "#2563eb",
  fundoIcone = "#dbeafe",
  corValor,
  corBorda,
}) {
  return (
    <div
      className="card shadow-sm h-100"
      style={{
        border: 0,
        ...(corBorda && { borderLeft: `4px solid ${corBorda}` }),
      }}
    >
      <div className="card-body d-flex justify-content-between align-items-center">
        <div>
          <div className="text-secondary small">{titulo}</div>
          <div className="fs-2 fw-bold" style={corValor ? { color: corValor } : undefined}>
            {valor}
          </div>
        </div>

        {icone && (
          <div
            className="rounded d-flex align-items-center justify-content-center"
            style={{ width: 48, height: 48, backgroundColor: fundoIcone, color: corIcone }}
          >
            <i className={`bi bi-${icone} fs-4`}></i>
          </div>
        )}
      </div>
    </div>
  );
}

/* ===== Visual "tema" (Clientes & Pets) ===== */
// destaque=true deixa o card azul cheio (como o card "Tutores" do Figma)
function CardResumoTema({
  titulo,
  valor,
  icone,
  corIcone = "var(--ps-primaria)",
  corValor,
  corBorda,
  destaque = false,
}) {
  return (
    <div
      className="card shadow-sm h-100"
      style={{
        borderRadius: 20,
        ...(destaque
          ? { background: "var(--ps-preenchimento)", borderColor: "var(--ps-preenchimento)", color: "#fff" }
          : {}),
        ...(corBorda && { borderLeft: `5px solid ${corBorda}` }),
      }}
    >
      <div className="card-body d-flex justify-content-between align-items-start p-4">
        <div>
          <div
            className="text-uppercase fw-bold"
            style={{
              fontSize: "0.72rem",
              letterSpacing: "0.14em",
              color: destaque ? "rgba(255,255,255,0.85)" : "var(--ps-texto-suave)",
            }}
          >
            {titulo}
          </div>
          <div
            className="fw-bold mt-2 ps-fonte-titulo"
            style={{
              fontFamily: "var(--ps-fonte-titulo)",
              fontSize: "2rem",
              lineHeight: 1,
              color: destaque ? "#fff" : corValor ?? "var(--ps-texto)",
            }}
          >
            {valor}
          </div>
        </div>

        {icone && (
          <div
            className="rounded-circle d-flex align-items-center justify-content-center flex-shrink-0"
            style={{
              width: 46,
              height: 46,
              // fundo = a própria cor do ícone bem clarinha (funciona no claro e no escuro)
              backgroundColor: destaque
                ? "rgba(255,255,255,0.18)"
                : `color-mix(in srgb, ${corIcone} 15%, transparent)`,
              color: destaque ? "#fff" : corIcone,
            }}
            aria-hidden="true"
          >
            <i className={`bi bi-${icone} fs-5`}></i>
          </div>
        )}
      </div>
    </div>
  );
}
