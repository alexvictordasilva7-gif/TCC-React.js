import "./SideBar.Styled.jsx";
import * as S from "./SideBar.Styled.jsx";
import { Link } from "react-router-dom";

function SideBar({ isOpen }) {
  if (isOpen) {
  }
  return (
    <S.SideBarContainer>
      <S.SideBardiv>


        {/* Botão do Dashboard + icon*/}
        
          <S.SideBarButton>     
            <S.AiOutlineHomeIcon />
            <Link to="/dashboard">
            Dashboard
            </Link>
          </S.SideBarButton>
        


        {/* Botão de Serviços + icon */}
        <S.SideBarButton>
          <S.MdOutlineDesignServicesIcon />
          Serviços
        </S.SideBarButton>


        {/* Botão de Clientes + icon */}
        <S.SideBarButton>
          <S.TbUsersIcon />
          Clientes
        </S.SideBarButton>


        <S.SideBarButton>Configurações</S.SideBarButton>


        <S.SideBarButton>Sair</S.SideBarButton>


      </S.SideBardiv>
    </S.SideBarContainer>
  );
}

export default SideBar;
