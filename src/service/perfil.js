import api from "./api";

// Evento disparado quando o perfil muda (o menu lateral escuta para atualizar o nome)
export const EVENTO_PERFIL = "petshop:perfil-atualizado";

export async function obterPerfil() {
  const { data } = await api.get("/api/perfil");
  return data;
}

export async function salvarPerfil({ nome, telefone, endereco }) {
  const { data } = await api.put("/api/perfil", { nome, telefone, endereco });
  window.dispatchEvent(new CustomEvent(EVENTO_PERFIL, { detail: data }));
  return data;
}

export async function alterarSenha({ senhaAtual, novaSenha, confirmacao }) {
  await api.put("/api/perfil/senha", { senhaAtual, novaSenha, confirmacao });
}

// manda só o que mudou: { modoEscuro: true } ou { notificacoesEmail: false }
export async function salvarPreferencias(preferencias) {
  const { data } = await api.put("/api/perfil/preferencias", preferencias);
  return data;
}

// mensagem de erro amigável a partir da resposta do back ({ mensagens: [...] })
export function mensagemDeErro(erro, padrao = "Não foi possível concluir. Tente novamente.") {
  const mensagens = erro?.response?.data?.mensagens;
  if (Array.isArray(mensagens) && mensagens.length) return mensagens.join(" ");
  if (!erro?.response) return "Não foi possível conectar ao servidor.";
  return padrao;
}

// iniciais do avatar: "Ryan Santana" -> "RS"; sem nome, a primeira letra do e-mail ("ryan@..." -> "R")
export function iniciaisUsuario(nome, email) {
  const partes = String(nome ?? "").trim().split(/\s+/).filter(Boolean);
  if (partes.length) {
    const primeira = partes[0][0];
    const ultima = partes.length > 1 ? partes[partes.length - 1][0] : "";
    return (primeira + ultima).toUpperCase();
  }
  const letra = String(email ?? "").trim()[0];
  return letra ? letra.toUpperCase() : "?";
}
