import "./SideBar.Styled.jsx";
import * as S from "./SideBar.Styled.jsx";
import { Link } from "react-router-dom";

function SideBar() {
  return (
    <S.SideBarContainer>
      <S.SideBardiv>


        {/* Botão do Dashboard + icon*/}
        
          <S.SideBarButton>     
            <S.AiOutlineHomeIcon />
            <Link to= "Dashboard">Dashboard</Link>
          </S.SideBarButton>
        


        {/* Botão de Serviços + icon */}
        <S.SideBarButton>
          <S.MdOutlineDesignServicesIcon />
          <Link to="Servicos">Serviços</Link>
        </S.SideBarButton>


        {/* Botão de Clientes + icon */}
        <S.SideBarButton>
          <S.TbUsersIcon />
          <Link to="Clientes">Clientes</Link>
        </S.SideBarButton>


        <S.SideBarButton>Pets</S.SideBarButton>


        <S.SideBarButton>Estoque</S.SideBarButton>


      </S.SideBardiv>
    </S.SideBarContainer>
  );
}

export default SideBar;
