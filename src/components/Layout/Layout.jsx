import SideBar from "../SideBar/SideBar.jsx";
import { Outlet } from "react-router-dom";
import * as S from "./Layout.Styled.jsx";

function Layout() {
    return (
        <div>
            {/* criei esse container para organizar o layout, esse container esta com display: flex para o conteudo ficar alinhado */}
            <S.LayoutContainer> 
                <SideBar />
                <S.Main>
                    <Outlet />
                </S.Main>
            </S.LayoutContainer>
        </div>
    );
};

export default Layout;