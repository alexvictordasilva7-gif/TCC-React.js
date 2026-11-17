import * as S from "./Vendas.Styled";
import { useEffect, useState } from "react";
import CabecalhoPagina from "../../components/CabecalhoPagina/CabecalhoPagina.jsx";
import CardResumo from "../../components/Cards/CardResumo.jsx";
import Input from "../../components/Input/Input.jsx";
import Select from "../../components/Select/Select.jsx";
import { useDados } from "../../context/DadosContext";
import { categoriasProduto, formasPagamento } from "../../utils/opcoes";
import { alerta } from "../../utils/Alertas";
import api from "../../service/api";

const moeda = (v) =>
  Number(v ?? 0).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

const rotuloCategoria = (valor) =>
  categoriasProduto.find((c) => c.valor === valor)?.rotulo ?? valor;

const rotuloPagamento = (valor) =>
  formasPagamento.find((f) => f.valor === valor)?.rotulo ?? valor;

const formatarHora = (iso) =>
  new Date(iso).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });

const ehHoje = (iso) =>
  new Date(iso).toDateString() === new Date().toDateString();

function Vendas() {
  const { vendas, setVendas } = useDados();
  const [produtos, setProdutos] = useState([]);
  const [busca, setBusca] = useState("");
  const [filtroAtivo, setFiltroAtivo] = useState("todos");
  const [carrinho, setCarrinho] = useState([]); // [{ id, nome, preco, quantidade, saldo }]
  const [carrinhoAberto, setCarrinhoAberto] = useState(false);
  // cliente é texto livre: qualquer pessoa pode comprar, cadastrada ou não
  const [nomeCliente, setNomeCliente] = useState("");
  const [clientes, setClientes] = useState([]); // [{ id, nome }] só para sugestões
  const [pagamento, setPagamento] = useState("PIX");
  const [finalizando, setFinalizando] = useState(false);
  const [custos, setCustos] = useState({}); // { [produtoId]: precoCusto } para o relatório

  // GET /api/vendas/produtos -> só produtos com "revenda" marcado no Estoque
  async function carregarProdutos() {
    try {
      const resposta = await api.get("/api/vendas/produtos");
      setProdutos(resposta.data ?? []);
    } catch (erro) {
      console.error("Erro ao carregar produtos para venda:", erro);
      alerta.erro("Não foi possível carregar os produtos para venda.");
    }
  }

  // GET /api/vendas/hoje -> quantidade, total e lista das vendas do dia (do banco)
  const [hojeBack, setHojeBack] = useState(null); // null = rota indisponível
  async function carregarVendasHoje() {
    try {
      const resposta = await api.get("/api/vendas/hoje");
      setHojeBack(resposta.data);
    } catch (erro) {
      console.error("Erro ao carregar as vendas de hoje:", erro);
      setHojeBack(null);
    }
  }

  useEffect(() => {
    carregarProdutos();
    carregarVendasHoje();
    // o custo não vem em /api/vendas/produtos; busca na lista de produtos
    api
      .get("/api/produtos?size=500")
      .then((r) => {
        const mapa = {};
        (r.data.content ?? r.data ?? []).forEach((p) => {
          mapa[p.id] = Number(p.precoCusto ?? 0);
        });
        setCustos(mapa);
      })
      .catch(() => {});

    // clientes para o carrinho (opcional): o back recebe o id do tutor
    api
      .get("/api/tutores?size=200")
      .then((r) =>
        setClientes(
          (r.data.content ?? r.data ?? [])
            .map((t) => ({ id: t.id, nome: t.nome }))
            .sort((a, b) => a.nome.localeCompare(b.nome)),
        ),
      )
      .catch(() => {});
  }, []);

  // ---------- resumo ----------
  // vendas de hoje: vêm do banco; se a rota falhar, usa o histórico do navegador
  const vendasHoje = hojeBack
    ? hojeBack.vendas.map((v) => ({
        numero: v.id,
        cliente: v.cliente,
        hora: String(v.hora ?? "").slice(0, 5),
        pagamento: v.formaPagamento,
        itens: v.itens.reduce((soma, i) => soma + i.quantidade, 0),
        total: Number(v.total),
      }))
    : vendas
        .filter((v) => ehHoje(v.dataHora))
        .reverse()
        .map((v) => ({ ...v, hora: formatarHora(v.dataHora) }));

  const faturamentoHoje = hojeBack
    ? Number(hojeBack.totalVendido)
    : vendasHoje.reduce((soma, v) => soma + v.total, 0);
  const quantidadeHoje = hojeBack ? Number(hojeBack.quantidade) : vendasHoje.length;
  const itensVendidos = vendasHoje.reduce((soma, v) => soma + v.itens, 0);

  // ---------- filtro e busca ----------
  const semAcento = (t) =>
    String(t ?? "")
      .normalize("NFD")
      .replace(/[̀-ͯ]/g, "")
      .toLowerCase();

  const visiveis = produtos.filter((p) => {
    const passaFiltro = filtroAtivo === "todos" || p.categoria === filtroAtivo;
    const passaBusca = semAcento(p.nome).includes(semAcento(busca));
    return passaFiltro && passaBusca;
  });

  // ---------- carrinho ----------
  const qtdNoCarrinho = (id) =>
    carrinho.find((i) => i.id === id)?.quantidade ?? 0;

  function adicionar(produto) {
    // regra: não vender mais do que o saldo disponível
    if (qtdNoCarrinho(produto.id) >= produto.saldo) {
      alerta.aviso(`Só há ${produto.saldo} unidade(s) de "${produto.nome}".`);
      return;
    }

    setCarrinho((atual) => {
      const existe = atual.find((i) => i.id === produto.id);
      if (existe) {
        return atual.map((i) =>
          i.id === produto.id ? { ...i, quantidade: i.quantidade + 1 } : i,
        );
      }
      return [
        ...atual,
        {
          id: produto.id,
          nome: produto.nome,
          preco: Number(produto.preco),
          saldo: produto.saldo,
          quantidade: 1,
        },
      ];
    });
  }

  function diminuir(id) {
    setCarrinho((atual) =>
      atual
        .map((i) => (i.id === id ? { ...i, quantidade: i.quantidade - 1 } : i))
        .filter((i) => i.quantidade > 0),
    );
  }

  function remover(id) {
    setCarrinho((atual) => atual.filter((i) => i.id !== id));
  }

  const totalCarrinho = carrinho.reduce(
    (soma, i) => soma + i.preco * i.quantidade,
    0,
  );
  const unidadesCarrinho = carrinho.reduce((soma, i) => soma + i.quantidade, 0);

  // ---------- cliente ----------
  const normalizarNome = (t) =>
    String(t ?? "")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .trim()
      .toLowerCase();
  const clienteEncontrado = nomeCliente.trim()
    ? clientes.find((c) => normalizarNome(c.nome) === normalizarNome(nomeCliente))
    : null;

  // ---------- finalizar ----------
  async function finalizarVenda() {
    if (carrinho.length === 0) {
      alerta.aviso("Adicione pelo menos um produto ao carrinho.");
      return;
    }
    if (!pagamento) {
      alerta.aviso("Escolha a forma de pagamento.");
      return;
    }

    setFinalizando(true);
    try {
      // Uma chamada só: o back confere o saldo, baixa o estoque, registra as
      // SAÍDAS e salva a venda. Se um item falhar, nada é gravado.
      const resposta = await api.post("/api/vendas", {
        // o back só guarda o cliente pelo id: nome cadastrado -> vincula; senão -> "Balcão"
        tutorId: clienteEncontrado?.id ?? null,
        formaPagamento: pagamento,
        itens: carrinho.map((i) => ({ produtoId: i.id, quantidade: i.quantidade })),
      });
      const venda = resposta.data;

      // Histórico na tela e nos Relatórios.
      // TODO: ler de GET /api/vendas quando o back tiver essa rota.
      const numero = venda.id;
      setVendas((atuais) => [
        ...atuais,
        {
          numero,
          cliente: venda.cliente,
          dataHora: venda.dataHora ?? new Date().toISOString(),
          pagamento: venda.formaPagamento,
          itens: venda.itens.reduce((soma, i) => soma + i.quantidade, 0),
          total: Number(venda.total),
          // usados no Relatório (custo dos produtos vendidos e mais vendidos)
          custo: venda.itens.reduce(
            (soma, i) => soma + (custos[i.produtoId] ?? 0) * i.quantidade,
            0,
          ),
          produtos: venda.itens.map((i) => ({
            id: i.produtoId,
            nome: i.produto,
            quantidade: i.quantidade,
          })),
        },
      ]);

      alerta.sucesso(`Venda #${String(numero).padStart(4, "0")} finalizada!`);
      setCarrinho([]);
      setNomeCliente("");
      setPagamento("PIX");
      setCarrinhoAberto(false);
    } catch (erro) {
      console.error("Erro ao finalizar venda:", erro.response?.data ?? erro);
      const mensagens = erro.response?.data?.mensagens;
      // ex.: "Saldo insuficiente para Ração (disponível: 2)."
      alerta.erro(
        Array.isArray(mensagens)
          ? mensagens.join("\n")
          : erro.response?.data?.mensagem ??
              erro.response?.data?.erro ??
              "Não foi possível finalizar a venda.",
      );
    } finally {
      setFinalizando(false);
      carregarProdutos(); // atualiza o saldo mostrado nos cards
      carregarVendasHoje(); // atualiza os cards e a tabela do dia
    }
  }

  return (
    <div className="ps-tema">
      <CabecalhoPagina
        sobre="Ponto de venda"
        icone="cart3"
        titulo="Vendas"
        subtitulo="Venda produtos ao cliente e atualize o estoque automaticamente."
        acao={
          <S.BotaoCarrinho type="button" onClick={() => setCarrinhoAberto(true)}>
            <i className="bi bi-cart3"></i> Ver carrinho
            {unidadesCarrinho > 0 && (
              <span className="contador">{unidadesCarrinho}</span>
            )}
          </S.BotaoCarrinho>
        }
      />

      {/* cards de resumo */}
      <div className="row g-3 mb-3">
        <div className="col-md-4">
          <CardResumo tema titulo="Faturamento de hoje" valor={moeda(faturamentoHoje)} />
        </div>
        <div className="col-md-4">
          <CardResumo tema titulo="Vendas de hoje" valor={quantidadeHoje} />
        </div>
        <div className="col-md-4">
          <CardResumo tema titulo="Itens vendidos hoje" valor={itensVendidos} />
        </div>
      </div>

      {/* busca + categorias */}
      <S.CaixaBusca>
        <S.CampoBusca>
          <i className="bi bi-search text-secondary"></i>
          <input
            type="search"
            placeholder="Buscar produto para vender..."
            aria-label="Buscar produto para vender"
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
          />
        </S.CampoBusca>

        <S.Chips>
          <S.Chip
            type="button"
            $ativo={filtroAtivo === "todos"}
            onClick={() => setFiltroAtivo("todos")}
          >
            Todos
          </S.Chip>
          {categoriasProduto.map((c) => (
            <S.Chip
              key={c.valor}
              type="button"
              $ativo={filtroAtivo === c.valor}
              onClick={() => setFiltroAtivo(c.valor)}
            >
              {c.rotulo}
            </S.Chip>
          ))}
        </S.Chips>
      </S.CaixaBusca>

      {/* produtos */}
      {visiveis.length === 0 ? (
        <S.Vazio>
          Nenhum produto à venda. No Estoque, deixe desligada a opção
          "Item de uso interno".
        </S.Vazio>
      ) : (
        <S.Grade>
          {visiveis.map((p) => {
            const esgotado = p.situacao === "ESGOTADO";
            const disponivel = p.saldo - qtdNoCarrinho(p.id);
            return (
              <S.CardProduto key={p.id} $esgotado={esgotado}>
                <div className="imagem">
                  <i className="bi bi-box-seam"></i>
                </div>
                <div className="corpo">
                  <span className="categoria">{rotuloCategoria(p.categoria)}</span>
                  <h3>{p.nome}</h3>
                  <div className="rodape">
                    <div>
                      <span className="preco">{moeda(p.preco)}</span>
                      <small className={p.situacao === "ESTOQUE_BAIXO" ? "baixo" : ""}>
                        {esgotado ? "Esgotado" : `${disponivel} disponíveis`}
                      </small>
                    </div>
                    <S.BotaoMais
                      type="button"
                      onClick={() => adicionar(p)}
                      disabled={disponivel <= 0}
                      aria-label={`Adicionar ${p.nome} ao carrinho`}
                    >
                      <i className="bi bi-plus-lg"></i>
                    </S.BotaoMais>
                  </div>
                </div>
              </S.CardProduto>
            );
          })}
        </S.Grade>
      )}

      {/* últimas vendas */}
      <S.CaixaTabela>
        <h2>Vendas de hoje</h2>
        {vendasHoje.length === 0 ? (
          <S.Vazio>Nenhuma venda registrada hoje.</S.Vazio>
        ) : (
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>Venda</th>
                  <th>Cliente</th>
                  <th>Hora</th>
                  <th>Pagamento</th>
                  <th>Itens</th>
                  <th className="direita">Total</th>
                </tr>
              </thead>
              <tbody>
                {vendasHoje.map((v) => (
                  <tr key={`${v.numero}-${v.hora}`}>
                    <td className="numero">#{String(v.numero).padStart(4, "0")}</td>
                    <td className="fw-semibold">{v.cliente}</td>
                    <td>{v.hora}</td>
                    <td>{rotuloPagamento(v.pagamento)}</td>
                    <td>{v.itens}</td>
                    <td className="direita numero">{moeda(v.total)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </S.CaixaTabela>

      {/* carrinho */}
      {carrinhoAberto && (
        <>
          <S.Fundo onClick={() => setCarrinhoAberto(false)} />
          <S.Painel role="dialog" aria-label="Carrinho">
            <div className="topo">
              <div>
                <span className="sobre">Venda atual</span>
                <h2>Carrinho</h2>
              </div>
              <button
                type="button"
                className="fechar"
                onClick={() => setCarrinhoAberto(false)}
                aria-label="Fechar carrinho"
              >
                <i className="bi bi-x-lg"></i>
              </button>
            </div>

            <div className="itens">
              {carrinho.length === 0 && (
                <S.Vazio>O carrinho está vazio.</S.Vazio>
              )}

              {carrinho.map((item) => (
                <S.ItemCarrinho key={item.id}>
                  <div>
                    <strong>{item.nome}</strong>
                    <small>
                      {item.quantidade} × {moeda(item.preco)}
                    </small>
                  </div>
                  <div className="qtd">
                    <button type="button" onClick={() => diminuir(item.id)} aria-label="Diminuir">
                      −
                    </button>
                    <span>{item.quantidade}</span>
                    <button
                      type="button"
                      onClick={() => adicionar(produtos.find((p) => p.id === item.id) ?? item)}
                      aria-label="Aumentar"
                    >
                      +
                    </button>
                    <button
                      type="button"
                      className="lixeira"
                      onClick={() => remover(item.id)}
                      aria-label={`Remover ${item.nome}`}
                    >
                      <i className="bi bi-trash"></i>
                    </button>
                  </div>
                </S.ItemCarrinho>
              ))}

              <div className="mt-3">
                <Input
                  texto="Cliente (opcional)"
                  valor={nomeCliente}
                  onChange={(e) => setNomeCliente(e.target.value)}
                  placeholder="Nome do cliente"
                  obrigatorio={false}
                  list="clientes-cadastrados"
                  autoComplete="off"
                />
                {/* sugestões enquanto digita; dá para escrever qualquer nome */}
                <datalist id="clientes-cadastrados">
                  {clientes.map((c) => (
                    <option key={c.id} value={c.nome} />
                  ))}
                </datalist>
                {nomeCliente.trim() && (
                  <S.AvisoCliente $cadastrado={Boolean(clienteEncontrado)}>
                    {clienteEncontrado ? (
                      <>
                        <i className="bi bi-check-circle-fill"></i> Cliente cadastrado: a
                        venda fica vinculada a ele.
                      </>
                    ) : (
                      <>
                        <i className="bi bi-info-circle"></i> Não cadastrado: a venda será
                        registrada como "Balcão".
                      </>
                    )}
                  </S.AvisoCliente>
                )}
              </div>

              <div className="mt-3">
                <Select
                  texto="Forma de pagamento"
                  valor={pagamento}
                  onChange={(e) => setPagamento(e.target.value)}
                  opcoes={formasPagamento}
                  placeholder="Escolha..."
                />
              </div>
            </div>

            <div className="total">
              <span>Total</span>
              <strong>{moeda(totalCarrinho)}</strong>
            </div>

            <S.BotaoFinalizar
              type="button"
              onClick={finalizarVenda}
              disabled={finalizando || carrinho.length === 0}
            >
              <i className="bi bi-check-lg me-1"></i>
              {finalizando ? "Finalizando..." : "Finalizar venda"}
            </S.BotaoFinalizar>
            <p className="aviso">
              Não é permitido vender uma quantidade maior que o saldo disponível.
            </p>
          </S.Painel>
        </>
      )}
    </div>
  );
}

export default Vendas;
