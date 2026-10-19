export default function CardResumo({
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