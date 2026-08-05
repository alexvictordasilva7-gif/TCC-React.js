import styled from "styled-components";
import { AiOutlineHome } from "react-icons/ai";
import { MdOutlineDesignServices } from "react-icons/md";
import { TbUsers } from "react-icons/tb";


export const SideBarContainer = styled.div`
    position: fixed;
    background-color: #fff;
    border-right: 1px solid #929292;
    height: 100vh;
    width: 200px;
    z-index: 2;
    `

export const SideBardiv = styled.div`
    border-top: 1px  solid #929292;
    display: flex;
    flex-direction: column;
    gap: 10px;
    padding: 25px 10px;
    
`

export const SideBarButton = styled.button`
background-color: transparent;
&:hover {
    background-color: #c0bebe;
    transition: 0.4s;
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
  color: #0352fa;
  font-size: 20px;
  margin-right: 10px;
`;

export const MdOutlineDesignServicesIcon = styled(MdOutlineDesignServices)`
  color: #0352fa;
  font-size: 20px;
  margin-right: 10px;
`;

export const TbUsersIcon = styled(TbUsers)`
  color: #0352fa;
  font-size: 20px;
  margin-right: 10px;
`;

