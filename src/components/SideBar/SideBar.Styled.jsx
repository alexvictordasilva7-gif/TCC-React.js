import styled from "styled-components";
import { NavLink } from "react-router-dom";

export const SideBarContainer = styled.aside`
  background-color: #fff;
  width: ${({ $recolhida }) => ($recolhida ? "75px" : "175px")};
  flex: 0 0 ${({ $recolhida }) => ($recolhida ? "75px" : "175px")};
  transition: width 0.3s ease, flex-basis 0.3s ease;
  height: 100vh;
  position: relative;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  overflow: hidden;
`;

export const LogoContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: ${({ $recolhida }) =>
    $recolhida ? "center" : "flex-start"};
  gap: 10px;
  padding: 10px;

  h1 {
    color: black;
    font-size: 20px;
    white-space: nowrap;
    margin: 0;
  }
`;

export const Icon = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  padding: 0;
  border: none;
  background: transparent;
  color: #0352fa;
  cursor: pointer;
  transition: transform 0.2s ease;

  &:hover {
    transform: scale(1.1);
  }
`;

export const SideBardiv = styled.nav`
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 25px 10px;
  flex: 1;
  min-height: 0;
  overflow-y: auto;
`;

export const Nlink = styled(NavLink)`
  display: flex;
  gap: 5px;
  align-items: center;
  justify-content: ${({ $recolhida }) =>
    $recolhida ? "center" : "flex-start"};
  border-radius: 5px;
  color: #000;
  padding: 10px;
  cursor: pointer;
  font-size: 16px;
  text-decoration: none;
  white-space: nowrap;
  overflow: hidden;

  &.active {
    color: #0352fa;
    background-color: #0352fa75;
  }

  &:hover {
    background-color: #c0bebe;
  }

  span {
    white-space: nowrap;
  }
`;

export const ProfileInfo = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  min-width: 0;
`;

export const ProfileAvatar = styled.img`
  width: 34px;
  height: 34px;
  min-width: 34px;
  border-radius: 50%;
  object-fit: cover;
`;

export const ProfileContainer = styled.div`
  position: absolute;
  bottom: 10px;
  left: 0;
  right: 0;

  display: flex;
  align-items: center;
  justify-content: ${({ $recolhida }) =>
    $recolhida ? "center" : "flex-start"};
  gap: 8px;
  padding: 8px;

  background-color: #007aff;
  border: 1px solid #fff;
  border-radius: 8px;
  box-sizing: border-box;
`;