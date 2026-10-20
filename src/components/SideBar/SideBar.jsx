import { useState } from "react";
import Button from "../Button/Button.jsx";
import * as S from "./SideBar.Styled.jsx";
import { useNavigate } from "react-router-dom";
import { LuPawPrint } from "react-icons/lu";

import {
  House,
  Users,
  PawPrint,
  Wrench,
  Calendar,
  Box,
  Truck,
  SquareArrowRightExit,
} from "lucide-react";

function SideBar() {
  const navigate = useNavigate();
  const [recolhida, setRecolhida] = useState(false);

  function sair() {
    localStorage.removeItem("token");
    localStorage.removeItem("usuario");
    navigate("/login", { replace: true });
  }

  const paginas = [
    { nome: "Dashboard", rota: "Dashboard", Icone: House },
    { nome: "Clientes", rota: "Clientes", Icone: Users },
    { nome: "Pets", rota: "Pets", Icone: PawPrint },
    { nome: "Serviços", rota: "Servicos", Icone: Wrench },
    { nome: "Agendamentos", rota: "Agendamentos", Icone: Calendar },
    { nome: "Estoque", rota: "Estoque", Icone: Box },
    { nome: "Fornecedor", rota: "Fornecedor", Icone: Truck },
  ];

  return (
    <S.SideBarContainer $recolhida={recolhida}>
      <S.LogoContainer $recolhida={recolhida}>
        <S.Icon
          as="button"
          type="button"
          onClick={() => setRecolhida(!recolhida)}
          title={recolhida ? "Expandir sidebar" : "Recolher sidebar"}
          aria-label={recolhida ? "Expandir sidebar" : "Recolher sidebar"}
        >
          <LuPawPrint size={30} />
        </S.Icon>

        {!recolhida && <h1>Pet Shop</h1>}
      </S.LogoContainer>

      <S.SideBardiv>
        {paginas.map(({ nome, rota, Icone }) => (
          <S.Nlink
            key={rota}
            to={rota}
            $recolhida={recolhida}
            title={recolhida ? nome : undefined}
          >
            <Icone size={18} />
            {!recolhida && <span>{nome}</span>}
          </S.Nlink>
        ))}
      </S.SideBardiv>

      <S.ProfileContainer $recolhida={recolhida}>
        <S.ProfileAvatar
          src="https://static.nationalgeographicbrasil.com/files/styles/image_3200/public/01-domesticated-dog.jpg?w=1900&h=1267"
          alt="Perfil"
        />

        {!recolhida && (
          <>
            <S.ProfileInfo>
              <span style={{ color: "#fff", fontSize: "14px" }}>
                Meu perfil
              </span>
            </S.ProfileInfo>

            <Button
              onClick={sair}
              texto={<SquareArrowRightExit color="#fff" size={20} />}
              className="transparent"
            />
          </>
        )}
      </S.ProfileContainer>
    </S.SideBarContainer>
  );
}

export default SideBar;