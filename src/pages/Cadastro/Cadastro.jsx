import { Link } from "react-router-dom";
import * as S from "./Cadastro.Styled.jsx";
import Input from "../../components/Input/Input";
import Button from "../../components/Button/Button.jsx";

function Cadastro() {
  return (
    <S.TelaCadastro>
      <S.Ccadastro>
        <S.Hdiv>
           
        <S.Cdiv>
            <S.Pata/>
            <h1>Cadastro</h1>
        </S.Cdiv>
        </S.Hdiv>
        
        <S.InputCadas>
          <Input texto={"Nome"} />
          <Input texto={"Email"} />
          <Input texto={"CNPJ"} />
          <Input texto={"Senha"} />
          <Input texto={"Repita senha"} />
        </S.InputCadas>

        <S.CadFooter>
          <S.LinkCadastro to="/Login">Fazer login</S.LinkCadastro>
        </S.CadFooter>
        <Button filho={"Cadastra"} />
      </S.Ccadastro>
    </S.TelaCadastro>
  );
}

export default Cadastro;
