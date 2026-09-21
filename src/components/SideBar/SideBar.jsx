import "./SideBar.Styled.jsx";
import * as S from "./SideBar.Styled.jsx";

function SideBar() {
  return (
    <S.SideBarContainer>
      <S.LogoContainer>
        <S.Icon />
        <h1>Pet Shop</h1>
      </S.LogoContainer>
      <S.SideBardiv>
        {/* Botão do Dashboard + icon*/}

        <S.SideBarButton>
          <S.Nlink to="Dashboard">
            <S.AiOutlineHomeIcon />
            Dashboard
          </S.Nlink>
        </S.SideBarButton>


        {/* Botão de Clientes + icon */}
        <S.SideBarButton>
          <S.Nlink to="Clientes">
            <S.TbUsersIcon />
            Clientes
          </S.Nlink>
        </S.SideBarButton>

        <S.SideBarButton>
          <S.Nlink to="Pets">
            <S.IconPets/>
            Pets
          </S.Nlink>
        </S.SideBarButton>

          {/* Botão de Serviços + icon */}
        <S.SideBarButton>
          <S.Nlink to="Servicos">
            <S.MdOutlineDesignServicesIcon />
            Serviços
          </S.Nlink>
        </S.SideBarButton>

        <S.SideBarButton>
          <S.Nlink to="Fornecedor">
            <S.IconForne/>
            Fornecedor
          </S.Nlink>
        </S.SideBarButton>

        <S.SideBarButton>
          <S.Nlink to="Estoque">
            <S.IconEsto />
            Estoque
          </S.Nlink>
        </S.SideBarButton>

      </S.SideBardiv>
    </S.SideBarContainer>
  );
}

export default SideBar;
