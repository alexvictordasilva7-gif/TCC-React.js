import * as S from "./Input.Styled"


function Input({ placeholder, type = "text", texto }) {
    return (
        <div>
            <div>
                <label>{texto}</label>
            </div>
            <S.Campo type={type} placeholder={placeholder} />
        </div>
        
    )
}

export default Input;