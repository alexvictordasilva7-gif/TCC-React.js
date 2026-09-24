import { useState } from "react";
import "./Login.Styled.jsx";
import { Link } from "react-router-dom";
import * as S from "./Login.Styled.jsx";
import Input from "../../components/Input/Input.jsx";
import Button from "../../components/Button/Button.jsx";

function Login() {
  return (
    <S.TelaLogin>
      <S.Clogin>
        {" "}
        {/*Container login */}
        <S.Hdiv>
          {" "}
          {/*Header login */}
          <S.ContImg>
            {" "}
            {/*Container imagem */}
            <S.Limg src="../../../public/Patinha.png" alt="" href="" />
          </S.ContImg>
          <S.Cdiv>
            <h1>Pet Shop</h1>
            <p>Sistema de Gerenciamento</p>
          </S.Cdiv>
        </S.Hdiv>
        <S.InputLogin>
          <Input texto={"Email"} placeholder={"exemplo@petsho.com"} />
          <Input texto={"Senha"} placeholder={"••••••••"} type="password" />
        </S.InputLogin>
        <S.LoginFooter>
          <S.LinkLogin>Cadastre-se</S.LinkLogin>
          <S.LinkLogin>Esqueceu a senha?</S.LinkLogin>
        </S.LoginFooter>
        <Button filho={"Entra"} />
      </S.Clogin>
      <S.Ddiv>
        <p>© 2026 Pet Shop - Todos os direitos reservados</p>
      </S.Ddiv>
    </S.TelaLogin>
  );
}

export default Login;
