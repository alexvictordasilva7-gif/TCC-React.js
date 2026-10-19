import { useState } from "react";
import { useNavigate } from "react-router-dom";
import * as S from "./Login.Styled.jsx";
import Input from "../../components/Input/Input.jsx";
import Button from "../../components/Button/Button.jsx";
import api from "../../service/api";

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");

  async function entrar() {
    if (!email || !senha) {
      console.log(resposta.data);
      setErro("Preencha o email e a senha.");
      return true;
    }
    setErro("");

    try {
      const resposta = await api.post("/api/auth/login", { email, senha }); // CONFIRMAR campos
      console.log(resposta.data); // veja o nome do campo do token
      localStorage.setItem("token", resposta.data.token); // CONFIRMAR
      navigate("/Dashboard");
    } catch (e) {
      console.log(e.response);
      if (e.response?.status === 401 || e.response?.status === 403) {
        setErro("Email ou senha incorretos.");
        console.log(resposta.data);
      } else {
        setErro("Não foi possível conectar ao servidor.");
        console.log(resposta.data);
      }
    }
  }

  return (
    <S.TelaLogin>
      <S.Clogin>
        <S.Hdiv>
          <S.ContImg>
            <S.Limg src="/Patinha.png" alt="Logo Pet Shop" />
          </S.ContImg>
          <S.Cdiv>
            <h1>Pet Shop</h1>
            <p>Sistema de Gerenciamento</p>
          </S.Cdiv>
        </S.Hdiv>

        <S.InputLogin>
          <Input
            texto="Email"
            placeholder="exemplo@petshop.com"
            valor={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Input
            texto="Senha"
            placeholder="••••••••"
            type="password"
            valor={senha}
            onChange={(e) => setSenha(e.target.value)}
          />
        </S.InputLogin>

        {erro && <p className="text-danger small mb-0">{erro}</p>}

        <S.LoginFooter>
          <S.LinkLogin to="/Cadastro">Cadastre-se</S.LinkLogin>
          <S.LinkLogin to="#">Esqueceu a senha?</S.LinkLogin>
        </S.LoginFooter>

        <Button className="btn-primary" texto="Entrar" onClick={entrar} />
      </S.Clogin>

      <S.Ddiv>
        <p>© 2026 Pet Shop - Todos os direitos reservados</p>
      </S.Ddiv>
    </S.TelaLogin>
  );
}

export default Login;