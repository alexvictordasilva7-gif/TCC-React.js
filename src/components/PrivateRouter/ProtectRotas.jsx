import { Navigate, Outlet } from "react-router-dom";
import { estaLogado, sair } from "../../service/auth.js";

export default function ProtectRotas() {
  if (!estaLogado()) {
    sair(); // limpa token vencido ou inválido
    return <Navigate to="/Login" replace />;
  }
  return <Outlet />;
}