// Funções que traduzem o que vem do back (Java) para o formato usado nas telas.
// Ficam aqui para todas as páginas usarem a mesma regra.

// Pet: o dono vem como tutorIds: [id] (ou variações). A tela usa pet.donoId.
export const normalizarPet = (p) => ({
  ...p,
  donoId: p.donoId ?? p.tutorIds?.[0] ?? p.tutorId ?? p.tutor?.id ?? p.tutores?.[0]?.id,
});

// Serviço: o back usa preco/duracaoMinutos/tipoServico.
export const normalizarServico = (s) => ({
  ...s,
  valor: s.preco ?? s.valor,
  duracao: s.duracaoMinutos ?? s.duracao,
  categoria: s.categoria,
  tipo: s.tipoServico ?? s.tipo,
});

// Lista paginada do Spring ({ content: [...] }) ou lista simples
export const lista = (dados) => dados?.content ?? dados ?? [];

// Mensagem de erro do back (o projeto devolve "mensagens": [...] ou "message")
export function mensagemDeErro(erro, padrao) {
  const mensagens = erro?.response?.data?.mensagens;
  if (Array.isArray(mensagens) && mensagens.length) return mensagens.join("\n");
  return erro?.response?.data?.message ?? padrao;
}

// 45 -> "45 min" | 90 -> "1h 30min" | 1440 -> "1 dia"
export function formatarDuracao(minutos) {
  const m = Number(minutos);
  if (!m || m < 0) return "—";
  if (m < 60) return `${m} min`;
  if (m % 1440 === 0) return `${m / 1440} ${m / 1440 === 1 ? "dia" : "dias"}`;
  const h = Math.floor(m / 60);
  const resto = m % 60;
  return resto ? `${h}h ${resto}min` : `${h}h`;
}
