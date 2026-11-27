import * as S from "./Estoque.Styled";
import BarraFiltro from "../../components/Filtro/BarraFiltro.jsx";
import CabecalhoPagina from "../../components/CabecalhoPagina/CabecalhoPagina.jsx";
import MsgErro from "../../components/AlertaAviso/MsgErroEstoque.jsx";
import { useEffect, useState } from "react";
import { useDados } from "../../context/DadosContext";
import { categoriasProduto } from "../../utils/opcoes";
import { alerta } from "../../utils/Alertas";
import api from "../../service/api";
import { confirmarExclusao, mensagemDaApi } from "../../components/ConfirmarExclusao/ConfirmarExclusao.jsx";
import CardResumo from "../../components/Cards/CardResumo.jsx";
import AlertaAviso from "../../components/AlertaAviso/AlertaAviso.jsx";
import Button from "../../components/Button/Button.jsx";
import ModalRodape from "../../components/Modal/ModalRodape.jsx";
import Form from "../../components/Forms/Forms.jsx";
import Modal from "../../components/Modal/Modal.jsx";
import Input from "../../components/Input/Input.jsx";
import Tabela from "../../components/TabelaTeste/TabelaT.jsx";
import ButtonX from "../../components/Button/ButtonX.jsx";
import { X } from "lucide-react";

const moeda = (v) =>
  Number(v).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

// traduz o que vem do back para os nomes que a tela usa
const normalizar = (p) => ({
  ...p,
  quantidade: p.saldo ?? 0, // saldo real: muda com as movimentações (entrada/saída/vendas)
  qtdMinima: p.quantMinima,
  atualizado: p.criadoEm,
});

// produto à venda vale pelo preço de venda; o de uso interno, pelo custo
const valorUnitario = (p) => Number(p.revenda ? p.preco : (p.precoCusto ?? 0));

const rotuloCategoria = (valor) =>
  categoriasProduto.find((c) => c.valor === valor)?.rotulo ?? valor;

// o fornecedor pode ter razaoSocial ou nome
const nomeFornecedor = (f) => f?.razaoSocial ?? f?.nome;

// aceita "2026-10-25" ou "2026-10-25T14:30:00"
const formatarData = (iso) => {
  if (!iso) return "—";
  const [ano, mes, dia] = String(iso).slice(0, 10).split("-");
  return `${dia}/${mes}/${ano}`;
};



function Estoque() {
  const { produtos, setProdutos, fornecedores, setFornecedores } = useDados();
  const [busca, setBusca] = useState("");
  const [filtroAtivo, setFiltroAtivo] = useState("todos");
  const [openModal, setOpenModal] = useState(false);
  const [produtoEditando, setProdutoEditando] = useState(null);
  const [nome, setNome] = useState("");
  const [categoria, setCategoria] = useState("");
  const [quantidade, setQuantidade] = useState("");
  const [qtdMinima, setQtdMinima] = useState("");
  const [preco, setPreco] = useState("");
  const [precoCusto, setPrecoCusto] = useState("");
  const [revenda, setRevenda] = useState(true);
  const [fornecedorId, setFornecedorId] = useState("");
  const [erros, setErros] = useState({});

  // uso interno: produto em uso no modal + consumo somado por produto
  const [produtoUso, setProdutoUso] = useState(null);
  const [qtdUso, setQtdUso] = useState("");
  const [erroUso, setErroUso] = useState("");
  const [salvandoUso, setSalvandoUso] = useState(false);
  const [consumo, setConsumo] = useState({}); // { [produtoId]: { quantidade, ultimo } }

  // carrega produtos e fornecedores do back ao abrir a página
  useEffect(() => {
    async function carregar() {
      try {
        const [p, f] = await Promise.all([
          api.get("/api/produtos?size=200"),
          api.get("/api/fornecedores?size=200"),
        ]);
        const listaProdutos = p.data.content ?? p.data;
        const listaFornecedores = f.data.content ?? f.data;

        // O backend deve devolver fornecedorId no ProdutoResponse.
        // O fallback local ajuda enquanto produtos antigos são atualizados.
        setProdutos((atuais) =>
          listaProdutos.map((prod) => {
            const local = atuais.find((x) => String(x.id) === String(prod.id));
            return normalizar({
              ...prod,
              fornecedorId: prod.fornecedorId ?? local?.fornecedorId ?? "",
            });
          }),
        );

        // não apaga o que só existe no front (categoria e status)
        setFornecedores((atuais) =>
          atuais.length > 0 ? atuais : listaFornecedores,
        );
      } catch (erro) {
        console.error("Erro ao carregar o estoque:", erro);
        alerta.erro("Não foi possível carregar o estoque.");
      }
    }
    carregar();
  }, []);

  // ---------- consumo interno ----------
  // soma as SAÍDAS de cada produto que não está à venda
  const internos = produtos.filter((p) => !p.revenda);
  const chaveInternos = internos.map((p) => `${p.id}:${p.quantidade}`).join(",");

  useEffect(() => {
    if (internos.length === 0) {
      setConsumo({});
      return;
    }
    async function carregarConsumo() {
      try {
        const respostas = await Promise.all(
          internos.map((p) =>
            api.get(`/api/movimentacoes/produto/${p.id}?size=500`),
          ),
        );
        const novo = {};
        respostas.forEach((r, i) => {
          const saidas = (r.data.content ?? r.data ?? []).filter(
            (m) => m.tipo === "SAIDA",
          );
          novo[internos[i].id] = {
            quantidade: saidas.reduce((soma, m) => soma + Number(m.quantidade), 0),
            ultimo: saidas
              .map((m) => m.dataMovimentacao)
              .sort()
              .at(-1),
          };
        });
        setConsumo(novo);
      } catch (erro) {
        console.error("Erro ao carregar consumo interno:", erro);
      }
    }
    carregarConsumo();
  }, [chaveInternos]);

  const linhasConsumo = internos
    .map((p) => {
      const c = consumo[p.id] ?? { quantidade: 0 };
      const custo = Number(p.precoCusto ?? 0);
      return { ...p, usado: c.quantidade, ultimo: c.ultimo, custoTotal: c.quantidade * custo };
    })
    .sort((a, b) => b.custoTotal - a.custoTotal);

  const custoConsumido = linhasConsumo.reduce((soma, l) => soma + l.custoTotal, 0);

  function abrirUso(produto) {
    setProdutoUso(produto);
    setQtdUso("");
    setErroUso("");
  }

  function fecharUso() {
    setProdutoUso(null);
    setQtdUso("");
    setErroUso("");
  }

  async function registrarUso() {
    const qtd = Number(qtdUso);
    if (!qtd || qtd <= 0 || !Number.isInteger(qtd)) {
      setErroUso("Informe uma quantidade inteira maior que zero.");
      return;
    }
    if (qtd > Number(produtoUso.quantidade)) {
      setErroUso(`Só há ${produtoUso.quantidade} unidade(s) em estoque.`);
      return;
    }

    setSalvandoUso(true);
    try {
      await api.post("/api/movimentacoes", {
        tipo: "SAIDA",
        quantidade: qtd,
        produtoId: produtoUso.id,
      });
      // atualiza o saldo na tela; o consumo recarrega sozinho
      setProdutos((atuais) =>
        atuais.map((p) =>
          p.id === produtoUso.id
            ? { ...p, saldo: p.quantidade - qtd, quantidade: p.quantidade - qtd }
            : p,
        ),
      );
      alerta.sucesso(`Uso de ${qtd} un. de "${produtoUso.nome}" registrado.`);
      fecharUso();
    } catch (erro) {
      console.error("Erro ao registrar uso:", erro.response?.data ?? erro);
      const mensagens = erro.response?.data?.mensagens;
      setErroUso(
        Array.isArray(mensagens) ? mensagens.join("\n") : "Não foi possível registrar o uso.",
      );
    } finally {
      setSalvandoUso(false);
    }
  }

  // ---------- alertas ----------
  const estoqueBaixo = (p) =>
    p.qtdMinima != null && Number(p.quantidade) <= Number(p.qtdMinima);
  const produtosBaixos = produtos.filter(estoqueBaixo);
  const valorTotal = produtos.reduce(
    (soma, p) => soma + Number(p.quantidade) * valorUnitario(p),
    0,
  );

  // ---------- modal ----------
  function limparCampos() {
    setNome("");
    setCategoria("");
    setQuantidade("");
    setQtdMinima("");
    setPreco("");
    setPrecoCusto("");
    setRevenda(true);
    setFornecedorId("");
    setErros({});
  }

  function abrirNovo() {
    limparCampos();
    setProdutoEditando(null);
    setOpenModal(true);
  }

  function abrirEditar(produto) {
    setErros({});
    setNome(produto.nome);
    setCategoria(produto.categoria ?? "");
    setQuantidade(produto.quantidade);
    setQtdMinima(produto.qtdMinima ?? "");
    setPreco(produto.preco);
    setPrecoCusto(produto.precoCusto ?? "");
    setRevenda(Boolean(produto.revenda));
    setFornecedorId(produto.fornecedorId ?? "");
    setProdutoEditando(produto);
    setOpenModal(true);
  }

  function fecharModal() {
    limparCampos();
    setProdutoEditando(null);
    setOpenModal(false);
  }

  // valida os campos obrigatórios e guarda a mensagem de cada um em "erros"
  function validar() {
    const novosErros = {};

    if (!nome.trim()) novosErros.nome = "Informe o nome do produto.";
    if (!categoria) novosErros.categoria = "Escolha a categoria.";

    if (quantidade === "" || Number(quantidade) < 0) {
      novosErros.quantidade = "Informe a quantidade em estoque.";
    }

    if (revenda && (preco === "" || Number(preco) < 0)) {
      novosErros.preco = "Informe o preço de venda.";
    }

    if (precoCusto === "" || Number(precoCusto) < 0) {
      novosErros.precoCusto = "Informe o preço de custo.";
    } else if (revenda && preco !== "" && Number(preco) < Number(precoCusto)) {
      novosErros.preco = "O preço de venda não pode ser menor que o de custo.";
    }

    if (!fornecedorId) novosErros.fornecedorId = "Escolha o fornecedor.";

    setErros(novosErros);
    return Object.keys(novosErros).length === 0;
  }

  // remove o erro de um campo assim que a pessoa volta a preenchê-lo
  function limparErro(campo) {
    setErros((prev) => ({ ...prev, [campo]: "" }));
  }

  // ---------- filtro e busca ----------
  const semAcento = (t) =>
    String(t ?? "")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase();

  const filtros = [
    { chave: "todos", rotulo: "Todos", quantidade: produtos.length },
    {
      chave: "baixo",
      rotulo: "Estoque baixo",
      quantidade: produtosBaixos.length,
    },
    { chave: "interno", rotulo: "Uso interno", quantidade: internos.length },
    ...categoriasProduto.map((c) => ({
      chave: c.valor,
      rotulo: c.rotulo,
      quantidade: produtos.filter((p) => p.categoria === c.valor).length,
    })),
  ];

  const visiveis = produtos.filter((p) => {
    const passaFiltro =
      filtroAtivo === "todos" ||
      (filtroAtivo === "baixo"
        ? estoqueBaixo(p)
        : filtroAtivo === "interno"
          ? !p.revenda
          : p.categoria === filtroAtivo);

    const texto = semAcento(busca);
    const fornecedor = fornecedores.find(
      (f) => String(f.id) === String(p.fornecedorId),
    );
    const passaBusca = [
      p.nome,
      rotuloCategoria(p.categoria),
      nomeFornecedor(fornecedor),
    ].some((campo) => semAcento(campo).includes(texto));

    return passaFiltro && passaBusca;
  });

  const margem =
    revenda && preco !== "" && precoCusto !== ""
      ? Number(preco) - Number(precoCusto)
      : null;

  // ---------- salvar e excluir ----------
  async function salvarProduto() {
    if (!validar()) return;

    const minima = qtdMinima === "" ? null : Number(qtdMinima);

    const dadosBack = {
      nome: nome.trim(),
      categoria,
      quantMax: Number(quantidade),
      quantMinima: minima,
      // o back exige preço; produto de uso interno não é vendido, então vai 0
      preco: revenda ? Number(preco) : Number(preco || 0),
      fornecedorId: Number(fornecedorId),
      revenda,
      precoCusto: Number(precoCusto),
    };

    // o estoque real (saldo) só muda por movimentação: ENTRADA ou SAIDA
    async function ajustarSaldo(produtoId, saldoAtual) {
      const diferenca = Number(quantidade) - Number(saldoAtual ?? 0);
      if (diferenca === 0) return Number(saldoAtual ?? 0);
      await api.post("/api/movimentacoes", {
        tipo: diferenca > 0 ? "ENTRADA" : "SAIDA",
        quantidade: Math.abs(diferenca),
        produtoId,
      });
      return Number(quantidade);
    }

    try {
      if (produtoEditando) {
        // Pressupõe PUT /api/produtos/{id}; confirme a rota no controller.
        const resposta = await api.put(
          `/api/produtos/${produtoEditando.id}`,
          dadosBack,
        );

        const saldo = await ajustarSaldo(produtoEditando.id, produtoEditando.quantidade);

        const produtoAtualizado = normalizar({
          ...(resposta.data ?? {}),
          ...dadosBack,
          id: resposta.data?.id ?? produtoEditando.id,
          fornecedorId: resposta.data?.fornecedorId ?? dadosBack.fornecedorId,
          saldo,
        });

        setProdutos((atuais) =>
          atuais.map((p) =>
            String(p.id) === String(produtoEditando.id) ? produtoAtualizado : p,
          ),
        );
        alerta.sucesso("Produto atualizado com sucesso!");
      } else {
        const resposta = await api.post("/api/produtos", dadosBack);
        // produto novo nasce com saldo 0: registra a quantidade como ENTRADA
        const saldo = await ajustarSaldo(resposta.data.id, 0);
        const produtoCriado = normalizar({
          ...resposta.data,
          fornecedorId: resposta.data?.fornecedorId ?? dadosBack.fornecedorId,
          saldo,
        });

        setProdutos((atuais) => [...atuais, produtoCriado]);
        alerta.sucesso(
          revenda
            ? "Produto cadastrado e disponível em Vendas!"
            : "Produto cadastrado com sucesso!",
        );
      }

      fecharModal();
    } catch (erro) {
      console.error("Erro ao salvar produto:", erro.response?.data ?? erro);
      const mensagens = erro.response?.data?.mensagens;
      alerta.erro(
        Array.isArray(mensagens)
          ? mensagens.join("\n")
          : (erro.response?.data?.message ??
              "Não foi possível salvar o produto. Verifique os dados e a rota da API."),
      );
    }
  }

  async function deletarProduto(id) {
    const produto = produtos.find((p) => String(p.id) === String(id));
    const confirmar = await confirmarExclusao({
      titulo: "Excluir produto?",
      mensagem: produto
        ? `"${produto.nome}" será removido do estoque e não poderá ser recuperado.`
        : "Este produto será removido do estoque e não poderá ser recuperado.",
    });
    if (!confirmar) return;

    try {
      // Pressupõe DELETE /api/produtos/{id}; confirme a rota no controller.
      await api.delete(`/api/produtos/${id}`);
      setProdutos((atuais) =>
        atuais.filter((p) => String(p.id) !== String(id)),
      );
      alerta.sucesso("Produto excluído.");
    } catch (erro) {
      console.error("Erro ao excluir produto:", erro.response?.data ?? erro);
      alerta.erro(
        mensagemDaApi(erro, "Não foi possível excluir o produto. Ele pode ter movimentações vinculadas."),
      );
    }
  }

  // ---------- colunas ----------
  const camposProdutos = [
    {
      chave: "nome",
      rotulo: "Produto",
      render: (p) => (
        // nome em cima e etiqueta sempre embaixo, qualquer que seja o tamanho do nome
        <div className="d-flex flex-column align-items-center gap-1">
          <span className="fw-semibold">{p.nome}</span>
          {p.revenda && (
            <span className="badge bg-success-subtle text-success">À venda</span>
          )}
        </div>
      ),
    },
    {
      chave: "categoria",
      rotulo: "Categoria",
      render: (p) => (
        <span className="badge bg-primary-subtle text-primary">
          {rotuloCategoria(p.categoria)}
        </span>
      ),
    },
    {
      chave: "fornecedor",
      rotulo: "Fornecedor",
      render: (p) =>
        nomeFornecedor(
          fornecedores.find((f) => String(f.id) === String(p.fornecedorId)),
        ),
    },
    {
      chave: "quantidade",
      rotulo: "Quantidade",
      render: (p) => (
        <span className="text-nowrap">
          {p.quantidade} / {p.qtdMinima ?? "—"} min.
          {estoqueBaixo(p) && (
            <i
              className="bi bi-exclamation-triangle-fill text-warning ms-2"
              title="Atingiu o estoque mínimo"
              aria-label="Atingiu o estoque mínimo"
            ></i>
          )}
        </span>
      ),
    },
    {
      chave: "precoCusto",
      rotulo: "Custo",
      render: (p) => (p.precoCusto != null ? moeda(p.precoCusto) : "—"),
    },
    {
      chave: "preco",
      rotulo: "Venda",
      render: (p) => (p.revenda ? moeda(p.preco) : <span className="text-secondary">—</span>),
    },
    {
      chave: "total",
      rotulo: "Total",
      render: (p) => (
        <span className="fw-semibold text-success">
          {moeda(p.quantidade * valorUnitario(p))}
        </span>
      ),
    },
    {
      chave: "uso",
      rotulo: "Uso",
      render: (p) =>
        p.revenda ? (
          <span className="text-secondary">—</span>
        ) : (
          <button
            type="button"
            className="btn btn-sm btn-outline-primary rounded-pill text-nowrap"
            onClick={() => abrirUso(p)}
            disabled={Number(p.quantidade) <= 0}
            title="Registrar uso interno"
          >
            <i className="bi bi-box-arrow-right me-1"></i> Usar
          </button>
        ),
    },
    {
      chave: "atualizado",
      rotulo: "Última atualização",
      render: (p) => formatarData(p.atualizado),
    },
  ];

  return (
    <div>
      <CabecalhoPagina
        sobre="Controle de produtos"
        icone="box-seam"
        titulo="Estoque"
        subtitulo="Rações, higiene e acessórios com alerta de estoque baixo."
        acao={
          <Button
            className="btn-primary"
            texto={
              <>
                <i className="bi bi-plus-lg me-1"></i> Novo Produto
              </>
            }
            onClick={abrirNovo}
          />
        }
      />

      {/* cards de resumo */}
      <div className="row g-3 mb-3">
        <div className="col-md-6 col-xl-3">
          <CardResumo
            titulo="Total de Produtos"
            valor={produtos.length}
            icone="box-seam"
            corIcone="#2563eb"
            fundoIcone="#dbeafe"
          />
        </div>
        <div className="col-md-6 col-xl-3">
          <CardResumo
            titulo="Estoque Baixo"
            valor={produtosBaixos.length}
            icone="exclamation-triangle"
            corIcone="#f97316"
            fundoIcone="#ffedd5"
          />
        </div>
        <div className="col-md-6 col-xl-3">
          <CardResumo
            titulo="Valor Total"
            valor={moeda(valorTotal)}
            icone="currency-dollar"
            corIcone="#198754"
            fundoIcone="#dcfce7"
          />
        </div>
        <div className="col-md-6 col-xl-3">
          <CardResumo
            titulo="Consumo Interno"
            valor={moeda(custoConsumido)}
            icone="box-arrow-right"
            corIcone="#6a5cf5"
            fundoIcone="#ede9fe"
          />
        </div>
      </div>

      {/* alerta: só aparece se houver produto com estoque baixo */}
      <AlertaAviso
        titulo="Produtos com estoque baixo"
        itens={produtosBaixos.map((p) => p.nome)}
      />
      <BarraFiltro
        busca={busca}
        aoBuscar={setBusca}
        placeholder="Buscar por produto, categoria ou fornecedor..."
        filtros={filtros}
        filtroAtivo={filtroAtivo}
        aoMudarFiltro={setFiltroAtivo}
      />

      <Tabela
        campos={camposProdutos}
        dados={visiveis}
        aoEditar={abrirEditar}
        aoExcluir={deletarProduto}
        classeLinha={(p) => (estoqueBaixo(p) ? "table-warning" : "")}
      />

      {/* consumo interno: produtos que não vão para Vendas */}
      <S.Consumo className="bg-white rounded shadow-sm mt-4">
        <div className="topo">
          <div>
            <h2>Consumo interno</h2>
            <p>
              Produtos usados pelo próprio pet shop (banho, tosa, limpeza...).
              O custo é a quantidade usada × preço de custo.
            </p>
          </div>
          <div className="total">
            <span>Custo total</span>
            <strong>{moeda(custoConsumido)}</strong>
          </div>
        </div>

        {linhasConsumo.length === 0 ? (
          <p className="vazio">
            Nenhum produto de uso interno. No cadastro, ligue a opção
            "Item de uso interno".
          </p>
        ) : (
          <div className="table-responsive">
            <table className="table align-middle mb-0">
              <thead>
                <tr>
                  <th>Produto</th>
                  <th>Categoria</th>
                  <th>Qtd. usada</th>
                  <th>Em estoque</th>
                  <th>Custo unit.</th>
                  <th>Custo do uso</th>
                  <th>Último uso</th>
                </tr>
              </thead>
              <tbody>
                {linhasConsumo.map((l) => (
                  <tr key={l.id}>
                    <td className="fw-semibold">{l.nome}</td>
                    <td>
                      <span className="badge bg-primary-subtle text-primary">
                        {rotuloCategoria(l.categoria)}
                      </span>
                    </td>
                    <td>{l.usado} un.</td>
                    <td>{l.quantidade} un.</td>
                    <td>{l.precoCusto != null ? moeda(l.precoCusto) : "—"}</td>
                    <td className="fw-semibold custo">{moeda(l.custoTotal)}</td>
                    <td>{formatarData(l.ultimo)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </S.Consumo>

      {/* modal: registrar uso interno */}
      <Modal tema largura={480} isOpen={Boolean(produtoUso)} aoFechar={fecharUso}>
        <Form
          tema
          hForm={<ButtonX tema texto={<X size={16} />} onClick={fecharUso} />}
          tForm="Registrar uso interno"
        >
          {produtoUso && (
            <S.Secao>
              <S.ResumoUso>
                <strong>{produtoUso.nome}</strong>
                <span>
                  {produtoUso.quantidade} un. em estoque ·{" "}
                  {produtoUso.precoCusto != null
                    ? `${moeda(produtoUso.precoCusto)} cada`
                    : "sem preço de custo"}
                </span>
              </S.ResumoUso>

              <Input
                tema
                autoFocus
                texto="Quantidade usada *"
                type="number"
                min="1"
                valor={qtdUso}
                onChange={(e) => {
                  setQtdUso(e.target.value);
                  setErroUso("");
                }}
                placeholder="Ex.: 2"
                erro={erroUso}
              />
              <S.Dica>
                Vai sair do estoque e entrar no custo do consumo interno.
                {Number(qtdUso) > 0 && produtoUso.precoCusto != null &&
                  ` Custo deste uso: ${moeda(Number(qtdUso) * Number(produtoUso.precoCusto))}.`}
              </S.Dica>
            </S.Secao>
          )}

          <ModalRodape
            aoCancelar={fecharUso}
            aoConfirmar={registrarUso}
            carregando={salvandoUso}
            textoConfirmar={salvandoUso ? "Registrando..." : "Registrar uso"}
          />
        </Form>
      </Modal>

      <Modal tema largura={960} isOpen={openModal} aoFechar={fecharModal}>
        <Form
          tema
          hForm={<ButtonX tema texto={<X size={16} />} onClick={fecharModal} />}
          tForm={produtoEditando ? "Editar produto" : "Novo produto"}
        >
          {/* 1. identificação */}
          <S.Secao>
            <S.TituloSecao>
              <div>
                <legend>1. Identificação</legend>
                <p>Como o produto aparece no estoque e nas vendas.</p>
              </div>
            </S.TituloSecao>

            <div className="row g-3">
              <div className="col-12">
                <Input
                  tema
                  autoFocus
                  onChange={(e) => {
                    setNome(e.target.value);
                    limparErro("nome");
                  }}
                  valor={nome}
                  texto="Nome do Produto *"
                  placeholder="Ex.: Ração Premium Cães Adultos 15kg"
                  erro={erros.nome}
                />
              </div>

              <div className="col-md-6">
                <label className="form-label" htmlFor="produto-categoria">
                  Categoria *
                </label>
                <S.SelectTema
                  id="produto-categoria"
                  value={categoria}
                  $erro={Boolean(erros.categoria)}
                  onChange={(e) => {
                    setCategoria(e.target.value);
                    limparErro("categoria");
                  }}
                >
                  <option value="">Selecione...</option>
                  {categoriasProduto.map((c) => (
                    <option key={c.valor} value={c.valor}>
                      {c.rotulo}
                    </option>
                  ))}
                </S.SelectTema>
                <MsgErro>{erros.categoria}</MsgErro>
              </div>

              <div className="col-md-6">
                <label className="form-label" htmlFor="produto-fornecedor">
                  Fornecedor *
                </label>
                <S.SelectTema
                  id="produto-fornecedor"
                  value={fornecedorId}
                  $erro={Boolean(erros.fornecedorId)}
                  onChange={(e) => {
                    setFornecedorId(e.target.value);
                    limparErro("fornecedorId");
                  }}
                >
                  <option value="">Selecione...</option>
                  {fornecedores.map((f) => (
                    <option key={f.id} value={f.id}>
                      {nomeFornecedor(f)}
                    </option>
                  ))}
                </S.SelectTema>
                <MsgErro>{erros.fornecedorId}</MsgErro>
              </div>
            </div>
          </S.Secao>

          {/* 2. estoque */}
          <S.Secao>
            <S.TituloSecao>
              <div>
                <legend>2. Estoque</legend>
                <p>Abaixo da quantidade mínima, o produto entra no alerta.</p>
              </div>
            </S.TituloSecao>

            <div className="row g-3">
              <div className="col-md-6">
                <Input
                  tema
                  onChange={(e) => {
                    setQuantidade(e.target.value);
                    limparErro("quantidade");
                  }}
                  valor={quantidade}
                  texto="Quantidade *"
                  type="number"
                  min="0"
                  placeholder="Ex.: 50"
                  erro={erros.quantidade}
                />
              </div>
              <div className="col-md-6">
                <Input
                  tema
                  onChange={(e) => setQtdMinima(e.target.value)}
                  valor={qtdMinima}
                  texto="Estoque Mínimo"
                  type="number"
                  min="0"
                  placeholder="Ex.: 10"
                  obrigatorio={false}
                />
              </div>
            </div>
          </S.Secao>

          {/* 3. preços */}
          <S.Secao>
            <S.TituloSecao>
              <div>
                <legend>3. Preços</legend>
                <p>Custo e venda podem ser ajustados a qualquer momento.</p>
              </div>
              <div className="form-check form-switch m-0">
                <input
                  id="produto-uso-interno"
                  className="form-check-input"
                  type="checkbox"
                  role="switch"
                  checked={!revenda}
                  onChange={(e) => setRevenda(!e.target.checked)}
                />
                <label className="form-check-label small" htmlFor="produto-uso-interno">
                  Item de uso interno
                </label>
              </div>
            </S.TituloSecao>

            <div className="row g-3">
              <div className="col-md-4">
                <Input
                  tema
                  onChange={(e) => {
                    setPrecoCusto(e.target.value);
                    limparErro("precoCusto");
                  }}
                  valor={precoCusto}
                  texto="Preço de Custo *"
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="R$ 0,00"
                  erro={erros.precoCusto}
                />
                <S.Dica>Valor pago ao fornecedor</S.Dica>
              </div>

              <div className="col-md-4">
                <Input
                  tema
                  onChange={(e) => {
                    setPreco(e.target.value);
                    limparErro("preco");
                  }}
                  valor={preco}
                  texto={revenda ? "Preço de Venda *" : "Preço de Venda"}
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="R$ 0,00"
                  erro={erros.preco}
                  disabled={!revenda}
                />
                <S.Dica>
                  {revenda
                    ? "Valor exibido no módulo Vendas"
                    : "Não usado: produto de uso interno"}
                </S.Dica>
              </div>

              <div className="col-md-4">
                <S.Margem $negativa={margem != null && margem < 0}>
                  <span>Lucro por unidade</span>
                  <strong>{margem != null ? moeda(margem) : "—"}</strong>
                  <small>
                    {margem != null && Number(precoCusto) > 0
                      ? `${((margem / Number(precoCusto)) * 100).toFixed(0)}% sobre o custo`
                      : revenda
                        ? "Preencha custo e venda"
                        : "Uso interno: não gera lucro"}
                  </small>
                </S.Margem>
              </div>
            </div>
          </S.Secao>

          <ModalRodape
            aoCancelar={fecharModal}
            aoConfirmar={salvarProduto}
            textoConfirmar={produtoEditando ? "Salvar alterações" : "Cadastrar produto"}
            extra={
              <span className="text-secondary small">
                <i className={`bi ${revenda ? "bi-cart-check" : "bi-cart-x"} me-1`}></i>
                {revenda ? "Vai aparecer em Vendas" : "Insumo de banho/consulta: não vai para Vendas"}
              </span>
            }
          />
        </Form>
      </Modal>
    </div>
  );
}

export default Estoque;
