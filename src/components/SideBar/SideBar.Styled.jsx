import styled from "styled-components";
import { NavLink } from "react-router-dom";

const LARGURA_ABERTA = "248px";
const LARGURA_RECOLHIDA = "84px";

export const SideBarContainer = styled.aside`
  width: ${({ $recolhida }) => ($recolhida ? LARGURA_RECOLHIDA : LARGURA_ABERTA)};
  flex: 0 0 ${({ $recolhida }) => ($recolhida ? LARGURA_RECOLHIDA : LARGURA_ABERTA)};
  transition: width 0.25s ease, flex-basis 0.25s ease;

  position: sticky;
  top: 0;
  height: 100vh;
  align-self: flex-start; /* impede o flex de esticar a sidebar junto com o conteúdo */

  display: flex;
  flex-direction: column;
  overflow: hidden;
  background: var(--ps-degrade-menu);
  color: #fff;
`;

export const LogoContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: ${({ $recolhida }) => ($recolhida ? "center" : "flex-start")};
  gap: 12px;
  padding: 22px ${({ $recolhida }) => ($recolhida ? "0" : "18px")};
  border-bottom: 1px solid rgba(255, 255, 255, 0.14);
  min-height: 88px;
`;

export const Icon = styled.button`
  position: relative;
  flex-shrink: 0;
  width: 44px;
  height: 44px;
  border: none;
  border-radius: 14px;
  background: #ffd36b;
  color: #1b1f33;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: transform 0.15s ease;

  &:hover {
    transform: scale(1.06);
  }
  &:focus-visible {
    outline: 3px solid rgba(255, 255, 255, 0.7);
    outline-offset: 2px;
  }
  &::after {
    content: "";
    position: absolute;
    top: -3px;
    right: -3px;
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background: #ff8a65;
    border: 2px solid #3d5cf2;
  }
`;

export const Marca = styled.div`
  display: flex;
  flex-direction: column;
  min-width: 0;

  strong {
    font-family: var(--ps-fonte-titulo);
    font-size: 19px;
    font-weight: 900;
    line-height: 1.1;
    white-space: nowrap;
  }
  span {
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 0.16em;
    text-transform: uppercase;
    opacity: 0.8;
    white-space: nowrap;
  }
`;

export const Secao = styled.span`
  display: block;
  padding: 18px 22px 6px;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.6);
  white-space: nowrap;
`;

export const SideBardiv = styled.nav`
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: ${({ $recolhida }) => ($recolhida ? "18px 12px" : "4px 12px")};
  flex: 1;
  min-height: 0;
  overflow-y: auto;
`;

export const Nlink = styled(NavLink)`
  position: relative;
  display: flex;
  gap: 12px;
  align-items: center;
  justify-content: ${({ $recolhida }) => ($recolhida ? "center" : "flex-start")};
  min-height: 46px;
  padding: 0 ${({ $recolhida }) => ($recolhida ? "0" : "14px")};
  border-radius: 14px;
  color: rgba(255, 255, 255, 0.86);
  font-size: 15px;
  font-weight: 600;
  text-decoration: none;
  white-space: nowrap;
  overflow: hidden;
  transition: background 0.15s ease, color 0.15s ease;

  svg {
    flex-shrink: 0;
  }

  &:hover {
    background: rgba(255, 255, 255, 0.12);
    color: #fff;
  }

  &.active {
    background: #fff;
    color: #1d5bf0;
    box-shadow: 0 8px 20px rgba(10, 20, 80, 0.25);
  }

  [data-bs-theme="dark"] &.active {
    background: rgba(255, 255, 255, 0.95);
    color: #2a4fd6;
  }

  &:focus-visible {
    outline: 3px solid rgba(255, 255, 255, 0.7);
    outline-offset: 2px;
  }
`;

export const Rodape = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 14px 12px 16px;
  border-top: 1px solid rgba(255, 255, 255, 0.14);
`;

export const ProfileContainer = styled.div`
  display: flex;
  flex-direction: ${({ $recolhida }) => ($recolhida ? "column" : "row")};
  align-items: center;
  gap: ${({ $recolhida }) => ($recolhida ? "8px" : "6px")};
  padding: ${({ $recolhida }) => ($recolhida ? "12px 6px" : "10px 8px 10px 10px")};
  border-radius: 18px;
  background: rgba(255, 255, 255, 0.12);
`;

export const ProfileAvatar = styled.div`
  flex-shrink: 0;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: 2px solid #ffd36b;
  background: rgba(255, 255, 255, 0.15);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  font-weight: 800;
`;

export const ProfileInfo = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  min-width: 0;
  margin-left: 4px;

  strong {
    font-size: 14px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  span {
    font-size: 11px;
    opacity: 0.75;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
`;

export const BotaoSair = styled.button`
  flex-shrink: 0;
  width: 36px;
  height: 36px;
  border: none;
  border-radius: 10px;
  background: transparent;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;

  &:hover {
    background: rgba(255, 255, 255, 0.16);
  }
  &:focus-visible {
    outline: 3px solid rgba(255, 255, 255, 0.7);
    outline-offset: 2px;
  }
`;
