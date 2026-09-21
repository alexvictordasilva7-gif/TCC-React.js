import { useState } from "react";
import "./Login.Styled.jsx";
import { Link } from "react-router-dom";
import * as S from "./Login.Styled.jsx";
import Input from "../../components/Input/Input.jsx";
import Button from  "../../components/Button/Button.jsx"


function Login() {
  return (
    <S.TelaLogin>
      <S.Clogin>
        
        <S.ContImg>
          <S.Limg src="../../../public/Logotemporario.png" alt="" href="" />
          <h1>Login</h1>
        </S.ContImg>
        
        <S.InputLogin>
          <Input placeholder={"Email"} />
          <Input placeholder={"Senha"}  type="password"/>
          <S.LoginSelect name="oi" id="1">
            <option></option>
            <option>ADM</option>
            <option>Funcionario</option>
          </S.LoginSelect>
        </S.InputLogin>
        <S.LoginFooter>
          <S.Infolink>
            <S.LinkLogin>Recupera senha</S.LinkLogin>
            <S.LinkLogin>Cadastre-se</S.LinkLogin>
          </S.Infolink>
          
          <Button
          filho={<Link to={"/Dashboard"}>login</Link>}
          $cor={"#e6aa07"}
          $tcor={"balck"}
           ></Button>

          
        </S.LoginFooter>
      </S.Clogin>
    </S.TelaLogin>
  );
}

export default Login;
