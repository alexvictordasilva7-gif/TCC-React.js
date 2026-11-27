import { useEffect, useState } from "react";
import {
  Calendar,
  Users,
  PawPrint,
  Package,
  User,
  Mail,
  Phone,
  ShieldCheck,
  Save,
  Lock,
  Eye,
  EyeOff,
  CalendarCheck,
  SlidersHorizontal,
  KeyRound,
  MapPin,
  CircleCheck,
  CircleAlert,
} from "lucide-react";
import CabecalhoPagina from "../../components/CabecalhoPagina/CabecalhoPagina.jsx";
import CampoEndereco, { enderecoVazio, montarEndereco, lerEndereco } from "../../components/CampoEndereco/CampoEndereco.jsx";
import { useTema } from "../../context/TemaContext.jsx";
import {
  obterPerfil,
  salvarPerfil,
  alterarSenha,
  salvarPreferencias,
  mensagemDeErro,
  iniciaisUsuario,
} from "../../service/perfil.js";
import * as S from "./Perfil.Styled.jsx";

/*
  Tela "Meu perfil" ligada ao back-end:
    GET  /api/perfil               -> dados, preferências e estatísticas
    PUT  /api/perfil               -> nome, telefone e endereço
    PUT  /api/perfil/senha         -> troca de senha
    PUT  /api/perfil/preferencias  -> notificações e modo escuro
*/

const numero = (v) => Number(v ?? 0).toLocaleString("pt-BR");


// "2026-01-15" -> "janeiro de 2026"
function mesAno(data) {
  if (!data) return null;
  const d = new Date(`${data}T00:00:00`);
  if (Number.isNaN(d.getTime())) return null;
  const texto = d.toLocaleDateString("pt-BR", { month: "long", year: "numeric" });
  return texto.charAt(0).toUpperCase() + texto.slice(1); // "Janeiro de 2026"
}

// máscara simples de telefone: (11) 99999-9999
function mascaraTelefone(v) {
  const n = String(v ?? "").replace(/\D/g, "").slice(0, 11);
  if (n.length <= 2) return n ? `(${n}` : "";
  if (n.length <= 6) return `(${n.slice(0, 2)}) ${n.slice(2)}`;
  if (n.length <= 10) return `(${n.slice(0, 2)}) ${n.slice(2, 6)}-${n.slice(6)}`;
  return `(${n.slice(0, 2)}) ${n.slice(2, 7)}-${n.slice(7)}`;
}

function Aviso({ aviso }) {
  if (!aviso) return null;
  return (
    <S.Nota $tipo={aviso.tipo} role={aviso.tipo === "erro" ? "alert" : "status"}>
      {aviso.tipo === "ok" ? <CircleCheck size={16} /> : <CircleAlert size={16} />}
      {aviso.texto}
    </S.Nota>
  );
}

function CampoSenha({ id, rotulo, ajuda, inteiro, valor, aoMudar, autoComplete }) {
  const [visivel, setVisivel] = useState(false);
  return (
    <S.Campo htmlFor={id} className={inteiro ? "inteiro" : undefined}>
      <span className="titulo">{rotulo}</span>
      <S.CampoSenha>
        <input
          id={id}
          type={visivel ? "text" : "password"}
          placeholder="••••••••"
          value={valor}
          onChange={(e) => aoMudar(e.target.value)}
          autoComplete={autoComplete}
        />
        <button
          type="button"
          onClick={() => setVisivel(!visivel)}
          aria-label={visivel ? "Ocultar senha" : "Mostrar senha"}
        >
          {visivel ? <EyeOff size={17} /> : <Eye size={17} />}
        </button>
      </S.CampoSenha>
      {ajuda && <small>{ajuda}</small>}
    </S.Campo>
  );
}

export default function Perfil() {
  const { escuro, alternarTema } = useTema();

  const [perfil, setPerfil] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [erroCarregar, setErroCarregar] = useState("");

  // informações pessoais
  const [nome, setNome] = useState("");
  const [telefone, setTelefone] = useState("");
  const [endereco, setEndereco] = useState({ ...enderecoVazio });
  const [salvando, setSalvando] = useState(false);
  const [avisoDados, setAvisoDados] = useState(null);

  // segurança
  const [senhaAtual, setSenhaAtual] = useState("");
  const [novaSenha, setNovaSenha] = useState("");
  const [confirmacao, setConfirmacao] = useState("");
  const [trocandoSenha, setTrocandoSenha] = useState(false);
  const [avisoSenha, setAvisoSenha] = useState(null);

  // preferências
  const [notificacoes, setNotificacoes] = useState(true);
  const [avisoPref, setAvisoPref] = useState(null);

  function preencher(dados) {
    setPerfil(dados);
    setNome(dados.nome ?? "");
    setTelefone(dados.telefone ?? "");
    setEndereco(lerEndereco(dados.endereco));
    setNotificacoes(dados.preferencias?.notificacoesEmail ?? true);
  }

  useEffect(() => {
    obterPerfil()
      .then(preencher)
      .catch((e) => setErroCarregar(mensagemDeErro(e, "Não foi possível carregar o perfil.")))
      .finally(() => setCarregando(false));
  }, []);

  async function salvarDados(e) {
    e.preventDefault();
    setAvisoDados(null);
    if (!nome.trim()) {
      setAvisoDados({ tipo: "erro", texto: "Informe o nome completo." });
      return;
    }
    setSalvando(true);
    try {
      const dados = await salvarPerfil({
        nome: nome.trim(),
        telefone: telefone.trim(),
        endereco: montarEndereco(endereco),
      });
      preencher(dados);
      setAvisoDados({ tipo: "ok", texto: "Informações salvas." });
    } catch (erro) {
      setAvisoDados({ tipo: "erro", texto: mensagemDeErro(erro, "Não foi possível salvar.") });
    } finally {
      setSalvando(false);
    }
  }

  async function trocarSenha(e) {
    e.preventDefault();
    setAvisoSenha(null);
    if (!senhaAtual || !novaSenha || !confirmacao) {
      setAvisoSenha({ tipo: "erro", texto: "Preencha os três campos de senha." });
      return;
    }
    if (novaSenha.length < 8 || novaSenha.length > 72) {
      setAvisoSenha({ tipo: "erro", texto: "A nova senha deve ter no mínimo 8 caracteres." });
      return;
    }
    if (novaSenha !== confirmacao) {
      setAvisoSenha({ tipo: "erro", texto: "A confirmação não confere com a nova senha." });
      return;
    }
    setTrocandoSenha(true);
    try {
      await alterarSenha({ senhaAtual, novaSenha, confirmacao });
      setSenhaAtual("");
      setNovaSenha("");
      setConfirmacao("");
      setAvisoSenha({ tipo: "ok", texto: "Senha alterada com sucesso." });
    } catch (erro) {
      setAvisoSenha({ tipo: "erro", texto: mensagemDeErro(erro, "Não foi possível alterar a senha.") });
    } finally {
      setTrocandoSenha(false);
    }
  }

  async function mudarNotificacoes() {
    const novo = !notificacoes;
    setNotificacoes(novo);
    setAvisoPref(null);
    try {
      await salvarPreferencias({ notificacoesEmail: novo });
    } catch (erro) {
      setNotificacoes(!novo); // volta como estava
      setAvisoPref({ tipo: "erro", texto: mensagemDeErro(erro, "Não foi possível salvar a preferência.") });
    }
  }

  async function mudarTema() {
    const novo = !escuro;
    alternarTema();
    setAvisoPref(null);
    try {
      await salvarPreferencias({ modoEscuro: novo });
    } catch (erro) {
      setAvisoPref({ tipo: "erro", texto: mensagemDeErro(erro, "O tema mudou, mas não foi salvo na conta.") });
    }
  }

  const nomeExibido = perfil?.nome || perfil?.email || "Meu perfil";
  const desde = mesAno(perfil?.membroDesde);
  const est = perfil?.estatisticas ?? {};

  return (
    <S.Pagina className="ps-tema">
      <CabecalhoPagina
        sobre="Conta"
        icone="person-circle"
        titulo="Meu perfil"
        subtitulo="Seus dados de acesso e preferências do sistema."
      />

      {carregando && <S.Nota>Carregando perfil...</S.Nota>}
      {erroCarregar && <Aviso aviso={{ tipo: "erro", texto: erroCarregar }} />}

      {perfil && (
        <S.Grade>
          {/* ===== Destaque do usuário (topo, grande) ===== */}
          <S.Destaque>
            <div className="conteudo">
              <div className="avatar" aria-hidden="true">
                {iniciaisUsuario(perfil.nome, perfil.email)}
              </div>
              <div className="textos">
                <h2>{nomeExibido}</h2>
                {perfil.nome && perfil.email && (
                  <span className="email">
                    <Mail size={16} /> {perfil.email}
                  </span>
                )}
                <div className="selos">
                  <span className="selo">
                    <ShieldCheck size={16} /> {perfil.funcao}
                  </span>
                  {desde && (
                    <span className="selo">
                      <CalendarCheck size={16} /> Membro desde {desde}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </S.Destaque>

          {/* ===== Perfil e estatísticas ===== */}
          <S.Coluna>

            <S.Caixa>
              <S.Topo>
                <div>
                  <span className="sobre">Visão geral</span>
                  <h2>Estatísticas</h2>
                </div>
              </S.Topo>
              <S.ListaEstatisticas>
                <li>
                  <span className="icone"><Calendar size={18} /></span>
                  <span className="rotulo">Agendamentos</span>
                  <strong>{numero(est.agendamentos)}</strong>
                </li>
                <li>
                  <span className="icone"><Users size={18} /></span>
                  <span className="rotulo">Clientes</span>
                  <strong>{numero(est.clientes)}</strong>
                </li>
                <li>
                  <span className="icone laranja"><PawPrint size={18} /></span>
                  <span className="rotulo">Pets</span>
                  <strong>{numero(est.pets)}</strong>
                </li>
                <li>
                  <span className="icone verde"><Package size={18} /></span>
                  <span className="rotulo">Itens em estoque</span>
                  <S.ValorVerde>{numero(est.itensEmEstoque)}</S.ValorVerde>
                </li>
              </S.ListaEstatisticas>
            </S.Caixa>
          </S.Coluna>

          {/* ===== Formulários ===== */}
          <S.Coluna>
            <S.Caixa as="form" onSubmit={salvarDados} noValidate>
              <S.Topo>
                <div>
                  <span className="sobre">Conta</span>
                  <h2>Informações pessoais</h2>
                </div>
                <S.BotaoPrimario type="submit" disabled={salvando}>
                  <Save size={16} /> {salvando ? "Salvando..." : "Salvar"}
                </S.BotaoPrimario>
              </S.Topo>

              <S.Corpo>
                <S.Campos>
                  <S.Campo>
                    <span className="titulo"><User size={15} /> Nome completo</span>
                    <input
                      value={nome}
                      onChange={(e) => setNome(e.target.value)}
                      placeholder="Ex.: Ryan Santana"
                      maxLength={120}
                      autoComplete="name"
                    />
                  </S.Campo>

                  <S.Campo>
                    <span className="titulo"><Mail size={15} /> E-mail</span>
                    <input type="email" value={perfil.email ?? ""} disabled readOnly />
                    <small>Somente leitura: o e-mail é usado no login.</small>
                  </S.Campo>

                  <S.Campo>
                    <span className="titulo"><Phone size={15} /> Telefone</span>
                    <input
                      value={telefone}
                      onChange={(e) => setTelefone(mascaraTelefone(e.target.value))}
                      placeholder="(00) 00000-0000"
                      inputMode="tel"
                      autoComplete="tel"
                    />
                  </S.Campo>

                  <S.Campo>
                    <span className="titulo"><ShieldCheck size={15} /> Função</span>
                    <input value={perfil.funcao ?? ""} disabled readOnly />
                    <small>Somente leitura.</small>
                  </S.Campo>
                </S.Campos>

                <S.SubtituloCampo>
                  <MapPin size={15} /> Endereço
                </S.SubtituloCampo>
                <CampoEndereco tema valor={endereco} onChange={setEndereco} />

                <Aviso aviso={avisoDados} />
              </S.Corpo>
            </S.Caixa>

            <S.Caixa as="form" onSubmit={trocarSenha} noValidate>
              <S.Topo>
                <div>
                  <span className="sobre">Acesso</span>
                  <h2><Lock size={18} /> Segurança</h2>
                </div>
              </S.Topo>
              <S.Corpo>
                <S.CamposSenha>
                  <CampoSenha
                    id="senha-atual"
                    rotulo="Senha atual"
                    inteiro
                    valor={senhaAtual}
                    aoMudar={setSenhaAtual}
                    autoComplete="current-password"
                  />
                  <CampoSenha
                    id="senha-nova"
                    rotulo="Nova senha"
                    ajuda="Mínimo de 8 caracteres."
                    valor={novaSenha}
                    aoMudar={setNovaSenha}
                    autoComplete="new-password"
                  />
                  <CampoSenha
                    id="senha-confirmar"
                    rotulo="Confirmar nova senha"
                    valor={confirmacao}
                    aoMudar={setConfirmacao}
                    autoComplete="new-password"
                  />
                </S.CamposSenha>
                <S.BotaoLargo type="submit" disabled={trocandoSenha}>
                  <KeyRound size={16} /> {trocandoSenha ? "Alterando..." : "Alterar senha"}
                </S.BotaoLargo>
                <Aviso aviso={avisoSenha} />
              </S.Corpo>
            </S.Caixa>

            <S.Caixa>
              <S.Topo>
                <div>
                  <span className="sobre">Sistema</span>
                  <h2><SlidersHorizontal size={18} /> Preferências</h2>
                </div>
              </S.Topo>
              <S.Corpo style={{ paddingTop: 6, paddingBottom: 8 }}>
                <S.Preferencia>
                  <div>
                    <strong>Notificações por e-mail</strong>
                    <small>Receba alertas sobre novos agendamentos.</small>
                  </div>
                  <S.Interruptor
                    type="button"
                    role="switch"
                    aria-checked={notificacoes}
                    aria-label="Notificações por e-mail"
                    $ligado={notificacoes}
                    onClick={mudarNotificacoes}
                  />
                </S.Preferencia>

                <S.Preferencia>
                  <div>
                    <strong>Modo escuro</strong>
                    <small>Ativar o tema escuro do sistema.</small>
                  </div>
                  <S.Interruptor
                    type="button"
                    role="switch"
                    aria-checked={escuro}
                    aria-label="Modo escuro"
                    $ligado={escuro}
                    onClick={mudarTema}
                  />
                </S.Preferencia>
                <Aviso aviso={avisoPref} />
              </S.Corpo>
            </S.Caixa>
          </S.Coluna>
        </S.Grade>
      )}
    </S.Pagina>
  );
}
