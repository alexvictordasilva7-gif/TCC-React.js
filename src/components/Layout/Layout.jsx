import SideBar from "../SideBar/SideBar.jsx";
import Header from "../Header/Header.jsx";
import { Outlet } from "react-router-dom";
import * as S from "./Layout.Styled.jsx";

function Layout() {
    return (
        <div>
            <Header />
            {/* criei esse container para organizar o layout, esse container esta com display: flex para o conteudo ficar alinhado */}
            <S.LayoutContainer> 
                <SideBar />
                <main>
                    <Outlet />
                </main>
            </S.LayoutContainer>
        </div>
    );
};

export default Layout;