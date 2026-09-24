import styled from "styled-components";
import { AiOutlineHome, AiOutlineCalendar } from "react-icons/ai";
import { PiDogFill } from "react-icons/pi";
import { TbUsers } from "react-icons/tb";
import { CiBoxes } from "react-icons/ci";
import { FaTruck, FaTools } from "react-icons/fa";
import { Link, NavLink } from "react-router-dom";
import { LuPawPrint } from "react-icons/lu";

export const SideBarContainer = styled.div`
    
    background-color: #fff;
    
    height: 100vh;
    `

export const SideBardiv = styled.div`
    
    display: flex;
    flex-direction: column;
    gap: 10px;
    padding: 25px 10px;
    min-width:150px;
    
`

export const SideBarButton = styled.button`
background-color:transparent;
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
font-size: 18px;
`
export const AiOutlineHomeIcon = styled(AiOutlineHome)`
  color: #000000;
  font-size: 20px;
  margin-right: 10px;
`;

export const IconEsto = styled(CiBoxes)`
  color: #000000;
  font-size: 20px;
  margin-right: 10px;
`;

export const IconForne = styled(FaTruck)`
  color: #000000;
  font-size: 20px;
  margin-right: 10px;
`;

export const IconServico = styled(FaTools)`
  color: #000000;
  font-size: 20px;
  margin-right: 10px;
`;

export const IconPets = styled(PiDogFill)`

  color: #000000;
  font-size: 20px;
  margin-right: 10px;
`;

export const TbUsersIcon = styled(TbUsers)`
  color: #000000;
  font-size: 20px;
  margin-right: 10px;
`;

export const IconAgenda = styled(AiOutlineCalendar)`
  color: #000000;
  font-size: 20px;
  margin-right: 10px;
`;

export const Nlink = styled(NavLink)`
  text-decoration:none;
  color: #000000;
  font-size: 18px;
  &.active {
    color: #0352fa;

    svg {
      color: #0352fa;
    }}

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
  min-width:150px ;
`;

export const Icon = styled(LuPawPrint)`
  color: #0352fa;
  font-size: 32px; 
  margin-right: 10px;
`;