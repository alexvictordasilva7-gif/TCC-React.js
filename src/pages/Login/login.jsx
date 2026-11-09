import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import * as S from "./Login.Styled.jsx"; // estilos da tela
import { LuPawPrint } from "react-icons/lu"; // mesmo ícone da barra lateral

/* ===== Ícones (SVG direto no arquivo, sem import) ===== */
const base = {
  width: 18,
  height: 18,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round",
  strokeLinejoin: "round",
  "aria-hidden": true,
};

function IconPata({ size = 16, ...props }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <ellipse cx="6" cy="9" rx="2.2" ry="2.8" />
      <ellipse cx="10.5" cy="5.5" rx="2.2" ry="2.8" />
      <ellipse cx="15.5" cy="5.5" rx="2.2" ry="2.8" />
      <ellipse cx="19" cy="9.5" rx="2.2" ry="2.8" />
      <path d="M12.5 11c-3 0-6 3.5-6 6.5 0 2 1.6 3 3.2 3 1.2 0 2-.6 2.8-.6s1.6.6 2.8.6c1.6 0 3.2-1 3.2-3 0-3-3-6.5-6-6.5z" />
    </svg>
  );
}

const IconEmail = () => (
  <svg {...base}>
    <rect x="3" y="5" width="18" height="14" rx="2" />
    <path d="M3 7l9 6 9-6" />
  </svg>
);

const IconCadeado = () => (
  <svg {...base}>
    <rect x="4" y="11" width="16" height="10" rx="2" />
    <path d="M8 11V7a4 4 0 0 1 8 0v4" />
  </svg>
);

const IconUsuario = () => (
  <svg {...base}>
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

const IconOlho = () => (
  <svg {...base}>
    <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

const IconOlhoFechado = () => (
  <svg {...base}>
    <path d="M17.94 17.94A10.4 10.4 0 0 1 12 19c-6.5 0-10-7-10-7a18.5 18.5 0 0 1 5.06-5.94" />
    <path d="M9.9 4.24A9.1 9.1 0 0 1 12 4c6.5 0 10 7 10 7a18.6 18.6 0 0 1-2.16 3.19" />
    <path d="M1 1l22 22" />
  </svg>
);

const IconSeta = () => (
  <svg {...base} strokeWidth={2.2}>
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
);

const IconGrafico = () => (
  <svg {...base} width={20} height={20}>
    <path d="M4 20V10M10 20V4M16 20v-7M22 20H2" />
  </svg>
);

const IconEscudo = () => (
  <svg {...base} width={20} height={20}>
    <path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6l8-3z" />
    <path d="M9 12l2 2 4-4" />
  </svg>
);

const IconBrilho = () => (
  <svg {...base} width={20} height={20}>
    <path d="M12 3l1.8 4.6L18 9l-4.2 1.4L12 15l-1.8-4.6L6 9l4.2-1.4L12 3z" />
    <path d="M19 15l.8 2 2 .8-2 .8-.8 2-.8-2-2-.8 2-.8.8-2z" />
  </svg>
);

// ⚠️ Ajuste para a URL e a rota de login do back-end do grupo
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";
const ROTA_LOGIN = "/api/auth/login";

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState(localStorage.getItem("petshop:email") || "");
  const [senha, setSenha] = useState("");
  const [lembrar, setLembrar] = useState(!!localStorage.getItem("petshop:email"));
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setErro("");

    if (!email || !senha) {
      setErro("Preencha o e-mail e a senha.");
      return;
    }

    setCarregando(true);
    try {
      const resposta = await fetch(`${API_URL}${ROTA_LOGIN}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, senha }),
      });

      if (!resposta.ok) {
        setErro(
          resposta.status === 401 || resposta.status === 403
            ? "E-mail ou senha incorretos."
            : "Não foi possível entrar. Tente novamente."
        );
        return;
      }

      const dados = await resposta.json().catch(() => ({}));
      if (dados.token) localStorage.setItem("token", dados.token);

      if (lembrar) localStorage.setItem("petshop:email", email);
      else localStorage.removeItem("petshop:email");

      navigate("/Dashboard"); // ⚠️ ajuste para a rota inicial do sistema
    } catch {
      setErro("Não foi possível conectar ao servidor.");
    } finally {
      setCarregando(false);
    }
  }

  return (
    <div className="auth-pagina">
      <S.EstilosLogin />
      <span className="auth-circulo auth-circulo--topo" aria-hidden="true" />
      <span className="auth-circulo auth-circulo--base" aria-hidden="true" />
      <span className="auth-pontos" aria-hidden="true" />

      <div className="auth-container">
        {/* ===== Lado esquerdo: apresentação ===== */}
        <section className="auth-apresentacao">
          <div className="auth-marca">
            <div className="auth-logo" aria-hidden="true">
              <LuPawPrint size={24} />
            </div>
            <div className="auth-marca__textos">
              <strong>Pet Shop</strong>
              <span>Sistema de gerenciamento</span>
            </div>
          </div>

          <div className="auth-chamada">
            <span className="auth-chamada__sobre">Cuidado que começa na gestão</span>
            <h1>
              Seu petshop organizado. <span>Tudo em um só lugar.</span>
            </h1>
            <p>
              Agendamentos, clientes, pets e estoque reunidos em um sistema simples,
              pensado para a rotina do seu petshop.
            </p>
          </div>

          <ul className="auth-recursos">
            <li><IconGrafico /><span>Visão financeira</span></li>
            <li><IconEscudo /><span>Acesso protegido</span></li>
            <li><IconBrilho /><span>Gestão completa</span></li>
          </ul>
        </section>

        {/* ===== Lado direito: card de login ===== */}
        <section className="auth-card">
          <header className="auth-card__cabecalho">
            <span className="auth-card__sobre">Bem-vindo de volta</span>
            <h2>Entre no sistema</h2>
            <p>Use o e-mail e a senha da sua conta.</p>
          </header>

          <nav className="auth-abas" aria-label="Acesso">
            <Link to="/Login" className="ativa" aria-current="page">Entrar</Link>
            <Link to="/Cadastro">Cadastrar</Link>
          </nav>

          <form className="auth-form" onSubmit={handleSubmit} noValidate>
            <div className="auth-campo">
              <label htmlFor="login-email">E-mail</label>
              <div className="auth-input auth-input--destaque">
                <IconEmail />
                <input
                  id="login-email"
                  type="email"
                  placeholder="admin@petshop.com"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="auth-campo">
              <label htmlFor="login-senha">Senha</label>
              <div className="auth-input">
                <IconCadeado />
                <input
                  id="login-senha"
                  type={mostrarSenha ? "text" : "password"}
                  placeholder="Sua senha"
                  autoComplete="current-password"
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                />
                <button
                  type="button"
                  className="auth-input__olho"
                  aria-label={mostrarSenha ? "Ocultar senha" : "Mostrar senha"}
                  onClick={() => setMostrarSenha((v) => !v)}
                >
                  {mostrarSenha ? <IconOlhoFechado /> : <IconOlho />}
                </button>
              </div>
            </div>

            <div className="auth-linha">
              <label className="auth-check">
                <input
                  type="checkbox"
                  checked={lembrar}
                  onChange={(e) => setLembrar(e.target.checked)}
                />
                Lembrar-me
              </label>
              <a href="#" className="auth-link">Esqueceu a senha?</a>
            </div>

            {erro && <div className="auth-alerta" role="alert">{erro}</div>}

            <button type="submit" className="auth-botao" disabled={carregando}>
              {carregando ? "Entrando..." : "Entrar"}
              {!carregando && <IconSeta />}
            </button>
          </form>

          <footer className="auth-rodape">
            © {new Date().getFullYear()} Pet Shop · Todos os direitos reservados
          </footer>
        </section>
      </div>
    </div>
  );
}