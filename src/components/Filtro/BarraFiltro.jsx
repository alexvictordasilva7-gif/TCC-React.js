export default function BarraFiltro(props) {
  // tema: usa o visual do Clientes & Pets (sem ele, fica o visual padrão)
  if (props.tema) return <BarraFiltroTema {...props} />;
  return <BarraFiltroPadrao {...props} />;
}

function BarraFiltroPadrao({
  busca,
  aoBuscar,
  placeholder = "Buscar...",
  filtros,
  filtroAtivo,
  aoMudarFiltro,
}) {
  return (
    <div className="bg-white rounded shadow-sm mb-3">
      <div className="d-flex align-items-center px-3 py-2 border-bottom">
        <i className="bi bi-search text-secondary me-2"></i>
        <input
          type="text"
          className="form-control border-0 shadow-none p-0 small"
          placeholder={placeholder}
          value={busca}
          onChange={(e) => aoBuscar(e.target.value)}
        />
      </div>

      <ul className="nav px-3">
        {filtros.map((filtro) => {
          const ativo = filtro.chave === filtroAtivo;
          return (
            <li key={filtro.chave} className="nav-item">
              <button
                type="button"
                className={`btn btn-link text-decoration-none d-flex align-items-center gap-2 py-2 px-3 rounded-0 small ${
                  ativo ? "text-primary" : "text-secondary"
                }`}
                style={{
                  border: 0,
                  borderBottom: ativo ? "2px solid #0d6efd" : "2px solid transparent",
                }}
                onClick={() => aoMudarFiltro(filtro.chave)}
              >
                {filtro.rotulo}
                <span
                  className={`badge rounded-pill ${
                    ativo ? "bg-primary-subtle text-primary" : "bg-light text-secondary"
                  }`}
                >
                  {filtro.quantidade}
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

/* ===== Visual "tema" (Clientes & Pets) ===== */
function BarraFiltroTema({
  busca,
  aoBuscar,
  placeholder = "Buscar...",
  filtros,
  filtroAtivo,
  aoMudarFiltro,
}) {
  return (
    <div
      className="rounded-4 shadow-sm mb-3"
      style={{ background: "var(--ps-superficie)", border: "1px solid var(--ps-borda)" }}
    >
      <div className="p-3 pb-2">
        <label
          className="d-flex align-items-center gap-2 px-3 rounded-pill mb-0"
          style={{
            height: 46,
            background: "var(--ps-superficie-2)",
            border: "1.5px solid var(--ps-borda)",
            cursor: "text",
          }}
        >
          <i className="bi bi-search text-secondary"></i>
          <input
            type="search"
            className="form-control border-0 shadow-none p-0 bg-transparent"
            placeholder={placeholder}
            aria-label={placeholder}
            value={busca}
            onChange={(e) => aoBuscar(e.target.value)}
          />
        </label>
      </div>

      {filtros?.length > 0 && (
        <ul className="nav px-3" role="tablist">
          {filtros.map((filtro) => {
            const ativo = filtro.chave === filtroAtivo;
            return (
              <li key={filtro.chave} className="nav-item">
                <button
                  type="button"
                  role="tab"
                  aria-selected={ativo}
                  className={`btn btn-link text-decoration-none d-flex align-items-center gap-2 py-2 px-3 rounded-0 small ${
                    ativo ? "text-primary" : "text-secondary"
                  }`}
                  style={{
                    border: 0,
                    borderBottom: ativo
                      ? "2px solid var(--ps-primaria)"
                      : "2px solid transparent",
                  }}
                  onClick={() => aoMudarFiltro(filtro.chave)}
                >
                  {filtro.rotulo}
                  <span
                    className={`badge rounded-pill ${
                      ativo
                        ? "bg-primary-subtle text-primary"
                        : "bg-body-secondary text-secondary"
                    }`}
                  >
                    {filtro.quantidade}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
