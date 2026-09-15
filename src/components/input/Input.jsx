import * as S from "./Input.Styled"


function Input({ placeholder, type = "text" , texto, valor, onChange}) {
    return (
        <div>
            <div>
                <label>{texto}</label>
            </div>
            <S.Campo onChange={onChange} value={valor} type={type} placeholder={placeholder} />
        </div>
        
    )
}

export default Input;