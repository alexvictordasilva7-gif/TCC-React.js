import { useEffect, useRef, useState } from "react";
import * as S from "./SideBar.Styled.jsx";
import { useNavigate } from "react-router-dom";
import { LuPawPrint } from "react-icons/lu";
import { useTema } from "../../context/TemaContext.jsx";
import { lerToken, sair as limparToken } from "../../service/auth.js";
import { obterPerfil, salvarPreferencias, EVENTO_PERFIL, iniciaisUsuario } from "../../service/perfil.js";

import {
  House,
  Users,
  Wrench,
  Calendar,
  Box,
  ShoppingCart,
  ChartColumn,
  Truck,
  SquareArrowRightExit,
  Sun,
  Moon,
  UserRound,
} from "lucide-react";

const CHAVE_RECOLHIDA = "petshop:menu-recolhido";

const paginas = [
  { nome: "Dashboard", rota: "/Dashboard", Icone: House },
  { nome: "Clientes & Pets", rota: "/ClientesPets", Icone: Users },
  { nome: "Serviços", rota: "/Servicos", Icone: Wrench },
  { nome: "Agendamentos", rota: "/Agendamentos", Icone: Calendar },
  { nome: "Fornecedores", rota: "/Fornecedor", Icone: Truck },
  { nome: "Estoque", rota: "/Estoque", Icone: Box },
  { nome: "Vendas", rota: "/Vendas", Icone: ShoppingCart },
  { nome: "Relatórios", rota: "/Relatorios", Icone: ChartColumn },
];


function SideBar() {
  const navigate = useNavigate();

  // lista de módulos: sem barra de rolagem; um esmaecido indica que há mais itens
  const refLista = useRef(null);
  const [sombras, setSombras] = useState({ topo: false, base: false });
  function medirLista() {
    const el = refLista.current;
    if (!el) return;
    setSombras({
      topo: el.scrollTop > 2,
      base: el.scrollTop + el.clientHeight < el.scrollHeight - 2,
    });
  }
  const { escuro, alternarTema, definirEscuro } = useTema();

  // lembra se o menu estava aberto ou recolhido
  const [recolhida, setRecolhida] = useState(() => {
    // no celular sempre começa recolhido, para não cobrir a tela
    if (window.innerWidth < 768) return true;
    try {
      return localStorage.getItem(CHAVE_RECOLHIDA) !== "nao";
    } catch {
      return true;
    }
  });

  function alternarMenu() {
    setRecolhida((atual) => {
      const nova = !atual;
      try {
        localStorage.setItem(CHAVE_RECOLHIDA, nova ? "sim" : "nao");
      } catch {
        // sem problema: só não lembra na próxima vez
      }
      return nova;
    });
  }

  // recalcula o esmaecido ao abrir/recolher o menu ou mudar o tamanho da janela
  useEffect(() => {
    medirLista();
    window.addEventListener("resize", medirLista);
    return () => window.removeEventListener("resize", medirLista);
  }, [recolhida]);


  // dados do usuário logado: começa pelo token e depois usa o nome salvo no perfil
  const usuario = lerToken();
  const emailToken = usuario?.email ?? (String(usuario?.sub ?? "").includes("@") ? usuario.sub : "");
  const [perfil, setPerfil] = useState(null);

  useEffect(() => {
    let ativo = true;
    obterPerfil()
      .then((dados) => {
        if (!ativo) return;
        setPerfil(dados);
        // aplica o tema salvo na conta (vale em qualquer computador)
        if (typeof dados?.preferencias?.modoEscuro === "boolean") definirEscuro(dados.preferencias.modoEscuro);
      })
      .catch(() => {}); // sem perfil: fica com os dados do token

    const aoAtualizar = (e) => setPerfil((atual) => ({ ...atual, ...e.detail }));
    window.addEventListener(EVENTO_PERFIL, aoAtualizar);
    return () => {
      ativo = false;
      window.removeEventListener(EVENTO_PERFIL, aoAtualizar);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const emailUsuario = perfil?.email ?? emailToken;
  const nomeUsuario = perfil?.nome || usuario?.nome || emailUsuario || "Meu perfil";

  // botão de lua/sol: troca o tema e salva na conta
  function trocarTema() {
    alternarTema();
    salvarPreferencias({ modoEscuro: !escuro }).catch(() => {});
  }

  function sair() {
    limparToken();
    localStorage.removeItem("usuario");
    navigate("/Login", { replace: true });
  }

  const textoTema = escuro ? "Modo claro" : "Modo noturno";
  const iniciais = iniciaisUsuario(perfil?.nome || usuario?.nome, emailUsuario);

  return (
    <S.SideBarContainer className="ps-tema" $recolhida={recolhida}>
      <S.LogoContainer $recolhida={recolhida}>
        <S.Icon
          type="button"
          onClick={alternarMenu}
          title={recolhida ? "Expandir menu" : "Recolher menu"}
          aria-label={recolhida ? "Expandir menu" : "Recolher menu"}
          aria-expanded={!recolhida}
        >
          <LuPawPrint size={24} />
        </S.Icon>

        {!recolhida && (
          <S.Marca>
            <strong className="ps-fonte-titulo">PetShop Pro</strong>
            <span>Gestão simples</span>
          </S.Marca>
        )}
      </S.LogoContainer>

      {!recolhida && <S.Secao>Módulos do sistema</S.Secao>}

      <S.SideBardiv
        ref={refLista}
        onScroll={medirLista}
        $recolhida={recolhida}
        $sombraTopo={sombras.topo}
        $sombraBase={sombras.base}
        aria-label="Menu principal"
      >
        {paginas.map(({ nome, rota, Icone }) => (
          <S.Nlink
            key={rota}
            to={rota}
            $recolhida={recolhida}
            title={recolhida ? nome : undefined}
            aria-label={recolhida ? nome : undefined}
          >
            <Icone size={19} />
            {!recolhida && <span>{nome}</span>}
          </S.Nlink>
        ))}
      </S.SideBardiv>

      <S.Rodape>
        {/* recolhida: avatar e botões um embaixo do outro; aberta: tudo em uma linha */}
        <S.ProfileContainer $recolhida={recolhida}>
          <S.UsuarioRodape $recolhida={recolhida} title={recolhida ? nomeUsuario : undefined}>
            <S.ProfileAvatar aria-hidden="true">{iniciais}</S.ProfileAvatar>
            {!recolhida && (
              <S.ProfileInfo>
                <strong>{nomeUsuario}</strong>
                {emailUsuario && emailUsuario !== nomeUsuario && <span>{emailUsuario}</span>}
              </S.ProfileInfo>
            )}
          </S.UsuarioRodape>

          <S.BotaoPerfil to="/Perfil" title="Meu perfil" aria-label="Meu perfil">
            <UserRound size={18} />
          </S.BotaoPerfil>

          <S.BotaoSair type="button" onClick={trocarTema} title={textoTema} aria-label={textoTema}>
            {escuro ? <Sun size={18} /> : <Moon size={18} />}
          </S.BotaoSair>

          <S.BotaoSair type="button" onClick={sair} title="Sair" aria-label="Sair do sistema">
            <SquareArrowRightExit size={19} />
          </S.BotaoSair>
        </S.ProfileContainer>
      </S.Rodape>
    </S.SideBarContainer>
  );
}

export default SideBar;
