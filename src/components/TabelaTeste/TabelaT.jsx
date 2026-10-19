export default function Tabela({ campos, dados, aoEditar, aoExcluir, classeLinha }) {
  return (
    <div
      className="table-responsive bg-white rounded shadow-sm"
      style={{ maxHeight: "80vh", overflowY: "auto" }}
    >
      <table className="table table-hover align-middle mb-0">
        <thead>
          <tr>
            {campos.map((campo) => (
              <th
                key={campo.chave}
                className="text-uppercase text-secondary fw-normal text-nowrap py-3 px-4"
                style={{ fontSize: "0.8rem", letterSpacing: "0.05em" }}
              >
                {campo.rotulo}
              </th>
            ))}
            <th
              className="text-uppercase text-secondary fw-normal py-3 px-4"
              style={{ fontSize: "0.8rem", letterSpacing: "0.05em" }}
            >
              Ações
            </th>
          </tr>
        </thead>
        <tbody>
          {dados.map((item) => (
            <tr key={item.id}>
              {campos.map((campo) => (
                <td
                  key={campo.chave}
                  className={`py-3 px-4 small ${campo.classe ?? ""}`}
                >
                  {campo.render ? campo.render(item) : item[campo.chave]}
                </td>
              ))}
              <td className="py-3 px-4">
                {aoEditar && (
                  <button
                    className="btn btn-link p-0 me-3 text-primary"
                    onClick={() => aoEditar(item)}
                    title="Editar"
                  >
                    <i className="bi bi-pencil-square"></i>
                  </button>
                )}
                {aoExcluir && (
                  <button
                    className="btn btn-link p-0 text-danger"
                    onClick={() => aoExcluir(item.id)}
                    title="Excluir"
                  >
                    <i className="bi bi-trash"></i>
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
