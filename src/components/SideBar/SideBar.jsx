import { useState } from "react";
import * as S from "./SideBar.Styled.jsx";
import { useNavigate } from "react-router-dom";
import { LuPawPrint } from "react-icons/lu";
import { useTema } from "../../context/TemaContext.jsx";
import { lerToken, sair as limparToken } from "../../service/auth.js";

import {
  House,
  Users,
  Wrench,
  Calendar,
  Box,
  Truck,
  SquareArrowRightExit,
  Sun,
  Moon,
} from "lucide-react";

const CHAVE_RECOLHIDA = "petshop:menu-recolhido";

const paginas = [
  { nome: "Dashboard", rota: "/Dashboard", Icone: House },
  { nome: "Clientes & Pets", rota: "/ClientesPets", Icone: Users },
  { nome: "Serviços", rota: "/Servicos", Icone: Wrench },
  { nome: "Agendamentos", rota: "/Agendamentos", Icone: Calendar },
  { nome: "Fornecedores", rota: "/Fornecedor", Icone: Truck },
  { nome: "Estoque", rota: "/Estoque", Icone: Box },
];

// iniciais para o avatar: "Ryan Santana" -> "RS", "ryan@email.com" -> "R"
function iniciais(texto = "") {
  const nome = String(texto).split("@")[0].trim();
  const partes = nome.split(/[\s._-]+/).filter(Boolean);
  return (partes.slice(0, 2).map((p) => p[0].toUpperCase()).join("") || "?");
}

function SideBar() {
  const navigate = useNavigate();
  const { escuro, alternarTema } = useTema();

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

  // dados do usuário logado (vem do token JWT)
  const usuario = lerToken();
  const nomeUsuario = usuario?.nome ?? usuario?.name ?? usuario?.sub ?? "Meu perfil";
  const emailUsuario = usuario?.email ?? (String(usuario?.sub ?? "").includes("@") ? usuario.sub : "");

  function sair() {
    limparToken();
    localStorage.removeItem("usuario");
    navigate("/Login", { replace: true });
  }

  const textoTema = escuro ? "Modo claro" : "Modo noturno";

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

      <S.SideBardiv $recolhida={recolhida} aria-label="Menu principal">
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
        <S.ProfileContainer $recolhida={recolhida}>
          <S.ProfileAvatar title={recolhida ? nomeUsuario : undefined} aria-hidden="true">
            {iniciais(nomeUsuario)}
          </S.ProfileAvatar>

          {!recolhida && (
            <S.ProfileInfo>
              <strong title={nomeUsuario}>{nomeUsuario}</strong>
              {emailUsuario && emailUsuario !== nomeUsuario && (
                <span title={emailUsuario}>{emailUsuario}</span>
              )}
            </S.ProfileInfo>
          )}

          <S.BotaoSair
            type="button"
            onClick={alternarTema}
            title={textoTema}
            aria-label={textoTema}
          >
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
