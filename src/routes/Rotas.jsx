import { Routes, Route, Navigate } from "react-router-dom";
import ProtectRotas from "../components/PrivateRouter/ProtectRotas.jsx";
import Layout from "../components/Layout/Layout";
import Dashboard from "../pages/Dashboard/Dashboard.jsx";
import Servicos from "../pages/Servicos/Servicos.jsx";
import ClientesPets from "../pages/ClientesPets/ClientesPets.jsx";
import Login from "../pages/Login/login.jsx";
import Cadastro from "../pages/Cadastro/Cadastro.jsx";
import Estoque from "../pages/Estoque/Estoque.jsx";
import Fornecedor from "../pages/Fornecedor/Fornecedor.jsx";
import Agendamentos from "../pages/Agendamentos/Agendamentos.jsx";

function Rotas() {
  return (
    <Routes>
      <Route>
        <Route path="/" element={<Navigate to="/Login" replace />} />
        <Route path="/Login" element={<Login />} />
        <Route path="/Cadastro" element={<Cadastro />} />
      </Route>
      <Route element={<ProtectRotas />}>
        <Route element={<Layout />}>
          <Route path="/Dashboard" element={<Dashboard />} />
          <Route path="/Servicos" element={<Servicos />} />
          <Route path="/ClientesPets" element={<ClientesPets />} />
          {/* as telas antigas agora fazem parte de Clientes & Pets */}
          <Route path="/Clientes" element={<Navigate to="/ClientesPets" replace />} />
          <Route path="/Pets" element={<Navigate to="/ClientesPets" replace />} />
          <Route path="/Estoque" element={<Estoque />} />
          <Route path="/Fornecedor" element={<Fornecedor />} />
          <Route path="/Agendamentos" element={<Agendamentos />} />
        </Route>
      </Route>
    </Routes>
  );
}

export default Rotas;
