import styled from "styled-components";

/* ===== Botão "Novo cadastro" ===== */
export const BotaoNovo = styled.button`
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 12px 22px 12px 12px;
  border: none;
  border-radius: 18px;
  background: var(--ps-degrade-botao);
  color: #fff;
  text-align: left;
  box-shadow: var(--ps-sombra-botao);
  cursor: pointer;
  transition: transform 0.15s ease, box-shadow 0.15s ease;

  &:hover {
    transform: translateY(-1px);
  }
  &:focus-visible {
    outline: 3px solid var(--bs-focus-ring-color);
    outline-offset: 2px;
  }

  .icone {
    position: relative;
    width: 44px;
    height: 44px;
    border-radius: 14px;
    background: rgba(255, 255, 255, 0.2);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 20px;
  }
  .mais {
    position: absolute;
    top: -6px;
    right: -6px;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: #f5a04a;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 12px;
  }
  strong {
    display: block;
    font-size: 15px;
  }
  small {
    display: block;
    font-size: 12px;
    opacity: 0.88;
  }
`;

/* ===== Números ===== */
export const Numeros = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16px;
  margin-bottom: 20px;

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`;

/* ===== Lista de tutores ===== */
export const Lista = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

export const Card = styled.li`
  display: flex;
  flex-wrap: wrap;
  border-radius: 20px;
  background: var(--ps-superficie);
  border: 1px solid var(--ps-borda);
  border-left: 6px solid ${({ $cor }) => $cor};
  box-shadow: var(--ps-sombra);
  overflow: hidden;
`;

export const Tutor = styled.div`
  flex: 1 1 300px;
  min-width: 0;
  padding: 20px 22px;
  border-right: 1px solid var(--ps-borda);

  @media (max-width: 760px) {
    border-right: none;
    border-bottom: 1px solid var(--ps-borda);
  }
`;

export const LinhaTutor = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 12px;
`;

export const Avatar = styled.span`
  flex-shrink: 0;
  width: 48px;
  height: 48px;
  border-radius: 14px;
  background: #111827;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: var(--ps-fonte-titulo);
  font-size: 17px;
  font-weight: 800;

  [data-bs-theme="dark"] & {
    background: var(--ps-primaria-clara);
    color: var(--ps-primaria);
  }
`;

export const NomeTutor = styled.div`
  flex: 1;
  min-width: 0;

  strong {
    display: block;
    font-family: var(--ps-fonte-titulo);
    font-size: 19px;
    font-weight: 800;
    color: var(--ps-texto);
    overflow-wrap: anywhere;
  }
  span {
    font-size: 13px;
    font-weight: 500;
    color: var(--ps-primaria);
  }
`;

export const Acoes = styled.div`
  display: flex;
  gap: 2px;
`;

export const BotaoIcone = styled.button`
  width: 36px;
  height: 36px;
  border: none;
  border-radius: 10px;
  background: transparent;
  color: var(--ps-texto-suave);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;

  &:hover {
    background: ${({ $perigo }) => ($perigo ? "rgba(229, 83, 75, 0.12)" : "var(--ps-primaria-clara)")};
    color: ${({ $perigo }) => ($perigo ? "#e5534b" : "var(--ps-primaria)")};
  }
  &:focus-visible {
    outline: 3px solid var(--bs-focus-ring-color);
  }
`;

export const Contato = styled.ul`
  list-style: none;
  margin: 14px 0 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 8px;

  li {
    display: flex;
    align-items: center;
    gap: 10px;
    font-size: 13px;
    color: var(--ps-texto-suave);
    overflow-wrap: anywhere;
  }
  i {
    color: var(--ps-primaria);
  }
`;

export const Pets = styled.div`
  flex: 2 1 380px;
  min-width: 0;
  padding: 20px 22px;
`;

export const TopoPets = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  margin-bottom: 14px;

  > span {
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 0.16em;
    text-transform: uppercase;
    color: var(--ps-texto-suave);
  }
`;

export const GradePets = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 12px;
`;

export const Pet = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 14px;
  border-radius: 16px;
  border: 1px solid var(--ps-borda);
  background: var(--ps-superficie);

  .icone {
    flex-shrink: 0;
    width: 42px;
    height: 42px;
    border-radius: 50%;
    background: var(--ps-destaque-clara);
    color: var(--ps-destaque);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 18px;
  }
  .textos {
    flex: 1;
    min-width: 0;
  }
  strong {
    display: block;
    font-size: 15px;
    color: var(--ps-texto);
  }
  .textos span {
    display: block;
    font-size: 13px;
    color: var(--ps-texto-suave);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
`;

export const Vazio = styled.p`
  margin: 0;
  font-size: 14px;
  color: var(--ps-texto-suave);
`;

export const EstadoVazio = styled.div`
  padding: 48px 16px;
  text-align: center;
  color: var(--ps-texto-suave);
  border-radius: 20px;
  border: 1px dashed var(--ps-borda);
  background: var(--ps-superficie);

  i {
    display: block;
    font-size: 32px;
    margin-bottom: 8px;
    opacity: 0.6;
  }
`;

/* ===== Modal ===== */
export const Secao = styled.fieldset`
  border: none;
  margin: 0;
  padding: 0;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 14px;

  & + & {
    padding-top: 18px;
    border-top: 1px solid var(--ps-borda);
  }
`;

export const TituloSecao = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 12px;

  legend {
    float: none;
    margin: 0;
    font-size: 12px;
    font-weight: 700;
    letter-spacing: 0.16em;
    text-transform: uppercase;
    color: var(--ps-primaria);
  }
  p {
    margin: 2px 0 0;
    font-size: 13px;
    color: var(--ps-texto-suave);
  }
`;

export const DuasColunas = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 14px;

  @media (max-width: 560px) {
    grid-template-columns: 1fr;
  }
`;

export const BotaoOutroPet = styled.button`
  flex-shrink: 0;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  height: 36px;
  padding: 0 14px;
  border: none;
  border-radius: 999px;
  background: var(--ps-destaque-clara);
  color: var(--ps-destaque);
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;

  &:hover {
    filter: brightness(0.97);
  }
`;

export const PetForm = styled.div`
  height: 100%;
  padding: 18px;
  border-radius: 18px;
  border: 1px solid var(--ps-borda);
  background: var(--ps-superficie-2);
  display: flex;
  flex-direction: column;
  gap: 14px;

  .topo {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .titulo {
    display: inline-flex;
    align-items: center;
    gap: 10px;
    font-weight: 700;
    color: var(--ps-texto);
  }
  .bolinha {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    background: var(--ps-primaria-clara);
    color: var(--ps-primaria);
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .chip {
    align-self: flex-start;
    padding: 7px 14px;
    border-radius: 999px;
    background: var(--ps-primaria-clara);
    color: var(--ps-primaria);
    font-size: 13px;
    font-weight: 500;
  }
`;

export const Alerta = styled.div`
  padding: 12px 14px;
  border-radius: 12px;
  background: rgba(229, 83, 75, 0.1);
  border: 1px solid rgba(229, 83, 75, 0.35);
  color: #e5534b;
  font-size: 13px;
  font-weight: 600;
  white-space: pre-line;
`;

export const Rodape = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
  padding-top: 6px;
`;
