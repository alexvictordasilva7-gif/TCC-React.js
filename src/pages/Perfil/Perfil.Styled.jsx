import styled from "styled-components";

/* ===== Grade: uma coluna só — perfil no centro e os demais cartões abaixo ===== */
export const Grade = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

export const Coluna = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  min-width: 0;
`;

/* mesmo cartão das outras telas (Clientes & Pets, Dashboard) */
export const Caixa = styled.section`
  border-radius: 20px;
  background: var(--ps-superficie);
  border: 1px solid var(--ps-borda);
  box-shadow: var(--ps-sombra);
  color: var(--ps-texto);
  overflow: hidden;
`;

export const Topo = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  padding: 18px 22px;
  border-bottom: 1px solid var(--ps-borda);

  .sobre {
    display: block;
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: var(--ps-texto-suave);
  }

  h2 {
    display: flex;
    align-items: center;
    gap: 8px;
    margin: 2px 0 0;
    font-family: var(--ps-fonte-titulo);
    font-size: 19px;
    font-weight: 800;
  }
`;

export const Corpo = styled.div`
  padding: 20px 22px 22px;
`;

/* ===== Cartão do usuário ===== */
export const CartaoUsuario = styled(Caixa)`
  width: 100%;
  max-width: 780px;
  margin: 0 auto;
  padding: 52px 32px 44px;
  text-align: center;

  .avatar {
    width: 96px;
    height: 96px;
    margin: 0 auto 14px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--ps-degrade-botao);
    color: #fff;
    font-family: var(--ps-fonte-titulo);
    font-size: 34px;
    font-weight: 800;
    box-shadow: var(--ps-sombra-botao);
  }

  h2 {
    margin: 0;
    font-family: var(--ps-fonte-titulo);
    font-size: 32px;
    font-weight: 800;
    overflow-wrap: anywhere;
  }

  .funcao {
    display: block;
    margin-top: 6px;
    color: var(--ps-texto-suave);
    font-size: 17px;
  }

  .email {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    max-width: 100%;
    margin-top: 12px;
    padding: 5px 12px;
    border-radius: 999px;
    background: var(--ps-primaria-clara);
    color: var(--ps-primaria);
    font-size: 12px;
    font-weight: 600;

    span {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }
`;

/* ===== Estatísticas ===== */
export const ListaEstatisticas = styled.ul`
  list-style: none;
  margin: 0;
  padding: 6px 22px 10px;

  li {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 12px 0;
  }

  li + li {
    border-top: 1px solid var(--ps-borda);
  }

  .icone {
    width: 36px;
    height: 36px;
    flex-shrink: 0;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--ps-primaria-clara);
    color: var(--ps-primaria);
  }

  .icone.laranja {
    background: var(--ps-destaque-clara);
    color: var(--ps-destaque);
  }

  .icone.verde {
    background: rgba(22, 163, 74, 0.14);
    color: #16a34a;
  }

  .rotulo {
    flex: 1;
    color: var(--ps-texto-suave);
    font-size: 14px;
  }

  strong {
    font-family: var(--ps-fonte-titulo);
    font-size: 18px;
  }
`;

/* ===== Formulário ===== */
export const Campos = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`;

export const Campo = styled.label`
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin: 0;
  font-size: 14px;
  font-weight: 600;
  color: var(--ps-texto);

  .titulo {
    display: inline-flex;
    align-items: center;
    gap: 6px;
  }

  input {
    height: 44px;
    padding: 0 14px;
    border-radius: 12px;
    border: 1.5px solid var(--ps-borda);
    background: var(--ps-superficie-2);
    color: var(--ps-texto);
    font-weight: 400;
    outline: none;
    transition: border-color 0.15s ease, box-shadow 0.15s ease;
  }

  input:focus {
    border-color: var(--ps-primaria);
    box-shadow: 0 0 0 4px var(--ps-anel-foco);
  }

  input:disabled {
    color: var(--ps-texto-suave);
    cursor: not-allowed;
  }

  small {
    font-weight: 400;
    font-size: 12px;
    color: var(--ps-texto-suave);
  }
`;

export const BotaoPrimario = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 10px 18px;
  border: none;
  border-radius: 999px;
  background: var(--ps-preenchimento);
  color: #fff;
  font-weight: 700;
  font-size: 14px;
  box-shadow: var(--ps-sombra-botao);
  transition: background 0.15s ease, transform 0.15s ease;

  &:hover:not(:disabled) {
    background: var(--ps-preenchimento-hover);
    transform: translateY(-1px);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    box-shadow: none;
  }
`;

export const Nota = styled.p`
  display: flex;
  align-items: flex-start;
  gap: 8px;
  margin: 16px 0 0;
  font-size: 13px;
  color: ${({ $tipo }) =>
    $tipo === "ok" ? "#15803d" : $tipo === "erro" ? "#e5534b" : "var(--ps-texto-suave)"};

  svg {
    flex-shrink: 0;
    margin-top: 1px;
  }
`;

/* ===== Segurança ===== */
export const LinhaSeguranca = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 16px;

  .texto {
    flex: 1;
    min-width: 240px;
  }

  strong {
    display: block;
    font-size: 15px;
  }

  p {
    margin: 4px 0 0;
    font-size: 14px;
    color: var(--ps-texto-suave);
  }
`;

/* ===== Preferências (interruptores) ===== */
export const Preferencia = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 14px 0;

  & + & {
    border-top: 1px solid var(--ps-borda);
  }

  strong {
    display: block;
    font-size: 15px;
  }

  small {
    color: var(--ps-texto-suave);
    font-size: 13px;
  }
`;

export const Interruptor = styled.button`
  position: relative;
  width: 48px;
  height: 28px;
  flex-shrink: 0;
  border: none;
  border-radius: 999px;
  background: ${({ $ligado }) => ($ligado ? "var(--ps-preenchimento)" : "var(--ps-borda)")};
  transition: background 0.2s ease;

  &::after {
    content: "";
    position: absolute;
    top: 4px;
    left: ${({ $ligado }) => ($ligado ? "24px" : "4px")};
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: #fff;
    box-shadow: 0 1px 3px rgba(17, 24, 39, 0.25);
    transition: left 0.2s ease;
  }

  &:focus-visible {
    outline: none;
    box-shadow: 0 0 0 4px var(--ps-anel-foco);
  }
`;

/* ===== Avatar com botão de foto ===== */
export const AvatarFoto = styled.div`
  position: relative;
  width: 150px;
  margin: 0 auto 22px;

  .avatar {
    width: 150px;
    height: 150px;
    margin: 0;
    font-size: 54px;
  }
`;

/* selo "Membro desde" */
export const Selo = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  margin-top: 16px;
  padding: 8px 16px;
  border-radius: 999px;
  background: var(--ps-primaria-clara);
  color: var(--ps-primaria);
  font-size: 14px;
  font-weight: 600;
`;

/* valor em destaque (receita) */
export const ValorVerde = styled.strong`
  color: #16a34a !important;
`;

/* campos de senha: atual em cima, nova e confirmação lado a lado */
export const CamposSenha = styled(Campos)`
  .inteiro {
    grid-column: 1 / -1;
  }
`;

export const BotaoLargo = styled(BotaoPrimario)`
  width: 100%;
  margin-top: 18px;
  padding: 12px 18px;
`;

export const CampoSenha = styled.div`
  position: relative;
  display: flex;

  input {
    flex: 1;
    padding-right: 44px;
  }

  button {
    position: absolute;
    right: 8px;
    top: 50%;
    transform: translateY(-50%);
    border: none;
    background: transparent;
    color: var(--ps-texto-suave);
    padding: 6px;
    display: flex;
  }
`;

/* página centralizada, com largura máxima */
export const Pagina = styled.div`
  width: 100%; /* ocupa toda a largura disponível, como as outras telas */
`;

/* título "Endereço" dentro do formulário */
export const SubtituloCampo = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  margin: 18px 0 8px;
  font-size: 14px;
  font-weight: 600;
  color: var(--ps-texto);
`;

/* ===== Destaque do usuário: cartão branco com avatar grande ===== */
export const Destaque = styled(Caixa)`

  .conteudo {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    gap: 22px;
    padding: 56px 24px 52px;
  }

  .avatar {
    flex-shrink: 0;
    width: 190px;
    height: 190px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--ps-degrade-botao);
    color: #fff;
    font-family: var(--ps-fonte-titulo);
    font-size: 66px;
    font-weight: 800;
    box-shadow: var(--ps-sombra-botao);
  }

  .textos {
    min-width: 0;
  }

  h2 {
    margin: 0;
    font-family: var(--ps-fonte-titulo);
    font-size: 40px;
    font-weight: 800;
    line-height: 1.15;
    overflow-wrap: anywhere;
  }

  .email {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    margin-top: 8px;
    font-size: 17px;
    color: var(--ps-texto-suave);
  }

  .selos {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 10px;
    margin-top: 14px;
  }

  .selo {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 9px 18px;
    border-radius: 999px;
    background: var(--ps-primaria-clara);
    color: var(--ps-primaria);
    font-size: 15px;
    font-weight: 700;
  }

  @media (max-width: 720px) {
    .conteudo {
      gap: 16px;
      padding: 32px 20px;
    }

    .avatar {
      width: 140px;
      height: 140px;
      font-size: 50px;
    }

    h2 {
      font-size: 28px;
    }

    .selos {
      justify-content: center;
    }
  }
`;
