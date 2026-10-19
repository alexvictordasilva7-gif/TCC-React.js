import "./SideBar.Styled.jsx";
import * as S from "./SideBar.Styled.jsx";
// import de icons
import {
  House,
  Users,
  PawPrint,
  Wrench,
  Calendar,
  Box,
  ClipboardList,
  BarChart3,
  FileText,
  Truck,
} from "lucide-react"; 

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
          <House size={18} />
          Dashboard
        </S.Nlink>

        {/* Botão de Clientes + icon */}

        <S.Nlink to="Clientes">
          <Users size={18} />
          Clientes
        </S.Nlink>

        <S.Nlink to="Pets">
          <PawPrint size={18}/>
          Pets
        </S.Nlink>

        {/* Botão de Serviços + icon */}

        <S.Nlink to="Servicos">
          <Wrench size={18}/>
          Serviços
        </S.Nlink>

        {/* Botão de Agendamentos + icon */}

        <S.Nlink to="Agendamentos">
        <Calendar size={18}/>
          Agendamentos
        </S.Nlink>

        <S.Nlink to="Estoque">
          <Box size={18} />
          Estoque
        </S.Nlink>

        <S.Nlink to="Fornecedor">
          <Truck size={18}/>
          Fornecedor
        </S.Nlink>
      </S.SideBardiv>
    </S.SideBarContainer>
  );
}

export default SideBar;
