import { useState } from "react";
import "./login.css";
import { Link } from "react-router-dom";

function Login() {
    //20/07/2026 - nao entendi direito a parte do useState, preventdefault, throw, summit
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [tipoUsuario, setTipoUsuario] = useState("comum");
  const [mensagem, setMensagem] = useState("");
  const [carregando, setCarregando] = useState(false);

  const lidarComLogin = async (e) => {
    e.preventDefault(); //serve para segura 
    setCarregando(true);
    setMensagem("");

    try {
      // Fazemos o POST para a rota de login
      const resposta = await fetch("http://localhost:3333/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        // ENVIANDO AS 3 ENTRADAS NO BODY DO TUNDERCLIENT
        body: JSON.stringify({
          email: email,
          password: senha,
          typeUser: tipoUsuario,
        }),
      });

      const dados = await resposta.json();

      if (!resposta.ok) {
        throw new Error(
          dados.mensagem || "Dados incorretos para este tipo de usuário.",
        );
      }

      setMensagem(
        `Login como ${tipoUsuario.toUpperCase()} realizado com sucesso!`,
      );
      console.log("Resposta da API:", dados);
    } catch (error) {
      setMensagem(error.message);
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div className="tela">
      <div className="login">
        <img
          src="https://cdn.mindminers.com/blog/uploads/2022/11/pets.png"
          alt=""
        />
        <h1>Pet Shop</h1>
        <p>Sistema de gerenciamento</p>

        {/* no form tem o evento onSubmit que é um evento que chama um funççao, 
        e essa função "lidarComLogin" é um post que vai validar o email e a senha do usuario  */}

        <form onSubmit={lidarComLogin} className="formInput"> 
          <p>Email</p>
          <input
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <p>senha</p>
          <input
            type="password"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            required
          />
          <p>usuario</p>
          <select
            value={tipoUsuario}
            onChange={(e) => setTipoUsuario(e.target.value)}
          >
            <option value="comum">Funcionario</option>
            <option value="admin">Adiministrador</option>
          </select>

          <div>
            <a href="">esqueceu a senha</a>
            <Link to="/cadastro">Cadastrar</Link>
            <Link to="/Dashboard">Dashboard</Link>
          </div>
          {/* o botao vai chama o evento onSubmit toda vez que clica no botao, e quando ele for clicado
          vai desabilita a variavel carregando.  */}
          <button type="submit" disabled={carregando}> 
            {carregando ? "Validando..." : "Entrar"}  
          </button>
          {/* se estive carregando o botao vai muda para "Validando" se nao "Entrar" */}
        </form>
        
      </div>
      {<p>{mensagem}</p>}
    </div>
  );
}

export default Login;
