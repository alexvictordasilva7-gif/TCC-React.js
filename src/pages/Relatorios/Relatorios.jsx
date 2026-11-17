import * as S from "./Relatorios.Styled";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  LabelList,
} from "recharts";
import CabecalhoPagina from "../../components/CabecalhoPagina/CabecalhoPagina.jsx";
import { useDados } from "../../context/DadosContext";
import { servicosPet } from "../../utils/opcoes";
import api from "../../service/api";
import { PawPrint } from "lucide-react";

// ---------- formatação ----------
const moeda = (v) =>
  Number(v ?? 0).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

const moedaCurta = (v) => {
  const n = Number(v ?? 0);
  if (Math.abs(n) >= 1000) return `R$ ${(n / 1000).toLocaleString("pt-BR", { maximumFractionDigits: 1 })} mil`;
  return `R$ ${n.toLocaleString("pt-BR", { maximumFractionDigits: 0 })}`;
};

const NOMES_MES = [
  "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
  "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro",
];

// "2026-11" -> { ano: 2026, mes: 11 }
const partes = (chave) => {
  const [ano, mes] = chave.split("-").map(Number);
  return { ano, mes };
};
const nomeMes = (chave) => {
  const { ano, mes } = partes(chave);
  return `${NOMES_MES[mes - 1]} ${ano}`;
};
const nomeCurto = (chave) => NOMES_MES[partes(chave).mes - 1];
const mesAnterior = (chave) => {
  const { ano, mes } = partes(chave);
  const d = new Date(ano, mes - 2, 1);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
};
const ultimoDia = (chave) => {
  const { ano, mes } = partes(chave);
  return new Date(ano, mes, 0).getDate();
};
const chaveDaData = (iso) => {
  const d = new Date(iso);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
};

// últimos 3 meses para o seletor (hoje: novembro, outubro e setembro)
const QTD_MESES = 3;
const ultimosMeses = () => {
  const hoje = new Date();
  return Array.from({ length: QTD_MESES }, (_, i) => {
    const d = new Date(hoje.getFullYear(), hoje.getMonth() - i, 1);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
  });
};

const lista = (dados) => dados?.content ?? dados ?? [];

const RAIO_EXTERNO = 92; // raio da rosca de agendamentos

// categorias do filtro de fornecedores (nomes do checklist -> enum do back)
const CATEGORIAS_FORNECEDOR = [
  { valor: "ALIMENTACAO", rotulo: "Ração" },
  { valor: "BRINQUEDOS", rotulo: "Brinquedos" },
  { valor: "MEDICAMENTOS", rotulo: "Remédios" },
  { valor: "HIGIENE", rotulo: "Higiene" },
];

const rotuloServico = (tipo) =>
  servicosPet.find((s) => s.valor === tipo)?.rotulo ?? tipo;

const hojeIso = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
};

// ---------- dica (tooltip) padrão dos gráficos ----------
function DicaGrafico({ active, payload, label, titulo, formato = moeda }) {
  if (!active || !payload?.length) return null;
  return (
    <S.Dica>
      <strong>{titulo ? titulo(label) : label}</strong>
      {payload
        .filter((p) => p.value != null)
        .map((p) => (
          <div key={p.dataKey}>
            <i style={{ background: p.color }}></i>
            {p.name}: <b>{formato(p.value)}</b>
          </div>
        ))}
    </S.Dica>
  );
}

function Relatorios() {
  const { vendas } = useDados();
  const meses = useMemo(ultimosMeses, []);
  // período: um mês ("2026-11") ou "todo"
  const [periodo, setPeriodo] = useState(meses[0]);
  const todo = periodo === "todo";
  // gráficos de comparação usam o mês escolhido (ou o atual, em "Todo o período")
  const mes = todo ? meses[0] : periodo;
  const anterior = mesAnterior(mes);
  const nomePeriodo = todo ? "todo o período" : nomeMes(mes).toLowerCase();

  const [resumoServicos, setResumoServicos] = useState({ receita: 0, quantidade: 0 });
  const [receitaAcumulada, setReceitaAcumulada] = useState({ atual: [], anterior: [] });
  const [servicosPopulares, setServicosPopulares] = useState([]);
  const [clientesPets, setClientesPets] = useState(null);
  const [agendamentos, setAgendamentos] = useState(null);
  const [produtos, setProdutos] = useState([]);
  const [fornecedores, setFornecedores] = useState([]);
  const [consumoMes, setConsumoMes] = useState(0);
  const [categoriaForn, setCategoriaForn] = useState("ALIMENTACAO");
  const [ordemForn, setOrdemForn] = useState("custo");

  // largura da área da rosca: usada para pôr a dica sempre ao lado direito dela
  const roscaRef = useRef(null);
  const [larguraRosca, setLarguraRosca] = useState(0);
  useEffect(() => {
    const el = roscaRef.current;
    if (!el) return;
    const medir = () => setLarguraRosca(el.clientWidth);
    medir();
    const obs = new ResizeObserver(medir);
    obs.observe(el);
    return () => obs.disconnect();
  });

  // ---------- dados que não dependem do mês ----------
  useEffect(() => {
    // agendamentos: sempre o TOTAL de todos os tempos (contagem por status)
    const status = ["CONCLUIDO", "AGENDADO", "CONFIRMADO", "EM_ANDAMENTO", "CANCELADO"];
    Promise.allSettled(
      status.map((s) => api.get(`/api/agendamentos?status=${s}&size=1`)),
    ).then((r) => {
      const total = (i) =>
        r[i].status === "fulfilled" ? Number(r[i].value.data.totalElements ?? 0) : 0;
      setAgendamentos({
        concluidos: total(0),
        agendados: total(1) + total(2) + total(3),
        cancelados: total(4),
      });
    });

    Promise.allSettled([
      api.get("/api/produtos?size=500"),
      api.get("/api/fornecedores?size=200"),
    ]).then(([p, f]) => {
      if (p.status === "fulfilled") setProdutos(lista(p.value.data));
      if (f.status === "fulfilled") setFornecedores(lista(f.value.data));
    });
  }, []);

  // ---------- dados do mês escolhido ----------
  useEffect(() => {
    const inicio = todo ? "2000-01-01" : `${mes}-01`;
    const fim = todo ? hojeIso() : `${mes}-${String(ultimoDia(mes)).padStart(2, "0")}`;

    Promise.allSettled([
      api.get(`/api/dashboard/relatorio?inicio=${inicio}&fim=${fim}`),
      api.get(`/api/relatorios/receita-acumulada?mes=${mes}`),
      api.get(`/api/relatorios/servicos-populares?mes=${mes}&limite=5`),
      api.get(`/api/relatorios/clientes-pets?mes=${mes}`),
    ]).then(([rel, acum, pop, cp]) => {
      if (rel.status === "fulfilled") {
        setResumoServicos({
          receita: Number(rel.value.data.receitaTotal ?? 0),
          quantidade: Number(rel.value.data.totalServicos ?? 0),
        });
        // "Todo o período": ranking de serviços vem do resumo (todos os meses)
        if (todo) {
          setServicosPopulares(
            (rel.value.data.servicoPorTipo ?? [])
              .map((t) => ({
                servico: rotuloServico(t.tipo),
                quantidade: Number(t.quantidade),
                receita: Number(t.receita),
              }))
              .sort((a, b) => b.quantidade - a.quantidade)
              .slice(0, 5),
          );
        }
      } else {
        console.error("Erro no resumo do mês:", rel.reason);
      }
      if (acum.status === "fulfilled") {
        setReceitaAcumulada({
          atual: acum.value.data.mesSelecionado ?? [],
          anterior: acum.value.data.mesAnterior ?? [],
        });
      }
      if (!todo && pop.status === "fulfilled") setServicosPopulares(pop.value.data ?? []);
      if (cp.status === "fulfilled") setClientesPets(cp.value.data);
    });
  }, [periodo]);

  // consumo interno do mês: SAÍDAS dos produtos de uso interno × preço de custo
  useEffect(() => {
    const internos = produtos.filter((p) => !p.revenda);
    if (internos.length === 0) {
      setConsumoMes(0);
      return;
    }
    Promise.allSettled(
      internos.map((p) => api.get(`/api/movimentacoes/produto/${p.id}?size=500`)),
    ).then((r) => {
      let total = 0;
      r.forEach((res, i) => {
        if (res.status !== "fulfilled") return;
        lista(res.value.data)
          .filter(
            (m) => m.tipo === "SAIDA" && (todo || chaveDaData(m.dataMovimentacao) === mes),
          )
          .forEach((m) => {
            total += Number(m.quantidade) * Number(internos[i].precoCusto ?? 0);
          });
      });
      setConsumoMes(total);
    });
  }, [produtos, periodo]);

  // ---------- contas ----------
  const vendasMes = vendas.filter((v) => chaveDaData(v.dataHora) === mes);
  const vendasPeriodo = todo ? vendas : vendasMes;
  const vendasAnterior = vendas.filter((v) => chaveDaData(v.dataHora) === anterior);

  const receitaVendas = vendasPeriodo.reduce((s, v) => s + Number(v.total ?? 0), 0);
  const receita = resumoServicos.receita + receitaVendas;
  const atendimentos = resumoServicos.quantidade + vendasPeriodo.length;
  const ticketMedio = atendimentos > 0 ? receita / atendimentos : 0;

  const custoVendidos = vendasPeriodo.reduce((s, v) => s + Number(v.custo ?? 0), 0);
  const gastos = custoVendidos + consumoMes;
  const lucro = receita - gastos;

  // receita acumulada: junta os dois meses por dia
  const dadosReceita = useMemo(() => {
    const dias = Math.max(31, receitaAcumulada.anterior.length);
    return Array.from({ length: dias }, (_, i) => ({
      dia: i + 1,
      atual: receitaAcumulada.atual[i] ? Number(receitaAcumulada.atual[i].acumulado) : null,
      anterior: receitaAcumulada.anterior[i] ? Number(receitaAcumulada.anterior[i].acumulado) : null,
    }));
  }, [receitaAcumulada]);

  // produtos mais vendidos (vendas registradas no sistema)
  const dadosProdutos = useMemo(() => {
    const somar = (lista) => {
      const mapa = {};
      lista.forEach((v) =>
        (v.produtos ?? []).forEach((p) => {
          mapa[p.nome] = (mapa[p.nome] ?? 0) + Number(p.quantidade);
        }),
      );
      return mapa;
    };
    const atual = somar(vendasMes);
    const ant = somar(vendasAnterior);
    return [...new Set([...Object.keys(atual), ...Object.keys(ant)])]
      .map((nome) => ({ nome, atual: atual[nome] ?? 0, anterior: ant[nome] ?? 0 }))
      .sort((a, b) => b.atual - a.atual || b.anterior - a.anterior)
      .slice(0, 6);
  }, [vendasMes, vendasAnterior]);

  // agendamentos (sempre o total)
  const fatias = agendamentos
    ? [
        { nome: "Concluídos", valor: agendamentos.concluidos, cor: "var(--status-ok)" },
        { nome: "Agendados", valor: agendamentos.agendados, cor: "var(--status-pendente)" },
        { nome: "Cancelados", valor: agendamentos.cancelados, cor: "var(--status-erro)" },
      ]
    : [];
  const totalAgendamentos = fatias.reduce((s, f) => s + f.valor, 0);
  const pct = (v) => (totalAgendamentos ? Math.round((v / totalAgendamentos) * 100) : 0);

  // serviços populares
  const maiorServico = Math.max(1, ...servicosPopulares.map((s) => Number(s.quantidade)));

  // melhores fornecedores: custo médio dos produtos de cada um
  const rankingFornecedores = useMemo(() => {
    return fornecedores
      .filter((f) => f.categoria === categoriaForn)
      .map((f) => {
        const doFornecedor = produtos.filter(
          (p) => String(p.fornecedorId) === String(f.id) && p.precoCusto != null,
        );
        const custoMedio = doFornecedor.length
          ? doFornecedor.reduce((s, p) => s + Number(p.precoCusto), 0) / doFornecedor.length
          : null;
        return {
          id: f.id,
          nome: f.nomeFantasia || f.razaoSocial || f.nome,
          produtos: doFornecedor.length,
          custoMedio,
          // nota_avaliacao (1 a 5) ainda não existe no back; aparece quando existir
          nota: f.notaAvaliacao ?? null,
        };
      })
      .filter((f) => f.produtos > 0)
      .sort((a, b) =>
        ordemForn === "nota"
          ? (b.nota ?? 0) - (a.nota ?? 0)
          : a.custoMedio - b.custoMedio,
      )
      .slice(0, 5);
  }, [fornecedores, produtos, categoriaForn, ordemForn]);

  const temNota = fornecedores.some((f) => f.notaAvaliacao != null);

  const eixo = { fontSize: 12, fill: "var(--ps-texto-suave)" };

  return (
    <S.Pagina className="ps-tema">
      <CabecalhoPagina
        sobre="Relatórios"
        icone="bar-chart-line"
        titulo="Relatórios"
        subtitulo="Análise estratégica do pet shop, mês a mês."
        acao={
          <S.SeletorMes
            value={periodo}
            onChange={(e) => setPeriodo(e.target.value)}
            aria-label="Período do relatório"
          >
            {meses.map((m) => (
              <option key={m} value={m}>
                {nomeMes(m)}
              </option>
            ))}
            <option value="todo">Todo o período</option>
          </S.SeletorMes>
        }
      />

      {/* ===== KPIs ===== */}
      <S.GradeKpi>
        <S.Kpi $cor="var(--ps-primaria)" $fundo="var(--ps-primaria-clara)">
          <span className="icone"><i className="bi bi-currency-dollar"></i></span>
          <span className="rotulo">Receita total</span>
          <span className="valor">{moeda(receita)}</span>
          <small>Serviços e vendas · {nomePeriodo}</small>
        </S.Kpi>
        <S.Kpi $cor="#6a5cf5" $fundo="rgba(106, 92, 245, 0.14)">
          <span className="icone"><i className="bi bi-receipt"></i></span>
          <span className="rotulo">Ticket médio</span>
          <span className="valor">{moeda(ticketMedio)}</span>
          <small>Valor médio por atendimento ou venda</small>
        </S.Kpi>
        <S.Kpi $cor="#b7791f" $fundo="rgba(232, 160, 26, 0.18)">
          <span className="icone"><i className="bi bi-wallet2"></i></span>
          <span className="rotulo">Total de gastos</span>
          <span className="valor">{moeda(gastos)}</span>
          <small>Produtos vendidos e usados</small>
        </S.Kpi>
        <S.Kpi $cor="var(--status-ok)" $fundo="rgba(25, 135, 84, 0.14)">
          <span className="icone"><i className="bi bi-graph-up-arrow"></i></span>
          <span className="rotulo">Lucro real (líquido)</span>
          <span className="valor">{moeda(lucro)}</span>
          <small>Receita menos os gastos registrados</small>
        </S.Kpi>
      </S.GradeKpi>

      {/* ===== conta do lucro ===== */}
      <S.Conta>
        <S.ItemConta>
          <span>Receita</span>
          <strong>{moeda(receita)}</strong>
        </S.ItemConta>
        <S.ItemConta $tipo="saida">
          <span>Produtos vendidos</span>
          <strong>− {moeda(custoVendidos)}</strong>
        </S.ItemConta>
        <S.ItemConta $tipo="saida">
          <span>Usados nos serviços</span>
          <strong>− {moeda(consumoMes)}</strong>
        </S.ItemConta>
        <S.ItemConta $tipo="vazio" title="Ainda não há cadastro de despesas fixas no sistema">
          <span>Despesas fixas</span>
          <strong>Não cadastrado</strong>
        </S.ItemConta>
        <S.ItemConta $tipo="vazio" title="Ainda não há cadastro de taxas no sistema">
          <span>Taxas</span>
          <strong>Não cadastrado</strong>
        </S.ItemConta>
        <S.ItemConta $tipo="resultado">
          <span>= Lucro real</span>
          <strong>{moeda(lucro)}</strong>
        </S.ItemConta>
      </S.Conta>

      {/* ===== receita acumulada + agendamentos ===== */}
      <S.GradePaineis>
        <S.Painel>
          <div className="cabecalho">
            <div>
              <h2>Receita acumulada no mês</h2>
              <p className="sub">
                Serviços concluídos · {nomeCurto(mes)} x {nomeCurto(anterior)}
              </p>
            </div>
          </div>
          <div className="corpo" style={{ overflow: "hidden" }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={dadosReceita} margin={{ top: 10, right: 16, left: 4, bottom: 0 }}>
                <CartesianGrid stroke="var(--grade)" vertical={false} />
                <XAxis dataKey="dia" tick={eixo} tickLine={false} axisLine={false} ticks={[1, 6, 11, 16, 21, 26, 31]} />
                <YAxis tick={eixo} tickLine={false} axisLine={false} tickFormatter={moedaCurta} width={78} />
                <Tooltip
                  content={<DicaGrafico titulo={(d) => `Dia ${d}`} />}
                  cursor={{ stroke: "var(--ps-texto-suave)", strokeDasharray: "3 3" }}
                />
                <Line
                  type="monotone"
                  dataKey="anterior"
                  name={nomeCurto(anterior)}
                  stroke="var(--serie-anterior)"
                  strokeWidth={2}
                  strokeDasharray="5 4"
                  dot={false}
                  connectNulls={false}
                />
                <Line
                  type="monotone"
                  dataKey="atual"
                  name={nomeCurto(mes)}
                  stroke="var(--serie-atual)"
                  strokeWidth={2.5}
                  dot={false}
                  activeDot={{ r: 5 }}
                  connectNulls={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <S.Legenda>
            <span><i style={{ background: "var(--serie-anterior)" }}></i>{nomeCurto(anterior)}</span>
            <span><i style={{ background: "var(--serie-atual)" }}></i>{nomeCurto(mes)}</span>
          </S.Legenda>
        </S.Painel>

        <S.Painel>
          <div className="cabecalho">
            <div>
              <h2>Agendamentos</h2>
              <p className="sub">Total de todos os períodos</p>
            </div>
          </div>
          <div className="corpo" style={{ overflow: "hidden" }}>
            {totalAgendamentos === 0 ? (
              <S.Vazio>Nenhum agendamento registrado.</S.Vazio>
            ) : (
              <>
                <S.Rosca ref={roscaRef}>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={fatias}
                        dataKey="valor"
                        nameKey="nome"
                        innerRadius={62}
                        outerRadius={RAIO_EXTERNO}
                        paddingAngle={1.5}
                        stroke="var(--ps-superficie)"
                        strokeWidth={2}
                        startAngle={90}
                        endAngle={-270}
                      >
                        {fatias.map((f) => (
                          <Cell key={f.nome} fill={f.cor} />
                        ))}
                      </Pie>
                      {/* a dica fica sempre ao lado direito da rosca, sem cobrir o total do meio */}
                      <Tooltip
                        position={{ x: larguraRosca / 2 + RAIO_EXTERNO + 14, y: 70 }}
                        wrapperStyle={{ pointerEvents: "none", zIndex: 2 }}
                        content={({ active, payload }) =>
                          active && payload?.length ? (
                            <S.Dica>
                              <strong>{payload[0].name}</strong>
                              {payload[0].value} · {pct(payload[0].value)}%
                            </S.Dica>
                          ) : null
                        }
                      />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="centro">
                    <strong>{totalAgendamentos}</strong>
                    <span>agendamentos</span>
                  </div>
                </S.Rosca>

                <S.ListaStatus>
                  {fatias.map((f) => (
                    <li key={f.nome}>
                      <span className="nome">
                        <span className="bolinha" style={{ background: f.cor }}></span>
                        {f.nome}
                      </span>
                      <span className="num">
                        <b>{f.valor}</b> · {pct(f.valor)}%
                      </span>
                    </li>
                  ))}
                </S.ListaStatus>
              </>
            )}
          </div>
        </S.Painel>
      </S.GradePaineis>

      {/* ===== produtos mais vendidos + serviços populares ===== */}
      <S.GradePaineis>
        <S.Painel>
          <div className="cabecalho">
            <div>
              <h2>Produtos mais vendidos</h2>
              <p className="sub">
                Unidades vendidas · {nomeCurto(mes)} x {nomeCurto(anterior)}
              </p>
            </div>
          </div>
          <div className="corpo" style={{ overflow: "hidden" }}>
            {dadosProdutos.length === 0 ? (
              <S.Vazio>Nenhuma venda de produto nestes dois meses.</S.Vazio>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={dadosProdutos}
                  layout="vertical"
                  margin={{ top: 0, right: 36, left: 0, bottom: 0 }}
                  barGap={2}
                  barCategoryGap="22%"
                  maxBarSize={18}
                >
                  <CartesianGrid stroke="var(--grade)" horizontal={false} />
                  <XAxis type="number" tick={eixo} tickLine={false} axisLine={false} allowDecimals={false} />
                  <YAxis
                    type="category"
                    dataKey="nome"
                    tick={eixo}
                    tickLine={false}
                    axisLine={false}
                    width={130}
                  />
                  <Tooltip
                    content={<DicaGrafico formato={(v) => `${v} un.`} />}
                    cursor={{ fill: "var(--ps-primaria-clara)" }}
                  />
                  <Bar dataKey="atual" name={nomeCurto(mes)} fill="var(--serie-atual)" radius={[0, 4, 4, 0]}>
                    <LabelList dataKey="atual" position="right" style={{ fontSize: 12, fill: "var(--ps-texto)" }} />
                  </Bar>
                  <Bar dataKey="anterior" name={nomeCurto(anterior)} fill="var(--serie-anterior)" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
          <S.Legenda>
            <span><i style={{ background: "var(--serie-atual)" }}></i>{nomeCurto(mes)}</span>
            <span><i style={{ background: "var(--serie-anterior)" }}></i>{nomeCurto(anterior)}</span>
          </S.Legenda>
        </S.Painel>

        <S.Painel>
          <div className="cabecalho">
            <div>
              <h2>Serviços populares</h2>
              <p className="sub">Quantidade realizada e receita · {nomePeriodo}</p>
            </div>
          </div>
          <div className="corpo">
            {servicosPopulares.length === 0 ? (
              <S.Vazio>Nenhum serviço concluído neste mês.</S.Vazio>
            ) : (
              <S.Ranking>
                {servicosPopulares.map((s, i) => (
                  <li key={s.servico}>
                    <div className="linha">
                      <span>
                        <span className="pos">{i + 1}º</span>
                        {s.servico}
                      </span>
                      <span className="num">
                        <b>{s.quantidade}</b> realizados · {moeda(s.receita)}
                      </span>
                    </div>
                    <div className="trilho">
                      <div
                        className="barra"
                        style={{ width: `${(Number(s.quantidade) / maiorServico) * 100}%` }}
                      ></div>
                    </div>
                  </li>
                ))}
              </S.Ranking>
            )}
          </div>
        </S.Painel>
      </S.GradePaineis>

      {/* ===== clientes e pets + fornecedores ===== */}
      <S.GradePaineis>
        <S.Painel>
          <div className="cabecalho">
            <div>
              <h2>Clientes e pets</h2>
              <p className="sub">
                {todo ? "Total da base" : `Total da base e novos cadastros em ${nomeCurto(mes).toLowerCase()}`}
              </p>
            </div>
          </div>
          <div className="corpo">
            <S.CardBase $cor="#6a5cf5">
              <span className="icone"><i className="bi bi-people"></i></span>
              <div className="texto">
                <span>Clientes na base</span>
                <strong>{clientesPets?.clientes?.total ?? "—"}</strong>
              </div>
              {!todo && (
                <div className="novos">
                  <strong>+{clientesPets?.clientes?.novos ?? 0}</strong>
                  <span>em {nomeCurto(mes).toLowerCase()}</span>
                </div>
              )}
            </S.CardBase>
            <S.CardBase $cor="var(--status-ok)">
              <span className="icone"><PawPrint size={20} /></span>
              <div className="texto">
                <span>Pets na base</span>
                <strong>{clientesPets?.pets?.total ?? "—"}</strong>
              </div>
              {!todo && (
                <div className="novos">
                  <strong>+{clientesPets?.pets?.novos ?? 0}</strong>
                  <span>em {nomeCurto(mes).toLowerCase()}</span>
                </div>
              )}
            </S.CardBase>
          </div>
        </S.Painel>

        <S.Painel>
          <div className="cabecalho">
            <div>
              <h2>Melhores fornecedores</h2>
              <p className="sub">Custo médio dos produtos de cada fornecedor</p>
            </div>
            <S.SeletorPequeno
              value={ordemForn}
              onChange={(e) => setOrdemForn(e.target.value)}
              aria-label="Ordenar fornecedores"
            >
              <option value="custo">Menor custo médio</option>
              {/* só aparece quando o back devolver a nota do fornecedor */}
              {temNota && <option value="nota">Melhor avaliação</option>}
            </S.SeletorPequeno>
          </div>
          <S.Chips>
            {CATEGORIAS_FORNECEDOR.map((c) => (
              <S.Chip
                key={c.valor}
                type="button"
                $ativo={categoriaForn === c.valor}
                onClick={() => setCategoriaForn(c.valor)}
              >
                {c.rotulo}
              </S.Chip>
            ))}
          </S.Chips>
          <div className="corpo">
            {rankingFornecedores.length === 0 ? (
              <S.Vazio>Nenhum fornecedor com produtos nesta categoria.</S.Vazio>
            ) : (
              rankingFornecedores.map((f, i) => (
                <S.LinhaFornecedor key={f.id} $primeiro={i === 0}>
                  <span className="pos">{i + 1}</span>
                  <span className="nome">
                    {f.nome}
                    <small>{f.produtos} produto(s)</small>
                  </span>
                  {f.nota != null && (
                    <span className="nota">
                      <i className="bi bi-star-fill"></i> {Number(f.nota).toFixed(1).replace(".", ",")}
                    </span>
                  )}
                  <span className="custo">
                    <span>custo médio</span>
                    <strong>{moeda(f.custoMedio)}</strong>
                  </span>
                </S.LinhaFornecedor>
              ))
            )}
          </div>
        </S.Painel>
      </S.GradePaineis>
    </S.Pagina>
  );
}

export default Relatorios;
