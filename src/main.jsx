import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { createBrowserRouter } from "react-router-dom";
import { RouterProvider } from "react-router-dom";
import Login from "./pages/login.jsx";
import Cadastro from "./pages/Cadastro.jsx";
import SideBar from "./components/SideBar/SideBar.jsx";
import Dashboard from "./pages/dashboard.jsx";
import Servicos from "./pages/servicos.jsx";
import Clientes from "./pages/clientes.jsx";
import Header from "./components/Header/Header.jsx";
import App from "./App.jsx";
import Er from "./components/Er/Er.jsx";


const rota = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/dashboard",
    element: <Dashboard />,
  },
  {
    path: "/cadastro",
    element: <Cadastro />,
  },
  {
    path: "/servicos",
    element: <Servicos />,
  },
  {
    path: "/clientes",
    element: <Clientes />,
  },
  {
    path: "*",
    element: <Er/>,
  }
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RouterProvider router={rota} />
  </StrictMode>,
);
