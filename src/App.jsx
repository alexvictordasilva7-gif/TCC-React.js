import { useState } from "react";
import { createBrowserRouter } from "react-router-dom";
import { RouterProvider } from "react-router-dom";
import * as S from "./App.Styled.jsx";
import Login from "./pages/login.jsx";
import Cadastro from "./pages/Cadastro.jsx";
import SideBar from "./components/SideBar/SideBar.jsx";
import Dashboard from "./pages/dashboard.jsx";
import Servicos from "./pages/servicos.jsx";
import Clientes from "./pages/clientes.jsx";
import Header from "./components/Header/Header.jsx";


function App() {
  return (
    <S.AppContainer >
      <Header />
      <SideBar />
    </S.AppContainer>
  );
}

export default App;
