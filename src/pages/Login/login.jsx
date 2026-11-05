import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

/* ===== Estilos da página (CSS dentro do próprio arquivo, sem import) ===== */
const estilos = `
@import url("https://fonts.googleapis.com/css2?family=Archivo:wght@700;800;900&family=Inter:wght@400;500;600;700&display=swap");

/* ===== Variáveis (cores do protótipo do Figma) ===== */
.auth-pagina {
  --azul: #1d5bf0;
  --azul-escuro: #1442b8;
  --roxo: #5b4be0;
  --laranja: #e8731a;
  --pessego: #ffd9b3;
  --texto: #111827;
  --texto-suave: #4b5563;
  --borda: #d9dee8;
  --fundo-input: #ffffff;
  --fundo-input-destaque: #eaf0ff;
  --fonte-titulo: "Archivo", system-ui, sans-serif;
  --fonte-texto: "Inter", system-ui, sans-serif;
}

/* ===== Proteção contra estilos globais (index.css / App.css do Vite) ===== */
/* Só vale quando a tela de login/cadastro está aberta */
body:has(.auth-pagina) {
  margin: 0;
  display: block;
  min-width: 0;
  background: #4f7cf7;
}
#root:has(.auth-pagina) {
  width: 100%;
  max-width: none;
  margin: 0;
  padding: 0;
  text-align: left;
}
.auth-pagina {
  width: 100%;
  text-align: left;
  line-height: 1.5;
  font-weight: 400;
  color-scheme: light;
}
/* :where() deixa essas regras "fracas", então as classes abaixo continuam mandando */
.auth-pagina :where(h1, h2, p, ul) {
  margin: 0;
}
.auth-pagina :where(button) {
  padding: 0;
  border: none;
  border-radius: 0;
  background: none;
  font: inherit;
  color: inherit;
  transition: none;
}
.auth-pagina :where(button:hover) {
  border-color: transparent;
}
.auth-pagina :where(button:focus) {
  outline: none;
}
.auth-pagina :where(button:focus-visible, a:focus-visible) {
  outline: 3px solid rgba(29, 91, 240, 0.45);
  outline-offset: 2px;
}
.auth-pagina :where(a) {
  font-weight: inherit;
  text-decoration: none;
}
.auth-pagina :where(input) {
  font: inherit;
}

/* ===== Fontes da tela de login =====
   O index.css do projeto força uma fonte em tudo com "* { ... !important }".
   Estas regras também usam !important, mas são mais específicas, então ganham
   só dentro da tela de login/cadastro (o resto do sistema não muda). */
.auth-pagina,
.auth-pagina * {
  font-family: var(--fonte-texto) !important;
}
.auth-pagina h1,
.auth-pagina h2,
.auth-pagina .auth-marca__textos strong {
  font-family: var(--fonte-titulo) !important;
}

/* ===== Página ===== */
.auth-pagina {
  position: relative;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px 16px;
  box-sizing: border-box;
  overflow: hidden;
  background: linear-gradient(135deg, #4f7cf7 0%, #6a5cf5 55%, #9b3cf0 100%);
  font-family: var(--fonte-texto);
  color: var(--texto);
}

.auth-pagina *,
.auth-pagina *::before,
.auth-pagina *::after {
  box-sizing: border-box;
}

/* Decorações */
.auth-circulo {
  position: absolute;
  border-radius: 50%;
  pointer-events: none;
}
.auth-circulo--topo {
  width: 270px;
  height: 270px;
  left: -95px;
  top: -95px;
  border: 18px solid rgba(255, 255, 255, 0.18);
}
.auth-circulo--base {
  width: 340px;
  height: 340px;
  right: -120px;
  bottom: -120px;
  border: 14px solid rgba(255, 255, 255, 0.14);
}
.auth-pontos {
  position: absolute;
  right: 40px;
  top: 28px;
  width: 100px;
  height: 60px;
  background-image: radial-gradient(rgba(255, 255, 255, 0.35) 2.5px, transparent 3px);
  background-size: 20px 20px;
  pointer-events: none;
}

/* ===== Container principal ===== */
.auth-container {
  position: relative;
  width: 100%;
  max-width: 1120px;
  display: flex;
  flex-wrap: wrap;
  border-radius: 32px;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.22);
  box-shadow: 0 30px 80px rgba(40, 20, 120, 0.3);
}

/* ===== Lado esquerdo ===== */
.auth-apresentacao {
  flex: 1 1 520px;
  min-width: 0;
  padding: 48px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 36px;
  color: #fff;
}

.auth-marca {
  display: flex;
  align-items: center;
  gap: 12px;
}
.auth-logo {
  width: 46px;
  height: 46px;
  border-radius: 14px;
  background: #dce8ff;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--laranja);
}
.auth-logo__pata--1 { transform: translate(1px, -4px) rotate(-12deg); }
.auth-logo__pata--2 { transform: translate(-1px, 4px) rotate(12deg); }

.auth-marca__textos {
  display: flex;
  flex-direction: column;
  gap: 2px;
}
.auth-marca__textos strong {
  font-family: var(--fonte-titulo);
  font-weight: 900;
  font-size: 18px;
  line-height: 1;
}
.auth-marca__textos span {
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: #e2e4ff;
}

.auth-chamada {
  display: flex;
  flex-direction: column;
  gap: 20px;
  max-width: 480px;
}
.auth-chamada__sobre {
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: var(--pessego);
}
.auth-chamada h1 {
  margin: 0;
  font-family: var(--fonte-titulo);
  font-weight: 900;
  font-size: clamp(36px, 5vw, 54px);
  line-height: 1.02;
  letter-spacing: -0.03em;
}
.auth-chamada h1 span {
  color: var(--pessego);
}
.auth-chamada p {
  margin: 0;
  font-size: 16px;
  line-height: 1.6;
  color: #eef0ff;
}

.auth-recursos {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 12px;
}
.auth-recursos li {
  padding: 16px;
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.12);
  border: 1px solid rgba(255, 255, 255, 0.25);
  display: flex;
  flex-direction: column;
  gap: 12px;
  font-size: 13px;
  font-weight: 700;
}
.auth-recursos svg {
  color: var(--pessego);
}

/* ===== Card (lado direito) ===== */
.auth-card {
  flex: 1 1 440px;
  min-width: 0;
  background: #fff;
  border-radius: 32px;
  padding: 48px 56px 32px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 18px;
}

.auth-card__cabecalho {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.auth-card__sobre {
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: var(--roxo);
}
.auth-card__cabecalho h2 {
  margin: 0;
  font-family: var(--fonte-titulo);
  font-weight: 900;
  font-size: 34px;
  letter-spacing: -0.02em;
  line-height: 1.05;
}
.auth-card__cabecalho p {
  margin: 0;
  font-size: 14px;
  color: var(--texto-suave);
}

/* Abas Entrar / Cadastrar */
.auth-abas {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 4px;
  padding: 5px;
  border-radius: 14px;
  background: #eef1f8;
}
.auth-abas a {
  display: flex;
  align-items: center;
  justify-content: center;
  text-decoration: none;
  height: 42px;
  border: none;
  border-radius: 10px;
  background: transparent;
  font: inherit;
  font-size: 14px;
  font-weight: 600;
  color: var(--texto-suave);
  cursor: pointer;
  transition: background 0.2s, color 0.2s, box-shadow 0.2s;
}
.auth-abas a.ativa {
  background: #fff;
  color: var(--texto);
  font-weight: 700;
  box-shadow: 0 2px 8px rgba(17, 24, 39, 0.1);
}

/* Formulário */
.auth-form {
  display: flex;
  flex-direction: column;
  gap: 18px;
}
.auth-campo {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.auth-campo label {
  font-size: 13px;
  font-weight: 700;
  color: #1f2937;
}

.auth-input {
  display: flex;
  align-items: center;
  gap: 10px;
  height: 48px;
  padding: 0 4px 0 14px;
  border-radius: 12px;
  border: 1.5px solid var(--borda);
  background: var(--fundo-input);
  color: #6b7280;
  transition: border-color 0.2s, box-shadow 0.2s;
}
.auth-input--destaque {
  background: var(--fundo-input-destaque);
  border-color: #c9d6f5;
}
.auth-input:focus-within {
  border-color: var(--azul);
  box-shadow: 0 0 0 3px rgba(29, 91, 240, 0.18);
}
.auth-input input {
  flex: 1;
  min-width: 0;
  height: 100%;
  border: none;
  outline: none;
  background: transparent;
  font: inherit;
  font-size: 15px;
  color: var(--texto);
}
.auth-input input::placeholder {
  color: #9ca3af;
}
.auth-input__olho {
  width: 40px;
  height: 40px;
  border: none;
  border-radius: 10px;
  background: transparent;
  color: #6b7280;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}
.auth-input__olho:hover {
  background: #f1f4fb;
}

.auth-linha {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
}
.auth-check {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  color: #374151;
  cursor: pointer;
}
.auth-check input {
  width: 18px;
  height: 18px;
  accent-color: var(--azul);
}
.auth-link {
  font-size: 13px;
  font-weight: 700;
  color: var(--azul);
}
.auth-link:hover {
  color: var(--azul-escuro);
}

/* Mensagens */
.auth-alerta {
  padding: 12px 14px;
  border-radius: 12px;
  background: #fde8e8;
  border: 1px solid #f6c3c3;
  color: #9b1c1c;
  font-size: 13px;
  font-weight: 600;
}
.auth-alerta--sucesso {
  background: #e6f6ee;
  border-color: #b5e2c8;
  color: #146c3c;
}

/* Botão principal */
.auth-botao {
  height: 52px;
  border: none;
  border-radius: 12px;
  background: var(--azul);
  color: #fff;
  font: inherit;
  font-size: 15px;
  font-weight: 700;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  box-shadow: 0 10px 24px rgba(29, 91, 240, 0.3);
  transition: background 0.2s, transform 0.1s;
}
.auth-botao:hover:not(:disabled) {
  background: var(--azul-escuro);
}
.auth-botao:active:not(:disabled) {
  transform: translateY(1px);
}
.auth-botao:disabled {
  opacity: 0.7;
  cursor: wait;
}

.auth-rodape {
  margin-top: 8px;
  text-align: center;
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: #6b7280;
}

/* ===== Responsivo ===== */
@media (max-width: 1000px) {
  .auth-apresentacao {
    padding: 36px 32px;
  }
  .auth-card {
    padding: 40px 32px 28px;
  }
}

@media (max-width: 600px) {
  .auth-pagina {
    padding: 16px;
  }
  .auth-recursos {
    grid-template-columns: 1fr;
  }
  .auth-recursos li {
    flex-direction: row;
    align-items: center;
  }
  .auth-card {
    padding: 32px 20px 24px;
    border-radius: 24px;
  }
  .auth-card__cabecalho h2 {
    font-size: 28px;
  }
}
`;

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
      <style>{estilos}</style>
      <span className="auth-circulo auth-circulo--topo" aria-hidden="true" />
      <span className="auth-circulo auth-circulo--base" aria-hidden="true" />
      <span className="auth-pontos" aria-hidden="true" />

      <div className="auth-container">
        {/* ===== Lado esquerdo: apresentação ===== */}
        <section className="auth-apresentacao">
          <div className="auth-marca">
            <div className="auth-logo">
              <IconPata className="auth-logo__pata--1" />
              <IconPata className="auth-logo__pata--2" />
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