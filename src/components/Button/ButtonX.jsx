// tema: usa o visual do Clientes & Pets (sem ele, fica o visual padrão)
export default function BotaoFechar({ onClick, texto = "", tema = false }) {
  if (tema) {
    return (
      <button
        type="button"
        className="btn d-flex align-items-center justify-content-center p-0"
        style={{
          width: 40,
          height: 40,
          borderRadius: 12,
          background: "var(--ps-superficie-2)",
          border: "1px solid var(--ps-borda)",
          color: "var(--ps-texto)",
        }}
        onClick={onClick}
        aria-label="Fechar"
        title="Fechar"
      >
        {texto}
      </button>
    );
  }

  return (
    <button
      type="button"
      className="btn "
      onClick={onClick}
      aria-label="Fechar"
    >
      {texto}
    </button>
  );
}
