import * as S from "./Input.Styled"


function Input({ placeholder, type = "text" , texto, valor, onChange, size}) {
    return (
        <div>
            <div>
                <label>{texto}</label>
            </div>
            <S.Campo fsize={size} onChange={onChange} value={valor} type={type} placeholder={placeholder} />
        </div>
        
    )
}

export default Input;