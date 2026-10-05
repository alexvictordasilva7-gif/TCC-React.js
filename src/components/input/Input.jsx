import * as S from "./Input.Styled"


function Input({ placeholder, type = "text" , texto, valor, onChange, size, obrigatorio = true}) {
    return (
        <div>
            <div>
                <label>{texto}</label>
            </div>
            <S.Campo fsize={size} onChange={onChange} value={valor} type={type} placeholder={placeholder} required = {obrigatorio}  />
        </div>
        
    )
}

export default Input;