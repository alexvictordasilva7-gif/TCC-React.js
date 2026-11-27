import { useEffect, useMemo, useState } from "react";
import styled from "styled-components";
import {
  History,
  Search,
  FileDown,
  PawPrint,
  Scissors,
  CalendarDays,
  Clock,
  CircleCheck,
  CircleX,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import api from "../../service/api";

/*
  Histórico mensal de serviços (dentro de Relatórios).
    GET /api/relatorios/historico?mes=2026-11&status=&busca=&pagina=0&tamanho=5
    GET /api/relatorios/historico/pdf?mes=2026-11&status=&busca=   (arquivo PDF)
  O mês vem do seletor do topo da tela de Relatórios.
*/

const TAMANHO = 5;

const STATUS = {
  CONCLUIDO: { rotulo: "Concluído", Icone: CircleCheck, fundo: "#dcfce7", texto: "#15803d" },
  CANCELADO: { rotulo: "Cancelado", Icone: CircleX, fundo: "#fee2e2", texto: "#b91c1c" },
};

const moeda = (v) =>
  v == null ? "—" : Number(v).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

// "2026-11" -> "novembro 2026"
function nomeDoMes(mes) {
  const [ano, m] = String(mes).split("-").map(Number);
  if (!ano || !m) return mes;
  const nome = new Date(ano, m - 1, 1).toLocaleDateString("pt-BR", { month: "long" });
  return `${nome} ${ano}`;
}

function mensagemDeErro(erro, padrao) {
  const mensagens = erro?.response?.data?.mensagens;
  if (Array.isArray(mensagens) && mensagens.length) return mensagens.join(" ");
  if (!erro?.response) return "Não foi possível conectar ao servidor.";
  return padrao;
}

// quando o PDF falha, o erro chega como blob: lê o JSON de dentro dele
async function erroDoBlob(erro) {
  const dados = erro?.response?.data;
  if (dados instanceof Blob) {
    try {
      erro.response.data = JSON.parse(await dados.text());
    } catch {
      // não era JSON
    }
  }
  return erro;
}

export default function HistoricoMensal({ mes }) {
  const [status, setStatus] = useState("");
  const [busca, setBusca] = useState("");
  const [buscaAplicada, setBuscaAplicada] = useState("");
  const [pagina, setPagina] = useState(0);

  const [dados, setDados] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");
  const [baixando, setBaixando] = useState(false);

  // trocou o mês no topo da tela: volta para a primeira página
  useEffect(() => {
    setPagina(0);
  }, [mes]);

  // espera o usuário parar de digitar antes de buscar
  useEffect(() => {
    const t = setTimeout(() => {
      const termo = busca.trim();
      if (termo === buscaAplicada) return;
      setBuscaAplicada(termo);
      setPagina(0);
    }, 350);
    return () => clearTimeout(t);
  }, [busca, buscaAplicada]);

  const parametros = useMemo(
    () => ({ mes, ...(status && { status }), ...(buscaAplicada && { busca: buscaAplicada }) }),
    [mes, status, buscaAplicada]
  );

  useEffect(() => {
    let ativo = true;
    setCarregando(true);
    setErro("");
    api
      .get("/api/relatorios/historico", { params: { ...parametros, pagina, tamanho: TAMANHO } })
      .then(({ data }) => ativo && setDados(data))
      .catch((e) => ativo && setErro(mensagemDeErro(e, "Não foi possível carregar o histórico.")))
      .finally(() => ativo && setCarregando(false));
    return () => {
      ativo = false;
    };
  }, [parametros, pagina]);

  async function exportarPdf() {
    setBaixando(true);
    setErro("");
    try {
      // pelo axios, para o token ir junto (um link simples receberia 401)
      const { data } = await api.get("/api/relatorios/historico/pdf", {
        params: parametros,
        responseType: "blob",
      });
      const url = URL.createObjectURL(data);
      const a = document.createElement("a");
      a.href = url;
      a.download = `historico-${mes}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch (e) {
      setErro(mensagemDeErro(await erroDoBlob(e), "Não foi possível gerar o PDF."));
    } finally {
      setBaixando(false);
    }
  }

  const resumo = dados?.resumo ?? { servicoMes: 0, concluidos: 0, cancelados: 0 };
  const linhas = dados?.linhas ?? [];
  const total = dados?.total ?? 0;
  const totalPaginas = Math.max(1, Math.ceil(total / TAMANHO));
  const inicio = total === 0 ? 0 : pagina * TAMANHO + 1;
  const fim = Math.min((pagina + 1) * TAMANHO, total);

  return (
    <Caixa>
      <Topo>
        <div>
          <span className="sobre">
            <History size={14} /> Histórico mensal
          </span>
          <h2>Serviços realizados nos pets</h2>
          <p>Atendimentos consolidados em {nomeDoMes(mes)}.</p>
        </div>

        <Controles>
          <label className="busca">
            <Search size={16} />
            <input
              type="search"
              placeholder="Buscar pet, tutor ou serviço..."
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              aria-label="Buscar pet, tutor ou serviço"
            />
          </label>
          <select
            value={status}
            onChange={(e) => {
              setStatus(e.target.value);
              setPagina(0);
            }}
            aria-label="Filtrar por status"
          >
            <option value="">Todos</option>
            <option value="CONCLUIDO">Concluídos</option>
            <option value="CANCELADO">Cancelados</option>
          </select>
          <button type="button" className="pdf" onClick={exportarPdf} disabled={baixando || total === 0}>
            <FileDown size={15} /> {baixando ? "Gerando..." : "PDF"}
          </button>
        </Controles>
      </Topo>

      <Resumos>
        <Resumo $tipo="neutro">
          <span>Serviços no mês</span>
          <strong>{resumo.servicoMes}</strong>
        </Resumo>
        <Resumo $tipo="azul">
          <span>Concluídos</span>
          <strong>{resumo.concluidos}</strong>
        </Resumo>
        <Resumo $tipo="vermelho">
          <span>Cancelados</span>
          <strong>{resumo.cancelados}</strong>
        </Resumo>
      </Resumos>

      {erro && <Erro role="alert">{erro}</Erro>}

      <Tabela>
        <table>
          <thead>
            <tr>
              <th>Pet e tutor</th>
              <th>Serviço</th>
              <th>Data e hora</th>
              <th>Observação</th>
              <th>Status</th>
              <th className="direita">Valor</th>
            </tr>
          </thead>
          <tbody>
            {carregando && (
              <tr>
                <td colSpan={6} className="vazio">Carregando histórico...</td>
              </tr>
            )}

            {!carregando && linhas.length === 0 && (
              <tr>
                <td colSpan={6} className="vazio">
                  Nenhum atendimento finalizado em {nomeDoMes(mes)}
                  {buscaAplicada && ` para "${buscaAplicada}"`}.
                </td>
              </tr>
            )}

            {!carregando &&
              linhas.map((l) => {
                const st = STATUS[l.status] ?? STATUS.CONCLUIDO;
                const data = new Date(l.dataHora);
                return (
                  <tr key={l.id}>
                    <td>
                      <div className="pet">
                        <span className="icone-pet"><PawPrint size={16} /></span>
                        <div>
                          <strong>{l.pet}</strong>
                          <small>{l.tutor}</small>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className="servico">
                        <Scissors size={15} /> {l.servico}
                      </span>
                    </td>
                    <td>
                      <div className="quando">
                        <span><CalendarDays size={13} /> {data.toLocaleDateString("pt-BR")}</span>
                        <span>
                          <Clock size={13} />{" "}
                          {data.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}
                        </span>
                      </div>
                    </td>
                    <td className="obs">{l.observacao || "—"}</td>
                    <td>
                      <Etiqueta $st={st}>
                        <st.Icone size={13} /> {st.rotulo}
                      </Etiqueta>
                    </td>
                    <td className="direita valor">{moeda(l.valor)}</td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      </Tabela>

      <Rodape>
        <span>
          Exibindo <b>{inicio}–{fim}</b> de <b>{total}</b> serviços
        </span>
        <div className="paginas">
          <button
            type="button"
            onClick={() => setPagina((p) => p - 1)}
            disabled={pagina === 0 || carregando}
            aria-label="Página anterior"
          >
            <ChevronLeft size={16} />
          </button>
          <span>
            Página {Math.min(pagina + 1, totalPaginas)} de {totalPaginas}
          </span>
          <button
            type="button"
            onClick={() => setPagina((p) => p + 1)}
            disabled={pagina + 1 >= totalPaginas || carregando}
            aria-label="Próxima página"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </Rodape>
    </Caixa>
  );
}

/* ===================== estilos ===================== */

const Caixa = styled.section`
  margin-bottom: 16px;
  border-radius: 20px;
  background: var(--ps-superficie);
  border: 1px solid var(--ps-borda);
  box-shadow: var(--ps-sombra);
  color: var(--ps-texto);
  overflow: hidden;
`;

const Topo = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: flex-start;
  gap: 16px;
  padding: 22px 24px 18px;

  .sobre {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: var(--ps-primaria);
  }

  h2 {
    margin: 4px 0 2px;
    font-family: var(--ps-fonte-titulo);
    font-size: 21px;
    font-weight: 800;
  }

  p {
    margin: 0;
    font-size: 13px;
    color: var(--ps-texto-suave);
  }
`;

const Controles = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;

  .busca {
    display: flex;
    align-items: center;
    gap: 8px;
    height: 38px;
    width: 250px;
    margin: 0;
    padding: 0 12px;
    border-radius: 12px;
    border: 1px solid var(--ps-borda);
    background: var(--ps-superficie-2, var(--ps-superficie));
    color: var(--ps-texto-suave);
    cursor: text;

    input {
      flex: 1;
      min-width: 0;
      border: none;
      outline: none;
      background: transparent;
      color: var(--ps-texto);
      font-size: 13px;
    }
  }

  select {
    height: 38px;
    padding: 0 30px 0 12px;
    border-radius: 12px;
    border: 1px solid var(--ps-borda);
    background-color: var(--ps-superficie);
    color: var(--ps-texto);
    font-size: 13px;
    font-weight: 600;
  }

  .pdf {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    height: 38px;
    padding: 0 14px;
    border-radius: 12px;
    border: 1px solid var(--ps-borda);
    background: var(--ps-superficie);
    color: var(--ps-primaria);
    font-size: 13px;
    font-weight: 700;
    transition: background 0.15s ease, border-color 0.15s ease;
  }

  .pdf:hover:not(:disabled) {
    border-color: var(--ps-primaria);
    background: var(--ps-primaria-clara);
  }

  .pdf:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  @media (max-width: 640px) {
    width: 100%;

    .busca {
      width: 100%;
    }
  }
`;

const Resumos = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 12px;
  padding: 0 24px 20px;

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`;

const CORES_RESUMO = {
  neutro: { fundo: "var(--ps-primaria-clara)", valor: "var(--ps-texto)" },
  azul: { fundo: "rgba(29, 91, 240, 0.14)", valor: "var(--ps-primaria)" },
  vermelho: { fundo: "rgba(220, 38, 38, 0.08)", valor: "#dc2626" },
};

const Resumo = styled.div`
  padding: 16px 16px 14px;
  border-radius: 14px;
  background: ${({ $tipo }) => CORES_RESUMO[$tipo].fundo};

  span {
    display: block;
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    color: var(--ps-texto-suave);
  }

  strong {
    display: block;
    margin-top: 6px;
    font-family: var(--ps-fonte-titulo);
    font-size: 22px;
    font-weight: 800;
    color: ${({ $tipo }) => CORES_RESUMO[$tipo].valor};
  }
`;

const Erro = styled.div`
  margin: 0 24px 12px;
  padding: 10px 14px;
  border-radius: 12px;
  background: #fee2e2;
  color: #b91c1c;
  font-size: 13px;
  font-weight: 600;
`;

const Tabela = styled.div`
  overflow-x: auto;

  table {
    width: 100%;
    border-collapse: collapse;
    font-size: 13px;
  }

  th {
    padding: 12px 16px;
    background: var(--ps-primaria-clara);
    border-top: 1px solid var(--ps-borda);
    border-bottom: 1px solid var(--ps-borda);
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: var(--ps-texto-suave);
    text-align: left;
    white-space: nowrap;
  }

  th:first-child,
  td:first-child {
    padding-left: 24px;
  }

  th:last-child,
  td:last-child {
    padding-right: 20px;
  }

  td {
    padding: 14px 16px;
    border-bottom: 1px solid var(--ps-borda);
    vertical-align: middle;
    color: var(--ps-texto);
  }

  tbody tr:last-child td {
    border-bottom: none;
  }

  .direita {
    text-align: right;
  }

  .vazio {
    padding: 36px 16px;
    text-align: center;
    color: var(--ps-texto-suave);
  }

  .pet {
    display: flex;
    align-items: center;
    gap: 12px;
    white-space: nowrap;

    strong {
      display: block;
      font-weight: 700;
    }

    small {
      display: block;
      font-size: 12px;
      color: var(--ps-texto-suave);
    }
  }

  .icone-pet {
    width: 34px;
    height: 34px;
    flex-shrink: 0;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--ps-destaque-clara);
    color: var(--ps-destaque);
  }

  .servico {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    font-weight: 700;
    white-space: nowrap;

    svg {
      color: var(--ps-primaria);
    }
  }

  .quando {
    display: flex;
    flex-direction: column;
    gap: 2px;
    font-size: 12px;
    color: var(--ps-texto-suave);
    white-space: nowrap;

    span {
      display: inline-flex;
      align-items: center;
      gap: 6px;
    }
  }

  .obs {
    min-width: 180px;
    max-width: 260px;
    font-size: 12px;
    color: var(--ps-texto-suave);
  }

  .valor {
    font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
    font-weight: 700;
    color: var(--ps-primaria);
    white-space: nowrap;
  }
`;

const Etiqueta = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 4px 10px;
  border-radius: 999px;
  background: ${({ $st }) => $st.fundo};
  color: ${({ $st }) => $st.texto};
  font-size: 12px;
  font-weight: 700;
  white-space: nowrap;
`;

const Rodape = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
  padding: 14px 20px;
  border-top: 1px solid var(--ps-borda);
  font-size: 12px;
  color: var(--ps-texto-suave);

  b {
    color: var(--ps-texto);
  }

  .paginas {
    display: flex;
    align-items: center;
    gap: 10px;
    font-weight: 700;
    color: var(--ps-texto);
  }

  button {
    width: 34px;
    height: 34px;
    border-radius: 50%;
    border: 1px solid var(--ps-borda);
    background: var(--ps-superficie);
    color: var(--ps-texto);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0;
  }

  button:hover:not(:disabled) {
    border-color: var(--ps-primaria);
    color: var(--ps-primaria);
  }

  button:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }
`;
