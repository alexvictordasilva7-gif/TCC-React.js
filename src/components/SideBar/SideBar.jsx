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

        
          <S.Nlink to="Dashboard">
            <S.AiOutlineHomeIcon />
            Dashboard          </S.Nlink>

        {/* Botão de Clientes + icon */}
        
          <S.Nlink to="Clientes">
            <S.TbUsersIcon />
            Clientes
          </S.Nlink>
        

   
          <S.Nlink to="Pets">
            <S.IconPets/>
            Pets
          </S.Nlink>
       

          {/* Botão de Serviços + icon */}
    
          <S.Nlink to="Servicos">
            <S.IconServico />
            Serviços
          </S.Nlink>
        

       
          <S.Nlink to="Fornecedor">
            <S.IconForne/>
            Fornecedor
          </S.Nlink>
        

        
          <S.Nlink to="Estoque">
            <S.IconEsto />
            Estoque
          </S.Nlink>
      

        {/* Botão de Agendamentos + icon */}
     
          <S.Nlink to="Agendamentos">
            <S.IconAgenda />
            Agendamentos
          </S.Nlink>
    

      </S.SideBardiv>
    </S.SideBarContainer>
  );
}

export default SideBar;