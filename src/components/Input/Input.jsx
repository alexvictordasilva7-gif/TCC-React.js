import { useId } from "react";
import * as S from "./Input.Styled";

// tema: usa o visual do Clientes & Pets (sem ele, fica o visual padrão)
function Input({
  placeholder,
  type = "text",
  texto,
  valor,
  onChange,
  size,
  obrigatorio = true,
  className,
  erro,
  tema = false,
  id,
  ...resto
}) {
  const idGerado = useId();
  const idCampo = id ?? idGerado;
  const Campo = tema ? S.CampoTema : S.Campo;

  return (
    <div>
      {texto && (
        <label className="form-label" htmlFor={idCampo}>
          {texto}
        </label>
      )}
      <Campo
        id={idCampo}
        className={className}
        $size={size}
        type={type}
        value={valor}
        onChange={onChange}
        placeholder={placeholder}
        required={obrigatorio}
        aria-invalid={erro ? "true" : "false"}
        style={erro ? { borderColor: "#e5534b" } : undefined}
        {...resto}
      />
      {erro && (
        <small
          role="alert"
          style={{
            display: "block",
            marginTop: 4,
            color: "#e5534b",
            fontSize: "0.8rem",
            fontWeight: 500,
          }}
        >
          {erro}
        </small>
      )}
    </div>
  );
}

export default Input;
