import { TriangleAlert } from "lucide-react";

// itens (opcional): lista que o back devolve -> [{ produto, saldo }]
export default function AvisoEstoque({ quantidade, itens = [], aoClicar }) {
  if (!quantidade) return null;
  return (
    <button
      type="button"
      onClick={aoClicar}
      className="d-flex align-items-start gap-3 w-100 text-start px-4 py-3 fw-medium"
      style={{
        background: "#fef3c7",
        border: "1px solid #fcd34d",
        borderRadius: 20,
        boxShadow: "var(--ps-sombra)",
        color: "#78350f",
        marginBottom: 20,
      }}
    >
      <TriangleAlert size={20} className="flex-shrink-0 mt-1" />
      <span className="flex-grow-1">
        Vale conferir o estoque. {quantidade}{" "}
        {quantidade === 1 ? "produto atingiu" : "produtos atingiram"} o estoque mínimo. Clique para ver.
        {itens.length > 0 && (
          <span className="d-flex flex-wrap gap-2 mt-2">
            {itens.map((i) => (
              <span
                key={i.produto}
                className="badge rounded-pill fw-semibold px-3 py-2"
                style={{ background: "#fde68a", color: "#78350f" }}
              >
                {i.produto} · {i.saldo} un.
              </span>
            ))}
          </span>
        )}
      </span>
    </button>
  );
}
