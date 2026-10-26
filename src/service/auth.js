import { jwtDecode } from "jwt-decode";

// devolve os dados do token, ou null se não tiver, estiver vencido ou for inválido
export function lerToken() {
  const token = localStorage.getItem("token");
  if (!token) return null;

  try {
    const dados = jwtDecode(token);
    if (dados.exp && dados.exp * 1000 < Date.now()) return null; // exp vem em segundos
    return dados;
  } catch {
    return null; // token mal formado
  }
}

export const estaLogado = () => lerToken() !== null;

export function sair() {
  localStorage.removeItem("token");
}