import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { LuPawPrint } from "react-icons/lu";
import * as S from "./Login.Styled.jsx"; // mesmo visual da tela de login
import api from "../../service/api";

/*
  Recuperação de senha (rotas abertas do back-end):
    POST /api/auth/esqueci-senha    { email }            -> envia o link por e-mail
    POST /api/auth/redefinir-senha  { token, novaSenha } -> grava a nova senha (204)

  O e-mail traz o link  /redefinir-senha?token=...  (válido por 30 minutos, uso único).
*/

/* ===== Ícones (mesmo estilo do login) ===== */
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

const IconVoltar = () => (
  <svg {...base} width={16} height={16}>
    <path d="M19 12H5M11 18l-6-6 6-6" />
  </svg>
);

const IconEscudo = () => (
  <svg {...base} width={20} height={20}>
    <path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6l8-3z" />
    <path d="M9 12l2 2 4-4" />
  </svg>
);

const IconRelogio = () => (
  <svg {...base} width={20} height={20}>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7v5l3 2" />
  </svg>
);

const IconCarta = () => (
  <svg {...base} width={20} height={20}>
    <rect x="3" y="5" width="18" height="14" rx="2" />
    <path d="M3 7l9 6 9-6" />
  </svg>
);

function mensagemDeErro(erro, padrao) {
  const mensagens = erro?.response?.data?.mensagens;
  if (Array.isArray(mensagens) && mensagens.length) return mensagens.join(" ");
  if (!erro?.response) return "Não foi possível conectar ao servidor.";
  return padrao;
}

/* ===== Moldura igual à do login: apresentação à esquerda, card à direita ===== */
function Moldura({ sobre, titulo, texto, children }) {
  return (
    <div className="auth-pagina">
      <S.EstilosLogin />
      <span className="auth-circulo auth-circulo--topo" aria-hidden="true" />
      <span className="auth-circulo auth-circulo--base" aria-hidden="true" />
      <span className="auth-pontos" aria-hidden="true" />

      <div className="auth-container">
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
            <span className="auth-chamada__sobre">Recuperação de acesso</span>
            <h1>
              Esqueceu a senha? <span>A gente resolve.</span>
            </h1>
            <p>
              Enviamos um link seguro para o e-mail da sua conta. Com ele, você cria uma
              nova senha e volta a usar o sistema.
            </p>
          </div>

          <ul className="auth-recursos">
            <li><IconCarta /><span>Link por e-mail</span></li>
            <li><IconRelogio /><span>Válido por 30 min</span></li>
            <li><IconEscudo /><span>Uso único</span></li>
          </ul>
        </section>

        <section className="auth-card">
          <header className="auth-card__cabecalho">
            <span className="auth-card__sobre">{sobre}</span>
            <h2>{titulo}</h2>
            <p>{texto}</p>
          </header>

          {children}

          <footer className="auth-rodape">
            © {new Date().getFullYear()} Pet Shop · Todos os direitos reservados
          </footer>
        </section>
      </div>
    </div>
  );
}

function LinkVoltar() {
  return (
    <Link to="/Login" className="auth-link d-inline-flex align-items-center gap-1 align-self-center">
      <IconVoltar /> Voltar para o login
    </Link>
  );
}

/* ===== /esqueci-senha ===== */
export function EsqueciSenha() {
  const [email, setEmail] = useState(localStorage.getItem("petshop:email") || "");
  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState("");
  const [carregando, setCarregando] = useState(false);

  async function enviar(e) {
    e.preventDefault();
    setErro("");
    setSucesso("");

    if (!/^\S+@\S+\.\S+$/.test(email.trim())) {
      setErro("Informe um e-mail válido.");
      return;
    }

    setCarregando(true);
    try {
      const { data } = await api.post("/api/auth/esqueci-senha", { email: email.trim() });
      setSucesso(
        data?.mensagem ?? "Se o e-mail estiver cadastrado, você receberá as instruções em instantes."
      );
    } catch (erroApi) {
      setErro(mensagemDeErro(erroApi, "Não foi possível enviar o link. Tente novamente."));
    } finally {
      setCarregando(false);
    }
  }

  return (
    <Moldura
      sobre="Recuperar acesso"
      titulo="Esqueceu a senha?"
      texto="Informe o e-mail da sua conta e enviaremos um link para criar uma nova senha."
    >
      <form className="auth-form" onSubmit={enviar} noValidate>
        <div className="auth-campo">
          <label htmlFor="rec-email">E-mail</label>
          <div className="auth-input auth-input--destaque">
            <IconEmail />
            <input
              id="rec-email"
              type="email"
              placeholder="admin@petshop.com"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
        </div>

        {erro && <div className="auth-alerta" role="alert">{erro}</div>}
        {sucesso && (
          <div className="auth-alerta auth-alerta--sucesso" role="status">
            {sucesso} Confira também a caixa de spam.
          </div>
        )}

        <button type="submit" className="auth-botao" disabled={carregando}>
          {carregando ? "Enviando..." : sucesso ? "Enviar novamente" : "Enviar link"}
          {!carregando && <IconSeta />}
        </button>

        <LinkVoltar />
      </form>
    </Moldura>
  );
}

/* ===== /redefinir-senha?token=... ===== */
export function RedefinirSenha() {
  const navigate = useNavigate();
  const [parametros] = useSearchParams();
  const token = parametros.get("token") ?? "";

  const [novaSenha, setNovaSenha] = useState("");
  const [confirmacao, setConfirmacao] = useState("");
  const [mostrar, setMostrar] = useState(false);
  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState(false);
  const [carregando, setCarregando] = useState(false);

  async function redefinir(e) {
    e.preventDefault();
    setErro("");

    if (novaSenha.length < 8 || novaSenha.length > 72) {
      setErro("A senha deve ter entre 8 e 72 caracteres.");
      return;
    }
    if (novaSenha !== confirmacao) {
      setErro("As senhas não conferem.");
      return;
    }

    setCarregando(true);
    try {
      await api.post("/api/auth/redefinir-senha", { token, novaSenha });
      setSucesso(true);
      setTimeout(() => navigate("/Login", { replace: true }), 3000);
    } catch (erroApi) {
      setErro(mensagemDeErro(erroApi, "Não foi possível redefinir a senha."));
    } finally {
      setCarregando(false);
    }
  }

  // link aberto sem o token
  if (!token) {
    return (
      <Moldura
        sobre="Recuperar acesso"
        titulo="Link inválido"
        texto="Este endereço não tem o código de recuperação. Peça um novo link."
      >
        <div className="auth-form">
          <div className="auth-alerta" role="alert">Link inválido ou expirado.</div>
          <Link to="/esqueci-senha" className="auth-botao text-decoration-none">
            Pedir novo link <IconSeta />
          </Link>
          <LinkVoltar />
        </div>
      </Moldura>
    );
  }

  return (
    <Moldura
      sobre="Recuperar acesso"
      titulo="Crie uma nova senha"
      texto="Escolha uma senha com pelo menos 8 caracteres."
    >
      {sucesso ? (
        <div className="auth-form">
          <div className="auth-alerta auth-alerta--sucesso" role="status">
            Senha alterada com sucesso! Você será levado ao login em instantes.
          </div>
          <Link to="/Login" className="auth-botao text-decoration-none">
            Ir para o login <IconSeta />
          </Link>
        </div>
      ) : (
        <form className="auth-form" onSubmit={redefinir} noValidate>
          <div className="auth-campo">
            <label htmlFor="rec-nova">Nova senha</label>
            <div className="auth-input auth-input--destaque">
              <IconCadeado />
              <input
                id="rec-nova"
                type={mostrar ? "text" : "password"}
                placeholder="Mínimo de 8 caracteres"
                autoComplete="new-password"
                value={novaSenha}
                onChange={(e) => setNovaSenha(e.target.value)}
              />
              <button
                type="button"
                className="auth-input__olho"
                aria-label={mostrar ? "Ocultar senha" : "Mostrar senha"}
                onClick={() => setMostrar((v) => !v)}
              >
                {mostrar ? <IconOlhoFechado /> : <IconOlho />}
              </button>
            </div>
          </div>

          <div className="auth-campo">
            <label htmlFor="rec-confirmar">Confirmar nova senha</label>
            <div className="auth-input">
              <IconCadeado />
              <input
                id="rec-confirmar"
                type={mostrar ? "text" : "password"}
                placeholder="Repita a nova senha"
                autoComplete="new-password"
                value={confirmacao}
                onChange={(e) => setConfirmacao(e.target.value)}
              />
            </div>
          </div>

          {erro && (
            <div className="auth-alerta" role="alert">
              {erro}{" "}
              {/expirad|inválid/i.test(erro) && (
                <Link to="/esqueci-senha" className="auth-link">Pedir novo link</Link>
              )}
            </div>
          )}

          <button type="submit" className="auth-botao" disabled={carregando}>
            {carregando ? "Salvando..." : "Salvar nova senha"}
            {!carregando && <IconSeta />}
          </button>

          <LinkVoltar />
        </form>
      )}
    </Moldura>
  );
}
