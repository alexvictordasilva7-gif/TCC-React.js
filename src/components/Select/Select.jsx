export default function Select({
  texto,
  valor,
  onChange,
  opcoes = [],
  placeholder = "Selecione...",
}) {
  return (
    <div className="">
      {texto && <label className="form-label ">{texto}</label>}
      <select className="form-select mg-3" value={valor} onChange={onChange}>
        <option value="">{placeholder}</option>
        {opcoes.map((opcao) => {
          const item =
            typeof opcao === "object" ? opcao : { valor: opcao, rotulo: opcao };
          return (
            <option key={item.valor} value={item.valor}>
              {item.rotulo}
            </option>
          );
        })}
      </select>
    </div>
  );
}