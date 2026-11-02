import * as S from "./Estoque.Styled";
import { useEffect, useState } from "react";
import { useDados } from "../../context/DadosContext";
import { categoriasProduto } from "../../utils/opcoes";
import { alerta } from "../../utils/Alertas";
import api from "../../service/api";
import CardResumo from "../../components/Cards/CardResumo.jsx";
import AlertaAviso from "../../components/AlertaAviso/AlertaAviso.jsx";
import Button from "../../components/Button/Button.jsx";
import Select from "../../components/Select/Select.jsx";
import Form from "../../components/Forms/Forms.jsx";
import Modal from "../../components/Modal/Modal.jsx";
import Input from "../../components/Input/Input.jsx";
import Tabela from "../../components/TabelaTeste/TabelaT.jsx";

const moeda = (v) =>
  Number(v).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

// traduz o que vem do back para os nomes que a tela usa
const normalizar = (p) => ({
  ...p,
  quantidade: p.quantMax ?? 0, // trocar por p.saldo quando houver movimentações
  qtdMinima: p.quantMinima,
  atualizado: p.criadoEm,
});

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

// Aviso de erro exibido embaixo dos campos (usado nos Selects, que ainda não têm a prop "erro")
const MsgErro = ({ children }) =>
  children ? (
    <small
      role="alert"
      style={{
        display: "block",
        marginTop: 4,
        color: "#e5534b",
        fontSize: "0.8rem",
        fontWeight: 500,
      }}
    >
      {children}
    </small>
  ) : null;

function Estoque() {
  const { produtos, setProdutos, fornecedores, setFornecedores } = useDados();

  const [openModal, setOpenModal] = useState(false);
  const [produtoEditando, setProdutoEditando] = useState(null);
  const [nome, setNome] = useState("");
  const [categoria, setCategoria] = useState("");
  const [quantidade, setQuantidade] = useState("");
  const [qtdMinima, setQtdMinima] = useState("");
  const [preco, setPreco] = useState("");
  const [fornecedorId, setFornecedorId] = useState("");
  const [erros, setErros] = useState({});

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

  // ---------- alertas ----------
  const estoqueBaixo = (p) =>
    p.qtdMinima != null && Number(p.quantidade) <= Number(p.qtdMinima);
  const produtosBaixos = produtos.filter(estoqueBaixo);
  const valorTotal = produtos.reduce(
    (soma, p) => soma + Number(p.quantidade) * Number(p.preco),
    0,
  );

  // ---------- modal ----------
  function limparCampos() {
    setNome("");
    setCategoria("");
    setQuantidade("");
    setQtdMinima("");
    setPreco("");
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

    if (preco === "" || Number(preco) < 0) {
      novosErros.preco = "Informe o preço unitário.";
    }

    if (!fornecedorId) novosErros.fornecedorId = "Escolha o fornecedor.";

    setErros(novosErros);
    return Object.keys(novosErros).length === 0;
  }

  // remove o erro de um campo assim que a pessoa volta a preenchê-lo
  function limparErro(campo) {
    setErros((prev) => ({ ...prev, [campo]: "" }));
  }

  // ---------- salvar e excluir ----------
  async function salvarProduto() {
    if (!validar()) return;

    const minima = qtdMinima === "" ? null : Number(qtdMinima);

    const dadosBack = {
      nome: nome.trim(),
      categoria,
      quantMax: Number(quantidade),
      quantMinima: minima,
      preco: Number(preco),
      fornecedorId: Number(fornecedorId),
    };

    try {
      if (produtoEditando) {
        // Pressupõe PUT /api/produtos/{id}; confirme a rota no controller.
        const resposta = await api.put(
          `/api/produtos/${produtoEditando.id}`,
          dadosBack,
        );

        const produtoAtualizado = normalizar({
          ...(resposta.data ?? {}),
          ...dadosBack,
          id: resposta.data?.id ?? produtoEditando.id,
          fornecedorId: resposta.data?.fornecedorId ?? dadosBack.fornecedorId,
        });

        setProdutos((atuais) =>
          atuais.map((p) =>
            String(p.id) === String(produtoEditando.id)
              ? produtoAtualizado
              : p,
          ),
        );
        alerta.sucesso("Produto atualizado com sucesso!");
      } else {
        const resposta = await api.post("/api/produtos", dadosBack);
        const produtoCriado = normalizar({
          ...resposta.data,
          fornecedorId: resposta.data?.fornecedorId ?? dadosBack.fornecedorId,
        });

        setProdutos((atuais) => [...atuais, produtoCriado]);
        alerta.sucesso("Produto cadastrado com sucesso!");
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
    const confirmar = window.confirm(
      "Tem certeza que deseja excluir este produto?",
    );
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
        erro.response?.data?.message ??
          "Não foi possível excluir o produto. Ele pode ter movimentações vinculadas ou a rota pode ser diferente.",
      );
    }
  }

  // ---------- colunas ----------
  const camposProdutos = [
    {
      chave: "nome",
      rotulo: "Produto",
      render: (p) => (
        <span className="fw-semibold">
          {p.nome}
          {estoqueBaixo(p) && (
            <i className="bi bi-exclamation-triangle text-warning ms-3"></i>
          )}
        </span>
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
      render: (p) => `${p.quantidade} / ${p.qtdMinima ?? "—"} min.`,
    },
    { chave: "preco", rotulo: "Preço unit.", render: (p) => moeda(p.preco) },
    {
      chave: "total",
      rotulo: "Total",
      render: (p) => (
        <span className="fw-semibold text-success">
          {moeda(p.quantidade * p.preco)}
        </span>
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
      <S.Hestoque>
        <div>
          <h2>Estoque</h2>
        </div>
        <div>
          <Button
            className="btn-primary"
            texto="Novo Produto"
            onClick={abrirNovo}
          />
        </div>
      </S.Hestoque>

      {/* cards de resumo */}
      <div className="row g-3 mb-3">
        <div className="col-md-4">
          <CardResumo
            titulo="Total de Produtos"
            valor={produtos.length}
            icone="box-seam"
            corIcone="#2563eb"
            fundoIcone="#dbeafe"
          />
        </div>
        <div className="col-md-4">
          <CardResumo
            titulo="Estoque Baixo"
            valor={produtosBaixos.length}
            corValor="#f97316"
            icone="exclamation-triangle"
            corIcone="#f97316"
            fundoIcone="#ffedd5"
          />
        </div>
        <div className="col-md-4">
          <CardResumo
            titulo="Valor Total"
            valor={moeda(valorTotal)}
            corValor="#198754"
            icone="currency-dollar"
            corIcone="#198754"
            fundoIcone="#dcfce7"
          />
        </div>
      </div>

      {/* alerta: só aparece se houver produto com estoque baixo */}
      <AlertaAviso
        titulo="Produtos com estoque baixo"
        itens={produtosBaixos.map((p) => p.nome)}
      />

      <Tabela
        campos={camposProdutos}
        dados={produtos}
        aoEditar={abrirEditar}
        aoExcluir={deletarProduto}
        classeLinha={(p) => (estoqueBaixo(p) ? "table-warning" : "")}
      />

      <Modal largura={420} isOpen={openModal}>
        <Form
          hForm=""
          tForm={produtoEditando ? "Editar produto" : "Novo produto"}
        >
          <Input
            onChange={(e) => {
              setNome(e.target.value);
              limparErro("nome");
            }}
            valor={nome}
            texto="Nome do Produto *"
            type="text"
            placeholder="Ex.: Ração Premium Cães Adultos 15kg"
            erro={erros.nome}
          />

          <div>
            <Select
              texto="Categoria *"
              valor={categoria}
              onChange={(e) => {
                setCategoria(e.target.value);
                limparErro("categoria");
              }}
              opcoes={categoriasProduto}
              placeholder="Ex.: Alimentação"
            />
            <MsgErro>{erros.categoria}</MsgErro>
          </div>

          <Input
            onChange={(e) => {
              setQuantidade(e.target.value);
              limparErro("quantidade");
            }}
            valor={quantidade}
            texto="Quantidade *"
            type="number"
            placeholder="Ex.: 50"
            erro={erros.quantidade}
          />

          <Input
            onChange={(e) => setQtdMinima(e.target.value)}
            valor={qtdMinima}
            texto="Qtd. Mínima"
            type="number"
            placeholder="Ex.: 10"
            obrigatorio={false}
          />

          <Input
            onChange={(e) => {
              setPreco(e.target.value);
              limparErro("preco");
            }}
            valor={preco}
            texto="Preço Unitário (R$) *"
            type="number"
            placeholder="Ex.: 129.90"
            erro={erros.preco}
          />

          <div>
            <Select
              texto="Fornecedor *"
              valor={fornecedorId}
              onChange={(e) => {
                setFornecedorId(e.target.value);
                limparErro("fornecedorId");
              }}
              opcoes={fornecedores.map((f) => ({
                valor: f.id,
                rotulo: nomeFornecedor(f),
              }))}
              placeholder="Ex.: Pet Foods Distribuidora"
            />
            <MsgErro>{erros.fornecedorId}</MsgErro>
          </div>

          <div className="d-flex gap-2 mt-3">
            <Button
              className="btn-outline-secondary flex-fill"
              onClick={fecharModal}
              texto="Cancelar"
            />
            <Button
              className="btn-primary flex-fill"
              onClick={salvarProduto}
              texto={produtoEditando ? "Salvar" : "Cadastrar"}
            />
          </div>
        </Form>
      </Modal>
    </div>
  );
}

export default Estoque;