const coresCategoria = {
  Higiene: "bg-primary-subtle text-primary",
  Estética: "bg-primary-subtle text-primary",
  Combo: "bg-primary-subtle text-primary",
  Saúde: "bg-primary-subtle text-primary",
};

export default function CardServico({ servico, aoEditar, aoExcluir }) {
  return (
    <div className="card border-0 shadow-sm h-100">
      <div className="card-body d-flex flex-column p-4">
        <div className="d-flex justify-content-between align-items-start">
          <h5 className="card-title fw-bold mb-2">{servico.nome}</h5>
          <div className="d-flex gap-2">
            <button
              className="btn btn-link p-0 text-primary"
              onClick={() => aoEditar(servico)}
              title="Editar"
            >
              <i className="bi bi-pencil-square"></i>
            </button>
            <button
              className="btn btn-link p-0 text-danger"
              onClick={() => aoExcluir(servico.id)}
              title="Excluir"
            >
              <i className="bi bi-trash"></i>
            </button>
          </div>
        </div>

        <div className="mb-3">
          <span
            className={`badge ${coresCategoria[servico.categoria] ?? "badge text-bg-primary"}`}
          >
            {servico.categoria}
          </span>
        </div>

        <p className="text-secondary small flex-grow-1">{servico.descricao}</p>

        <div className="d-flex justify-content-between align-items-center border-top pt-3 mt-auto">
          <span className="text-secondary small">{servico.duracao} min</span>
          <span className="fw-bold fs-5 text-success">
            {Number(servico.valor).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
          </span>
        </div>
      </div>
    </div>
  );
}