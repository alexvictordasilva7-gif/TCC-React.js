export default function AlertaAviso({
  titulo,
  itens = [],
  corIcone = "#f97316",
  corTitulo = "#c2410c",
  corItens = "#dc2626",
  fundo = "#fff7ed",
  borda = "#fdba74",
}) {
  if (itens.length === 0) return null;

  return (
    <div
      className="position-relative overflow-hidden rounded d-flex align-items-start gap-2 p-3 mb-3"
      style={{ backgroundColor: fundo, border: `1px solid ${borda}` }}
    >
      <div
        className="position-absolute top-0 bottom-0 start-0"
        style={{ width: 4, backgroundColor: corIcone }}
      />
      <i className="bi bi-exclamation-triangle ms-1" style={{ color: corIcone }}></i>
      <div>
        <strong style={{ color: corTitulo }}>{titulo}</strong>
        <div className="small" style={{ color: corItens }}>
          {itens.join(", ")}
        </div>
      </div>
    </div>
  );
}