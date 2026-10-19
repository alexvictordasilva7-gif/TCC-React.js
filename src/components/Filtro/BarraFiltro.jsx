export default function BarraFiltro({
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