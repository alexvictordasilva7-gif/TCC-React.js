import { useState } from "react";
import { useNavigate } from "react-router-dom";
import * as S from "./Cadastro.Styled.jsx";
import Input from "../../components/Input/Input.jsx";
import Button from "../../components/Button/Button.jsx";
import api from "../../service/api";

function Cadastro() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [repetirSenha, setRepetirSenha] = useState("");
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(false);

  async function cadastrar() {
    if (carregando) return;

    if ( !email ||  !senha) {
      setErro("Preencha todos os campos.");
      return;
    }
    if (senha !== repetirSenha) {
      setErro("As senhas não são iguais.");
      return;
    }

    setErro("");
    setCarregando(true);

    try {
      // CONFIRMAR: nomes dos campos do body
      await api.post("/api/auth/registrar", { email, senha });
      alert("Cadastro realizado! Faça login para entrar.");
      navigate("/Login");
    } catch (e) {
      console.log(e.response?.data);
      setErro(e.response?.data?.erro ?? "Não foi possível realizar o cadastro.");
    } finally {
      setCarregando(false);
    }
  }

  return (
    <S.TelaCadastro>
      <S.Ccadastro>
        <S.Hdiv>
          <S.Cdiv>
            <S.Pata />
            <h1>Cadastro</h1>
          </S.Cdiv>
        </S.Hdiv>

        <S.InputCadas>
          <Input texto="Email" type="email" valor={email} onChange={(e) => setEmail(e.target.value)} />
          <Input texto="Senha" type="password" valor={senha} onChange={(e) => setSenha(e.target.value)} />
          <Input texto="Repita senha" type="password" valor={repetirSenha} onChange={(e) => setRepetirSenha(e.target.value)} />
        </S.InputCadas>

        {erro && <p className="text-danger small mb-0">{erro}</p>}

        <S.CadFooter>
          <S.LinkCadastro to="/Login">Fazer login</S.LinkCadastro>
        </S.CadFooter>

        <Button
          className="btn-primary"
          texto={carregando ? "Cadastrando..." : "Cadastrar"}
          onClick={cadastrar}
        />
      </S.Ccadastro>
    </S.TelaCadastro>
  );
}

export default Cadastro;