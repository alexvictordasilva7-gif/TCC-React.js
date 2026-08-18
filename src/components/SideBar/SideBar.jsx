import "./SideBar.Styled.jsx";
import * as S from "./SideBar.Styled.jsx";
import { Link, NavLink, } from "react-router-dom";

function SideBar() {
  return (
    <S.SideBarContainer>
      <S.SideBardiv>


        {/* Botão do Dashboard + icon*/}
        
          <S.SideBarButton>     
            <S.AiOutlineHomeIcon />
            <S.Nlink to= "Dashboard">Dashboard</S.Nlink>
          </S.SideBarButton>
        


        {/* Botão de Serviços + icon */}
        <S.SideBarButton>
          <S.MdOutlineDesignServicesIcon />
          <S.Nlink to="Servicos">Serviços</S.Nlink>
        </S.SideBarButton>


        {/* Botão de Clientes + icon */}
        <S.SideBarButton>
          <S.TbUsersIcon />
          <S.Nlink to="Clientes">Clientes</S.Nlink>
        </S.SideBarButton>


        <S.SideBarButton>Pets</S.SideBarButton>


        <S.SideBarButton>Estoque</S.SideBarButton>


      </S.SideBardiv>
    </S.SideBarContainer>
  );
}

export default SideBar;
