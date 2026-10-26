import * as S from "./Estoque.Styled";
import { useEffect, useState } from "react";
import { useDados } from "../../context/DadosContext";
import { categoriasProduto } from "../../utils/opcoes";
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
        })
      );

      // não apaga o que só existe no front (categoria e status)
      setFornecedores((atuais) =>
        atuais.length > 0 ? atuais : listaFornecedores
      );
    } catch (erro) {
      console.error("Erro ao carregar o estoque:", erro);
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
  }

  function abrirNovo() {
    limparCampos();
    setProdutoEditando(null);
    setOpenModal(true);
  }

  function abrirEditar(produto) {
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

  // ---------- salvar e excluir ----------
  async function salvarProduto() {
    if (
      !nome.trim() ||
      !categoria ||
      !fornecedorId ||
      quantidade === "" ||
      preco === ""
    ) {
      alert("Preencha todos os campos obrigatórios.");
      return;
    }

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
          fornecedorId:
            resposta.data?.fornecedorId ?? dadosBack.fornecedorId,
        });

        setProdutos((atuais) =>
          atuais.map((p) =>
            String(p.id) === String(produtoEditando.id)
              ? produtoAtualizado
              : p,
          ),
        );
      } else {
        const resposta = await api.post("/api/produtos", dadosBack);
        const produtoCriado = normalizar({
          ...resposta.data,
          fornecedorId:
            resposta.data?.fornecedorId ?? dadosBack.fornecedorId,
        });

        setProdutos((atuais) => [...atuais, produtoCriado]);
      }

      fecharModal();
    } catch (erro) {
      console.error("Erro ao salvar produto:", erro.response?.data ?? erro);
      const mensagens = erro.response?.data?.mensagens;
      alert(
        Array.isArray(mensagens)
          ? mensagens.join("\n")
          : erro.response?.data?.message ??
              "Não foi possível salvar o produto. Verifique os dados e a rota da API.",
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
    } catch (erro) {
      console.error("Erro ao excluir produto:", erro.response?.data ?? erro);
      alert(
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
          <p className="text-secondary">Gerencie os produtos do seu estoque</p>
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
            onChange={(e) => setNome(e.target.value)}
            valor={nome}
            texto="Nome do Produto"
            type="text"
          />
          <Select
            texto="Categoria"
            valor={categoria}
            onChange={(e) => setCategoria(e.target.value)}
            opcoes={categoriasProduto}
            placeholder="Escolha a categoria"
          />
          <Input
            onChange={(e) => setQuantidade(e.target.value)}
            valor={quantidade}
            texto="Quantidade"
            type="number"
          />
          <Input
            onChange={(e) => setQtdMinima(e.target.value)}
            valor={qtdMinima}
            texto="Qtd. Mínima"
            type="number"
          />
          <Input
            onChange={(e) => setPreco(e.target.value)}
            valor={preco}
            texto="Preço Unitário (R$)"
            type="number"
          />
          <Select
            texto="Fornecedor"
            valor={fornecedorId}
            onChange={(e) => setFornecedorId(e.target.value)}
            opcoes={fornecedores.map((f) => ({
              valor: f.id,
              rotulo: nomeFornecedor(f),
            }))}
            placeholder="Escolha o fornecedor"
          />

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