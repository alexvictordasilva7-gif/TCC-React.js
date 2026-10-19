import styled from "styled-components";
import { Link, NavLink } from "react-router-dom";
import { LuPawPrint } from "react-icons/lu";

export const SideBarContainer = styled.div`
  background-color: #fff;

  height: 100vh;
`;

export const SideBardiv = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 25px 10px;
  min-width: 150px;
`;

export const SideBarButton = styled.button`
  background-color: transparent;
  &:hover {
    background-color: #c0bebe;
    transition: 0.4s;
  }
  &:has(.active) {
    background-color: #0351fa75;
  }
  display: flex;
  border: none;
  align-items: start;
  border-radius: 5px;
  color: #000000;
  padding: 10px;

  cursor: pointer;
  font-size: 16px;
`;

export const Nlink = styled(NavLink)`
  display: flex;
  gap: 5px;
  align-items: center;
  border: none;
  border-radius: 5px;
  color: #000000;
  padding: 10px;
  cursor: pointer;
  font-size: 16px;
  text-decoration: none;
  color: #000000;
  &.active {
    color: #0352fa;
    background-color: #0352fa75;
  }
`;

export const LogoContainer = styled.div`
  display: flex;
  padding: 10px 10px;
  background-color: #fff;
  color: #000000;
  h1 {
    font-size: 24px;
    margin: 0;
  }
  justify-content: center;
  align-items: center;
  min-width: 150px;
`;

export const Icon = styled(LuPawPrint)`
  color: #0352fa;
  font-size: 32px;
  margin-right: 10px;
`;
