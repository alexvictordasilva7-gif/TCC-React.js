import { TriangleAlert } from "lucide-react";

export default function AvisoEstoque({ quantidade, aoClicar }) {
  if (!quantidade) return null;
  return (
    <button
      type="button"
      onClick={aoClicar}
      className="d-flex align-items-center gap-3 w-100 text-start rounded-4 px-4 py-3 mb-3 fw-medium"
      style={{ background: "#fef3c7", border: "1px solid #fcd34d", color: "#78350f" }}
    >
      <TriangleAlert size={20} />
      <span>
        Vale conferir o estoque. {quantidade}{" "}
        {quantidade === 1 ? "produto atingiu" : "produtos atingiram"} o estoque mínimo. Clique para ver.
      </span>
    </button>
  );
}