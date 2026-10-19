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
      />
    </div>
  );
}

export default Input;