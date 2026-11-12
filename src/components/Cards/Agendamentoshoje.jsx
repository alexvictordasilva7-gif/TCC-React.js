const STATUS = {
  AGENDADO:  { rotulo: "agendados",  fundo: "#fef3c7", cor: "#b45309" },
  CONCLUIDO: { rotulo: "concluídos", fundo: "#dcfce7", cor: "#15803d" },
  CANCELADO: { rotulo: "cancelados", fundo: "#fee2e2", cor: "#b91c1c" },
};

const moeda = (v) =>
  Number(v ?? 0).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

export default function AgendamentosHoje({ itens, filtro, aoMudarFiltro, aoConcluir, aoCancelar }) {
  const contar = (s) => itens.filter((i) => i.status === s).length;
  const visiveis = filtro ? itens.filter((i) => i.status === filtro) : itens;

  return (
    <div
      className="rounded-4 shadow-sm p-4"
      style={{ background: "var(--ps-superficie)", border: "1px solid var(--ps-borda)" }}
    >
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-2">
        <h2 className="fs-5 fw-bold mb-0">Agendamentos de hoje</h2>

        {/* as pílulas também são o filtro: clique para filtrar, clique de novo para limpar */}
        <div className="d-flex gap-2">
          {Object.entries(STATUS).map(([chave, s]) => {
            const ativo = filtro === chave;
            return (
              <button
                key={chave}
                type="button"
                onClick={() => aoMudarFiltro(ativo ? null : chave)}
                className="badge rounded-pill border-0 px-3 py-2"
                style={{
                  background: s.fundo,
                  color: s.cor,
                  outline: ativo ? `2px solid ${s.cor}` : "none",
                  opacity: filtro && !ativo ? 0.55 : 1,
                }}
              >
                {contar(chave)} {s.rotulo}
              </button>
            );
          })}
        </div>
      </div>

      {/* altura fixa + rolagem: 20 agendamentos não quebram o layout */}
      <div style={{ maxHeight: 420, overflowY: "auto" }}>
        {visiveis.length === 0 && (
          <p className="text-secondary text-center py-4 mb-0">Nenhum agendamento por aqui.</p>
        )}

        {visiveis.map((item) => (
          <div
            key={item.id}
            className="d-flex align-items-center gap-3 py-3"
            style={{ borderBottom: "1px solid var(--ps-borda)" }}
          >
            <div
              className="rounded-circle d-flex align-items-center justify-content-center flex-shrink-0 fw-bold text-white"
              style={{ width: 36, height: 36, background: "#15803d" }}
            >
              {item.pet.charAt(0).toUpperCase()}
            </div>

            <div className="flex-grow-1" style={{ minWidth: 0 }}>
              <div className="text-truncate">
                <strong>{item.pet}</strong>
                <span className="text-secondary"> · {item.tutor}</span>
              </div>
              <div className="text-secondary small text-truncate">{item.servico}</div>
            </div>

            <div className="text-end">
              <div className="fw-bold">{item.hora}</div>
              <div className="text-secondary small">{moeda(item.valor)}</div>
            </div>

            <div className="d-flex justify-content-end gap-2" style={{ width: 150 }}>
              {item.status === "AGENDADO" ? (
                <>
                  <button type="button" className="btn btn-sm btn-outline-success py-0 px-2"
                    onClick={() => aoConcluir(item)}>Concluir</button>
                  <button type="button" className="btn btn-sm btn-outline-danger py-0 px-2"
                    onClick={() => aoCancelar(item)}>Cancelar</button>
                </>
              ) : (
                <span
                  className="badge rounded-pill fw-semibold px-3 py-2"
                  style={{
                    background: item.status === "CONCLUIDO" ? "#dcfce7" : "#fee2e2",
                    color: item.status === "CONCLUIDO" ? "#15803d" : "#b91c1c",
                  }}
                >
                  {item.status === "CONCLUIDO" ? "Concluído" : "Cancelado"}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}