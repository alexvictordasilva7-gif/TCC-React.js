import * as S from "./Input.Styled"

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
}) {
  return (
    <div>
      {texto && <label className="form-label">{texto}</label>}
      <S.Campo
        className={className}
        fsize={size}
        type={type}
        value={valor}
        onChange={onChange}
        placeholder={placeholder}
        required={obrigatorio}
        aria-invalid={erro ? "true" : "false"}
        style={erro ? { borderColor: "#e5534b" } : undefined}
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